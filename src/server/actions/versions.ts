"use server";

import { z } from "zod";
import {
  getMockVersions,
  addMockVersion,
  getMockVersionById,
} from "@/data/mock-versions";
import type { DocumentVersion } from "@/types/versions";

const currentUserId = "user-1";
const currentUserName = "You";

const createVersionSchema = z.object({
  documentId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string(),
});

export async function getVersions(
  documentId: string
): Promise<{ versions: DocumentVersion[]; error?: string }> {
  try {
    const versions = getMockVersions(documentId);
    return { versions };
  } catch {
    return { versions: [], error: "Failed to load versions" };
  }
}

export async function createVersion(
  data: { documentId: string; title: string; content: string }
): Promise<{ version?: DocumentVersion; error?: string }> {
  try {
    const parsed = createVersionSchema.parse(data);
    const version = addMockVersion(
      parsed.documentId,
      parsed.title,
      parsed.content,
      currentUserId,
      currentUserName
    );
    return { version };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    return { error: "Failed to create version" };
  }
}

export async function restoreVersion(
  versionId: string
): Promise<{ content?: string; version?: DocumentVersion; error?: string }> {
  try {
    const version = getMockVersionById(versionId);
    if (!version) {
      return { error: "Version not found" };
    }
    return { content: version.content, version };
  } catch {
    return { error: "Failed to restore version" };
  }
}
