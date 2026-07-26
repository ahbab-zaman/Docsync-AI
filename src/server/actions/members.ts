"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar_url: string | null;
}

interface PendingInvite {
  id: string;
  email: string;
  role: "admin" | "member";
  invited_by: string;
  invited_at: Date;
}

const inviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});

export async function getMembers(
  workspaceId: string
): Promise<{ members: Member[]; pendingInvites: PendingInvite[] }> {
    const memberResult = await query<Member>(
    `SELECT u.id, u.name, u.email, u.avatar_url, wm.role
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
     ORDER BY wm.joined_at`,
    [workspaceId]
  );

  // Pending invites table doesn't exist yet, return empty
  return { members: memberResult.rows, pendingInvites: [] };
}

export async function inviteMember(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const data = inviteSchema.parse({
      workspaceId: formData.get("workspaceId"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

    const userResult = await query(
      "SELECT id FROM users WHERE email = $1",
      [data.email]
    );

    if (userResult.rows.length === 0) {
      return { error: "User with this email not found." };
    }

    const userId = userResult.rows[0].id;

    await query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = $3`,
      [data.workspaceId, userId, data.role]
    );

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to invite member." };
  }
}

export async function acceptInvite(
  _workspaceId: string,
  _inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  return { error: "Not implemented" };
}

export async function cancelInvite(
  _workspaceId: string,
  _inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  return { error: "Not implemented" };
}

export async function changeRole(
  workspaceId: string,
  userId: string,
  role: "admin" | "member"
): Promise<{ success?: boolean; error?: string }> {
  try {
    await query(
      "UPDATE workspace_members SET role = $1 WHERE workspace_id = $2 AND user_id = $3 AND role != 'owner'",
      [role, workspaceId, userId]
    );
    return { success: true };
  } catch {
    return { error: "Failed to change role." };
  }
}

export async function removeMember(
  workspaceId: string,
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await query(
      "DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND role != 'owner'",
      [workspaceId, userId]
    );
    return { success: true };
  } catch {
    return { error: "Failed to remove member." };
  }
}
