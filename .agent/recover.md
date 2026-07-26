---

name: recover
description: When something goes wrong during a build, diagnose what type of failure it is before deciding how to respond. Use the project docs, phase scope, and current code state to choose targeted fix, clean reset, or rethink.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Not every problem is a bug. Not every bug needs debugging.

When something goes wrong with AI-assisted development, the instinct is to keep prompting — describe the problem, ask for a fix, get another broken version, describe that problem, ask for another fix. The session gets longer. The context gets polluted. The code gets worse.

The problem is not always the code. The problem is often not knowing what type of failure you are dealing with.

This skill diagnoses the failure first. Then it prescribes the right response. Those are two separate steps and they cannot be swapped.

---

## Step 1 — Describe What Went Wrong

The developer describes the problem. The skill listens before doing anything else.

Ask:

```text id="q1w2e3"
Describe what is wrong. Be specific:
- What did you expect to happen?
- What happened instead?
- How many times have you tried to fix it already?
```

Read the answer carefully. The number of fix attempts is important — it tells you whether this is a fresh problem or a session that has already gone wrong.

For this project, also check whether the issue is happening in:

* the **Phase 1 UI**
* the **backend API**
* the **realtime layer**
* the **AI assistant flow**
* the **project initialization / `/src` setup**
* the **docs or agent instructions**

---

## Step 2 — Identify the Failure Mode

Based on the description, determine which of three failure modes this is.

### Failure Mode 1 — A specific thing is broken

**Signs:**

* The problem is isolated — one component, one function, one route, one editor interaction, or one API response
* The rest of the project works correctly
* This is the first or second attempt at fixing it
* The error message or wrong behavior is clear and specific

**What it means:**
This is a normal bug. It has a root cause that can be found and fixed precisely.

**Response:** Targeted fix — go to Step 3A.

---

### Failure Mode 2 — The session has gone wrong

**Signs:**

* Multiple fix attempts have made things worse or created new problems
* The code has become tangled — fixes are patching fixes
* Context in this session is full of failed attempts
* It is no longer clear what the original problem was

**What it means:**
The session is polluted. More prompting will not help — it will compound the damage. The feature needs to be rebuilt in a clean context, not patched further.

**Response:** Hard reset — go to Step 3B.

---

### Failure Mode 3 — The foundation is wrong

**Signs:**

* The code runs but produces fundamentally wrong behavior
* The agent has been confidently building something that misunderstands a core requirement, library API, project rule, or architectural pattern
* The problem is not a bug in the implementation — the implementation itself is wrong
* Fixing individual pieces will not help because the approach is incorrect
* The implementation does not match the project docs, especially:

  * `architecture.md`
  * `build-plan.md`
  * `code-structure.md`
  * `ui-rules.md`
  * `ui-tokens.md`
  * `AGENTS.md`

**What it means:**
This is not a debugging problem. The approach needs to be reconsidered before any more code is written. More implementation in the wrong direction makes things harder to untangle.

**Response:** Rethink — go to Step 3C.

Tell the developer which failure mode this is before proceeding:

```text id="m4n5b6"
This looks like Failure Mode [1/2/3] — [name].

[One sentence explaining why you identified it this way.]

Here is how we handle this:
```

---

## Step 3A — Targeted Fix

For Failure Mode 1.

### Diagnose before touching code

Ask the developer to share:

* The exact error message or wrong behavior
* The specific file or function where it happens
* What the code is supposed to do versus what it actually does
* Whether this is UI-only, backend-only, realtime-only, AI-only, or cross-layer

For this project, inspect only the relevant surface:

* a single component or page in `src/app`
* a specific reusable component in `src/components`
* a helper in `src/lib`
* a single API route or server action
* a single realtime handler
* a single AI flow
* or the relevant docs file if the issue is architectural

Do **not** read the whole codebase unless the issue clearly spans multiple layers.

### Find the root cause

Identify the root cause before suggesting any fix. A root cause is the actual reason the problem exists — not a symptom of it.

State the root cause clearly:

