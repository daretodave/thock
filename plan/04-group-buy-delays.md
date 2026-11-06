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
- No new date field. A `delayed` record keeps its original
  `startDate`/`endDate`; the delay is explained by `statusNote`,
  not a revised date. `isGroupBuyEnded` (`@thock/data`) treats
  `delayed` as never-ended (active-but-late) regardless of
  whether `endDate` has passed, and treats `cancelled` as
  always-ended regardless of `endDate`. `getActiveGroupBuys` (both
  the `@thock/data` loader and the duplicate in
  `apps/web/src/lib/data-runtime/index.ts`) includes `delayed`
  records even past their `endDate`, and excludes `cancelled`
  records unconditionally.
- `cancelled` renders like `ended` (muted, no CTA, no forward-
  looking countdown) but with a distinct "CANCELLED" label and the
  `statusNote` text instead of "CLOSED"/"SHIPPED". `delayed`
  renders like its current variant (`live`/`announced`/`ended`,
  whichever the shared partition logic already placed it in) plus
  a calm badge carrying the `statusNote` text and, when
  `sourceUrl` is set, a "source" link.

## Acceptance

- **A3** `group-buy-status-check.mjs` flags overdue unshipped buys
  as delay candidates, with tests.

## Open questions

None.

## Chunks

Measure: 1 open · 2 closed · next A4

- [ ] **04.4** group-buy-status-check.mjs delay framing · S · closes A3 · needs —
  - A `live`/`announced` record whose `endDate` has passed is now
    framed as a "delay candidate": update `formatAuditRow()`'s
    action text to suggest `status: 'delayed'` with a sourced
    `statusNote` as the primary fix, `'closed'` as the fallback
    when the buy is confirmed done.
  - Update `scripts/__tests__/group-buy-status-check.test.mjs` to
    match the new wording; keep the existing staleness detection
    logic (which records get flagged) unchanged.
