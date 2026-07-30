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

---

# Motion Rules

Motion should communicate state and improve usability, never distract the user.

- Animation duration:
  - Micro interactions: `100–150ms`
  - UI transitions: `200–250ms`
  - Large panels/modals: `250–350ms`
- Use smooth easing (`ease-out`) for most UI interactions.
- Respect `prefers-reduced-motion`; disable non-essential animations.
- Never animate layout shifts that can cause content jumping.

---

# Interaction States

Every interactive component must support all standard UI states.

## Hover
- Provide subtle visual feedback.
- Never rely on hover as the only way to reveal important actions.

## Active
- Clearly indicate pressed or selected state.
- Keep transitions fast and responsive.

## Focus
- Every interactive element must have a visible keyboard focus ring.
- Never remove browser focus outlines unless replacing them with an accessible alternative.

## Disabled
- Clearly distinguish disabled elements using reduced opacity and cursor changes.
- Disabled actions should not trigger events.

---

# Loading States

Every asynchronous action must have a loading state.

Examples:
- Skeleton loaders for page content
- Spinner for buttons
- Progress indicators for long-running tasks

Never leave users wondering if the application is working.

---

# Empty States

Every page that can contain no data must include:

- Clear explanation
- Helpful illustration or icon
- Primary action to help the user continue

Never display an empty white screen.

---

# Error States

Every recoverable error should provide:

- Human-readable message
- Retry action when possible
- Clear indication of what failed

Never expose technical error messages or stack traces.

---

# Toast Notifications

Use toast notifications only for temporary feedback.

Use for:
- Success messages
- Non-blocking warnings
- Background task completion

Do not use toasts for critical errors requiring user action.

---

# Modal & Drawer Rules

Use modals only for focused tasks.

Use drawers for contextual editing or secondary workflows.

Requirements:
- Trap keyboard focus
- Close with `Esc`
- Restore focus to the triggering element after closing

---

# Table Rules

Tables should remain usable on every device.

Desktop:
- Standard table layout

Tablet:
- Horizontal scrolling if necessary

Mobile:
- Convert to stacked cards when appropriate

Support:
- Sorting
- Filtering
- Pagination
- Empty state

---

# Form Rules

Every form must include:

- Label
- Helper text (when needed)
- Validation message
- Required field indicator
- Loading state
- Success feedback

Never use placeholders as labels.

---

# Keyboard Accessibility

Every feature must be fully usable using only the keyboard.

Requirements:

- Logical tab order
- Enter activates buttons
- Space activates checkboxes
- Esc closes dialogs
- Arrow keys work where expected
- Skip navigation link for large layouts

---

# Screen Reader Support

Use semantic HTML whenever possible.

Requirements:

- Proper heading hierarchy
- Descriptive button labels
- Accessible form labels
- Meaningful alt text
- ARIA attributes only when necessary

---

# Touch Targets

All interactive elements must be easy to use on touch devices.

Minimum touch target:
- 44 × 44 px

Provide sufficient spacing between adjacent actions.

---

# Mobile Gestures

Support natural mobile interactions where appropriate.

Examples:

- Swipe to dismiss notifications
- Pull to refresh (optional)
- Long press for context menus

Never rely solely on gestures to expose important functionality.

---

# Performance Rules

UI performance is part of the user experience.

Requirements:

- Lazy load heavy components
- Virtualize long lists
- Debounce search inputs
- Throttle scroll listeners
- Optimize images using `next/image`
- Avoid unnecessary re-renders
- Keep animations at 60 FPS whenever possible

---

# Responsive Design Checklist

Every page must be verified on:

- Mobile (320px+)
- Tablet
- Laptop
- Desktop
- Ultra-wide displays

Check:

- Navigation
- Typography
- Forms
- Tables
- Modals
- Drawers
- Editor
- AI Panel

No horizontal scrolling should occur unless intentionally required.

---

# Definition of Good UI

A feature is considered complete only if it is:

- Responsive
- Accessible
- Performant
- Readable
- Consistent with design tokens
- Keyboard friendly
- Screen reader compatible
- Easy to understand
- Visually polished
- Free from layout shifts
