export interface MockDocument {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface MockProjectFull {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  document_count: number;
  documents: MockDocument[];
}

const mockProjects: MockProjectFull[] = [
  {
    id: "proj-1",
    name: "Notes",
    description: "Personal notes and ideas",
    workspace_id: "ws-1",
    created_by: "user-1",
    created_at: new Date("2026-02-01"),
    updated_at: new Date("2026-07-20"),
    document_count: 5,
    documents: [
      { id: "doc-1", title: "Meeting Notes", content: "Discussed Q3 priorities...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-15"), updated_at: new Date("2026-07-15") },
      { id: "doc-2", title: "Book Ideas", content: "List of topics to explore...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-10"), updated_at: new Date("2026-07-12") },
      { id: "doc-3", title: "Weekly Review", content: "Accomplishments this week...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-08"), updated_at: new Date("2026-07-08") },
    ],
  },
  {
    id: "proj-2",
    name: "Learning",
    description: "Tutorials and courses",
    workspace_id: "ws-1",
    created_by: "user-1",
    created_at: new Date("2026-03-01"),
    updated_at: new Date("2026-07-18"),
    document_count: 3,
    documents: [
      { id: "doc-4", title: "React Patterns", content: "Compound components, render props...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-05"), updated_at: new Date("2026-07-05") },
      { id: "doc-5", title: "TypeScript Tips", content: "Utility types and generics...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-06-20"), updated_at: new Date("2026-06-22") },
    ],
  },
  {
    id: "proj-3",
    name: "Journal",
    description: "Daily journal entries",
    workspace_id: "ws-1",
    created_by: "user-1",
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-07-25"),
    document_count: 12,
    documents: [
      { id: "doc-6", title: "Entry - July 25", content: "Today was productive...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-25"), updated_at: new Date("2026-07-25") },
      { id: "doc-7", title: "Entry - July 24", content: "Worked on the dashboard...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-24"), updated_at: new Date("2026-07-24") },
    ],
  },
  {
    id: "proj-4",
    name: "Frontend",
    description: "React UI components and pages",
    workspace_id: "ws-2",
    created_by: "user-2",
    created_at: new Date("2026-03-15"),
    updated_at: new Date("2026-07-22"),
    document_count: 8,
    documents: [
      { id: "doc-8", title: "Component Architecture", content: "How we organize our UI...", created_by: "user-2", created_by_name: "Alex Chen", created_at: new Date("2026-07-01"), updated_at: new Date("2026-07-02") },
      { id: "doc-9", title: "Styling Convention", content: "Tailwind + CSS variables...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-06-28"), updated_at: new Date("2026-06-28") },
    ],
  },
  {
    id: "proj-5",
    name: "Backend API",
    description: "API design and implementation",
    workspace_id: "ws-2",
    created_by: "user-1",
    created_at: new Date("2026-04-01"),
    updated_at: new Date("2026-07-19"),
    document_count: 6,
    documents: [
      { id: "doc-10", title: "API Endpoints", content: "List of all REST endpoints...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-10"), updated_at: new Date("2026-07-10") },
    ],
  },
  {
    id: "proj-6",
    name: "Design System",
    description: "Component library and tokens",
    workspace_id: "ws-2",
    created_by: "user-3",
    created_at: new Date("2026-02-20"),
    updated_at: new Date("2026-07-15"),
    document_count: 4,
    documents: [],
  },
  {
    id: "proj-7",
    name: "UI Kit",
    description: "Reusable design components",
    workspace_id: "ws-3",
    created_by: "user-3",
    created_at: new Date("2026-04-10"),
    updated_at: new Date("2026-07-20"),
    document_count: 10,
    documents: [
      { id: "doc-11", title: "Button Component Spec", content: "Variants: primary, secondary, ghost...", created_by: "user-3", created_by_name: "Sarah Kim", created_at: new Date("2026-07-05"), updated_at: new Date("2026-07-05") },
      { id: "doc-12", title: "Form Elements", content: "Input, select, checkbox patterns...", created_by: "user-3", created_by_name: "Sarah Kim", created_at: new Date("2026-06-15"), updated_at: new Date("2026-06-18") },
    ],
  },
  {
    id: "proj-8",
    name: "Research",
    description: "User research and findings",
    workspace_id: "ws-3",
    created_by: "user-3",
    created_at: new Date("2026-05-01"),
    updated_at: new Date("2026-07-21"),
    document_count: 3,
    documents: [
      { id: "doc-13", title: "User Interview Summary", content: "Key findings from 10 interviews...", created_by: "user-1", created_by_name: "You", created_at: new Date("2026-07-12"), updated_at: new Date("2026-07-12") },
    ],
  },
];

export function getMockProjectsByWorkspace(workspaceId: string): MockProjectFull[] {
  return mockProjects.filter((p) => p.workspace_id === workspaceId);
}

export function getMockProjectById(id: string): MockProjectFull | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function createMockProject(
  name: string,
  description: string | null,
  workspaceId: string,
  createdBy: string
): MockProjectFull {
  const id = `proj-${Date.now()}`;
  const now = new Date();
  const project: MockProjectFull = {
    id,
    name,
    description,
    workspace_id: workspaceId,
    created_by: createdBy,
    created_at: now,
    updated_at: now,
    document_count: 0,
    documents: [],
  };
  mockProjects.unshift(project);
  return project;
}

export function archiveMockProject(id: string): void {
  const index = mockProjects.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockProjects.splice(index, 1);
  }
}

export function updateMockProject(
  id: string,
  data: { name?: string; description?: string | null }
): MockProjectFull | undefined {
  const project = mockProjects.find((p) => p.id === id);
  if (!project) return undefined;
  if (data.name !== undefined) project.name = data.name;
  if (data.description !== undefined) project.description = data.description;
  project.updated_at = new Date();
  return project;
}

export { type MockProjectFull as MockProject };
