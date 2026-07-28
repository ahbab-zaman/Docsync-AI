"use client";

import { Activity, UserPlus, UserMinus, ShieldCheck, FileEdit, Share2, UserCheck, FolderPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types/notifications";

interface ActivityListProps {
  activity: ActivityEvent[];
}

const typeIcons: Record<ActivityEvent["type"], React.ElementType> = {
  member_joined: UserPlus,
  member_left: UserMinus,
  role_changed: ShieldCheck,
  document_updated: FileEdit,
  document_shared: Share2,
  invite_accepted: UserCheck,
  project_created: FolderPlus,
  workspace_updated: Settings,
};

export default function ActivityList({ activity }: ActivityListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Activity</h2>
      </div>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <Activity className="h-8 w-8 text-text-muted mb-2" />
          <p className="text-sm font-medium text-foreground">No activity yet</p>
          <p className="text-xs text-text-muted mt-1">
            Activity from your workspaces will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {activity.map((event) => {
            const Icon = typeIcons[event.type];
            return (
              <div key={event.id} className="flex items-start gap-3 p-4 bg-surface">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface-tertiary text-text-muted">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-text-secondary">{event.created_by_name}</span>
                    <span className="text-xs text-text-muted">&middot;</span>
                    <span className="text-xs text-text-muted">{event.workspace_name}</span>
                    <span className="text-xs text-text-muted">&middot;</span>
                    <span className="text-xs text-text-muted">
                      {new Date(event.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
