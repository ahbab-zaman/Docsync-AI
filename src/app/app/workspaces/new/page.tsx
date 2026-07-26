"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/server/actions/workspace";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createWorkspace, {});

  if (state.success && state.workspace) {
    router.push(`/app/workspaces/${state.workspace.id}`);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Workspace</h1>
        <p className="text-sm text-text-secondary mt-1">
          A workspace is where your projects and documents live.
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Workspace name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Product Design"
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
            placeholder="What is this workspace for?"
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
            {pending ? "Creating..." : "Create workspace"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/app/workspaces")}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
