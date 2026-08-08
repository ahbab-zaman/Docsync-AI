"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import {
  requireWorkspaceAccess,
  ANY_MEMBER,
  ADMIN_ROLES,
} from "@/server/access";
import { getCurrentUser } from "@/server/auth";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import { invalidateCache, CACHE_KEYS } from "@/lib/cache";
import {
  createActivityEvent,
  createNotification,
  notifyWorkspaceAdmins,
} from "@/lib/notifications";
import { sendInviteEmail } from "@/lib/email";
import {
  generateInviteToken,
  inviteExpiryDate,
  isInviteExpired,
  effectiveInviteStatus,
  buildInviteUrl,
  type InviteStatus,
} from "@/lib/invite-utils";
import { checkRateLimit } from "@/lib/rate-limiter";
import { findUserByEmail } from "@/server/repositories/user";

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
  invited_by_name: string;
  invited_at: Date;
  status: InviteStatus;
  expires_at: Date;
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
  invited_by_name: string;
  invited_at: Date;
  status: InviteStatus;
  expires_at: Date;
}

const inviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});

export async function getMembers(
  workspaceId: string
): Promise<{ members: Member[]; pendingInvites: PendingInvite[] }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getMembers", workspaceId },
    async () => {
      const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
      if (!access.ok) {
        logger.warn("Members access denied", {
          action: "getMembers",
          workspaceId,
          status: "failure",
        });
        return { members: [], pendingInvites: [] };
      }

      await expireStaleInvites();

      const memberResult = await query<MemberRow>(
        `SELECT u.id, u.name, u.email, u.avatar_url, wm.role
         FROM workspace_members wm
         JOIN users u ON u.id = wm.user_id
         WHERE wm.workspace_id = $1
         ORDER BY wm.joined_at`,
        [workspaceId]
      );

      const inviteResult = await query<InviteRow>(
        `SELECT wi.id, wi.email, wi.role, wi.invited_by, wi.created_at AS invited_at,
                wi.status, wi.expires_at,
                COALESCE(u.name, '') AS invited_by_name
         FROM workspace_invites wi
         LEFT JOIN users u ON u.id = wi.invited_by
         WHERE wi.workspace_id = $1
         ORDER BY wi.created_at`,
        [workspaceId]
      );

      const pendingInvites: PendingInvite[] = inviteResult.rows.map((row) => ({
        ...row,
        invited_by_name: row.invited_by_name || "A workspace admin",
        status: effectiveInviteStatus(row.status, row.expires_at),
      }));

      logger.info("Members loaded", {
        action: "getMembers",
        workspaceId,
        status: "success",
      });

      return { members: memberResult.rows, pendingInvites };
    }
  );
}

