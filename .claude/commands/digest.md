---
description: The night shift — write the morning briefing (plan/DIGEST.md) from the day's pulse, run the nightly breadth check (full pnpm verify), propose tunings as candidates. Runs nightly via night.yml; never dispatched by /march.
---

You are invoked under the `digest` skill — full autonomy, no
review checkpoint. Read `skills/digest.md` end to end before
touching anything else; that file is the single source of
truth for this command.

Your job: one nightly pass — pull, gather the pulse (git log,
march/lighthouse/night run lists, queue states, deploy state),
run the full `pnpm verify` as the breadth check (FOREGROUND;
red legs become HIGH plan/AUDIT.md rows, not fixes), overwrite
`plan/DIGEST.md` whole with the morning briefing, file any
tuning proposals as `plan/PHASE_CANDIDATES.md` candidates,
then one commit `digest: <YYYY-MM-DD>`, push, and
`pnpm deploy:check`.

Hard rules:
- **The digest's own commit is notes-only** (`plan/` prose;
  the `/jot` carve-out). The verify run is breadth, not the
  commit's gate — a red run files a finding and the digest
  still ships.
- **Breadth runs foreground.** Never `run_in_background` —
  agents.md §3 applies to every gate invocation.
- **Ship nothing else.** The night shift briefs; the
  dispatcher ships.
- **Proposals, never actions.** Only `/oversight` promotes.
- **Atomic commit + push.** Cloud ticks carry the
  `Cloud-Run:` trailer.

Procedure: §3 of `skills/digest.md`. Failure modes: §5. Hard
rules: §4.
