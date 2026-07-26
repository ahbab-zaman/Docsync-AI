export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account and workspace preferences.
        </p>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Profile</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
