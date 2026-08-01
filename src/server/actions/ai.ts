"use server";

import type { AiActionType, AiResponse } from "@/types/ai";
import { getMockAiResponse } from "@/data/mock-ai";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";

export async function runAiAction(
  actionType: AiActionType,
  prompt: string,
  documentContent: string
): Promise<{ response?: AiResponse; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: `ai:${actionType}` },
    async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
        const response = getMockAiResponse(actionType, prompt, documentContent);
        logger.info("AI request completed", {
          action: `ai:${actionType}`,
          durationMs: Date.now() - start,
          status: "success",
        });
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
