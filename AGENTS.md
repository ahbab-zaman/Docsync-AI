# AGENTS.md — Docsync

> **Read this file first before touching any code.**
> After this, read `docs/project-overview.md` and `docs/architecture.md` in full before starting a feature. Then read only the other docs relevant to the task you are building.

---

## 1. Project Overview

Docsync is a **single-repo** Next.js application for real-time AI collaboration. The repo owns the UI, authentication, server actions, route handlers, database access, realtime hooks, and background job integration.

Phase 1 focuses on the foundation: marketing page, auth, authenticated shell, workspace/project/document structure, AI panel, members, notifications, settings, and the core database model.

---

## 2. Core Technologies

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI primitives**: shadcn/ui
- **Rich text editor**: Tiptap
- **Realtime transport**: Socket.IO
- **Collaboration foundation**: Yjs + Hocuspocus
- **Database access**: PostgreSQL + `pg` + repository layer
- **Database**: PostgreSQL
- **Cache / pub-sub / queue store**: Redis
- **Background jobs**: BullMQ
- **Validation**: Zod

---

## 3. Project Initialization

This project starts from an empty repository. Set up the base app before any feature work.

### 3.1 Bootstrap Order

1. Create the Next.js app with TypeScript and the App Router.
2. Enable the `/src` directory from day one.
3. Set up Tailwind CSS v4 and global design tokens.
4. Add Inter as the root font in `src/app/layout.tsx`.
5. Install the core libraries for Phase 1:
   - shadcn/ui
   - PostgreSQL client (`pg`)
   - Repository layer helpers
   - PostgreSQL client
   - Redis client
   - BullMQ
   - Socket.IO
   - Tiptap
   - Yjs / Hocuspocus
   - Zod
6. Create the base folders and files for the app shell, shared utilities, and feature modules.
7. Add environment variable templates before writing feature code.
8. Create the initial route scaffold for all Phase 1 pages.
9. Wire the first mock-data pages before any backend logic.
10. Only then begin Phase 1 feature implementation.

### 3.2 Required Source Root

The project source must live under `/src`:

```text
src/
├── app/
├── components/
├── lib/
├── server/
├── hooks/
├── store/
├── types/
├── data/
├── styles/
└── utils/
```

### 3.3 Bootstrap Rules

- never start feature work before the base app shell exists
- never build Phase 2 infrastructure during setup
- keep the first commit focused on structure, theme tokens, and routing
- mock data is allowed during setup, but real feature logic is not

## 3. Working Rules

- Think before implementing.
- Read the docs before writing code.
- Keep scope narrow.
- Build one feature completely before the next.
- Prefer clarity over cleverness.
- Every feature must be testable.
- Never let one failure crash the whole flow.
- Use mock data first when the build plan asks for it.

---

## 4. Source Layout

The app source must live under `/src`.

```text
src/
├── app/
├── components/
├── lib/
├── server/
├── hooks/
├── store/
├── types/
├── data/
├── styles/
└── utils/
```

### Routing
- all routes use App Router
- public pages stay in marketing/auth groups
- protected pages stay under the app shell group

### Data access
- All database access goes through the repository layer and shared database helper
- never query the database directly from UI components

### Mutations
- server actions own form submissions
- route handlers are only for HTTP-style endpoints

---

## 5. Code Quality Rules

- strict TypeScript only
- no `any`
- explicit function inputs and outputs
- named exports only for components
- one component per file
- no raw color classes
- no hardcoded theme values
- keep server and client logic separate

---

## 6. UI Rules

- use Inter as the main font
- use tokens from `ui-tokens.md`
- follow `ui-rules.md` for layout, spacing, and states
- use `ui-registry.md` before making a new shared component
- keep the document editor visually dominant

---

## 7. Error Handling

- every server action has `try/catch`
- every route handler has `try/catch`
- show human-readable errors to users
- log server-side failures with a clear prefix
- never leak raw stack traces into the UI

---

## 8. Phase Guidance

### Phase 1
Build the foundation cleanly and keep collaboration mostly structural.

### Phase 2
Add the full live collaboration engine, cursor presence, richer syncing, and deeper AI workflows.

Do not build Phase 2 behavior until Phase 1 is stable.
