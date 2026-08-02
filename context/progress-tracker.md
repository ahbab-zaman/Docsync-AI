# Progress Tracker

## Current Status
**Phase:** Phase 3 — Engineering Excellence (complete) + Dynamic Backend Data milestone (complete)
**Last completed:** Dynamic Backend Data — all six app sections (AI, Documents, Members, Notifications, Settings, Workspaces) converted from mock data to PostgreSQL-backed server actions
**Next:** Phase 4 — Scalability & Infrastructure

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

### Phase 3 — Engineering Excellence
- [x] 01 Accessibility pass
- [x] 02 UX + responsive pass
- [x] 03 Performance pass
- [x] 04 Security pass
- [x] 05 Logging + observability
- [x] 06 Caching
- [x] 07 Error handling
- [x] 08 Testing — 92 tests across 20 files
- [x] 09 Documentation final pass
- [x] 10 Monitoring
- [x] 11 Production Readiness Review

> Note: build-plan item 09 "Deployment & DevOps" is deferred to Phase 5 — AGENTS.md assigns Docker/CI-CD/DevOps to Phase 5 (Testing, DevOps & CI/CD). No Docker or CI config exists in the repo yet.

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

## Decisions Made During Phase 3 (Engineering)
- Logging uses a JSON structured format via a shared `lib/logger.ts` with AsyncLocalStorage request context; every server action scopes its logs with a generated request ID.
- Redis failures are non-fatal: `lib/redis.ts` and `lib/cache.ts` degrade gracefully to direct DB reads so core functionality never depends on Redis.
- Cache keys follow the `cache:<entity>:<id>` convention from architecture.md; short TTLs (15–30s) prevent stale data for frequently mutating entities like documents.
- Cache invalidation happens inside server actions immediately after mutations rather than via TTL alone, keeping reads fresh.
- Error classes in `lib/errors.ts` map to HTTP status codes and friendly user messages; raw errors never leak to the client.
- Client-side `withRetry` in `lib/retry.ts` retries only transient network/offline failures, never validation or auth errors.
- Health checks live as Next.js route handlers (`/api/health`, `/api/checks/*`) so the same deployment surface serves both app and infra probes.
- Metrics are in-memory counters exposed via `/api/metrics` — lightweight and stateless, sufficient until a production metrics backend is added in Phase 4.
- Testing uses Vitest with the `@/` alias mapped to `src/`; tests live next to the code under `src/**/*.test.ts`.
- React 19 lint rules (`react-hooks/set-state-in-effect`, `react-hooks/refs`) required replacing effects that reset state on prop change with the "adjust state during render" pattern (Sidebar, SearchDialog, usePresence) and moving provider creation before `useEditor` in document sync.
- Removed dead code found during the production-readiness audit: `useDocumentSync` hook and `lib/hocuspocus.ts` client provider (no longer imported anywhere); server-side `server/hocuspocus-server.ts` remains. Also removed unused imports (`findUserById`, `getSocket`).

