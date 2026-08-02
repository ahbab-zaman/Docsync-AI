"use server";

import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import type { Notification, ActivityEvent } from "@/types/notifications";

interface NotificationRow extends Notification {
  created_by_name: string;
}

interface ActivityRow extends ActivityEvent {
  workspace_name: string;
}

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getNotifications" },
    async () => {
      const currentUserId = await getDevUserId();
      const result = await query<NotificationRow>(
        `SELECT n.*, COALESCE(u.name, '') AS created_by_name
         FROM notifications n
         LEFT JOIN users u ON u.id = n.created_by
         WHERE n.user_id = $1
         ORDER BY n.created_at DESC
         LIMIT 100`,
        [currentUserId]
      );

      const notifications: Notification[] = result.rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        workspace_id: row.workspace_id,
        created_by: row.created_by,
        created_by_name: row.created_by_name,
        read: row.read,
        created_at: row.created_at,
      }));

      logger.info("Notifications loaded", {
        action: "getNotifications",
        userId: currentUserId,
        status: "success",
      });

      return { notifications };
    }
  );
}

export async function getActivity(): Promise<{ activity: ActivityEvent[] }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getActivity" },
    async () => {
      const currentUserId = await getDevUserId();
      const result = await query<ActivityRow>(
        `SELECT a.*, COALESCE(u.name, '') AS created_by_name,
                COALESCE(w.name, '') AS workspace_name
         FROM activity_events a
         LEFT JOIN users u ON u.id = a.created_by
         LEFT JOIN workspaces w ON w.id = a.workspace_id
         WHERE a.workspace_id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $1
         )
         ORDER BY a.created_at DESC
         LIMIT 100`,
        [currentUserId]
      );

      const activity: ActivityEvent[] = result.rows.map((row) => ({
        id: row.id,
        type: row.type,
        description: row.description,
        workspace_id: row.workspace_id,
        workspace_name: row.workspace_name,
        created_by: row.created_by,
        created_by_name: row.created_by_name,
        created_at: row.created_at,
      }));

      logger.info("Activity loaded", {
        action: "getActivity",
        userId: currentUserId,
        status: "success",
      });

      return { activity };
    }
  );
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getUnreadCount" },
    async () => {
      const currentUserId = await getDevUserId();
      const result = await query<{ count: string }>(
        "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = FALSE",
        [currentUserId]
      );
      return { count: parseInt(result.rows[0].count) };
    }
  );
}

export async function markAsRead(
  notificationId: string
): Promise<{ success?: boolean; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "markAsRead" },
    async () => {
      try {
        const currentUserId = await getDevUserId();
        const result = await query(
          "UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id",
          [notificationId, currentUserId]
        );
        if (result.rows.length === 0) {
          logger.warn("Notification not found", { action: "markAsRead", status: "failure" });
          return { error: "Notification not found." };
        }
        logger.info("Notification marked read", {
          action: "markAsRead",
          userId: currentUserId,
          status: "success",
        });
        return { success: true };
      } catch (error) {
        logger.error("Failed to mark notification as read", {
          action: "markAsRead",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to mark notification as read." };
      }
    }
  );
}

export async function markAllAsRead(): Promise<{ success?: boolean; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "markAllAsRead" },
    async () => {
      try {
        const currentUserId = await getDevUserId();
        await query(
          "UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE",
          [currentUserId]
        );
        logger.info("All notifications marked read", {
          action: "markAllAsRead",
          userId: currentUserId,
          status: "success",
        });
        return { success: true };
      } catch (error) {
        logger.error("Failed to mark all notifications as read", {
          action: "markAllAsRead",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to mark all notifications as read." };
      }
    }
  );
}
