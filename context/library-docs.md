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
