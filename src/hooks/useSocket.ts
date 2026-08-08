"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/realtime/socket-events";
import type { PresenceUser } from "@/realtime/presence";
import type { CursorData } from "@/realtime/cursor";

interface UseSocketOptions {
  userId: string;
  roomId: string;
  userName?: string;
  userColor?: string;
  enabled?: boolean;
}

export function useSocket({ userId, roomId, userName, userColor, enabled = true }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [presenceList, setPresenceList] = useState<PresenceUser[]>([]);
  const [cursors, setCursors] = useState<CursorData[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const socket = connectSocket(userId, roomId, { name: userName, color: userColor });
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.ROOM_JOIN, { roomId, userId });
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onPresenceList = (users: PresenceUser[]) => {
      setPresenceList(users);
    };

    const onPresenceUpdate = (user: PresenceUser) => {
      setPresenceList((prev) => {
        const exists = prev.find((u) => u.userId === user.userId);
        if (exists) {
          return prev.map((u) => (u.userId === user.userId ? user : u));
        }
        return [...prev, user];
      });
    };

    const onCursorBroadcast = (cursor: CursorData) => {
      setCursors((prev) => {
        const filtered = prev.filter((c) => c.userId !== cursor.userId);
        return [...filtered, cursor];
      });
    };

    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENTS.PRESENCE_LIST, onPresenceList);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, onPresenceUpdate);
    socket.on(SOCKET_EVENTS.CURSOR_BROADCAST, onCursorBroadcast);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENTS.PRESENCE_LIST, onPresenceList);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, onPresenceUpdate);
      socket.off(SOCKET_EVENTS.CURSOR_BROADCAST, onCursorBroadcast);
      socket.emit(SOCKET_EVENTS.ROOM_LEAVE, { roomId, userId });
      disconnectSocket();
    };
  }, [userId, roomId, userName, userColor, enabled]);

  const emitCursor = useCallback(
    (cursor: CursorData) => {
      socketRef.current?.emit(SOCKET_EVENTS.CURSOR_UPDATE, cursor);
    },
    []
  );

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      const event = isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_STOP;
      socketRef.current?.emit(event, { roomId, userId });
    },
    [roomId, userId]
  );

  return {
    connected,
    presenceList,
    cursors,
    emitCursor,
    emitTyping,
  };
}
