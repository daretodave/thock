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

- [ ] **04.1** Schema + ended/active predicate · S · closes A1 · needs —
  - `GroupBuySchema` (`packages/data/src/schemas/group-buy.ts`): add
    `'delayed'` / `'cancelled'` to `status`; add optional
    `statusNote: { text: string (1-280 chars), sourceUrl: url,
    asOf: date-only }`; refine so `statusNote` is required when
    `status` is `delayed` or `cancelled`.
  - `isGroupBuyEnded` / `getActiveGroupBuys`
    (`packages/data/src/loaders/group-buys.ts`): apply the
    delayed/cancelled rule from "Decisions made upfront".
  - Unit tests: schema valid/invalid cases (missing note, note
    on an unaffected status, each field's bounds); loader cases
    for delayed-past-endDate and cancelled-future-endDate.
  - `pnpm data:validate` passes (regenerates
    `data/schemas/group-buy.schema.json`).
- [ ] **04.2** Canonical page + GroupBuyRow · M · partial A2 · needs 04.1
  - `apps/web/src/lib/data-runtime/index.ts` `getActiveGroupBuys`:
    mirror the same rule (duplicate implementation, not delegated —
    keep both in sync).
  - `apps/web/src/app/group-buys/helpers.ts` `isLive`/`isAnnounced`:
    a `delayed` buy is live regardless of `endDate`; `cancelled`
    never reaches `isLive`/`isAnnounced` (falls through to
    `isGroupBuyEnded` in `partitionGroupBuys`).
  - `GroupBuyRow` (`apps/web/src/components/group-buys/`): extend
    `STATUS_LABEL`; render the calm badge + note for `delayed`
    (keeping the variant's existing countdown/CTA) and the
    "CANCELLED" treatment for `cancelled` (muted, no CTA, per
    Decisions).
  - Unit tests: `GroupBuyRow.test.tsx` and `helpers.test.ts` cover
    one `delayed` and one `cancelled` fixture each.
- [ ] **04.3** Remaining surfaces + feeds/a11y · M · closes A2 · needs 04.2
  - `VendorGroupBuySection`'s `sectionVariant`: delayed stays out of
    `ended`; cancelled routes to `ended`, same as the canonical
    page's partition.
  - `GroupBuyCountdownRow` (home widget) + `isAnnouncedNotStarted`:
    a delayed buy keeps its countdown/progress sliver (existing
    `daysLeft`/`progressFraction` clamps already guard a
    past-endDate input) with a small "delayed" cue; cancelled buys
    never reach this widget (excluded by `getActiveGroupBuys`).
  - Regression test: `/group-buys/past` + the search index include
    a `cancelled` fixture via `getAllClosedGroupBuys` /
    `isGroupBuyEnded` (no code change expected — confirms 04.1's
    predicate reaches both without a dedicated change).
  - Confirm `buildItemListJsonLd` / feed-adjacent code (no status
    gating today) still typechecks against the widened enum.
  - a11y: `apps/e2e/tests/a11y.spec.ts` passes for `/group-buys`,
    `/group-buys/past`, `/`, and one `/vendor/<slug>` route with the
    new badge markup (visible text, not color-only).
- [ ] **04.4** group-buy-status-check.mjs delay framing · S · closes A3 · needs 04.1
  - A `live`/`announced` record whose `endDate` has passed is now
    framed as a "delay candidate": update `formatAuditRow()`'s
    action text to suggest `status: 'delayed'` with a sourced
    `statusNote` as the primary fix, `'closed'` as the fallback
    when the buy is confirmed done.
  - Update `scripts/__tests__/group-buy-status-check.test.mjs` to
    match the new wording; keep the existing staleness detection
    logic (which records get flagged) unchanged.
