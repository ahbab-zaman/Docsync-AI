import type { SearchResultItem } from "@/types/search";

const mockSearchResults: SearchResultItem[] = [
  {
    id: "search-doc-1",
    type: "document",
    title: "Meeting Notes",
    subtitle: "Q3 Planning Meeting · doc-1",
    url: "/app/documents/doc-1",
    matchPreview: "...<mark>Q3</mark> Planning <mark>Meeting</mark>...",
  },
  {
    id: "search-doc-2",
    type: "document",
    title: "Book Ideas",
    subtitle: "Book Ideas for Q3 · doc-2",
    url: "/app/documents/doc-2",
    matchPreview: "...<mark>Book</mark> <mark>Ideas</mark> for Q3...",
  },
  {
    id: "search-doc-3",
    type: "document",
    title: "Weekly Review",
    subtitle: "Week 28 Review · doc-3",
    url: "/app/documents/doc-3",
    matchPreview: "...<mark>Week</mark> 28 <mark>Review</mark>...",
  },
  {
    id: "search-doc-4",
    type: "document",
    title: "React Patterns",
    subtitle: "React Component Patterns · doc-4",
    url: "/app/documents/doc-4",
    matchPreview: "...<mark>React</mark> Component <mark>Patterns</mark>...",
  },
  {
    id: "search-doc-5",
    type: "document",
    title: "TypeScript Tips",
    subtitle: "TypeScript Utility Types · doc-5",
    url: "/app/documents/doc-5",
    matchPreview: "...<mark>TypeScript</mark> Utility Types...",
  },
  {
    id: "search-doc-6",
    type: "document",
    title: "Component Architecture",
    subtitle: "UI Component Architecture · doc-8",
    url: "/app/documents/doc-8",
    matchPreview: "...UI <mark>Component</mark> <mark>Architecture</mark>...",
  },
  {
    id: "search-doc-7",
    type: "document",
    title: "Styling Convention",
    subtitle: "Styling Convention · doc-9",
    url: "/app/documents/doc-9",
    matchPreview: "...<mark>Styling</mark> <mark>Convention</mark>...",
  },
  {
    id: "search-doc-8",
    type: "document",
    title: "API Endpoints",
    subtitle: "REST API Endpoints · doc-10",
    url: "/app/documents/doc-10",
    matchPreview: "...REST <mark>API</mark> <mark>Endpoints</mark>...",
  },
  {
    id: "search-cmt-1",
    type: "comment",
    title: "Comment by Alex Chen",
    subtitle: "on Meeting Notes",
    url: "/app/documents/doc-1",
    matchPreview: "...add a <mark>timeline</mark> for these action items?...",
  },
  {
    id: "search-cmt-2",
    type: "comment",
    title: "Comment by Sarah Kim",
    subtitle: "on Meeting Notes",
    url: "/app/documents/doc-1",
    matchPreview: "...<mark>dashboard</mark> redesign needs more detail...",
  },
  {
    id: "search-cmt-3",
    type: "comment",
    title: "Comment by You",
    subtitle: "on Meeting Notes",
    url: "/app/documents/doc-1",
    matchPreview: "...Updated the <mark>hiring</mark> reqs...",
  },
  {
    id: "search-act-1",
    type: "activity",
    title: "Alex Chen edited Component Architecture",
    subtitle: "Team Alpha · Frontend project",
    url: "/app/documents/doc-8",
    matchPreview: "...edited <mark>Component</mark> <mark>Architecture</mark>...",
  },
  {
    id: "search-act-2",
    type: "activity",
    title: "Sarah Kim joined Team Alpha",
    subtitle: "Team Alpha",
    url: "/app/workspaces/ws-2",
    matchPreview: "...<mark>joined</mark> Team Alpha...",
  },
  {
    id: "search-act-3",
    type: "activity",
    title: "Sarah Kim created Design System project",
    subtitle: "Team Alpha",
    url: "/app/workspaces/ws-2",
    matchPreview: "...created <mark>Design</mark> <mark>System</mark> project...",
  },
  {
    id: "search-act-4",
    type: "activity",
    title: "You edited React Patterns",
    subtitle: "Personal Workspace · Learning project",
    url: "/app/documents/doc-4",
    matchPreview: "...edited <mark>React</mark> <mark>Patterns</mark>...",
  },
  {
    id: "search-act-5",
    type: "activity",
    title: "Mike Torres accepted invite",
    subtitle: "Team Alpha",
    url: "/app/workspaces/ws-2",
    matchPreview: "...accepted <mark>invite</mark> to Team Alpha...",
  },
  {
    id: "search-act-6",
    type: "activity",
    title: "Alex Chen promoted you to admin",
    subtitle: "Team Alpha",
    url: "/app/workspaces/ws-2",
    matchPreview: "...<mark>promoted</mark> you to admin...",
  },
];

const searchIndex = mockSearchResults.reduce(
  (acc, item) => {
    const words = [item.title, item.subtitle, item.matchPreview]
      .join(" ")
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1);
    const unique = [...new Set(words)];
    for (const word of unique) {
      if (!acc.has(word)) acc.set(word, []);
      acc.get(word)!.push(item);
    }
    return acc;
  },
  new Map<string, SearchResultItem[]>()
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export function searchMock(query: string): SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryTokens = tokenize(trimmed);
  const scored = new Map<string, number>();

  for (const token of queryTokens) {
    const matches = searchIndex.get(token) ?? [];
    for (const item of matches) {
      scored.set(item.id, (scored.get(item.id) ?? 0) + 1);
    }
    // also check partial matches
    for (const [word, items] of searchIndex) {
      if (word.startsWith(token) && word !== token) {
        for (const item of items) {
          scored.set(item.id, (scored.get(item.id) ?? 0) + 0.5);
        }
      }
    }
  }

  // also match against title/subtitle as a whole
  for (const item of mockSearchResults) {
    const haystack = [item.title, item.subtitle, item.matchPreview.replace(/<[^>]+>/g, "")]
      .join(" ")
      .toLowerCase();
    if (haystack.includes(trimmed.toLowerCase())) {
      scored.set(item.id, (scored.get(item.id) ?? 0) + 2);
    }
  }

  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id]) => mockSearchResults.find((r) => r.id === id)!);
}
