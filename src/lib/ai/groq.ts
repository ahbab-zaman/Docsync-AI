import type { AiActionType } from "@/types/ai";
import { logger } from "@/lib/logger";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "groq/compound-mini";
const GROQ_MODEL_VERSION = process.env.GROQ_MODEL_VERSION ?? "latest";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export function isAiConfigured(): boolean {
  return Boolean(GROQ_API_KEY);
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

function buildUserPrompt(prompt: string, documentContent: string): string {
  const contentLabel = documentContent.trim()
    ? documentContent
    : "(No document content provided)";
  return `${prompt}\n\n--- Document content ---\n${contentLabel}`;
}

interface GroqResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

export async function runAiCompletion(
  actionType: AiActionType,
  prompt: string,
  documentContent: string
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
        "Groq-Model-Version": GROQ_MODEL_VERSION,
        "X-Title": "Docsync",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: ACTION_SYSTEM_PROMPTS[actionType] },
          { role: "user", content: buildUserPrompt(prompt, documentContent) },
        ],
        temperature: 0.7,
        max_completion_tokens: 2000,
      }),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => ({}))) as GroqResponse;

    if (!res.ok) {
      const message = data.error?.message ?? `Groq request failed with status ${res.status}`;
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
  return GROQ_MODEL;
}

export function logAiConfig(): void {
  if (isAiConfigured()) {
    logger.info("AI provider configured", {
      action: "ai:init",
      provider: "groq",
      model: GROQ_MODEL,
      status: "success",
    });
  } else {
    logger.warn("GROQ_API_KEY not set, AI will use mock responses", {
      action: "ai:init",
      status: "degraded",
    });
  }
}
