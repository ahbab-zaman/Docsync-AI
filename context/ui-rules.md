# UI Rules

## Font
Always import Inter via `next/font/google` in the root layout.

## Layout
- Page max width: `1440px`, centered
- Main content padding: `32px` on desktop, `20px` on tablet, `16px` on mobile
- Section gap: `24px`
- Use normal flow layout; avoid fixed-position UI unless absolutely necessary

### Responsive behavior
- Desktop: multi-column layouts are allowed
- Tablet: reduce to two columns where needed
- Mobile: stack everything into one column
- Side panels should collapse below the main content on small screens
- Tables should become stacked cards or horizontal scroll on mobile when necessary
- Buttons should wrap cleanly instead of overflowing
- Nav items should compress gracefully on small screens
- The document editor should remain usable on smaller screens, even if some panels collapse

## Navbar
The app uses a top navbar only.
- Background: `bg-surface`
- Bottom border: `border-border`
- Navbar height: `64px`
- Left side: logo + product name
- Right side: workspace controls, search, notifications, profile

## Cards
Every major content section should live inside a card.
- background: `var(--color-surface)`
- border: `1px solid var(--color-border)`
- border-radius: `16px`
- padding: `24px`
- box-shadow: `var(--shadow-card)`

## Editor Rules
- Use a three-zone layout when space allows: left outline, center editor, right AI/details panel
- Collapse to one column on mobile
- Keep the editor area wide enough for comfortable writing
- Maintain strong focus visibility

## Presence and Collaboration UI
- Show collaborator list and online status chips
- Cursor labels must be readable
- Typing indicators should be subtle
- Comment markers should be visible near relevant text

## Accessibility
- Maintain strong text contrast
- Keep interactive targets large enough on mobile
- Labels must not be replaced by placeholders
- Focus states must be visible

## Do Nots
- Never make cards dark unless explicitly required
- Never create noisy gradients or neon effects
- Never hide important actions on mobile
- Never let content become unreadable for the sake of style

## Design Goal
The UI should feel premium, clean, bright, uncommon, readable, modern, and product-focused.
