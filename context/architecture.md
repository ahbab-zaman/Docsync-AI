# Architecture

## 1. Project Summary

**PulseBoard** is a real-time AI collaboration workspace for software teams. Phase 1 focuses on the product foundation: workspace management, projects, documents, AI-assisted drafting, members, notifications, profile settings, and a polished app shell built from mock data first and then wired to persistence.

The architecture is designed as a **single-repo Next.js application** with a clean `/src` structure, server actions for mutations, route handlers for API-style endpoints, PostgreSQL accessed through a small `pg`-based repository layer, Redis for cache and background work, and a collaboration layer that can grow into true live sync in Phase 2.

## 2. Architectural Goals

- Keep the first release shippable and understandable.
- Separate UI, business logic, data access, and realtime concerns.
- Make the document editor the center of the product.
- Keep the app ready for Phase 2 collaboration without forcing all of it into Phase 1.
- Use strongly typed boundaries so the codebase stays maintainable.

## 3. Phase 1 Scope

Phase 1 includes:

- landing page
- login/register flows
- authenticated app shell
- dashboard
- workspace list and workspace creation
- workspace overview
- project list and project overview
- document editor UI with persistence
- AI side panel and simple AI actions
- members management
- notifications center
- profile/settings page
- database schema and seed data
- global UI system and design tokens

Phase 1 does **not** include the full Phase 2 collaborative editing engine, advanced presence syncing, complex live comments, or multi-device CRDT merge handling.

## 4. System Overview

```text
Browser
  ↓
Next.js App Router (/src/app)
  ↓
Server Components / Server Actions / Route Handlers
  ↓
Service Layer (/src/server)
  ↓
Repository layer + `pg`
  ↓
PostgreSQL

Browser
  ↓
Socket.IO client
  ↓
Realtime gateway (/src/server/realtime)
  ↓
Redis pub/sub (future scaling)

Browser
  ↓
AI action request
  ↓
BullMQ job queue
  ↓
Worker process
  ↓
AI provider / structured response
```

## 5. Project Initialization

This project begins from a blank repository. The first milestone is the foundation setup.

### 5.1 Setup Sequence
1. Create a Next.js app using the App Router.
2. Enable the `/src` directory immediately.
3. Add Tailwind CSS v4 and define theme tokens in `src/app/globals.css`.
4. Add Inter in the root layout.
5. Create the base route and layout skeleton.
6. Install and configure the libraries needed for Phase 1.
7. Define the folder structure under `/src`.
8. Add placeholder env variables and local development configuration.
9. Build the marketing and auth pages with mock data first.
10. Only after the shell is stable, begin wiring persistence and realtime behavior.

### 5.2 Required `/src` Structure

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

### 5.3 Initialization Constraints

- Do not start with isolated feature code before the app shell exists.
- Do not create Phase 2 collaboration logic during initialization.
- Keep the first build focused on routing, design tokens, and shared structure.
- Mock data is acceptable until the shell is fully in place.

### 5.4 Database Access Pattern

- Use a small `pg` client wrapper in `src/lib/db.ts`.
- Keep SQL inside repository modules under `src/server/repositories/`.
- Never query PostgreSQL directly from UI components.
- Keep mutations behind server actions and repository methods.

## 6. High-Level Modules

### 6.1 Marketing App
Public entry point that explains the product and routes users into auth.

### 6.2 Auth Layer
Handles sign in, sign up, session state, protected routes, and logout.

### 6.3 Workspace Domain
Owns workspaces, workspace memberships, roles, invites, and overview data.

### 6.4 Project Domain
Owns projects inside a workspace, project metadata, and project-level summaries.

### 6.5 Document Domain
Owns editor content, document metadata, version snapshots, and AI assistant actions.

### 6.6 Collaboration Layer
Phase 1 prepares the interface for collaboration. Phase 2 will introduce full live sync.

### 6.7 AI Layer
Responsible for generation, rewriting, summarization, and structured assistant outputs.

### 6.8 Notification Layer
Tracks in-app activity and user-facing notifications.

### 6.9 Settings Layer
Profiles, preferences, theme settings, and account deletion.

## 7. Request Flow

### 6.1 Page Request
1. User opens a route.
2. Next.js renders a server component.
3. The server checks auth and loads the required data.
4. Data is transformed into page props.
5. The client renders the page and interactive controls.

