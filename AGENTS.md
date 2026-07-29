# AGENTS.md

# AI Collaboration Platform
## Master Development Instructions

> This document is the single source of truth for every AI coding agent working on this repository.
>
> All implementation decisions, architectural choices, coding conventions, documentation updates, and feature development must follow this document before any code is written.

---

# Project Status

Current Version

Phase 1 ✅ Completed
Phase 2 ✅ Completed
Phase 3 🚧 Active Development

Future

Phase 4 – Scalability & Technical Sustainability
Phase 5 – Testing, DevOps & CI/CD
Phase 6 – Enterprise Readiness

---

# Project Goal

This project is a production-grade AI-powered real-time collaboration platform.

The objective is NOT to simply build features.

The objective is to build software the same way experienced software engineers build SaaS products in real companies.

Every decision must prioritize

• Maintainability
• Accessibility
• Scalability
• Performance
• Reliability
• Security
• User Experience
• Clean Architecture
• Technical Sustainability

---

# Tech Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod

Editor & Collaboration

- TipTap
- Yjs
- Hocuspocus
- Socket.IO

Backend

- Node.js
- Express
- PostgreSQL
- pg (Repository Pattern)
- Redis
- BullMQ

Authentication

- JWT
- Refresh Tokens
- Secure Cookies

Storage

- S3 Compatible Storage

AI

- Gemini
- OpenRouter

Deployment

- Docker
- GitHub Actions
- Vercel
- Railway / VPS

---

# Repository Structure

The project uses a single repository.

```

src/
app/
components/
features/
hooks/
lib/
providers/
services/
repositories/
types/
utils/
styles/

```

Every feature must remain modular.

Never create a "misc" folder.

Never create a "helpers" folder that becomes a dumping ground.

---

# Source of Truth

Before writing code, every AI agent MUST read:

1. AGENTS.md
2. architecture.md
3. build-plan.md
4. code-structure.md
5. library-docs.md
6. ui-rules.md
7. ui-tokens.md
8. project-overview.md
9. progress-tracker.md

These documents override assumptions.

Never ignore them.

---

# Development Philosophy

Every feature should satisfy five goals.

1. Correct

The feature works.

2. Readable

The code is understandable.

3. Maintainable

Future developers can modify it.

4. Scalable

The feature will not need rewriting when the application grows.

5. Testable

Business logic should be isolated enough to be tested.

---

# Golden Rules

Never hardcode colors.

Never hardcode spacing.

Never hardcode API URLs.

Never duplicate business logic.

Never create circular dependencies.

Never mix UI with business logic.

Never bypass repositories.

Never bypass validation.

Never commit secrets.

Never ignore accessibility.

Never sacrifice readability for fewer lines of code.

---

# Build Workflow

Every feature follows exactly this order.

Step 1

Understand the feature.

Step 2

Read architecture.

Step 3

Read UI rules.

Step 4

Read build plan.

Step 5

Create required folders.

Step 6

Implement UI.

Step 7

Implement validation.

Step 8

Implement repositories.

Step 9

Implement services.

Step 10

Implement API.

Step 11

Implement realtime behavior if needed.

Step 12

Implement loading state.

Step 13

Implement error state.

Step 14

Implement empty state.

Step 15

Implement accessibility.

Step 16

Optimize performance.

Step 17

Review code.

Step 18

Update documentation.

Step 19

Update progress tracker.

Only after all steps are complete may the feature be considered finished.

---

# Definition of Done

A feature is NOT complete until all of the following are true.

✓ UI completed

✓ Responsive

✓ Keyboard accessible

✓ Screen-reader friendly

✓ Validation added

✓ Error handling added

✓ Loading state added

✓ Empty state added

✓ Repository implemented

✓ Service implemented

✓ API implemented

✓ Logging added

✓ Types completed

✓ No TypeScript errors

✓ No ESLint errors

✓ Documentation updated

✓ Progress tracker updated

✓ UI registry updated

---

# Phase 3 Objective

Phase 3 does NOT introduce major product features.

Instead it upgrades every existing feature to production quality.

Areas of focus

• Accessibility
• UX
• Performance
• Security
• Reliability
• Error Handling
• Observability
• Code Quality

All Phase 3 work should improve existing functionality instead of expanding the product surface.

---

# Coding Standards

The project follows strict engineering standards.

Every pull request, feature implementation, bug fix, or refactor must satisfy these rules.

---

## General Principles

Write code for humans first.

Optimize readability before cleverness.

Avoid unnecessary abstractions.

Avoid premature optimization.

Favor explicit code over implicit behavior.

Every function should have one responsibility.

Every component should have one responsibility.

Every file should have one clear purpose.

---

## TypeScript Rules

Always use strict mode.

Never use:

- any
- unknown (unless absolutely required)
- ts-ignore
- ts-expect-error

Prefer

interfaces

for objects.

Use

type

for unions.

Never duplicate interfaces.

Keep interfaces close to their feature unless shared globally.

---

