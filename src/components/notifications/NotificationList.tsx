"use client";

import { useState } from "react";
import { Bell, UserPlus, UserMinus, ShieldCheck, FileEdit, Share2, UserCheck, FolderPlus, Settings } from "lucide-react";
import { markAsRead, markAllAsRead } from "@/server/actions/notifications";
import { cn } from "@/lib/utils";
import type { Notification as NotificationType } from "@/types/notifications";

interface NotificationListProps {
  initialNotifications: NotificationType[];
}

const typeIcons: Record<NotificationType["type"], React.ElementType> = {
  member_joined: UserPlus,
  member_left: UserMinus,
  role_changed: ShieldCheck,
  document_updated: FileEdit,
  document_shared: Share2,
  invite_accepted: UserCheck,
  project_created: FolderPlus,
  workspace_updated: Settings,
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
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-sm font-normal text-text-muted">({unreadCount} unread)</span>
          )}
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
          <Bell className="h-8 w-8 text-text-muted mb-2" />
          <p className="text-sm font-medium text-foreground">No notifications yet</p>
          <p className="text-xs text-text-muted mt-1">
            You will see notifications here when something happens in your workspaces.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type];
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors",
                  !notif.read ? "bg-surface-secondary" : "bg-surface"
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full",
                  !notif.read ? "bg-accent/10 text-accent" : "bg-surface-tertiary text-text-muted"
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground"
                      )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
