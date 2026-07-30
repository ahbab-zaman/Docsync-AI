# UI Tokens

## How to Use
Define all design tokens in `src/app/globals.css` using the `@theme` directive. No `tailwind.config.ts` is needed for colors or tokens.

## Complete Token Definition

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;

  --color-background: #f6f1ea;
  --color-surface: #fffdf8;
  --color-surface-secondary: #f5eee2;
  --color-surface-tertiary: #ede4d7;
  --color-surface-muted: #f8f3ec;

  --color-border: #ddd4c6;
  --color-border-light: #e7decf;
  --color-border-muted: #d8cdbd;

  --color-text-primary: #15131a;
  --color-text-secondary: #5c5966;
  --color-text-muted: #8d8796;
  --color-text-dark: #3f3a47;
  --color-text-darker: #2e2935;
  --color-text-darkest: #111015;
  --color-text-black: #0d0c10;
  --color-text-slate: #2b2830;
  --color-text-slate-medium: #6d6876;

  --color-accent: #5b4bff;
  --color-accent-dark: #4332f2;
  --color-accent-light: #ece9ff;
  --color-accent-muted: #f5f3ff;
  --color-accent-foreground: #ffffff;

  --color-secondary: #0fa3b1;
  --color-secondary-dark: #0b7f8a;
  --color-secondary-light: #d9f7fa;
  --color-secondary-muted: #eefcfd;
  --color-secondary-foreground: #ffffff;

  --color-highlight: #d97d54;
  --color-highlight-light: #fae5dc;
  --color-highlight-muted: #fdf3ef;
  --color-highlight-foreground: #ffffff;

  --color-success: #1f9d73;
  --color-success-light: #d7f2e8;
  --color-success-lightest: #eefaf5;
  --color-success-foreground: #157a58;

  --color-info: #4a84ff;
  --color-info-light: #dbe6ff;
  --color-info-lightest: #eef3ff;
  --color-info-foreground: #245ff0;

  --color-warning: #d6a100;
  --color-warning-light: #fff3cc;
  --color-warning-lightest: #fff9e6;

  --color-error: #e25555;
  --color-error-light: #ffe0e0;
  --color-error-lightest: #fff1f1;

  --color-linkedin: #0a66c2;
  --color-linkedin-light: #dce6f1;
  --color-linkedin-foreground: #ffffff;

  --color-overlay: #15131a;
  --color-overlay-dark: #0f0d13;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  --shadow-card: 0px 10px 30px rgba(21, 19, 26, 0.06);
  --shadow-card-hover: 0px 14px 40px rgba(21, 19, 26, 0.09);
  --shadow-popover: 0px 18px 50px rgba(21, 19, 26, 0.12);
}
```

## Color Usage
- `bg-background` for the app shell
- `bg-surface` for cards, menus, and panels
- `bg-surface-secondary` for subtle sections
- `bg-accent` for primary actions and active navigation
- `bg-secondary` for AI, online, and collaborative states
- `bg-highlight` for warm emphasis

# Typography Tokens

Define a consistent typography system across the application. Never hardcode font sizes in components. Always use the predefined Tailwind utility classes or CSS variables mapped to these tokens.

| Token | Font Size | Usage |
|--------|----------:|------|
| xs | 12px | Helper text, badges, captions |
| sm | 14px | Secondary text, metadata |
| base | 16px | Default body text |
| lg | 18px | Large body text |
| xl | 20px | Card titles |
| 2xl | 24px | Section headings |
| 3xl | 32px | Page headings |
| 4xl | 40px | Hero titles |

---

# Spacing Tokens

Use a consistent spacing scale throughout the application. Never use arbitrary values (`p-[13px]`, `mt-[27px]`, etc.) unless absolutely necessary.

| Token | Value | Usage |
|--------|------:|------|
| 2 | 2px | Micro spacing |
| 4 | 4px | Icons, badges |
| 8 | 8px | Small gaps |
| 12 | 12px | Compact spacing |
| 16 | 16px | Default padding |
| 20 | 20px | Cards |
| 24 | 24px | Sections |
| 32 | 32px | Large spacing |
| 40 | 40px | Page sections |
| 48 | 48px | Layout spacing |
| 64 | 64px | Hero spacing |
| 80 | 80px | Large layouts |
| 96 | 96px | Landing page spacing |

---

# Animation Tokens

Animations should communicate state changes, not distract users.

## Duration

| Token | Value | Usage |
|--------|------:|------|
| fast | 100ms | Hover |
| normal | 200ms | Buttons, cards |
| slow | 300ms | Dialogs |
| page | 500ms | Page transitions |

Always use `ease-out` for UI interactions unless another easing is explicitly required.

---

# Transition Tokens

Standardize all transitions across the application.

- Button Hover → 150ms
- Card Hover → 200ms
- Modal Open → 250ms
- Drawer Open → 300ms
- Sidebar Collapse → 250ms
- Tooltip → 100ms

Never animate layout unnecessarily.

---

# Shadow Tokens

Use shadows consistently to establish elevation.

| Token | Usage |
|--------|------|
| shadow-card | Default cards |
| shadow-card-hover | Hovered cards |
| shadow-popover | Dropdowns, popovers, dialogs |

Never create custom shadows inside components.

---

# Blur Tokens

Blur should only be used for overlays and glass effects.

| Token | Value | Usage |
|--------|------:|------|
| blur-sm | 4px | Small overlays |
| blur-md | 8px | Dialog backgrounds |
| blur-lg | 16px | Glass panels |

---

# Opacity Tokens

Use predefined opacity values.

- 100%
- 90%
- 75%
- 60%
- 40%
- 20%
- 10%

Avoid arbitrary opacity values.

---

# Z-Index Tokens

Maintain a consistent layering hierarchy.

| Layer | Value |
|--------|------:|
| Base | 0 |
| Dropdown | 20 |
| Sticky Header | 30 |
| Sidebar | 40 |
| Drawer | 50 |
| Modal | 60 |
| Popover | 70 |
| Toast | 80 |
| Tooltip | 90 |
| Loading Overlay | 100 |

Never use random z-index values.

---

# Breakpoint Tokens

The application follows a mobile-first responsive approach.

| Breakpoint | Width |
|------------|------:|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Layouts should adapt progressively between breakpoints.

---

# Layout Tokens

## Sidebar

- Expanded Width → 280px
- Collapsed Width → 72px

---

## Navigation Bar

- Height → 72px

---

## Container Widths

| Size | Width |
|------|------:|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| full | 100% |

---

# Modal Tokens

| Size | Max Width |
|------|----------:|
| sm | 420px |
| md | 640px |
| lg | 860px |
| xl | 1080px |

Dialogs should remain vertically centered and responsive.

---

# Drawer Tokens

| Position | Width |
|----------|------:|
| Left | 320px |
| Right | 420px |

Drawers should become full-screen on mobile devices.

---

# Toast Tokens

Toast notifications should appear in the top-right corner on desktop and bottom-center on mobile.

Maximum visible toasts: **3**

Auto-dismiss after **4 seconds**, unless marked as persistent.

---

# Focus Ring

Keyboard accessibility is mandatory.

Use a consistent focus ring for all interactive elements.

- Thickness → 2px
- Offset → 2px
- Color → `--color-accent`

Never remove the browser focus indicator without replacing it with an accessible alternative.

---

# Token Usage Rules

All components must consume design tokens defined in this document.

The AI agent must:

- Never hardcode colors, spacing, typography, or shadows.
- Never use raw Tailwind color classes (`bg-blue-500`, `text-gray-700`, etc.).
- Reuse existing tokens before introducing new ones.
- Update this file whenever a new global design token is added.
- Ensure all new UI components remain visually consistent with the existing design system.
