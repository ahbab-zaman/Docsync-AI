export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar_url: string | null;
}

export interface MockPendingInvite {
  id: string;
  email: string;
  role: "admin" | "member";
  invited_by: string;
  invited_at: Date;
}

export interface MockProject {
  id: string;
  name: string;
  description: string | null;
  document_count: number;
}

export interface MockWorkspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  member_count: number;
  project_count: number;
  created_at: Date;
  members: MockMember[];
  pendingInvites: MockPendingInvite[];
  projects: MockProject[];
}

const currentUserId = "user-1";

const mockWorkspaces: MockWorkspace[] = [
  {
    id: "ws-1",
    name: "Personal Workspace",
    slug: "personal",
    description: "Your personal projects and documents.",
    owner_id: currentUserId,
    member_count: 1,
    project_count: 3,
    created_at: new Date("2026-01-15"),
    members: [
      { id: currentUserId, name: "You", email: "you@docsync.dev", role: "owner", avatar_url: null },
    ],
    pendingInvites: [],
    projects: [
      { id: "proj-1", name: "Notes", description: "Personal notes and ideas", document_count: 5 },
      { id: "proj-2", name: "Learning", description: "Tutorials and courses", document_count: 3 },
      { id: "proj-3", name: "Journal", description: "Daily journal entries", document_count: 12 },
    ],
  },
  {
    id: "ws-2",
    name: "Team Alpha",
    slug: "team-alpha",
    description: "Main product development workspace.",
    owner_id: "user-2",
    member_count: 6,
    project_count: 12,
    created_at: new Date("2026-02-20"),
    members: [
      { id: "user-2", name: "Alex Chen", email: "alex@docsync.dev", role: "owner", avatar_url: null },
      { id: currentUserId, name: "You", email: "you@docsync.dev", role: "admin", avatar_url: null },
      { id: "user-3", name: "Sarah Kim", email: "sarah@docsync.dev", role: "member", avatar_url: null },
      { id: "user-4", name: "Mike Torres", email: "mike@docsync.dev", role: "member", avatar_url: null },
      { id: "user-5", name: "Lisa Wang", email: "lisa@docsync.dev", role: "member", avatar_url: null },
    ],
    pendingInvites: [
      { id: "inv-1", email: "jordan@docsync.dev", role: "member", invited_by: currentUserId, invited_at: new Date("2026-07-20") },
      { id: "inv-2", email: "priya@docsync.dev", role: "admin", invited_by: "user-2", invited_at: new Date("2026-07-22") },
    ],
    projects: [
      { id: "proj-4", name: "Frontend", description: "React UI components and pages", document_count: 8 },
      { id: "proj-5", name: "Backend API", description: "API design and implementation", document_count: 6 },
      { id: "proj-6", name: "Design System", description: "Component library and tokens", document_count: 4 },
    ],
  },
  {
    id: "ws-3",
    name: "Design Team",
    slug: "design-team",
    description: "Design system and UX projects.",
    owner_id: "user-3",
    member_count: 4,
    project_count: 5,
    created_at: new Date("2026-03-10"),
    members: [
      { id: "user-3", name: "Sarah Kim", email: "sarah@docsync.dev", role: "owner", avatar_url: null },
      { id: currentUserId, name: "You", email: "you@docsync.dev", role: "member", avatar_url: null },
      { id: "user-6", name: "David Park", email: "david@docsync.dev", role: "admin", avatar_url: null },
    ],
    pendingInvites: [
      { id: "inv-3", email: "emma@docsync.dev", role: "member", invited_by: "user-3", invited_at: new Date("2026-07-25") },
    ],
    projects: [
      { id: "proj-7", name: "UI Kit", description: "Reusable design components", document_count: 10 },
      { id: "proj-8", name: "Research", description: "User research and findings", document_count: 3 },
    ],
  },
];

export function getMockWorkspaces(): MockWorkspace[] {
  return mockWorkspaces;
}

export function getMockWorkspaceById(id: string): MockWorkspace | undefined {
  return mockWorkspaces.find((w) => w.id === id);
}

export function createMockWorkspace(
  name: string,
  description: string | null
): MockWorkspace {
  const id = `ws-${Date.now()}`;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const workspace: MockWorkspace = {
    id,
    name,
    slug,
    description,
    owner_id: currentUserId,
    member_count: 1,
    project_count: 0,
    created_at: new Date(),
    members: [
      { id: currentUserId, name: "You", email: "you@docsync.dev", role: "owner", avatar_url: null },
    ],
    pendingInvites: [],
    projects: [],
  };
  mockWorkspaces.unshift(workspace);
  return workspace;
}

export function getMockMembersByWorkspace(workspaceId: string): MockMember[] {
  const ws = getMockWorkspaceById(workspaceId);
  return ws?.members ?? [];
}

export function getMockPendingInvites(workspaceId: string): MockPendingInvite[] {
  const ws = getMockWorkspaceById(workspaceId);
  return ws?.pendingInvites ?? [];
}

export function inviteMockMember(
  workspaceId: string,
  email: string,
  role: "admin" | "member"
): MockPendingInvite | null {
  const ws = getMockWorkspaceById(workspaceId);
  if (!ws) return null;
  if (ws.members.some((m) => m.email === email)) return null;
  const invite: MockPendingInvite = {
    id: `inv-${Date.now()}`,
    email,
    role,
    invited_by: currentUserId,
    invited_at: new Date(),
  };
  ws.pendingInvites.push(invite);
  return invite;
}

export function acceptMockInvite(workspaceId: string, inviteId: string): MockMember | null {
  const ws = getMockWorkspaceById(workspaceId);
  if (!ws) return null;
  const idx = ws.pendingInvites.findIndex((i) => i.id === inviteId);
  if (idx === -1) return null;
  const invite = ws.pendingInvites[idx];
  const member: MockMember = {
    id: `user-${Date.now()}`,
    name: invite.email.split("@")[0],
    email: invite.email,
    role: invite.role,
    avatar_url: null,
  };
  ws.members.push(member);
  ws.member_count = ws.members.length;
  ws.pendingInvites.splice(idx, 1);
  return member;
}

export function cancelMockInvite(workspaceId: string, inviteId: string): boolean {
  const ws = getMockWorkspaceById(workspaceId);
  if (!ws) return false;
  const idx = ws.pendingInvites.findIndex((i) => i.id === inviteId);
  if (idx === -1) return false;
  ws.pendingInvites.splice(idx, 1);
  return true;
}

export function changeMockMemberRole(
  workspaceId: string,
  userId: string,
  role: "admin" | "member"
): MockMember | null {
  const ws = getMockWorkspaceById(workspaceId);
  if (!ws) return null;
  const member = ws.members.find((m) => m.id === userId);
  if (!member || member.role === "owner") return null;
  member.role = role;
  return member;
}

export function removeMockMember(workspaceId: string, userId: string): boolean {
  const ws = getMockWorkspaceById(workspaceId);
  if (!ws) return false;
  const idx = ws.members.findIndex((m) => m.id === userId && m.role !== "owner");
  if (idx === -1) return false;
  ws.members.splice(idx, 1);
  ws.member_count = ws.members.length;
  return true;
}
