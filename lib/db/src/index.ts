import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema/index.js";

// Query helpers are re-exported here so the whole server graph consumes
// drizzle-orm through @workspace/db only (see MIGRATION_RUNBOOK.md §10).
export { asc, desc, eq, gt, sql } from "drizzle-orm";
