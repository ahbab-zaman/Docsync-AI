"use server";

import { z, ZodError } from "zod";
import {
  getMockDocumentById,
  getMockDocumentsByProject,
  createMockDocument,
  saveMockDocument,
} from "@/data/mock-documents";
import type { MockDocumentFull } from "@/data/mock-documents";

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  projectId: z.string().min(1, "Project is required"),
});

const saveDocumentSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().optional(),
});

const currentUserId = "user-1";
const currentUserName = "You";

export async function getDocument(
  id: string
): Promise<{ document?: MockDocumentFull; error?: string }> {
  const document = getMockDocumentById(id);
  if (!document) {
    return { error: "Document not found" };
  }
  return { document };
}

export async function getDocuments(
  projectId: string
): Promise<{ documents: MockDocumentFull[] }> {
  const documents = getMockDocumentsByProject(projectId);
  return { documents };
}

export async function createDocument(
  _prevState: { error?: string; success?: boolean; document?: MockDocumentFull },
  formData: FormData
): Promise<{ error?: string; success?: boolean; document?: MockDocumentFull }> {
  try {
    const data = createDocumentSchema.parse({
      title: formData.get("title"),
      projectId: formData.get("projectId"),
    });

    const document = createMockDocument(
      data.title,
      data.projectId,
      currentUserId,
      currentUserName
    );
    return { success: true, document };
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
    const doc = saveMockDocument(id, parsed);
    if (!doc) {
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
