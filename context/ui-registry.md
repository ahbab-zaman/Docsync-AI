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
- `src/components/comments/CommentBubble.tsx` — REMOVED. Was superseded by `SelectionMenu` (unified Comment + AI floating toolbar); deleted during the Phase 3 production-readiness pass. Selection-based commenting is handled by `SelectionMenu` + `CommentMarkers`.
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
- `src/components/ai/AiPageClient.tsx` — Client shell for `/app/ai`
  - Props: `documents`, `initialRuns?`
  - Document selector (picks a document from `getAiDocuments`), prompt input, message thread, clear-chat
  - Delegates to `runAiCompletion` server action (OpenRouter with mock fallback)
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
- `src/app/app/documents/[documentId]/DocumentActionBar.tsx` — Top action bar extracted from `DocumentEditor`
  - Save status, outline toggle, collaborator avatars, History/Comments/AI panel buttons

### Version History
- `src/components/editor/VersionHistory.tsx` — Right sidebar version timeline
  - Props: `documentId`, `currentContent`, `onRestore`
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
- `src/components/notifications/NotificationList.tsx` — DB-backed notification list with lucide type icons, mark read/mark all
  - Props: `initialNotifications`
  - Icons: UserPlus, UserMinus, ShieldCheck, FileEdit, Share2, UserCheck, Mail (invite_sent), XCircle (invite_declined), FolderPlus, Settings
  - Classes: `bg-surface-secondary` for unread, `rounded-full bg-accent/10 text-accent` for icon badges
  - Data source: `src/server/actions/notifications.ts` against the `notifications` table (via `src/lib/notifications.ts`)
- `src/components/notifications/ActivityList.tsx` — DB-backed activity event list with same icon pattern
  - Props: `activity`
  - Classes: `rounded-full bg-surface-tertiary text-text-muted` for icon badges
  - Data source: `activity_events` table
- `src/components/layout/Sidebar.tsx` — Nav sidebar with lucide icons, active state via `usePathname`, bell icon with unread badge, 30s polling
  - Classes: active `bg-accent text-accent-foreground`, inactive `text-text-secondary hover:bg-surface hover:text-foreground`
  - Mobile: hamburger menu (`fixed top-3 left-3 z-40`), overlay sidebar (`bg-overlay/40 backdrop-blur-sm`), auto-closes on pathname change
  - "Docsync" title links to `/` so users can return to the landing page

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
  - Delete button (page-local `deleteDocument`) with `ConfirmDialog`; redirects to project on success

### Members
- `src/components/members/MemberList.tsx` — DB-backed member rows with role badges and actions (change role, remove); pending-invite list shows status badges (pending/accepted/declined/expired) with Resend + Cancel actions
- `src/components/members/RoleSelector.tsx` — Dropdown to change a member's role (owner/admin/editor/viewer)
- `src/components/members/InviteModal.tsx` — Invite dialog; creates a token-based `workspace_invites` row and emails the invitee
- `src/components/members/WorkspaceSwitcher.tsx` — Selects which workspace the members page manages; options come from `getWorkspaces`
- `src/components/invite/InviteActions.tsx` — Accept/Decline buttons for the public invite page; calls `acceptInviteByToken`/`declineInviteByToken`, redirects into the workspace on accept

### Public Invite Page
- `src/app/invite/[token]/page.tsx` — Public accept/decline page; renders invalid/expired/accepted/declined states and routes guests to sign-in/sign-up while preserving the token via `?next=`

### Settings
- `src/components/settings/SettingsForm.tsx` — Client form bound to `src/server/actions/settings.ts`
  - Profile tab: name, email, avatar; password tab: current/new (bcrypt via `changePassword`); appearance tab: theme, density, reduced-motion
  - Loading/error/success feedback via server-action state and toasts
- `src/components/settings/ThemeProvider.tsx` — Applies `users.preferences` via `applyAppearance` on mount and listens to system theme changes
- `src/lib/appearance.ts` — `applyAppearance`, `resolveTheme`, `watchSystemTheme`; writes `data-theme` / `data-density` / `data-reduced-motion` on `<html>`

### Landing Navbar (auth-aware)
- `src/components/layout/MarketingNav.tsx` — Client navbar for the landing page, receives `user: UserPublic | null`
  - Signed out: "Sign in" link + "Get started" button
  - Signed in: animated user dropdown (`animate-dropdown-in`, 150ms) with avatar + name trigger; panel shows avatar, name, email and links to every DB-backed app section (Dashboard, Workspaces, AI Assistant, Notifications, Members, Settings) plus Log out (`logout` server action)
  - Middle nav keeps only section anchor links (Features / Collaboration / AI); no dropdown in the middle
  - `UserAvatar` renders `user.avatar_url` as an image, or an initials circle as the default avatar
  - Mobile hamburger drawer via `MarketingMobileMenu`
  - Keyboard: Escape closes dropdown/drawer, `aria-haspopup`/`aria-expanded`/`role="menu"` on the dropdown
  - Classes: dropdown `rounded-xl border border-border bg-surface shadow-popover`, menu items `rounded-lg px-3 py-2`, user profile row `border-b border-border`
