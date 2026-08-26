# Launchfolio architecture

## Design
Launchfolio is a Next.js App Router application deployed to Vercel. Pages use Server Components where possible and short-lived Node.js Route Handlers for OAuth, uploads, README generation, and GitHub publishing. It has no persistent server and does not write user files to the deployment filesystem.

## Services
- **Next.js / Vercel:** UI and serverless endpoints.
- **Neon PostgreSQL + Drizzle:** user, project, file metadata, repository, job, and documentation records.
- **Vercel Blob:** project bytes; Neon stores only a Blob URL, hash, type, and size.
- **GitHub OAuth / REST API:** Auth.js obtains a server-only OAuth token. `POST /api/publish` creates a repository then serially writes files using the Contents API.
- **OpenAI Responses API:** `POST /api/readme` receives a bounded, sanitized file manifest and optional extracted text—not secret files—and returns editable Markdown.

## OAuth and publishing
The GitHub OAuth callback is handled by Auth.js. OAuth client secrets, database URLs, blob tokens, and OpenAI keys remain in Vercel environment variables and are never prefixed with `NEXT_PUBLIC_`. The `repo` scope enables user-selected private repositories. In production, encrypt provider tokens at rest if a database adapter persists them; rotate and revoke them on disconnect.

A publish request validates ownership, visibility, branch, paths, byte limits, and an idempotency key. It creates a `publishing_jobs` record, runs small jobs inline, and uses an external queue (Vercel Workflow/Queue provider) for large projects. Progress is stored in Neon and the client polls it. File operations are deliberately serial because concurrent Contents API updates can conflict.

## README pipeline
1. Validate files and reject secrets, executables, oversized archives, and traversal paths.
2. Store file bytes privately in Blob and metadata in Neon.
3. Extract only approved text previews (with per-file and total-character caps); use metadata for binary files.
4. Send bounded context to the model, save the generated document, then let the user edit it.
5. Include the approved README as `README.md` in the publishing job.

## Deploy
1. Create Neon and Vercel Blob projects, then add the `.env.example` keys in Vercel.
2. Configure GitHub OAuth callback: `https://YOUR_DOMAIN/api/auth/callback/github`.
3. Run `npm install`, `npm run db:generate`, and apply the generated migration to Neon.
4. Deploy with Vercel. Configure an external durable queue before enabling large project publishing.
