export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar_url: string | null;
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
    projects: [],
  };
  mockWorkspaces.unshift(workspace);
  return workspace;
}
