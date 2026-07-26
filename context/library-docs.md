# Library Docs

This file describes how each major library is used in **this project only**. Follow these patterns before adding new code that depends on a library.

---

## 1. Next.js

### Role
- App Router framework
- route composition
- server components
- server actions
- route handlers
- metadata
- layouts

### Project Rules
- use `/src/app`
- prefer server components by default
- use client components only when interactivity is required
- keep page data fetching on the server
- keep route handlers thin
- do not overuse client state for server data

### Good Uses
- authenticated layouts
- page rendering
- loading and error states
- metadata
- route protection

---

## 2. React

### Role
- UI composition
- stateful interactions
- editor toolbars
- modal forms
- panels and sidebars

### Project Rules
- keep components small
- use client components only when needed
- keep derived values in memoized or local expressions when helpful
- do not hide business logic inside JSX

---

## 3. TypeScript

### Role
- strict typing across the app
- domain models
- API contracts
- component props
- form schemas

### Project Rules
- no `any`
- use explicit function inputs and outputs
- prefer `type` for object shapes
- use `interface` only when extension is useful
- avoid unsafe assertions unless unavoidable

---

## 4. Tailwind CSS v4

### Role
- layout
- spacing
- color tokens
- responsive behavior
- interactive states

### Project Rules
- use tokens from `ui-tokens.md`
- never hardcode color values in components
- never use raw Tailwind palette classes for project colors
- keep utility chains readable
- use CSS variables for the design system

---

## 5. shadcn/ui

### Role
- base UI primitives

### Recommended Components
- Button
- Card
- Dialog
- Dropdown Menu
- Tabs
- Badge
- Avatar
- Sheet
- Tooltip
- Separator
- Scroll Area
- Toast / Sonner

### Project Rules
- customize through tokens and wrappers
- do not fork primitives unless truly needed
- keep variants consistent with the design system

---

## 6. Tiptap

### Role
- rich text document editor

### Phase 1 Use
- title and body editing
- headings
- lists
- links
- code blocks
- blockquotes
- text highlighting
- slash-menu style interaction placeholder
- editor toolbar

### Project Rules
- keep editor state controlled and persistent
- initialize editor content from saved document JSON
- avoid direct DOM manipulation
- keep custom extensions isolated
- use editor-only wrappers in client components

### Phase 2 Ready
- collaboration extension
- mention extension
- comments anchors
- active selection awareness

---

## 7. Yjs

### Role
- shared document state model for collaboration

### Phase 1 Use
- define the document data shape and collaboration boundary
- prepare the app for future sync

### Phase 2 Use
- live collaborative editing
- conflict-free syncing
- shared awareness state
- multi-client updates

### Project Rules
- do not couple editor rendering directly to sync transport
- keep Yjs document logic isolated from pages
- design the current editor model so Phase 2 can plug in without rewriting everything

---

## 8. Hocuspocus

### Role
- collaboration server for Tiptap/Yjs

### Phase 1 Use
- architecture only
- no deep production collaboration behavior yet unless a small presence demo is needed

### Phase 2 Use
- Yjs document sync
- room handling
- persistence hooks
- awareness updates

### Project Rules
- keep Hocuspocus server code separate from page UI
- do not treat it as general application API
- use it only for document sync concerns

---

## 9. Socket.IO

### Role
- realtime events
- presence
- typing state
- notification signals

### Phase 1 Use
- online members indicator
- simple live status
- low-latency workspace events

### Project Rules
- keep rooms keyed by workspace or document context
- emit small structured payloads
- do not push large application data through sockets
- persist important actions through the database as well

---

## 10. PostgreSQL + `pg`

### Role
- persistent relational storage
- direct SQL access through a small shared database helper
- schema migrations and seed scripts
- transactional data writes

### Project Rules
- use `src/lib/db.ts` as the only shared database connection entry point
- keep SQL inside `src/server/repositories/`
- never query PostgreSQL directly from UI components
- keep schema readable and normalized
- use migrations deliberately
- model ownership clearly
- use indexes for lookup-heavy fields
- keep mutations inside server actions or repository methods

### Good Uses
- workspaces
- memberships
- documents
- versions
- notifications
- activity logs

---

## 11. PostgreSQL

### Role
- persistent relational storage

### Project Rules
- use relational models for core entities
- use JSONB only when the shape is naturally flexible
- keep indexes on foreign keys and query-heavy fields
- enforce referential integrity
- do not store app logic in SQL if a repository method can own it cleanly

### Recommended Usage
- document metadata
- version snapshots
- comment anchors
- activity logs
- AI run records

---

## 12. Redis

### Role
- caching
- pub/sub
- ephemeral state
- queue backing store

### Project Rules
- use for fast-changing, non-authoritative data
- never treat Redis as the source of truth
- keep cache keys predictable
- invalidate after writes
- use for shared realtime state only when needed

### Good Uses
- workspace summary cache
- active presence cache
- session-adjacent ephemeral state
- queue backing for BullMQ

---

## 13. BullMQ

### Role
- background job queue

### Good Uses
- AI generation
- notification fanout
- activity processing
- document snapshot jobs
- summary generation
- long-running tasks

### Project Rules
- queue expensive work
- return a job reference to the UI when needed
- write job failures to logs
- keep workers separate from web routes

---

## 14. Zod

### Role
- input validation
- schema parsing
- type-safe form and API validation

### Project Rules
- validate every external input
- use shared schemas where possible
- keep schema names aligned with the feature domain
- transform only when necessary

---

## 15. React Hook Form

### Role
- form state management

### Good Uses
- login/register
- workspace creation
- project creation
- profile settings
- invite forms
- AI prompt forms

### Project Rules
- pair with Zod schemas
- avoid overcomplicated custom state for forms
- keep form components focused

---

## 16. Lucide React

### Role
- icon system

### Project Rules
- use icons consistently
- keep icon size and weight aligned with the design system
- do not mix icon libraries without a reason

---

## 17. Framer Motion

### Role
- lightweight motion and transitions

### Good Uses
- page entrance
- card hover motion
- panel transitions
- modal transitions
- loading polish

### Project Rules
- use subtle motion
- never animate for the sake of animation
- keep transitions short and restrained

---

## Library Usage Order

Before using a library in a feature:

1. read this file
2. check `AGENTS.md`
3. inspect existing project code patterns
4. use the library in the smallest useful way
5. document the component or pattern in `ui-registry.md` if it creates a repeatable UI building block
