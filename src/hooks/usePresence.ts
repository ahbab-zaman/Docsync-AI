"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import type { Collaborator } from "@/components/presence/CollaboratorAvatars";
import { getAllMockCollaborators } from "@/data/mock-collaborators";

interface UsePresenceOptions {
  documentId: string;
  userId: string;
  enabled?: boolean;
}

export function usePresence({ documentId, userId, enabled = true }: UsePresenceOptions) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const { connected, presenceList, emitTyping } = useSocket({
    userId,
    roomId: `document:${documentId}`,
    enabled,
  });

  useEffect(() => {
    if (!enabled) return;
    setCollaborators(getAllMockCollaborators());
  }, [enabled]);

  const onlineCount = collaborators.filter((c) => c.isOnline).length;

  return {
    collaborators,
    onlineCount,
    connected,
    emitTyping,
  };
}
