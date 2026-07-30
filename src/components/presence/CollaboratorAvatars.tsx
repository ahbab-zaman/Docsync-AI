"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export interface Collaborator {
  id: string;
  name: string;
  avatar_url: string | null;
  color: string;
  isOnline: boolean;
}

interface CollaboratorAvatarsProps {
  collaborators: Collaborator[];
  max?: number;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
};

export default memo(function CollaboratorAvatars({
  collaborators,
  max = 5,
  size = "md",
}: CollaboratorAvatarsProps) {
  const visible = collaborators.slice(0, max);
  const remaining = collaborators.length - max;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((collaborator) => {
          const initials = collaborator.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={collaborator.id}
              className="relative"
              title={collaborator.name}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full border-2 border-surface font-medium",
                  sizeMap[size]
                )}
                style={{ backgroundColor: collaborator.color + "20", color: collaborator.color }}
              >
                {initials}
              </div>
              {collaborator.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-surface bg-success" />
              )}
            </div>
          );
        })}
        {remaining > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full border-2 border-surface bg-surface-tertiary font-medium text-text-muted",
              sizeMap[size]
            )}
            title={`${remaining} more`}
          >
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
});
