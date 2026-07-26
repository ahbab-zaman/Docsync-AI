# Architecture

## 1. System Summary

This is a single-repo real-time AI collaboration workspace built around a collaborative document editor. The application uses Next.js App Router for the UI shell and document workspace, Node.js services for collaboration and persistence, PostgreSQL for durable data, Redis for ephemeral realtime state and queues, and TipTap + Yjs/Hocuspocus for shared editing.

---

## 2. Phase 2 Product Scope

### In scope
- document editor shell
- realtime collaborative editing
- live presence and cursors
- comments and threaded replies
- mentions
- AI actions inside the document
- document version history
- notifications
- collaboration search
- activity tracking
- responsive editor UX

### Out of scope
- mobile app
- advanced analytics dashboard
- billing/subscription system
- microservice split
- public sharing links
- guest editing
- offline-first support beyond the editor stack

---

## 3. High-Level Architecture

```text
Client (Next.js / React)
  ├── Workspace shell
  ├── Document editor (TipTap)
  ├── AI sidebar
  ├── Comments panel
  └── Notifications / search UI

Realtime layer
  ├── Hocuspocus (Yjs sync)
  ├── Socket.IO (presence, events, notifications)
  └── Redis pub/sub (cross-instance fanout)

Application layer
  ├── Route handlers
  ├── Server actions
  ├── Collaboration services
  ├── AI services
  ├── Notification services
  └── Search/indexing services

Persistence layer
  ├── PostgreSQL
  ├── SQL repository layer
  └── Object storage for future attachments

Async layer
  ├── BullMQ queues
  ├── AI generation jobs
  ├── notification jobs
  ├── indexing jobs
  └── version snapshot jobs
```

---

## 4. Data Ownership

### Durable data in PostgreSQL
- users
- workspaces
- projects
- documents
- document versions
- comments
- comment replies
- mentions
- notifications
- activity logs
- AI usage records
- document metadata

### Ephemeral or fast-moving data in Redis
- online presence
- active cursors
- live editor room state
- temporary collaboration metadata
- queue state and job coordination

---

## 5. Collaboration Flow

### Document open flow
1. User opens a document page.
2. Next.js loads the document shell and metadata.
3. Client connects to Socket.IO for presence and events.
4. Client connects to Hocuspocus room for Yjs sync.
5. Existing document state is loaded from PostgreSQL.
6. TipTap renders the document contents.
7. Presence and cursors appear as collaborators join.

### Editing flow
1. User types in TipTap.
2. Yjs captures the local change.
3. Hocuspocus syncs the update to other clients.
4. Socket.IO broadcasts presence and high-level UI events.
5. Snapshot/version jobs can run asynchronously if needed.
6. The latest state is persisted to PostgreSQL.

### Comment flow
1. User selects text.
2. A comment anchor is created for that range.
3. Comment data is written to PostgreSQL.
4. New comment events are emitted through Socket.IO.
5. Mentioned users receive notifications.

### AI action flow
1. User highlights text or asks a question.
2. A server action or route handler creates an AI job.
3. BullMQ processes the request if it is long-running.
4. The response is streamed or stored.
5. The result is inserted into the document or shown in the sidebar.
