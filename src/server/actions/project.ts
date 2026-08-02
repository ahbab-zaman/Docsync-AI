"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import {
  requireWorkspaceAccess,
  ANY_MEMBER,
} from "@/server/access";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import {
  CACHE_KEYS,
  invalidateProjectCache,
  setCached,
  withCache,
} from "@/lib/cache";
import { createActivityEvent, notifyWorkspaceMembers } from "@/lib/notifications";

interface ProjectFull {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  document_count: number;
  documents: {
    id: string;
    title: string;
    content: string;
    created_by_name: string;
    updated_at: Date;
  }[];
}

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  workspaceId: z.string().min(1, "Workspace is required"),
});

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

interface DocumentSummaryRow {
  id: string;
  title: string;
  content: string;
  created_by_name: string;
  updated_at: Date;
}

async function requireProjectAccess(
  projectId: string
): Promise<
  | { ok: true; workspaceId: string; userId: string }
  | { ok: false; error: string }
> {
  const result = await query<{ workspace_id: string }>(
    "SELECT workspace_id FROM projects WHERE id = $1",
    [projectId]
  );
  const workspaceId = result.rows[0]?.workspace_id;
  if (!workspaceId) {
    return { ok: false, error: "Project not found" };
  }
  const access = await requireWorkspaceAccess(workspaceId, ANY_MEMBER);
  if (!access.ok) {
    return { ok: false, error: access.error };
  }
  return { ok: true, workspaceId, userId: access.userId };
}

export async function getProject(
  id: string
): Promise<{ project?: ProjectFull; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getProject", workspaceId: id },
    async () => {
      const access = await requireProjectAccess(id);
      if (!access.ok) {
        logger.warn("Project access denied", {
          action: "getProject",
          projectId: id,
          status: "failure",
        });
        return { error: access.error };
      }

      const cacheKey = CACHE_KEYS.project(id);

      const project = await withCache<ProjectFull | null>(
        cacheKey,
        async () => {
          const result = await query<ProjectRow>("SELECT * FROM projects WHERE id = $1", [id]);

          if (result.rows.length === 0) {
            return null;
          }

          const p = result.rows[0];

          const docResult = await query<DocumentSummaryRow>(
            `SELECT d.id, d.title, d.content, d.updated_at, u.name as created_by_name
             FROM documents d JOIN users u ON u.id = d.created_by
             WHERE d.project_id = $1 ORDER BY d.updated_at DESC`,
            [p.id]
          );

          return {
            id: p.id,
            name: p.name,
            description: p.description,
            workspace_id: p.workspace_id,
            created_by: p.created_by,
            created_at: p.created_at,
            updated_at: p.updated_at,
            document_count: docResult.rows.length,
            documents: docResult.rows.map((d) => ({
              id: d.id,
              title: d.title,
              content: d.content,
              created_by_name: d.created_by_name,
              updated_at: d.updated_at,
            })),
          };
        },
        { key: cacheKey, ttlSeconds: 30 }
      );

      if (!project) {
        logger.warn("Project not found", {
          action: "getProject",
          status: "failure",
          durationMs: Date.now() - start,
        });
        return { error: "Project not found" };
      }

      logger.info("Project loaded", {
        action: "getProject",
        status: "success",
        durationMs: Date.now() - start,
      });

      return { project };
    }
  );
}

export async function createProject(
  _prevState: { error?: string; success?: boolean; project?: ProjectFull },
  formData: FormData
): Promise<{ error?: string; success?: boolean; project?: ProjectFull }> {
  try {
    const data = createProjectSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      workspaceId: formData.get("workspaceId"),
    });

    const access = await requireWorkspaceAccess(data.workspaceId, ANY_MEMBER);
    if (!access.ok) {
      logger.warn("Project create denied", {
        action: "createProject",
        workspaceId: data.workspaceId,
        status: "failure",
      });
      return { error: access.error };
    }
    const currentUserId = access.userId;

    const result = await query<ProjectRow>(
      `INSERT INTO projects (name, description, workspace_id, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.description ?? null, data.workspaceId, currentUserId]
    );

    const r = result.rows[0];
    const project: ProjectFull = {
      id: r.id,
      name: r.name,
      description: r.description,
      workspace_id: r.workspace_id,
      created_by: r.created_by,
      created_at: r.created_at,
      updated_at: r.updated_at,
      document_count: 0,
      documents: [],
    };

    logger.info("Project created", {
      action: "createProject",
      userId: currentUserId,
      workspaceId: data.workspaceId,
      status: "success",
    });

    await setCached(CACHE_KEYS.project(r.id), project, 30);
    await invalidateProjectCache(r.id, data.workspaceId);

    await Promise.all([
      createActivityEvent({
        type: "project_created",
        description: `You created project ${r.name}.`,
        workspaceId: data.workspaceId,
        createdBy: currentUserId,
      }),
      notifyWorkspaceMembers({
        workspaceId: data.workspaceId,
        type: "project_created",
        title: `New project: ${r.name}`,
        description: `A new project was created in this workspace.`,
        createdBy: currentUserId,
        excludeUserId: currentUserId,
      }),
    ]);

    return { success: true, project };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Project validation failed", { action: "createProject", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to create project", {
        action: "createProject",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to create project" };
  }
}
