export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UserPublic = Pick<User, "id" | "email" | "name" | "avatar_url" | "created_at">;

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export type WorkspaceMemberRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceMemberRole;
  joined_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  project_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
