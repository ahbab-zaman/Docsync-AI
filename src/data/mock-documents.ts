export interface MockDocumentFull {
  id: string;
  title: string;
  content: string;
  project_id: string;
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
}

const mockDocuments: MockDocumentFull[] = [
  {
    id: "doc-1",
    title: "Meeting Notes",
    content:
      "<h2>Q3 Planning Meeting</h2><p>Date: July 15, 2026</p><h3>Attendees</h3><ul><li>Alex Chen</li><li>Sarah Kim</li><li>You</li></ul><h3>Key Decisions</h3><ol><li>Prioritize dashboard redesign for Q3</li><li>Move to bi-weekly release cycle</li><li>Hire two additional engineers</li></ol><h3>Action Items</h3><ul><li><strong>Alex:</strong> Draft roadmap by July 20</li><li><strong>Sarah:</strong> Research design tools</li><li><strong>You:</strong> Prepare technical proposal</li></ul><p>The team agreed to reconvene next Monday to review progress.</p>",
    project_id: "proj-1",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-07-15"),
    updated_at: new Date("2026-07-15"),
  },
  {
    id: "doc-2",
    title: "Book Ideas",
    content:
      "<h2>Book Ideas for Q3</h2><p>Topics worth exploring:</p><ul><li>Distributed systems design patterns</li><li>Web performance optimization</li><li>TypeScript advanced patterns</li></ul><blockquote><p>\"The best way to predict the future is to invent it.\" — Alan Kay</p></blockquote>",
    project_id: "proj-1",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-07-10"),
    updated_at: new Date("2026-07-12"),
  },
  {
    id: "doc-3",
    title: "Weekly Review",
    content:
      "<h2>Week 28 Review</h2><h3>Accomplished</h3><ul><li>Completed workspace management feature</li><li>Set up CI/CD pipeline</li><li>Fixed 12 bugs</li></ul><h3>Next Week</h3><ul><li>Start project management</li><li>Design system audit</li><li>Team retro</li></ul>",
    project_id: "proj-1",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-07-08"),
    updated_at: new Date("2026-07-08"),
  },
  {
    id: "doc-4",
    title: "React Patterns",
    content:
      "<h2>React Component Patterns</h2><h3>Compound Components</h3><p>Allow components to share implicit state:</p><pre><code>&lt;Tabs&gt;\n  &lt;Tabs.Tab label=\"One\"&gt;\n    &lt;p&gt;Content one&lt;/p&gt;\n  &lt;/Tabs.Tab&gt;\n  &lt;Tabs.Tab label=\"Two\"&gt;\n    &lt;p&gt;Content two&lt;/p&gt;\n  &lt;/Tabs.Tab&gt;\n&lt;/Tabs&gt;</code></pre><h3>Render Props</h3><p>Share logic by passing a render function:</p><pre><code>&lt;MouseTracker&gt;\n  {({ x, y }) =&gt; (\n    &lt;p&gt;Mouse at {x}, {y}&lt;/p&gt;\n  )}\n&lt;/MouseTracker&gt;</code></pre>",
    project_id: "proj-2",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-07-05"),
    updated_at: new Date("2026-07-05"),
  },
  {
    id: "doc-5",
    title: "TypeScript Tips",
    content:
      "<h2>TypeScript Utility Types</h2><p>Here are some useful patterns:</p><h3>Partial&lt;T&gt;</h3><p>Makes all properties optional:</p><pre><code>interface User {\n  name: string;\n  email: string;\n}\n\nfunction updateUser(id: string, data: Partial&lt;User&gt;) {}</code></pre><h3>ReturnType&lt;T&gt;</h3><p>Extracts return type from a function type.</p>",
    project_id: "proj-2",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-06-20"),
    updated_at: new Date("2026-06-22"),
  },
  {
    id: "doc-8",
    title: "Component Architecture",
    content:
      "<h2>UI Component Architecture</h2><p>Our component hierarchy follows these principles:</p><h3>Layer 1: Primitives</h3><p>Atoms like Button, Input, Label — one prop per concern.</p><h3>Layer 2: Composites</h3><p>Combinations like FormField, DataTable, CardGroup.</p><h3>Layer 3: Pages</h3><p>Full page layouts composed from composites.</p><p>Each layer only imports from the layer below.</p>",
    project_id: "proj-4",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    created_at: new Date("2026-07-01"),
    updated_at: new Date("2026-07-02"),
  },
  {
    id: "doc-9",
    title: "Styling Convention",
    content:
      "<h2>Styling Convention</h2><p>We use Tailwind CSS v4 with CSS variables for theming.</p><h3>Rules</h3><ul><li>Never hardcode colors — use theme tokens</li><li>Use <code>cn()</code> for merging classes</li><li>Keep one component per file</li><li>Named exports only</li></ul><h3>Example</h3><pre><code>function Card({ children }: { children: React.ReactNode }) {\n  return (\n    &lt;div className=\"rounded-lg border border-border bg-surface p-4\"&gt;\n      {children}\n    &lt;/div&gt;\n  );\n}</code></pre>",
    project_id: "proj-4",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-06-28"),
    updated_at: new Date("2026-06-28"),
  },
  {
    id: "doc-10",
    title: "API Endpoints",
    content:
      "<h2>REST API Endpoints</h2><table><tr><th>Method</th><th>Path</th><th>Description</th></tr><tr><td>GET</td><td>/api/workspaces</td><td>List workspaces</td></tr><tr><td>POST</td><td>/api/workspaces</td><td>Create workspace</td></tr><tr><td>GET</td><td>/api/projects</td><td>List projects</td></tr><tr><td>POST</td><td>/api/projects</td><td>Create project</td></tr></table>",
    project_id: "proj-5",
    created_by: "user-1",
    created_by_name: "You",
    created_at: new Date("2026-07-10"),
    updated_at: new Date("2026-07-10"),
  },
];

export function getMockDocumentById(id: string): MockDocumentFull | undefined {
  return mockDocuments.find((d) => d.id === id);
}

export function getMockDocumentsByProject(projectId: string): MockDocumentFull[] {
  return mockDocuments.filter((d) => d.project_id === projectId);
}

export function createMockDocument(
  title: string,
  projectId: string,
  createdBy: string,
  createdByName: string
): MockDocumentFull {
  const id = `doc-${Date.now()}`;
  const now = new Date();
  const doc: MockDocumentFull = {
    id,
    title,
    content: "<p>Start writing...</p>",
    project_id: projectId,
    created_by: createdBy,
    created_by_name: createdByName,
    created_at: now,
    updated_at: now,
  };
  mockDocuments.unshift(doc);
  return doc;
}

export function saveMockDocument(
  id: string,
  data: { title?: string; content?: string }
): MockDocumentFull | undefined {
  const doc = mockDocuments.find((d) => d.id === id);
  if (!doc) return undefined;
  if (data.title !== undefined) doc.title = data.title;
  if (data.content !== undefined) doc.content = data.content;
  doc.updated_at = new Date();
  return doc;
}
