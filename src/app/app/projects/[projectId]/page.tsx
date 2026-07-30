import { getProject } from "@/server/actions/project";
import { getWorkspace } from "@/server/actions/workspace";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { project, error } = await getProject(projectId);

  if (error || !project) {
    notFound();
  }

  const { workspace } = await getWorkspace(project.workspace_id);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
          <Link href="/app/workspaces" className="hover:text-text-secondary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <Link
            href={`/app/workspaces/${project.workspace_id}`}
            className="hover:text-text-secondary transition-colors"
          >
            {workspace?.name ?? "Workspace"}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{project.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-text-secondary mt-1">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">{project.document_count}</p>
          <p className="text-sm text-text-muted mt-1">Documents</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">{project.documents.length}</p>
          <p className="text-sm text-text-muted mt-1">Recently updated</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">
            {project.created_at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-sm text-text-muted mt-1">Created</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Documents</h2>
          <Link
            href={`/app/documents/new?projectId=${projectId}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
          >
            New document
          </Link>
        </div>
        {project.documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface-secondary p-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-text-muted">No documents yet</p>
            <p className="text-xs text-text-muted mt-1">
              Create a document to start writing.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface divide-y divide-border" role="list">
            {project.documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/app/documents/${doc.id}`}
                className="flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
                role="listitem"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Updated {doc.updated_at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {doc.created_by_name ? ` by ${doc.created_by_name}` : ""}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-surface-tertiary px-2 py-0.5 text-xs text-text-muted">
                  {doc.content.substring(0, 40)}...
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
