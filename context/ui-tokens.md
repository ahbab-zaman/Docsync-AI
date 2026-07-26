# UI Tokens

All colors, typography, spacing, radii, and component values for the project. Use these exact values everywhere.

---

## How to Use

Use design tokens from `src/app/globals.css` via CSS variable classes. Do not hardcode colors inside components. Do not use raw Tailwind color classes for product colors.

---

## Design System

**Palette name:** Midnight Aurora

Dark, premium, futuristic with violet (`accent`) as the primary and teal (`secondary`) as the secondary accent.

---

## Token Reference

Tokens are defined in `src/app/globals.css` under `@theme inline` and map directly to Tailwind utility classes:

### Backgrounds
- `bg-background` — page canvas (`#070b14`)
- `bg-surface` — main card/panel (`#101827`)
- `bg-surface-secondary` — nested panels, sidebar (`#182235`)
- `bg-surface-tertiary` — elevated controls (`#1e2940`)
- `bg-surface-muted` — subtle backgrounds (`#0c1220`)

### Borders
- `border-border` — default border (`rgba(255,255,255,0.08)`)
- `border-border-strong` — stronger border (`rgba(255,255,255,0.14)`)
- `border-border-muted` — subtle border (`rgba(255,255,255,0.06)`)

### Text
- `text-text-primary` — headings, key content (`#f5f7ff`)
- `text-text-secondary` — supporting copy (`#a7b1c2`)
- `text-text-muted` — captions, timestamps (`#7b879a`)
- `text-text-inverse` — on accent backgrounds (`#070b14`)

### Accent (violet — primary)
- `bg-accent` / `text-accent` — main accent (`#7c5cff`)
- `bg-accent-dark` / `hover:bg-accent-dark` — darker hover state (`#6447ff`)
- `text-accent-light` — light accent text (`#b7a6ff`)
- `bg-accent-soft` — soft accent background (`rgba(124,92,255,0.16)`)
- `text-accent-foreground` — text on accent bg (`#ffffff`)

Use `accent` for: primary buttons, active navigation, focus rings, important status, selected states.

### Secondary (teal)
- `bg-secondary` / `text-secondary` (`#2ed3b7`)
- `bg-secondary-dark` (`#16bfa4`)
- `bg-secondary-soft` (`rgba(46,211,183,0.16)`)

Use `secondary` for: AI states, online presence, success moments.

### Semantic
- `text-error` / `bg-error-soft` — errors (`#ff6b7a`)
- `text-warning` / `bg-warning-soft` — warnings (`#f5b95b`)
- `text-success` / `bg-success-soft` — success (`#2ed3b7`)
- `text-info` / `bg-info-soft` — info (`#61a8ff`)

### Radius
- `rounded-xs` — 6px
- `rounded-sm` — 10px
- `rounded-md` — 14px (sidebar links)
- `rounded-lg` — 18px (cards, buttons, inputs)
- `rounded-xl` — 24px (panels, sheets)
- `rounded-full` — 9999px (badges, avatars)

---

## Component Values

### Buttons
- radius: `rounded-lg`
- primary background: `bg-accent`
- primary text: `text-accent-foreground`
- hover: `hover:bg-accent-dark`

### Inputs
- radius: `rounded-lg`
- border: `border-border`
- background: `bg-surface`
- focus ring: `ring-accent`

### Cards
- radius: `rounded-lg`
- padding: `p-4` or `p-5`
- border: `border border-border`

### Sidebar
- background: `bg-surface-secondary`
- link radius: `rounded-md`
- link default: `text-text-secondary`
- link hover: `hover:bg-surface hover:text-foreground`

### Badges
- radius: `rounded-full`
- background: `bg-accent-soft`
- text: `text-accent`

---

## Usage Rules

- never use raw hex values in components
- never use random Tailwind palette classes
- never mix a different palette halfway through a page
- never override the theme with one-off colors unless the token system is updated first
