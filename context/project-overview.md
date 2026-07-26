# Project Overview

## About the Project
This project is a real-time AI collaboration workspace. Teams use it to write documents together, leave comments, see live presence, and trigger AI actions without leaving the editor.

Phase 1 established the application foundation. Phase 2 introduces the collaboration layer:
- live editor sync
- presence and cursors
- comments and mentions
- AI inside the document
- version history
- notifications
- search across collaboration content

## Pages
```text
/                         → Landing
/login                    → Authentication
/dashboard                → Workspace overview
/workspaces               → Workspace list
/workspaces/[workspaceId] → Workspace overview
/projects/[projectId]     → Project overview
/documents/[documentId]   → Collaborative editor
/notifications            → Notification center
/settings                 → Preferences
```

## Core User Flow
- create or join a workspace
- open a project
- create or open a document
- edit together in real time
- see presence and cursors
- leave comments and mentions
- use AI inside the editor
- restore versions if needed

## Features In Scope
- collaborative editor shell
- TipTap-based editing
- Yjs/Hocuspocus sync
- Socket.IO presence and events
- comments and mentions
- AI sidebar/actions
- version history
- notifications
- search
- responsive layout and editor controls
