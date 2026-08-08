"use client";

import { useMemo } from "react";
import { useSocket } from "./useSocket";
import type { Collaborator } from "@/components/presence/CollaboratorAvatars";

interface UsePresenceOptions {
  documentId: string;
  userId: string;
  userName?: string;
  userColor?: string;
  enabled?: boolean;
}

export function usePresence({
  documentId,
  userId,
  userName = "You",
  userColor = "#5b4bff",
  enabled = true,
}: UsePresenceOptions) {
  const { connected, presenceList, emitTyping } = useSocket({
    userId,
    roomId: `document:${documentId}`,
    userName,
    userColor,
    enabled,
  });

  const collaborators = useMemo<Collaborator[]>(() => {
    if (!connected || presenceList.length === 0) {
      if (userName) {
        return [
          {
            id: userId,
            name: userName,
            avatar_url: null,
            color: userColor,
            isOnline: true,
          },
        ];
      }
      return [];
    }
    return presenceList
      .filter((user) => user.isOnline)
      .map((user) => ({
        id: user.userId,
        name: user.name || userName,
        avatar_url: null,
        color: user.color || userColor,
        isOnline: true,
      }));
  }, [connected, presenceList, userId, userName, userColor]);

  const onlineCount = collaborators.filter((c) => c.isOnline).length;

  return {
    collaborators,
    onlineCount,
    connected,
    emitTyping,
  };
}