- `src/components/layout/MarketingMobileMenu.tsx` — Slide/fade-in mobile drawer (`animate-menu-fade-in`, 150ms); shows a user profile block (avatar/name/email) when signed in, feature links, section anchors, and Sign in + Get started (signed out) or Log out (signed in); closes on nav or overlay click
- Animation keyframes (`dropdown-in`, `menu-fade-in`) live in `src/app/globals.css` and respect `prefers-reduced-motion`
- Used by `src/app/page.tsx`, which conditionally renders hero/final/footer CTAs based on `getCurrentUser()`

### Workspace Settings (page-local)
- `src/app/app/workspaces/[workspaceId]/WorkspaceSettings.tsx` — Edit (rename/description) and delete workspace
  - Props: `workspace`, `canManage`
  - Calls `updateWorkspace` / `deleteWorkspace`; delete uses `ConfirmDialog` and redirects to `/app/workspaces`


---

# Component Metadata

Every component registered in this document must include the metadata below.

This metadata helps AI agents understand the implementation quality, feature completeness, and maintenance requirements of each component.

Whenever a component is created, modified, refactored, or extended, update its metadata immediately.

Never leave metadata outdated.

---

## Required Metadata

### Responsive

Describe how the component behaves across breakpoints.

Include:

- Mobile layout
- Tablet layout
- Desktop layout
- Sidebar collapse behavior (if applicable)
- Overflow handling

Example

Responsive:
- Mobile: Full width, stacked layout
- Tablet: Two-column layout
- Desktop: Fixed layout with sidebar

---

### Accessibility

Document every accessibility feature implemented.

Include:

- Semantic HTML
- ARIA attributes
- Accessible labels
- Screen reader support
- Color contrast considerations

Example

Accessibility:
- Uses semantic `<button>`
- aria-label provided
- WCAG AA contrast
- Screen-reader friendly

---

### Keyboard Support

Describe keyboard interactions.

Include shortcuts and focus behavior.

Example

Keyboard Support:
- Tab navigation
- Enter to submit
- Escape closes dialog
- Arrow keys navigate list
- Ctrl+K opens search

---

### Animation

Describe every animation used.

Include

- Transition duration
- Motion type
- Hover animation
- Loading animation

Example

Animation:
- Fade in (150ms)
- Scale on hover
- Slide drawer
- Spinner while loading

---

### Loading State

Describe how loading is presented.

Examples

- Skeleton
- Spinner
- Placeholder
- Disabled buttons

Never leave users without feedback during async operations.

---

### Error State

Describe how failures are handled.

Include

- Inline validation
- Error banner
- Retry action
- Toast notification

---

### Empty State

Describe what users see when there is no data.

Include

- Illustration
- Empty message
- Primary action
- Secondary action

Every list and table should have an empty state.

---

### Dependencies

List every important dependency.

Examples

- React Hook Form
- TipTap
- TanStack Query
- Socket.IO
- Yjs
- Framer Motion

Only include direct dependencies.

---

### Owner

Specify which feature owns this component.

Examples

Owner:
- Authentication
- Documents
- AI
- Workspace
- Notifications

Avoid "Shared" unless the component is truly generic.

---

### Last Updated

Record the latest update.

Format

YYYY-MM-DD

Update this whenever

- UI changes
- Props change
- Accessibility changes
- Styling changes
- Logic changes

---

## Component Lifecycle

Whenever a new component is implemented:

1. Add the component to this registry.
2. Document its file path.
3. Describe its purpose in one sentence.
4. Record all required metadata.
5. Reference any reusable components it depends on.
6. Record any shared hooks or utilities used.

Whenever an existing component changes:

- Update its metadata.
- Update any changed props.
- Update dependencies if new libraries are introduced.
- Remove obsolete information.

This registry must always represent the current implementation.

---

## Documentation Rules

Every component entry should answer the following questions:

- What is this component responsible for?
- Where is it located?
- Which feature owns it?
- Is it responsive?
- Is it accessible?
- Does it support keyboard navigation?
- What are its loading, error, and empty states?
- Which libraries does it depend on?
- When was it last updated?

If any answer changes, update this registry immediately.

