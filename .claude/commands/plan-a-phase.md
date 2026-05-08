---
description: Refine the next phase brief without shipping code — generate or update plan/phases/phase_<N>_<topic>.md so /ship-a-phase has zero ambiguity
---

You are invoked under the `plan-a-phase` skill. This is a thinking
pass, not a shipping pass. You write or update one phase brief and
commit it; you do **not** modify code in apps/ or packages/.

Read `skills/plan-a-phase.md` for the full procedure. Read
`plan/bearings.md` and `plan/steps/01_build_plan.md` first; they're
the source of truth for stack, URL contract, and phase scope.

Argument handling:
- No argument → plan the next `[ ]` phase. If a brief already exists
  for that phase, audit it against current state (designs landed?
  sibling phases shipped that change context?) and refine.
- `phase <N>` → plan that specific phase.

When you finish, commit the brief with subject `phases: brief for
phase <N> — <topic>`. Return cleanly. The user (or `/ship-a-phase`)
takes it from there.

If you discover the build plan itself needs new phases (e.g. design
revealed a surface no phase covers), append rows to the status block
in `plan/steps/01_build_plan.md` and commit that as a separate prior
commit with subject `plan: add phase <N> for <topic>`.

Argument: $ARGUMENTS
