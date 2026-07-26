"use client";

import { useState, useCallback, useEffect } from "react";
import { MessageSquarePlus } from "lucide-react";
import { getComments, createComment, createReply, resolveComment } from "@/server/actions/comments";
import type { Comment } from "@/types/comments";
import CommentThread from "./CommentThread";

interface CommentSidebarProps {
  documentId: string;
}

export default function CommentSidebar({ documentId }: CommentSidebarProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComments(documentId).then((result) => {
      setComments(result.comments);
      setLoading(false);
    });
  }, [documentId]);

  const handleReply = useCallback(
    async (commentId: string, content: string) => {
      const result = await createReply({ commentId, content });
      if (result.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, result.reply!] } : c
          )
        );
      }
    },
    []
  );

  const handleResolve = useCallback(
    async (commentId: string) => {
      const result = await resolveComment(commentId);
      if (result.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
        );
      }
    },
    []
  );

  const handleAddComment = useCallback(
    async (content: string) => {
      const result = await createComment({
        documentId,
        content,
        selectionRange: null,
      });
      if (result.comment) {
        setComments((prev) => [result.comment!, ...prev]);
      }
    },
    [documentId]
  );

  const unresolved = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Comments</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-tertiary" />
          ))}
        </div>
      </div>
    );
  }

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
      </div>

      {unresolved.length === 0 && resolved.length === 0 && (
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