## Decisions Made During Dynamic Backend Data (post-Phase 3)
- AI runs through a real OpenRouter provider (`src/lib/ai/openrouter.ts`) using `~deepseek/deepseek-v4-flash-latest` as the default model; `isAiConfigured`, `runAiCompletion`, and `getAiModelName` helpers gate provider vs. fallback. Every AI run is persisted to the `ai_runs` table; the AI page (`/app/ai`) includes a real document selector so prompts can attach to a document.
- Notifications and activity events are fully PostgreSQL-backed via `src/lib/notifications.ts` helpers (`createNotification`, `createActivityEvent`, `notifyWorkspaceMembers`, `notifyWorkspaceAdmins`, `createThrottledDocumentUpdatedActivity`). No mock data remains for notifications.
- Members management is DB-backed: `workspace_invites` table stores pending invites with status + role, and `src/server/actions/members.ts` implements invite, accept, cancel, change role, and remove member against PostgreSQL.
- Settings is DB-backed via `src/server/actions/settings.ts` + extended `src/server/repositories/user.ts`: profile (name/email/avatar), password (bcrypt via the same auth helpers), and appearance (theme/density/reduced-motion) stored in the `users.preferences` JSONB column.
- Appearance settings are applied client-side by `src/lib/appearance.ts` (`applyAppearance`, `resolveTheme`, `watchSystemTheme`) and `src/components/settings/ThemeProvider.tsx`; CSS tokens in `globals.css` react to `data-theme`, `data-density`, and `data-reduced-motion` attributes on `<html>`.
- Workspaces gained `updateWorkspace` + `deleteWorkspace` actions; the workspace detail page (`[workspaceId]/WorkspaceSettings.tsx`) exposes edit/delete gated by the caller's role (`canManage`). Documents gained a `deleteDocument` action wired into the editor.
- Model ID note: the plain `deepseek/deepseek-v4-flash-latest` identifier returns a 400 from OpenRouter; the `~`-prefixed `~deepseek/deepseek-v4-flash-latest` resolves correctly, so the provider uses the prefixed form.
- CSS was converted from `@theme inline` to `@theme` because Tailwind v4 cannot override `inline` theme values.
- Server action files are async-only; sync exports from `"use server"` files break the Turbopack build (removed `sanitizePreferences` accordingly).
- `.env.local` carries the OpenRouter API key; the original value had a stray trailing `]` which was removed so the key authenticates correctly.

## Dynamic Backend Data Milestone (post-Phase 3)
- Schema additions applied to PostgreSQL (`src/server/schema.sql`): `workspace_invites`, `notifications`, `activity_events`, `ai_runs` tables and a `users.preferences` JSONB column.
- Deleted mock modules `src/data/mock-notifications.ts` and `src/data/mock-workspaces.ts`.
- Converted all six app sections to DB-backed server actions and verified at runtime:
  - AI (`/app/ai`) — OpenRouter completion with mock fallback, persisted runs, document selector.
  - Documents (`/app/documents/[documentId]`) — create/save/delete against PostgreSQL.
  - Members (`/app/members`) — workspace switcher, real members, DB invites with accept/cancel/role management.
  - Notifications (`/app/notifications`) — DB-backed list, mark read / mark all, unread badge, plus activity feed.
  - Settings (`/app/settings`) — profile, password change (bcrypt), appearance (theme/density/reduced-motion).
  - Workspaces (`/app/workspaces`, `/[workspaceId]`) — create/read/update/delete with activity events.
- Activity events are fired from workspace create/update, project create, document create/save, invite, accept, role change, and member removal actions.
- Final verification: `tsc --noEmit` clean, ESLint 0 problems, 92 tests / 20 files passing, `next build` succeeds (all 11 app routes dynamic), DB health check returns ok, and every app page returns HTTP 200 with real DB content.

## Landing Navbar (Dynamic Auth)
- `src/components/layout/MarketingNav.tsx` — client navbar on the landing page. When signed out it shows "Sign in" + "Get started"; when signed in it shows an animated user dropdown (avatar, name, email) listing every DB-backed app section (Dashboard, Workspaces, AI, Notifications, Members, Settings) plus Log out. Middle nav keeps only the section anchor links (Features / Collaboration / AI).
- Avatar uses `user.avatar_url` when present, otherwise an initials circle.
- Dropdown animation uses CSS keyframes `dropdown-in` / `menu-fade-in` defined in `globals.css` (150ms ease-out, respects `prefers-reduced-motion`).
- `src/app/page.tsx` passes the current user from `getCurrentUser()` into the navbar and renders every CTA (hero, final section, footer) conditionally on login state.
- `src/components/layout/MarketingMobileMenu.tsx` — mobile drawer with user profile block when signed in, feature links, and Sign in/Get started or Log out actions.
- Session persistence implemented: new `sessions` table (id, user_id, created_at, expires_at) + `src/server/repositories/session.ts`. `loginUser` writes a session row and cookie, `getCurrentUser` resolves the cookie via the DB, `logoutUser` deletes the session row. `src/server/auth.ts` previously returned null unconditionally, so the navbar always showed the signed-out state.
- The `/app` sidebar "Docsync" title now links to `/` so authenticated users can return to the landing page.

