import { query } from "@/server/db";
import type { Document } from "@/types";

export async function createDocument(
  projectId: string,
  createdBy: string,
  title = "Untitled"
): Promise<Document> {
  const result = await query<Document>(
    `INSERT INTO documents (title, project_id, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, projectId, createdBy]
  );
  return result.rows[0];
}

export async function findDocumentById(id: string): Promise<Document | null> {
  const result = await query<Document>(
    "SELECT * FROM documents WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findDocumentsByProjectId(projectId: string): Promise<Document[]> {
  const result = await query<Document>(
    "SELECT * FROM documents WHERE project_id = $1 ORDER BY updated_at DESC",
    [projectId]
  );
  return result.rows;
}

export async function updateDocument(
  id: string,
  data: Partial<Pick<Document, "title" | "content">>
): Promise<Document | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  if (data.content !== undefined) {
    fields.push(`content = $${paramIndex++}`);
    values.push(data.content);
  }

  if (fields.length === 0) return findDocumentById(id);

  fields.push("updated_at = NOW()");
  values.push(id);

  const result = await query<Document>(
    `UPDATE documents SET ${fields.join(", ")} WHERE id = $${paramIndex}
     RETURNING *`,
    values
  );
  return result.rows[0] ?? null;
}

export async function deleteDocument(id: string): Promise<void> {
  await query("DELETE FROM documents WHERE id = $1", [id]);
}
