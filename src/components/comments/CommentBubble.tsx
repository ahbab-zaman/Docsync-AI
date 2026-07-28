"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { MessageSquarePlus } from "lucide-react";

interface CommentBubbleProps {
  editor: Editor | null;
  onAddComment: (from: number, to: number, text: string) => void;
}

export default function CommentBubble({ editor, onAddComment }: CommentBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [range, setRange] = useState<{ from: number; to: number; text: string } | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      setVisible(false);
      return;
    }

    const view = editor.view;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const editorRect = view.dom.getBoundingClientRect();

    const bubbleWidth = 120;
    const left = (start.left + end.left) / 2 - editorRect.left - bubbleWidth / 2;
    const top = start.top - editorRect.top - 44;

    setPosition({ left: Math.max(4, left), top: Math.max(4, top) });
    setRange({
      from,
      to,
      text: editor.state.doc.textBetween(from, to),
    });
    setVisible(true);
  }, [editor]);

  useEffect(() => {
    const ed = editor;
    if (!ed) return;

    const handleSelection = () => {
      requestAnimationFrame(updatePosition);
    };

    ed.on("selectionUpdate", handleSelection);
    return () => {
      ed.off("selectionUpdate", handleSelection);
    };
  }, [editor, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  useEffect(() => {
    const ed = editor;
    if (!ed) return;
    const handleClick = () => {
      const { from, to } = ed.state.selection;
      if (from === to) setVisible(false);
    };
    ed.on("click", handleClick);
    return () => { ed.off("click", handleClick); };
  }, [editor]);

  if (!visible || !range || !range.text.trim() || !editor) return null;

  return (
    <div
      ref={bubbleRef}
      className="absolute z-50 flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 shadow-popover"
      style={{
        top: position.top,
        left: position.left,
        pointerEvents: "auto",
      }}
    >
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onAddComment(range.from, range.to, range.text);
          setVisible(false);
        }}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Comment
      </button>
    </div>
  );
}
