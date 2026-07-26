"use client";

import type { AiResponse as AiResponseType } from "@/types/ai";

interface AiResponseViewProps {
  response: AiResponseType;
  onInsert: (content: string) => void;
  onDiscard: (id: string) => void;
}

export default function AiResponseView({ response, onInsert, onDiscard }: AiResponseViewProps) {
  const time = new Date(response.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-accent/20 bg-surface-secondary p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-accent">{response.label}</span>
        <span className="text-[10px] text-text-muted">{time}</span>
      </div>
      <div
        className="prose prose-sm prose-invert max-w-none text-text-secondary [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:text-text-secondary [&_strong]:text-foreground"
        dangerouslySetInnerHTML={{ __html: response.content }}
      />
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onInsert(response.content)}
          className="rounded-md bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          Insert into document
        </button>
        <button
          type="button"
          onClick={() => onDiscard(response.id)}
          className="rounded-md px-3 py-1 text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
