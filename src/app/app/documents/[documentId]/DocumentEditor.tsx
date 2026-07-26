"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/documents/TiptapEditor";
import { saveDocument } from "@/server/actions/document";
import AiPanel from "@/components/ai/AiPanel";

interface DocumentEditorProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
}

export default function DocumentEditor({
  documentId,
  initialTitle,
  initialContent,
  createdAt,
  updatedAt,
  createdByName,
}: DocumentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const result = await saveDocument(documentId, { title, content });
    if (result.success) {
      setSaved(true);
    }
    setSaving(false);
  }, [documentId, title, content]);

  const handleContentUpdate = useCallback(
    (html: string) => {
      setContent(html);
      setSaved(false);
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        handleSave();
      }, 2000);
    },
    [handleSave]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      setSaved(false);
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        handleSave();
      }, 2000);
    },
    [handleSave]
  );

  const handleInsertContent = useCallback(
    (newContent: string) => {
      setContent((prev) => prev + newContent);
      setSaved(false);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-3xl font-bold text-foreground bg-transparent border-none focus:outline-none w-full placeholder:text-text-muted"
            placeholder="Untitled"
          />
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-text-muted">
              {saving
                ? "Saving..."
                : saved
                  ? "Saved"
                  : "Unsaved changes"}
            </span>
            <button
              type="button"
              onClick={() => setAiPanelOpen((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                aiPanelOpen
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:bg-surface-secondary"
              }`}
            >
              AI
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || saved}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <TiptapEditor content={initialContent} onUpdate={handleContentUpdate} />

        <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border pt-3">
          <span>Created {formatDate(createdAt)} by {createdByName}</span>
          <span>Last updated {formatDate(updatedAt)}</span>
        </div>
      </div>

      {aiPanelOpen && (
        <div className="w-80 shrink-0 border-l border-border pl-6">
          <AiPanel
            documentContent={content}
            documentId={documentId}
            onInsertContent={handleInsertContent}
          />
        </div>
      )}
    </div>
  );
}
