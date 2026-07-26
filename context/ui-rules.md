# UI Rules

Concise rules for building the PulseBoard UI. The design language should feel premium, dark-first, spacious, and intentional.

---

## Font

Always import **Inter** in the root layout with `next/font/google`.

- Use the font on the `<html>` element through the CSS variable class.
- Do not use a system font as the main font.
- Keep typography calm and readable.

---

## Layout Philosophy

### Marketing pages
- centered content
- generous vertical spacing
- strong hero section
- minimal chrome

### Auth pages
- focused card layout
- single-column form flow
- clear validation states

### App shell
- left sidebar navigation
- top utility bar
- main content that breathes
- no cluttered dense dashboard feel

### Document page
- three-panel layout on desktop
- editor in the center
- context on the left
- AI assistant on the right

---

## Page Widths

- Marketing max width: `1200px`
- App max width: `1440px`
- Editor content width: `min(960px, 100%)`
- Sidebar width: `280px`
- Right AI panel width: `320px`
- Top bar height: `64px`

---

## Card Style

All content blocks should feel like premium surfaces.

- rounded corners
- subtle border
- soft shadow
- slightly elevated from the background
- no noisy gradients on card surfaces

Cards should feel like panels, not boxes.

---

## Navigation Rules

### Sidebar
Use for:
- Dashboard
- Workspaces
- Projects
- Documents
- AI
- Members
- Notifications
- Settings

### Top bar
Use for:
- search
- quick create
- online presence
- notifications
- profile menu

---

## Typography Hierarchy

### Page titles
- large
- clear
- confident

### Section headings
- medium
- strong contrast
- minimal decoration

### Body text
- readable at 14–16px
- never too light
- avoid overusing uppercase

### Muted text
- use only for helper text, timestamps, and captions

---

## Buttons

### Primary
- use the primary accent color
- for main actions only
- examples: Create workspace, Save document, Ask AI

### Secondary
- use the surface style
- for less important actions

### Ghost
- for lightweight actions
- examples: cancel, back, close

### Danger
- reserved for destructive actions only

---

## Forms

- use clear labels
- keep spacing consistent
- show validation inline
- keep inputs visually calm
- avoid dense stacked fields
- use helper text only when helpful

---

## Editor Rules

The document editor is the hero screen.

### Editor should include
- title field
- rich text body
- formatting toolbar
- outline or table of contents
- AI action menu
- save status
- version hint

### Editor behavior
- preserve content cleanly
- autosave when possible
- keep the cursor stable
- never make the canvas feel cramped

---

## AI Panel Rules

- keep AI responses structured
- separate prompt input from response output
- show loading states clearly
- support quick action chips
- avoid giant unbroken paragraphs in generated output

---

## Empty States

Every empty section needs a useful empty state.

### Empty state should include
- one short sentence
- optional icon
- one next-step CTA if appropriate

Never leave a blank void where the user is supposed to understand the state.

---

## Loading States

Use:
- skeletons for data-heavy panels
- subtle spinners for small actions
- disabled buttons while submitting
- short loading copy for AI generation

---

## Motion Rules

- keep motion subtle
- use short transitions
- hover effects should feel light
- avoid playful or bouncy motion
- use motion to guide attention, not distract

---

## Responsiveness

### Desktop
Full app shell with sidebar and panels.

### Tablet
Sidebar may collapse into a rail or sheet.

### Mobile
- sidebar becomes a drawer
- panels stack vertically
- editor remains readable
- avoid tiny touch targets

---

## Accessibility

- maintain contrast
- use semantic buttons and labels
- focus states must be obvious
- do not rely on color alone for meaning
- keep touch targets comfortable

---

## Hard Rules

- never hardcode random colors in components
- never mix unrelated visual styles
- never make every element look equally important
- never overload the page with too many shadows
- never use a different typography system on one page
- never let the document editor feel secondary
