"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import TiptapEditor from "@/components/documents/TiptapEditor";
import { saveDocument, deleteDocument } from "@/server/actions/document";
import { createComment } from "@/server/actions/comments";
import { runAiAction } from "@/server/actions/ai";
import { getMockComments } from "@/data/mock-comments";
import { usePresence } from "@/hooks/usePresence";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { CommentRange } from "@/types/comments";
import type { AiActionType, AiSelectionContext } from "@/types/ai";
import DocumentActionBar from "./DocumentActionBar";

const OutlinePanel = dynamic(() => import("@/components/editor/OutlinePanel"), { ssr: false });
const AiPanel = dynamic(() => import("@/components/ai/AiPanel"), { ssr: false });
const CommentSidebar = dynamic(() => import("@/components/comments/CommentSidebar"), { ssr: false });
const VersionHistory = dynamic(() => import("@/components/editor/VersionHistory"), { ssr: false });

interface DocumentEditorProps {
  documentId: string;
  projectId: string;
  initialTitle: string;
  initialContent: string;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  currentUserId: string | null;
  currentUserName: string;
  currentUserColor: string;
}

export default function DocumentEditor({
  documentId,
  projectId,
  initialTitle,
  initialContent,
  createdAt,
  updatedAt,
  createdByName,
  currentUserId,
  currentUserName,
  currentUserColor,
}: DocumentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [rightPanel, setRightPanel] = useState<"ai" | "comments" | "version" | null>("ai");
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [comments, setComments] = useState(getMockComments(documentId));
  const [selectionContext, setSelectionContext] = useState<AiSelectionContext | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const latestSnapshotRef = useRef({ title, content });

  const presence = usePresence({
    documentId,
    userId: currentUserId ?? "",
    userName: currentUserName,
    userColor: currentUserColor,
    enabled: Boolean(currentUserId),
  });

  const { collaborators, onlineCount, emitTyping } = presence;

  const commentRanges: CommentRange[] = useMemo(() => comments
    .filter((c) => c.selectionRange)
    .map((c) => ({
      id: c.id,
      from: c.selectionRange!.from,
      to: c.selectionRange!.to,
      resolved: c.resolved,
      userColor: c.userColor,
    })), [comments]);

  const unresolvedCount = useMemo(() => comments.filter((c) => !c.resolved).length, [comments]);

  const handleSave = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    const result = await saveDocument(documentId, { title, content });
    setSaving(false);
    if (result.success) {
      dirtyRef.current = false;
      setSaved(true);
      return true;
    }
    setSaved(false);
    if (result.error) {
      toast.error(result.error);
    }
    return false;
  }, [documentId, title, content]);

  const scheduleSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave();
    }, 800);
  }, [handleSave]);

  const handleContentUpdate = useCallback(
    (html: string) => {
      setContent(html);
      dirtyRef.current = true;
      setSaved(false);
      scheduleSave();
      if (emitTyping) {
        emitTyping(true);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => emitTyping(false), 1500);
      }
    },
    [scheduleSave, emitTyping]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      dirtyRef.current = true;
      setSaved(false);
      scheduleSave();
    },
    [scheduleSave]
  );

  const handleInsertContent = useCallback(
    (newContent: string) => {
      setContent((prev) => prev + newContent);
      dirtyRef.current = true;
      setSaved(false);
      scheduleSave();
    },
    [scheduleSave]
  );

  const handleManualSave = useCallback(() => {
    handleSave().then((saved) => {
      if (saved) toast.success("Document saved");
    });
  }, [handleSave]);

  const handleDelete = useCallback(async () => {
    setConfirmDelete(false);
    const result = await deleteDocument(documentId);
    if (result.success) {
      toast.success("Document deleted");
      router.push(`/app/projects/${projectId}`);
      router.refresh();
    } else if (result.error) {
      toast.error(result.error);
    }
  }, [documentId, projectId, router]);

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

  const handleVersionRestore = useCallback(
    (restoredContent: string) => {
      setContent(restoredContent);
      dirtyRef.current = true;
      setSaved(false);
      scheduleSave();
    },
    [scheduleSave]
  );

  const handleTogglePanel = useCallback(
    (panel: Exclude<"ai" | "comments" | "version" | null, null>) => {
      setRightPanel((current) => (current === panel ? null : panel));
    },
    []
  );

  useEffect(() => {
    latestSnapshotRef.current = { title, content };
  }, [title, content]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (dirtyRef.current) {
        const { title, content } = latestSnapshotRef.current;
        saveDocument(documentId, { title, content }).catch(() => {
          // Best-effort flush of the last pending edit when leaving the page.
        });
      }
    };
  }, [documentId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleManualSave]);

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
      <DocumentActionBar
        saving={saving}
        saved={saved}
        outlineOpen={outlineOpen}
        onToggleOutline={() => setOutlineOpen((v) => !v)}
        rightPanel={rightPanel}
        onTogglePanel={handleTogglePanel}
        collaborators={collaborators}
        onlineCount={onlineCount}
        unresolvedCount={unresolvedCount}
        onManualSave={handleManualSave}
      />

      {/* Three-zone layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 overflow-hidden">
        {/* Left outline panel */}
        {outlineOpen && (
          <div className="w-full lg:w-56 shrink-0 overflow-y-auto rounded-lg border border-border bg-surface">
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
              className="text-2xl sm:text-3xl font-bold text-foreground bg-transparent border-none focus:outline-none w-full placeholder:text-text-muted mb-4"
              placeholder="Untitled"
              aria-label="Document title"
            />

            <TiptapEditor
              content={content}
              onUpdate={handleContentUpdate}
              commentRanges={commentRanges}
              onAddComment={handleAddCommentFromSelection}
              onAiAction={handleAiActionFromSelection}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-text-muted border-t border-border mt-4 pt-3 pb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
                <span>Created {formatDate(createdAt)} by {createdByName}</span>
                <span>Last updated {formatDate(updatedAt)}</span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-muted hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Right panel — full width on mobile, sidebar on desktop */}
        {rightPanel && (
          <div className="w-full lg:w-80 shrink-0 overflow-y-auto rounded-lg border border-border bg-surface p-4 max-lg:max-h-[50vh]">
            {rightPanel === "comments" && (
              <CommentSidebar
                documentId={documentId}
                comments={comments}
                onCommentsChange={setComments}
              />
            )}
            {rightPanel === "version" && (
              <VersionHistory
                documentId={documentId}
                currentContent={content}
                onRestore={handleVersionRestore}
              />
            )}
            {rightPanel === "ai" && (
              <AiPanel
                documentContent={content}
                documentId={documentId}
                onInsertContent={handleInsertContent}
                selectionContext={selectionContext}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete document"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
