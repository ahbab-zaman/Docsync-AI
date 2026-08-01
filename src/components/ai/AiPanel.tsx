"use client";

import { useState, useCallback } from "react";
import type { AiActionType, AiResponse as AiResponseType, AiSuggestion, AiSelectionContext } from "@/types/ai";
import { mockSuggestions } from "@/data/mock-ai";
import { runAiAction } from "@/server/actions/ai";
import { withRetry, isOnline, safeErrorMessage } from "@/lib/retry";
import PromptInput from "./PromptInput";
import SuggestionChips from "./SuggestionChips";
import AiResponseView from "./AiResponse";

interface AiPanelProps {
  documentContent: string;
  documentId?: string;
  onInsertContent?: (content: string) => void;
  selectionContext?: AiSelectionContext | null;
}

export default function AiPanel({ documentContent, documentId, onInsertContent, selectionContext }: AiPanelProps) {
  const [responses, setResponses] = useState<AiResponseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveContent = selectionContext?.text || documentContent;

  const handlePrompt = useCallback(
    async (prompt: string, actionType: AiActionType = "custom") => {
      if (!isOnline()) {
        setError("You appear to be offline. Please check your connection and try again.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { response, error } = await withRetry(
          () => runAiAction(actionType, prompt, effectiveContent),
          { maxRetries: 1 }
        );
        if (response) {
          setResponses((prev) => [response, ...prev]);
        } else if (error) {
          setError(error);
        }
      } catch (err) {
        setError(safeErrorMessage(err, "AI generation failed. Please try again."));
      } finally {
        setLoading(false);
      }
    },
    [effectiveContent]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: AiSuggestion) => {
      handlePrompt(suggestion.prompt, suggestion.actionType);
    },
    [handlePrompt]
  );

  const handleInsert = useCallback(
    (content: string) => {
      if (onInsertContent) {
        onInsertContent(content);
      }
    },
    [onInsertContent]
  );

  const handleDiscard = useCallback((id: string) => {
    setResponses((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="shrink-0">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Assistant</h3>

        {selectionContext && (
          <div className="mb-3 rounded-lg border border-accent/20 bg-accent-muted p-2">
            <p className="text-[10px] font-medium text-accent uppercase tracking-wider mb-1">Selected text context</p>
            <p className="text-xs text-text-secondary line-clamp-2">{selectionContext.text}</p>
          </div>
        )}

        <div className="space-y-3">
          <PromptInput onSubmit={(p) => handlePrompt(p)} disabled={loading} />
          <SuggestionChips suggestions={mockSuggestions} onSelect={handleSuggestionSelect} disabled={loading} />
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-secondary p-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-xs text-text-muted">AI is thinking...</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3" role="alert">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto">
        {responses.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-muted">Ask AI to summarize, rewrite, or extract insights from this document.</p>
          </div>
        )}
        {responses.map((r) => (
          <AiResponseView key={r.id} response={r} onInsert={handleInsert} onDiscard={handleDiscard} />
        ))}
      </div>
    </div>
  );
}
