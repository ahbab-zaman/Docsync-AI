# architecture.md

# AI Collaboration Platform
## System Architecture

> Version: Phase 3 + Dynamic Backend Data
> Status: Phase 1, Phase 2, and Phase 3 Engineering Milestones Implemented; all six app sections (AI, Documents, Members, Notifications, Settings, Workspaces) converted to PostgreSQL-backed server actions
> Current Phase: Engineering Excellence (logging, observability, caching, error handling, monitoring, testing, dynamic data)

---

# Purpose

This document defines the complete architectural blueprint of the AI Collaboration Platform.

It serves as the primary reference for engineers and AI coding agents when making architectural decisions.

Every feature, service, API, database change, and infrastructure improvement must align with the principles defined in this document.

This document intentionally focuses on long-term maintainability rather than short-term implementation convenience.

---

# Architectural Goals

The architecture has six primary goals.

## 1. Maintainability

The project should remain easy to modify after years of development.

Every module should have one responsibility.

Dependencies should remain predictable.

Features should be isolated.

No implementation should require knowledge of unrelated modules.

---

## 2. Scalability

The architecture must support future growth without requiring large-scale rewrites.

The system should be capable of evolving from:

Single Developer

↓

Small Team

↓

Startup

↓

Enterprise

without major architectural changes.

---

## 3. Reliability

Failures should be isolated.

A failure in one subsystem must not break unrelated features.

Background jobs should continue processing independently.

Realtime collaboration should degrade gracefully when services become unavailable.

---

## 4. Security

Security is designed into the architecture.

Not added later.

Every request passes through

Authentication

↓

Authorization

↓

Validation

↓

Business Rules

↓

Repository

↓

Database

No layer should bypass another.

---

## 5. Accessibility

Accessibility is a core architectural concern.

Every UI feature must be usable

without a mouse

with screen readers

with reduced motion

with keyboard navigation

using semantic HTML

Accessibility is considered part of the feature.

Not an enhancement.

---

## 6. Performance

Performance is treated as a product feature.

Every layer should minimize

network requests

database queries

JavaScript bundle size

re-rendering

memory usage

---

# Architectural Principles

The platform follows the following principles.

---

## Feature First

Code is organized around features.

Not around technologies.

Example

Good

src/features/workspaces/

Bad

src/controllers/

src/models/

src/routes/

spread across unrelated folders.

Each feature owns

components

services

repository

hooks

validators

types

tests

---

## Separation of Concerns

Every layer has exactly one responsibility.

UI

↓

Application Logic

↓

Business Logic

↓

Data Access

↓

Database

No layer skips another.

---

## Dependency Direction

Dependencies always point inward.

UI

↓

Services

↓

Repositories

↓

Database

Repositories never import React.

Components never import SQL.

Services never render UI.

---

## Composition over Inheritance

Prefer small reusable building blocks.

Avoid deep inheritance trees.

Favor composition.

---

## Explicitness

Hidden behavior increases maintenance cost.

The architecture favors

explicit imports

explicit dependencies

explicit configuration

explicit types

over implicit magic.

---

# System Overview

The platform consists of six major systems.

1. Client Application

Next.js

React

TypeScript

Tailwind

---

2. API Layer

Express.js

REST APIs

Authentication

Validation

Business orchestration

---

3. Collaboration Engine

TipTap

Yjs

Hocuspocus

Socket.IO

Realtime Presence

---

4. AI Engine

Gemini

OpenRouter

Prompt orchestration

Streaming responses

Structured outputs

---

5. Data Layer

PostgreSQL

Redis

BullMQ

Object Storage

---

6. Infrastructure

Docker

GitHub Actions

Reverse Proxy

Cloud Deployment

Monitoring

Logging

---

# High-Level Architecture

                    Browser
                       │
                       │
               Next.js Application
                       │
          ┌────────────┴────────────┐
          │                         │
     React UI                  Server Actions
          │                         │
          └────────────┬────────────┘
                       │
                  Express API
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Auth Service   Workspace      AI Service
                  Services
        │              │              │
        └──────────────┼──────────────┘
                       │
                 Repository Layer
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   PostgreSQL       Redis         BullMQ
                       │
                 Hocuspocus
                       │
                      Yjs
                       │
                 Socket.IO Server
                       │
                  Connected Clients

---

# Design Philosophy

The platform intentionally separates

