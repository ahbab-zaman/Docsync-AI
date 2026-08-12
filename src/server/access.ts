import { getCurrentUser } from "@/server/auth";
import { query } from "@/lib/db";
import type { WorkspaceMemberRole } from "@/types";

export type WorkspaceRole = WorkspaceMemberRole;

export interface CurrentUserInfo {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function getWorkspaceRole(
  workspaceId: string,
  userId: string
): Promise<WorkspaceRole | null> {
  const result = await query<{ role: WorkspaceRole }>(
    "SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2",
    [workspaceId, userId]
  );
  return result.rows[0]?.role ?? null;
}

export async function canManageWorkspaceMembers(
  userId: string
): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM workspace_members
       WHERE user_id = $1 AND role IN ('owner', 'admin')
     ) AS exists`,
    [userId]
  );
  return result.rows[0]?.exists ?? false;
}

export const ANY_MEMBER: WorkspaceRole[] = ["owner", "admin", "member"];
export const ADMIN_ROLES: WorkspaceRole[] = ["owner", "admin"];

export type WorkspaceAccess =
  | { ok: true; userId: string; role: WorkspaceRole }
  | { ok: false; error: string };

export async function requireWorkspaceAccess(
  workspaceId: string,
  allowedRoles: WorkspaceRole[]
): Promise<WorkspaceAccess> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "Please sign in to continue." };
  }
  const role = await getWorkspaceRole(workspaceId, userId);
  if (!role) {
    return { ok: false, error: "You do not have access to this workspace." };
  }
  if (!allowedRoles.includes(role)) {
    return { ok: false, error: "You do not have permission to do this." };
  }
  return { ok: true, userId, role };
}

export async function resolveDocumentWorkspaceId(
  documentId: string
): Promise<string | null> {
  const result = await query<{ workspace_id: string }>(
    `SELECT p.workspace_id FROM projects p
     JOIN documents d ON d.project_id = p.id
     WHERE d.id = $1`,
    [documentId]
  );
  return result.rows[0]?.workspace_id ?? null;
}
