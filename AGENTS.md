# AGENTS.md — Phase 2 Collaboration Workspace

> Read this file first, every session, before touching any code. After this, read `project-overview.md` and `architecture.md` in full before starting any feature.

---

## 1. Project Overview

This repo is the frontend + app shell for a real-time AI collaboration workspace. The app is built as a single codebase with a `/src` structure from the start and a modular architecture that supports real-time documents, comments, presence, notifications, and AI-assisted editing.

Phase 1 established the foundation. Phase 2 is the collaboration layer:
- collaborative editor
- live cursors and presence
- comments and mentions
- AI actions inside the editor
- version history
- notifications
- search across collaboration content

---

## 2. Core Technologies

- Framework: Next.js (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4
- UI primitives: shadcn/ui
- Editor: TipTap
- Realtime document sync: Yjs + Hocuspocus
- Realtime events: Socket.IO
- Backend: Node.js
- Database: PostgreSQL
- Data access: `pg` repository layer or another SQL-first approach approved in `library-docs.md`
- Cache / ephemeral realtime state: Redis
- Jobs: BullMQ

Do not introduce Prisma.

---

## 3. Read Order

Before building anything, read these files in this order:
1. `project-overview.md`
2. `architecture.md`
3. `build-plan.md`
4. `code-structure.md`
5. `library-docs.md`
6. `ui-rules.md`
7. `ui-tokens.md`
8. `ui-registry.md`
9. `progress-tracker.md`

---

## 4. Project Structure

```text
/
├── AGENTS.md
├── .agent/
│   ├── architecture.md
│   ├── imprint.md
│   ├── review.md
│   ├── recover.md
│   ├── remember.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── build-plan.md
│   ├── progress-tracker.md
│   ├── code-structure.md
│   ├── library-docs.md
│   ├── ui-rules.md
│   ├── ui-tokens.md
│   └── ui-registry.md
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   ├── actions/
│   ├── repositories/
│   ├── realtime/
│   └── styles/
└── ...
```

---

## 5. Phase 2 Build Principle

1. Update UI spec and tokens if needed.
2. Build the editor shell and layout first.
3. Add mock data and verify the layout visually.
4. Wire realtime collaboration.
5. Add persistence and server actions.
6. Add AI actions in the editor.
7. Add notifications, comments, search, and history.
8. Update the progress tracker after every completed feature.

---

## 6. Scope Rules

- Scope is sacred.
- Build one collaboration feature at a time.
- Every feature must be testable before moving on.
- Keep code readable and modular.
- Use server components by default.
- Add `"use client"` only where browser state, event handlers, or third-party client-only libraries require it.
- Never add Prisma.