Business Logic

from

Framework Logic.

Frameworks change.

Business rules should not.

For this reason

Next.js

Express

Socket.IO

BullMQ

Redis

PostgreSQL

are implementation details.

Business rules remain framework independent whenever possible.

---

# Architectural Layers

The application is divided into six logical layers.

Layer 1

Presentation

Responsibilities

UI

Forms

Accessibility

Rendering

Animations

Client State

---

Layer 2

Application

Responsibilities

Routing

Authentication

Data Fetching

Mutations

State Coordination

---

Layer 3

Domain

Responsibilities

Business Rules

Permissions

Validation

AI Orchestration

Workflow

Notifications

---

Layer 4

Infrastructure

Responsibilities

Database

Redis

Queues

Storage

Realtime

---

Layer 5

External Systems

Responsibilities

Gemini

OpenRouter

Email Provider

Object Storage

OAuth Providers

---

Layer 6

Operations

Responsibilities

Logging

Monitoring

Metrics

CI/CD

Deployment

Infrastructure

---

# Phase Evolution

The architecture intentionally evolves over time.

Phase 1

Static UI

↓

Phase 2

Working Product

↓

Phase 3

Engineering Excellence

↓

Phase 4

Scalable Architecture

↓

Phase 5

DevOps & Quality

↓

Phase 6

Enterprise Readiness

Each phase builds upon the previous one.

No phase replaces earlier work.

Instead,

the architecture grows while preserving existing stability.

---
---

# Frontend Architecture

The frontend is responsible for rendering the user interface, managing client-side interactions, coordinating API communication, and maintaining a highly accessible, responsive, and performant user experience.

The frontend must never contain business logic.

Its responsibilities are limited to:

- Rendering
- User interaction
- Form handling
- Client-side validation
- API communication
- UI state
- Accessibility
- Animation

Business decisions belong in the backend service layer.

---

## Frontend Principles

The frontend follows these principles.

### Server First

Prefer Server Components whenever possible.

Server Components reduce JavaScript bundle size, improve performance, and enable better SEO.

Use Client Components only when interaction requires them.

Examples:

- Forms
- Dialogs
- Dropdowns
- Rich text editor
- Drag and drop
- Live collaboration

---

### Component Hierarchy

Every page is composed using a predictable hierarchy.

```

Page

↓

Layout

↓

Section

↓

Feature Component

↓

Reusable Component

↓

Primitive UI

```

Pages never become large.

Business logic should never exist inside reusable UI components.

---

### Feature Isolation

Every feature owns its own implementation.

Example

```

features/
workspace/

components/

hooks/

repository/

services/

validators/

types/

api/

```

No feature should directly modify another feature's internals.

Communication occurs through APIs or shared contracts.

---

## UI Layer

Responsibilities

- Render pages
- Render layouts
- Render reusable components
- Display loading states
- Display error states
- Display empty states

The UI should never know

SQL

Redis

Authentication implementation

Business rules

AI prompt structure

---

## State Management

The application uses four levels of state.

### 1. URL State

Examples

- filters
- pagination
- search query
- active tab

Always prefer URL state for shareable information.

---

### 2. Local State

Use React state.

Examples

- modal visibility
- input value
- dropdown state

Avoid unnecessary global state.

---

### 3. Server State

Use TanStack Query.

Responsibilities

- caching
- mutations
- invalidation
- synchronization

Never duplicate server state inside Zustand.

---

### 4. Global Client State

Use Zustand only for

- theme
- sidebar
- user preferences
- temporary UI state

Never store database entities permanently inside Zustand.

---

# Backend Architecture

The backend follows a layered architecture.

Every request passes through predictable layers.

```

Request

↓

Route

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Database

```

Each layer has one responsibility.

---

## Routes

Responsibilities

- register endpoints
- attach middleware
- forward request

Routes should remain extremely small.

Never place business logic inside routes.

---

## Middleware

Responsibilities

- authentication
- authorization
- validation
- logging
- rate limiting
- request ID
- security headers

Middleware should remain generic.

---

## Controllers

Controllers translate HTTP requests into service calls.

Responsibilities

- read request
- invoke service
- return response

Controllers should not

perform SQL

contain business rules

contain AI prompts

send notifications directly

---

## Services

Services are the heart of the application.

Responsibilities

- business logic
- workflows
- permission checks
- orchestration
- AI interaction
- queue creation
- notifications

