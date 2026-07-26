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

### Marketing Page

File: `src/app/page.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Header BG | `border-b border-border` |
| Header inner | `mx-auto flex h-16 max-w-6xl items-center justify-between px-6` |
| Logo | `text-lg font-bold text-foreground tracking-tight` |
| Nav link | `text-sm text-text-secondary hover:text-foreground transition-colors` |
| Hero badge | `inline-flex items-center rounded-full border border-border bg-surface-secondary px-4 py-1.5 text-xs text-text-muted` |
| Hero heading | `text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight` |
| Accent text | `text-accent` |
| Hero subtitle | `mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed` |
| Section title | `text-3xl font-bold text-foreground` |
| Section subtitle | `mt-3 text-text-secondary max-w-xl mx-auto` |
| Feature card | `rounded-xl border border-border bg-surface p-6 space-y-3 hover:border-border-strong` |
| Feature icon wrap | `flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-lg text-accent` |
| Feature title | `font-semibold text-foreground` |
| Feature desc | `text-sm text-text-secondary leading-relaxed` |
| Section grid | `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` |
| Split section | `grid items-center gap-12 lg:grid-cols-2` |
| Checklist item | `flex items-center gap-3 text-sm text-text-secondary` |
| Checklist bullet | `flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent` |
| Preview panel | `rounded-xl border border-border bg-surface-secondary p-6` |
| Preview card | `rounded-lg border border-border bg-surface p-4 space-y-3` |
| Footer | `border-t border-border py-12` |
| Footer inner | `flex flex-col items-center justify-between gap-6 sm:flex-row` |
| Footer link | `text-xs text-text-muted hover:text-text-secondary transition-colors` |

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

### Skeleton

File: `src/components/ui/Skeleton.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Background | `bg-surface-tertiary` |
| Animation | `animate-pulse` |
| Radius | `rounded-md` |
| A11y | `aria-hidden="true"` |

### ConfirmDialog

File: `src/components/ui/ConfirmDialog.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Overlay | `fixed inset-0 z-50 flex items-center justify-center bg-black/40` |
| Container | `w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg` |
| Title | `text-lg font-semibold text-foreground` |
| Message | `text-sm text-text-secondary` |
| Action group | `flex gap-3 justify-end` |
| Default confirm | `bg-accent text-accent-foreground hover:opacity-90` |
| Danger confirm | `bg-error text-accent-foreground hover:opacity-90` |
| Cancel button | `rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary` |
| A11y | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |

### EmptyState

File: `src/components/ui/EmptyState.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Container | `rounded-lg border border-border bg-surface p-12 text-center flex flex-col items-center justify-center` |
| Icon | `text-2xl mb-2` |
| Title | `text-sm font-medium text-foreground` |
| Description | `text-xs text-text-muted mt-1 max-w-sm` |
| Action wrapper | `mt-4` |

### LoadingSpinner

File: `src/components/ui/LoadingSpinner.tsx`
Last updated: 2026-07-27

| Property | Class |
|---|---|
| Container | `flex flex-col items-center justify-center gap-2` |
| Spinner | `h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent` |
| Label | `text-xs text-text-muted` |
| A11y | `role="status"`, `aria-live="polite"` |
