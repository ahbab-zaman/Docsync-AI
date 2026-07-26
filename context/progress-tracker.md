# Progress Tracker

## Current Status
**Phase:** Phase 2 — Collaboration Layer
**Last completed:** Phase 1 foundation and context refresh
**Next:** Phase 2 editor shell

## Progress

### Phase 1 — Foundation
- [x] 01 Project setup and `/src` structure
- [x] 02 UI token direction and palette decision
- [x] 03 Landing / auth / workspace foundation
- [x] 04 Phase 1 planning docs

### Phase 2 — Collaboration Layer
- [ ] 01 Editor shell
- [ ] 02 TipTap integration
- [ ] 03 Hocuspocus + Yjs sync
- [ ] 04 Presence + cursors
- [ ] 05 Comments + mentions
- [ ] 06 AI actions in editor
- [ ] 07 Version history
- [ ] 08 Notifications
- [ ] 09 Search
- [ ] 10 Responsive polish

## Decisions Made During Build
- Use a single-repo modular architecture.
- Keep durable collaboration data in PostgreSQL.
- Keep ephemeral realtime state in Redis.
- Use TipTap + Yjs/Hocuspocus for shared document editing.
- Use Socket.IO for presence and lightweight live events.
- Keep the UI bright and readable with the Ivory Nebula palette.
