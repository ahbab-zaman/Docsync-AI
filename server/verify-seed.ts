import { config as loadEnv } from "dotenv";
import { join } from "path";
import { Pool } from "pg";

loadEnv({ path: join(process.cwd(), ".env.local") });

async function verify() {
  const rawUrl = process.env.DATABASE_URL ?? "";
  const url = new URL(rawUrl);
  url.searchParams.delete("channel_binding");
  const pool = new Pool({ connectionString: url.toString() });

  try {
    const result = await pool.query(
      `SELECT u.email, wm.role, w.name AS workspace
       FROM users u
       JOIN workspace_members wm ON wm.user_id = u.id
       JOIN workspaces w ON w.id = wm.workspace_id
       WHERE u.email IN ('ahbab@ai.com', 'ahbab@admin.com')
       ORDER BY u.email`
    );
    console.table(result.rows);
  } finally {
    await pool.end();
  }
}

verify();
