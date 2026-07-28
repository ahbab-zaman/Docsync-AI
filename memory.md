# Memory — Phase 2: Comments + Mentions & AI Actions

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

## Decisions made
- Selection menu merges Comment + AI into one floating toolbar instead of separate bubbles
- AI sidebar shows selected text as context when triggered from selection
- CommentMarkers uses `@tiptap/pm/view` (not `@tiptap/pm/state`) for Decoration/DecorationSet
- BubbleMenu not available in @tiptap/react v3 — custom positioning via DOM coords
- @ mentions implemented as textarea autocomplete (not rich-text) for simplicity
- Comment state lifted to DocumentEditor to sync CommentSidebar + CommentMarkers

## Problems solved
- `BubbleMenu` export missing from @tiptap/react v3 — replaced with custom floating component
- `Decoration`/`DecorationSet` not in `@tiptap/pm/state` — imported from `@tiptap/pm/view` instead
- DocumentEditor had broken right-panel toggle referencing undefined `aiPanelOpen` — rewired
- TypeScript `useEffect` cleanup with nullable editor — used local variable pattern

## Current state
- Phase 2 items 01-06 complete
- Build compiles and type-checks successfully
- All features use mock data — no PostgreSQL/Redis wiring yet for comments or AI

## Next session starts with
07 Version history — version timeline, version title/timestamp, restore action

## Open questions
- Version history persistence strategy: PostgreSQL snapshots vs Yjs document versions?
- How version restore interacts with active Yjs/Hocuspocus collaboration?
