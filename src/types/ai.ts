export type AiActionType =
  | "summarize"
  | "rewrite"
  | "expand"
  | "simplify"
  | "extract"
  | "action-items"
  | "project-summary"
  | "suggest-titles"
  | "custom";

export interface AiResponse {
  id: string;
  content: string;
  actionType: AiActionType;
  label: string;
  timestamp: Date;
  degraded?: boolean;
}

export interface AiRun {
  id: string;
  document_id: string | null;
  project_id: string | null;
  workspace_id: string | null;
  action_type: AiActionType;
  prompt: string;
  result: string;
  created_by: string;
  created_at: Date;
}

export interface AiSuggestion {
  id: string;
  label: string;
  prompt: string;
  actionType: AiActionType;
}

export interface AiSelectionContext {
  from: number;
  to: number;
  text: string;
}
