# UI Registry

Living document. Update this file after every reusable component is built. If a component already exists here, match it exactly before creating a new variation.

---

## How to Use

Before building a component:

1. check whether a matching component already exists
2. reuse the existing class structure when possible
3. add the component here after it is implemented

---

## Baseline — Established 2026-07-26

| Property | Correct class |
|---|---|
| Page title | `text-2xl font-bold text-foreground` |
| Page subtitle | `text-sm text-text-secondary mt-1` |
| Card background | `bg-surface` |
| Card border | `border border-border` |
| Card radius | `rounded-lg` |
| Card padding | `p-4` or `p-5` |
| Card title | `font-semibold text-foreground` |
| Card description | `text-sm text-text-secondary` |
| Primary button | `bg-accent text-accent-foreground hover:bg-accent-dark px-6 py-2 rounded-lg text-sm font-medium` |
| Secondary button | `border border-border text-text-primary hover:bg-surface-secondary rounded-lg px-6 py-2 text-sm font-medium` |
| Input field | `border border-border bg-surface px-3 py-2 text-sm text-foreground rounded-lg focus:ring-2 focus:ring-accent` |
| Input label | `text-sm font-medium text-foreground` |
| Error text | `text-sm text-error` |
| Sidebar link | `text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground rounded-md px-3 py-2` |
| Badge | `inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent` |
| Dashed empty state | `border border-dashed border-border bg-surface-secondary p-4` |

---

## Registry

### PageHeader

File: `src/app/app/page.tsx`, `src/app/app/workspaces/page.tsx`, `src/app/app/settings/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Title | `text-2xl font-bold text-foreground` |
| Subtitle | `text-sm text-text-secondary mt-1` |
| Wrapper | `space-y-6` |

### Card — Workspace Card

File: `src/app/app/page.tsx`, `src/app/app/workspaces/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-lg` |
| Padding | `p-4` (dashboard) or `p-5` (workspaces) |
| Inner spacing | `space-y-2` |
| Title | `font-semibold text-foreground` |
| Description | `text-sm text-text-secondary` |
| Grid wrapper | `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` |

### Primary Button

File: `src/app/page.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | `bg-accent` |
| Text color | `text-accent-foreground` |
| Hover | `hover:bg-accent-dark` |
| Border radius | `rounded-lg` |
| Padding | `px-6 py-2` (links) or `px-4 py-2` (full-width) |
| Font | `text-sm font-medium` |
| Transition | `transition-colors` |
| Disabled | `disabled:opacity-50` |
| Height | `h-11` (link variant) |

### Secondary Button / Link

File: `src/app/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | transparent |
| Border | `border border-border` |
| Text color | `text-text-primary` |
| Hover | `hover:bg-surface-secondary` |
| Border radius | `rounded-lg` |
| Padding | `px-6 py-2` |
| Font | `text-sm font-medium` |
| Height | `h-11` |

### Form Input

File: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`, `src/app/app/settings/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-lg` |
| Padding | `px-3 py-2` |
| Font | `text-sm text-foreground` |
| Placeholder | `placeholder:text-text-muted` |
| Focus ring | `focus:outline-none focus:ring-2 focus:ring-accent` |
| Width | `w-full` |

### Form Label

File: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`, `src/app/app/settings/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Font | `text-sm font-medium` |
| Text color | `text-foreground` |

### Sidebar

File: `src/app/app/layout.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | `bg-surface-secondary` |
| Border | `border-r border-border` |
| Width | `w-64` |
| Padding | `p-4` |
| Inner gap | `gap-4` |
| Link padding | `px-3 py-2` |
| Link radius | `rounded-md` |
| Link font | `text-sm font-medium` |
| Link default | `text-text-secondary` |
| Link hover | `hover:bg-surface hover:text-foreground` |

### Badge

File: `src/app/app/workspaces/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Display | `inline-flex items-center` |
| Radius | `rounded-full` |
| Background | `bg-accent-soft` |
| Padding | `px-2.5 py-0.5` |
| Font | `text-xs font-medium` |
| Text color | `text-accent` |

### Auth Card

File: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Max width | `max-w-sm` |
| Spacing | `space-y-6` |
| Padding | `px-4` |
| Title | `text-2xl font-bold text-foreground` |
| Subtitle | `text-sm text-text-secondary mt-1` |
| Form spacing | `space-y-4` |
| Input group | `space-y-2` |

### Marketing Hero

File: `src/app/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Heading | `text-5xl font-bold tracking-tight text-foreground` |
| Subtitle | `mt-4 text-xl text-text-secondary max-w-lg` |
| CTA group | `mt-8 flex gap-4` |
| Inner | `w-full max-w-4xl px-8 text-center` |

### Dashboard Empty State

File: `src/app/app/page.tsx`
Last updated: 2026-07-26

| Property | Class |
|---|---|
| Background | `bg-surface-secondary` |
| Border | `border border-dashed border-border` |
| Radius | `rounded-lg` |
| Padding | `p-4` |
| Text | `text-sm text-text-muted` |
| Layout | `flex items-center justify-center` |

### NotificationList

File: `src/components/notifications/NotificationList.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Section title | `text-lg font-semibold text-foreground` |
| Unread count label | `text-sm font-normal text-text-muted` |
| Container | `rounded-lg border border-border divide-y divide-border` |
| Row background (unread) | `bg-surface-secondary` |
| Row background (read) | `bg-surface` |
| Row padding | `p-4` |
| Row gap | `gap-3` |
| Icon | `text-sm text-text-muted` |
| Title (unread) | `text-sm font-semibold text-foreground` |
| Title (read) | `text-sm font-medium text-foreground` |
| Description | `text-xs text-text-secondary` |
| Timestamp | `text-xs text-text-muted` |
| Action link | `text-xs text-accent hover:text-accent-dark transition-colors` |
| Empty state | `rounded-lg border border-border bg-surface p-12 text-center` |

### ActivityList

File: `src/components/notifications/ActivityList.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Section title | `text-lg font-semibold text-foreground` |
| Container | `rounded-lg border border-border divide-y divide-border` |
| Row background | `bg-surface` |
| Row padding | `p-4` |
| Description | `text-sm font-medium text-foreground` |
| Metadata name | `text-xs font-medium text-text-secondary` |
| Metadata separator | `text-xs text-text-muted` |
| Metadata workspace | `text-xs text-text-muted` |
| Metadata timestamp | `text-xs text-text-muted` |

### NotificationList — Empty State

File: `src/components/notifications/NotificationList.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Container | `rounded-lg border border-border bg-surface p-12 text-center` |
| Icon | `text-2xl mb-2` |
| Title | `text-sm font-medium text-foreground` |
| Subtitle | `text-xs text-text-muted mt-1` |
