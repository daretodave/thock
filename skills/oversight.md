# Skill: oversight

> **The user-in-the-loop command.** Pause autonomy. Brief the
> user on current state. Ask targeted questions. Adjust the plan.
> Push the adjustments. Return.
>
> Every other skill in this repo is autonomous; they decide and
> ship without consulting the user. **`oversight` is the
> exception.** It exists because the user sometimes walks away
> from the loop, comes back, and needs to course-correct: drop a
> stuck phase, reorder priorities, prune the audit, refresh a
> brief in light of a new design export.

## 1. Purpose

When the user types `/oversight`, three things happen:

1. **Synthesis.** The skill reads the same state files the loop
   reads — build plan, audit findings, data backlog, recent
   commits, deploy state — and produces a short briefing.
2. **Questionnaire.** Based on what the synthesis surfaced, the
   skill asks 1–4 targeted questions via `AskUserQuestion`. The
   questions are *computed* from observed state, not hardcoded.
3. **Adjustment.** The user's answers are applied as edits to
   plan files (`01_build_plan.md`, `phases/*.md`, `AUDIT.md`,
   `BACKLOG.md`). One commit captures the whole adjustment set.

After this, the user re-invokes `/march` (or `/loop /march`) and
the autonomous loop resumes against the corrected plan.

## 2. Invocation

```
/oversight                  # full audit + general questionnaire
/oversight phase            # bias toward phase progress / scope
/oversight content          # bias toward /iterate findings + content
/oversight deploy           # bias toward Netlify / CI/CD signal
/oversight reset            # bias toward scope reduction
```

Argument-less is the right default 90% of the time.

## 3. What `oversight` reads (the audit)

In this order (run as parallel tool calls where independent):

1. `git log --oneline -20` — recent shipping velocity. Are
   commits cohering? Are there 5 "fix:" commits in a row signaling
   a thrashing root cause?
2. `git status --short` — uncommitted changes. A previous tick
   that didn't finish? An interrupted edit?
3. `git rev-parse HEAD` + `pnpm deploy:check` — current deploy
   state. Has the loop been pushing into a red wall?
4. `plan/steps/01_build_plan.md` "Status (at-a-glance)" block —
   pending phases.
5. `plan/AUDIT.md` — open `/iterate` findings with scores.
6. `data/BACKLOG.md` — pending data work.
7. `data/AUDIT.md` — open data findings.
8. The last 3 phase briefs in `plan/phases/` — are they current
   given recent commits?
9. `design/` — has a new design export landed since the last
   sibling phase shipped?

## 4. The briefing

After the audit, print a synthesized briefing to the user. Tight,
factual, no editorializing. Format:

```
oversight — <ISO date>

shipping
- last commit: <sha> "<subject>" (<relative time>)
- phases shipped since last oversight: <list with hashes>
- velocity: ~<N> commits/hour over last 24h

state
- pending phases: <count>; next is phase <N> (<topic>)
- open audit findings: <count>; top score <X>: "<one-liner>"
- pending data backlog: <count>
- working tree: <clean | N modified | N untracked>
- last deploy: <state> (<sha>) — <admin URL or "ready">

flags
- <any unusual pattern: stuck phase, repeated fix commits,
  abandoned brief, divergent local/Netlify state, design export
  newer than last sibling commit, etc>
```

Limit briefing to ~25 lines. The user can drill into specifics if
they want; the briefing is a triage view.

## 5. The questionnaire

Generate 1–4 questions via `AskUserQuestion`. Rules:

- **Questions are computed**, not pre-canned. Pull from the
  briefing's `flags` section first; fall through to general
  course-correction questions only if no flags fired.
- **Each question targets a specific observable.** "Phase 7 has
  4 'fix:' commits — is the brief wrong, or is the root cause
  somewhere else?" beats "Anything to adjust?"
- **Multiple choice with a recommended option marked first**
  (`(recommended)` suffix). Provide 2–4 choices. The user can
  always pick "Other" for free-form.
- **The last question is free-form** ("Anything else to adjust?")
  iff there's room (≤3 prior questions).
