"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId, getDevUserName } from "@/lib/auth-helpers";

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

function mapDocument(row: any): DocumentFull {
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
  const result = await query(
    `SELECT d.*, u.name as created_by_name
     FROM documents d
     JOIN users u ON u.id = d.created_by
     WHERE d.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return { error: "Document not found" };
  }

  return { document: mapDocument(result.rows[0]) };
}

export async function getDocuments(
  projectId: string
): Promise<{ documents: DocumentFull[] }> {
  const result = await query(
    `SELECT d.*, u.name as created_by_name
     FROM documents d
     JOIN users u ON u.id = d.created_by
     WHERE d.project_id = $1
     ORDER BY d.updated_at DESC`,
    [projectId]
  );

  return { documents: result.rows.map(mapDocument) };
}

export async function createDocument(
  _prevState: { error?: string; success?: boolean; document?: DocumentFull },
  formData: FormData
): Promise<{ error?: string; success?: boolean; document?: DocumentFull }> {
  try {
    const currentUserId = await getDevUserId();
    const currentUserName = await getDevUserName();

    const data = createDocumentSchema.parse({
      title: formData.get("title"),
      projectId: formData.get("projectId"),
    });

    const result = await query(
      `INSERT INTO documents (title, content, project_id, created_by)
       VALUES ($1, '', $2, $3) RETURNING *`,
      [data.title, data.projectId, currentUserId]
    );

    const doc = mapDocument({ ...result.rows[0], created_by_name: currentUserName });
    return { success: true, document: doc };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
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
      return { error: "Document not found" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to save document" };
  }
}
