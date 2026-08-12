import { config as loadEnv } from "dotenv";
import { join } from "path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

loadEnv({ path: join(process.cwd(), ".env.local") });

const SALT_ROUNDS = 12;

const OWNER_EMAIL = "ahbab@ai.com";
const OWNER_PASSWORD = "Ahbab123@";
const OWNER_NAME = "Ahbab";

const ADMIN_EMAIL = "ahbab@admin.com";
const ADMIN_PASSWORD = "Ahbab123@";
const ADMIN_NAME = "Ahbab Admin";

const WORKSPACE_NAME = "AI Workspace";

async function seed() {
  const rawUrl = process.env.DATABASE_URL ?? "";
  const url = new URL(rawUrl);
  url.searchParams.delete("channel_binding");

  const pool = new Pool({
    connectionString: url.toString(),
  });

  try {
    const ownerHash = await bcrypt.hash(OWNER_PASSWORD, SALT_ROUNDS);
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    const ownerResult = await pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
       RETURNING id, email`,
      [OWNER_EMAIL, OWNER_NAME, ownerHash]
    );

    const adminResult = await pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
       RETURNING id, email`,
      [ADMIN_EMAIL, ADMIN_NAME, adminHash]
    );

    const ownerId = ownerResult.rows[0].id as string;
    const adminId = adminResult.rows[0].id as string;

    const workspaceResult = await pool.query(
      `INSERT INTO workspaces (name, slug, description, owner_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET owner_id = EXCLUDED.owner_id
       RETURNING id, name, slug`,
      [WORKSPACE_NAME, "ai-workspace", "Seeded AI collaboration workspace.", ownerId]
    );

    const workspaceId = workspaceResult.rows[0].id as string;

    await pool.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, 'owner')
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = 'owner'`,
      [workspaceId, ownerId]
    );

    await pool.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = 'admin'`,
      [workspaceId, adminId]
    );

    console.log("[Seed] Owner created:", OWNER_EMAIL);
    console.log("[Seed] Admin created:", ADMIN_EMAIL);
    console.log("[Seed] Workspace:", WORKSPACE_NAME, `(${workspaceId})`);
    console.log("[Seed] Owner role: owner, Admin role: admin");
  } catch (error) {
    console.error("[Seed] Failed to seed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
