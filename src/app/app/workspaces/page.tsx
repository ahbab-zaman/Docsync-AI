import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { getWorkspaces } from "@/server/actions/workspace";

export default async function WorkspacesPage() {
  const { workspaces } = await getWorkspaces();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Workspaces</h1>
          <p className="text-sm text-text-secondary mt-1">
            All your workspaces in one place.
          </p>
        </div>
        <Link
          href="/app/workspaces/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New workspace
        </Link>
      </div>
      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <Briefcase className="h-8 w-8 text-text-muted mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No workspaces yet</p>
          <p className="text-xs text-text-muted mt-1">Create your first workspace to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/app/workspaces/${workspace.id}`}
              className="rounded-lg border border-border bg-surface p-4 sm:p-5 space-y-2 hover:border-border-light transition-colors block"
            >
              <h3 className="font-semibold text-foreground">{workspace.name}</h3>
              {workspace.description && (
                <p className="text-sm text-text-secondary line-clamp-2">{workspace.description}</p>
              )}
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                {workspace.project_count} {workspace.project_count === 1 ? "project" : "projects"}
              </span>
            </Link>
          ))}
          <Link
            href="/app/workspaces/new"
            className="rounded-lg border border-dashed border-border bg-surface-secondary p-4 sm:p-5 flex items-center justify-center hover:border-border-light transition-colors"
          >
            <span className="text-sm font-medium text-text-muted">+ New workspace</span>
          </Link>
        </div>
      )}
    </div>
  );
}
