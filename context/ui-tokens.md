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

# Typography Scale

- xs

- sm

- base

- lg

- xl

- 2xl

- 3xl

# Spacing Scale

- 2

- 4

- 8

- 12

- 16

- 20

- 24

- 32

- 40

- 48

- 64

- 80

- 96


- Animation Tokens

- Transition Tokens

- Shadow Tokens

- Blur Tokens

- Opacity Tokens

- Z-index Tokens

- Breakpoint Tokens

- Sidebar Widths

- Container Widths

- Navbar Height

- Modal Sizes

- Drawer Widths

- Toast Positions

- Focus Ring
