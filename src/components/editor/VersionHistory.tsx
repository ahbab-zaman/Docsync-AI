"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Clock, RotateCcw, Save, History } from "lucide-react";
import { getVersions, createVersion, restoreVersion } from "@/server/actions/versions";
import { cn } from "@/lib/utils";
import type { DocumentVersion } from "@/types/versions";

interface VersionHistoryProps {
  documentId: string;
  currentContent: string;
  currentTitle: string;
  onRestore: (content: string) => void;
}

function formatFullDate(iso: Date): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VersionHistory({
  documentId,
  currentContent,
  currentTitle: _currentTitle,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [versionTitle, setVersionTitle] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getVersions(documentId).then(({ versions: loaded }) => {
      if (!cancelled) {
        setVersions(loaded);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [documentId]);

  const handleSaveVersion = useCallback(async () => {
    const title = versionTitle.trim() || `Snapshot ${new Date().toLocaleString()}`;
    setSaving(true);
    const { version, error } = await createVersion({
      documentId,
      title,
      content: currentContent,
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (version) {
      setVersions((prev) => [version, ...prev]);
      setVersionTitle("");
      setShowSaveInput(false);
      toast.success("Version saved");
    }
  }, [documentId, currentContent, versionTitle]);

  const handleRestore = useCallback(
    async (versionId: string) => {
      const { content, error } = await restoreVersion(versionId);
      if (error) {
        toast.error(error);
        return;
      }
      if (content) {
        onRestore(content);
        toast.success("Version restored");
      }
    },
    [onRestore]
  );

  const isCurrentVersion = (version: DocumentVersion) =>
    version.content === currentContent && version.documentId === documentId;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <History className="h-4 w-4" />
          Version History
        </h3>
      </div>

      {/* Save current version */}
      <div className="mb-4">
        {showSaveInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={versionTitle}
              onChange={(e) => setVersionTitle(e.target.value)}
              placeholder="Version title (optional)"
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveVersion();
                if (e.key === "Escape") setShowSaveInput(false);
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveVersion}
                disabled={saving}
                className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                <Save className="h-3 w-3" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveInput(false);
                  setVersionTitle("");
                }}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowSaveInput(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-secondary px-3 py-2 text-xs font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            Save current version
          </button>
        )}
      </div>

      {/* Version list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 text-text-muted mb-2" />
            <p className="text-xs text-text-muted">No versions saved yet</p>
          </div>
        ) : (
          versions.map((version) => {
            const isCurrent = isCurrentVersion(version);
            return (
              <div
                key={version.id}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  isCurrent
                    ? "border-accent/30 bg-accent-muted"
                    : "border-border bg-surface hover:border-border-light"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {version.title}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {version.createdByName} &middot; {formatFullDate(version.createdAt)}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                      Current
                    </span>
                  )}
                </div>
                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRestore(version.id)}
                    className="mt-2 flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restore
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
