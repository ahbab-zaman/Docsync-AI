# Memory — Phase 1 Foundation + Auth + DB Schema

Last updated: 2026-07-26

## What was built

**Foundation setup:**
- Next.js 16.2.12 with TypeScript, App Router, `/src` directory, Tailwind CSS v4
- Inter font, shadcn/ui initialized, all Phase 1 core libraries installed
- Base folder structure: `components/`, `lib/`, `server/`, `hooks/`, `store/`, `types/`, `data/`, `styles/`, `utils/`

**Design tokens:**
- `src/app/globals.css` — Midnight Aurora dark theme with `accent` (violet), `secondary` (teal), semantic tokens, custom radii
- `context/ui-tokens.md` and `context/ui-registry.md` aligned to the actual CSS

**Routes / pages (all mock, build-verified):**
- `/` — Marketing landing page
- `/login` — Login form with server action
- `/register` — Register form with server action
- `/app` — Dashboard with mock workspace cards
- `/app/workspaces` — Workspace list with badges
- `/app/settings` — Settings/profile page

**Database layer:**
- `src/lib/db.ts` — PostgreSQL pool wrapper with `query`/`transaction` helpers
- `src/server/schema.sql` — Tables: users, workspaces, workspace_members, projects, documents
- `src/server/repositories/` — user, workspace, project, document repositories
- `src/types/index.ts` — TypeScript interfaces for all entities

**Auth:**
- `src/server/auth.ts` — Password hashing (bcryptjs), login/register, session cookie management
- `src/server/actions/auth.ts` — Server actions with Zod validation for login/register

## Decisions made

- Auth pages use route group `(auth)` — no shared auth layout yet
- App shell lives at `app/` (real directory, not route group) for `/app/*` URLs
- DB helper at `src/lib/db.ts` (not `src/server/`) per architecture.md
- Project name is **Docsync** (user's choice, not PulseBoard from template)
- Color palette fixed to Midnight Aurora (dark theme) matching ui-tokens.md

## Problems solved

- Zod v4 uses `error.issues` not `error.errors` — fixed in server actions
- Build failed from duplicate route group pages at `/` — resolved by using `app/` real directory instead of `(app)` route group
- Type self-reference in `transaction` function — extracted `QueryFn` type
- bcryptjs install failed silently — re-ran with proper timeout

## Current state

- Build passes cleanly — all 7 routes compile
- Auth pages submit but sessions aren't persisted to DB/Redis yet (cookie is created but not read back)
- All pages use mock data — no real DB connection
- Empty folders: `components/`, `data/`, `hooks/`, `store/`, `styles/`, `utils/`

## Next session starts with

Build **06 Workspace Management**: workspace creation flow, workspace overview page, server actions for CRUD, wire to real data.

## Open questions

- Session persistence strategy: Redis or database table for session tokens?
- Auth route protection middleware — when to implement?
