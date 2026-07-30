"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { MessageSquarePlus, Sparkles, ChevronDown } from "lucide-react";
import type { AiActionType } from "@/types/ai";
import { cn } from "@/lib/utils";

interface SelectionMenuProps {
  editor: Editor | null;
  onAddComment: (from: number, to: number, text: string) => void;
  onAiAction: (from: number, to: number, text: string, actionType: AiActionType) => void;
}

const AI_ACTIONS: { label: string; type: AiActionType }[] = [
  { label: "Summarize", type: "summarize" },
  { label: "Rewrite", type: "rewrite" },
  { label: "Expand", type: "expand" },
  { label: "Simplify", type: "simplify" },
  { label: "Extract", type: "extract" },
];

export default function SelectionMenu({ editor, onAddComment, onAiAction }: SelectionMenuProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [range, setRange] = useState<{ from: number; to: number; text: string } | null>(null);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      setVisible(false);
      setShowAiMenu(false);
      return;
    }

    const view = editor.view;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const editorRect = view.dom.getBoundingClientRect();

    const bubbleWidth = 220;
    const left = (start.left + end.left) / 2 - editorRect.left - bubbleWidth / 2;
    const top = start.top - editorRect.top - 44;

    setPosition({ left: Math.max(4, left), top: Math.max(4, top) });
    setRange({ from, to, text: editor.state.doc.textBetween(from, to) });
    setVisible(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const ed = editor;
    const handleSelection = () => {
      requestAnimationFrame(updatePosition);
    };
    ed.on("selectionUpdate", handleSelection);
    return () => { ed.off("selectionUpdate", handleSelection); };
  }, [editor, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
        setShowAiMenu(false);
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  if (!visible || !range || !range.text.trim() || !editor) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 flex items-stretch rounded-lg border border-border bg-surface shadow-popover"
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
        className="flex items-center gap-1.5 rounded-l-lg px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Comment
      </button>

      <div className="w-px self-stretch bg-border" />

      <div className="relative">
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={showAiMenu}
          onMouseDown={(e) => {
            e.preventDefault();
            setShowAiMenu((v) => !v);
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-r-lg px-3 py-2 text-xs font-medium transition-colors",
            showAiMenu
              ? "bg-accent-muted text-accent"
              : "text-text-secondary hover:bg-surface-secondary hover:text-foreground"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          AI
          <ChevronDown className={cn("h-3 w-3 transition-transform", showAiMenu && "rotate-180")} aria-hidden="true" />
        </button>

        {showAiMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-surface shadow-popover overflow-hidden" role="menu" aria-label="AI actions">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.type}
                type="button"
                role="menuitem"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onAiAction(range.from, range.to, range.text, action.type);
                  setVisible(false);
                  setShowAiMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
              >
                <Sparkles className="h-3 w-3 text-accent shrink-0" aria-hidden="true" />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
