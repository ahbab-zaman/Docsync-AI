"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId, getDevUserName } from "@/lib/auth-helpers";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import {
  CACHE_KEYS,
  invalidateCache,
  setCached,
  withCache,
} from "@/lib/cache";
import { createActivityEvent } from "@/lib/notifications";

interface WorkspaceWithCounts {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  member_count: number;
  project_count: number;
  created_at: Date;
  projects: { id: string; name: string; description: string | null; document_count: number }[];
  members: { id: string; name: string; email: string; role: string; avatar_url: string | null }[];
}

interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
}

interface ProjectSummaryRow {
  id: string;
  name: string;
  description: string | null;
}

interface MemberRow {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: string;
}

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export async function getWorkspaces(): Promise<{ workspaces: WorkspaceWithCounts[] }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getWorkspaces" },
    async () => {
      const currentUserId = await getDevUserId();
      const cacheKey = CACHE_KEYS.workspaces(currentUserId);

      const result = await withCache<{ workspaces: WorkspaceWithCounts[] }>(
        cacheKey,
        async () => {
          const wsResult = await query<WorkspaceRow>(
            `SELECT w.* FROM workspaces w
             JOIN workspace_members wm ON wm.workspace_id = w.id
             WHERE wm.user_id = $1
             ORDER BY w.created_at DESC`,
            [currentUserId]
          );

          const workspaces: WorkspaceWithCounts[] = await Promise.all(
            wsResult.rows.map(async (w) => {
              const memberCount = await query("SELECT COUNT(*) as count FROM workspace_members WHERE workspace_id = $1", [w.id]);
              const projectCount = await query("SELECT COUNT(*) as count FROM projects WHERE workspace_id = $1", [w.id]);
              return {
                id: w.id,
                name: w.name,
                slug: w.slug,
                description: w.description,
                owner_id: w.owner_id,
                created_at: w.created_at,
                member_count: parseInt(memberCount.rows[0].count),
                project_count: parseInt(projectCount.rows[0].count),
                projects: [],
                members: [],
              };
            })
          );

          return { workspaces };
        },
        { key: cacheKey, ttlSeconds: 30 }
      );

      logger.info("Workspaces loaded", {
        action: "getWorkspaces",
        userId: currentUserId,
        durationMs: Date.now() - start,
        status: "success",
      });

      return result;
    }
  );
}

export async function getWorkspace(
  id: string
): Promise<{ workspace?: WorkspaceWithCounts; error?: string }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "getWorkspace", workspaceId: id },
    async () => {
      const wsResult = await query<WorkspaceRow>("SELECT * FROM workspaces WHERE id = $1", [id]);

      if (wsResult.rows.length === 0) {
        logger.warn("Workspace not found", {
          action: "getWorkspace",
          workspaceId: id,
          durationMs: Date.now() - start,
          status: "failure",
        });
        return { error: "Workspace not found" };
      }

      const cacheKey = CACHE_KEYS.workspace(id);

      const workspace = await withCache<WorkspaceWithCounts>(
        cacheKey,
        async () => {
          const w = wsResult.rows[0];

          const memberResult = await query<MemberRow>(
            `SELECT u.id, u.name, u.email, u.avatar_url, wm.role
             FROM workspace_members wm
             JOIN users u ON u.id = wm.user_id
             WHERE wm.workspace_id = $1`,
            [id]
          );

          const projectResult = await query<ProjectSummaryRow>(
            "SELECT id, name, description FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC",
            [id]
          );

          const projects = await Promise.all(
            projectResult.rows.map(async (p) => {
              const docCount = await query<{ count: string }>("SELECT COUNT(*) as count FROM documents WHERE project_id = $1", [p.id]);
              return {
                id: p.id,
                name: p.name,
                description: p.description,
                document_count: parseInt(docCount.rows[0].count),
              };
            })
          );

          return {
            id: w.id,
            name: w.name,
            slug: w.slug,
            description: w.description,
            owner_id: w.owner_id,
            created_at: w.created_at,
            member_count: memberResult.rows.length,
            project_count: projectResult.rows.length,
            projects,
            members: memberResult.rows.map((m) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              avatar_url: m.avatar_url,
              role: m.role,
            })),
          };
        },
        { key: cacheKey, ttlSeconds: 30 }
      );

      logger.info("Workspace loaded", {
        action: "getWorkspace",
        workspaceId: id,
        durationMs: Date.now() - start,
        status: "success",
      });

      return { workspace };
    }
  );
}

