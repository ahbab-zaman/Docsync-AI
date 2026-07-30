"use client";

import { useEffect, Suspense, useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createDocument } from "@/server/actions/document";

function NewDocumentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "";

  const [state, formAction, pending] = useActionState(createDocument, {});

  useEffect(() => {
    if (state.success && state.document) {
      toast.success("Document created");
      router.push(`/app/documents/${state.document.id}`);
    }
  }, [state.success, state.document, router]);

  if (!projectId) {
    return (
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Document</h1>
          <p className="text-sm text-text-secondary mt-1">
            Select a project first to create a document.
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
        <h1 className="text-2xl font-bold text-foreground">Create Document</h1>
        <p className="text-sm text-text-secondary mt-1">
          Start writing in a new document.
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="projectId" value={projectId} />
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Document title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Sprint Planning"
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
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
            {pending ? "Creating..." : "Create document"}
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

export default function NewDocumentPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Document</h1>
          <p className="text-sm text-text-secondary mt-1">Loading...</p>
        </div>
      </div>
    }>
      <NewDocumentForm />
    </Suspense>
  );
}
