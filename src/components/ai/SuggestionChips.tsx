"use client";

import type { AiSuggestion } from "@/types/ai";

interface SuggestionChipsProps {
  suggestions: AiSuggestion[];
  onSelect: (suggestion: AiSuggestion) => void;
  disabled: boolean;
}

export default function SuggestionChips({ suggestions, onSelect, disabled }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
