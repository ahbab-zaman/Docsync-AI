import type { AiActionType } from "@/types/ai";
import { logger } from "@/lib/logger";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "~deepseek/deepseek-v4-flash-latest";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export function isAiConfigured(): boolean {
  return Boolean(OPENROUTER_API_KEY);
}

const ACTION_SYSTEM_PROMPTS: Record<AiActionType, string> = {
  summarize:
    "Summarize the document content in 3-5 clear bullet points. Respond with HTML only: use <ul> with <li> items. No markdown, no extra commentary.",
  "action-items":
    "Extract the action items from the document as an ordered HTML list with <ol> and <li>. Bold the owner if mentioned. No markdown, no extra commentary.",
  rewrite:
    "Rewrite the document content in a professional tone. Respond with HTML paragraphs only. No markdown, no extra commentary.",
  expand:
    "Expand the document content with more detail, context, and examples. Respond with HTML paragraphs only. No markdown, no extra commentary.",
  simplify:
    "Simplify the document content so it is easy to understand. Respond with HTML using <ul>/<li> or <p>. No markdown, no extra commentary.",
  extract:
    "Extract the key information from the document as an HTML list. Use <strong> for labels. No markdown, no extra commentary.",
  "suggest-titles":
    "Suggest 5 alternative titles for the document as an HTML ordered list with <ol> and <li>. No markdown, no extra commentary.",
  "project-summary":
    "Generate a concise project summary based on the document. Respond with HTML using <p> and <ul>. No markdown, no extra commentary.",
  custom:
    "Answer the user's request based on the document content provided. Respond with clean HTML only. No markdown, no extra commentary.",
};

function buildUserPrompt(
  actionType: AiActionType,
  prompt: string,
  documentContent: string
): string {
  const contentLabel = documentContent.trim()
    ? documentContent
    : "(No document content provided)";
  return `${prompt}\n\n--- Document content ---\n${contentLabel}`;
}

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

export async function runAiCompletion(
  actionType: AiActionType,
  prompt: string,
  documentContent: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.AUTH_URL ?? "http://localhost:3000",
        "X-Title": "Docsync",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: ACTION_SYSTEM_PROMPTS[actionType] },
          { role: "user", content: buildUserPrompt(actionType, prompt, documentContent) },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => ({}))) as OpenRouterResponse;

    if (!res.ok) {
      const message =
        data.error?.message ?? `OpenRouter request failed with status ${res.status}`;
      throw new Error(message);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI provider");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export function getAiModelName(): string {
  return OPENROUTER_MODEL;
}

export function logAiConfig(): void {
  if (isAiConfigured()) {
    logger.info("AI provider configured", {
      action: "ai:init",
      provider: "openrouter",
      model: OPENROUTER_MODEL,
      status: "success",
    });
  } else {
    logger.warn("OPENROUTER_API_KEY not set, AI will use mock responses", {
      action: "ai:init",
      status: "degraded",
    });
  }
}
