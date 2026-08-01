"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import {
  CACHE_KEYS,
  invalidateProjectCache,
  invalidateWorkspaceCache,
  setCached,
  withCache,
} from "@/lib/cache";

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

const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name is too long").optional(),
  description: z.string().max(500, "Description is too long").nullable().optional(),
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

export async function getProjects(
  workspaceId: string
): Promise<{ projects: ProjectFull[] }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getProjects", workspaceId },
    async () => {
      const cacheKey = CACHE_KEYS.projects(workspaceId);

      const result = await withCache<{ projects: ProjectFull[] }>(
        cacheKey,
        async () => {
          const result = await query<ProjectRow>(
            "SELECT * FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC",
            [workspaceId]
          );

          const rows = result.rows;
          const projects: ProjectFull[] = await Promise.all(
            rows.map(async (p) => {
              const docResult = await query<DocumentSummaryRow>(
                `SELECT d.id, d.title, d.content, d.updated_at, u.name as created_by_name
                 FROM documents d JOIN users u ON u.id = d.created_by
                 WHERE d.project_id = $1 ORDER BY d.updated_at DESC`,
                [p.id]
              );
              const docs: ProjectFull["documents"] = docResult.rows.map((d) => ({
                id: d.id,
                title: d.title,
                content: d.content,
                created_by_name: d.created_by_name,
                updated_at: d.updated_at,
              }));
              return {
                id: p.id,
                name: p.name,
                description: p.description,
                workspace_id: p.workspace_id,
                created_by: p.created_by,
                created_at: p.created_at,
                updated_at: p.updated_at,
                document_count: docResult.rows.length,
                documents: docs,
              };
            })
          );

          return { projects };
        },
        { key: cacheKey, ttlSeconds: 30 }
      );

      logger.info("Projects loaded", {
        action: "getProjects",
        workspaceId,
        durationMs: Date.now() - start,
        status: "success",
      });

      return result;
    }
  );
}

export async function getProject(
  id: string
): Promise<{ project?: ProjectFull; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getProject", workspaceId: id },
    async () => {
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
    const currentUserId = await getDevUserId();

    const data = createProjectSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      workspaceId: formData.get("workspaceId"),
    });

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

export async function updateProjectAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const id = formData.get("projectId") as string;
    const data = updateProjectSchema.parse({
      name: formData.get("name") || undefined,
      description: formData.get("description") !== undefined
        ? (formData.get("description") as string) || null : undefined,
    });

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }

    if (fields.length === 0) return { success: true };

    fields.push("updated_at = NOW()");
    values.push(id);

    const result = await query(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING id`,
      values
    );

    if (result.rows.length === 0) {
      logger.warn("Project not found for update", { action: "updateProjectAction", status: "failure" });
      return { error: "Project not found" };
    }

    logger.info("Project updated", {
      action: "updateProjectAction",
      status: "success",
    });

    await invalidateProjectCache(id);

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Project update validation failed", { action: "updateProjectAction", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to update project", {
        action: "updateProjectAction",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to update project" };
  }
}

export async function archiveProjectAction(
  id: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = await query(
      "SELECT workspace_id FROM projects WHERE id = $1",
      [id]
    );
    await query("DELETE FROM projects WHERE id = $1", [id]);
    const workspaceId = result.rows[0]?.workspace_id as string | undefined;
    await invalidateProjectCache(id, workspaceId);
    if (workspaceId) {
      await invalidateWorkspaceCache(workspaceId);
    }
    logger.info("Project archived", { action: "archiveProjectAction", status: "success" });
    return { success: true };
  } catch (error) {
    logger.error("Failed to archive project", {
      action: "archiveProjectAction",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "failure",
    });
    return { error: "Failed to delete project" };
  }
}
