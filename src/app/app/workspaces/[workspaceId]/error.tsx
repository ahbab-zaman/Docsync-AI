"use client";

import { AlertTriangle } from "lucide-react";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center" role="alert">
      <AlertTriangle className="h-8 w-8 text-error mb-2" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-foreground">Failed to load workspace</h2>
      <p className="text-sm text-text-secondary mt-1 max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
