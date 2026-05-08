# Skill: plan-a-phase

> **Thinking pass.** This skill writes one phase brief and commits
> it. It does **not** modify code in `apps/` or `packages/`. The
> output is `plan/phases/phase_<N>_<topic>.md` — agent-facing,
> opinionated, decisive — that `/ship-a-phase` reads next.

## 1. Purpose

`/ship-a-phase` works best when the brief is concrete. If the brief
is missing or stale, the shipping loop has to think and ship in the
same tick — fine, but slower. `/plan-a-phase` is the dedicated
thinking pass that keeps shipping cheap.

Use it when:
- A phase brief doesn't exist yet and design has landed for that
  surface (the loop will generate one but a careful pass beats a
  hot pass).
- A sibling phase shipped that changes context (e.g. phase 4
  established a sibling; phase 5's brief should now reference its
  patterns concretely).
- The user wants a refined brief before kicking off `/loop /ship-a-phase`.

## 2. Invocation

```
/plan-a-phase                # next [ ] phase
/plan-a-phase phase 5
```

## 3. Inputs (read in this order)

1. `plan/bearings.md` — stack, URL contract, standing decisions.
2. `plan/steps/01_build_plan.md` — phase scope row.
3. `plan/phases/phase_5_article.md` — canonical brief template.
4. `design/INDEX.md` — file → family map.
5. `design/decisions.jsx` — design's own brief; **wins over
   bearings on conflict**.
6. `design/page-<family>.jsx` — family-specific design (may be 0
   bytes; not blocking).
7. `design/atoms.jsx` / `primitives.jsx` / `tokens.css` — when
   the brief touches editorial atoms, charts, or tokens.
8. `apps/web/src/app/<sibling-family>/` — closest already-shipped
   sibling for code patterns.
9. `spec.md` — only if the brief touches a surface the bearings
   don't fully describe.

## 4. The brief format (`plan/phases/phase_<N>_<topic>.md`)

Mirrors §5 of `skills/ship-a-phase.md`. The structure is fixed:

- **Routes** — every URL this phase ships, locked from the URL
  contract.
- **Content / data reads** — table of helper → call → use.
- **Components** — list of new components in
  `apps/web/src/components/<family>/` plus existing primitives
  reused.
- **Cross-links** — In (verify) and Out (ship). Plus Retro-fit if
  the phase modifies a sibling.
- **SEO** — `generateMetadata` shape + JSON-LD type.
- **Hero / body / sub-section composition.**
- **Empty / loading / error states** — copy locked.
- **Decisions made upfront — DO NOT ASK** — every judgment call,
  resolved.
- **Mobile reflow.**
- **Pages × tests matrix.**
- **Verify gate.**
- **Commit body template.**
- **DoD.**
- **Follow-ups (out of scope).**

A brief that leaves Open Qs is a brief that fails its job. Resolve
every ambiguity. The user can override later via a separate edit
commit; the loop should never have to choose between two valid
implementations.

## 5. The procedure

### Step 0 — Sync + load

```bash
git pull --ff-only
```

Read all six inputs in §3.

### Step 1 — Pick the phase

If no argument, the next `[ ]` row in `01_build_plan.md`. Else the
phase number passed.

### Step 2 — Audit the existing brief (if any)

If `plan/phases/phase_<N>_<topic>.md` exists, read it and check:

- Are all design references current (does the design still match)?
- Have sibling-phase shipping commits introduced new primitives this
  brief should reference?
- Are the locked decisions still valid given new bearings entries?
- Are there Open Qs that need resolution?

If the existing brief is fully current, return cleanly with a one-line
"brief still current — no changes."

### Step 3 — Compose the new / refined brief

Walk the brief format (§4). For each section, derive content from
the inputs. Make decisions; document them under "Decisions made
upfront — DO NOT ASK".

Order of authority for Decisions:

1. `design/decisions.jsx` SETTLED list (highest authority — locked
   by the design pass).
2. `plan/bearings.md` "Decisions standing for the autonomous loop"
   (project-wide defaults).
3. Phase-specific calls you make to resolve remaining ambiguity.

If `decisions.jsx` and `bearings.md` disagree on a point, the
design wins — and update `bearings.md` in a separate prior commit
to keep the two coherent (`bearings: align with design/decisions.jsx`).

### Step 4 — Reality-check against `apps/web/`

Open the canonical sibling (`apps/web/src/app/article/`,
`apps/web/src/components/article/`, `apps/web/src/lib/article/`).
Confirm every primitive your brief references actually exists. If
something is missing, either:

- Add it to the phase scope (commit body becomes "ship X plus the
  missing primitive Y"), or
- Push it to a follow-up phase and note it under Follow-ups.

### Step 5 — Commit

```bash
git add plan/phases/phase_<N>_<topic>.md
git commit -m "$(cat <<'EOF'
phases: brief for phase <N> — <topic>

- Routes locked: <list>.
- N decisions resolved upfront (see brief).
- Design export: <yes / pending>.
EOF
)"
git push origin main
```

### Step 6 — Done

Return cleanly with a 2-line summary: "phase <N> brief committed —
<one-line summary>. ready for /ship-a-phase."

## 6. New phases (rare)

If during planning you discover the build plan is missing a phase
(design revealed a surface no current phase covers), you may add a
new row to `01_build_plan.md`. Rules:

- Append to the appropriate group (substrate / page families /
  cross-cutting), don't reorder existing numbers.
- Pick the next free phase number (e.g. if the last is 15, this is
  16).
- Commit `01_build_plan.md` first with subject `plan: add phase <N>
  for <topic>`, then write its brief in a separate commit.
- Note the rationale in the commit body — the user reviews these
  more carefully than the per-phase ones.

## 7. Hard rules

1. Never modify code in `apps/` or `packages/`. (Brief generation
   may add primitives to phase scope — but they ship via
   `/ship-a-phase`, not here.)
2. Never leave Open Qs in a generated brief.
3. No emojis, no `Co-Authored-By:`.
4. The URL contract in `bearings.md` is law — never propose URL
   shapes that contradict it.

## 8. Failure modes

1. **The phase scope row in `01_build_plan.md` is itself ambiguous.**
   This is a meta-failure — fix the row first via a separate
   `plan: clarify phase <N> scope` commit, then retry. If you can't
   clarify it without user input, stop and report.
2. **Design export contradicts the URL contract.** Surface this to
   the user; do not silently re-decide URL shape.
