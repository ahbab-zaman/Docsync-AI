"use server";

import {
  getMockNotifications,
  getMockUnreadCount,
  getMockActivity,
  markMockNotificationRead,
  markAllMockNotificationsRead,
} from "@/data/mock-notifications";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import type { Notification, ActivityEvent } from "@/types/notifications";

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getNotifications" },
    async () => {
      const notifications = getMockNotifications();
      logger.info("Notifications loaded", {
        action: "getNotifications",
        status: "success",
      });
      return { notifications };
    }
  );
}

export async function getActivity(): Promise<{ activity: ActivityEvent[] }> {
  const activity = getMockActivity();
  return { activity };
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getUnreadCount" },
    async () => {
      const count = getMockUnreadCount();
      return { count };
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
        const result = markMockNotificationRead(notificationId);
        if (!result) {
          logger.warn("Notification not found", { action: "markAsRead", status: "failure" });
          return { error: "Notification not found." };
        }
        logger.info("Notification marked read", { action: "markAsRead", status: "success" });
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
        markAllMockNotificationsRead();
        logger.info("All notifications marked read", { action: "markAllAsRead", status: "success" });
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