export async function inviteMember(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean; invite?: PendingInvite }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "inviteMember" },
    async () => {
      try {
        const access = await requireWorkspaceAccess(
          (formData.get("workspaceId") as string) ?? "",
          ADMIN_ROLES
        );
        if (!access.ok) {
          logger.warn("Invite denied: caller lacks admin role", {
            action: "inviteMember",
            status: "failure",
          });
          return { error: access.error };
        }
        const currentUserId = access.userId;

        const limit = checkRateLimit(`invite:${currentUserId}`, {
          maxRequests: 10,
          windowMs: 60_000,
        });
        if (!limit.allowed) {
          logger.warn("Invite rate limited", { action: "inviteMember", status: "failure" });
          return { error: "Too many invites sent. Please try again in a minute." };
        }

        const data = inviteSchema.parse({
          workspaceId: formData.get("workspaceId"),
          email: formData.get("email"),
          role: formData.get("role"),
        });

        const existingMember = await query(
          `SELECT 1 FROM workspace_members wm
           JOIN users u ON u.id = wm.user_id
           WHERE wm.workspace_id = $1 AND u.email = $2`,
          [data.workspaceId, data.email]
        );
        if (existingMember.rows.length > 0) {
          return { error: "This user is already a member of the workspace." };
        }

        const token = generateInviteToken();
        const expiresAt = inviteExpiryDate();

        const inviteResult = await query<{
          id: string;
          email: string;
          role: "admin" | "member";
          invited_by: string;
          invited_at: Date;
          status: InviteStatus;
          expires_at: Date;
        }>(
          `INSERT INTO workspace_invites (workspace_id, email, role, invited_by, token, status, expires_at)
           VALUES ($1, $2, $3, $4, $5, 'pending', $6)
           ON CONFLICT (workspace_id, email)
           DO UPDATE SET role = $3, invited_by = $4, token = $5, status = 'pending',
                         expires_at = $6, accepted_at = NULL, created_at = NOW()
           RETURNING id, email, role, invited_by, created_at AS invited_at, status, expires_at`,
          [data.workspaceId, data.email, data.role, currentUserId, token, expiresAt]
        );

        const workspaceResult = await query<{ name: string }>(
          "SELECT name FROM workspaces WHERE id = $1",
          [data.workspaceId]
        );
        const workspaceName = workspaceResult.rows[0]?.name ?? "your workspace";
        const inviterName = await getInviterName(currentUserId);

        await sendInviteEmail({
          to: data.email,
          inviteUrl: buildInviteUrl(token),
          workspaceName,
          invitedByName: inviterName,
          role: data.role,
          expiresAt,
        });

        const invitedUser = await findUserByEmail(data.email);
        if (invitedUser) {
          await createNotification({
            userId: invitedUser.id,
            type: "invite_accepted",
            title: `You were invited to ${workspaceName}`,
            description: `Check your email to accept the invitation.`,
            workspaceId: data.workspaceId,
            createdBy: currentUserId,
          });
        }

        await createActivityEvent({
          type: "invite_accepted",
          description: `An invitation was sent to ${data.email}.`,
          workspaceId: data.workspaceId,
          createdBy: currentUserId,
        });

        logger.info("Member invited", {
          action: "inviteMember",
          userId: currentUserId,
          workspaceId: data.workspaceId,
          email: data.email,
          status: "success",
        });

        await invalidateCache(CACHE_KEYS.workspace(data.workspaceId));

        const row = inviteResult.rows[0];
        return {
          success: true,
          invite: {
            ...row,
            invited_by_name: inviterName,
          },
        };
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
          return { error: "Unable to send the invitation. Please try again." };
        }
        return { error: "Failed to invite member." };
      }
    }
  );
}

