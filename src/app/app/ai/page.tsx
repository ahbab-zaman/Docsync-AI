import AiPanel from "@/components/ai/AiPanel";

export default function AiPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-text-secondary mt-1">
          Ask AI to summarize, rewrite, or generate content across your documents.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <AiPanel documentContent="" />
      </div>
    </div>
  );
}