Services coordinate multiple repositories.

Services never perform SQL directly.

---

## Repository Layer

Repositories provide data access.

Responsibilities

- SQL queries
- transactions
- mapping database rows

Repositories never

validate data

call AI

send email

dispatch queues

Repositories are database adapters.

---

## Database Layer

The database stores persistent application state.

The database should never enforce business logic that belongs in services.

Responsibilities

- persistence
- indexing
- constraints
- transactions

Business decisions belong above the database.

---

# Repository Pattern

Every entity follows the same architecture.

Example

```

workspace

↓

workspace.controller.ts

↓

workspace.service.ts

↓

workspace.repository.ts

↓

PostgreSQL

```

This keeps every feature predictable.

---

## Repository Rules

Repositories may

SELECT

INSERT

UPDATE

DELETE

Transactions

Prepared statements

Repositories may NOT

Send email

Call AI

Validate permissions

Read cookies

Return HTTP responses

Repositories remain framework independent.

---

# Service Layer

The service layer coordinates the application.

Typical workflow

```

Create Workspace

↓

Validate Request

↓

Verify User

↓

Check Permissions

↓

Create Workspace

↓

Create Default Project

↓

Create Default Document

↓

Log Activity

↓

Return Response

```

Notice that multiple repositories may participate in a single service.

The service owns this orchestration.

---

# Request Lifecycle

Every HTTP request follows this lifecycle.

```

Incoming Request

↓

Security Middleware

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Service

↓

Controller

↓

HTTP Response

```

No layer should ever be skipped.

---

# API Standards

Every endpoint should follow REST conventions.

Examples

GET

```

/api/workspaces

```

POST

```

/api/workspaces

```

PATCH

```

/api/workspaces/:id

```

DELETE

```

/api/workspaces/:id

```

Avoid action-based endpoints whenever possible.

Good

```

POST /documents

```

Bad

```

POST /create-document

```

---

# Validation Flow

Validation occurs in three stages.

```

Client Validation

↓

API Validation

↓

Database Constraints

```

Each layer protects the next.

Validation should never exist in only one place.

---

---

# Authentication Architecture

Authentication is responsible for verifying user identity.

Authentication does NOT determine what a user can do.

Authorization is responsible for permissions.

Authentication should remain independent from business features.

---

## Authentication Flow

Every authenticated request follows the same lifecycle.

```
User Login
      │
      ▼
Credentials Validation
      │
      ▼
Access Token Issued
      │
      ▼
Refresh Token Stored Securely
      │
      ▼
Authenticated Request
      │
      ▼
JWT Verification Middleware
      │
      ▼
User Context Attached
      │
      ▼
Controller
```

---

## Authentication Responsibilities

The authentication layer is responsible for

- User login
- User logout
- Registration
- Refresh token rotation
- Password reset
- Email verification
- Session validation

Authentication should never contain business rules.

---

## Session Strategy

Access Token

- Short lifetime
- Sent with every request
- Stateless

Refresh Token

- Long lifetime
- Stored securely
- Rotated after refresh
- Revoked on logout

---

# Authorization (RBAC)

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

---

## Permission Flow

```
Authenticated User
        │
        ▼
Workspace Membership
        │
        ▼
Role Resolution
        │
        ▼
Permission Check
        │
        ▼
Business Service
```

---

## Roles

Phase 3 assumes the following roles.

- Owner
- Admin
- Editor
- Viewer

Later phases may introduce

- Billing Admin
- Guest
- Organization Owner

---

## Authorization Rules

Permission checks belong inside Services.

Never inside

- Components
- Controllers
- Repositories

---

# Realtime Collaboration Architecture

Realtime collaboration is the core capability of the platform.

The architecture separates

Document Content

Presence

Awareness

Persistence

Network Communication

Each subsystem has a single responsibility.

---

## Collaboration Stack

```
TipTap Editor
      │
      ▼
Yjs Document
      │
      ▼
Hocuspocus Server
      │
      ▼
Socket Transport
      │
      ▼
Connected Clients
```

---

## Responsibilities

### TipTap

Responsible for

- rendering
- editing
- formatting
- commands
- extensions

---

### Yjs

Responsible for

- CRDT synchronization
- merge conflicts
- shared state
- offline synchronization

Yjs becomes the source of truth while editing.

---

### Hocuspocus

Responsible for

