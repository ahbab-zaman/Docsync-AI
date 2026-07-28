"use client";

import { useState, useCallback } from "react";
import { MessageSquarePlus } from "lucide-react";
import { createComment, createReply, resolveComment } from "@/server/actions/comments";
import type { Comment } from "@/types/comments";
import CommentThread from "./CommentThread";
import { updateCommentRanges } from "./CommentMarkers";
import type { CommentRange } from "@/types/comments";

interface CommentSidebarProps {
  documentId: string;
  comments: Comment[];
  onCommentsChange: (comments: Comment[] | ((prev: Comment[]) => Comment[])) => void;
}

export default function CommentSidebar({ documentId, comments, onCommentsChange }: CommentSidebarProps) {

  const handleReply = useCallback(
    async (commentId: string, content: string) => {
      const result = await createReply({ commentId, content });
      if (result.reply) {
        onCommentsChange((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, result.reply!] } : c
          )
        );
      }
    },
    [onCommentsChange]
  );

  const handleResolve = useCallback(
    async (commentId: string) => {
      const result = await resolveComment(commentId);
      if (result.success) {
        onCommentsChange((prev) => {
          const updated = prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c));
          const ranges: CommentRange[] = updated
            .filter((c) => c.selectionRange)
            .map((c) => ({
              id: c.id,
              from: c.selectionRange!.from,
              to: c.selectionRange!.to,
              resolved: c.resolved,
              userColor: c.userColor,
            }));
          updateCommentRanges(ranges);
          return updated;
        });
      }
    },
    [onCommentsChange]
  );

  const [showNewComment, setShowNewComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = useCallback(
    async (content: string) => {
      const result = await createComment({
        documentId,
        content,
        selectionRange: null,
      });
      if (result.comment) {
        onCommentsChange((prev) => {
          const updated = [result.comment!, ...prev];
          const ranges: CommentRange[] = updated
            .filter((c) => c.selectionRange)
            .map((c) => ({
              id: c.id,
              from: c.selectionRange!.from,
              to: c.selectionRange!.to,
              resolved: c.resolved,
              userColor: c.userColor,
            }));
          updateCommentRanges(ranges);
          return updated;
        });
      }
    },
    [documentId, onCommentsChange]
  );

  const unresolved = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Comments
          {unresolved.length > 0 && (
            <span className="ml-1.5 text-xs font-normal text-text-muted">
              ({unresolved.length})
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => setShowNewComment((v) => !v)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-accent-muted transition-colors"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      {showNewComment && (
        <div className="rounded-lg border border-border bg-surface-secondary p-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowNewComment(false);
                setNewCommentText("");
              }}
              className="rounded-md px-3 py-1 text-xs font-medium text-text-secondary hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (newCommentText.trim()) {
                  handleAddComment(newCommentText.trim());
                  setNewCommentText("");
                  setShowNewComment(false);
                }
              }}
              disabled={!newCommentText.trim()}
              className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              Comment
            </button>
          </div>
        </div>
      )}

      {unresolved.length === 0 && resolved.length === 0 && !showNewComment && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquarePlus className="h-8 w-8 text-text-muted mb-2" />
          <p className="text-xs text-text-muted">No comments yet</p>
        </div>
      )}

      {unresolved.length > 0 && (
        <div className="space-y-2">
          {unresolved.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <details>
          <summary className="cursor-pointer text-xs font-medium text-text-muted hover:text-text-secondary transition-colors">
            Resolved ({resolved.length})
          </summary>
          <div className="mt-2 space-y-2">
            {resolved.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onResolve={handleResolve}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
