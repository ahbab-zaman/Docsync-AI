import { query } from "@/lib/db";
import type { User, UserPublic } from "@/types";

export async function createUser(
  email: string,
  name: string,
  passwordHash: string
): Promise<User> {
  const result = await query<User>(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, name, passwordHash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserPublic | null> {
  const result = await query<User>(
    "SELECT id, email, name, avatar_url, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "name" | "avatar_url">>
): Promise<UserPublic | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.avatar_url !== undefined) {
    fields.push(`avatar_url = $${paramIndex++}`);
    values.push(data.avatar_url);
  }

  if (fields.length === 0) return findUserById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query<User>(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, email, name, avatar_url, created_at`,
    values
  );
  return result.rows[0] ?? null;
}