## Naming Convention

### Components

PascalCase

Example

```
WorkspaceCard.tsx
```

---

### Hooks

camelCase beginning with use

```
useWorkspace.ts
```

---

### Services

camelCase

```
workspace.service.ts
```

---

### Repository

```
workspace.repository.ts
```

---

### API Routes

Use nouns.

Good

```
/api/workspaces
/api/projects
/api/documents
```

Bad

```
/api/getProjects
/api/createProject
```

---

### Database Tables

snake_case

Example

```
users

workspaces

workspace_members

documents

document_versions
```

---

### Variables

camelCase

Bad

```
const Data = ...
```

Good

```
const workspaceMembers = ...
```

---

## File Size Rules

Component

Maximum

300 lines

Preferred

150–200

---

Hook

Maximum

200 lines

---

Service

Maximum

250 lines

---

Repository

Maximum

250 lines

---

Page

Maximum

250 lines

---

If a file becomes too large,

split it.

Never create 1000-line React components.

---

# Folder Ownership

Every folder owns one concern.

Example

```
features/
    workspace/

        components/

        hooks/

        api/

        services/

        repository/

        validators/

        types/
```

Everything related to Workspace belongs there.

Never scatter feature code across the repository.

---

# Component Rules

Components must be

Reusable

Composable

Accessible

Responsive

Small

Never fetch data inside presentational components.

Never put business logic inside UI.

Container components coordinate.

Presentation components render.

---

# State Management

Use local state whenever possible.

Do not use global state unless necessary.

Priority

1 React State

↓

2 Context

↓

3 Zustand

↓

4 Server State

↓

TanStack Query

Never place server data inside Zustand.

---

# API Rules

Every endpoint must

Validate input

Authenticate user

Authorize action

Handle errors

Log failures

Return typed response

Never trust client data.

---

# Validation

Validation occurs in three places.

Client

↓

API

↓

Database

Validation should never exist in only one layer.

---

# Error Handling

Never expose raw errors.

Instead

```
Unable to save workspace.

Please try again.
```

Log detailed errors internally.

Show friendly messages externally.

---

# Logging

Every important action should be logged.

Examples

Workspace created

Document updated

Member invited

AI request completed

Notification delivered

Queue processed

Log format

Timestamp

User

Action

Duration

Status

---

# Repository Pattern

Repositories ONLY communicate with PostgreSQL.

Repositories never

call APIs

contain business logic

perform validation

Business logic belongs inside Services.

---

# Service Layer

Services contain

business rules

permission checks

workflow

AI orchestration

queue creation

notification dispatching

Services never

render UI

perform SQL

know about React

---

# Security Rules

Never trust request body.

Always validate.

Always sanitize.

Always escape.

Never expose stack traces.

Never expose SQL.

Never expose secrets.

Passwords

bcrypt only.

JWT

Short expiration.

Refresh tokens stored securely.

Cookies

HTTP Only

Secure

SameSite

Rate limit

Authentication

AI routes

Public APIs

Webhook endpoints

---

# Accessibility (WCAG)

Every feature must be usable

without a mouse.

Requirements

Keyboard navigation

Logical tab order

Visible focus states

Proper labels

ARIA where necessary

Semantic HTML

Screen reader support

Skip navigation link

Reduced motion support

High contrast compatibility

Every form input

must have

label

description if needed

error message

Never rely only on color.

Icons require accessible labels.

```

---

This completes **Part 2** of `AGENTS.md`.

The next part will cover:

- Performance standards
- Reliability
- Observability
- UX standards
- Documentation workflow
- AI coding workflow
- Code review checklist
- Definition of Ready
- Definition of Done (expanded)
- Context file update rules
- `.agent` workflow
- Git conventions
- Phase 3 completion criteria

---

# Performance Standards

Performance is a feature.

Every feature must be built with performance in mind from day one.

Never postpone performance improvements that can be implemented naturally during development.

---

## Rendering

Prefer Server Components whenever possible.

Use Client Components only when interaction requires it.

Never make an entire page a Client Component because a single button needs JavaScript.

Move interactivity to the smallest possible component.

---

## React Best Practices

Avoid unnecessary re-renders.

Use

- memo()
- useMemo()
- useCallback()

only when profiling shows a benefit.

Do not overuse memoization.

Measure first.

Optimize second.

---

## Data Fetching

Use Server Components for initial data.

Use streaming whenever appropriate.

Avoid waterfall requests.

Always fetch independent resources in parallel.

Bad

```
await getWorkspace()

await getProjects()

