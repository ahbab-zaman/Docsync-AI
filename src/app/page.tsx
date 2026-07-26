export default function MarketingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Docsync
        </h1>
        <p className="mt-4 text-xl text-text-secondary max-w-lg">
          Real-time AI collaboration for documents, projects, and teams.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Get Started
          </a>
          <a
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            Create Account
          </a>
        </div>
      </main>
    </div>
  );
}