- document synchronization
- awareness
- authentication
- persistence hooks

It should never implement business rules.

---

### Socket.IO

Responsible for

- transport
- realtime events
- presence updates
- notifications
- typing indicators

Socket.IO is not the collaboration engine.

It is only the communication layer.

---

# Document Lifecycle

```
Open Document
      │
      ▼
Load Metadata
      │
      ▼
Create Yjs Document
      │
      ▼
Join Collaboration Room
      │
      ▼
Receive Existing State
      │
      ▼
Realtime Editing
      │
      ▼
Auto Save
      │
      ▼
Persist Snapshot
```

---

# Presence Architecture

Presence information is temporary.

Examples

- online
- typing
- cursor position
- selected block

Presence should never be stored permanently.

Redis or memory is sufficient.

---

# Version History

Document history is permanent.

Every saved snapshot includes

- Version ID
- Document ID
- User ID
- Timestamp
- Change Summary

Users should be able to

- Browse history
- Restore versions
- Compare changes

---

# AI Architecture

AI is treated as an independent service.

Business logic never talks directly to an AI provider.

Instead

```
Service
      │
      ▼
AI Orchestrator
      │
      ├──────── Gemini
      │
      └──────── OpenRouter
```

## AI Implementation (current)

The current implementation uses **OpenRouter** as the production provider (`src/lib/ai/openrouter.ts`), with a deterministic mock fallback when no API key is configured (`isAiConfigured`). The default model is `~deepseek/deepseek-v4-flash-latest` (the `~` prefix is required; the unprefixed identifier returns 400 from OpenRouter). The provider module exposes:

- `isAiConfigured` — whether `OPENROUTER_API_KEY` is set
- `runAiCompletion` — single-turn chat completion against OpenRouter's `/api/v1/chat/completions`
- `getAiModelName` — the configured model for UI display

Every AI run is persisted to the `ai_runs` table (prompt, response, model, latency, status) so history survives page reloads. The AI page (`/app/ai`) is client-driven via `AiPageClient.tsx` with a document selector sourced from `getAiDocuments`. Prompt content passes through `src/lib/ai/sanitize.ts` before display.

AI calls degrade gracefully: if the provider is unreachable, the server action falls back to the offline mock instead of failing the request.

---

## AI Responsibilities

The AI layer performs

- summarization
- rewriting
- expansion
- brainstorming
- document analysis
- task extraction

It should never

- access the database directly
- modify permissions
- execute SQL
- bypass validation

---

## Prompt Architecture

Every prompt consists of

System Prompt

↓

Context

↓

User Request

↓

Structured Response

Prompt templates should remain versioned.

Never hardcode prompts throughout the codebase.

---

# AI Request Lifecycle

```
User Action
      │
      ▼
Controller
      │
      ▼
AI Service
      │
      ▼
Prompt Builder
      │
      ▼
LLM Provider
      │
      ▼
Response Validation
      │
      ▼
Structured Result
      │
      ▼
Client
```

---

# Redis Architecture

Redis is an infrastructure service.

It should not become a permanent database.

Primary responsibilities

- cache
- session storage
- presence
- rate limiting
- pub/sub

---

## Redis Keys

Examples

```
presence:user:{id}

workspace:{id}:members

session:{id}

cache:projects:{workspaceId}
```

Use predictable naming conventions.

---

# BullMQ Architecture

BullMQ handles background work.

Background jobs include

- email
- notifications
- AI processing
- exports
- imports
- cleanup
- analytics

---

## Queue Flow

```
API Request
      │
      ▼
Create Job
      │
      ▼
BullMQ Queue
      │
      ▼
Worker
      │
      ▼
Processing
      │
      ▼
Success / Retry / Dead Letter Queue
```

Jobs should never block API responses.

---

# Event-Driven Architecture

The application favors events over tightly coupled calls.

Example

Workspace Created

↓

Create Default Project

↓

Create Welcome Document

↓

Send Notification

↓

Log Activity

↓

Analytics Event

Instead of one service calling every subsystem directly, publish domain events where appropriate.

This improves extensibility and reduces coupling.

---

# File Storage

Binary assets should not be stored in PostgreSQL.

Use object storage for

- avatars
- attachments
- exports
- images
- AI-generated files

Database stores metadata only.

---
---

# Database Architecture

PostgreSQL is the primary source of truth for all persistent application data.

