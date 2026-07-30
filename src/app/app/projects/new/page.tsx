"use client";

import { useEffect, Suspense, useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/server/actions/project";

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId") ?? "";

  const [state, formAction, pending] = useActionState(createProject, {});

  useEffect(() => {
    if (state.success && state.project) {
      toast.success("Project created");
      router.push(`/app/projects/${state.project.id}`);
    }
  }, [state.success, state.project, router]);

  if (!workspaceId) {
    return (
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
          <p className="text-sm text-text-secondary mt-1">
            Select a workspace first to create a project.
          </p>
        </div>
        <Link
          href="/app/workspaces"
          className="inline-flex rounded-lg bg-accent px-6 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
        >
          Go to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
        <p className="text-sm text-text-secondary mt-1">
          A project holds documents and tracks progress.
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Project name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Frontend"
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="What is this project about?"
            rows={3}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
        {state.error && (
          <p className="text-sm text-error">{state.error}</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Creating..." : "Create project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
          <p className="text-sm text-text-secondary mt-1">Loading...</p>
        </div>
      </div>
    }>
      <NewProjectForm />
    </Suspense>
  );
}
