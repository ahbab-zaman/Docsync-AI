# Docsync — AI Collaboration Platform

A production-grade, real-time AI collaboration workspace. Teams write documents together, leave comments and mentions, see live presence, and trigger AI actions without leaving the editor.

## Features

- Collaborative rich-text editor (TipTap)
- Realtime document sync (Yjs + Hocuspocus)
- Presence, cursors, and typing indicators (Socket.IO)
- Threaded comments + mentions
- AI sidebar and in-editor actions (summarize, rewrite, expand, simplify, extract)
- Version history with restore
- Notifications and global search (Ctrl+K)
- Workspaces, projects, members, and document management
- WCAG AA accessibility, responsive layouts, and reduced-motion support
- Structured logging, health checks, metrics, Redis caching, and typed error handling

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, React Hook Form, Zod
- **Editor & Collaboration:** TipTap, Yjs, Hocuspocus, Socket.IO
- **Backend:** Node.js, Express, PostgreSQL, pg (Repository Pattern), Redis, BullMQ
- **Auth:** JWT, refresh tokens, secure cookies
- **AI:** Gemini, OpenRouter

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Realtime Servers

Run the standalone collaboration servers alongside the app:

```bash
npm run dev:hocuspocus    # Yjs document sync
npm run dev:socket        # presence + notifications
npm run dev:all           # app + both realtime servers together
```

## Quality Checks

```bash
npm run lint                # ESLint
npx tsc --noEmit            # TypeScript
npm run build               # Production build
npm test                    # 92 tests (Vitest: unit, integration, component)
```

## Documentation

The project is driven by source-of-truth docs in `context/` and agent workflow files in `.agent/` — read `AGENTS.md` first.