Every business entity is stored in PostgreSQL.

Examples

- Users
- Workspaces
- Projects
- Documents
- Comments
- Notifications
- Invitations
- AI History
- Audit Logs

The current schema (`src/server/schema.sql`) realizes these as: `users` (with a `preferences` JSONB column for appearance/settings), `workspaces`, `workspace_members`, `projects`, `documents`, `workspace_invites` (token, status `pending`/`accepted`/`declined`/`expired`, 7-day `expires_at`, `accepted_at`), `notifications`, `activity_events`, `ai_runs`, and `sessions` (id, user_id, created_at, expires_at). Invites, notifications, activity, and AI history were added during the Dynamic Backend Data milestone; all six app sections now read and write PostgreSQL instead of mock modules. Session persistence (login → `sessions` row + cookie; `getCurrentUser` resolves the cookie via the DB; logout deletes the row) means the auth-aware landing navbar correctly shows Sign in/Get started for guests and a user dropdown for authenticated users.

Redis is NOT a replacement for PostgreSQL.

---

# Database Design Principles

The database follows five principles.

1. Normalize first

Avoid duplicated data.

2. Optimize second

Denormalize only when profiling proves necessary.

3. Foreign Keys

Every relationship should be explicit.

4. Transactions

Critical business operations must be transactional.

5. Indexes

Every frequently queried column should be indexed.

---

# Entity Relationships

User
    │
    ├──────── WorkspaceMember
    │               │
    │               ▼
Workspace ───────── Project
                          │
                          ▼
                     Document
                          │
          ┌───────────────┴──────────────┐
          ▼                              ▼
      Comment                    DocumentVersion

User ───── WorkspaceInvite ───── Workspace (pending membership)
User ───── Notification            (per-user, `user_id`)
User ───── ActivityEvent           (audit-style feed)
User ───── AiRun                   (per-run AI history, optional `document_id`)

---

# Notifications & Activity (current)

Notifications and activity events are durable PostgreSQL rows created through the shared helpers in `src/lib/notifications.ts`:

- `createNotification` — single-user notification
- `createActivityEvent` — single audit/feed event
- `notifyWorkspaceMembers` / `notifyWorkspaceAdmins` — fan-out to a workspace's membership
- `createThrottledDocumentUpdatedActivity` — rate-limited document activity

Activity events are dispatched from the workspace, project, document, and member server actions (create/update/save/invite/accept/role-change/remove). Unread counts power the sidebar badge; the `/app/notifications` page renders the `notifications` and `activity_events` tables directly with mark-read/mark-all mutations.

# Invite & Email (current)

Workspace invitations are token-based and invitee-driven. `src/server/actions/members.ts` stores a unique `token`, a 7-day `expires_at`, and a `status` (`pending`/`accepted`/`declined`/`expired`) on each `workspace_invites` row. `src/lib/invite-utils.ts` owns token generation, expiry math, and invite-URL construction (`AUTH_URL` → `APP_URL` → localhost fallback). `src/lib/email.ts` sends the invitation through the Resend REST API when `RESEND_API_KEY` + `RESEND_FROM_EMAIL` are configured, and otherwise logs-and-skips in dev so the flow never hard-fails (matching the AI-provider fallback pattern). Guests open the public `/invite/[token]` page, sign in or create an account (redirected back via `?next=`), then accept — inserting the membership, notifying admins, and redirecting into the workspace — or decline. Admins resend invitations from the Members page; stale pending invites are reconciled to `expired` on read via `expireStaleInvites`.

---

# Settings & Appearance (current)

User settings live in the `users.preferences` JSONB column and are exposed only through `src/server/actions/settings.ts` + `src/server/repositories/user.ts`:

- Profile — name, email, avatar
- Password — bcrypt change via the shared auth helpers
- Appearance — `theme` (`light`/`dark`/`system`), `density`, `reducedMotion`

Appearance is applied client-side by `src/components/settings/ThemeProvider.tsx` + `src/lib/appearance.ts`, which write `data-theme`, `data-density`, and `data-reduced-motion` attributes on `<html>`; `globals.css` token overrides key off those attributes (converted from `@theme inline` because Tailwind v4 cannot override inline theme values).

---

# Indexing Strategy

Every production table should have indexes.

Examples

Users

- email
- username

Workspace Members

- workspace_id
- user_id

Projects

- workspace_id

