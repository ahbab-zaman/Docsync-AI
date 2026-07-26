"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

interface OutlinePanelProps {
  content: string;
  onNavigate?: (id: string) => void;
}

function parseHeadings(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (text) {
      headings.push({ level, text, id: `heading-${index++}` });
    }
  }
  return headings;
}

export default function OutlinePanel({ content, onNavigate }: OutlinePanelProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setHeadings(parseHeadings(content));
  }, [content]);

  const handleClick = useCallback(
    (id: string) => {
      setActiveId(id);
      onNavigate?.(id);
    },
    [onNavigate]
  );

  if (headings.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Outline
        </h3>
        <p className="text-xs text-text-muted">No headings found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        Outline
      </h3>
      <nav className="space-y-0.5">
        {headings.map((heading) => (
          <button
            key={heading.id}
            type="button"
            onClick={() => handleClick(heading.id)}
            className={cn(
              "block w-full text-left rounded px-2 py-1 text-xs transition-colors hover:bg-surface-secondary",
              activeId === heading.id
                ? "text-accent bg-accent-muted font-medium"
                : "text-text-secondary",
              heading.level === 1 && "pl-2 font-medium",
              heading.level === 2 && "pl-5",
              heading.level === 3 && "pl-8",
              heading.level >= 4 && "pl-11"
            )}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
