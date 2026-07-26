import type { Comment, CommentReply, MentionUser } from "@/types/comments";

const collaboratorColors = [
  "#5b4bff",
  "#0fa3b1",
  "#d97d54",
  "#1f9d73",
  "#e25555",
];

export const mockMentionUsers: MentionUser[] = [
  { id: "user-1", name: "You", email: "you@docsync.dev" },
  { id: "user-2", name: "Alex Chen", email: "alex@docsync.dev" },
  { id: "user-3", name: "Sarah Kim", email: "sarah@docsync.dev" },
  { id: "user-4", name: "Mike Torres", email: "mike@docsync.dev" },
  { id: "user-5", name: "Lisa Wang", email: "lisa@docsync.dev" },
  { id: "user-6", name: "David Park", email: "david@docsync.dev" },
];

const mockComments: Comment[] = [
  {
    id: "cmt-1",
    documentId: "doc-1",
    userId: "user-2",
    userName: "Alex Chen",
    userColor: collaboratorColors[1],
    content: "Should we add a timeline for these action items?",
    selectionRange: null,
    resolved: false,
    createdAt: new Date("2026-07-15T10:30:00"),
    updatedAt: new Date("2026-07-15T10:30:00"),
    replies: [
      {
        id: "reply-1",
        commentId: "cmt-1",
        userId: "user-1",
        userName: "You",
        userColor: collaboratorColors[0],
        content: "Good idea. I'll add deadlines to each item.",
        createdAt: new Date("2026-07-15T11:00:00"),
      },
    ],
  },
  {
    id: "cmt-2",
    documentId: "doc-1",
    userId: "user-3",
    userName: "Sarah Kim",
    userColor: collaboratorColors[2],
    content: "The dashboard redesign needs more detail. Can we scope out the phases?",
    selectionRange: null,
    resolved: false,
    createdAt: new Date("2026-07-14T14:00:00"),
    updatedAt: new Date("2026-07-14T14:00:00"),
    replies: [],
  },
  {
    id: "cmt-3",
    documentId: "doc-1",
    userId: "user-1",
    userName: "You",
    userColor: collaboratorColors[0],
    content: "Updated the hiring reqs based on our discussion.",
    selectionRange: null,
    resolved: true,
    createdAt: new Date("2026-07-13T09:00:00"),
    updatedAt: new Date("2026-07-13T16:00:00"),
    replies: [
      {
        id: "reply-2",
        commentId: "cmt-3",
        userId: "user-2",
        userName: "Alex Chen",
        userColor: collaboratorColors[1],
        content: "Looks good. Approved.",
        createdAt: new Date("2026-07-13T16:00:00"),
      },
    ],
  },
];

export function getMockComments(documentId: string): Comment[] {
  return mockComments.filter((c) => c.documentId === documentId);
}

export function addMockComment(
  documentId: string,
  userId: string,
  userName: string,
  content: string,
  selectionRange: { from: number; to: number } | null
): Comment {
  const comment: Comment = {
    id: `cmt-${Date.now()}`,
    documentId,
    userId,
    userName,
    userColor: collaboratorColors[0],
    content,
    selectionRange,
    resolved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
  };
  mockComments.unshift(comment);
  return comment;
}

export function addMockReply(commentId: string, userId: string, userName: string, content: string): CommentReply | null {
  const comment = mockComments.find((c) => c.id === commentId);
  if (!comment) return null;
  const reply: CommentReply = {
    id: `reply-${Date.now()}`,
    commentId,
    userId,
    userName,
    userColor: userId === "user-1" ? collaboratorColors[0] : collaboratorColors[1],
    content,
    createdAt: new Date(),
  };
  comment.replies.push(reply);
  return reply;
}

export function resolveMockComment(commentId: string): boolean {
  const comment = mockComments.find((c) => c.id === commentId);
  if (!comment) return false;
  comment.resolved = true;
  return true;
}