Documents

- project_id
- updated_at

Comments

- document_id

Notifications

- user_id
- created_at

Indexes should support

Filtering

Sorting

Pagination

Searching

---

# Query Standards

Avoid

SELECT *

Always select only required columns.

Prefer

Prepared Statements

Parameterized Queries

Transactions

Avoid

Nested queries

Repeated queries

N+1 queries

---

# Transactions

Every multi-step business operation must execute inside a transaction.

Example

Create Workspace

↓

Create Membership

↓

Create Default Project

↓

Create Default Document

↓

Commit

If any step fails

Rollback everything.

Never leave partial data.

---

# Caching Architecture

Caching exists to reduce unnecessary work.

Caching should never become the source of truth.

---

## Cache Layers

Layer 1

Browser Cache

↓

Layer 2

Next.js Cache

↓

Layer 3

Redis Cache

↓

Layer 4

Database

Each request should stop at the earliest possible layer.

---

# Redis Caching Rules

Cache

Workspace Summary

Dashboard Statistics

Recent Activity

AI Responses (optional)

Notification Counts

Never cache

Authentication Decisions

Permissions

Financial Data

Critical Writes

---

# Cache Invalidation

Cached data should be invalidated after mutations.

Examples

Update Workspace

↓

Delete Cache

↓

Return Updated Data

Never leave stale cache.

---

# Error Handling Architecture

Every error belongs to one category.

Validation

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Infrastructure

↓

External Service

Each category has its own handler.

---

# Error Response

Client responses should remain consistent.

Example

{
    "success": false,
    "message": "...",
    "code": "...",
    "requestId": "..."
}

Never expose

SQL

Stack Trace

Secrets

Environment Variables

---

# Reliability

The application should tolerate failure.

Failures should remain isolated.

Example

Email fails

↓

Workspace still created

AI unavailable

↓

Editor still works

Redis unavailable

↓

Database still functions

Graceful degradation is required.

---

# Retry Policy

Retry

Network failures

Redis failures

Temporary database timeouts

External AI timeouts

Do NOT retry

Validation errors

Authentication failures

Permission failures

---

# Circuit Breaker

External providers

AI

Email

Storage

should be protected using circuit breakers.

Repeated failures should stop additional requests temporarily.

---

# Observability

Every production system must be observable.

Observe

Requests

Queues

Workers

Database

Redis

Socket Connections

AI Latency

File Storage

---

# Logging Standards

Every request receives a Request ID.

Every log contains

Timestamp

Request ID

User ID

Workspace ID

Feature

Duration

Result

Severity

Never log

Passwords

Tokens

Secrets

Sensitive Personal Information

---

# Metrics

Track

API latency

Database latency

Redis latency

AI latency

Queue latency

Realtime connections

Memory usage

CPU usage

Worker throughput

Error rate

Cache hit ratio

---

# Health Checks

Provide endpoints for

/health

/health/database

/health/redis

/health/queue

/health/storage

/health/socket

Health endpoints should respond quickly.

---

# Monitoring

Production deployments should integrate

Application Monitoring

Infrastructure Monitoring

Error Tracking

Performance Monitoring

Uptime Monitoring

Queue Monitoring

---

# Performance Architecture

Performance is measured.

Not assumed.

Profile

before

optimizing.

---

# Rendering Strategy

Prefer

Server Components

↓

Streaming

↓

Suspense

↓

Client Components

Only hydrate interactive components.

---

# Code Splitting

Large features should load lazily.

Examples

Rich Text Editor

Charts

AI Chat

Analytics

Settings

Admin Features

---

# Network Optimization

Batch requests when possible.

Use

Pagination

Infinite Scroll

Debouncing

Throttling

Optimistic Updates

Avoid waterfalls.

---

# Accessibility Architecture

Accessibility is built into every layer.

Requirements

Semantic HTML

Keyboard Navigation

Visible Focus States

Screen Reader Labels

Proper Headings

Accessible Forms

Reduced Motion

High Contrast Support

Every interactive element must be reachable using only the keyboard.

---

# UX Architecture

Every page should always communicate state.

Possible states

Loading

Success

Empty

Error

Offline

No screen should ever appear "broken."

---

# Deployment Architecture

