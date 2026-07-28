"use client";

import { useState, useRef, useEffect } from "react";
import MentionSuggestions from "./MentionSuggestions";
import { mockMentionUsers } from "@/data/mock-comments";
import type { MentionUser } from "@/types/comments";

interface CommentReplyBoxProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function CommentReplyBox({ onSubmit, onCancel }: CommentReplyBoxProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleMention = (user: MentionUser) => {
    // mention already inserted in value by MentionSuggestions
  };

  return (
    <div className="space-y-2 relative">
      <MentionSuggestions
        users={mockMentionUsers}
        value={content}
        onChange={setContent}
        onMention={handleMention}
        textareaRef={textareaRef}
      />
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a reply... Use @ to mention someone"
        rows={2}
        className="w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1 text-xs font-medium text-text-secondary hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
