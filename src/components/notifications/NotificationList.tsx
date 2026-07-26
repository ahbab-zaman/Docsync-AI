"use client";

import { useState } from "react";
import type { Notification as NotificationType } from "@/types/notifications";
import { markAsRead, markAllAsRead } from "@/server/actions/notifications";

interface NotificationListProps {
  initialNotifications: NotificationType[];
}

const typeIcons: Record<NotificationType["type"], string> = {
  member_joined: "→",
  member_left: "←",
  role_changed: "⚙",
  document_updated: "✎",
  document_shared: "⇄",
  invite_accepted: "✓",
  project_created: "⊕",
  workspace_updated: "◈",
};

export default function NotificationList({ initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    const result = await markAsRead(id);
    if (result.success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({unreadCount} unread)
              </span>
            )}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-sm text-accent hover:text-accent-dark transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <span className="text-2xl mb-2">🔔</span>
          <p className="text-sm font-medium text-foreground">No notifications yet</p>
          <p className="text-xs text-text-muted mt-1">
            You will see notifications here when something happens in your workspaces.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-4 transition-colors ${
                !notif.read ? "bg-surface-secondary" : "bg-surface"
              }`}
            >
              <span className="mt-0.5 text-sm text-text-muted" title={notif.type.replace(/_/g, " ")}>
                {typeIcons[notif.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${
                      !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground"
                    }`}
                  >
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notif.id)}
                      className="shrink-0 text-xs text-accent hover:text-accent-dark transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{notif.description}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(notif.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