Production

            Internet
                 │
                 ▼
          Reverse Proxy
                 │
                 ▼
        Next.js Application
                 │
                 ▼
          Express API
                 │
     ┌───────────┼────────────┐
     ▼           ▼            ▼
 PostgreSQL    Redis      BullMQ Workers
                               │
                               ▼
                        External Services

---

# Infrastructure Principles

Infrastructure should be

Repeatable

Version Controlled

Observable

Recoverable

Automated

Infrastructure changes should eventually be managed using Infrastructure as Code.

---

# Scalability Roadmap

Current Phase

Single deployment

↓

Next

Multiple application instances

↓

Load Balancer

↓

Read Replicas

↓

Dedicated Worker Cluster

↓

Dedicated AI Service

↓

Microservices (only when justified)

The architecture should evolve incrementally.

Never adopt distributed systems prematurely.

---

# Non-Functional Requirements

Availability

99.9%

Accessibility

WCAG AA

API Response Time

< 300ms average

Realtime Latency

< 100ms

Page Load

< 2 seconds

Core Web Vitals

Green

Error Rate

< 1%

---

---

# Module Communication Rules

Every module communicates through well-defined interfaces.

Direct dependencies between unrelated modules are prohibited.

Good

Workspace Service
        │
        ▼
Notification Service

Bad

Workspace Component
        │
        ▼
Database Repository

---

# Dependency Rules

Dependencies always point inward.

Presentation
        │
        ▼
Application
        │
        ▼
Domain
        │
        ▼
Infrastructure

Infrastructure never imports Presentation.

Repositories never import Components.

Services never import Pages.

Components never import Database code.

---

# Feature Boundaries

Every feature owns its own implementation.

Example

features/
    workspace/
        api/
        components/
        hooks/
        repository/
        services/
        types/
        validators/

No feature should directly modify another feature's internal implementation.

Shared functionality belongs inside

lib/

or

shared/

Never duplicate shared logic.

---

# Shared Layer Responsibilities

The shared layer contains only reusable resources.

Examples

- UI primitives
- utility functions
- custom hooks
- constants
- shared types
- API client
- authentication helpers

Business logic must never live inside shared utilities.

---

# Communication Matrix

Presentation

Can communicate with

✓ Hooks
✓ Services
✓ API Client

Cannot communicate with

✗ PostgreSQL
✗ Redis
✗ BullMQ

---

Controllers

Can communicate with

✓ Services

Cannot communicate with

✗ Database
✗ React
✗ Socket.IO directly

---

Services

Can communicate with

✓ Repositories
✓ Redis
✓ BullMQ
✓ AI Service
✓ Notification Service

Cannot communicate with

✗ React Components
✗ Tailwind
✗ Browser APIs

---

Repositories

Can communicate with

✓ PostgreSQL

Cannot communicate with

✗ React
✗ AI
✗ BullMQ
✗ Authentication

---

# Cross-Cutting Concerns

The following concerns apply to every module.

Logging

Validation

Authorization

Accessibility

Performance

Security

Documentation

Testing

These concerns should never be treated as optional.

---

# Engineering Principles

Every engineer working on the project should follow these principles.

Write less code.

Write better code.

Prefer readability over cleverness.

Prefer explicitness over magic.

Optimize only after measuring.

Design for future developers.

Every feature should be understandable without additional explanation.

---

# Technical Debt Policy

Technical debt is inevitable.

Unmanaged technical debt is unacceptable.

Whenever debt is introduced,

document

why

impact

planned resolution

Never leave unexplained shortcuts.

---

# Refactoring Policy

Refactoring is encouraged when it

reduces complexity

improves readability

improves maintainability

improves performance

Do not refactor solely for personal preference.

Every refactor must preserve behavior.

---

# Backward Compatibility

Public APIs should remain stable.

Breaking changes require

documentation

migration plan

versioning strategy

Client applications should never unexpectedly break.

---

# Documentation Policy

Documentation is part of the product.

Every architectural change requires updating

architecture.md

Every new feature requires updating

build-plan.md

Every completed task requires updating

progress-tracker.md

Every UI change requires updating

ui-registry.md

Every design change requires updating

ui-rules.md

ui-tokens.md

Documentation should always reflect the current implementation.

---

# Architecture Decision Records (ADR)

Major architectural decisions should be recorded.

Each ADR should include

Problem

Context

Decision

Alternatives Considered

Consequences

Status

Example

ADR-001

Repository Pattern

ADR-002

Yjs Collaboration

