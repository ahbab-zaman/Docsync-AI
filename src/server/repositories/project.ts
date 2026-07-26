import { query } from "@/server/db";
import type { Project } from "@/types";

export async function createProject(
  name: string,
  workspaceId: string,
  createdBy: string,
  description?: string
): Promise<Project> {
  const result = await query<Project>(
    `INSERT INTO projects (name, description, workspace_id, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description ?? null, workspaceId, createdBy]
  );
  return result.rows[0];
}

export async function findProjectById(id: string): Promise<Project | null> {
  const result = await query<Project>(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findProjectsByWorkspaceId(workspaceId: string): Promise<Project[]> {
  const result = await query<Project>(
    "SELECT * FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC",
    [workspaceId]
  );
  return result.rows;
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, "name" | "description">>
): Promise<Project | null> {
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

  if (fields.length === 0) return findProjectById(id);

  fields.push("updated_at = NOW()");
  values.push(id);

  const result = await query<Project>(
    `UPDATE projects SET ${fields.join(", ")} WHERE id = $${paramIndex}
     RETURNING *`,
    values
  );
  return result.rows[0] ?? null;
}

export async function deleteProject(id: string): Promise<void> {
  await query("DELETE FROM projects WHERE id = $1", [id]);
}