- **Don't ask things the audit can resolve.** If the build plan
  shows a `[needs-user-call]` row, ask about that. Don't ask
  "should I keep going" — just keep going by default.

### Question templates (use as starting points; mutate to match state)

**Stuck phase**

> Phase <N> has been pending across <K> ticks; last <L> commits
> were "fix:" against it. What now?
>
> - (recommended) Refresh the brief — design or scope drifted.
> - Abandon — mark `[skipped]` in the build plan, move on.
> - Continue — the brief is right, the work is just hard.

**Audit overload**

> `plan/AUDIT.md` has <N> open findings; top 3 are <category>.
> Bias the next ticks?
>
> - (recommended) Yes — set focus to <category>.
> - No — keep balanced; let `/iterate` pick.
> - Prune — drop the bottom <M> findings entirely.

**Brief out of date**

> `design/<family>/` was added <K> commits ago, after phase <N>
> shipped. Refresh phase <N>'s brief and ship a follow-up?
>
> - (recommended) Yes — `/plan-a-phase phase <N>` then add a
>   follow-up phase to ship the design.
> - No — note in `AUDIT.md` and let `/iterate` catch it.
> - Defer — keep the design unintegrated for now.

**Deploy stuck red**

> The last <K> deploys failed with the same error: "<msg>". The
> loop will keep retrying until the failure mode trips. What do
> you want to do?
>
> - (recommended) Investigate — open the latest deploy log; I'll
>   diagnose and propose a patch (no commit yet).
> - Roll back — revert to <last-green-sha> and re-ship the
>   intermediate commits one at a time.
> - Continue — the next ship-a-phase will reach the right code.

**Uncommitted changes**

> The working tree has <N> modified, <M> untracked from a tick
> that didn't finish (last verb: <ship-a-phase | ship-data |
> iterate>).
>
> - (recommended) Inspect — show me the diff; I'll decide.
> - Roll forward — finish the tick.
> - Roll back — `git checkout` and `git clean`; restart cleanly.

**Free-form**

> Anything else to adjust before I hand back to `/march`?
>
> (Use the "Other" field for free text.)

## 6. The procedure

### Step 0 — Sync

```bash
git pull --ff-only
```

If divergence, stop per §9.

### Step 1 — Audit

Run §3. Read every file in parallel where possible.

### Step 2 — Brief

Print the synthesis per §4. **No questions yet.** This is
informative.

### Step 3 — Build the questionnaire

Compute 1–4 questions per §5. If zero questions are warranted —
the project is healthy, no flags, nothing to adjust — say so and
exit at Step 7 with no commit.

### Step 4 — Ask

Invoke `AskUserQuestion` with the computed questions.

### Step 5 — Apply

For each answer:

- **"Refresh brief"** → spawn `/plan-a-phase phase <N>` flow
  (read `skills/plan-a-phase.md` §5, generate the brief, commit
  separately).
- **"Abandon phase"** → flip the `[ ]` row to `[skipped]` in
  `01_build_plan.md` with a comment `(skipped via oversight
  <date> — <reason>)`. Subsequent shipping skills skip
  `[skipped]` rows.
- **"Bias toward category X"** → write a note at the top of
  `plan/AUDIT.md` saying `> Bias: <category> (set via oversight
  <date>)`. The `/iterate` skill reads this and weights its
  scoring accordingly (this is a NEW contract — extend
  `skills/iterate.md` §4 if not already present).
- **"Prune findings"** → delete the bottom-N rows from
  `AUDIT.md`. (Findings are append-able; pruning is fine when
  user-directed.)
- **"Roll back"** → DO NOT run destructive git ops without
  explicit confirmation. Print the proposed `git revert` /
  `git checkout` plan to the user as a follow-up Step 4
  question; only execute on explicit go.
- **"Investigate deploy"** → fetch the latest deploy log via
  `node scripts/deploy-check.mjs` (which already prints log
  pointers) or via `gh api` if available. Summarize the failure;
  do not patch yet — that's a separate `/ship-a-phase` invocation
  the user can run with full context.
