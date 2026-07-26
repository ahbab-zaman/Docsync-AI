export type NotificationEventType =
  | "comment:added"
  | "comment:replied"
  | "comment:resolved"
  | "mention:added"
  | "document:updated"
  | "document:shared"
  | "member:joined"
  | "member:left"
  | "workspace:invite"
  | "ai:completed";

export interface NotificationEvent {
  id: string;
  type: NotificationEventType;
  title: string;
  body: string;
  senderId: string;
  senderName: string;
  targetId: string;
  targetType: "document" | "workspace" | "project" | "comment";
  recipientIds: string[];
  createdAt: Date;
  readAt: Date | null;
}
