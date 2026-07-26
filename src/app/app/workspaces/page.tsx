export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
          <p className="text-sm text-text-secondary mt-1">
            All your workspaces in one place.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-2">
          <h3 className="font-semibold text-foreground">Personal Workspace</h3>
          <p className="text-sm text-text-secondary">
            Your personal projects and documents.
          </p>
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            3 projects
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5 space-y-2">
          <h3 className="font-semibold text-foreground">Team Alpha</h3>
          <p className="text-sm text-text-secondary">
            Main product development workspace.
          </p>
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            12 projects
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5 space-y-2">
          <h3 className="font-semibold text-foreground">Design Team</h3>
          <p className="text-sm text-text-secondary">
            Design system and UX projects.
          </p>
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            5 projects
          </span>
        </div>
      </div>
    </div>
  );
}
