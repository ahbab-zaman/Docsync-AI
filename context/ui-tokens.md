# UI Tokens

All colors, typography, spacing, radii, and component values for the project. Use these exact values everywhere.

---

## How to Use

Use design tokens from `src/styles/tokens.css` or `app/globals.css` via CSS variables. Do not hardcode colors inside components. Do not use raw Tailwind color classes for product colors.

---

## Design System Direction

**Palette name:** Midnight Aurora

This palette is dark, premium, and futuristic with violet as the primary accent and teal as the secondary accent.

---

## CSS Theme Tokens

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", sans-serif;

  /* Backgrounds */
  --color-background: #070b14;
  --color-surface: #101827;
  --color-surface-secondary: #182235;
  --color-surface-tertiary: #1e2940;
  --color-surface-muted: #0c1220;

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-strong: rgba(255, 255, 255, 0.14);
  --color-border-muted: rgba(255, 255, 255, 0.06);

  /* Text */
  --color-text-primary: #f5f7ff;
  --color-text-secondary: #a7b1c2;
  --color-text-muted: #7b879a;
  --color-text-inverse: #070b14;

  /* Primary accent */
  --color-accent: #7c5cff;
  --color-accent-dark: #6447ff;
  --color-accent-light: #b7a6ff;
  --color-accent-soft: rgba(124, 92, 255, 0.16);
  --color-accent-foreground: #ffffff;

  /* Secondary accent */
  --color-secondary: #2ed3b7;
  --color-secondary-dark: #16bfa4;
  --color-secondary-light: #8cf3e5;
  --color-secondary-soft: rgba(46, 211, 183, 0.16);
  --color-secondary-foreground: #06131f;

  /* Success */
  --color-success: #2ed3b7;
  --color-success-soft: rgba(46, 211, 183, 0.14);

  /* Warning */
  --color-warning: #f5b95b;
  --color-warning-soft: rgba(245, 185, 91, 0.14);

  /* Error */
  --color-error: #ff6b7a;
  --color-error-soft: rgba(255, 107, 122, 0.14);

  /* Info */
  --color-info: #61a8ff;
  --color-info-soft: rgba(97, 168, 255, 0.14);

  /* Overlay */
  --color-overlay: rgba(7, 11, 20, 0.72);
  --color-backdrop: rgba(7, 11, 20, 0.88);

  /* Radius */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Spacing */
  --space-page-x: 32px;
  --space-page-y: 32px;
  --space-section: 24px;
  --space-card: 24px;
  --space-control: 12px;

  /* Sizing */
  --size-header: 64px;
  --size-sidebar: 280px;
  --size-right-panel: 320px;
  --size-button: 44px;
  --size-input: 44px;

  /* Shadow */
  --shadow-card: 0 16px 40px rgba(0, 0, 0, 0.28);
  --shadow-float: 0 24px 60px rgba(0, 0, 0, 0.36);
}
```

---

## Color Usage Guide

### Background layers
- `background` is the page canvas
- `surface` is the main card color
- `surface-secondary` is for nested panels
- `surface-tertiary` is for elevated controls

### Text layers
- `text-primary` for headings and key content
- `text-secondary` for supporting copy
- `text-muted` for captions and timestamps

### Accent usage
Use `accent` for:
- primary buttons
- active navigation
- focus rings
- important status indicators
- selected states

Use `secondary` for:
- AI states
- online presence
- success moments
- positive feedback

---

## Component Values

### Buttons
- height: `44px`
- radius: `14px`
- primary background: `--color-accent`
- primary text: `--color-accent-foreground`

### Inputs
- height: `44px`
- radius: `14px`
- border: `--color-border`
- background: `--color-surface-secondary`

### Cards
- radius: `18px`
- padding: `24px`
- shadow: `--shadow-card`

### Panels / Sheets
- radius: `24px`
- shadow: `--shadow-float`

---

## Typography Scale

### Display
- `32px`
- weight: `700`
- line height: `40px`

### Page Title
- `28px`
- weight: `700`
- line height: `36px`

### Section Heading
- `18px`
- weight: `600`
- line height: `28px`

### Body
- `15px`
- weight: `400`
- line height: `24px`

### Small / Meta
- `12px`
- weight: `400`
- line height: `18px`

---

## Layout Values

- max content width: `1440px`
- page horizontal padding: `32px`
- desktop gap between sections: `24px`
- sidebar width: `280px`
- right panel width: `320px`
- top bar height: `64px`

---

## Editor Values

- editor content width: `960px`
- editor padding: `32px`
- toolbar height: `48px`
- selection highlight: `--color-accent-soft`

---

## Usage Rules

- never use raw hex values in components
- never use random Tailwind palette classes
- never mix a different palette halfway through a page
- never override the theme with one-off colors unless the token system is updated first
