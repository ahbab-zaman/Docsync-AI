export interface PresenceUser {
  userId: string;
  name: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface RoomPresence {
  roomId: string;
  users: PresenceUser[];
}

export function createPresenceUser(
  userId: string,
  name: string,
  color: string
): PresenceUser {
  return {
    userId,
    name,
    color,
    isOnline: true,
    lastSeen: new Date(),
  };
}
