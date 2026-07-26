import { query } from "@/server/db";
import type { Workspace, WorkspaceMember } from "@/types";

export async function createWorkspace(
  name: string,
  slug: string,
  ownerId: string,
  description?: string
): Promise<Workspace> {
  const result = await query<Workspace>(
    `INSERT INTO workspaces (name, slug, description, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, slug, description ?? null, ownerId]
  );
  return result.rows[0];
}

export async function findWorkspaceById(id: string): Promise<Workspace | null> {
  const result = await query<Workspace>(
    "SELECT * FROM workspaces WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findWorkspacesByUserId(userId: string): Promise<Workspace[]> {
  const result = await query<Workspace>(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE wm.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function addMember(
  workspaceId: string,
  userId: string,
  role: WorkspaceMember["role"] = "member"
): Promise<void> {
  await query(
    `INSERT INTO workspace_members (workspace_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (workspace_id, user_id) DO NOTHING`,
    [workspaceId, userId, role]
  );
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await query(
    "DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND role != 'owner'",
    [workspaceId, userId]
  );
}

export async function getMembers(workspaceId: string): Promise<(WorkspaceMember & { name: string; email: string })[]> {
  const result = await query<WorkspaceMember & { name: string; email: string }>(
    `SELECT wm.*, u.name, u.email
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
     ORDER BY wm.joined_at`,
    [workspaceId]
  );
  return result.rows;
}
