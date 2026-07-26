"use server";

import {
  getMockNotifications,
  getMockUnreadCount,
  getMockActivity,
  markMockNotificationRead,
  markAllMockNotificationsRead,
} from "@/data/mock-notifications";
import type { Notification, ActivityEvent } from "@/types/notifications";

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  const notifications = getMockNotifications();
  return { notifications };
}

export async function getActivity(): Promise<{ activity: ActivityEvent[] }> {
  const activity = getMockActivity();
  return { activity };
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const count = getMockUnreadCount();
  return { count };
}

export async function markAsRead(
  notificationId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = markMockNotificationRead(notificationId);
    if (!result) return { error: "Notification not found." };
    return { success: true };
  } catch {
    return { error: "Failed to mark notification as read." };
  }
}

export async function markAllAsRead(): Promise<{ success?: boolean; error?: string }> {
  try {
    markAllMockNotificationsRead();
    return { success: true };
  } catch {
    return { error: "Failed to mark all notifications as read." };
  }
}
