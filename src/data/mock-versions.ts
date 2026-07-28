import type { DocumentVersion } from "@/types/versions";

const mockVersions: DocumentVersion[] = [
  {
    id: "ver-1",
    documentId: "doc-1",
    title: "Initial draft",
    content:
      "<h2>Q3 Planning Meeting</h2><p>Date: July 15, 2026</p><h3>Attendees</h3><ul><li>Alex Chen</li><li>Sarah Kim</li><li>You</li></ul><h3>Key Decisions</h3><ol><li>Prioritize dashboard redesign for Q3</li><li>Move to bi-weekly release cycle</li><li>Hire two additional engineers</li></ol><h3>Action Items</h3><ul><li><strong>Alex:</strong> Draft roadmap by July 20</li><li><strong>Sarah:</strong> Research design tools</li><li><strong>You:</strong> Prepare technical proposal</li></ul>",
    createdBy: "user-1",
    createdByName: "You",
    createdAt: new Date("2026-07-15T09:00:00"),
  },
  {
    id: "ver-2",
    documentId: "doc-1",
    title: "Added timeline notes",
    content:
      "<h2>Q3 Planning Meeting</h2><p>Date: July 15, 2026</p><h3>Attendees</h3><ul><li>Alex Chen</li><li>Sarah Kim</li><li>You</li></ul><h3>Key Decisions</h3><ol><li>Prioritize dashboard redesign for Q3</li><li>Move to bi-weekly release cycle</li><li>Hire two additional engineers</li></ol><h3>Action Items</h3><ul><li><strong>Alex:</strong> Draft roadmap by July 20</li><li><strong>Sarah:</strong> Research design tools</li><li><strong>You:</strong> Prepare technical proposal</li></ul><p>Timeline: All items due by end of Q3.</p>",
    createdBy: "user-2",
    createdByName: "Alex Chen",
    createdAt: new Date("2026-07-15T10:15:00"),
  },
  {
    id: "ver-3",
    documentId: "doc-1",
    title: "Added closing note",
    content:
      "<h2>Q3 Planning Meeting</h2><p>Date: July 15, 2026</p><h3>Attendees</h3><ul><li>Alex Chen</li><li>Sarah Kim</li><li>You</li></ul><h3>Key Decisions</h3><ol><li>Prioritize dashboard redesign for Q3</li><li>Move to bi-weekly release cycle</li><li>Hire two additional engineers</li></ol><h3>Action Items</h3><ul><li><strong>Alex:</strong> Draft roadmap by July 20</li><li><strong>Sarah:</strong> Research design tools</li><li><strong>You:</strong> Prepare technical proposal</li></ul><p>Timeline: All items due by end of Q3.</p><p>The team agreed to reconvene next Monday to review progress.</p>",
    createdBy: "user-1",
    createdByName: "You",
    createdAt: new Date("2026-07-15T11:30:00"),
  },
];

export function getMockVersions(documentId: string): DocumentVersion[] {
  return mockVersions
    .filter((v) => v.documentId === documentId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addMockVersion(
  documentId: string,
  title: string,
  content: string,
  userId: string,
  userName: string
): DocumentVersion {
  const version: DocumentVersion = {
    id: `ver-${Date.now()}`,
    documentId,
    title,
    content,
    createdBy: userId,
    createdByName: userName,
    createdAt: new Date(),
  };
  mockVersions.unshift(version);
  return version;
}

export function getMockVersionById(versionId: string): DocumentVersion | undefined {
  return mockVersions.find((v) => v.id === versionId);
}
