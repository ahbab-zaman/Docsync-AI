import type { Notification, ActivityEvent } from "@/types/notifications";

const currentUserId = "user-1";

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "member_joined",
    title: "Sarah Kim joined Team Alpha",
    description: "Sarah Kim has accepted the invite and joined the workspace as a member.",
    workspace_id: "ws-2",
    created_by: "user-3",
    created_by_name: "Sarah Kim",
    read: false,
    created_at: new Date("2026-07-26T14:30:00"),
  },
  {
    id: "notif-2",
    type: "document_updated",
    title: "Component Architecture was updated",
    description: "Alex Chen made changes to the Component Architecture document.",
    workspace_id: "ws-2",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    read: false,
    created_at: new Date("2026-07-26T12:15:00"),
  },
  {
    id: "notif-3",
    type: "role_changed",
    title: "You were promoted to admin",
    description: "Alex Chen changed your role from member to admin in Team Alpha.",
    workspace_id: "ws-2",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    read: false,
    created_at: new Date("2026-07-25T09:00:00"),
  },
  {
    id: "notif-4",
    type: "project_created",
    title: "New project: Design System",
    description: "Sarah Kim created a new project in Team Alpha workspace.",
    workspace_id: "ws-2",
    created_by: "user-3",
    created_by_name: "Sarah Kim",
    read: true,
    created_at: new Date("2026-07-24T16:45:00"),
  },
  {
    id: "notif-5",
    type: "invite_accepted",
    title: "Mike Torres accepted invite",
    description: "Mike Torres has accepted the invite to join Team Alpha.",
    workspace_id: "ws-2",
    created_by: "user-4",
    created_by_name: "Mike Torres",
    read: true,
    created_at: new Date("2026-07-23T11:20:00"),
  },
  {
    id: "notif-6",
    type: "document_shared",
    title: "API Endpoints was shared with you",
    description: "Alex Chen shared the API Endpoints document with you.",
    workspace_id: "ws-2",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    read: true,
    created_at: new Date("2026-07-22T08:30:00"),
  },
  {
    id: "notif-7",
    type: "workspace_updated",
    title: "Personal Workspace description updated",
    description: "You updated the workspace description.",
    workspace_id: "ws-1",
    created_by: currentUserId,
    created_by_name: "You",
    read: true,
    created_at: new Date("2026-07-20T19:00:00"),
  },
];

const mockActivity: ActivityEvent[] = [
  {
    id: "act-1",
    type: "document_updated",
    description: "Alex Chen edited Component Architecture in Frontend project.",
    workspace_id: "ws-2",
    workspace_name: "Team Alpha",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    created_at: new Date("2026-07-26T12:15:00"),
  },
  {
    id: "act-2",
    type: "member_joined",
    description: "Sarah Kim joined Team Alpha.",
    workspace_id: "ws-2",
    workspace_name: "Team Alpha",
    created_by: "user-3",
    created_by_name: "Sarah Kim",
    created_at: new Date("2026-07-26T14:30:00"),
  },
  {
    id: "act-3",
    type: "project_created",
    description: "Sarah Kim created Design System project in Team Alpha.",
    workspace_id: "ws-2",
    workspace_name: "Team Alpha",
    created_by: "user-3",
    created_by_name: "Sarah Kim",
    created_at: new Date("2026-07-24T16:45:00"),
  },
  {
    id: "act-4",
    type: "document_updated",
    description: "You edited React Patterns in Learning project.",
    workspace_id: "ws-1",
    workspace_name: "Personal Workspace",
    created_by: currentUserId,
    created_by_name: "You",
    created_at: new Date("2026-07-24T14:00:00"),
  },
  {
    id: "act-5",
    type: "invite_accepted",
    description: "Mike Torres accepted invite to Team Alpha.",
    workspace_id: "ws-2",
    workspace_name: "Team Alpha",
    created_by: "user-4",
    created_by_name: "Mike Torres",
    created_at: new Date("2026-07-23T11:20:00"),
  },
  {
    id: "act-6",
    type: "role_changed",
    description: "Alex Chen promoted you to admin in Team Alpha.",
    workspace_id: "ws-2",
    workspace_name: "Team Alpha",
    created_by: "user-2",
    created_by_name: "Alex Chen",
    created_at: new Date("2026-07-25T09:00:00"),
  },
  {
    id: "act-7",
    type: "workspace_updated",
    description: "You updated Personal Workspace description.",
    workspace_id: "ws-1",
    workspace_name: "Personal Workspace",
    created_by: currentUserId,
    created_by_name: "You",
    created_at: new Date("2026-07-20T19:00:00"),
  },
];

export function getMockNotifications(): Notification[] {
  return mockNotifications;
}

export function getMockUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

export function markMockNotificationRead(id: string): boolean {
  const notif = mockNotifications.find((n) => n.id === id);
  if (!notif) return false;
  notif.read = true;
  return true;
}

export function markAllMockNotificationsRead(): void {
  for (const n of mockNotifications) {
    n.read = true;
  }
}

export function getMockActivity(): ActivityEvent[] {
  return mockActivity;
}

export function createMockNotification(
  type: Notification["type"],
  title: string,
  description: string,
  workspaceId: string,
  createdBy: string,
  createdByName: string
): Notification {
  const id = `notif-${Date.now()}`;
  const notif: Notification = {
    id,
    type,
    title,
    description,
    workspace_id: workspaceId,
    created_by: createdBy,
    created_by_name: createdByName,
    read: false,
    created_at: new Date(),
  };
  mockNotifications.unshift(notif);
  return notif;
}

export function createMockActivityEvent(
  type: ActivityEvent["type"],
  description: string,
  workspaceId: string,
  workspaceName: string,
  createdBy: string,
  createdByName: string
): ActivityEvent {
  const id = `act-${Date.now()}`;
  const event: ActivityEvent = {
    id,
    type,
    description,
    workspace_id: workspaceId,
    workspace_name: workspaceName,
    created_by: createdBy,
    created_by_name: createdByName,
    created_at: new Date(),
  };
  mockActivity.unshift(event);
  return event;
}
