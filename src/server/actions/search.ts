"use server";

import { searchMock } from "@/data/mock-search";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import type { SearchResults, SearchResultItem } from "@/types/search";

function groupResults(items: SearchResultItem[]): SearchResults {
  return {
    documents: items.filter((r) => r.type === "document"),
    comments: items.filter((r) => r.type === "comment"),
    activity: items.filter((r) => r.type === "activity"),
  };
}

export async function search(
  query: string
): Promise<{ results: SearchResults }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "search" },
    async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        return { results: { documents: [], comments: [], activity: [] } };
      }

      const items = searchMock(trimmed);
      logger.info("Search completed", {
        action: "search",
        query: trimmed.slice(0, 100),
        durationMs: Date.now() - start,
        status: "success",
      });

      return { results: groupResults(items) };
    }
  );
}
