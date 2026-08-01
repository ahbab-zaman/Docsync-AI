# Code Structure — Phase 3

## Root Structure

```text
/
├── AGENTS.md
├── .agent/            → agent workflow files (architecture, imprint, recover, remember, review)
├── context/           → source-of-truth documentation
├── server/            → standalone realtime servers (Hocuspocus, Socket.IO, migrate)
├── src/
│   ├── app/           → Next.js App Router pages, layouts, and API route handlers
│   ├── components/    → reusable UI components
│   ├── data/          → mock data modules
│   ├── hooks/         → reusable React hooks
│   ├── lib/           → shared utilities and infrastructure
│   ├── realtime/      → collaboration types and event constants
│   ├── server/        → server actions, repositories, auth, schema
│   ├── tests/         → shared test setup (vitest)
│   └── types/         → shared TypeScript types
└── ...
```

## `src/app`

```text
src/app/
├── layout.tsx
├── page.tsx                          → Landing page
├── globals.css                       → design tokens (@theme)
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── app/                              → authenticated app area
│   ├── layout.tsx                    → sidebar + main content shell
│   ├── page.tsx                      → Dashboard (workspace overview)
│   ├── loading.tsx
│   ├── error.tsx
│   ├── ai/page.tsx
│   ├── members/page.tsx
│   ├── notifications/page.tsx
│   ├── notifications/loading.tsx
│   ├── settings/page.tsx
│   ├── workspaces/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── new/page.tsx
│   │   └── [workspaceId]/page.tsx    (+ error.tsx, loading.tsx)
│   ├── projects/
│   │   ├── new/page.tsx
│   │   └── [projectId]/page.tsx      (+ error.tsx, loading.tsx)
│   └── documents/
│       ├── new/page.tsx
│       └── [documentId]/page.tsx     (+ loading.tsx, DocumentEditor.tsx)
└── api/
    ├── health/route.ts
    ├── metrics/route.ts
    └── checks/
        ├── database/route.ts
        ├── redis/route.ts
        └── socket/route.ts
```

> Note: Feature behavior is implemented through server actions under `src/server/actions`, not REST route handlers. The only API route handlers are the health, metrics, and infrastructure check endpoints. A REST API layer may be added in a later phase.

## `src/components`
- ui         → primitives (EmptyState, LoadingSpinner, Skeleton, ConfirmDialog)
- layout     → Sidebar
- documents  → TiptapEditor
- editor     → OutlinePanel, SelectionMenu, VersionHistory
- presence   → CollaboratorAvatars
- comments   → CommentThread, CommentSidebar, CommentReplyBox, CommentMarkers, MentionSuggestions
- notifications → NotificationList, ActivityList
- ai         → AiPanel, AiResponse, PromptInput, SuggestionChips
- search     → SearchDialog
- members    → InviteModal, MemberList, RoleSelector

> Page-local components live next to their routes, e.g. `DocumentActionBar` in `src/app/app/documents/[documentId]/`.

## `src/data`
- mock-ai.ts
- mock-collaborators.ts
- mock-comments.ts
- mock-documents.ts
- mock-notifications.ts
- mock-projects.ts
- mock-search.ts
- mock-users.ts
- mock-versions.ts
- mock-workspaces.ts

## `src/hooks`
- useSocket.ts
- usePresence.ts

## `src/lib`
- auth-helpers.ts
- cache.ts
- db.ts
- errors.ts
- logger.ts
- metrics.ts
- rate-limiter.ts
- redis.ts
- retry.ts
- sanitize.ts
- socket.ts
- utils.ts
- yjs.ts

> Note: Phase 3 added `cache`, `errors`, `logger`, `metrics`, `rate-limiter`, `redis`, `retry`, and `sanitize`. Each infra module ships a colocated `*.test.ts`. Tests live next to the code they cover (`src/**/*.test.{ts,tsx}`) with shared setup in `src/tests/setup.ts`; 92 tests across 20 files.

## `src/realtime`
- socket-events.ts
- presence.ts
- cursor.ts
- rooms.ts
- notification-events.ts

## `src/server`
- auth.ts
- schema.sql
- actions/
    - auth.ts
    - workspace.ts
    - project.ts
    - document.ts
    - comments.ts
    - members.ts
    - notifications.ts
    - versions.ts
    - search.ts
    - ai.ts
- repositories/
    - user.ts

## `src/types`
- ai.ts
- comments.ts
- notifications.ts
- search.ts
- versions.ts
- index.ts

## `server` (root — standalone servers)
- hocuspocus-server.ts
- socket-server.ts
- migrate.ts


---

# Engineering Standards

These standards define how the codebase should evolve after Phase 2. Every contributor and AI agent must follow these rules to ensure consistency, maintainability, and scalability.

---

## Folder Ownership

Each folder owns a single responsibility.

Never place unrelated code inside another feature's directory.

Example:

