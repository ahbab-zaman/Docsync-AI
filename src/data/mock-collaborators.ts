import type { Collaborator } from "@/components/presence/CollaboratorAvatars";

export const collaboratorColors = [
  "#5b4bff",
  "#0fa3b1",
  "#d97d54",
  "#1f9d73",
  "#e25555",
  "#d6a100",
  "#4a84ff",
];

export const mockCollaborators: Collaborator[] = [
  { id: "user-1", name: "You", avatar_url: null, color: collaboratorColors[0], isOnline: true },
  { id: "user-2", name: "Alex Chen", avatar_url: null, color: collaboratorColors[1], isOnline: true },
  { id: "user-3", name: "Sarah Kim", avatar_url: null, color: collaboratorColors[2], isOnline: true },
  { id: "user-4", name: "Mike Torres", avatar_url: null, color: collaboratorColors[3], isOnline: false },
  { id: "user-5", name: "Lisa Wang", avatar_url: null, color: collaboratorColors[4], isOnline: true },
  { id: "user-6", name: "David Park", avatar_url: null, color: collaboratorColors[5], isOnline: false },
];

export function getMockCollaboratorsByDocument(_documentId: string): Collaborator[] {
  return mockCollaborators.filter((c) => c.isOnline);
}

export function getAllMockCollaborators(): Collaborator[] {
  return mockCollaborators;
}
