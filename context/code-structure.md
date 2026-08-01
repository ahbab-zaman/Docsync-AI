# Code Structure — Phase 2

## Root Structure

```text
/
├── AGENTS.md
├── .agent/
├── context/
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

## `src/app`

```text
src/app/
├── layout.tsx
├── page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── workspaces/page.tsx
│   ├── workspaces/[workspaceId]/page.tsx
│   ├── projects/[projectId]/page.tsx
│   ├── documents/[documentId]/page.tsx
│   ├── notifications/page.tsx
│   └── settings/page.tsx
└── api/
    ├── health/
    ├── metrics/
    ├── checks/
    │   ├── database/
    │   ├── redis/
    │   └── socket/
    ├── documents/
    ├── comments/
    ├── notifications/
    ├── search/
    ├── ai/
    └── realtime/
```

> Note: Phase 3 added `/api/health`, `/api/metrics`, and `/api/checks/*` route handlers. The feature API folders (`documents`, `comments`, etc.) are listed for future REST expansion; current features use server actions under `src/server/actions`.

## `src/components`
- ui
- layout
- navigation
- dashboard
- workspaces
- projects
- documents
- editor
- presence
- comments
- notifications
- ai
- search
- shared

## `src/lib`
- api-client.ts
- auth-client.ts
- socket.ts
- yjs.ts
- hocuspocus.ts
- redis.ts
- pg.ts
- query.ts
- utils.ts
- constants.ts
- logger.ts
- cache.ts
- errors.ts
- metrics.ts
- retry.ts

## `src/actions`
- documents.ts
- comments.ts
- notifications.ts
- ai.ts
- search.ts
- presence.ts

## `src/repositories`
- documents.repository.ts
- comments.repository.ts
- notifications.repository.ts
- workspaces.repository.ts
- projects.repository.ts
- versions.repository.ts
- ai.repository.ts
- search.repository.ts

## `src/realtime`
- socket-events.ts
- presence.ts
- cursor.ts
- rooms.ts
- document-sync.ts
- notification-events.ts


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
