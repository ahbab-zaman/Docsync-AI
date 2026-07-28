export type SearchResultType = "document" | "comment" | "activity";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  url: string;
  matchPreview: string;
}

export interface SearchResults {
  documents: SearchResultItem[];
  comments: SearchResultItem[];
  activity: SearchResultItem[];
}

export interface SearchState {
  query: string;
  results: SearchResults;
  loading: boolean;
  open: boolean;
}
