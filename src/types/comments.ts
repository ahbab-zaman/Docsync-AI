export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  selectionRange: { from: number; to: number } | null;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  createdAt: Date;
}

export interface MentionUser {
  id: string;
  name: string;
  email: string;
}
