import { query } from "@/lib/db";

let cachedDevUserId: string | null = null;

export async function getDevUserId(): Promise<string> {
  if (cachedDevUserId) return cachedDevUserId;
  const result = await query(
    "SELECT id FROM users WHERE email = 'dev@docsync.dev' LIMIT 1"
  );
  if (result.rows.length === 0) {
    const created = await query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ('dev@docsync.dev', 'Dev User', 'dev-hash')
       RETURNING id`
    );
    cachedDevUserId = created.rows[0].id as string;
    return cachedDevUserId;
  }
  cachedDevUserId = result.rows[0].id as string;
  return cachedDevUserId;
}

export async function getDevUserName(): Promise<string> {
  const id = await getDevUserId();
  const result = await query<{ name: string }>(
    "SELECT name FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0]?.name ?? "Dev User";
}
