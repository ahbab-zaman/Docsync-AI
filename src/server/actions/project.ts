"use server";

import { z, ZodError } from "zod";
import {
  getMockProjectsByWorkspace,
  getMockProjectById,
  createMockProject,
  archiveMockProject,
  updateMockProject,
} from "@/data/mock-projects";
import type { MockProjectFull } from "@/data/mock-projects";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  workspaceId: z.string().min(1, "Workspace is required"),
});

const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name is too long").optional(),
  description: z.string().max(500, "Description is too long").nullable().optional(),
});

const currentUserId = "user-1";

export async function getProjects(
  workspaceId: string
): Promise<{ projects: MockProjectFull[] }> {
  const projects = getMockProjectsByWorkspace(workspaceId);
  return { projects };
}

export async function getProject(
  id: string
): Promise<{ project?: MockProjectFull; error?: string }> {
  const project = getMockProjectById(id);
  if (!project) {
    return { error: "Project not found" };
  }
  return { project };
}

export async function createProject(
  _prevState: { error?: string; success?: boolean; project?: MockProjectFull },
  formData: FormData
): Promise<{ error?: string; success?: boolean; project?: MockProjectFull }> {
  try {
    const data = createProjectSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      workspaceId: formData.get("workspaceId"),
    });

    const project = createMockProject(
      data.name,
      data.description ?? null,
      data.workspaceId,
      currentUserId
    );
    return { success: true, project };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
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
      description: formData.get("description") !== undefined ? (formData.get("description") as string) || null : undefined,
    });

    const updated = updateMockProject(id, data);
    if (!updated) {
      return { error: "Project not found" };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to update project" };
  }
}

export async function archiveProjectAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    archiveMockProject(id);
    return { success: true };
  } catch (error) {
    return { error: "Failed to archive project" };
  }
}