```text id="r1t2y3"
Root cause: [specific explanation of why this is happening]

This is different from the symptom because: [explanation]
```

### Suggest a precise fix

Describe the fix that addresses the root cause. Not a workaround. Not a patch on top of broken code.

```text id="u7i8o9"
Fix: [what needs to change and why]

This will resolve the root cause because: [explanation]
```

If the issue is UI-related, the fix must also respect:

* `ui-tokens.md`
* `ui-rules.md`
* `ui-registry.md`

If the issue is architecture-related, the fix must also respect:

* `architecture.md`
* `code-structure.md`
* `build-plan.md`

Wait for the developer to confirm before making any changes.

### If the fix does not work

If the suggested fix does not resolve the problem — stop. Do not suggest another fix immediately.

Re-examine the root cause diagnosis. If the fix did not work, the root cause was probably wrong. Diagnose again from the beginning before trying again.

If two root cause diagnoses have both been wrong — this may actually be Failure Mode 2 or 3. Re-evaluate.

---

## Step 3B — Hard Reset

For Failure Mode 2.

### Acknowledge the situation honestly

```text id="p0a9s8"
This session has gone too far in the wrong direction
to recover by patching. The right move is a clean start.

This is not a failure — it is the correct response
to a polluted context. A fresh session with clear intent
will be faster than continuing here.
```

### Save what is worth keeping

Before the session ends, extract anything valuable from the current state:

* What was the original feature supposed to do?
* What parts of the current implementation, if any, are actually correct?
* What has been learned about what does not work?
* What should the next session avoid?
* Which project docs are still reliable?
* Which files should be preserved and which should be discarded?

Write this as a brief reset note:

```text id="h4j5k6"
## Reset Note — [Feature Name]

### What we were building
[Original feature description]

### What went wrong
[Honest summary of how the session went off track]

### What to avoid next time
[Specific approaches or patterns that did not work]

### Starting point for next session
[Where to begin fresh — what to keep, what to discard]
```

### Instruct the developer

```text id="l7z8x9"
Next steps:

1. Save this reset note somewhere accessible
2. End this session completely
3. Start a fresh session
4. Begin from the project docs again:
   - `AGENTS.md`
   - `project-overview.md`
   - `architecture.md`
   - `build-plan.md`
   - `ui-rules.md`
   - `ui-tokens.md`
5. Rebuild [feature name] from the clean starting point

Do not continue in this session.
```

---

## Step 3C — Rethink

For Failure Mode 3.

### Name the wrong assumption

The foundation being wrong means something was assumed that should not have been. Find it.

```text id="c2v3b4"
The core issue is not a bug — it is a wrong assumption:

Assumed: [what was assumed]
Reality: [what is actually true]

This means the current implementation cannot be fixed
by patching. The approach needs to change.
```

### Propose the correct approach

Based on the correct understanding, describe what the approach should have been:

```text id="n9m0q1"
Correct approach: [description]

Key difference from current approach: [explanation]

What needs to be discarded: [what cannot be salvaged]
What can be kept: [what is still valid]
```

For this project, the rethink should check whether the current implementation conflicts with:

* the Phase 1 scope
* the `/src/app` project structure
* the dark premium UI system
* the single-repo plan
* the real-time collaboration architecture
* the AI assistant workflow
* the documented build order

### Do not start rebuilding immediately

A rethink needs the developer to understand and agree before any code changes. Present the analysis and wait for confirmation.

```text id="z5x6c7"
Does this diagnosis match your understanding?

If yes — we can start fresh with the correct approach.
If no — tell me what I am getting wrong.
```

Only after the developer confirms does any rebuilding begin.

---

## The Principle

The worst thing you can do when something is broken is keep doing the same thing faster.

Diagnose first. Respond correctly. Different failures need different responses — and knowing which failure you are dealing with is more than half the solution.

For this project, always prefer the response that best preserves:

* Phase 1 scope
* clean architecture
* design-token consistency
* reusable component structure
* realtime and AI boundaries
* the documented project plan
