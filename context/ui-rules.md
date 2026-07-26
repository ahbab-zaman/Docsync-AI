# UI Rules

Concise rules for building the AI collaboration workspace UI. Design tokens are the source of truth — use them exactly and keep the interface bright, readable, and premium.

---

## Font

Always import **Inter** via `next/font/google` in the root layout.

```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

Apply the font variable class to the `<html>` tag in the root layout. Never use system fonts as the primary font.

---

## Layout

* Page max width: `1440px`, centered
* Main content padding: `32px` on desktop, `20px` on tablet, `16px` on mobile
* Section gap: `24px`
* Cards and panels must not touch the viewport edges
* Keep the layout spacious and readable
* Use normal flow layout; avoid fixed-position UI unless absolutely necessary

### Responsive behavior

* Desktop: multi-column layouts are allowed
* Tablet: reduce to two columns where needed
* Mobile: stack everything into one column
* Side panels should collapse below main content on small screens
* Tables should become stacked cards or horizontal scroll on mobile when necessary
* Buttons should wrap cleanly instead of overflowing
* Nav items should compress gracefully on small screens

---

## Navbar

The app uses a **top navbar only**.

* Background: `bg-surface`
* Bottom border: `border-border`
* Navbar height: `64px`
* Left side: logo + product name
* Right side: dashboard, find jobs, profile, and quick actions

### Active / inactive states

* Active item: `text-accent`, font weight `500`
* Inactive item: `text-text-secondary`, font weight `500`
* No underline
* Active state is color only

### Mobile navbar

* Collapse to a compact layout on mobile
* Keep only essential actions visible
* Use a menu button or condensed actions if needed

---

## Cards

Every major content section should live inside a card.

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 16px;
padding: 24px;
box-shadow: var(--shadow-card);
```

### Card rules

* Use white / ivory surfaces only
* Do not use colored card backgrounds for normal sections
* Color should appear in badges, buttons, bars, icons, and text accents
* Keep card content clear and well spaced
* Use hover shadow sparingly for interactive cards

### Card variants

* Standard card: default content section
* Compact card: smaller padding for dense UI
* Highlight card: used only for hero, notices, or important summaries

---

## Typography Hierarchy

Use only the defined typography levels consistently.

### Section headings

* Font size: `16px`
* Font weight: `600`
* Color: `text-text-primary`
* Line height: `24px`

### Page titles

* Font size: `28px`
* Font weight: `700`
* Color: `text-text-primary`
* Line height: `36px`

### Body / primary content

* Font size: `14px`
* Font weight: `500`
* Color: `text-text-primary`
* Line height: `20px`

### Secondary / muted text

* Font size: `12px`
* Font weight: `400`
* Color: `text-text-muted`
* Line height: `16px`

### Stat numbers

* Font size: `30px`
* Font weight: `600`
* Color: `text-text-primary`

### Typography rules

* Never mix too many weights inside one element
* Avoid decorative typography
* Keep copy concise and readable
* Use muted text for timestamps, helper text, and labels

---

## Buttons

### Primary button

* Background: `bg-accent`
* Text: `text-accent-foreground`
* Radius: `8px`
* Padding: `8px 16px`
* Font size: `14px`
* Font weight: `500`

### Secondary button

* Background: `bg-surface`
* Border: `border-border`
* Text: `text-text-primary`
* Radius: `8px`
* Padding: `8px 16px`

### Tertiary / ghost button

* Transparent background
* Text uses token colors
* No heavy borders unless needed

### Button rules

* Use the primary button only for the main action on the page
* Do not overload the page with too many primary buttons
* Keep hover states subtle
* Keep buttons large enough for mobile tap targets

---

