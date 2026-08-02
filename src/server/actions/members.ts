"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { invalidateCache, CACHE_KEYS } from "@/lib/cache";
import {
  createActivityEvent,
  createNotification,
  notifyWorkspaceAdmins,
} from "@/lib/notifications";

export type MemberRole = "owner" | "admin" | "member";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar_url: string | null;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: "admin" | "member";
  invited_by: string;
  invited_at: Date;
}

interface MemberRow {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: MemberRole;
}

interface InviteRow {
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
  const memberResult = await query<MemberRow>(
    `SELECT u.id, u.name, u.email, u.avatar_url, wm.role
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
     ORDER BY wm.joined_at`,
    [workspaceId]
  );

  const inviteResult = await query<InviteRow>(
    "SELECT id, email, role, invited_by, created_at AS invited_at FROM workspace_invites WHERE workspace_id = $1 ORDER BY created_at",
    [workspaceId]
  );

  return { members: memberResult.rows, pendingInvites: inviteResult.rows };
}

export async function inviteMember(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const currentUserId = await getDevUserId();
    const data = inviteSchema.parse({
      workspaceId: formData.get("workspaceId"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

    const userResult = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [data.email]
    );

    if (userResult.rows.length > 0) {
      const existingMember = await query(
        "SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2",
        [data.workspaceId, userResult.rows[0].id]
      );
      if (existingMember.rows.length > 0) {
        return { error: "This user is already a member of the workspace." };
      }
    }

    await query(
      `INSERT INTO workspace_invites (workspace_id, email, role, invited_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (workspace_id, email)
       DO UPDATE SET role = $3, invited_by = $4, created_at = NOW()`,
      [data.workspaceId, data.email, data.role, currentUserId]
    );

    if (userResult.rows.length > 0) {
      await createNotification({
        userId: userResult.rows[0].id,
        type: "invite_accepted",
        title: "You were invited to a workspace",
        description: `You were invited to join a workspace.`,
        workspaceId: data.workspaceId,
        createdBy: currentUserId,
      });
    }

    logger.info("Member invited", {
      action: "inviteMember",
      userId: currentUserId,
      workspaceId: data.workspaceId,
      status: "success",
    });

    await invalidateCache(CACHE_KEYS.workspace(data.workspaceId));

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Invite validation failed", { action: "inviteMember", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to invite member", {
        action: "inviteMember",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to invite member." };
  }
}

export async function acceptInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const currentUserId = await getDevUserId();
    const inviteResult = await query<InviteRow>(
      "SELECT id, email, role, invited_by FROM workspace_invites WHERE id = $1 AND workspace_id = $2",
      [inviteId, workspaceId]
    );

    if (inviteResult.rows.length === 0) {
      return { error: "Invite not found." };
    }

    const invite = inviteResult.rows[0];
    const userResult = await query<{ id: string; name: string }>(
      "SELECT id, name FROM users WHERE email = $1",
      [invite.email]
    );

    if (userResult.rows.length === 0) {
      return { error: "The invited user has not registered yet." };
    }

    const userId = userResult.rows[0].id;

    await query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = $3`,
      [workspaceId, userId, invite.role]
    );

    await query("DELETE FROM workspace_invites WHERE id = $1", [inviteId]);

    await Promise.all([
      notifyWorkspaceAdmins({
        workspaceId,
        type: "invite_accepted",
        title: "Invite accepted",
        description: `${userResult.rows[0].name} accepted the invite and joined the workspace.`,
        createdBy: currentUserId,
        excludeUserId: currentUserId,
      }),
      createActivityEvent({
        type: "invite_accepted",
        description: `${userResult.rows[0].name} joined the workspace.`,
        workspaceId,
        createdBy: currentUserId,
      }),
    ]);

    logger.info("Invite accepted", {
      action: "acceptInvite",
      userId: currentUserId,
      workspaceId,
      status: "success",
    });

    await invalidateCache(CACHE_KEYS.workspace(workspaceId));

    return { success: true };
  } catch (error) {
    logger.error("Failed to accept invite", {
      action: "acceptInvite",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
    return { error: "Failed to accept invite." };
  }
}

export async function cancelInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = await query(
      "DELETE FROM workspace_invites WHERE id = $1 AND workspace_id = $2 RETURNING id",
      [inviteId, workspaceId]
    );

    if (result.rows.length === 0) {
      return { error: "Invite not found." };
    }

    logger.info("Invite cancelled", {
      action: "cancelInvite",
      workspaceId,
      status: "success",
    });

    await invalidateCache(CACHE_KEYS.workspace(workspaceId));

    return { success: true };
  } catch (error) {
    logger.error("Failed to cancel invite", {
      action: "cancelInvite",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
    return { error: "Failed to cancel invite." };
  }
}

export async function changeRole(
  workspaceId: string,
  userId: string,
  role: "admin" | "member"
): Promise<{ success?: boolean; error?: string }> {
  try {
    const currentUserId = await getDevUserId();
    await query(
      "UPDATE workspace_members SET role = $1 WHERE workspace_id = $2 AND user_id = $3 AND role != 'owner'",
      [role, workspaceId, userId]
    );

    if (userId !== currentUserId) {
      await createNotification({
        userId,
        type: "role_changed",
        title: "Your role changed",
        description: `Your role in this workspace was changed to ${role}.`,
        workspaceId,
        createdBy: currentUserId,
      });
    }

    logger.info("Member role changed", {
      action: "changeRole",
      workspaceId,
      status: "success",
    });

    await invalidateCache(CACHE_KEYS.workspace(workspaceId));
    return { success: true };
  } catch (error) {
    logger.error("Failed to change role", {
      action: "changeRole",
      workspaceId,
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
    return { error: "Failed to change role." };
  }
}

export async function removeMember(
  workspaceId: string,
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const currentUserId = await getDevUserId();

    const memberResult = await query<{ name: string }>(
      "SELECT u.name FROM workspace_members wm JOIN users u ON u.id = wm.user_id WHERE wm.workspace_id = $1 AND wm.user_id = $2",
      [workspaceId, userId]
    );

    await query(
      "DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND role != 'owner'",
      [workspaceId, userId]
    );

    if (memberResult.rows.length > 0) {
      await createActivityEvent({
        type: "member_left",
        description: `${memberResult.rows[0].name} was removed from the workspace.`,
        workspaceId,
        createdBy: currentUserId,
      });
    }

    logger.info("Member removed", {
      action: "removeMember",
      workspaceId,
      status: "success",
    });

    await invalidateCache(CACHE_KEYS.workspace(workspaceId));
    return { success: true };
  } catch (error) {
    logger.error("Failed to remove member", {
      action: "removeMember",
      workspaceId,
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
    return { error: "Failed to remove member." };
  }
}