- `components/` → reusable UI only
- `actions/` → server actions only
- `repositories/` → PostgreSQL queries only
- `realtime/` → collaboration and Socket.IO logic only
- `lib/` → shared utilities and infrastructure
- `hooks/` → reusable React hooks
- `types/` → shared TypeScript types

If a file naturally belongs to one feature, keep it inside that feature instead of creating global utilities.

---

## Dependency Rules

Dependencies must always point downward.

```
Page
    ↓
Component
    ↓
Server Action
    ↓
Repository
    ↓
Database
```

Allowed

- Pages → Components
- Components → Hooks
- Components → Server Actions
- Server Actions → Repositories
- Repositories → PostgreSQL

Not Allowed

- Components → PostgreSQL
- Components → Redis
- Components → Socket Server
- Repositories → React Components
- Repositories → Browser APIs

---

## Import Rules

Prefer absolute imports.

Example

```ts
import { Button } from "@/components/ui/button";
import { getWorkspace } from "@/actions/workspaces";
```

Avoid long relative imports.

```ts
../../../components/...
```

Feature modules should import from their public entry point whenever possible.

---

## Shared Modules

Only reusable logic belongs inside `src/lib`.

Examples

- API client
- Authentication helpers
- Date utilities
- Formatting helpers
- Constants
- Redis client
- PostgreSQL client

Never place business-specific logic inside shared utilities.

---

## Feature Boundaries

Each feature should be self-contained.

Example

```
documents/
    components/
    hooks/
    actions/
    repository/
    types/
```

Do not allow one feature to directly modify another feature's internal implementation.

Cross-feature communication should happen through public APIs or shared services.

---

## File Size Limits

Recommended maximum sizes:

- Component → 250 lines
- Page → 300 lines
- Server Action → 200 lines
- Repository → 200 lines
- Hook → 150 lines
- Utility → 150 lines

If a file exceeds these limits, split it into smaller modules.

---

## Naming Convention

Use consistent naming across the project.

Components

```
WorkspaceCard.tsx
```

Hooks

```
useWorkspace.ts
```

Repositories

```
workspaces.repository.ts
```

Server Actions

```
workspaces.ts
```

Utilities

```
formatDate.ts
```

Types

```
workspace.types.ts
```

Use descriptive names instead of abbreviations.

---

## Repository Pattern

Repositories are responsible only for data access.

Repositories may

- Read data
- Insert data
- Update data
- Delete data
- Execute transactions

Repositories must never

- Validate business rules
- Send notifications
- Call AI providers
- Access browser APIs
- Return UI-specific data

Repositories should return clean domain objects.

---

## Service Layer (Business Logic)

Business logic should remain outside pages and repositories.

When workflows become complex, introduce a `services/` layer.

Responsibilities include:

- Permission checks
- Multi-step workflows
- AI orchestration
- Queue dispatching
- Notification coordination

Pages and Server Actions should call Services, not implement business rules directly.

---

## DTOs (Data Transfer Objects)

Use DTOs to define the shape of data exchanged between layers.

Separate

- Database Models
- API Responses
- Client Types

Never expose raw database rows directly to the UI.

---

## Validators

Validate input at every boundary.

Recommended flow:

```
Client Validation
        ↓
Server Validation
        ↓
Database Constraints
```

Use a single validation schema per entity to avoid duplicated rules.

---

## Utilities

Utilities should be:

- Pure
- Reusable
- Framework independent

Utilities must never:

- Read request objects
- Access React state
- Perform database queries

Keep utilities deterministic and easy to test.

---

## Error Classes

Use typed error classes instead of generic `Error`.

Example categories:

- ValidationError
- AuthenticationError
- AuthorizationError
- NotFoundError
- ConflictError
- DatabaseError
- AIProviderError

Map these errors to consistent API responses.

---

## Logging

Important operations should generate structured logs.

Examples:

- User login
- Workspace creation
- Document update
- AI request
- Background job execution
- Realtime connection

Each log should include:

- Timestamp
- User ID (if available)
- Workspace ID (if applicable)
- Request ID
- Operation
- Duration
- Result

---

## Testing Structure

Tests should mirror the project structure.

```
src/
    components/
        __tests__/

    actions/
        __tests__/

    repositories/
        __tests__/

    lib/
        __tests__/
```

Recommended testing priorities:

1. Business logic
2. Repositories
3. Server Actions
4. Critical UI components
5. End-to-end user flows

---

## Documentation Responsibility

Whenever a new feature is implemented, update the following files if affected:

- `progress-tracker.md`
- `ui-registry.md`
- `architecture.md`
- `build-plan.md`
- `library-docs.md`

Documentation should evolve together with the codebase.

---

## AI Agent Guidelines

Before implementing any feature, the AI agent should:

1. Read `AGENTS.md`.
2. Review `architecture.md`.
3. Check `build-plan.md` for the current milestone.
4. Follow the folder ownership rules defined here.
5. Reuse existing components before creating new ones.
6. Keep files small and focused.
7. Update documentation after implementation.

The goal is to produce production-ready, maintainable code rather than the fastest possible implementation.

---