ADR-003

Redis Caching

ADR-004

BullMQ Background Jobs

ADR-005

Feature-First Architecture

Future engineers should understand why decisions were made.

---

# Future Evolution

The architecture intentionally evolves through six phases.

Phase 1

Foundation

↓

Phase 2

Core Product

↓

Phase 3

Engineering Excellence

↓

Phase 4

Scalability & Technical Sustainability

↓

Phase 5

Quality Engineering & DevOps

↓

Phase 6

Enterprise Readiness

Every phase builds upon previous work.

No architectural rewrite should be necessary.

---

# Phase 4 Preparation

Phase 3 prepares the application for future scaling.

Upcoming architectural additions include

Read Replicas

Distributed Cache

Infrastructure as Code

Container Orchestration

Distributed Workers

Centralized Logging

Message Brokers

Feature Flags

API Gateway

Observability Dashboards

The architecture has already been designed so these additions can be introduced incrementally.

---

# Architectural Success Criteria

The architecture is considered successful when

✓ Features remain isolated.

✓ Dependencies remain predictable.

✓ Business logic is framework independent.

✓ Accessibility is built into every feature.

✓ Security exists at every layer.

✓ Performance is measurable.

✓ Observability exists across the platform.

✓ Documentation remains synchronized.

✓ The codebase is understandable by new contributors.

✓ New features can be added without modifying unrelated modules.

---

# Final Principles

This project should demonstrate how modern SaaS applications are engineered.

The objective is not merely to build a working application.

The objective is to build software that remains

Maintainable

Scalable

Reliable

Accessible

Observable

Secure

Performant

Developer Friendly

for many years.

Every engineering decision should move the project closer to that goal.

---

# Phase 3 Implementation Status

This section records what has actually been implemented during Phase 3 engineering milestones. It supplements the design above with concrete implementation notes.

## Logging

Implemented: `src/lib/logger.ts`

- Structured JSON log output with levels (debug/info/warn/error) and `LOG_LEVEL` env override.
- `AsyncLocalStorage` request context (`runWithRequestContext`, `getRequestContext`).
- `generateRequestId()` produces unique request IDs attached to every scoped log.
- Every server action and both realtime servers (`server/socket-server.ts`, `server/hocuspocus-server.ts`) emit structured logs.
- Business events logged: workspace/project/document/member creation, auth login/register, AI requests, comments, versions, notifications, search.

## Health Checks

Implemented: Next.js route handlers

- `/api/health` — aggregate status of database + redis.
- `/api/checks/database` — PostgreSQL probe.
- `/api/checks/redis` — Redis ping.
- `/api/checks/socket` — probes the Socket.IO server `/health` endpoint.
- Health endpoints require no authentication.

## Caching

Implemented: `src/lib/redis.ts`, `src/lib/cache.ts`

- Redis client built on ioredis with graceful degradation — when `REDIS_URL` is unset or Redis is unreachable, cache helpers return `null`/no-op so the database remains the source of truth.
- Cache keys follow `cache:<entity>:<id>` (workspaces, workspace, projects, project, documents, document, dashboard).
- `withCache` reads then writes with a TTL; short TTLs (15–30s) prevent stale reads on frequently mutating entities.
- Invalidation is triggered inside server actions after mutations (create/update/archive of workspaces, projects, documents; member role changes).

## Error Handling

Implemented: `src/lib/errors.ts`, `src/lib/retry.ts`

- Typed error classes map to HTTP status codes and friendly user messages.
- DB layer converts unique violations → `ConflictError` and retryable failures → `InfrastructureError`.
- Client-side `withRetry` retries only transient network/offline failures.
- Raw error messages are never exposed to users.

## Metrics

Implemented: `src/lib/metrics.ts`

- In-memory counters record call counts, average duration, and last error time.
- The database query/transaction layer records `db:query` and `db:transaction` metrics.
- `/api/metrics` exposes the snapshot. Suitable for development; Phase 4 introduces a production metrics backend.

## Testing

Implemented: Vitest (`npm test`)

- Test config in `vitest.config.ts` with `@/` alias to `src/`.
- Unit tests: rate-limiter, sanitize, retry, errors, metrics, logger (42 tests passing).
- Testing uncovered and fixed a sanitizer bug (`javascript:` URLs were not blocked) and an `isOnline()` edge case in non-browser environments.

---

END OF architecture.md
