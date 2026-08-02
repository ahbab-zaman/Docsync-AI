# Memory — Phase 3: Engineering Excellence (Complete)

Last updated: 2026-08-03

## What was built (Invite & Email Workflow)

- `workspace_invites` extended with unique `token`, `status` (`pending`/`accepted`/`declined`/`expired`), 7-day `expires_at`, and `accepted_at`; backfill migration generates tokens for existing rows.
- New `src/lib/invite-utils.ts` — token generation, expiry math, effective-status resolution, `buildInviteUrl` (`AUTH_URL` → `APP_URL` → localhost). New `src/lib/email.ts` — Resend REST integration (`RESEND_API_KEY` + `RESEND_FROM_EMAIL`) with a logged log-and-skip dev fallback (never throws, mirrors the OpenRouter fallback pattern), later upgraded with an SMTP fallback (`nodemailer` + `SMTP_*` env vars, e.g. Gmail App Password on `smtp.gmail.com:587`) so invites reach any recipient free when no verified domain is available; Resend wins when both configured. `next.config.ts` adds `serverExternalPackages: ["nodemailer"]`; email tests cover both providers.
- `src/server/actions/members.ts` rewritten around token invites: `inviteMember` stores token/expiry/status and emails the invitee (rate limited 10/min per user); new `getInviteByToken`, `acceptInviteByToken`, `declineInviteByToken`, `resendInvite`, `expireStaleInvites`; `getMembers` returns status + inviter name. Old admin-side `acceptInvite(workspaceId, inviteId)` removed.
- New public route `src/app/invite/[token]/page.tsx` (invalid/expired/accepted/declined states, guest → sign-in/sign-up preserving token) + `src/components/invite/InviteActions.tsx` (Accept/Decline, redirects into workspace on accept).
- `/login` and `/register` now read `?next=` and redirect back to the invite after auth; forms extracted to page-local `LoginForm.tsx` / `RegisterForm.tsx`.
- `MemberList` shows per-invite status badges with Resend (pending) and Cancel (pending/expired) actions instead of admin-side accept.
- Notification type union extended with `invite_sent` and `invite_declined`; icons added in `NotificationList`/`ActivityList`.
- `.env.template` documents `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and the `SMTP_*` fallback variables.
- Final verification: `tsc --noEmit` clean, ESLint 0 problems, 118 tests / 23 files passing, `next build` succeeds, schema migration applied to PostgreSQL.

## What was built (Production Readiness Review — item 11)

- `DocumentEditor.tsx` split: top action bar extracted to new page-local `DocumentActionBar.tsx`; `DocumentEditor.tsx` reduced 314 → 228 lines.
- Replaced all `console.*` calls in `src/lib/db.ts` with the structured `logger` (only `logger.ts` itself calls console).
- Deleted dead `src/components/comments/CommentBubble.tsx` (superseded by `SelectionMenu`).
- Deleted dead repository files `src/server/repositories/{workspace,project,document}.ts` — server actions query PostgreSQL directly via `query()`; only `user.ts` remains (used by `auth.ts`, mocked in `auth.test.ts`).
- Removed unused exported server actions: `getProjects`/`updateProjectAction`/`archiveProjectAction` (project), `getDocuments` (document), `getComments`/`getMentionUsers` (comments), `saveAiResult` (ai). Also removed `updateProjectSchema` and now-unused cache imports (`invalidateWorkspaceCache`, `setCached` in project kept for createProject).
- Removed dead `currentTitle` prop from `VersionHistory` (interface, destructure, and the passing site in `DocumentEditor`).
- Removed unused imports/vars across `TiptapEditor`, `AiPanel`, `ActivityList`, `CommentThread`, `CommentReplyBox`, `MentionSuggestions` (dropped `handleInput` + `setCursorPos` setter), `CommentMarkers`, `DocumentEditor`, `mock-users`, `mock-ai`, `mock-collaborators`.
- ESLint: added `@typescript-eslint/no-unused-vars` override with `argsIgnorePattern`/`varsIgnorePattern` `^_` to codify the existing underscore convention for signature-matched unused params.
- Final verification: `tsc --noEmit` clean, ESLint 0 errors / 0 warnings, 92 tests / 20 files passing, `next build` succeeds.

## What was built (Testing — item 08)

- Added `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`, `@testing-library/user-event`, and `jsdom` (installed with `--legacy-peer-deps` due to the pre-existing `@tiptap/extension-collaboration-cursor` peer conflict).
- Vitest config now includes `*.{ts,tsx}`, sets `RTL_SKIP_AUTO_CLEANUP`, and loads `src/tests/setup.ts` (jest-dom matchers + RTL cleanup guarded to DOM environments).
- API route integration tests (real `next/server`, mocked infra): `/api/health`, `/api/metrics`, `/api/checks/database`, `/api/checks/redis`, `/api/checks/socket`.
- Server action integration test: `createWorkspace` validation + success SQL/cache assertions.
- Workflow tests: realtime `presence`/`rooms`/`socket-events`, `server/auth` password hash/verify, `lib/cache` Redis-degradation fallback.
- Component tests (jsdom): `EmptyState`, `LoadingSpinner`, `Skeleton`, `ConfirmDialog`, `CollaboratorAvatars`.
- Totals now 92 tests / 20 files; `npm test`, `tsc --noEmit`, lint (0 errors), and `next build` all pass.

## What was built (Documentation final pass — item 09)

- Rewrote `context/code-structure.md` to match the real tree (no `(app)` route group, `src/server/actions` + `src/server/repositories`, `src/data`, `src/types`, root `server/`, corrected `src/lib` list).
- Corrected the `Pages` list in `context/project-overview.md` to the real `/app/*` routes.
- Marked `CommentBubble` deprecated in `context/ui-registry.md` (superseded by `SelectionMenu`, unimported).
- Replaced the create-next-app boilerplate `README.md` with a real project overview (features, stack, run scripts incl. `dev:hocuspocus`/`dev:socket`/`dev:all`, quality checks).
- Confirmed `architecture.md`, `library-docs.md`, `ui-rules.md`, and `ui-tokens.md` need no changes; no doc drift remains.

## What was built (Phase 3 — logging, observability, caching, errors, monitoring, testing)

### Production readiness cleanup
- Fixed all React 19 lint errors (set-state-in-effect, refs-during-render) in Sidebar, SearchDialog, usePresence, OutlinePanel, useDocumentSync.
- Restructured document sync: provider now created via `useMemo` before `useEditor` (documented TipTap pattern), removing `providerRef` render reads and `any` casts.
- Removed dead code: `useDocumentSync` hook and `src/lib/hocuspocus.ts` client provider (unused); kept `server/hocuspocus-server.ts`.
- Removed unused imports (`findUserById` in auth, `getSocket` in useSocket).
- Final state at the time: `npm run lint` → 0 errors / 19 warnings (remaining warnings later eliminated in item 10 via dead-code removal + ESLint `^_` ignore pattern); `npx tsc --noEmit` passes; `npm run build` passes; `npm test` → 42 tests passing.

## What was built

### Session 1 — Comments + Mentions (05)
- `src/components/comments/MentionSuggestions.tsx` — `@` mention autocomplete with keyboard nav
- `src/components/comments/CommentBubble.tsx` — Floating bubble on text selection (deprecated in session 2, removed in item 10)
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

### Session 5 — Search (09)
- `src/types/search.ts` — `SearchResultItem`, `SearchResults`, `SearchResultType` types
- `src/data/mock-search.ts` — 16 mock results with in-memory token index + relevance scoring
- `src/server/actions/search.ts` — `search(query)` server action returning grouped results
- `src/components/search/SearchDialog.tsx` — Cmd+K modal with debounced search, grouped list, keyboard navigation
- Updated `src/components/layout/Sidebar.tsx` — Added search bar with Ctrl+K badge and global Cmd+K listener

### Session 6 — Polish & Responsiveness (10)
- Updated `src/components/layout/Sidebar.tsx` — Hamburger menu for mobile, overlay pattern, auto-close on navigation
- Updated `src/app/app/layout.tsx` — Added mobile padding for hamburger button
- Updated `src/app/app/documents/[documentId]/DocumentEditor.tsx` — Three-zone layout stacks on mobile, action bar wraps, panels full-width on small screens
- Updated `src/components/documents/TiptapEditor.tsx` — Responsive min-height (300px mobile / 500px desktop), responsive padding
- Updated `src/app/app/documents/[documentId]/page.tsx` — Responsive breadcrumb with truncation
- Updated `src/app/app/notifications/page.tsx` — Responsive spacing and heading sizes
- Updated `src/components/notifications/NotificationList.tsx` — Responsive text sizes and spacing
- Updated `src/app/app/page.tsx` — Empty state for no workspaces, responsive grid
- Updated `src/app/app/workspaces/page.tsx` — Empty state, responsive grid, fixed `bg-accent-soft` class
- Updated `src/app/app/error.tsx` — Lucide `AlertTriangle` icon instead of emoji

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
- Search uses a Cmd+K modal (spotlight pattern) rather than a full-page search route
- Search index is an in-memory Map-based token index with relevance scoring by token frequency and substring matching
- Search debounces input by 200ms before calling the server action
- Search dialog handles keyboard navigation (arrow keys, enter, escape)
- Sidebar uses overlay pattern on mobile with hamburger toggle; auto-closes on route change
- DocumentEditor panels stack vertically below lg breakpoint; right panels are full-width with capped height

## Problems solved
- `BubbleMenu` export missing from @tiptap/react v3 — replaced with custom floating component
- `Decoration`/`DecorationSet` not in `@tiptap/pm/state` — imported from `@tiptap/pm/view` instead
- DocumentEditor had broken right-panel toggle referencing undefined `aiPanelOpen` — rewired
- TypeScript `useEffect` cleanup with nullable editor — used local variable pattern

## Current state
- Phase 2 items 01-10 complete
- Phase 3: accessibility, UX polish, performance, security hardening complete
- Phase 3: logging & observability, caching, error handling, monitoring, unit tests, integration tests, component tests, collaboration/auth workflow tests, and documentation final pass complete
- Build compiles, type-checks, lints (0 errors / 19 pre-existing warnings), and `npm test` passes (92 tests)
- PostgreSQL wired; Redis now wired with graceful fallback; BullMQ installed but not yet in use

## Next steps
- Phase 3 item 10: Production Readiness Review — final engineering review and Phase 3 completion
- Phase 4 — Scalability & Infrastructure

## Open questions
- Version history persistence strategy: PostgreSQL snapshots vs Yjs document versions?
- How version restore interacts with active Yjs/Hocuspocus collaboration?
- Notification delivery strategy: Socket.IO push vs polling?
- Search persistence: PostgreSQL full-text search vs Elasticsearch/Meilisearch?
