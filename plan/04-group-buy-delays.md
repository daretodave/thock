# 04 — Group-buy delays and non-fulfillment

> Group buys can be marked delayed or cancelled, with a short
> sourced note, so the tracker stops presenting every buy as
> on-track until it silently closes.

## Why

Field research (2026-10-26) documented group buys slipping a month
on tariff-driven cost changes and at least one 2025 project ending
without fulfillment. Delay risk and organizer track record are what
a reader weighs before paying a deposit, and the group-buy status
enum (`announced | live | closed | shipped`) has nowhere to put
either. Candidate `[6.0]` (research, 2026-10-26), promoted via
`/oversight` 2026-11-01.

## Design

- Extend `status` in `packages/data/src/schemas/group-buy.ts` with
  `delayed` and `cancelled` (cancelled = ended without
  fulfillment); regenerate the JSON Schema.
- Add optional `statusNote: { text, sourceUrl, asOf }` carrying the
  reason (one sentence, sourced, dated), required when status is
  `delayed` or `cancelled` (schema refinement).
- Render: `/group-buys` and `GroupBuyRow` show a distinct, calm
  badge for delayed/cancelled with the note; countdown widgets treat
  delayed as active-but-late; feeds and JSON-LD stay valid.
- `scripts/group-buy-status-check.mjs` flags a buy past its
  `endDate` without `shipped` as a delay candidate, not only
  "stale".
- Data: scout any currently tracked buy that is publicly delayed and
  backfill it with a sourced note.

### Decisions made upfront (do not ask)

- Additive schema change; existing records stay valid.
- Tone stays editorial and factual: no "scam" language, only what
  the source says and when.

## Acceptance

- **A1** The schema accepts `delayed` / `cancelled` with a required
  sourced `statusNote`; schema tests cover valid and invalid cases;
  `data:validate` passes.
- **A2** `/group-buys` and every group-buy surface render the new
  states and note, with unit + e2e coverage and clean a11y.
- **A3** `group-buy-status-check.mjs` flags overdue unshipped buys
  as delay candidates, with tests.

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

Not chunked yet.
