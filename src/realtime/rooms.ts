import type { PresenceUser } from "./presence";

export interface Room {
  id: string;
  type: "document" | "workspace" | "project";
  users: Map<string, PresenceUser>;
  createdAt: Date;
}

export type RoomType = Room["type"];

export function createRoom(id: string, type: RoomType): Room {
  return {
    id,
    type,
    users: new Map(),
    createdAt: new Date(),
  };
}
