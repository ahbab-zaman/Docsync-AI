# UI Tokens

Design tokens for the AI collaboration workspace. All colors, typography, spacing, and component values below are the source of truth for the codebase. Use these exact values throughout the app — do not hardcode hex values inside components and do not use raw Tailwind color classes.

## How to Use

This project uses **Tailwind CSS v4**. Define all design tokens in `src/app/globals.css` using the `@theme` directive. No `tailwind.config.ts` is needed for colors or tokens.

Use the generated utility classes from these tokens:

* `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
* `--color-surface` → `bg-surface`, `text-surface`, `border-surface`
* `--color-text-primary` → `text-text-primary`
* `--radius-xl` → `rounded-xl`

Never use:

* hardcoded hex values in component class names
* raw Tailwind color classes like `bg-purple-500` or `text-gray-600`
* inconsistent one-off colors outside this token set

---

## Complete Token Definition

Paste this into `src/app/globals.css` inside `@theme`.

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", sans-serif;

  /* Backgrounds */
  --color-background: #f6f1ea;
  --color-surface: #fffdf8;
  --color-surface-secondary: #f5eee2;
  --color-surface-tertiary: #ede4d7;
  --color-surface-muted: #f8f3ec;

  /* Borders */
  --color-border: #ddd4c6;
  --color-border-light: #e7decf;
  --color-border-muted: #d8cdbd;

  /* Text */
  --color-text-primary: #15131a;
  --color-text-secondary: #5c5966;
  --color-text-muted: #8d8796;
  --color-text-dark: #3f3a47;
  --color-text-darker: #2e2935;
  --color-text-darkest: #111015;
  --color-text-black: #0d0c10;
  --color-text-slate: #2b2830;
  --color-text-slate-medium: #6d6876;

  /* Primary accent — violet */
  --color-accent: #5b4bff;
  --color-accent-dark: #4332f2;
  --color-accent-light: #ece9ff;
  --color-accent-muted: #f5f3ff;
  --color-accent-foreground: #ffffff;

  /* Secondary accent — teal */
  --color-secondary: #0fa3b1;
  --color-secondary-dark: #0b7f8a;
  --color-secondary-light: #d9f7fa;
  --color-secondary-muted: #eefcfd;
  --color-secondary-foreground: #ffffff;

  /* Warm highlight */
  --color-highlight: #d97d54;
  --color-highlight-light: #fae5dc;
  --color-highlight-muted: #fdf3ef;
  --color-highlight-foreground: #ffffff;

  /* Success — green */
  --color-success: #1f9d73;
  --color-success-alt: #18a06f;
  --color-success-dark: #157a58;
  --color-success-darker: #0f6347;
  --color-success-light: #d7f2e8;
  --color-success-lightest: #eefaf5;
  --color-success-foreground: #157a58;

  /* Info — blue */
  --color-info: #4a84ff;
  --color-info-dark: #245ff0;
  --color-info-medium: #3a73f6;
  --color-info-light: #dbe6ff;
  --color-info-lightest: #eef3ff;
  --color-info-foreground: #245ff0;
  --color-info-muted: #8fa7db;

  /* Warning — amber */
  --color-warning: #d6a100;
  --color-warning-foreground: #ffffff;
  --color-warning-light: #fff3cc;
  --color-warning-lightest: #fff9e6;

  /* Error — red */
  --color-error: #e25555;
  --color-error-foreground: #ffffff;
  --color-error-light: #ffe0e0;
  --color-error-lightest: #fff1f1;

  /* LinkedIn brand */
  --color-linkedin: #0a66c2;
  --color-linkedin-light: #dce6f1;
  --color-linkedin-foreground: #ffffff;

  /* Dark overlays */
  --color-overlay: #15131a;
  --color-overlay-dark: #0f0d13;

  /* Gradients */
  --color-gradient-start: #5b4bff;
  --color-gradient-end: #0fa3b1;
  --color-gradient-warm-start: #d97d54;
  --color-gradient-warm-end: #f2b38b;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0px 10px 30px rgba(21, 19, 26, 0.06);
  --shadow-card-hover: 0px 14px 40px rgba(21, 19, 26, 0.09);
  --shadow-popover: 0px 18px 50px rgba(21, 19, 26, 0.12);

  /* Spacing */
  --space-page-x: 32px;
  --space-page-y: 32px;
  --space-section: 24px;
  --space-card: 24px;
  --space-card-sm: 16px;
}
```

---

## Color Usage Guide

### Page Layout

| Element             | Token                  |
| ------------------- | ---------------------- |
| Page background     | `bg-background`        |
| Main card / surface | `bg-surface`           |
| Secondary surface   | `bg-surface-secondary` |
| Tertiary surface    | `bg-surface-tertiary`  |
| Default border      | `border-border`        |
| Light border        | `border-border-light`  |

### Typography

| Element                | Token                 |
| ---------------------- | --------------------- |
| Headings, primary text | `text-text-primary`   |
| Secondary text, labels | `text-text-secondary` |
| Muted text, timestamps | `text-text-muted`     |
| Dark labels            | `text-text-dark`      |
| Strong dark text       | `text-text-darker`    |

