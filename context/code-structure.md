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
    ├── documents/
    ├── comments/
    ├── notifications/
    ├── search/
    ├── ai/
    └── realtime/
```

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
