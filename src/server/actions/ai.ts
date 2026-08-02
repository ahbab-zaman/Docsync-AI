"use server";

import type { AiActionType, AiResponse } from "@/types/ai";
import { getMockAiResponse } from "@/data/mock-ai";
import { query } from "@/lib/db";
import {
  getCurrentUserId,
  requireWorkspaceAccess,
  resolveDocumentWorkspaceId,
  ANY_MEMBER,
} from "@/server/access";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import { runAiCompletion, isAiConfigured } from "@/lib/ai/openrouter";
import { sanitizeHtml } from "@/lib/ai/sanitize";

function getResponseLabel(actionType: AiActionType): string {
  const labelMap: Record<AiActionType, string> = {
    summarize: "Summary",
    "action-items": "Action items",
    rewrite: "Rewritten version",
    expand: "Expanded version",
    simplify: "Simplified version",
    extract: "Extracted information",
    "suggest-titles": "Suggested titles",
    "project-summary": "Project summary",
    custom: "AI Response",
  };
  return labelMap[actionType];
}

export interface AiDocumentOption {
  id: string;
  title: string;
  content: string;
  project_name: string;
  workspace_name: string;
}

export async function getAiDocuments(): Promise<{ documents: AiDocumentOption[] }> {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return { documents: [] };
  }
  const result = await query<AiDocumentOption>(
    `SELECT d.id, d.title, d.content, p.name AS project_name, w.name AS workspace_name
     FROM documents d
     JOIN projects p ON p.id = d.project_id
     JOIN workspaces w ON w.id = p.workspace_id
     JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE wm.user_id = $1
     ORDER BY d.updated_at DESC
     LIMIT 200`,
    [currentUserId]
  );
  return { documents: result.rows };
}

export async function runAiAction(
  actionType: AiActionType,
  prompt: string,
  documentContent: string,
  documentId?: string | null
): Promise<{ response?: AiResponse; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: `ai:${actionType}` },
    async () => {
      try {
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
          return { error: "Please sign in to continue." };
        }

        if (documentId) {
          const workspaceId = await resolveDocumentWorkspaceId(documentId);
          if (!workspaceId) {
            return { error: "Document not found." };
          }
          const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
          if (!access.ok) {
            logger.warn("AI request denied: not a workspace member", {
              action: `ai:${actionType}`,
              status: "failure",
            });
            return { error: access.error };
          }
        }

        let content: string;
        if (isAiConfigured()) {
          try {
            content = await runAiCompletion(actionType, prompt, documentContent);
            logger.info("AI provider request completed", {
              action: `ai:${actionType}`,
              durationMs: Date.now() - start,
              status: "success",
            });
          } catch (providerError) {
            logger.error("AI provider request failed, falling back to mock", {
              action: `ai:${actionType}`,
              message:
                providerError instanceof Error
                  ? providerError.message
                  : "Unknown error",
              status: "degraded",
            });
            content = getMockAiResponse(actionType, prompt, documentContent).content;
          }
        } else {
          logger.warn("AI provider not configured, using mock response", {
            action: `ai:${actionType}`,
            status: "degraded",
          });
          content = getMockAiResponse(actionType, prompt, documentContent).content;
        }

        const safeContent = sanitizeHtml(content);

        await query(
          `INSERT INTO ai_runs (document_id, action_type, prompt, result, created_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [documentId ?? null, actionType, prompt, safeContent, currentUserId]
        ).catch((insertError) => {
          logger.warn("Failed to persist AI run", {
            action: `ai:${actionType}`,
            message:
              insertError instanceof Error ? insertError.message : "Unknown error",
            status: "failure",
          });
        });

        const response: AiResponse = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          content: safeContent,
          actionType,
          label: getResponseLabel(actionType),
          timestamp: new Date(),
        };

        return { response };
      } catch (error) {
        logger.error("AI request failed", {
          action: `ai:${actionType}`,
          message: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - start,
          status: "failure",
        });
        return { error: "AI generation failed. Please try again." };
      }
    }
  );
}
