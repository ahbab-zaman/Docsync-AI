# Build Plan

## Core Principle

Build the interface with realistic mock data first, verify the layout visually, and then wire logic one feature at a time. Every feature should be visible, testable, and independently shippable before moving to the next.

---

## Phase 1 — Foundation

## 01 Foundation Setup

### Goal
Set up the app shell, source structure, theme tokens, shared UI primitives, linting, and base providers.

### Deliverables
- `/src/app` based Next.js structure
- global layout
- app shell
- base design tokens
- reusable UI primitives
- mock data folder
- shared types
- environment file template

### Done When
- the app starts cleanly
- root layout applies the global font and theme
- the structure is ready for the rest of Phase 1

---

## 02 Landing Page

### Goal
Introduce the product with a premium marketing page.

### UI
- hero section
- feature cards
- collaboration preview
- AI preview block
- call-to-action section
- footer

### Logic
- CTA routes to login if logged out
- CTA routes to dashboard if logged in

### Done When
- the page feels like a real product landing page
- users understand what the app does in under one screen scroll

---

## 03 Authentication

### Goal
Implement login, register, session handling, protected routes, and logout.

### UI
- login page
- register page
- forgot password placeholder if needed
- session-aware buttons in the header

### Logic
- sign in
- sign up
- session persistence
- route protection
- logout
- redirect after auth

### Done When
- a logged-out user cannot access protected routes
- a logged-in user lands inside the app shell

---

## 04 App Shell

### Goal
Create the authenticated layout used by every internal page.

### UI
- left sidebar
- top bar
- workspace switcher
- quick create button
- search
- profile menu

### Logic
- load workspace context
- show current user
- highlight active route
- handle loading and empty states

### Done When
- all internal pages share a consistent shell
- navigation feels polished and stable

---

## 05 Dashboard

### Goal
Build the main landing page after login.

### UI
- summary cards
- recent documents
- active workspaces
- recent projects
- notifications preview
- AI usage preview
- activity timeline

### Logic
- load dashboard summary
- show empty states if nothing exists
- surface shortcuts to create workspace/document/project

### Done When
- the dashboard gives a clear overview of the account

---

## 06 Workspace Management

### Goal
Allow the user to create, view, rename, archive, and switch workspaces.

### UI
- workspace list page
- create workspace modal/page
- workspace overview page
- workspace settings panel

### Logic
- create workspace
- update workspace details
- enforce membership checks
- display role and invitation state

### Done When
- the user can move between workspaces without confusion

---

## 07 Project Management

### Goal
Let users organize workspaces into projects.

### UI
- project list
- create project modal/page
- project overview page
- project summary blocks

### Logic
- create project
- rename project
- archive project
- project membership checks
- load project activity

### Done When
- a workspace can hold multiple structured projects

---

## 08 Document Editor Foundation

### Goal
Build the main editor page with rich text editing and document persistence.

### UI
- document title
- breadcrumb / context
- editor canvas
- outline panel
- document actions
- metadata footer

### Logic
- save document content
- autosave placeholder
- document list/load
- basic version snapshot creation

### Done When
- users can create and edit documents confidently

---

## 09 AI Assistant Panel

### Goal
Add an AI assistant panel connected to the current document or project context.

### UI
- prompt input
- suggested prompt chips
- streaming response area
- quick action buttons
- output actions

### Logic
- summarize document
- rewrite selected text
- generate action items
- generate project summary
- save AI result as document content if requested

### Done When
- AI feels integrated into the editor rather than separate from it

---

## 10 Members and Access

### Goal
Manage workspace members and roles.

### UI
- member list
- invite modal
- role selector
- pending invites list
- remove member action

### Logic
- invite user
- accept invite
- change role
- remove member
- enforce role-based actions

### Done When
- workspace access control is visible and understandable

---

## 11 Notifications and Activity

### Goal
Give users a clean way to see what happened recently.

### UI
- notifications page
- activity list
- unread state
- empty state
- mark as read action

### Logic
- create notifications on key events
- fetch recent activity
- mark notifications as read
- update badge counts

### Done When
- users can quickly review what changed in the workspace

---

## 12 Profile and Settings

### Goal
Let users update personal details, appearance, and preferences.

### UI
- profile card
- account settings
- theme settings
- notification preferences
- danger zone

### Logic
- update profile
- update password if supported
- save preferences
- delete account flow

### Done When
- account settings feel complete and trustworthy

---

## 13 Database Schema

### Goal
Create the full Phase 1 data model before moving to advanced collaboration.

### Deliverables
- SQL schema
- migrations
- seed data
- indexes
- relational constraints

### Done When
- every page has a real backing model
- data relationships match the product flow

---

## 14 Quality and Polish

### Goal
Finish Phase 1 with a professional feel.

### Deliverables
- loading skeletons
- empty states
- error states
- toasts
- confirmation dialogs
- responsive behavior
- keyboard interactions
- accessibility pass

### Done When
- the app feels ready to show in a portfolio or demo

---

## Phase 2 Reservation

Phase 2 will be planned later and should focus on:
- full collaborative editing
- presence syncing
- cursor tracking
- comments in real time
- Yjs/Hocuspocus document sync
- richer AI orchestration
- multi-client collaboration stability
