import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required");

// HTTP-based Neon queries are safe for short-lived Vercel serverless requests.
export const sql = connectionString ? neon(connectionString) : null;
