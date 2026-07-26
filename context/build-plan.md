# Build Plan — Phase 2

## Core Principle

Phase 2 should be built from the editor outward. First make the editor usable and stable. Then add collaboration, then persistence refinements, then AI, then notifications and search.

---

## Phase 2 — Collaboration Layer

### 01 Editor Shell
- document title
- top action bar
- left outline panel
- center editing area
- right AI / info panel
- save status
- collaborator avatars
- empty state

### 02 TipTap Editor Integration
- create editor instance
- load initial content
- render headings, paragraphs, lists, code blocks, quotes
- support formatting actions

### 03 Hocuspocus + Yjs Sync
- connect editor to Yjs document
- sync changes through Hocuspocus
- support multiple users in the same document
- handle reconnects safely

### 04 Presence + Cursors
- collaborator list
- online status chips
- typing indicator
- cursor labels
- live enter/leave updates

### 05 Comments + Mentions
- selected-text comment action
- threaded comment sidebar
- reply box
- resolve button
- mention suggestions

### 06 AI Actions in Editor
- floating selection menu
- AI sidebar
- prompt input
- action buttons for summarize / rewrite / expand / simplify / extract tasks

### 07 Version History
- version timeline
- version title / timestamp
- restore action

### 08 Notifications
- notification center
- unread count
- notification detail rows

### 09 Search
- search documents
- search comments
- search mentions
- search activity events

### 10 Polish and Responsiveness
- mobile stacking
- editor overflow handling
- adaptive side panels
- responsive comment drawer
- spacing / empty states
