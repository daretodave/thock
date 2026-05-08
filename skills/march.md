# Skill: march

> **Outer orchestrator.** This skill is a dispatcher — it reads
> project state and delegates to one of the three shipping skills:
> `ship-a-phase`, `ship-data`, `iterate`. Designed for `/loop`.

## 1. Purpose

`/loop /march` is the autonomous-beast mode. It picks the
right-thing-to-do every tick:

```
ANY pending phase  →  /ship-a-phase
ELSE pending data  →  /ship-data
ELSE               →  /iterate
```

This means: an overnight run can take thock from "scaffolded" to
"shipped, populated, iteratively polished" without a mode switch
from the user.

## 2. Invocation

```
/march                       # one tick: dispatch + execute
/loop 30m /march             # autonomous loop
/loop /march                 # self-paced autonomous loop
```

## 3. Procedure

### Step 0 — Sync

```bash
git pull --ff-only
```

If divergence, stop per §5.

### Step 1 — Dispatch

Read state in this order; first match wins.

#### 1a. Pending phase?

Open `plan/steps/01_build_plan.md`. If any `[ ]` row exists in
the "Status (at-a-glance)" block:

- Read `skills/ship-a-phase.md`.
- Execute its procedure (§6 of that file) end-to-end.
- Return.

#### 1b. Pending data?

Open `data/BACKLOG.md`. If any `[ ]` row exists:

- Read `skills/ship-data.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

#### 1c. Else — iterate.

- Read `skills/iterate.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

### Step 2 — Done

Return cleanly. The loop's next tick re-dispatches.

## 4. Hand-off honesty

When you dispatch into a child skill, **fully adopt its contract**.
That means:

- Its hard rules (e.g. ship-a-phase §7, ship-data §8).
- Its failure modes (e.g. iterate §6).
- Its commit-message conventions.
- Its verify gate.

`/march` itself doesn't add rules; it inherits whichever skill it
dispatched into. The march tick succeeds iff the child tick
succeeds.

## 5. Failure modes

`/march` itself only fails on:

1. **`git pull` divergence.**
2. **State files (build plan, backlog) corrupted or missing.** This
   is an operational failure — stop and report; don't try to
   reconstruct silently.

Otherwise the failure modes are inherited from the dispatched skill.

## 6. Quick reference

```bash
# State files
plan/steps/01_build_plan.md          # pending phases
data/BACKLOG.md                      # pending data work

# Skills it dispatches into
skills/ship-a-phase.md
skills/ship-data.md
skills/iterate.md
```
