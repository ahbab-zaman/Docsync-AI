"use client";

import { useState } from "react";
import { Check, Reply } from "lucide-react";
import type { Comment } from "@/types/comments";
import { cn } from "@/lib/utils";
import CommentReplyBox from "./CommentReplyBox";

interface CommentThreadProps {
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
  onResolve: (commentId: string) => void;
}

export default function CommentThread({ comment, onReply, onResolve }: CommentThreadProps) {
  const [showReply, setShowReply] = useState(false);

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        comment.resolved
          ? "border-success-light bg-success-lightest opacity-60"
          : "border-border bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
            style={{ backgroundColor: comment.userColor }}
          >
            {comment.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground truncate">{comment.userName}</span>
          <span className="text-xs text-text-muted shrink-0">{formatTime(comment.createdAt)}</span>
        </div>
        {!comment.resolved && (
          <button
            type="button"
            onClick={() => onResolve(comment.id)}
            className="flex items-center justify-center h-6 w-6 rounded text-text-muted hover:text-success hover:bg-success-lightest transition-colors shrink-0"
            title="Resolve"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-text-primary leading-relaxed">{comment.content}</p>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-2 border-l-2 border-border-light pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium text-white"
                  style={{ backgroundColor: reply.userColor }}
                >
                  {reply.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="font-medium text-foreground text-xs">{reply.userName}</span>
                <span className="text-xs text-text-muted">{formatTime(reply.createdAt)}</span>
              </div>
              <p className="mt-1 text-text-secondary ml-7">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {!comment.resolved && (
        <div className="mt-2">
          {showReply ? (
            <CommentReplyBox
              onSubmit={(content) => {
                onReply(comment.id, content);
                setShowReply(false);
              }}
              onCancel={() => setShowReply(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowReply(true)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <Reply className="h-3 w-3" />
              Reply
            </button>
          )}
        </div>
      )}

      {comment.resolved && (
        <div className="mt-2 flex items-center gap-1 text-xs text-success">
          <Check className="h-3 w-3" />
          Resolved
        </div>
      )}
    </div>
  );
}
