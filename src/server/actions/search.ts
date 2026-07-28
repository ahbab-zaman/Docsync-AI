"use server";

import { searchMock } from "@/data/mock-search";
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
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: { documents: [], comments: [], activity: [] } };
  }

  const items = searchMock(trimmed);
  return { results: groupResults(items) };
}
