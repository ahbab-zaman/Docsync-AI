"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { MentionUser } from "@/types/comments";
import { cn } from "@/lib/utils";

interface MentionSuggestionsProps {
  users: MentionUser[];
  value: string;
  onChange: (value: string) => void;
  onMention: (user: MentionUser) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MentionSuggestions({
  users,
  value,
  onChange,
  onMention,
  textareaRef,
}: MentionSuggestionsProps) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorPos] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = mentionQuery
    ? users.filter((u) =>
        u.name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
    : users;

  const insertMention = useCallback(
    (user: MentionUser) => {
      if (mentionQuery === null) return;
      const textBefore = value.slice(0, cursorPos);
      const textAfter = value.slice(cursorPos);
      const atIndex = textBefore.lastIndexOf("@");
      const newValue = textBefore.slice(0, atIndex) + `@${user.name} ` + textAfter;
      onChange(newValue);
      setMentionQuery(null);
      onMention(user);

      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          const newPos = atIndex + user.name.length + 2;
          ta.focus();
          ta.setSelectionRange(newPos, newPos);
        }
      }, 0);
    },
    [mentionQuery, value, cursorPos, onChange, onMention, textareaRef]
  );

  useEffect(() => {
    if (mentionQuery === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mentionQuery === null) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % Math.min(filtered.length, 6));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => (i - 1 + Math.min(filtered.length, 6)) % Math.min(filtered.length, 6));
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (filtered.length > 0 && filtered[mentionIndex]) {
          e.preventDefault();
          insertMention(filtered[mentionIndex]);
        }
      } else if (e.key === "Escape") {
        setMentionQuery(null);
      }
    };

    const ta = textareaRef.current;
    if (ta) {
      ta.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (ta) {
        ta.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [mentionQuery, filtered, mentionIndex, insertMention, textareaRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMentionQuery(null);
      }
    };
    if (mentionQuery !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mentionQuery]);

  if (mentionQuery === null || filtered.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 mb-1 w-56 rounded-lg border border-border bg-surface shadow-popover overflow-hidden z-50"
    >
      <div className="max-h-40 overflow-y-auto">
        {filtered.slice(0, 6).map((user, i) => (
          <button
            key={user.id}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors",
              i === mentionIndex
                ? "bg-accent-muted text-accent"
                : "text-text-primary hover:bg-surface-secondary"
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              insertMention(user);
            }}
            onMouseEnter={() => setMentionIndex(i)}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[8px] font-medium text-accent-foreground">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <span className="font-medium">{user.name}</span>
            <span className="ml-auto text-text-muted">{user.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