## Security Improvements (Phase 3)- Created `lib/rate-limiter.ts` — in-memory rate limiter with configurable windows and max requests.
- Applied rate limiting to login (10/min) and register (5/min) server actions.
- Created `lib/sanitize.ts` — HTML sanitizer and escape utilities for user content.
- Hardened cookie configuration: `sameSite` changed from `"lax"` to `"strict"`.

## Performance Optimizations (Phase 3)
- Lazy-loaded heavy components with `next/dynamic`: AiPanel, CommentSidebar, VersionHistory, OutlinePanel, SearchDialog.
- Added `React.memo` to ToolbarButton and CollaboratorAvatars.
- Added `useMemo` to computed values in DocumentEditor (collaborators, onlineCount, commentRanges, unresolvedCount).

## Logging & Observability (Phase 3)
- Created `lib/logger.ts` — structured JSON logger with levels, AsyncLocalStorage request context, and request ID generation.
- Wrapped every server action in `runWithRequestContext` with a generated request ID.
- Logged business events across workspace, project, document, member, auth, AI, comment, version, notification, and search actions.
- Logged socket server connect/disconnect/listen and hocuspocus lifecycle events.
- Added health-check endpoints: `/api/health`, `/api/checks/database`, `/api/checks/redis`, `/api/checks/socket`.

## Caching (Phase 3)
- Created `lib/redis.ts` — ioredis client with graceful fallback (returns `null`/`false` when Redis is unavailable).
- Created `lib/cache.ts` — `withCache`, `setCached`, `getCached`, `invalidateCache` helpers with TTL and documented cache keys.
- Applied caching to workspace list, single workspace, project list, single project, and document reads (short TTLs: 15–30s).
- Cache invalidation wired into create/update/archive mutations for workspaces, projects, documents, and member changes.

