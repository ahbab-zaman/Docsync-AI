# Memory — Phase 2: Notifications

Last updated: 2026-07-29

## What was built

### Session 1 — Comments + Mentions (05)
- `src/components/comments/MentionSuggestions.tsx` — `@` mention autocomplete with keyboard nav
- `src/components/comments/CommentBubble.tsx` — Floating bubble on text selection (deprecated in session 2)
- `src/components/comments/CommentMarkers.ts` — ProseMirror decorations for comment highlights
- Updated `src/types/comments.ts` — Added `CommentRange` type
- Updated `src/components/documents/TiptapEditor.tsx` — Integrated CommentMarkers extension
- Updated `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Fixed right-panel toggle, wired comment sidebar
- Updated `src/components/comments/CommentSidebar.tsx` — Converted to controlled component
- Updated `src/components/comments/CommentReplyBox.tsx` — Added mention autocomplete
- Updated `src/app/globals.css` — Added `.comment-marker` styles

### Session 2 — AI Actions in Editor (06)
- `src/components/editor/SelectionMenu.tsx` — Combined floating toolbar (Comment + AI actions)
- Updated `src/types/ai.ts` — Added `expand`, `simplify`, `extract` action types + `AiSelectionContext`
- Updated `src/data/mock-ai.ts` — Added mock responses for new action types + suggestions
- Updated `src/components/documents/TiptapEditor.tsx` — Replaced CommentBubble with SelectionMenu
- Updated `src/components/ai/AiPanel.tsx` — Added `selectionContext` prop with context banner
- Updated `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Wired AI selection handler

### Session 3 — Version History (07)
- `src/types/versions.ts` — `DocumentVersion` type definition
- `src/data/mock-versions.ts` — Mock version snapshots for doc-1 with CRUD helpers
- `src/server/actions/versions.ts` — Server actions: `getVersions`, `createVersion`, `restoreVersion`
- `src/components/editor/VersionHistory.tsx` — Timeline panel with save/restore
- Updated `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Added History button and panel toggle
- Updated `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Added version restore handler to update content state

### Session 4 — Notifications (08)
- Updated `src/components/layout/Sidebar.tsx` — Added lucide icons, Bell badge with unread count, active state highlighting, 30s polling
- Updated `src/components/notifications/NotificationList.tsx` — Replaced emoji with lucide icons, proper Tailwind styling, icon-per-type mapping
- Updated `src/components/notifications/ActivityList.tsx` — Same icon/styling upgrade
- Updated `src/app/app/notifications/page.tsx` — Separated sections with border divider

## Decisions made
- Selection menu merges Comment + AI into one floating toolbar instead of separate bubbles
- AI sidebar shows selected text as context when triggered from selection
- CommentMarkers uses `@tiptap/pm/view` (not `@tiptap/pm/state`) for Decoration/DecorationSet
- BubbleMenu not available in @tiptap/react v3 — custom positioning via DOM coords
- @ mentions implemented as textarea autocomplete (not rich-text) for simplicity
- Comment state lifted to DocumentEditor to sync CommentSidebar + CommentMarkers
- Version history uses mock data with content snapshots stored in-memory
- Version history panel lives in the right sidebar slot alongside AI and Comments
- Restore replaces document content client-side via `setContent`
- Notifications use lucide-react icons instead of emoji for consistency with the rest of the UI
- Sidebar polls unread count on a 30s interval; no WebSocket push yet

## Problems solved
- `BubbleMenu` export missing from @tiptap/react v3 — replaced with custom floating component
- `Decoration`/`DecorationSet` not in `@tiptap/pm/state` — imported from `@tiptap/pm/view` instead
- DocumentEditor had broken right-panel toggle referencing undefined `aiPanelOpen` — rewired
- TypeScript `useEffect` cleanup with nullable editor — used local variable pattern

## Current state
- Phase 2 items 01-08 complete
- Build compiles and type-checks successfully
- All features use mock data — no PostgreSQL/Redis wiring yet

## Next session starts with
09 Search — search documents, search comments, search mentions, search activity events

## Open questions
- Version history persistence strategy: PostgreSQL snapshots vs Yjs document versions?
- How version restore interacts with active Yjs/Hocuspocus collaboration?
- Notification delivery strategy: Socket.IO push vs polling?