async function getInviterName(userId: string): Promise<string> {
  const result = await query<{ name: string }>(
    "SELECT name FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.name ?? "A workspace admin";
}

export async function getInviteByToken(token: string): Promise<{
  invite?: {
    email: string;
    role: "admin" | "member";
    workspaceId: string;
    workspaceName: string;
    invitedBy: string;
    invitedByName: string;
    status: InviteStatus;
    expiresAt: Date;
    isRegistered: boolean;
  };
  error?: string;
}> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getInviteByToken" },
    async () => {
      const result = await query<{
        email: string;
        role: "admin" | "member";
        workspace_id: string;
        workspace_name: string;
        invited_by: string;
        invited_by_name: string;
        status: InviteStatus;
        expires_at: Date;
      }>(
        `SELECT wi.email, wi.role, wi.workspace_id, w.name AS workspace_name,
                wi.invited_by, COALESCE(u.name, '') AS invited_by_name,
                wi.status, wi.expires_at
         FROM workspace_invites wi
         JOIN workspaces w ON w.id = wi.workspace_id
         LEFT JOIN users u ON u.id = wi.invited_by
         WHERE wi.token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        return { error: "This invitation link is invalid or has expired." };
      }

      const row = result.rows[0];
      const status = effectiveInviteStatus(row.status, row.expires_at);

      const user = await findUserByEmail(row.email);

      return {
        invite: {
          email: row.email,
          role: row.role,
          workspaceId: row.workspace_id,
          workspaceName: row.workspace_name,
          invitedBy: row.invited_by,
          invitedByName: row.invited_by_name || "A workspace admin",
          status,
          expiresAt: row.expires_at,
          isRegistered: Boolean(user),
        },
      };
    }
  );
}

export async function acceptInviteByToken(token: string): Promise<{
  success?: boolean;
  error?: string;
  workspaceId?: string;
}> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "acceptInviteByToken" },
    async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return { error: "Please sign in to accept this invitation." };
        }

        const invite = await findInviteByToken(token);
        if (!invite) {
          return { error: "This invitation link is invalid or has expired." };
        }

        if (isInviteExpired(invite.expires_at)) {
          await query("UPDATE workspace_invites SET status = 'expired' WHERE id = $1", [
            invite.id,
          ]);
          return { error: "This invitation has expired. Please ask for a new one." };
        }

        if (invite.status === "accepted") {
          return { error: "This invitation has already been accepted." };
        }
        if (invite.status === "declined") {
          return { error: "This invitation was declined." };
        }

        if (currentUser.email.toLowerCase() !== invite.email.toLowerCase()) {
          return {
            error: `This invitation was sent to ${invite.email}. Sign in with that account to accept it.`,
          };
        }

        await query(
          `INSERT INTO workspace_members (workspace_id, user_id, role)
           VALUES ($1, $2, $3)
           ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = $3`,
          [invite.workspace_id, currentUser.id, invite.role]
        );

        await query(
          "UPDATE workspace_invites SET status = 'accepted', accepted_at = NOW() WHERE id = $1",
          [invite.id]
        );

        await Promise.all([
          notifyWorkspaceAdmins({
            workspaceId: invite.workspace_id,
            type: "invite_accepted",
            title: "Invite accepted",
            description: `${currentUser.name} accepted the invite and joined the workspace.`,
            createdBy: currentUser.id,
            excludeUserId: currentUser.id,
          }),
          createActivityEvent({
            type: "invite_accepted",
            description: `${currentUser.name} joined the workspace.`,
            workspaceId: invite.workspace_id,
            createdBy: currentUser.id,
          }),
        ]);

        logger.info("Invite accepted by invitee", {
          action: "acceptInviteByToken",
          userId: currentUser.id,
          workspaceId: invite.workspace_id,
          status: "success",
        });

        await invalidateCache(CACHE_KEYS.workspace(invite.workspace_id));

        return { success: true, workspaceId: invite.workspace_id };
      } catch (error) {
        logger.error("Failed to accept invite", {
          action: "acceptInviteByToken",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to accept the invitation." };
      }
    }
  );
}

export async function declineInviteByToken(token: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "declineInviteByToken" },
    async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return { error: "Please sign in to decline this invitation." };
        }

        const invite = await findInviteByToken(token);
        if (!invite) {
          return { error: "This invitation link is invalid or has expired." };
        }

        if (invite.status !== "pending") {
          return { error: "This invitation can no longer be declined." };
        }

        if (currentUser.email.toLowerCase() !== invite.email.toLowerCase()) {
          return {
            error: `This invitation was sent to ${invite.email}. Sign in with that account to respond.`,
          };
        }

        await query("UPDATE workspace_invites SET status = 'declined' WHERE id = $1", [
          invite.id,
        ]);

        logger.info("Invite declined", {
          action: "declineInviteByToken",
          userId: currentUser.id,
          workspaceId: invite.workspace_id,
          status: "success",
        });

        return { success: true };
      } catch (error) {
        logger.error("Failed to decline invite", {
          action: "declineInviteByToken",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to decline the invitation." };
      }
    }
  );
}

export async function resendInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "resendInvite", workspaceId },
    async () => {
      try {
        const access = await requireWorkspaceAccess(workspaceId, ADMIN_ROLES);
        if (!access.ok) {
          logger.warn("Invite resend denied", {
            action: "resendInvite",
            workspaceId,
            status: "failure",
          });
          return { error: access.error };
        }
        const currentUserId = access.userId;

        const inviteResult = await query<{
          id: string;
          email: string;
          role: "admin" | "member";
        }>("SELECT id, email, role FROM workspace_invites WHERE id = $1 AND workspace_id = $2", [
          inviteId,
          workspaceId,
        ]);

        if (inviteResult.rows.length === 0) {
          return { error: "Invite not found." };
        }

        const invite = inviteResult.rows[0];
        const token = generateInviteToken();
        const expiresAt = inviteExpiryDate();

        await query(
          "UPDATE workspace_invites SET token = $1, expires_at = $2, status = 'pending', accepted_at = NULL WHERE id = $3",
          [token, expiresAt, invite.id]
        );

        const workspaceResult = await query<{ name: string }>(
          "SELECT name FROM workspaces WHERE id = $1",
          [workspaceId]
        );
        const workspaceName = workspaceResult.rows[0]?.name ?? "your workspace";
        const inviterName = await getInviterName(currentUserId);

        await sendInviteEmail({
          to: invite.email,
          inviteUrl: buildInviteUrl(token),
          workspaceName,
          invitedByName: inviterName,
          role: invite.role,
          expiresAt,
        });

        logger.info("Invite resent", {
          action: "resendInvite",
          userId: currentUserId,
          workspaceId,
          inviteId,
          status: "success",
        });

        await invalidateCache(CACHE_KEYS.workspace(workspaceId));
        return { success: true };
      } catch (error) {
        logger.error("Failed to resend invite", {
          action: "resendInvite",
          workspaceId,
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to resend the invitation." };
      }
    }
  );
}

async function findInviteByToken(token: string): Promise<{
  id: string;
  email: string;
  role: "admin" | "member";
  workspace_id: string;
  status: InviteStatus;
  expires_at: Date;
} | null> {
  const result = await query<{
    id: string;
    email: string;
    role: "admin" | "member";
    workspace_id: string;
    status: InviteStatus;
    expires_at: Date;
  }>("SELECT id, email, role, workspace_id, status, expires_at FROM workspace_invites WHERE token = $1", [
    token,
  ]);
  return result.rows[0] ?? null;
}

export async function cancelInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const access = await requireWorkspaceAccess(workspaceId, ADMIN_ROLES);
    if (!access.ok) {
      logger.warn("Invite cancel denied", {
        action: "cancelInvite",
        workspaceId,
        status: "failure",
      });
      return { error: access.error };
    }

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
      workspaceId,
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
    const access = await requireWorkspaceAccess(workspaceId, ADMIN_ROLES);
    if (!access.ok) {
      logger.warn("Role change denied", {
        action: "changeRole",
        workspaceId,
        status: "failure",
      });
      return { error: access.error };
    }
    const currentUserId = access.userId;
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
    const access = await requireWorkspaceAccess(workspaceId, ADMIN_ROLES);
    if (!access.ok) {
      logger.warn("Member removal denied", {
        action: "removeMember",
        workspaceId,
        status: "failure",
      });
      return { error: access.error };
    }
    const currentUserId = access.userId;

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

export async function expireStaleInvites(): Promise<void> {
  try {
    const result = await query(
      "UPDATE workspace_invites SET status = 'expired' WHERE status = 'pending' AND expires_at < NOW()"
    );
    const expiredCount = result.rowCount ?? 0;
    if (expiredCount > 0) {
      logger.info("Expired stale invites", {
        action: "expireStaleInvites",
        status: "success",
        count: expiredCount,
      });
    }
  } catch (error) {
    logger.warn("Failed to expire stale invites", {
      action: "expireStaleInvites",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
  }
}
