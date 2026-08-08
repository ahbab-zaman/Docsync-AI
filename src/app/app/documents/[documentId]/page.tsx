import { getDocument } from "@/server/actions/document";
import { getProject } from "@/server/actions/project";
import { getWorkspace } from "@/server/actions/workspace";
import { getCurrentUserId, getCurrentUserInfo } from "@/server/access";
import { collaboratorColors } from "@/data/mock-collaborators";
import { notFound } from "next/navigation";
import Link from "next/link";
import DocumentEditor from "./DocumentEditor";

function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return collaboratorColors[hash % collaboratorColors.length];
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const [{ document, error }, currentUserId, currentUser] = await Promise.all([
    getDocument(documentId),
    getCurrentUserId(),
    getCurrentUserInfo(),
  ]);

  if (error || !document) {
    notFound();
  }

  const { project } = await getProject(document.project_id);
  const workspaceId = project?.workspace_id ?? "";
  const { workspace } = workspaceId ? await getWorkspace(workspaceId) : { workspace: undefined };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted mb-1 flex-wrap">
        <Link href="/app/workspaces" className="hover:text-text-secondary transition-colors shrink-0">
          Workspaces
        </Link>
        <span className="shrink-0">/</span>
        <Link
          href={`/app/workspaces/${workspaceId}`}
          className="hover:text-text-secondary transition-colors truncate max-w-[120px] sm:max-w-none"
        >
          {workspace?.name ?? "Workspace"}
        </Link>
        <span className="shrink-0">/</span>
        <Link
          href={`/app/projects/${document.project_id}`}
          className="hover:text-text-secondary transition-colors truncate max-w-[120px] sm:max-w-none"
        >
          {project?.name ?? "Project"}
        </Link>
        <span className="shrink-0">/</span>
        <span className="text-text-secondary truncate max-w-[120px] sm:max-w-none">{document.title}</span>
      </div>

      <DocumentEditor
        documentId={document.id}
        projectId={document.project_id}
        initialTitle={document.title}
        initialContent={document.content}
        createdAt={document.created_at.toISOString()}
        updatedAt={document.updated_at.toISOString()}
        createdByName={document.created_by_name}
        currentUserId={currentUserId}
        currentUserName={currentUser?.name ?? "You"}
        currentUserColor={currentUserId ? colorForId(currentUserId) : "#5b4bff"}
      />
    </div>
  );
}
