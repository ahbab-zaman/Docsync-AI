import { query } from "@/lib/db";

export interface Session {
  id: string;
  user_id: string;
  created_at: Date;
  expires_at: Date;
}

export async function createSession(
  id: string,
  userId: string,
  expiresAt: Date
): Promise<Session> {
  const result = await query<Session>(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, userId, expiresAt]
  );
  return result.rows[0];
}

export async function findSessionById(id: string): Promise<Session | null> {
  const result = await query<Session>(
    "SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function deleteSessionById(id: string): Promise<void> {
  await query("DELETE FROM sessions WHERE id = $1", [id]);
}
