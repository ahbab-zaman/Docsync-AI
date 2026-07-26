# Code Structure

## Root Strategy

Use a single repository with a strict `/src` based Next.js App Router structure. Keep presentation, logic, data access, and realtime concerns separated so the codebase stays readable as the project grows.

## Top-Level Layout

```text
.
├── .env.example
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── next.config.ts
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seed.sql
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── server/
│   ├── hooks/
│   ├── types/
│   ├── store/
│   ├── styles/
│   ├── data/
│   └── utils/
└── docs/
    ├── architecture.md
    ├── build-plan.md
    ├── code-structure.md
    ├── library-docs.md
    ├── progress-tracker.md
    ├── project-overview.md
    ├── ui-registry.md
    ├── ui-rules.md
    └── ui-tokens.md
```

## `/src/app` Routing Structure

```text
src/app/
├── layout.tsx
├── page.tsx
├── globals.css
├── (marketing)/
│   └── page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── workspaces/page.tsx
│   ├── workspaces/new/page.tsx
│   ├── workspaces/[workspaceId]/page.tsx
│   ├── projects/[projectId]/page.tsx
│   ├── documents/[documentId]/page.tsx
│   ├── ai/page.tsx
│   ├── members/page.tsx
│   ├── notifications/page.tsx
│   └── settings/page.tsx
└── api/
    ├── health/route.ts
    ├── workspaces/route.ts
    ├── projects/route.ts
    ├── documents/route.ts
    ├── ai/route.ts
    └── notifications/route.ts
```

## App Folder Rules

### Public routes
- marketing page
- auth pages

### Protected routes
- everything inside `(app)`

### Route handlers
Use them only for HTTP endpoints that are easier to expose as a conventional API shape.

### Server actions
Use them for form submissions and mutations that belong to a page flow.

## Component Structure

```text
src/components/
├── ui/
├── layout/
├── marketing/
├── auth/
├── dashboard/
├── workspaces/
├── projects/
├── documents/
├── ai/
├── members/
├── notifications/
└── settings/
```

### Component naming
- one component per file
- PascalCase filenames
- named exports only
- keep shared primitives in `components/ui`

## Library and Service Structure

```text
src/lib/
├── auth.ts
├── db.ts
├── redis.ts
├── socket.ts
├── hocuspocus.ts
├── yjs.ts
├── ai.ts
├── env.ts
├── utils.ts
├── constants.ts
└── sql.ts
```

### What belongs here
- framework helpers
- shared clients
- environment parsing
- constants
- database connection helper (`db.ts`)
- small pure utility functions

### What does not belong here
- JSX-heavy UI components
- page-specific business logic
- route-level request handlers

## Server Layer Structure

```text
src/server/
├── services/
├── repositories/
├── validators/
├── realtime/
├── jobs/
├── events/
├── auth/
└── logging/
```

### Purpose
This layer owns the business rules and keeps the app route files thin.

### Repository pattern
- place SQL queries inside `src/server/repositories/`
- keep each repository focused on one domain (workspaces, projects, documents, notifications)
- use `src/lib/db.ts` for the shared PostgreSQL connection

## State and Hooks

```text
src/hooks/
├── use-debounce.ts
├── use-mounted.ts
├── use-hotkeys.ts
└── use-presence.ts
```

Use hooks only for reusable UI behavior.

## Store Structure

```text
src/store/
├── useAppStore.ts
├── useWorkspaceStore.ts
├── useUiStore.ts
└── useDocumentStore.ts
```

Use local client state only where it improves UX. Do not move server-owned data into client-only stores unless it is clearly ephemeral.

## Types Structure

```text
src/types/
├── api.ts
├── auth.ts
├── workspace.ts
├── project.ts
├── document.ts
├── notification.ts
└── ai.ts
```

### Rules
- prefer explicit types
- keep shared API contracts here
- reuse Zod schemas where possible

## Data Folder

```text
src/data/
├── mock-workspaces.ts
├── mock-projects.ts
├── mock-documents.ts
├── mock-members.ts
└── mock-notifications.ts
```

Use mock data only for Phase 1 UI work before logic is wired.

## Styles Structure

```text
src/styles/
└── tokens.css
```

The design system tokens should live in a single place and be referenced everywhere else.

## Phase 1 Build Order in Code

1. globals and layout
2. tokens and base components
3. marketing and auth pages
4. authenticated app shell
5. dashboard
6. workspaces
7. projects
8. documents
9. AI panel
10. members
11. notifications
12. settings
13. database plumbing
14. QA and polish

## Coding Rules

- keep files small and focused
- keep server and client logic separate
- never mix database access into UI components
- keep page components thin
- keep reusable UI in `components/`
- keep business logic in `src/server/`
- keep mock data isolated and easy to delete later