### 6.2 Mutation Flow
1. User submits a form or clicks an action.
2. A server action validates the input with Zod.
3. The server action calls the service layer.
4. The service layer writes through the repository layer and shared `pg` helper.
5. Cache invalidation and activity logging happen.
6. The UI refreshes and the result is shown immediately.

### 6.3 AI Action Flow
1. User asks AI to summarize, rewrite, or generate tasks.
2. Input is validated.
3. The request is sent to a background job or direct service depending on cost and latency.
4. Output is normalized into structured data.
5. The UI shows the generated content in the document or panel.

## 8. Data Architecture

### 7.1 Core Tables

- `users`
- `workspaces`
- `workspace_members`
- `workspace_invites`
- `projects`
- `documents`
- `document_versions`
- `document_comments`
- `notifications`
- `activity_logs`
- `ai_runs`

### 7.2 Key Relations

- one user can belong to many workspaces
- one workspace can contain many projects
- one project can contain many documents
- one document can have many versions and comments
- one user can receive many notifications
- one AI run can belong to a document, project, or workspace context

### 7.3 Document Storage Strategy

Phase 1 stores document content in PostgreSQL as structured JSON or editor JSON depending on the editor choice. A version snapshot is saved on meaningful updates. Phase 2 can layer in collaborative OT/CRDT syncing without changing the product model.

## 9. Auth Architecture

### 8.1 Rules

- Auth is required for all workspace routes.
- Public pages are limited to marketing and auth pages.
- Session state must be available on both server and client.
- Every database query must be scoped to the current user and workspace membership.

### 8.2 Route Protection

- Public: `/`, `/login`, `/register`
- Protected: all `/app` routes
- Workspace and project pages verify membership before rendering

## 10. Realtime Architecture

Phase 1 uses the realtime stack only where it adds visible value without becoming the core dependency.

### Phase 1 realtime uses
- online presence indicator
- typing status placeholders
- notification count updates
- optimistic UI hints

### Phase 2 realtime uses
- full collaborative cursor sharing
- live document sync via Yjs/Hocuspocus
- conflict resolution
- live comments and threaded updates

### Socket.IO responsibilities
- presence events
- typing indicators
- notification broadcasts
- lightweight room management

### Redis responsibilities
- pub/sub fanout between app instances
- cache
- rate limit support
- queue storage for BullMQ

## 11. AI Architecture

### 10.1 AI Use Cases in Phase 1
- summarize a document
- rewrite selected text
- generate action items
- create meeting notes
- draft project descriptions
- suggest names or titles

### 10.2 AI Output Shape
AI responses should be normalized into predictable structures such as:

- `summary`
- `bullets`
- `actionItems`
- `risks`
- `suggestedTitle`
- `confidence`

### 10.3 AI Guardrails
- all AI input is validated
- the UI never trusts raw model output
- assistant output is edited before persistence
- failures return human-readable messages
- long-running actions should be queued

## 11. Caching and Performance

- cache workspace summaries
- cache project overview data
- cache recent notifications
- cache active document metadata
- invalidate targeted keys after mutations
- keep heavy AI tasks asynchronous when possible

## 12. Security

- verify workspace membership before reads and writes
- validate all inputs with Zod
- never expose internal stack traces to the browser
- keep secrets in environment variables
- avoid over-privileged database queries
- log server-side errors with context prefixes

## 13. Scalability Path

### Phase 1
Single repo, one app, modular service boundaries.

### Phase 2
Enable real collaboration, websocket rooms, Yjs document sync, and richer AI workflows.

### Later
Split the realtime layer or AI workers if traffic requires it.

## 14. Deployment Model

Recommended first deployment layout:

- Next.js app on a managed host
- PostgreSQL managed database
- Redis managed service
- BullMQ worker as a separate process
- Socket.IO / collaboration process as a separate process if needed

## 15. Architecture Decisions to Keep Stable

- single repo
- `/src/app` router structure
- `pg`-based repository layer as the only database access path
- Zod for validation
- shadcn/ui for base UI
- Tailwind tokens only from `ui-tokens.md`
- server actions for mutations
- route handlers only when an HTTP endpoint is needed
- phase separation between foundation and collaboration
