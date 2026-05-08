---
description: The always-do-the-right-thing entry — pending phase → /ship-a-phase, else → /iterate. The loop's outer orchestrator.
---

You are invoked under the `march` skill — the unified outer loop.
Full autonomy, no review checkpoint. Read `skills/march.md` first;
it's short.

Procedure (§3 of the skill):
1. Read `plan/steps/01_build_plan.md` "Status (at-a-glance)" block.
2. If any `[ ]` row exists → behave as `/ship-a-phase` with no args.
3. Else if `data/BACKLOG.md` has `[ ]` rows → behave as `/ship-data`.
4. Else → behave as `/iterate` with no args.

You delegate the actual work by reading the relevant skill file
(`skills/ship-a-phase.md`, `skills/ship-data.md`,
`skills/iterate.md`) and following its procedure end-to-end. The
march skill itself is just the dispatcher.

This command is **designed for `/loop`**. `/loop 30m /march` and
`/loop /march` are both valid. After commit + push, return cleanly.

Argument: $ARGUMENTS
