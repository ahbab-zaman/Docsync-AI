# Memory — AI Assistant Panel + Members and Access

Last updated: 2026-07-27

## What was built

**09 AI Assistant Panel:**
- `src/types/ai.ts` — AiActionType, AiResponse, AiRun, AiSuggestion types
- `src/data/mock-ai.ts` — 5 suggestion chips, mock AI responses for summarize/rewrite/action-items/suggest-titles/project-summary/custom
- `src/server/actions/ai.ts` — runAiAction (simulated delay), saveAiResult server actions
- `src/components/ai/AiPanel.tsx` — Main AI panel with prompt input, suggestion chips, response history, loading state, empty state
- `src/components/ai/PromptInput.tsx` — Auto-resizing textarea, Enter to submit, Shift+Enter for newline
- `src/components/ai/SuggestionChips.tsx` — Capsule buttons for quick actions
- `src/components/ai/AiResponse.tsx` — Response card with label, timestamp, HTML content, Insert/Discard actions
- `src/app/app/ai/page.tsx` — Standalone AI page at `/app/ai`
- Integrated AI toggle panel (320px, right side) into document editor

**10 Members and Access:**
- Extended `src/data/mock-workspaces.ts` — added MockPendingInvite, pendingInvites array, more mock members, helper functions (invite, accept, cancel, change role, remove)
- `src/server/actions/members.ts` — getMembers, inviteMember (Zod validated), acceptInvite, cancelInvite, changeRole, removeMember
- `src/components/members/MemberList.tsx` — Members table with avatars, role selector, remove button, pending invites section
- `src/components/members/InviteModal.tsx` — Modal form with email and role fields, error handling
- `src/components/members/RoleSelector.tsx` — Dropdown for admin/member, disabled for owner
- `src/app/app/members/page.tsx` — Members page at `/app/members`
- Sidebar links for AI Assistant and Members

## Decisions made

- AI panel: toggle button (not always-open) to keep editor canvas dominant
- AI inserted content appends to existing document content as HTML (Phase 1 simplicity)
- Members page uses first workspace as default (no workspace selector yet — kept simple for Phase 1 mock)
- Role enforcement: only owner/admin can invite/remove; owner role cannot be changed or removed
- Pending invites included in mock data with Accept/Cancel actions

## Problems solved

- Error message swallowing in invite flow: `InviteModal.onInvite` signature changed to return result object, so server validation errors (e.g., "User is already a member") are displayed to the user instead of a generic message

## Current state

- Build passes cleanly — 15 routes compile
- AI panel works in document editor (toggle) and standalone page
- Members page shows members + pending invites with role management
- All data still mock — no real DB connection

## Next session starts with

Build **11 Notifications and Activity**: notifications page, activity list, unread state, empty state, mark as read action, notification creation on key events.

## Open questions

- Session persistence strategy for auth still unresolved
- Auth route protection middleware not yet implemented
