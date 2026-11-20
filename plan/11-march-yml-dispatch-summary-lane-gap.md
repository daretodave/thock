# 11 — Cloud prompt's dispatch-order summary omits the queue lanes

> A one-line textual fix to the dispatch-order sentence embedded
> in `.github/workflows/march.yml`'s cloud prompt, so the summary
> a cloud tick reads about its own dispatch order actually names
> the content-queue / refill lanes it runs through
> `skills/march.lanes.md`, instead of jumping straight from
> `/next top` to `ship-data`.

## Why

Candidate `[score 6.5]` (`plan/CANDIDATES.md`, proposed
2026-09-12, 67 days old, re-evidenced 0 — picked by
`node scripts/plan/promote.mjs due` under `promote_queue_depth: 2`
with 1 open spec), auto-promoted (aged) `/march` depth promotion.

The candidate's original framing (09-12) was a causal hypothesis:
that `.github/workflows/march.yml:340`'s embedded one-line
restatement of the dispatch order — *"triage → critique → ship-a-chunk
→ ship-data → expand → iterate"* — omitting `/ship-content` and the
content-gap-survey refill lane was the root cause of a HOT PURSUIT
content-gap row (`#989`) surviving 3 digest windows unshipped, and
that cloud couldn't even land the one-line fix itself (`#898`,
`ACTIONS_PAT` lacked the `workflows` scope).

Both halves of that framing are now stale:

- **The causal hypothesis was falsified the same month it was
  filed.** The 2026-09-20 update to this row confirms the very
  next cloud tick after filing shipped `#997` end-to-end via
  `/ship-content` despite the summary gap being unchanged —
  direct proof cloud reaches the content-queue lane regardless of
  the embedded summary's wording. Seven further updates (through
  2026-10-14) each re-confirm the same "slow, not structurally
  broken" shape across three more content-gap instances
  (`#1018`, guides, newsletter `#1019`), tracing the *real*
  recurring friction to the ranking inside `skills/ship-content.md`
  (tie-break order, and a fixed-score row never outranking an
  auto-refilling one) — a separate, already-understood mechanism,
  not this row's.
- **`#898` (cloud cannot push `.github/workflows/*.yml`) is
  closed.** A cloud tick landed `1e225605` (a `heartbeat.yml`
  edit) cleanly on 2026-09-27 — `ACTIONS_PAT` now carries the
  `workflow` scope. The "cloud cannot execute this fix" blocker
  this row's `ease` score was conditioned on no longer holds.

What's left, after both the mechanism and the execution blocker
are retired, is a true but narrow residual: the sentence at
`.github/workflows/march.yml:340` is still inaccurate prompt text.
It names `/next top → ship-data` with nothing between them, while
`skills/march.md` (Step 3a') and `skills/march.lanes.md` (the
`queue` hook — content queue / `/ship-content`, refill, field
research) both run real work in that gap. A cloud tick that reads
only the embedded summary (rather than the full `skills/march.md`
+ `skills/march.lanes.md` chain) could reasonably believe those
lanes don't exist. Worth one line, now that the only reason this
sat as a `Pending` candidate for 67 days (cloud couldn't land it)
is gone.

## Design

- **One-line edit**, `.github/workflows/march.yml` — the
  dispatch-order sentence inside the cloud prompt (around line
  340 as of this filing; the heredoc-embedded text, not a
  separate file): insert the queue lanes between `/next top` and
  `ship-data`, e.g. *"triage → critique (web-fetch engine) →
  /next top (the chunk step: one chunk, done fully) → queue lanes
  (content queue via /ship-content, refill, field research) →
  ship-data → expand → iterate."* Match the existing sentence's
  voice exactly; change nothing else on the line.
- No other file carries a duplicate of this sentence
  (`.github/CLOUD_LOOP.md` was checked and has no matching text).
- No schema, route, script, or dispatch-logic change — the lanes
  already run; this corrects what the embedded summary says about
  them.

### Decisions made upfront (do not ask)

- **Textual fix only, not a logic change.** `skills/march.md` and
  `skills/march.lanes.md` are the source of truth for dispatch
  order; this spec brings one embedded restatement back in sync
  with them. It does not touch either skill file.
- **No re-litigating the falsified hypothesis.** The spec does
  not reopen whether the content-queue lane is "structurally
  invisible" to cloud — that was answered empirically (it isn't).
  It only fixes the prompt text's accuracy.

## Acceptance

- **A1** `.github/workflows/march.yml`'s embedded dispatch-order
  sentence names the queue lanes (content queue / `/ship-content`,
  refill) between `/next top` and `ship-data`.
- **A2** No other line in the sentence changes; no other file in
  the workflow changes.
- **A3** `node scripts/plan-check.mjs --since HEAD` green (plan
  structure only — this phase touches no verify-gate-relevant
  source, but the gate still runs per `agents.md` §3 before the
  commit).

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

- [ ] **11.1** insert the queue lanes into the cloud prompt's
  dispatch-order sentence · S · closes A1, A2, A3 · needs —
