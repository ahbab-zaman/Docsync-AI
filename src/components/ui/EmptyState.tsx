import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactElement | string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center", className)}>
      {icon && typeof icon === "string" ? (
        <span className="text-2xl mb-2" aria-hidden="true">{icon}</span>
      ) : icon ? (
        <div className="mb-2 text-text-muted" aria-hidden="true">{icon}</div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-text-muted mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