## Form Inputs

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
padding: 8px 12px;
font-size: 14px;
color: var(--color-text-primary);
placeholder-color: var(--color-text-muted);
```

### Input rules

* Always show a visible focus state using `ring-accent`
* Never use raw Tailwind color classes
* Use clear labels above inputs
* Keep helper text short and muted
* Inputs must stretch to fit the container width

### Mobile form rules

* Inputs should stack vertically
* Keep label spacing consistent
* Avoid cramped two-column forms on small screens unless absolutely necessary

---

## Badges

All badges use pill shape unless specified otherwise.

```css
border-radius: 9999px;
padding: 2px 8px;
font-size: 12px;
font-weight: 500;
```

### Badge types

* Matched skill: `bg-success-lightest` + `text-success-foreground`
* Missing skill: `bg-accent-muted` + `text-accent`
* Neutral badge: `bg-surface-secondary` + `text-text-secondary`
* AI badge: `bg-secondary-muted` + `text-secondary`
* Warning badge: `bg-warning-lightest` + `text-warning`

---

## Tables

Use tables only when the data benefits from a grid layout.

### Table rules

* White / ivory rows only
* No alternating row colors
* Use subtle borders between rows
* Header text should be uppercase or small caps style, muted, and readable
* Hover state should be soft and lightweight

### Mobile table behavior

* Convert dense tables into stacked cards when possible
* If keeping a table, allow horizontal scrolling on small screens
* Never let text overflow outside the viewport

---

## Match Score Bars

Inline progress bars should be small, clear, and consistent.

```css
height: 4px;
border-radius: 9999px;
background: var(--color-border);
```

### Score colors

* `90–100%` → success color
* `70–89%` → info color
* `50–69%` → warning color
* Below `50%` → muted text / secondary surface

The score bar should always appear next to or under the percentage number.

---

## Empty States

Every section that can be empty must have an empty state.

### Empty state rules

* Keep text short
* Use muted text
* Add a useful CTA if there is a logical next action
* Optional icon is allowed
* Avoid large illustrations unless they add real value

### Tone

Empty states should feel helpful, not heavy.

---

## Layout-Specific Rules

### Dashboard

* Use stat cards at the top
* Use activity and analytics sections below
* Keep the most important data visible first
* Use cards in a clear vertical rhythm

### Document / editor-like pages

* Use a three-zone layout when space allows:

  * left: outline or navigation
  * center: editor/content
  * right: AI assistant or details panel
* Collapse to one column on mobile

### Project / workspace overview

* Use summary cards
* Show recent activity, members, documents, and quick actions
* Tabs are allowed, but do not overuse them

### Landing page

* Use a premium hero
* Include how-it-works, features, testimonials, and CTA sections
* Keep the page airy and readable
* Do not make it feel like a dashboard

---

## Color Usage Rules

### Backgrounds

* Use `bg-background` for the app shell
* Use `bg-surface` for cards, menus, and panels
* Use `bg-surface-secondary` for subtle sections
* Use `bg-surface-tertiary` only for depth or small supporting areas

### Accent usage

* Use `accent` for primary actions and active navigation
* Use `secondary` for AI, online, and collaborative states
* Use `highlight` for warm emphasis and premium attention areas

### Do not

* Use raw hex values in components
* Use raw Tailwind color classes like `bg-purple-500` or `text-gray-600`
* Make the entire interface dark again
* Use too many accent colors at once
* Add heavy gradients to every section

---

## Shadows and Depth

* Default cards use a soft shadow
* Hover states can deepen the shadow slightly
* Popovers and menus can use a stronger shadow
* Do not use harsh or dramatic shadows

Keep the UI crisp, but not heavy.

---

## Radius Rules

* Inputs and buttons: `8px`
* Standard cards: `16px`
* Large panels: `24px`
* Pills and badges: `9999px`

Do not stack too many nested rounded containers inside one component.

---

## Motion

Use subtle motion only.

### Allowed

* soft hover transitions
* fade-ins
* small scale on buttons
* loading skeletons
* gentle section transitions

### Not allowed

* excessive motion
* distracting bounce effects
* aggressive animations
* animation that reduces clarity

---

## Accessibility

* Maintain strong text contrast
* Keep interactive targets large enough on mobile
* Labels must not be replaced by placeholders
* Focus states must be visible
* Do not rely on color alone to communicate meaning

---

## Do Nots

* Never use raw Tailwind color classes
* Never hardcode colors inside components
* Never make cards dark unless explicitly required for a special component
* Never create noisy gradients or neon effects
* Never use more than two nested radius levels in one UI block
* Never hide important actions on mobile
* Never let content become unreadable for the sake of style

---

## Design Goal

The UI should feel:

* premium
* clean
* bright
* uncommon
* readable
* modern
* product-focused

The visual identity should lean toward **Ivory Nebula**: warm ivory surfaces, crisp dark text, violet for primary actions, teal for AI/realtime states, and warm orange for emphasis.
