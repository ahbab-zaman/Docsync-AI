export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Welcome to Docsync. Select a workspace to get started.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="font-medium text-foreground">Personal Workspace</h3>
          <p className="text-sm text-text-secondary mt-1">3 projects</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="font-medium text-foreground">Team Alpha</h3>
          <p className="text-sm text-text-secondary mt-1">12 projects</p>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-surface-secondary p-4 flex items-center justify-center">
          <span className="text-sm text-text-muted">+ New Workspace</span>
        </div>
      </div>
    </div>
  );
}
