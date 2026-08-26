import { put } from "@vercel/blob";
import { validateUpload } from "@/lib/security";
export const runtime = "nodejs";
export async function POST(request: Request) { try { const form = await request.formData(); const file = form.get("file"); if (!(file instanceof File)) return Response.json({ error: "A file is required." }, { status: 400 }); validateUpload(file); const blob = await put(`projects/${crypto.randomUUID()}-${file.name}`, file, { access: "private", addRandomSuffix: false }); return Response.json({ url: blob.url, pathname: blob.pathname, size: file.size, contentType: file.type }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 }); } }
