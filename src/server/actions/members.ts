"use server";

import { z, ZodError } from "zod";
import {
  getMockMembersByWorkspace,
  getMockPendingInvites,
  inviteMockMember,
  acceptMockInvite,
  cancelMockInvite,
  changeMockMemberRole,
  removeMockMember,
} from "@/data/mock-workspaces";
import type { MockMember, MockPendingInvite } from "@/data/mock-workspaces";

const inviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});

export async function getMembers(
  workspaceId: string
): Promise<{ members: MockMember[]; pendingInvites: MockPendingInvite[] }> {
  const members = getMockMembersByWorkspace(workspaceId);
  const pendingInvites = getMockPendingInvites(workspaceId);
  return { members, pendingInvites };
}

export async function inviteMember(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const data = inviteSchema.parse({
      workspaceId: formData.get("workspaceId"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

    const result = inviteMockMember(data.workspaceId, data.email, data.role);
    if (!result) {
      return { error: "User is already a member or workspace not found." };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to invite member." };
  }
}

export async function acceptInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = acceptMockInvite(workspaceId, inviteId);
    if (!result) return { error: "Invite not found." };
    return { success: true };
  } catch {
    return { error: "Failed to accept invite." };
  }
}

export async function cancelInvite(
  workspaceId: string,
  inviteId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = cancelMockInvite(workspaceId, inviteId);
    if (!result) return { error: "Invite not found." };
    return { success: true };
  } catch {
    return { error: "Failed to cancel invite." };
  }
}

export async function changeRole(
  workspaceId: string,
  userId: string,
  role: "admin" | "member"
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = changeMockMemberRole(workspaceId, userId, role);
    if (!result) return { error: "Cannot change role for this member." };
    return { success: true };
  } catch {
    return { error: "Failed to change role." };
  }
}

export async function removeMember(
  workspaceId: string,
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const result = removeMockMember(workspaceId, userId);
    if (!result) return { error: "Cannot remove owner or member not found." };
    return { success: true };
  } catch {
    return { error: "Failed to remove member." };
  }
}
