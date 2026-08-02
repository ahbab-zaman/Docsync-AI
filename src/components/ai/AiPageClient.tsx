"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import type { AiDocumentOption } from "@/server/actions/ai";
import AiPanel from "./AiPanel";

interface AiPageClientProps {
  documents: AiDocumentOption[];
}

export default function AiPageClient({ documents }: AiPageClientProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(
    documents[0]?.id ?? ""
  );

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc.id === selectedDocumentId) ?? documents[0] ?? null,
    [documents, selectedDocumentId]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-text-secondary mt-1">
          Ask AI to summarize, rewrite, or generate content across your documents.
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="ai-document" className="block text-sm font-medium text-foreground mb-1.5">
          Document context
        </label>
        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface-secondary p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-text-muted mb-2" aria-hidden="true" />
            <p className="text-sm text-text-muted">No documents available yet.</p>
            <p className="text-xs text-text-muted mt-1">
              Create a document in a workspace to use it as AI context.
            </p>
            <Link
              href="/app/workspaces"
              className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
            >
              Go to workspaces
            </Link>
          </div>
        ) : (
          <>
            <select
              id="ai-document"
              value={selectedDocument?.id ?? ""}
              onChange={(e) => setSelectedDocumentId(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} — {doc.workspace_name}/{doc.project_name}
                </option>
              ))}
            </select>
            {selectedDocument && (
              <p className="mt-1.5 text-xs text-text-muted">
                Using “{selectedDocument.title}” from {selectedDocument.workspace_name} /{" "}
                {selectedDocument.project_name} as context.
              </p>
            )}
          </>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <AiPanel
          documentContent={selectedDocument?.content ?? ""}
          documentId={selectedDocument?.id}
        />
      </div>
    </div>
  );
}
