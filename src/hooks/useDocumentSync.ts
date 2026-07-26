"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as Y from "yjs";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { getHocuspocusProvider, disconnectHocuspocus } from "@/lib/hocuspocus";

interface UseDocumentSyncOptions {
  documentId: string;
  userId: string;
  userName: string;
  userColor: string;
  initialContent: string;
  enabled?: boolean;
}

export function useDocumentSync({
  documentId,
  userId,
  userName,
  userColor,
  initialContent,
  enabled = true,
}: UseDocumentSyncOptions) {
  const ydoc = useMemo(() => new Y.Doc({ guid: documentId }), [documentId]);
  const [isSynced, setIsSynced] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{ name: string; color: string }[]>([]);
  const providerRef = useRef<HocuspocusProvider | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: providerRef.current ?? undefined,
        user: {
          name: userName,
          color: userColor,
        },
      }),
    ],
    editable: enabled,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[500px] px-8 py-6 text-text-primary",
      },
    },
  });

  useEffect(() => {
    if (!enabled || !editor) return;

    const provider = getHocuspocusProvider(documentId, ydoc, userId, userName, userColor);
    providerRef.current = provider;

    provider.on("synced", () => {
      setIsSynced(true);
    });

    provider.on("awarenessChange", ({ states }: { states: any[] }) => {
      const users = states
        .filter((state: any) => state.user?.name && state.user?.name !== userName)
        .map((state: any) => ({
          name: state.user.name,
          color: state.user.color,
        }));
      setOnlineUsers(users);
    });

    const cursorExt = editor.extensionManager.extensions.find(
      (ext) => ext.name === "collaborationCursor"
    );
    if (cursorExt && "options" in cursorExt) {
      (cursorExt as any).options.provider = provider;
    }

    return () => {
      disconnectHocuspocus(documentId, userId);
      providerRef.current = null;
    };
  }, [enabled, editor, documentId, userId, userName, userColor, ydoc]);

  return {
    editor,
    ydoc,
    isSynced,
    onlineUsers,
  };
}
