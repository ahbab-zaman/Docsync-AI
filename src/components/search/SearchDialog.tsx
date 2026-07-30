"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, MessageSquare, Activity } from "lucide-react";
import { search } from "@/server/actions/search";
import { cn } from "@/lib/utils";
import type { SearchResults, SearchResultItem } from "@/types/search";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const typeConfig = {
  document: { icon: FileText, label: "Documents" },
  comment: { icon: MessageSquare, label: "Comments" },
  activity: { icon: Activity, label: "Activity" },
} as const;

function groupTitle(type: keyof typeof typeConfig, items: SearchResultItem[]): string {
  const count = items.length;
  return `${typeConfig[type].label} (${count})`;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    documents: [],
    comments: [],
    activity: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flatResults = [
    ...results.documents,
    ...results.comments,
    ...results.activity,
  ];

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults({ documents: [], comments: [], activity: [] });
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults({ documents: [], comments: [], activity: [] });
      return;
    }
    setLoading(true);
    const { results: searchResults } = await search(q);
    setResults(searchResults);
    setSelectedIndex(0);
    setLoading(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => handleSearch(value), 200);
    },
    [handleSearch]
  );

  const navigateTo = useCallback(
    (item: SearchResultItem) => {
      onClose();
      router.push(item.url);
    },
    [onClose, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter" && flatResults[selectedIndex]) {
        navigateTo(flatResults[selectedIndex]);
      }
    },
    [onClose, flatResults, selectedIndex, navigateTo]
  );

  if (!open) return null;

  const hasResults =
    results.documents.length > 0 ||
    results.comments.length > 0 ||
    results.activity.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-[600px] mx-4 rounded-xl border border-border bg-surface shadow-popover overflow-hidden" role="dialog" aria-modal="true" aria-label="Search">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            defaultValue={query}
            onChange={handleInputChange}
            placeholder="Search documents, comments, activity..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-border bg-surface-secondary px-1.5 py-0.5 text-[11px] text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="flex flex-col items-center py-8 text-center">
              <Search className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm font-medium text-foreground">No results found</p>
              <p className="text-xs text-text-muted mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center py-8 text-center">
              <Search className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm text-text-muted">
                Type to search across your workspaces
              </p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="py-2">
              {(["document", "comment", "activity"] as const).map((type) => {
                const key = `${type}s` as keyof SearchResults;
                const items = results[key];
                if (items.length === 0) return null;
                const Icon = typeConfig[type].icon;
                // compute starting index for this group
                const typeOrder = ["document", "comment", "activity"] as const;
                let groupStart = 0;
                for (const t of typeOrder) {
                  if (t === type) break;
                  const tk = `${t}s` as keyof SearchResults;
                  groupStart += results[tk].length;
                }

                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 px-4 py-1.5">
                      <Icon className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        {groupTitle(type, items)}
                      </span>
                    </div>
                    {items.map((item, i) => {
                      const idx = groupStart + i;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTo(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                            idx === selectedIndex
                              ? "bg-accent-muted"
                              : "hover:bg-surface-secondary"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                              idx === selectedIndex
                                ? "bg-accent/10 text-accent"
                                : "bg-surface-tertiary text-text-muted"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm truncate",
                                idx === selectedIndex
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-foreground"
                              )}
                            >
                              {item.title}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 truncate">
                              {item.subtitle}
                            </p>
                            {item.matchPreview && (
                              <p
                                className="text-xs text-text-secondary mt-0.5 truncate"
                                dangerouslySetInnerHTML={{ __html: item.matchPreview }}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2">
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <kbd className="rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px]">
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <kbd className="rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px]">
              ↵
            </kbd>
            Open
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <kbd className="rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px]">
              Esc
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
