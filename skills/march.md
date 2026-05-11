# Skill: march

> **Outer orchestrator.** This skill is a dispatcher — it reads
> project state and delegates to one of the three shipping skills:
> `ship-a-phase`, `ship-data`, `iterate`. Designed for `/loop`.

## 1. Purpose

`/loop /march` is the autonomous-beast mode. It picks the
right-thing-to-do every tick:

```
unlabeled issues exist          →  /triage
ELSE critique due (rate-lim)    →  /critique
ELSE pending phase              →  /ship-a-phase
ELSE pending data               →  /ship-data
ELSE content queue ≥ 3.0        →  /ship-content
ELSE expand due + bold posture  →  /expand
ELSE                            →  /iterate
```

Deliveries first: pending phases / data ship before `/expand`
ever fires. `/expand` only runs when there's no immediate
delivery, OR when its rate-limit window opens (every ~20
commits or ~48h) AND `bearings.md` posture is **bold** (thock's
default — see `plan/bearings.md` "Plan expansion posture").

This means: an overnight run can take thock from "scaffolded"
to "shipped, populated, iteratively polished, critiqued,
addressed, inbox-zero on issues, and growing its own plan when
reality outpaces the original spec" without a mode switch from
the user.

The triage check is **cheap when idle** — one API call. The
critique check is rate-limited (≥12 commits + ≥24h spacing,
green-deploy-only). The expand check is rate-limited +
posture-gated (≥20 commits + ≥48h, posture ≠ strict).

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

### Step 1 — Triage gate (cheapest check)

Load `GH_TOKEN` from `.env` and count unlabeled open issues:

```bash
export GH_TOKEN=$(awk -F= '/^GH_TOKEN=/ {sub(/^GH_TOKEN=/, ""); print; exit}' .env)
export GH_REPO=$(awk -F= '/^GH_REPO=/ {sub(/^GH_REPO=/, ""); print; exit}' .env)
GH_REPO=${GH_REPO:-daretodave/thock}

unlabeled=$(gh issue list --repo "$GH_REPO" --state open \
  --search "-label:triage:loop-queued -label:triage:needs-user -label:triage:closed -label:triage:reviewed -label:loop:opened" \
  --json number --jq 'length')
```

If `unlabeled > 0`:

- Read `skills/triage.md`.
- Execute its procedure (§5) end-to-end.
- Return.

If `unlabeled == 0`, fall through to Step 2.

If `gh` isn't installed or `GH_TOKEN` missing, **don't fail the
march** — log a warning ("triage skipped: gh/token unavailable")
and fall through. Triage is non-blocking by design; the loop
continues.

### Step 2 — Critique gate (pre-dispatch check)

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

If any condition fails, fall through to Step 3.

### Step 3 — Dispatch

Read state in this order; first match wins.

#### 3a. Pending phase?

Open `plan/steps/01_build_plan.md`. If any `[ ]` row exists in
the "Status (at-a-glance)" block:

- Read `skills/ship-a-phase.md`.
- Execute its procedure (§6 of that file) end-to-end.
- Return.

#### 3b. Pending data?

Open `data/BACKLOG.md`. If any `[ ]` row exists:

- Read `skills/ship-data.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

#### 3b.5. Content queue? (post-phase-24)

Open `plan/AUDIT.md`. Collect all `Pending` content-gap findings
(rows with `category: content-gaps`, not prefixed `[x]`). Apply
the bias multiplier from the AUDIT.md header if present. If any
row scores ≥ 3.0:

- Read `skills/ship-content.md`.
- Execute its procedure end-to-end.
- Return.

This lane fires before `/expand` and before the general `/iterate`
pass, so content velocity is never deprioritized in favour of
expansion planning when the quota is unmet.

#### 3c. Expand due (rate-limited, posture-gated)?

Read `plan/bearings.md` "Plan expansion posture" section. thock
defaults to **bold**.

- If posture is **strict**, skip to 3d.

Read metadata header at top of `plan/PHASE_CANDIDATES.md`:

```
> Last pass: <ISO-date> at commit <sha>
> Pass count: <N>
```

Dispatch to `/expand` if **all four** hold:

1. Posture is **bold** or **autonomous** (not strict).
2. Current commit is at least **20 commits after** `Last pass`,
   OR `Last pass` is more than **48 hours ago**, OR `Last pass`
   is "never" and at least **3 phases have shipped**.
3. There's at least one signal worth examining: `plan/AUDIT.md`
   has Pending rows, OR `plan/CRITIQUE.md` has Pending rows,
   OR `git log -p --since="<last pass>" -- spec.md design/`
   shows changes, OR `data/` has substantial growth since the
   plan was authored.
4. No phase or data work is pending (Steps 3a/3b would have
   matched first if there were).

If all four hold:

- Read `skills/expand.md`.
- Execute its procedure end-to-end.
- Return.

If any condition fails, fall through to 3d.

#### 3d. Else — iterate.

- Read `skills/iterate.md`.
- Execute its procedure (§5 of that file) end-to-end.
- Return.

(Note: when `/iterate`'s audit finds no actionable findings
scoring ≥ 3.0 AND posture is bold, iterate dispatches to
`/expand` itself rather than stopping. See `skills/iterate.md`
§6 failure mode 6.)

### Step 4 — Done

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
plan/CRITIQUE.md                     # critique queue + last-pass metadata
plan/AUDIT.md                        # content-gap queue (Step 3b.5)

# External signals
gh issue list --repo $GH_REPO --search "-label:triage:..." --json number  # unlabeled count
pnpm deploy:check                    # green-deploy condition for /critique

# Skills it dispatches into
skills/triage.md                     # Step 1 (cheapest)
skills/critique.md                   # Step 2 (rate-limited)
skills/ship-a-phase.md               # Step 3a
skills/ship-data.md                  # Step 3b
skills/ship-content.md               # Step 3b.5 (content queue)
skills/expand.md                     # Step 3c
skills/iterate.md                    # Step 3d
```