export async function createWorkspace(
  _prevState: { error?: string; success?: boolean; workspace?: WorkspaceWithCounts },
  formData: FormData
): Promise<{ error?: string; success?: boolean; workspace?: WorkspaceWithCounts }> {
  try {
    const currentUserId = await getDevUserId();
    const currentUserName = await getDevUserName();

    const data = createWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });

    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const result = await query<WorkspaceRow>(
      `INSERT INTO workspaces (name, slug, description, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, slug, data.description ?? null, currentUserId]
    );

    const ws = result.rows[0];

    await query(
      "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, 'owner')",
      [ws.id, currentUserId]
    );

    const workspace: WorkspaceWithCounts = {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      owner_id: ws.owner_id,
      created_at: ws.created_at,
      member_count: 1,
      project_count: 0,
      projects: [],
      members: [{ id: currentUserId, name: currentUserName, email: "dev@docsync.dev", avatar_url: null, role: "owner" }],
    };

    await createActivityEvent({
      type: "workspace_updated",
      description: `You created workspace ${ws.name}.`,
      workspaceId: ws.id,
      createdBy: currentUserId,
    });

    logger.info("Workspace created", {
      action: "createWorkspace",
      userId: currentUserId,
      workspaceId: ws.id,
      status: "success",
    });

    await setCached(CACHE_KEYS.workspace(ws.id), workspace, 30);
    await invalidateCache(CACHE_KEYS.workspaces(currentUserId));

    return { success: true, workspace };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Workspace validation failed", { action: "createWorkspace", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to create workspace", {
        action: "createWorkspace",
        message: error.message,
        status: "failure",
      });
      return { error: error.message };
    }
    return { error: "Failed to create workspace" };
  }
}

const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Name is too long")
    .optional(),
  description: z.string().max(500, "Description is too long").optional(),
});

export async function updateWorkspace(
  id: string,
  data: { name?: string; description?: string | null }
): Promise<{ success?: boolean; error?: string }> {
  try {
    const currentUserId = await getDevUserId();
    const parsed = updateWorkspaceSchema.parse(data);

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (parsed.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(parsed.name);
    }
    if (parsed.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(parsed.description);
    }

    if (fields.length === 0) return { success: true };

    fields.push("updated_at = NOW()");
    values.push(id);

    const result = await query(
      `UPDATE workspaces SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING id, name`,
      values
    );

    if (result.rows.length === 0) {
      logger.warn("Workspace not found for update", { action: "updateWorkspace", status: "failure" });
      return { error: "Workspace not found." };
    }

    const name = parsed.name ?? (result.rows[0] as { name: string }).name;

    await invalidateCache(CACHE_KEYS.workspace(id), CACHE_KEYS.workspaces(currentUserId));

    await createActivityEvent({
      type: "workspace_updated",
      description: `You updated the ${name} workspace.`,
      workspaceId: id,
      createdBy: currentUserId,
    });

    logger.info("Workspace updated", {
      action: "updateWorkspace",
      userId: currentUserId,
      workspaceId: id,
      status: "success",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Workspace update validation failed", { action: "updateWorkspace", status: "failure" });
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      logger.error("Failed to update workspace", {
        action: "updateWorkspace",
        message: error.message,
        status: "failure",
      });
      return { error: "Failed to update workspace." };
    }
    return { error: "Failed to update workspace." };
  }
}

export async function deleteWorkspace(
  id: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const currentUserId = await getDevUserId();

    const result = await query(
      "DELETE FROM workspaces WHERE id = $1 AND owner_id = $2 RETURNING id",
      [id, currentUserId]
    );

    if (result.rows.length === 0) {
      logger.warn("Workspace delete denied or not found", {
        action: "deleteWorkspace",
        status: "failure",
      });
      return { error: "Workspace not found or you do not have permission to delete it." };
    }

    await invalidateCache(
      CACHE_KEYS.workspace(id),
      CACHE_KEYS.workspaces(currentUserId),
      CACHE_KEYS.projects(id)
    );

    logger.info("Workspace deleted", {
      action: "deleteWorkspace",
      userId: currentUserId,
      workspaceId: id,
      status: "success",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Failed to delete workspace", {
        action: "deleteWorkspace",
        message: error.message,
        status: "failure",
      });
      return { error: "Failed to delete workspace." };
    }
    return { error: "Failed to delete workspace." };
  }
}
