import { query } from "@/lib/db";
import type { NotificationType } from "@/types/notifications";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  workspaceId: string | null;
  createdBy: string | null;
}): Promise<void> {
  await query(
    `INSERT INTO notifications (user_id, type, title, description, workspace_id, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      params.userId,
      params.type,
      params.title,
      params.description,
      params.workspaceId,
      params.createdBy,
    ]
  );
}

export async function createActivityEvent(params: {
  type: NotificationType;
  description: string;
  workspaceId: string | null;
  createdBy: string | null;
}): Promise<void> {
  await query(
    `INSERT INTO activity_events (type, description, workspace_id, created_by)
     VALUES ($1, $2, $3, $4)`,
    [params.type, params.description, params.workspaceId, params.createdBy]
  );
}

export async function notifyWorkspaceMembers(params: {
  workspaceId: string;
  type: NotificationType;
  title: string;
  description: string;
  createdBy: string | null;
  excludeUserId?: string | null;
}): Promise<void> {
  const result = await query<{ user_id: string }>(
    "SELECT user_id FROM workspace_members WHERE workspace_id = $1",
    [params.workspaceId]
  );

  const recipients = result.rows
    .map((row) => row.user_id)
    .filter((userId) => userId !== params.excludeUserId);

  for (const recipient of recipients) {
    await createNotification({
      userId: recipient,
      type: params.type,
      title: params.title,
      description: params.description,
      workspaceId: params.workspaceId,
      createdBy: params.createdBy,
    });
  }
}

export async function notifyWorkspaceAdmins(params: {
  workspaceId: string;
  type: NotificationType;
  title: string;
  description: string;
  createdBy: string | null;
  excludeUserId?: string | null;
}): Promise<void> {
  const result = await query<{ user_id: string }>(
    `SELECT user_id FROM workspace_members
     WHERE workspace_id = $1 AND role IN ('owner', 'admin')`,
    [params.workspaceId]
  );

  const recipients = result.rows
    .map((row) => row.user_id)
    .filter((userId) => userId !== params.excludeUserId);

  for (const recipient of recipients) {
    await createNotification({
      userId: recipient,
      type: params.type,
      title: params.title,
      description: params.description,
      workspaceId: params.workspaceId,
      createdBy: params.createdBy,
    });
  }
}

export async function createThrottledDocumentUpdatedActivity(params: {
  workspaceId: string;
  description: string;
  createdBy: string;
}): Promise<void> {
  await query(
    `INSERT INTO activity_events (type, description, workspace_id, created_by)
     SELECT 'document_updated', $1, $2, $3
     WHERE NOT EXISTS (
       SELECT 1 FROM activity_events
       WHERE type = 'document_updated'
         AND workspace_id = $2
         AND created_at > NOW() - INTERVAL '30 minutes'
     )`,
    [params.description, params.workspaceId, params.createdBy]
  );
}
