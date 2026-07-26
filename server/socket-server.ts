import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const SOCKET_PORT = parseInt(process.env.SOCKET_PORT ?? "3002", 10);

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface RoomUser {
  userId: string;
  name: string;
  color: string;
  joinedAt: Date;
}

const rooms = new Map<string, Map<string, RoomUser>>();

io.on("connection", (socket) => {
  const { userId, roomId } = socket.handshake.auth as {
    userId?: string;
    roomId?: string;
  };

  if (!userId || !roomId) {
    socket.disconnect();
    return;
  }

  socket.join(roomId);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  const room = rooms.get(roomId)!;

  const user: RoomUser = {
    userId,
    name: "Unknown",
    color: "#5b4bff",
    joinedAt: new Date(),
  };
  room.set(socket.id, user);

  const presenceList = Array.from(room.values()).map((u) => ({
    userId: u.userId,
    name: u.name,
    color: u.color,
    isOnline: true,
    lastSeen: new Date(),
  }));
  io.to(roomId).emit("presence:list", presenceList);
  io.to(roomId).emit("presence:update", {
    userId,
    name: user.name,
    color: user.color,
    isOnline: true,
    lastSeen: new Date(),
  });

  socket.on("presence:update", (data: { name: string; color: string }) => {
    if (room.has(socket.id)) {
      const existing = room.get(socket.id)!;
      existing.name = data.name ?? existing.name;
      existing.color = data.color ?? existing.color;
      io.to(roomId).emit("presence:update", {
        userId: existing.userId,
        name: existing.name,
        color: existing.color,
        isOnline: true,
        lastSeen: new Date(),
      });
    }
  });

  socket.on("cursor:update", (data: { from: number; to: number }) => {
    const userData = room.get(socket.id);
    if (userData) {
      socket.to(roomId).emit("cursor:broadcast", {
        userId: userData.userId,
        name: userData.name,
        color: userData.color,
        position: { from: data.from, to: data.to },
      });
    }
  });

  socket.on("typing:start", () => {
    const userData = room.get(socket.id);
    if (userData) {
      socket.to(roomId).emit("typing:broadcast", {
        userId: userData.userId,
        name: userData.name,
        isTyping: true,
      });
    }
  });

  socket.on("typing:stop", () => {
    const userData = room.get(socket.id);
    if (userData) {
      socket.to(roomId).emit("typing:broadcast", {
        userId: userData.userId,
        name: userData.name,
        isTyping: false,
      });
    }
  });

  socket.on("disconnect", () => {
    const userData = room.get(socket.id);
    room.delete(socket.id);
    if (userData) {
      io.to(roomId).emit("presence:update", {
        userId: userData.userId,
        name: userData.name,
        color: userData.color,
        isOnline: false,
        lastSeen: new Date(),
      });
    }
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  });
});

httpServer.listen(SOCKET_PORT, () => {
  console.log(`[Socket.IO] Server listening on port ${SOCKET_PORT}`);
});
