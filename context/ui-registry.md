# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

## How to Use
Before building any component:
1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following `ui-rules.md` and `ui-tokens.md`, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

### Realtime
- `src/realtime/socket-events.ts` — Socket.IO event name constants
- `src/realtime/presence.ts` — PresenceUser and RoomPresence types
- `src/realtime/cursor.ts` — CursorPosition, CursorData, TypingUser types
- `src/realtime/rooms.ts` — Room management types
- `src/realtime/notification-events.ts` — NotificationEvent types

### Hooks
- `src/hooks/useSocket.ts` — Socket.IO connection hook with presence and cursor events
- `src/hooks/useDocumentSync.ts` — Yjs/Hocuspocus/TipTap collaboration hook
- `src/hooks/usePresence.ts` — Presence management hook

### Server
- `server/hocuspocus-server.ts` — Hocuspocus collaboration server
- `server/socket-server.ts` — Socket.IO presence/events server

## Components

### Editor Shell
- `src/components/editor/OutlinePanel.tsx` — Left outline panel showing document heading structure
  - Classes: `p-4`, `text-xs font-semibold text-text-muted uppercase tracking-wider`, space-y, hover states
- `src/components/editor/EditorShell.tsx` — Three-zone layout wrapper (outline | editor | AI panel)
- `src/components/documents/TiptapEditor.tsx` — Enhanced TipTap editor with icon toolbar using lucide-react
  - Toolbar: Bold, Italic, Strike, H1-H3, Bullet/Ordered lists, Quote, Code, Undo/Redo
  - Container: `rounded-lg border border-border bg-surface`, toolbar: `bg-surface-secondary`

### Presence
- `src/components/presence/CollaboratorAvatars.tsx` — Overlapping avatar circles with online indicators
  - Props: `collaborators`, `max`, `size`
  - Online dot: `h-2.5 w-2.5 rounded-full border-[1.5px] border-surface bg-success`

### Comments
- `src/components/comments/CommentThread.tsx` — Threaded comment with reply/resolve
  - Props: `comment`, `onReply`, `onResolve`
  - Shows avatar, name, time, content, replies, resolve button
- `src/components/comments/CommentSidebar.tsx` — Sidebar listing unresolved and resolved comments
  - Props: `documentId`, `comments`, `onCommentsChange`
  - Header with count, new comment input, unresolved list, resolved collapsible
- `src/components/comments/CommentReplyBox.tsx` — Reply textarea with mention autocomplete
  - Props: `onSubmit`, `onCancel`
  - Uses `MentionSuggestions` for `@` mentions
- `src/components/comments/CommentBubble.tsx` — TipTap BubbleMenu that appears on text selection
  - Shows "Comment" button to create comment anchored to selected text
  - Uses `@tiptap/react` BubbleMenu
- `src/components/comments/CommentMarkers.ts` — ProseMirror decorations extension for comment highlights
  - Highlights text ranges with comment color and bottom border
  - Exports `updateCommentRanges()` to update decorations reactively
- `src/components/comments/MentionSuggestions.tsx` — Dropdown for `@` mention autocomplete
  - Keyboard navigation (arrow keys, enter, escape)
  - Shows avatar + name + email of matching users
  - Inserts `@UserName` into textarea value

### Editor Shell (updated)
- `src/components/documents/TiptapEditor.tsx` — Now includes `CommentMarkers` extension and `CommentBubble`
  - New props: `commentRanges?: CommentRange[]`, `onAddComment?: (from, to, text) => void`
- `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Now has proper right panel toggle (AI or Comments)
  - Comments button with unresolved count badge
  - Both panels rendered conditionally based on `rightPanel` state state

### Data
- `src/data/mock-collaborators.ts` — Mock collaborator data with colors and online status

### Document Editor (enhanced)
- `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Full three-zone editor layout
  - Top action bar: outline toggle, save status, manual save, collaborator avatars, online count, AI toggle
  - Left: outline panel (collapsible, 56-wide)
  - Center: title input + TiptapEditor + metadata footer
  - Right: AI panel (collapsible, 80-wide)
