import { getWorkspace } from "@/server/actions/workspace";
import { getDevUserId } from "@/lib/auth-helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import WorkspaceSettings from "./WorkspaceSettings";

export default async function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const [{ workspace, error }, currentUserId] = await Promise.all([
    getWorkspace(workspaceId),
    getDevUserId(),
  ]);

  if (error || !workspace) {
    notFound();
  }

  const currentUserRole =
    workspace.members.find((member) => member.id === currentUserId)?.role ?? "member";
  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
            <Link href="/app/workspaces" className="hover:text-text-secondary transition-colors">
              Workspaces
            </Link>
            <span>/</span>
            <span className="text-text-secondary">{workspace.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-sm text-text-secondary mt-1">{workspace.description}</p>
          )}
        </div>
        <WorkspaceSettings
          workspaceId={workspaceId}
          initialName={workspace.name}
          initialDescription={workspace.description}
          canManage={canManage}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">{workspace.member_count}</p>
          <p className="text-sm text-text-muted mt-1">Members</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">{workspace.project_count}</p>
          <p className="text-sm text-text-muted mt-1">Projects</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-bold text-foreground">
            {workspace.projects.reduce((sum, p) => sum + p.document_count, 0)}
          </p>
          <p className="text-sm text-text-muted mt-1">Documents</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <Link
            href={`/app/projects/new?workspaceId=${workspaceId}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
          >
            New project
          </Link>
        </div>
        {workspace.projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface-secondary p-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-text-muted">No projects yet</p>
            <p className="text-xs text-text-muted mt-1">
              Create a project to organize your documents.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workspace.projects.map((project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className="rounded-lg border border-border bg-surface p-4 space-y-2 hover:border-border-strong transition-colors block"
              >
                <h3 className="font-semibold text-foreground">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-text-secondary">{project.description}</p>
                )}
                <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {project.document_count} documents
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Members</h2>
        <div className="rounded-lg border border-border bg-surface divide-y divide-border" role="list">
          {workspace.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4"
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-xs font-medium text-accent">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-text-muted">{member.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-surface-tertiary px-2.5 py-0.5 text-xs font-medium text-text-secondary capitalize">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
