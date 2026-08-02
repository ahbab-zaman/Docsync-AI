"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import {
  getCurrentUserInfo,
  requireWorkspaceAccess,
  resolveDocumentWorkspaceId,
  ANY_MEMBER,
} from "@/server/access";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import { CACHE_KEYS, invalidateCache, invalidateProjectCache, withCache } from "@/lib/cache";
import {
  createActivityEvent,
  notifyWorkspaceMembers,
  createThrottledDocumentUpdatedActivity,
} from "@/lib/notifications";

interface DocumentFull {
  id: string;
  title: string;
  content: string;
  project_id: string;
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
}

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  projectId: z.string().min(1, "Project is required"),
});

const saveDocumentSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().optional(),
});

interface DocumentRow {
  id: string;
  title: string;
  content: string;
  project_id: string;
  created_by: string;
  created_by_name?: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapDocument(row: DocumentRow): DocumentFull {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    project_id: row.project_id,
    created_by: row.created_by,
    created_by_name: row.created_by_name ?? "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getDocument(
  id: string
): Promise<{ document?: DocumentFull; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getDocument" },
    async () => {
      const workspaceId = await resolveDocumentWorkspaceId(id);
      if (!workspaceId) {
        return { error: "Document not found" };
      }
      const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
      if (!access.ok) {
        logger.warn("Document access denied", {
          action: "getDocument",
          documentId: id,
          status: "failure",
        });
        return { error: access.error };
      }

      const cacheKey = CACHE_KEYS.document(id);

      const document = await withCache<DocumentFull | null>(
        cacheKey,
        async () => {
          const result = await query<DocumentRow>(
            `SELECT d.*, u.name as created_by_name
             FROM documents d
             JOIN users u ON u.id = d.created_by
             WHERE d.id = $1`,
            [id]
          );

          if (result.rows.length === 0) {
            return null;
          }

          return mapDocument(result.rows[0]);
        },
        { key: cacheKey, ttlSeconds: 15 }
      );

      if (!document) {
        logger.warn("Document not found", {
          action: "getDocument",
          status: "failure",
          durationMs: Date.now() - start,
        });
        return { error: "Document not found" };
      }

      logger.info("Document loaded", {
        action: "getDocument",
        status: "success",
        durationMs: Date.now() - start,
      });

      return { document };
    }
  );
}

export async function createDocument(
  _prevState: { error?: string; success?: boolean; document?: DocumentFull },
  formData: FormData
): Promise<{ error?: string; success?: boolean; document?: DocumentFull }> {
  try {
    const data = createDocumentSchema.parse({
      title: formData.get("title"),
      projectId: formData.get("projectId"),
    });

    const projectResult = await query<{ workspace_id: string }>(
      "SELECT workspace_id FROM projects WHERE id = $1",
      [data.projectId]
    );
    const workspaceId = projectResult.rows[0]?.workspace_id;
    if (!workspaceId) {
      return { error: "Project not found." };
    }

    const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
    if (!access.ok) {
      logger.warn("Document create denied", {
        action: "createDocument",
        projectId: data.projectId,
        status: "failure",
      });
      return { error: access.error };
    }
    const currentUser = await getCurrentUserInfo();
    const currentUserId = access.userId;
    const currentUserName = currentUser?.name ?? "";

    const result = await query<DocumentRow>(
      `INSERT INTO documents (title, content, project_id, created_by)
       VALUES ($1, '', $2, $3) RETURNING *`,
      [data.title, data.projectId, currentUserId]
    );

    const doc = mapDocument({ ...result.rows[0], created_by_name: currentUserName });

    await invalidateProjectCache(data.projectId);

    if (workspaceId) {
      await Promise.all([
        createActivityEvent({
          type: "document_updated",
          description: `You created document ${doc.title}.`,
          workspaceId,
          createdBy: currentUserId,
        }),
        notifyWorkspaceMembers({
          workspaceId,
          type: "document_updated",
          title: `New document: ${doc.title}`,
          description: `A new document was created in this workspace.`,
          createdBy: currentUserId,
          excludeUserId: currentUserId,
        }),
      ]);
    }

    logger.info("Document created", {
      action: "createDocument",
      userId: currentUserId,
      status: "success",
    });

    return { success: true, document: doc };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Document validation failed", { action: "createDocument", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to create document", {
        action: "createDocument",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to create document" };
  }
}

export async function saveDocument(
  id: string,
  data: { title?: string; content?: string }
): Promise<{ success?: boolean; error?: string }> {
  try {
    const workspaceId = await resolveDocumentWorkspaceId(id);
    if (!workspaceId) {
      return { error: "Document not found" };
    }
    const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
    if (!access.ok) {
      logger.warn("Document save denied", {
        action: "saveDocument",
        documentId: id,
        status: "failure",
      });
      return { error: access.error };
    }

    const parsed = saveDocumentSchema.parse(data);
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (parsed.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(parsed.title);
    }
    if (parsed.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(parsed.content);
    }

    if (fields.length === 0) return { success: true };

    fields.push("updated_at = NOW()");
    values.push(id);

    const result = await query(
      `UPDATE documents SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING id`,
      values
    );

    if (result.rows.length === 0) {
      logger.warn("Document not found for save", { action: "saveDocument", status: "failure" });
      return { error: "Document not found" };
    }

    logger.info("Document saved", {
      action: "saveDocument",
      status: "success",
      fields: fields.length,
    });

    await invalidateCache(CACHE_KEYS.document(id));

    if (workspaceId) {
      await createThrottledDocumentUpdatedActivity({
        workspaceId,
        description: `A document was updated in this workspace.`,
        createdBy: access.userId,
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Document save validation failed", { action: "saveDocument", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to save document", {
        action: "saveDocument",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to save document" };
  }
}

export async function deleteDocument(
  id: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const workspaceId = await resolveDocumentWorkspaceId(id);
    if (!workspaceId) {
      return { error: "Document not found or you do not have permission to delete it." };
    }
    const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
    if (!access.ok) {
      logger.warn("Document delete denied", {
        action: "deleteDocument",
        documentId: id,
        status: "failure",
      });
      return { error: access.error };
    }
    const currentUserId = access.userId;

    const docResult = await query<{ project_id: string; created_by: string }>(
      "SELECT project_id, created_by FROM documents WHERE id = $1",
      [id]
    );
    const doc = docResult.rows[0];

    if (!doc) {
      logger.warn("Document delete denied or not found", {
        action: "deleteDocument",
        status: "failure",
      });
      return { error: "Document not found or you do not have permission to delete it." };
    }

    const isOwner = access.role === "owner";
    const isAdmin = access.role === "admin";
    const isCreator = doc.created_by === currentUserId;
    if (!isOwner && !isAdmin && !isCreator) {
      logger.warn("Document delete denied (not creator or admin)", {
        action: "deleteDocument",
        documentId: id,
        status: "failure",
      });
      return { error: "You do not have permission to delete this document." };
    }

    const result = await query(
      "DELETE FROM documents WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return { error: "Document not found." };
    }

    await invalidateCache(CACHE_KEYS.document(id));
    await invalidateProjectCache(doc.project_id);

    logger.info("Document deleted", {
      action: "deleteDocument",
      userId: currentUserId,
      documentId: id,
      status: "success",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Failed to delete document", {
        action: "deleteDocument",
        message: error.message,
        status: "failure",
      });
      return { error: "Failed to delete document." };
    }
    return { error: "Failed to delete document." };
  }
}
