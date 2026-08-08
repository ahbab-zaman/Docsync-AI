import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

async function migrate() {
  const rawUrl = process.env.DATABASE_URL ?? "";
  const url = new URL(rawUrl);
  url.searchParams.delete("channel_binding");

  const pool = new Pool({
    connectionString: url.toString(),
  });

  const schemaPath = join(process.cwd(), "src", "server", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  try {
    await pool.query(schema);

    const existing = await pool.query("SELECT id FROM users WHERE email = 'dev@docsync.dev'");
    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ('dev@docsync.dev', 'Dev User', 'dev-hash')
         ON CONFLICT (email) DO NOTHING`
      );
      console.log("[Migrate] Dev user created");
    }

    console.log("[Migrate] Schema applied successfully");
  } catch (error) {
    console.error("[Migrate] Failed to apply schema:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
