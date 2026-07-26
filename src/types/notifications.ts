export type NotificationType =
  | "member_joined"
  | "member_left"
  | "role_changed"
  | "document_updated"
  | "document_shared"
  | "invite_accepted"
  | "project_created"
  | "workspace_updated";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  workspace_id: string;
  created_by: string;
  created_by_name: string;
  read: boolean;
  created_at: Date;
}

export interface ActivityEvent {
  id: string;
  type: NotificationType;
  description: string;
  workspace_id: string;
  workspace_name: string;
  created_by: string;
  created_by_name: string;
  created_at: Date;
}