await getMembers()
```

Good

```
await Promise.all([
    getWorkspace(),
    getProjects(),
    getMembers()
])
```

---

## Bundle Size

Keep JavaScript bundles small.

Use

dynamic()

for

Heavy editors

Charts

Large dialogs

Rich text editor

Markdown preview

Analytics

Never load these on the initial page if unnecessary.

---

## Images

Always use

next/image

Use

lazy loading

responsive sizes

modern formats

Never upload oversized assets.

---

## Lists

Large lists must support

Pagination

Infinite scrolling

Virtualization

Never render thousands of DOM nodes.

---

## Forms

Debounce expensive validation.

Prevent duplicate submissions.

Disable submit buttons during requests.

---

# Reliability

The application must continue functioning under failure.

Every feature should fail gracefully.

---

## Retry Strategy

Retry transient failures.

Examples

Database timeout

Network interruption

Redis unavailable

Never retry

Validation errors

Authentication failures

Permission failures

---

## Idempotency

Endpoints that may be retried must be idempotent.

Examples

Payment webhook

Invitation acceptance

Email sending

Document synchronization

---

## Queue Jobs

Background jobs must

Retry

Log failures

Record attempts

Move permanently failed jobs to Dead Letter Queue.

---

## Graceful Degradation

If AI becomes unavailable

The application should continue functioning.

If Redis fails

Core functionality should continue.

If notifications fail

Primary workflow should still succeed.

---

# Observability

Every production application requires visibility.

---

## Logging

Structured logs only.

Every log includes

Timestamp

Request ID

User ID

Workspace ID

Action

Duration

Status

Severity

---

## Metrics

Track

Request duration

Database duration

Queue duration

AI latency

Cache hit rate

API errors

Authentication failures

Realtime connection count

Document synchronization latency

---

## Monitoring

Monitor

CPU

Memory

Database

Redis

Queue

Socket connections

Worker health

API response time

---

## Health Checks

Provide

/health

/checks/database

/checks/redis

/checks/queue

/checks/socket

Health endpoints should not require authentication.

---

## Error Tracking

Every production error should include

Request ID

Stack trace

Environment

Feature

User (if authenticated)

Browser

Device

OS

Never expose these details to the user.

---

# User Experience Standards

Good UX is invisible.

Users should never wonder

"What is happening?"

The interface should always communicate state.

---

## Loading

Every async action requires

Loading state

Skeleton

Spinner

Progress

Never leave blank screens.

---

## Empty States

Every empty page requires

Helpful message

Illustration or icon

Primary action

Explanation

---

## Error States

Every error should

Explain what happened

Explain what can be done

Offer retry

Remain friendly

---

## Success Feedback

Every successful action should provide feedback.

Examples

Toast

Inline success message

Animation

Status badge

---

## Optimistic UI

Whenever appropriate

Update the UI immediately.

Rollback on failure.

---

## Keyboard Shortcuts

Support shortcuts for productivity.

Examples

Ctrl + K

Global search

Ctrl + /

Shortcut reference

Ctrl + S

Save

Esc

Close dialog

---

## Motion

Animations should

Communicate

Guide attention

Improve understanding

Never distract.

---

# Security Standards

Security is never optional.

---

Validate

Everything.

Escape

Everything.

Sanitize

Everything.

Authorize

Everything.

---

Never trust

Headers

Cookies

Body

Query

Params

Uploaded files

---

Use

Rate limiting

CSRF protection

Secure headers

Content Security Policy

Input sanitization

Parameterized SQL

Secure cookies

Short-lived access tokens

Refresh token rotation

Audit logging

---

# Documentation Rules

Documentation is code.

Whenever code changes,

documentation must also change.

Always update

progress-tracker.md

ui-registry.md

architecture.md

when applicable.

Never allow documentation to become stale.

---

# AI Agent Workflow

Every implementation follows this sequence.

Read documentation

↓

Understand architecture

↓

Review existing implementation

↓

Plan changes

↓

Implement

↓

Test

↓

Review

↓

Refactor

↓

Update documentation

↓

Update progress tracker

↓

Mark feature complete

Never skip documentation updates.

---

# Code Review Checklist

Before considering work complete,

verify

✓ Naming is consistent

✓ Types are complete

✓ No duplicated logic

✓ No dead code

✓ Accessible

✓ Responsive

✓ Error handling exists

✓ Loading exists

✓ Empty state exists

✓ Logging exists

✓ Performance reviewed

✓ Documentation updated

✓ No ESLint errors

✓ No TypeScript errors

✓ No console.log()

✓ No TODO left behind

---

# Context File Maintenance

The following files must remain synchronized.

architecture.md

build-plan.md

code-structure.md

library-docs.md

project-overview.md

ui-rules.md

ui-tokens.md

ui-registry.md

progress-tracker.md

AGENTS.md

If one changes,

review the others for consistency.

---

# Phase 3 Success Criteria

Phase 3 is complete when

✓ Every existing feature is accessible.

✓ Every page is fully responsive.

✓ Every async interaction has proper loading, success, and error states.

✓ Performance has been profiled and optimized.

✓ Security best practices are implemented.

✓ Logging and monitoring are integrated.

✓ Documentation accurately reflects the implementation.

✓ Codebase follows clean architecture consistently.

At the end of Phase 3, the application should not just work—it should demonstrate the engineering practices expected of a production-grade SaaS platform.

---
END OF AGENTS.md
