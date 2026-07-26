import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

const HOCUSPOCUS_URL =
  process.env.NEXT_PUBLIC_HOCUSPOCUS_URL ?? "ws://localhost:3001";

const providers = new Map<string, HocuspocusProvider>();

export function getHocuspocusProvider(
  documentId: string,
  ydoc: Y.Doc,
  userId: string,
  userName: string,
  userColor: string
): HocuspocusProvider {
  const key = `${documentId}-${userId}`;

  if (providers.has(key)) {
    return providers.get(key)!;
  }

  const provider = new HocuspocusProvider({
    url: HOCUSPOCUS_URL,
    name: documentId,
    document: ydoc,
    onSynced: () => {
      provider.setAwarenessField("user", {
        name: userName,
        color: userColor,
        userId,
      });
    },
  });

  providers.set(key, provider);

  provider.setAwarenessField("user", {
    name: userName,
    color: userColor,
    userId,
  });

  return provider;
}

export function disconnectHocuspocus(documentId: string, userId: string): void {
  const key = `${documentId}-${userId}`;
  const provider = providers.get(key);
  if (provider) {
    provider.destroy();
    providers.delete(key);
  }
}

export function disconnectAll(): void {
  providers.forEach((provider) => provider.destroy());
  providers.clear();
}
