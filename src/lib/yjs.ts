import * as Y from "yjs";

export function createYDoc(documentId: string): Y.Doc {
  return new Y.Doc({ guid: documentId });
}
