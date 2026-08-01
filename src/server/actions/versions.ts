"use server";

import { z } from "zod";
import {
  getMockVersions,
  addMockVersion,
  getMockVersionById,
} from "@/data/mock-versions";
import type { DocumentVersion } from "@/types/versions";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";

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
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getVersions" },
    async () => {
      try {
        const versions = getMockVersions(documentId);
        logger.info("Versions loaded", {
          action: "getVersions",
          status: "success",
        });
        return { versions };
      } catch (error) {
        logger.error("Failed to load versions", {
          action: "getVersions",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { versions: [], error: "Failed to load versions" };
      }
    }
  );
}

export async function createVersion(
  data: { documentId: string; title: string; content: string }
): Promise<{ version?: DocumentVersion; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "createVersion" },
    async () => {
      try {
        const parsed = createVersionSchema.parse(data);
        const version = addMockVersion(
          parsed.documentId,
          parsed.title,
          parsed.content,
          currentUserId,
          currentUserName
        );
        logger.info("Version created", {
          action: "createVersion",
          userId: currentUserId,
          status: "success",
        });
        return { version };
      } catch (error) {
        if (error instanceof z.ZodError) {
          logger.warn("Version validation failed", { action: "createVersion", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        logger.error("Failed to create version", {
          action: "createVersion",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to create version" };
      }
    }
  );
}

export async function restoreVersion(
  versionId: string
): Promise<{ content?: string; version?: DocumentVersion; error?: string }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "restoreVersion" },
    async () => {
      try {
        const version = getMockVersionById(versionId);
        if (!version) {
          logger.warn("Version not found", { action: "restoreVersion", status: "failure" });
          return { error: "Version not found" };
        }
        logger.info("Version restored", {
          action: "restoreVersion",
          userId: currentUserId,
          status: "success",
        });
        return { content: version.content, version };
      } catch (error) {
        logger.error("Failed to restore version", {
          action: "restoreVersion",
          message: error instanceof Error ? error.message : "Unknown error",
          status: "failure",
        });
        return { error: "Failed to restore version" };
      }
    }
  );
}
