import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const IGNORED_DIRECTORIES = new Set([".git", ".next", ".npm-cache", ".turbo", ".vercel", "__pycache__", "build", "coverage", "dist", "node_modules", "out"]);
const BLOCKED_FILES = new Set([".env", ".env.local", "credentials.json", "id_rsa", "id_ed25519"]);
const payload = z.object({ name: z.string().min(1).max(100), description: z.string().max(4000).optional(), branch: z.string().max(100), visibility: z.enum(["public", "private"]), files: z.array(z.object({ name: z.string().max(300), type: z.string().max(160), size: z.number().nonnegative() })).transform((files) => files.filter((file) => { const parts = file.name.split(/[\\/]/); return !parts.some((part) => IGNORED_DIRECTORIES.has(part.toLowerCase()) || BLOCKED_FILES.has(part.toLowerCase())); }).slice(0, 250)) });
const buildFallbackReadme = (data: { name: string; description?: string; files: Array<{ name: string }> }) => `# ${data.name}\n\n${data.description || "A project published with Launchfolio."}\n\n## Files\n${data.files.map((file) => `- \`${file.name}\``).join("\n") || "- Add project files to document this work."}\n\n## Installation\nAdd installation steps for your project here.\n\n## Usage\nDescribe how to use the project.\n\n## Environment variables\nDocument required variables without including secret values.\n\n## Future improvements\n- Add planned enhancements\n\n## Author\nCreated with Launchfolio.`;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = payload.parse(await request.json());
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const contents = `Write a professional README.md in Markdown. Do not invent commands or facts. Include: title, description, features, technologies, installation, usage, environment variables, screenshots, future improvements, and author.\n\nProject: ${data.name}\nDescription: ${data.description || "Not provided"}\nFiles: ${data.files.map((file) => file.name).join(", ") || "No files provided"}`;
        let response!: Awaited<ReturnType<typeof ai.models.generateContent>>;
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            response = await ai.models.generateContent({ model: "gemini-3.6-flash", contents });
            break;
          } catch (error) {
            if (attempt === 1 || !(error instanceof Error) || !error.message.includes("503")) throw error;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        return Response.json({ readme: response.text });
      } catch {
        return Response.json({ readme: buildFallbackReadme(data), warning: "Gemini is temporarily unavailable, so a basic README was generated." });
      }
    }
    return Response.json({ readme: buildFallbackReadme(data) });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid README request." }, { status: 400 });
    return Response.json({ error: error instanceof Error ? error.message : "Gemini could not generate the README." }, { status: 502 });
  }
}
