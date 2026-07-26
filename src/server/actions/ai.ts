"use server";

import type { AiActionType, AiResponse } from "@/types/ai";
import { getMockAiResponse } from "@/data/mock-ai";

export async function runAiAction(
  actionType: AiActionType,
  prompt: string,
  documentContent: string
): Promise<{ response?: AiResponse; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
    const response = getMockAiResponse(actionType, prompt, documentContent);
    return { response };
  } catch {
    return { error: "AI generation failed. Please try again." };
  }
}

export async function saveAiResult(
  documentId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!documentId || !content) {
      return { success: false, error: "Document ID and content are required." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save AI result. Please try again." };
  }
}
