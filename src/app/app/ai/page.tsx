import { getAiDocuments } from "@/server/actions/ai";
import AiPageClient from "@/components/ai/AiPageClient";

export default async function AiPage() {
  const { documents } = await getAiDocuments();

  return <AiPageClient documents={documents} />;
}
