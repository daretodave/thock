# Skill: march

> **Outer orchestrator.** This skill is a dispatcher — it reads
> project state and delegates to one of the three shipping skills:
> `ship-a-phase`, `ship-data`, `iterate`. Designed for `/loop`.

## 1. Purpose

`/loop /march` is the autonomous-beast mode. It picks the
right-thing-to-do every tick:

```
critique due (rate-limited)  →  /critique
ELSE pending phase           →  /ship-a-phase
ELSE pending data            →  /ship-data
ELSE                         →  /iterate
```

This means: an overnight run can take thock from "scaffolded" to
"shipped, populated, iteratively polished, critiqued and
addressed" without a mode switch from the user.

The critique check is rate-limited (≥12 commits + ≥24h spacing,
green-deploy-only) so it complicates the loop without dominating
it — see §3 Step 1.

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

### Step 1 — Critique gate (pre-dispatch check)

Before dispatching to one of the three normal lanes, check whether
a `/critique` pass is due. Read the metadata header at the top of
`plan/CRITIQUE.md`:

```
> Last pass: <ISO-date> at commit <sha>
> Pass count: <N>
```

Dispatch to `/critique` instead of the normal flow if **all three**
hold:

1. The current commit is at least **12 commits after** the `Last
   pass` commit, OR `Last pass` is more than **24 hours ago**, OR
   `Last pass` is "never" and at least one page-family phase has
   shipped (phase 5+).
2. `pnpm deploy:check` shows a green deploy (no point critiquing a
   red site — the next tick will re-check).
3. The next normal dispatch lane (1a/1b/1c below) wouldn't already
   be addressing a `[HIGH]` critique finding — if `/iterate` is
   about to drain a `[HIGH]` Pending row, let it; don't pile up
   more before the existing high gets addressed.

If all three hold:

- Read `skills/critique.md`.
- Execute its procedure (§5) end-to-end.
- Return. (Next tick re-dispatches normally.)

If any condition fails, fall through to Step 2.

### Step 2 — Dispatch

Read state in this order; first match wins.

#### 2a. Pending phase?

Open `plan/steps/01_build_plan.md`. If any `[ ]` row exists in
the "Status (at-a-glance)" block:

- Read `skills/ship-a-phase.md`.
- Execute its procedure (§6 of that file) end-to-end.
- Return.

#### 2b. Pending data?

Open `data/BACKLOG.md`. If any `[ ]` row exists:

- Read `skills/ship-data.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

#### 2c. Else — iterate.

- Read `skills/iterate.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

### Step 3 — Done

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
