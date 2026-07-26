export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // Presence
  PRESENCE_JOIN: "presence:join",
  PRESENCE_LEAVE: "presence:leave",
  PRESENCE_UPDATE: "presence:update",
  PRESENCE_LIST: "presence:list",

  // Cursors
  CURSOR_UPDATE: "cursor:update",
  CURSOR_BROADCAST: "cursor:broadcast",

  // Typing
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  TYPING_BROADCAST: "typing:broadcast",

  // Comments
  COMMENT_ADDED: "comment:added",
  COMMENT_RESOLVED: "comment:resolved",
  COMMENT_REPLIED: "comment:replied",

  // Notifications
  NOTIFICATION_NEW: "notification:new",

  // Room
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",
} as const;
