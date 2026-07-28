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

### Selection Menu
- `src/components/editor/SelectionMenu.tsx` — Floating toolbar on text selection in editor
  - Combines "Comment" button + "AI Actions" dropdown (Summarize, Rewrite, Expand, Simplify, Extract)
  - Props: `editor`, `onAddComment`, `onAiAction`
  - Positioning: absolute, relative to editor container, centered on selection
  - Classes: `rounded-lg border border-border bg-surface shadow-popover`, `text-xs font-medium`
  - AI dropdown: `rounded-lg border border-border bg-surface shadow-popover`, items with hover state

### AI Panel
- `src/components/ai/AiPanel.tsx` — Right sidebar AI assistant
  - Props: `documentContent`, `documentId`, `onInsertContent`, `selectionContext?`
  - Shows selected text context banner when AI is triggered from selection
  - Banner: `rounded-lg border border-accent/20 bg-accent-muted p-2`
- `src/components/ai/AiResponse.tsx` — AI response card with insert/discard actions
  - Classes: `rounded-lg border border-accent/20 bg-surface-secondary p-3 space-y-2`
- `src/components/ai/PromptInput.tsx` — Auto-resizing textarea with send button
  - Classes: `rounded-lg border border-border bg-surface px-3 py-2`, Send: `rounded-lg bg-accent px-4 py-2`
- `src/components/ai/SuggestionChips.tsx` — Quick action chip buttons
  - Classes: `rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium`

### Editor Shell (updated)
- `src/components/documents/TiptapEditor.tsx` — Now includes `CommentMarkers` extension and `SelectionMenu`
  - New props: `commentRanges`, `onAddComment`, `onAiAction`
- `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Right panel toggle (AI or Comments)
  - Comments button with unresolved count badge, AI button
  - Passes `selectionContext` to AiPanel when AI triggered from selection

### Version History
- `src/components/editor/VersionHistory.tsx` — Right sidebar version timeline
  - Props: `documentId`, `currentContent`, `currentTitle`, `onRestore`
  - "Save current version" inline input with save/cancel
  - Lists versions with title, author, timestamp, "Current" badge, "Restore" button
  - Loading spinner and empty state
  - Classes: panel `rounded-lg border border-border bg-surface p-4`, version card `rounded-lg border border-border bg-surface p-3`
  - "Current" badge: `rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent`

### Types
- `src/types/versions.ts` — `DocumentVersion` type (id, documentId, title, content, createdBy, createdByName, createdAt)

### Server Actions
- `src/server/actions/versions.ts` — `getVersions`, `createVersion`, `restoreVersion` using mock data

### Mock Data
- `src/data/mock-versions.ts` — Mock version snapshots for doc-1 with `getMockVersions`, `addMockVersion`, `getMockVersionById`

### Notifications
- `src/components/notifications/NotificationList.tsx` — Notification list with lucide type icons, mark read/mark all
  - Props: `initialNotifications`
  - Icons: UserPlus, UserMinus, ShieldCheck, FileEdit, Share2, UserCheck, FolderPlus, Settings
  - Classes: `bg-surface-secondary` for unread, `rounded-full bg-accent/10 text-accent` for icon badges
- `src/components/notifications/ActivityList.tsx` — Activity event list with same icon pattern
  - Props: `activity`
  - Classes: `rounded-full bg-surface-tertiary text-text-muted` for icon badges
- `src/components/layout/Sidebar.tsx` — Nav sidebar with lucide icons, active state via `usePathname`, bell icon with unread badge, 30s polling
  - Classes: active `bg-accent text-accent-foreground`, inactive `text-text-secondary hover:bg-surface hover:text-foreground`
  - Mobile: hamburger menu (`fixed top-3 left-3 z-40`), overlay sidebar (`bg-overlay/40 backdrop-blur-sm`), auto-closes on pathname change

### Search
- `src/components/search/SearchDialog.tsx` — Cmd+K modal search dialog
  - Props: `open`, `onClose`
  - Search input with debounce (200ms), grouped results (Documents / Comments / Activity)
  - Keyboard: Arrow keys navigate, Enter opens, Escape closes
  - Classes: overlay `bg-overlay/40 backdrop-blur-sm`, dialog `rounded-xl border border-border bg-surface shadow-popover`
  - Group headers: `text-[11px] font-semibold uppercase tracking-wider text-text-muted`
  - Selected item: `bg-accent-muted`, icon badge `bg-accent/10 text-accent`
  - Empty states with Search icon
- `src/components/layout/Sidebar.tsx` — Search bar with Ctrl+K badge, opens SearchDialog

### Types
- `src/types/search.ts` — `SearchResultType`, `SearchResultItem`, `SearchResults`, `SearchState`
- `src/types/versions.ts` — `DocumentVersion` type (id, documentId, title, content, createdBy, createdByName, createdAt)

### Server Actions
- `src/server/actions/versions.ts` — `getVersions`, `createVersion`, `restoreVersion` using mock data
- `src/server/actions/search.ts` — `search(query)` returns grouped `SearchResults`

### Mock Data
- `src/data/mock-versions.ts` — Mock version snapshots for doc-1 with `getMockVersions`, `addMockVersion`, `getMockVersionById`
- `src/data/mock-search.ts` — 16 mock search results across documents/comments/activity with in-memory token index and relevance scoring

### Data
- `src/data/mock-collaborators.ts` — Mock collaborator data with colors and online status

### Document Editor (enhanced)
- `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Full three-zone editor layout
  - Top action bar: outline toggle, save status, manual save, collaborator avatars, online count, History toggle, Comments toggle, AI toggle
  - Left: outline panel (collapsible, 56-wide)
  - Center: title input + TiptapEditor + metadata footer
  - Right: AI panel, Comments panel, or Version History panel (collapsible, 80-wide)
