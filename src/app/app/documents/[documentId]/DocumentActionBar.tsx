"use client";

import {
  Save,
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightOpen,
  PanelRightClose,
  MessageSquare,
  MessageSquareText,
  History,
} from "lucide-react";
import CollaboratorAvatars, {
  type Collaborator,
} from "@/components/presence/CollaboratorAvatars";
import { cn } from "@/lib/utils";

export type EditorPanel = "ai" | "comments" | "version" | null;

interface DocumentActionBarProps {
  saving: boolean;
  saved: boolean;
  outlineOpen: boolean;
  onToggleOutline: () => void;
  rightPanel: EditorPanel;
  onTogglePanel: (panel: Exclude<EditorPanel, null>) => void;
  collaborators: Collaborator[];
  onlineCount: number;
  unresolvedCount: number;
  onManualSave: () => void;
}

export default function DocumentActionBar({
  saving,
  saved,
  outlineOpen,
  onToggleOutline,
  rightPanel,
  onTogglePanel,
  collaborators,
  onlineCount,
  unresolvedCount,
  onManualSave,
}: DocumentActionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 mb-3 gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onToggleOutline}
          className="flex items-center justify-center h-8 w-8 rounded-md text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          title={outlineOpen ? "Close outline" : "Open outline"}
          aria-label={outlineOpen ? "Close outline" : "Open outline"}
          aria-expanded={outlineOpen}
        >
          {outlineOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={cn(
              "text-xs font-medium",
              saving ? "text-text-muted" : saved ? "text-success" : "text-highlight"
            )}
            role="status"
            aria-live="polite"
          >
            {saving ? "Saving..." : saved ? "All changes saved" : "Unsaved changes"}
          </span>
          {!saved && (
            <button
              type="button"
              onClick={onManualSave}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <CollaboratorAvatars collaborators={collaborators} max={4} size="sm" />
        <span className="text-xs text-text-muted hidden sm:inline">{onlineCount} online</span>
        <button
          type="button"
          onClick={() => onTogglePanel("version")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors",
            rightPanel === "version"
              ? "border-accent bg-accent-muted text-accent"
              : "border-border text-text-secondary hover:bg-surface-secondary"
          )}
          aria-label={rightPanel === "version" ? "Close version history" : "Open version history"}
          aria-pressed={rightPanel === "version"}
        >
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">History</span>
        </button>
        <div className="w-px h-5 bg-border" />
        <button
          type="button"
          onClick={() => onTogglePanel("comments")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors",
            rightPanel === "comments"
              ? "border-accent bg-accent-muted text-accent"
              : "border-border text-text-secondary hover:bg-surface-secondary"
          )}
          aria-label={rightPanel === "comments" ? "Close comments" : "Open comments"}
          aria-pressed={rightPanel === "comments"}
        >
          {rightPanel === "comments" ? <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" /> : <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />}
          <span className="hidden sm:inline">Comments</span>
          {unresolvedCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-medium text-white">
              {unresolvedCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onTogglePanel("ai")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors",
            rightPanel === "ai"
              ? "border-accent bg-accent-muted text-accent"
              : "border-border text-text-secondary hover:bg-surface-secondary"
          )}
          aria-label={rightPanel === "ai" ? "Close AI panel" : "Open AI panel"}
          aria-pressed={rightPanel === "ai"}
        >
          {rightPanel === "ai" ? <PanelRightClose className="h-3.5 w-3.5" aria-hidden="true" /> : <PanelRightOpen className="h-3.5 w-3.5" aria-hidden="true" />}
          <span className="hidden sm:inline">AI</span>
        </button>
      </div>
    </div>
  );
}
