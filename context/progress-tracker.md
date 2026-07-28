# Progress Tracker

## Current Status
**Phase:** Phase 2 — Collaboration Layer
**Last completed:** 06 AI actions in editor
**Next:** 07 Version history

## Progress

### Phase 1 — Foundation
- [x] 01 Project setup and `/src` structure
- [x] 02 UI token direction and palette decision
- [x] 03 Landing / auth / workspace foundation
- [x] 04 Phase 1 planning docs

### Phase 2 — Collaboration Layer
- [x] 01 Editor shell
- [x] 02 TipTap integration
- [x] 03 Hocuspocus + Yjs sync
- [x] 04 Presence + cursors
- [x] 05 Comments + mentions
- [x] 06 AI actions in editor
- [x] 07 Version history
- [x] 08 Notifications
- [x] 09 Search
- [x] 10 Responsive polish

## Decisions Made During Build
- Use a single-repo modular architecture.
- Keep durable collaboration data in PostgreSQL.
- Keep ephemeral realtime state in Redis.
- Use TipTap + Yjs/Hocuspocus for shared document editing.
- Use Socket.IO for presence and lightweight live events.
- Keep the UI bright and readable with the Ivory Nebula palette.
- Comment markers use a custom ProseMirror extension with decorations (via `@tiptap/pm/view`).
- Bubble menu for selected-text comment action uses a custom React component instead of `BubbleMenu` (not available in @tiptap/react v3).
- Mention autocomplete uses a textarea-based `@` trigger with keyboard navigation.
- Comment state is lifted to `DocumentEditor` so it can sync with both `CommentSidebar` and `CommentMarkers`.
- Selection menu merges Comment + AI actions into a single floating toolbar on text selection.
- AI sidebar natively shows selected text context when triggered from the selection menu.
- New `SelectionMenu` component replaces `CommentBubble` for a unified UX.
- Version history uses mock data with content snapshots stored in-memory; restore replaces current state client-side.
- Version history panel lives in the right sidebar slot alongside AI and Comments toggles.
- Notifications use lucide-react icons in both list views and sidebar badge.
- Sidebar polls unread count every 30 seconds and shows active state via pathname.
- Search dialog is a Cmd+K modal with grouped results, keyboard navigation, and debounced input.
- Search index is an in-memory token map; results are relevance-scored and grouped by type.
- Sidebar is collapsible on mobile (hamburger menu, overlay, auto-close on nav).
- DocumentEditor three-zone layout stacks on mobile (panels below editor, max-height capped).
- All pages use responsive text sizes, spacing, and grid columns.
- Error page uses lucide `AlertTriangle` icon instead of emoji.
