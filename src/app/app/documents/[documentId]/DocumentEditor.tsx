"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightOpen,
  PanelRightClose,
  MessageSquare,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import TiptapEditor from "@/components/documents/TiptapEditor";
import OutlinePanel from "@/components/editor/OutlinePanel";
import AiPanel from "@/components/ai/AiPanel";
import CommentSidebar from "@/components/comments/CommentSidebar";
import CollaboratorAvatars from "@/components/presence/CollaboratorAvatars";
import { saveDocument } from "@/server/actions/document";
import { createComment } from "@/server/actions/comments";
import { runAiAction } from "@/server/actions/ai";
import { getAllMockCollaborators } from "@/data/mock-collaborators";
import { getMockComments } from "@/data/mock-comments";
import { cn } from "@/lib/utils";
import type { CommentRange } from "@/types/comments";
import type { AiActionType, AiSelectionContext } from "@/types/ai";

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
  const [rightPanel, setRightPanel] = useState<"ai" | "comments" | null>("ai");
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [comments, setComments] = useState(getMockComments(documentId));
  const [selectionContext, setSelectionContext] = useState<AiSelectionContext | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const collaborators = getAllMockCollaborators();
  const onlineCount = collaborators.filter((c) => c.isOnline).length;

  const commentRanges: CommentRange[] = comments
    .filter((c) => c.selectionRange)
    .map((c) => ({
      id: c.id,
      from: c.selectionRange!.from,
      to: c.selectionRange!.to,
      resolved: c.resolved,
      userColor: c.userColor,
    }));

  const unresolvedCount = comments.filter((c) => !c.resolved).length;

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

  const handleManualSave = useCallback(() => {
    handleSave();
    toast.success("Document saved");
  }, [handleSave]);

  const handleAddCommentFromSelection = useCallback(
    async (from: number, to: number, _text: string) => {
      const result = await createComment({
        documentId,
        content: "",
        selectionRange: { from, to },
      });
      if (result.comment) {
        setComments((prev) => [result.comment!, ...prev]);
        setRightPanel("comments");
        toast.success("Comment added");
      }
    },
    [documentId]
  );

  const handleAiActionFromSelection = useCallback(
    async (from: number, to: number, text: string, actionType: AiActionType) => {
      setSelectionContext({ from, to, text });
      setRightPanel("ai");
      const { response } = await runAiAction(actionType, text, text);
      if (response) {
        toast.success(`${actionType} complete`);
      }
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
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Top action bar */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOutlineOpen((v) => !v)}
            className="flex items-center justify-center h-8 w-8 rounded-md text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            title={outlineOpen ? "Close outline" : "Open outline"}
          >
            {outlineOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-3">
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
                onClick={handleManualSave}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CollaboratorAvatars collaborators={collaborators} max={4} size="sm" />
          <span className="text-xs text-text-muted">{onlineCount} online</span>
          <div className="w-px h-5 bg-border" />
          <button
            type="button"
            onClick={() => setRightPanel(rightPanel === "comments" ? null : "comments")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              rightPanel === "comments"
                ? "border-accent bg-accent-muted text-accent"
                : "border-border text-text-secondary hover:bg-surface-secondary"
            )}
          >
            {rightPanel === "comments" ? <MessageSquareText className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
            Comments
            {unresolvedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-medium text-white">
                {unresolvedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setRightPanel(rightPanel === "ai" ? null : "ai")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              rightPanel === "ai"
                ? "border-accent bg-accent-muted text-accent"
                : "border-border text-text-secondary hover:bg-surface-secondary"
            )}
          >
            {rightPanel === "ai" ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            AI
          </button>
        </div>
      </div>

      {/* Three-zone layout */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left outline panel */}
        {outlineOpen && (
          <div className="w-56 shrink-0 overflow-y-auto rounded-lg border border-border bg-surface">
            <OutlinePanel content={content} />
          </div>
        )}

        {/* Center: title + editor */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-3xl font-bold text-foreground bg-transparent border-none focus:outline-none w-full placeholder:text-text-muted mb-4"
              placeholder="Untitled"
            />

            <TiptapEditor
              content={initialContent}
              onUpdate={handleContentUpdate}
              commentRanges={commentRanges}
              onAddComment={handleAddCommentFromSelection}
              onAiAction={handleAiActionFromSelection}
            />

            <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border mt-4 pt-3 pb-2">
              <span>Created {formatDate(createdAt)} by {createdByName}</span>
              <span>Last updated {formatDate(updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        {rightPanel === "comments" && (
          <div className="w-80 shrink-0 overflow-y-auto rounded-lg border border-border bg-surface p-4">
            <CommentSidebar
              documentId={documentId}
              comments={comments}
              onCommentsChange={setComments}
            />
          </div>
        )}
        {rightPanel === "ai" && (
          <div className="w-80 shrink-0 overflow-y-auto rounded-lg border border-border bg-surface p-4">
            <AiPanel
              documentContent={content}
              documentId={documentId}
              onInsertContent={handleInsertContent}
              selectionContext={selectionContext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
