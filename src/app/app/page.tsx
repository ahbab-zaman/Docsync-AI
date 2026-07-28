import Link from "next/link";
import { Briefcase } from "lucide-react";
import { getWorkspaces } from "@/server/actions/workspace";

export default async function DashboardPage() {
  const { workspaces } = await getWorkspaces();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Welcome to Docsync. Select a workspace to get started.
        </p>
      </div>
      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <Briefcase className="h-8 w-8 text-text-muted mb-2" />
          <p className="text-sm font-medium text-foreground">No workspaces yet</p>
          <p className="text-xs text-text-muted mt-1">Create a workspace to get started.</p>
          <Link
            href="/app/workspaces/new"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
          >
            Create workspace
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.slice(0, 3).map((workspace) => (
            <Link
              key={workspace.id}
              href={`/app/workspaces/${workspace.id}`}
              className="rounded-lg border border-border bg-surface p-4 hover:border-border-light transition-colors block"
            >
              <h3 className="font-medium text-foreground">{workspace.name}</h3>
              <p className="text-sm text-text-secondary mt-1">{workspace.project_count} projects</p>
            </Link>
          ))}
          <Link
            href="/app/workspaces/new"
            className="rounded-lg border border-dashed border-border bg-surface-secondary p-4 flex items-center justify-center hover:border-border-light transition-colors"
          >
            <span className="text-sm font-medium text-text-muted">+ New workspace</span>
          </Link>
        </div>
      )}
    </div>
  );
}
