"use server";

import { z } from "zod";
import {
  getMockComments,
  addMockComment,
  addMockReply,
  resolveMockComment,
  mockMentionUsers,
} from "@/data/mock-comments";
import type { Comment, MentionUser } from "@/types/comments";

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

export async function getComments(
  documentId: string
): Promise<{ comments: Comment[]; error?: string }> {
  try {
    const comments = getMockComments(documentId);
    return { comments };
  } catch {
    return { comments: [], error: "Failed to load comments" };
  }
}

export async function createComment(
  data: { documentId: string; content: string; selectionRange: { from: number; to: number } | null }
): Promise<{ comment?: Comment; error?: string }> {
  try {
    const parsed = addCommentSchema.parse(data);
    const comment = addMockComment(
      parsed.documentId,
      currentUserId,
      currentUserName,
      parsed.content,
      parsed.selectionRange
    );
    return { comment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    return { error: "Failed to create comment" };
  }
}

export async function createReply(
  data: { commentId: string; content: string }
): Promise<{ reply?: Comment["replies"][0]; error?: string }> {
  try {
    const parsed = addReplySchema.parse(data);
    const reply = addMockReply(parsed.commentId, currentUserId, currentUserName, parsed.content);
    if (!reply) {
      return { error: "Comment not found" };
    }
    return { reply };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    return { error: "Failed to create reply" };
  }
}

export async function resolveComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = resolveMockComment(commentId);
    if (!result) {
      return { success: false, error: "Comment not found" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to resolve comment" };
  }
}

export async function getMentionUsers(): Promise<{ users: MentionUser[] }> {
  return { users: mockMentionUsers };
}