### Accent Usage

| Element          | Token                                    |
| ---------------- | ---------------------------------------- |
| Primary button   | `bg-accent text-accent-foreground`       |
| Active nav item  | `text-accent`                            |
| AI highlight     | `bg-secondary text-secondary-foreground` |
| Important notice | `bg-highlight text-highlight-foreground` |
| Focus ring       | `ring-accent`                            |

### Status Colors

| Status  | Background            | Text                      |
| ------- | --------------------- | ------------------------- |
| Success | `bg-success-lightest` | `text-success-foreground` |
| Info    | `bg-info-lightest`    | `text-info-foreground`    |
| Warning | `bg-warning-lightest` | `text-warning`            |
| Error   | `bg-error-lightest`   | `text-error`              |

### Match Score Colors

| Score Range | Color Token                                |
| ----------- | ------------------------------------------ |
| 90–100%     | `text-success` / `bg-success-lightest`     |
| 70–89%      | `text-info` / `bg-info-lightest`           |
| 50–69%      | `text-warning` / `bg-warning-lightest`     |
| Below 50%   | `text-text-muted` / `bg-surface-secondary` |

### Skill Badges

| Type          | Background             | Text                      |
| ------------- | ---------------------- | ------------------------- |
| Matched skill | `bg-success-lightest`  | `text-success-foreground` |
| Missing skill | `bg-accent-muted`      | `text-accent`             |
| Neutral skill | `bg-surface-secondary` | `text-text-secondary`     |

### Source Badges

| Source   | Background             | Text                  |
| -------- | ---------------------- | --------------------- |
| LinkedIn | `bg-linkedin-light`    | `text-linkedin`       |
| URL      | `bg-surface-secondary` | `text-text-secondary` |
| AI       | `bg-secondary-muted`   | `text-secondary`      |

---

## Typography

| Element         | Size | Weight | Line Height | Color Token              |
| --------------- | ---- | ------ | ----------- | ------------------------ |
| Logo text       | 19px | 600    | 24px        | `text-text-primary`      |
| Page title      | 28px | 700    | 36px        | `text-text-primary`      |
| Section heading | 16px | 600    | 24px        | `text-text-primary`      |
| Card title      | 16px | 600    | 24px        | `text-text-primary`      |
| Body text       | 14px | 500    | 20px        | `text-text-primary`      |
| Secondary text  | 12px | 400    | 16px        | `text-text-muted`        |
| Button text     | 14px | 500    | 20px        | `text-accent-foreground` |
| Stat number     | 30px | 600    | 36px        | `text-text-primary`      |

---

## Border Radius

Use these consistently:

| Element      | Radius   |
| ------------ | -------- |
| Small chips  | `4px`    |
| Inputs       | `8px`    |
| Buttons      | `8px`    |
| Cards        | `16px`   |
| Large panels | `24px`   |
| Pills        | `9999px` |

Do not stack too many radius levels inside one component.

---

## Shadows

| Element            | Shadow                     |
| ------------------ | -------------------------- |
| Default card       | `var(--shadow-card)`       |
| Hover card         | `var(--shadow-card-hover)` |
| Dropdown / popover | `var(--shadow-popover)`    |

Use soft shadows only. Keep the UI bright, sharp, and readable.

---

## Layout Spacing

| Element                 | Value      |
| ----------------------- | ---------- |
| Page horizontal padding | `32px`     |
| Page vertical padding   | `32px`     |
| Section gap             | `24px`     |
| Card padding            | `24px`     |
| Compact card padding    | `16px`     |
| Input padding           | `8px 12px` |
| Button padding          | `8px 16px` |

---

## Component Values

### Buttons

**Primary button**

* background: `--color-accent`
* text: `--color-accent-foreground`
* radius: `8px`
* padding: `8px 16px`
* font size: `14px`
* font weight: `500`

**Secondary button**

* background: `--color-surface`
* border: `1px solid --color-border`
* text: `--color-text-primary`
* radius: `8px`
* padding: `8px 16px`

### Inputs

* background: `--color-surface`
* border: `1px solid --color-border`
* radius: `8px`
* padding: `8px 12px`
* font size: `14px`
* placeholder: `--color-text-muted`
* focus: ring with `--color-accent`

### Cards

* background: `--color-surface`
* border: `1px solid --color-border`
* radius: `16px`
* padding: `24px`
* shadow: `--shadow-card`

### Navbar

* background: `--color-surface`
* bottom border: `--color-border`
* active item: `--color-accent`
* inactive item: `--color-text-secondary`

### Badges

* radius: `9999px`
* padding: `2px 8px`
* font size: `12px`
* font weight: `500`

---

## Design Direction

This palette is meant to feel:

* premium
* bright
* readable
* uncommon
* modern
* calm but not boring

It avoids the blurry dark look and gives the app a cleaner editorial feel with a strong AI-product identity.

## Recommended Main Palette Name

**Ivory Nebula**

Primary feel:

* warm ivory base
* crisp dark text
* violet for actions
* teal for AI and realtime
* warm orange for emphasis
