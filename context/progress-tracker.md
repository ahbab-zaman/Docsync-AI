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
- [ ] 07 Version history
- [ ] 08 Notifications
- [ ] 09 Search
- [ ] 10 Responsive polish

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
