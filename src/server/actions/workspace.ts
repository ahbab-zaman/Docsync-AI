"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId, getDevUserName } from "@/lib/auth-helpers";

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

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export async function getWorkspaces(): Promise<{ workspaces: WorkspaceWithCounts[] }> {
  const currentUserId = await getDevUserId();

  const wsResult = await query(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE wm.user_id = $1
     ORDER BY w.created_at DESC`,
    [currentUserId]
  );

  const workspaces: WorkspaceWithCounts[] = await Promise.all(
    wsResult.rows.map(async (w: any) => {
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
}

export async function getWorkspace(
  id: string
): Promise<{ workspace?: WorkspaceWithCounts; error?: string }> {
  const wsResult = await query("SELECT * FROM workspaces WHERE id = $1", [id]);

  if (wsResult.rows.length === 0) {
    return { error: "Workspace not found" };
  }

  const w: any = wsResult.rows[0];

  const memberResult = await query(
    `SELECT u.id, u.name, u.email, u.avatar_url, wm.role
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1`,
    [id]
  );

  const projectResult = await query(
    "SELECT id, name, description FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC",
    [id]
  );

  const projects = await Promise.all(
    projectResult.rows.map(async (p: any) => {
      const docCount = await query("SELECT COUNT(*) as count FROM documents WHERE project_id = $1", [p.id]);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        document_count: parseInt(docCount.rows[0].count),
      };
    })
  );

  const workspace: WorkspaceWithCounts = {
    id: w.id,
    name: w.name,
    slug: w.slug,
    description: w.description,
    owner_id: w.owner_id,
    created_at: w.created_at,
    member_count: memberResult.rows.length,
    project_count: projectResult.rows.length,
    projects,
    members: memberResult.rows.map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      avatar_url: m.avatar_url,
      role: m.role,
    })),
  };

  return { workspace };
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

    const result = await query(
      `INSERT INTO workspaces (name, slug, description, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, slug, data.description ?? null, currentUserId]
    );

    const ws: any = result.rows[0];

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

    return { success: true, workspace };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create workspace" };
  }
}
