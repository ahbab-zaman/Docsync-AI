import Link from "next/link";
import { getCurrentUser } from "@/server/auth";

export default async function MarketingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
            Docsync
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-text-secondary hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#collaboration" className="text-sm text-text-secondary hover:text-foreground transition-colors">
              Collaboration
            </a>
            <a href="#ai" className="text-sm text-text-secondary hover:text-foreground transition-colors">
              AI
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/app"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-32 text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-border bg-surface-secondary px-4 py-1.5 text-xs text-text-muted mb-8">
            Real-time AI collaboration for software teams
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Where your team&apos;s
            <br />
            <span className="text-accent">ideas take shape</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Docsync brings documents, projects, AI, and your team into one workspace.
            Plan together, write together, and ship faster — without switching tools.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {user ? (
              <Link
                href="/app"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
                >
                  Start free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </section>

        <section id="features" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">Everything your team needs</h2>
              <p className="mt-3 text-text-secondary max-w-xl mx-auto">
                One workspace. No context switching between notes, docs, AI, and project management.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="✎"
                title="Rich Documents"
                description="Write and edit with a polished editor that supports headings, lists, code blocks, and more."
              />
              <FeatureCard
                icon="⊕"
                title="Projects & Workspaces"
                description="Organize work into projects inside shared workspaces. Keep everything structured."
              />
              <FeatureCard
                icon="⚙"
                title="AI Assistant"
                description="Summarize, rewrite, and extract insights from your documents with one click."
              />
              <FeatureCard
                icon="→"
                title="Team Collaboration"
                description="Invite teammates, assign roles, and work together in real time with shared context."
              />
              <FeatureCard
                icon="◈"
                title="Activity & Notifications"
                description="Stay informed with activity feeds and notifications. Never miss an update."
              />
              <FeatureCard
                icon="✓"
                title="Member Management"
                description="Control who has access with granular roles. Invite, promote, and manage members."
              />
            </div>
          </div>
        </section>

        <section id="collaboration" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs text-text-muted mb-4">
                  Real-time
                </div>
                <h2 className="text-3xl font-bold text-foreground leading-tight">
                  Collaborate without the chaos
                </h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  Documents, projects, and conversations live in one place. No more jumping between
                  tools to find what you need. Every workspace has a shared view of what matters.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">✓</span>
                    Shared workspaces with member roles
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">✓</span>
                    Projects that group related documents
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">✓</span>
                    Activity feeds so everyone stays aligned
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-surface-secondary p-6">
                <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground" aria-hidden="true">A</div>
                    <span className="text-sm font-medium text-foreground">Alex Chen</span>
                    <span className="text-xs text-text-muted ml-auto">editing</span>
                  </div>
                  <div className="h-2 w-3/4 rounded bg-surface-tertiary" />
                  <div className="h-2 w-1/2 rounded bg-surface-tertiary" />
                  <div className="h-2 w-5/6 rounded bg-accent-soft" />
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground" aria-hidden="true">S</div>
                    <span className="text-sm font-medium text-foreground">Sarah Kim</span>
                    <span className="text-xs text-text-muted ml-auto">viewing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-xs font-medium text-black" aria-hidden="true">Y</div>
                    <span className="text-sm font-medium text-foreground">You</span>
                    <span className="text-xs text-text-muted ml-auto">online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ai" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-last lg:order-first">
                <div className="rounded-xl border border-border bg-surface-secondary p-6">
                  <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">AI</span>
                      <span className="text-sm font-semibold text-foreground">AI Assistant</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-surface-tertiary px-2.5 py-1 text-xs text-text-secondary">Summarize</span>
                        <span className="rounded-md bg-surface-tertiary px-2.5 py-1 text-xs text-text-secondary">Rewrite</span>
                        <span className="rounded-md bg-surface-tertiary px-2.5 py-1 text-xs text-text-secondary">Action items</span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-muted p-3">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          <span className="text-accent font-medium">AI:</span> The document covers Q3 planning
                          priorities. Key decisions include moving to a bi-weekly release cycle and
                          hiring two additional engineers for the dashboard redesign.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs text-text-muted mb-4">
                  Powered by AI
                </div>
                <h2 className="text-3xl font-bold text-foreground leading-tight">
                  AI that works with your content
                </h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  Your documents are more than text — they contain decisions, action items, and
                  insights. Docsync&apos;s AI reads your content and helps you do more with it.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">⚡</span>
                    Summarize long documents in seconds
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">⚡</span>
                    Rewrite and refine with different tones
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent" aria-hidden="true">⚡</span>
                    Extract action items and project summaries
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground">Ready to bring your team together?</h2>
            <p className="mt-3 text-text-secondary max-w-lg mx-auto">
              Start with a workspace, invite your team, and see the difference shared context makes.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/app/workspaces/new"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
                >
                  Create a workspace
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
                >
                  Get started free
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Docsync</span>
              <span className="text-xs text-text-muted">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 space-y-3 hover:border-border-strong transition-colors">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-lg text-accent" aria-hidden="true">
        {icon}
      </span>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </article>
  );
}
