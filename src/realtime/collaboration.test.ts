import { describe, it, expect } from "vitest";
import { createPresenceUser } from "@/realtime/presence";
import { createRoom } from "@/realtime/rooms";
import { SOCKET_EVENTS } from "@/realtime/socket-events";

describe("collaboration presence", () => {
  it("creates an online presence user with a timestamp", () => {
    const user = createPresenceUser("u-1", "Ada Lovelace", "#5b4bff");

    expect(user).toMatchObject({
      userId: "u-1",
      name: "Ada Lovelace",
      color: "#5b4bff",
      isOnline: true,
    });
    expect(user.lastSeen).toBeInstanceOf(Date);
  });

  it("starts rooms empty and stores presence users per room", () => {
    const room = createRoom("doc-1", "document");

    expect(room.id).toBe("doc-1");
    expect(room.type).toBe("document");
    expect(room.users.size).toBe(0);
    expect(room.createdAt).toBeInstanceOf(Date);

    room.users.set("u-1", createPresenceUser("u-1", "Ada", "#5b4bff"));
    expect(room.users.size).toBe(1);
  });

  it("exposes every collaboration event name", () => {
    const eventNames = Object.values(SOCKET_EVENTS);

    expect(eventNames).toContain("presence:join");
    expect(eventNames).toContain("presence:leave");
    expect(eventNames).toContain("cursor:update");
    expect(eventNames).toContain("typing:start");
    expect(eventNames).toContain("comment:added");
    expect(eventNames).toContain("notification:new");
    expect(eventNames).toContain("room:join");
    expect(eventNames).toContain("room:leave");
    expect(eventNames).toContain("connect");
    expect(eventNames).toContain("disconnect");
  });
});
