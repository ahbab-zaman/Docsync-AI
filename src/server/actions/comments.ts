"use server";

import { z } from "zod";
import {
  addMockComment,
  addMockReply,
  resolveMockComment,
} from "@/data/mock-comments";
import type { Comment } from "@/types/comments";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";

const currentUserId = "user-1";
const currentUserName = "You";

const addCommentSchema = z.object({
  documentId: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  selectionRange: z
    .object({
      from: z.number(),
      to: z.number(),
    })
    .nullable(),
});

const addReplySchema = z.object({
  commentId: z.string().min(1),
  content: z.string().min(1, "Reply cannot be empty").max(2000),
});

export async function createComment(
  data: { documentId: string; content: string; selectionRange: { from: number; to: number } | null }
): Promise<{ comment?: Comment; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "createComment" },
    async () => {
      try {
        const parsed = addCommentSchema.parse(data);
        const comment = addMockComment(
          parsed.documentId,
          currentUserId,
          currentUserName,
          parsed.content,
          parsed.selectionRange
        );
        logger.info("Comment created", {
          action: "createComment",
          userId: currentUserId,
          status: "success",
        });
        return { comment };
      } catch (error) {
        if (error instanceof z.ZodError) {
          logger.warn("Comment validation failed", { action: "createComment", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        logger.error("Failed to create comment", {
          action: "createComment",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to create comment" };
      }
    }
  );
}

export async function createReply(
  data: { commentId: string; content: string }
): Promise<{ reply?: Comment["replies"][0]; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "createReply" },
    async () => {
      try {
        const parsed = addReplySchema.parse(data);
        const reply = addMockReply(parsed.commentId, currentUserId, currentUserName, parsed.content);
        if (!reply) {
          logger.warn("Comment not found for reply", { action: "createReply", status: "failure" });
          return { error: "Comment not found" };
        }
        logger.info("Comment reply created", {
          action: "createReply",
          userId: currentUserId,
          status: "success",
        });
        return { reply };
      } catch (error) {
        if (error instanceof z.ZodError) {
          logger.warn("Reply validation failed", { action: "createReply", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        logger.error("Failed to create reply", {
          action: "createReply",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to create reply" };
      }
    }
  );
}

export async function resolveComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "resolveComment" },
    async () => {
      try {
        const result = resolveMockComment(commentId);
        if (!result) {
          logger.warn("Comment not found for resolve", { action: "resolveComment", status: "failure" });
          return { success: false, error: "Comment not found" };
        }
        logger.info("Comment resolved", {
          action: "resolveComment",
          userId: currentUserId,
          status: "success",
        });
        return { success: true };
      } catch (error) {
        logger.error("Failed to resolve comment", {
          action: "resolveComment",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { success: false, error: "Failed to resolve comment" };
      }
    }
  );
}
