export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-64 border-r border-border bg-surface-secondary p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold text-foreground">Docsync</span>
        </div>
        <div className="flex flex-col gap-1">
          <a
            href="/app"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/app/workspaces"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
          >
            Workspaces
          </a>
          <a
            href="/app/workspaces/new"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
          >
            New Workspace
          </a>
          <a
            href="/app/settings"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
          >
            Settings
          </a>
        </div>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