- **"Other" (free-form)** → interpret the user's answer
  conservatively. If it's a clear plan edit, apply it. If it's
  ambiguous, write a note to `plan/AUDIT.md` as a
  `[needs-user-call]` row and tell the user.

### Step 6 — Commit + push

```bash
git add <files modified by adjustments>
git commit -m "$(cat <<'EOF'
oversight: <one-line summary of adjustments>

- <bullet per adjustment>
- <bullet per adjustment>

User answers:
- Q: <question> → <answer>
EOF
)"
git push origin main
```

Subject is always `oversight: <one-line>`. Body lists every
adjustment + the literal Q&A so the audit trail is preserved.

If the only adjustment is "everything looks good" with no actual
file edits, **do not create an empty commit**. Print "no
adjustments — handing back to the loop" and exit.

### Step 7 — Confirm deploy

```bash
pnpm deploy:check
```

Same as every shipping skill. Plan-only commits still trigger a
Netlify rebuild (Netlify rebuilds on every push, regardless of
content). A red deploy after an `oversight:` commit is suspect —
the user just made a deliberate choice; if it caused regression,
surface clearly.

If oversight made no commit (Step 6 exited early), skip this step.

### Step 8 — Done

Print a 2–3 line summary:

```
oversight complete. <N> adjustments applied.
- ready to resume: /march (or /loop /march)
- next pending phase: <N> (<topic>)
```

## 7. Hard rules

1. **Never edit code in `apps/` or `packages/`.** Plan
   adjustments only. Code edits go through `/ship-a-phase` or
   `/iterate` after the adjustment ships.
2. **Don't run destructive git ops without explicit user
   confirmation.** `git revert`, `git reset --hard`,
   `git clean -fd` all require a follow-up "yes please" question
   before executing.
3. **Single commit captures the adjustment set** (subject
   `oversight: …`). The Q&A lives in the body.
4. **Don't loop the questionnaire.** Ask once per invocation.
   If a follow-up is needed, the user re-invokes `/oversight`.
5. **No emojis. No `Co-Authored-By:`.** Carry over.
6. **`AskUserQuestion` is allowed here and only here** among
   shipping skills. The autonomous skills must never use it.

## 8. When `oversight` is NOT the right tool

- **Mid-tick of `/ship-a-phase` etc.** Don't pre-empt yourself.
  If a shipping skill is running, let it finish (or hit its
  failure mode), then run `/oversight`.
- **For trivia.** "What's the next phase?" — read
  `01_build_plan.md` directly. `/oversight` is for *adjustments*,
  not *queries*.
- **As a way to ask the user permission** mid-loop. The
  autonomous contract says decide-and-ship; if you're tempted to
  use `oversight` to ask "is this OK?", you're using it wrong.
  Decide instead.

## 9. Failure modes

1. **Invoked under `/loop`.** This is a misconfiguration. Stop
   and tell the user — `oversight` requires interactive input
   that `/loop` can't provide.
2. **`git pull` divergence.**
3. **State files corrupted** (`01_build_plan.md` missing the
   status block, `AUDIT.md` malformed). Stop and report.
4. **The user picks "Other" with text the skill can't
   interpret** even conservatively. Write to `AUDIT.md` as a
   `[needs-user-call]` row, no other adjustment, exit.

## 10. Quick reference

```bash
# Read (parallel where possible)
git log --oneline -20
git status --short
plan/steps/01_build_plan.md
plan/AUDIT.md
data/BACKLOG.md
data/AUDIT.md
plan/phases/                       # last 3 modified
design/                            # for newer-than-sibling-commit check

# Tools allowed here (and only here among shipping skills)
AskUserQuestion

# Adjustment files
plan/steps/01_build_plan.md        # flip rows, mark [skipped]
plan/AUDIT.md                      # bias note, prune rows
data/BACKLOG.md                    # reorder, prune
plan/phases/phase_<N>_<topic>.md   # only via /plan-a-phase

# Commit
git commit -m "oversight: <one-line>"
git push origin main
pnpm deploy:check
```
