"use client";

import type { ActivityEvent } from "@/types/notifications";

interface ActivityListProps {
  activity: ActivityEvent[];
}

const typeIcons: Record<ActivityEvent["type"], string> = {
  member_joined: "→",
  member_left: "←",
  role_changed: "⚙",
  document_updated: "✎",
  document_shared: "⇄",
  invite_accepted: "✓",
  project_created: "⊕",
  workspace_updated: "◈",
};

export default function ActivityList({ activity }: ActivityListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Activity</h2>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <span className="text-2xl mb-2">📋</span>
          <p className="text-sm font-medium text-foreground">No activity yet</p>
          <p className="text-xs text-text-muted mt-1">
            Activity from your workspaces will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {activity.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-4 bg-surface">
              <span className="mt-0.5 text-sm text-text-muted" title={event.type.replace(/_/g, " ")}>
                {typeIcons[event.type]}
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
          ))}
        </div>
      )}
    </div>
  );
}
