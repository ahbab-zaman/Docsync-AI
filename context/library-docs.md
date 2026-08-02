# Library Docs

## Before Using Any Library
Before implementing a feature that uses a third-party library:
1. Check `AGENTS.md`
2. Check whether a project skill or MCP server exists
3. Read this file for project-specific rules

---

## TipTap
Use TipTap for the rich text editor.
- single editor instance per document page
- keep editor shell separate from toolbar
- use extensions only when the product needs them
- keep editor rendering separate from persistence

## Yjs
Use Yjs for shared document state and conflict-safe collaboration.
- document state lives in a Yjs document per room
- synchronize through Hocuspocus
- persist snapshots to PostgreSQL on a controlled cadence
- do not treat Yjs as the only data store

## Hocuspocus
Use Hocuspocus as the collaboration server for Yjs rooms.
- one document room per document id
- handle reconnects gracefully
- keep room setup centralized
- close resources cleanly when sessions end

## Socket.IO
Use Socket.IO for presence, lightweight collaboration events, and notifications.
- presence join/leave/update
- cursor metadata
- typing indicators
- notification delivery
- comment events

## PostgreSQL + `pg`
Use PostgreSQL as the canonical data store with a SQL-first repository layer.
- use `pg` or another approved SQL-first helper
- keep SQL access inside repository files
- never put SQL in components
- repository layer owns queries

## Redis
Use Redis for transient collaboration state and queue support.
- store presence/cache data
- support pub/sub fanout
- back BullMQ queues

## BullMQ
Use BullMQ for background processing.
- AI generation
- notifications
- search indexing
- version snapshots

## Zod
Use Zod for validation across forms, route handlers, actions, and job payloads.

# Library Best Practices

This section defines **how each library must be used in this project**. AI agents must follow these rules consistently to keep the codebase maintainable, scalable, and predictable.

---

## React

### Purpose
Build reusable UI using composable components.

### Use When
- Creating interactive UI
- Building reusable components
- Managing local component state

### Project Rules
- Keep components small and focused.
- Prefer composition over deeply nested components.
- Move business logic into hooks or services.
- Never perform database or API logic directly inside presentation components.

### Avoid
- Large components (>300 lines)
- Deep prop drilling
- Duplicate UI logic

---

## Next.js

### Purpose
Application framework responsible for routing, layouts, rendering, and server-side features.

### Project Rules
- Use App Router only.
- Prefer Server Components by default.
- Use Client Components only for interactive features.
- Keep layouts reusable.
- Use Route Handlers for API endpoints when appropriate.

### Avoid
- Making entire pages client components unnecessarily.
- Fetching duplicate data.

---

## Tailwind CSS

### Purpose
Project styling framework.

### Project Rules
- Use design tokens defined in `ui-tokens.md`.
- Never hardcode colors.
- Never use arbitrary spacing unless necessary.
- Prefer reusable UI components over long utility chains.

### Avoid
- Inline styles
- Random spacing values
- Raw color classes instead of project tokens

---

## TipTap

### Purpose
Rich text editor.

### Project Rules
- One editor instance per document.
- Keep editor state isolated.
- Toolbar must remain independent from editor logic.
- Register extensions only when required.
- Persist editor content through the service layer.

### Avoid
- Multiple editor instances
- Business logic inside editor extensions

---

## Yjs

### Purpose
Realtime collaborative document state.

### Project Rules
- One Y.Doc per document.
- Treat Yjs as the realtime layer only.
- Persist snapshots into PostgreSQL.
- Handle synchronization through Hocuspocus.

### Avoid
- Using Yjs as permanent storage.
- Direct database writes from Yjs handlers.

---

## Hocuspocus

### Purpose
Realtime collaboration server.

### Project Rules
- One room per document.
- Authenticate every connection.
- Clean up rooms after disconnect.
- Keep collaboration logic centralized.

### Avoid
- Business logic inside Hocuspocus hooks.

---

## Socket.IO

### Purpose
Realtime communication.

### Project Rules
Use only for:
- Presence
- Notifications
- Typing indicators
- Cursor metadata
- Lightweight realtime events

### Avoid
- Large data synchronization
- Persistent storage

---

## PostgreSQL + pg

### Purpose
Primary persistent database.

### Project Rules
- Use Repository Pattern.
- SQL belongs only in repositories.
- Use parameterized queries.
- Wrap multi-step operations in transactions.

### Avoid
- SQL inside services
- SQL inside React components

---

## Redis

### Purpose
Transient data and caching.

### Project Rules
Use for:
- Presence
- Cache
- Pub/Sub
- Rate limiting
- Session storage
- Queue support

### Avoid
- Permanent application data

---

## BullMQ

### Purpose
Background job processing.

### Project Rules
Use queues for:
- AI generation
- Email
- Notifications
- Search indexing
- Version snapshots
- Cleanup jobs

### Avoid
- Long-running API requests
- Blocking user interactions

---

## Zod

### Purpose
Schema validation.

### Project Rules
Validate:
- Forms
- API requests
- Route handlers
- Environment variables
- Queue payloads

### Avoid
- Manual validation logic
- Duplicate validation schemas

---

## Email (Resend + SMTP fallback)

### Purpose
Send transactional email (workspace invitations) through Resend or an SMTP relay.

### Project Rules
- Use `src/lib/email.ts` (`sendInviteEmail`, `isEmailConfigured`, `isSmtpConfigured`) — never call Resend or nodemailer directly from actions/components.
- Two providers, resolved in order:
  1. **Resend** — requires `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (needs a verified domain + from address on it).
  2. **SMTP** — requires `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` + `SMTP_FROM` (e.g. Gmail App Password on `smtp.gmail.com:587`). Used when Resend is not configured; free path that reaches any recipient.
- When no provider is configured, log-and-skip instead of failing (graceful degradation, mirroring the OpenRouter fallback).
- Build URLs through `src/lib/invite-utils.ts` (`buildInviteUrl`), never hardcode the app origin.
- Send email from the service/action layer, never from UI components.

### Avoid
- Adding a third email provider without updating this document.
- Blocking the invite action on email delivery (email failures must not break the invite).
- Exposing the invite token or SMTP credentials in logs or responses.

---

## React Hook Form

### Purpose
Form state management.

### Project Rules
- Pair with Zod.
- Keep validation schemas separate.
- Build reusable form components.
- Display accessible validation messages.

### Avoid
- Managing complex forms with useState.

---

## TanStack Query

### Purpose
Server state management.

### Project Rules
Use for:
- Data fetching
- Mutations
- Cache invalidation
- Optimistic updates

### Avoid
- Storing UI state
- Storing permanent global state

---

## Framer Motion

### Purpose
Animations and transitions.

### Project Rules
- Use subtle animations.
- Respect prefers-reduced-motion.
- Animate state changes, not decoration.
- Keep durations between 150–300ms.

### Avoid
- Excessive animations
- Continuous animations
- Layout-breaking transitions

---

# General Rules

Every library must have a single responsibility.

Before introducing a new library, verify that an existing library cannot solve the problem.

Never introduce overlapping libraries that solve the same concern.

When implementing a feature:
1. Read this file.
2. Follow the project-specific rules.
3. Use the recommended library for the task.
4. Keep implementations consistent across the codebase.
5. Update this document if a new library becomes part of the project's standard stack.
