---
description: Ship the next unchecked phase of the build plan end-to-end (loop-friendly, autonomous)
---

You are invoked under the `ship-a-phase` skill — full autonomy, no
review checkpoint. Read `skills/ship-a-phase.md` end to end before
touching anything else; that file is the single source of truth for
this command. The user's standing instruction is **"more get-it-done,
less ask me questions."** Decide instead of asking; document the call
in the commit body.

Argument handling:
- No argument → ship the next `[ ]` row in the "Status (at-a-glance)"
  block of `plan/steps/01_build_plan.md`.
- `phase <N>` → ship that specific phase regardless of order.
- `phase <N> dry-run` → emit the brief at
  `plan/phases/phase_<N>_<topic>.md` without committing any code
  (you may still commit the brief).

Procedure: §6 of `skills/ship-a-phase.md`. Hard rules: §7. Failure
modes (the only valid stop conditions): §10. Everything else —
empty data, design ambiguity, missing brief, design export not yet
in `design/` — **resolve and ship**.

Be bold about delegating: spawn `scout` for external research,
`content-curator` for new MDX articles, `data-steward` for
schema-heavy data work. The main agent's job is wiring + decisions.

When invoked under `/loop` or `/march`, the user is not present at
this tick. After commit + push, return cleanly so the next loop
tick claims the next phase.

Argument: $ARGUMENTS