## Error Handling (Phase 3)
- Created `lib/errors.ts` — typed error classes (`ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `RateLimitedError`, `InfrastructureError`) with HTTP status codes and friendly messages.
- DB layer maps unique violations → `ConflictError` and retryable failures → `InfrastructureError`.
- Created `lib/retry.ts` — `withRetry` with exponential backoff, network-error detection, and offline detection.
- Added retry + offline + error state to `AiPanel` (previously silent failure).

## Monitoring (Phase 3)
- Created `lib/metrics.ts` — in-memory counters with avg duration and last-error tracking.
- DB query/transaction layer records duration metrics.
- Added `/api/metrics` endpoint exposing the metric snapshot.
- Socket server exposes `/health` with active connection count.

## Testing (Phase 3)
- Added Vitest (`npm test` / `npm run test:watch`) with `@/` alias mapping to `src/`.
- Unit tests: `rate-limiter`, `sanitize`, `retry`, `errors`, `metrics`, `logger` — 42 tests, all passing.
- Fixed a latent sanitizer bug: `javascript:` URLs were not blocked and `/` escaping broke URLs.
- Fixed `isOnline()` returning `undefined` in non-browser environments.
- Added jsdom + React Testing Library for component tests; vitest config includes `*.{ts,tsx}` and a shared setup file (`src/tests/setup.ts`) with jest-dom matchers and RTL cleanup guarded to DOM environments.
- API route integration tests: `health`, `metrics`, `checks/database`, `checks/redis`, `checks/socket` — assert status codes and response bodies with mocked infra dependencies (`next/server` real).
- Server action integration test: `createWorkspace` — validation rejects empty/over-long names without touching the DB, success path asserts the INSERT SQL, membership row, cache invalidation, and friendly DB-failure handling.
- Collaboration workflow tests: `createPresenceUser`, `createRoom`, `SOCKET_EVENTS` constants.
- Authentication flow tests: `hashPassword`/`verifyPassword` (bcrypt hashing, correct/incorrect password, unique salts).
- Cache degradation tests: `getCached`/`setCached`/`invalidateCache`/`withCache` no-op and fall back to source when Redis is unavailable.
- Component tests: `EmptyState`, `LoadingSpinner`, `Skeleton`, `ConfirmDialog` (a11y, keyboard, backdrop), `CollaboratorAvatars` (initials, online dot, overflow cap).
- Total: 92 tests across 20 files — all passing (`npm test`), typecheck (`tsc --noEmit`) clean, lint 0 errors, production build passes.

## UX Polish Improvements (Phase 3)
- Added missing `loading.tsx` for notifications page.
- Added `error.tsx` for workspace detail and project detail pages.
- Improved `EmptyState` component to support ReactElement icons.
- Standardized empty states with consistent `aria-hidden` on icons.
- Added `aria-hidden="true"` to decorative icons across all remaining components.

## Accessibility Fixes Applied (Phase 3)
- Skip navigation link added to root layout, target `#main-content` on app layout.
- `prefers-reduced-motion` media query added to `globals.css` to disable all animations.
- Settings page inputs: added missing `htmlFor`/`id` associations.
- TiptapEditor toolbar: added `role="toolbar"`, `aria-label`, `aria-pressed` on buttons, `aria-hidden` on icons.
- SearchDialog: added `role="dialog"`, `aria-modal="true"`, `aria-label="Search"`.
- SelectionMenu: added `aria-haspopup`, `aria-expanded`, `role="menu"`, `role="menuitem"` on AI dropdown.
- DocumentEditor panel toggles: added `aria-label`, `aria-expanded`/`aria-pressed`.
- Document title input: added `aria-label="Document title"`.
- Auth forms: added `autoComplete` attributes (email, name, current-password, new-password).
- Decorative icons: added `aria-hidden="true"` across all pages.
- FeatureCard on landing page: converted `<div>` to `<article>`.
- Missing CSS tokens added: `accent-soft`, `border-strong`.
- Replaced `<a>` with `<Link>` from Next.js in app pages for proper SPA navigation.
- Added `role="list"`/`role="listitem"` to member and document lists.

## Documentation Final Pass (Phase 3)
- `code-structure.md` rewritten to reflect the actual tree: `src/app/app` (no route-group parens), `src/server` actions/repositories, `src/data`, `src/types`, root `server/`, and the real `src/lib` and `src/realtime` file lists.
- `project-overview.md` pages list corrected to the real routes (all under `/app`, plus `/login`, `/register`).
- `ui-registry.md` marked `CommentBubble` as deprecated (superseded by `SelectionMenu`; removed later during the Production Readiness Review).
- `README.md` replaced create-next-app boilerplate with a real project overview (features, stack, run scripts, quality checks).
- Verified every context file against the implementation; no further drift found.

## Production Readiness Review (Phase 3)
- `DocumentEditor.tsx` split: top action bar (save status, outline toggle, avatars, panel toggles) extracted to new page-local `DocumentActionBar.tsx`; `DocumentEditor.tsx` reduced from 314 → 228 lines.
- Removed all bootstrap `console.*` calls in `src/lib/db.ts` in favor of the structured `logger`.
- Deleted dead `CommentBubble.tsx` (superseded by `SelectionMenu`).
- Deleted dead repository files `workspace.ts`, `project.ts`, `document.ts` — server actions already query PostgreSQL directly via `query()`; only `user.ts` remains (used by `auth.ts`).
- Removed unused exported server actions: `getProjects`, `updateProjectAction`, `archiveProjectAction` (project), `getDocuments` (document), `getComments`/`getMentionUsers` (comments), `saveAiResult` (ai).
- Removed dead `currentTitle` prop from `VersionHistory`.
- Removed numerous unused imports/variables across `TiptapEditor`, `AiPanel`, `ActivityList`, `CommentThread`, `CommentReplyBox`, `MentionSuggestions`, `CommentMarkers`, `DocumentEditor`, and mock-data files.
- ESLint: configured `@typescript-eslint/no-unused-vars` with `argsIgnorePattern`/`varsIgnorePattern` `^_` to codify the existing underscore convention for signature-matched unused params.
- Final verification: `tsc --noEmit` clean, ESLint 0 problems, 92 tests / 20 files passing, `next build` succeeds.

# Phase 3 — Engineering Excellence

> **Objective:** Transform the Phase 2 feature-complete application into a production-ready SaaS platform by improving engineering quality, accessibility, performance, reliability, security, and maintainability. No major user-facing features should be introduced during this phase unless required to support these goals.

---

## 01 Accessibility
- [x] Audit every page against WCAG AA standards.
- [x] Ensure complete keyboard navigation for all interactive elements.
- [x] Add proper ARIA labels, landmarks, and semantic HTML.
- [x] Verify focus management, skip links, and visible focus indicators.
- [x] Respect `prefers-reduced-motion` and improve screen-reader support.

---

## 02 UX Polish
- [x] Improve empty states
- [x] Improve loading states
- [x] Improve error states
- [x] Improve success feedback
- [x] Add skeleton loaders where appropriate
- [x] Implement optimistic UI for suitable actions
- [x] Improve responsive layouts
- [x] Refine spacing and visual hierarchy
- [x] Improve navigation consistency

## 03 Performance
- [x] Profile rendering performance and remove unnecessary re-renders.
- [x] Lazy-load heavy components (editor extensions, dialogs, charts).
- [x] Optimize React rendering using memoization only where beneficial.
- [x] Improve bundle size, image optimization, and route loading.
- [x] Verify Core Web Vitals remain within acceptable limits.

---

## 04 Security
- [x] Review authentication and authorization flow.
- [x] Validate every API input using shared validators.
- [x] Sanitize user-generated content before rendering.
- [x] Apply rate limiting and security headers.
- [x] Ensure secrets and environment variables are never exposed.

---

## 05 Logging & Observability
- [x] Introduce structured logging across API and background jobs.
- [x] Add request IDs for traceability.
- [x] Log important business events and system failures.
- [x] Prepare health-check endpoints and monitoring hooks.

---

## 06 Caching
- [x] Cache frequently accessed workspace and dashboard data using Redis.
- [x] Define cache invalidation rules after mutations.
- [x] Prevent stale data while minimizing unnecessary database queries.

---

## 07 Error Handling
- [x] Standardize API error responses.
- [x] Implement friendly UI error states for every async operation.
- [x] Add retry mechanisms where appropriate.
- [x] Handle offline and network failure scenarios gracefully.

---

## 08 Testing
- [x] Add unit tests for utilities and business logic.
- [x] Add integration tests for API routes.
- [x] Add component tests for reusable UI.
- [x] Verify collaboration workflows and authentication flows.

---

## 09 Documentation
- [x] Keep all context files synchronized with implementation.
- [x] Update architecture, UI registry, and progress tracker after each completed milestone.
- [x] Record important architectural decisions and implementation notes.

---

## 10 Monitoring
- [x] Prepare application metrics for production.
- [x] Monitor API latency, Redis, PostgreSQL, queues, and realtime services.
- [x] Ensure system health endpoints report infrastructure status.

---

## 11 Production Readiness
- [x] Verify responsive behavior across supported devices.
- [x] Complete accessibility and performance audits.
- [x] Remove dead code, debug logs, and unused dependencies.
- [x] Confirm all documentation is current.
- [x] Ensure the application is ready for production deployment.

---

## Phase 3 Completion Criteria

Phase 3 is complete when:

- [x] All accessibility requirements are satisfied.
- [x] Performance targets have been achieved.
- [x] Security review has been completed.
- [x] Logging and monitoring are operational.
- [x] Testing coverage meets project standards.
- [x] Documentation reflects the current implementation.
- [x] The application is considered production-ready.
