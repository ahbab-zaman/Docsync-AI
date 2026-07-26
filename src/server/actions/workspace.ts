"use server";

import { z, ZodError } from "zod";
import {
  getMockWorkspaces,
  getMockWorkspaceById,
  createMockWorkspace,
} from "@/data/mock-workspaces";
import type { MockWorkspace } from "@/data/mock-workspaces";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export async function getWorkspaces(): Promise<{ workspaces: MockWorkspace[] }> {
  const workspaces = getMockWorkspaces();
  return { workspaces };
}

export async function getWorkspace(
  id: string
): Promise<{ workspace?: MockWorkspace; error?: string }> {
  const workspace = getMockWorkspaceById(id);
  if (!workspace) {
    return { error: "Workspace not found" };
  }
  return { workspace };
}

export async function createWorkspace(
  _prevState: { error?: string; success?: boolean; workspace?: MockWorkspace },
  formData: FormData
): Promise<{ error?: string; success?: boolean; workspace?: MockWorkspace }> {
  try {
    const data = createWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });

    const workspace = createMockWorkspace(data.name, data.description ?? null);
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
