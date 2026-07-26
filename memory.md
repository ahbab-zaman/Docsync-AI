# Memory — Notifications and Activity

Last updated: 2026-07-27

## What was built

**11 Notifications and Activity:**
- `src/types/notifications.ts` — Notification, ActivityEvent types, NotificationType union
- `src/data/mock-notifications.ts` — 7 mock notifications, 7 mock activity events, helper functions (create, mark read, mark all read, get unread count)
- `src/server/actions/notifications.ts` — getNotifications, getActivity, getUnreadCount, markAsRead, markAllAsRead server actions
- `src/components/notifications/NotificationList.tsx` — Notification list with unread/read visual states, individual mark-as-read, mark all as read, empty state
- `src/components/notifications/ActivityList.tsx` — Activity feed with type icon, metadata, empty state
- `src/components/layout/Sidebar.tsx` — Refactored sidebar from inline layout into a client component with live unread notification badge
- `src/app/app/notifications/page.tsx` — Notifications page at `/app/notifications` with both sections
- Updated `src/app/app/layout.tsx` — Replaced inline nav with Sidebar component

## Decisions made

- Notifications and Activity are on the same page (split into two sections) to keep Phase 1 simple
- Sidebar refactored to a client component to support the dynamic notification badge
- Notification types use text symbols (→, ✎, ✓, etc.) rather than icons — keeps Phase 1 dependency-free

## Problems solved

- Review found 2 minor issues: sidebar badge used `bg-accent` (button style) instead of `bg-accent-soft text-accent` (badge pattern); unused `NotificationBadge.tsx` dead code — both fixed via recover

## Current state

- Build passes cleanly — 16 routes compile (including new `/app/notifications`)
- Notifications page shows both notification list and activity feed
- Unread/read states are visually distinct
- Sidebar shows live unread count badge via server action
- All data still mock — no real DB connection

## Next session starts with

Build **14 Quality and Polish**: loading skeletons, empty states, error states, toasts, confirmation dialogs, responsive behavior, keyboard interactions, accessibility pass.

## Open questions

- Session persistence strategy for auth still unresolved
- Auth route protection middleware not yet implemented
