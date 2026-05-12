# Phase 29 — Group-buy archive `/group-buys/past`

> Brief drafted on-demand by `/ship-a-phase` (cloud tick 2026-05-12).

## Outcome

A browsable archive at `/group-buys/past` listing every group buy that has
ended (status `closed` / `shipped`, or status `live` with an `endDate`
strictly in the past). Sorted newest-closed first. Companion to the
existing live `/group-buys` index — that page caps "Just closed" at the
six most recent; this page holds the full history.

A small "view past buys →" affordance is added to the bottom of
`/group-buys` so the surface is discoverable.

## Why

Group-buy records accrue over time and the live index intentionally
shows only the freshest six in its "Just closed" rail. Without a
dedicated archive surface, older records are orphaned — indexed in the
sitemap data-side but not reachable from any internal page once they
roll off the rail. The archive gives every past buy a permanent
discovery path and matches the precedent set by
`/trends/tracker/[week]` (phase 27) for historical snapshots.

## Scope

### New loader

`apps/web/src/lib/data-runtime/index.ts` — add `getAllClosedGroupBuys()`
that filters `manifest.groupBuys` to records where either:

- `status` is `'closed'` or `'shipped'`, OR
- `status` is `'live'` AND `endDate < today`.

Returns the array sorted by `endDate` descending, name ascending as
tie-break. Matches the partition logic already used in
`apps/web/src/app/group-buys/helpers.ts` `isEnded()`, lifted into a
single reusable loader. **No cap** — the archive shows the full
history; the home `/group-buys` page keeps its `ENDED_CAP = 6` rail.

### New route

`apps/web/src/app/group-buys/past/page.tsx` (static):

- Reads `getAllClosedGroupBuys()` + `getAllVendors()`.
- Header: eyebrow "archive", H1 "Past group buys", lede sentence, count
  meta line ("N closed buys").
- Empty state when the archive is empty (no records have ended yet) —
  reuses the same "quiet week" pattern as `/group-buys`.
- Body: single `<SectionStack>` of `<GroupBuyRow variant="ended">`
  rendering every record in the loader's order. No grouping by year —
  the records sort descending by `endDate` already.
- CollectionPage + BreadcrumbList + ItemList JSON-LD.
- `export const metadata = buildMetadata(...)` (static).

### Cross-link retrofit

`apps/web/src/app/group-buys/page.tsx` — when the "Recently ended" rail
renders, append a small "view full archive →" anchor pointing at
`/group-buys/past`. Mirrors the editorial-restraint chrome (mono caps,
`text-text-3`).

### Sitemap

`apps/web/src/app/sitemap.ts` — add `/group-buys/past` as a static
entry (priority 0.5).

### Canonical URLs fixture

`apps/e2e/src/fixtures/canonical-urls.ts` — add
`{ path: '/group-buys/past', pattern: '/group-buys/past', kind: 'html' }`
to `STATIC`.

### Page-reads fixture

`apps/e2e/src/fixtures/page-reads.ts` — add a `/group-buys/past`
assertion: H1 matches `/past group buys/i` + at least one
`[data-testid="group-buy-row"][data-variant="ended"]` (smoke walker
asserts the archive is non-empty given current data).

### E2E

Extend `apps/e2e/tests/group-buys.spec.ts` with a new describe block
covering:

- `/group-buys/past` renders H1 "Past group buys".
- At least one `[data-testid="group-buy-row"][data-variant="ended"]`
  is present.
- No row carries `data-variant="live"` (archive purity check).
- CollectionPage + ItemList JSON-LD emitted.
- `/group-buys` body contains a link to `/group-buys/past`.

## JSON-LD

```
@graph: [
  CollectionPage { name: "Past group buys", path: "/group-buys/past" },
  BreadcrumbList [ Home → Group buys → Past ],
  ItemList { name: "Past group buys", items: all closed records }
]
```

## Decisions (pre-decided)

- **Loader sort**: `endDate` desc, then `name` asc — matches the
  existing `helpers.ts` ended-partition ordering and keeps the row
  reading "newest closed at the top".
- **No `relatedArticle` link**: the build-plan row mentions linking to
  a companion article if `relatedArticle` is set, but the schema does
  not have that field today. Skipped — a schema additive is its own
  /ship-a-phase, not a sub-task of an archive surface. Future ship can
  light it up cheaply when the schema lands.
- **No pagination**: 6 records total today; the archive will not cross
  the 30-entry pagination floor for a long time. Defer when needed.
- **No year/region grouping**: the row's existing region/kind badges
  carry that signal. Flat list keeps the page legible.
- **Variant reuse**: archive rows render with `variant="ended"`
  identical to the `/group-buys` "Just closed" rail — opacity-70,
  muted CTA suppressed, status pill in place of countdown.

## Definition of done

- [ ] `/group-buys/past` renders at 200 with H1 "Past group buys"
- [ ] Loader returns all ended records, sorted endDate-desc
- [ ] `/group-buys` body links to `/group-buys/past`
- [ ] CollectionPage + ItemList JSON-LD present
- [ ] Sitemap includes `/group-buys/past`
- [ ] Smoke walker covers `/group-buys/past`
- [ ] `pnpm verify` green
- [ ] Phase issue closed via `Closes #<N>` trailer

## Files touched

```
apps/web/src/lib/data-runtime/index.ts                 (loader added)
apps/web/src/app/group-buys/past/page.tsx              (new)
apps/web/src/app/group-buys/page.tsx                   (archive affordance)
apps/web/src/app/sitemap.ts                            (static entry)
apps/e2e/src/fixtures/canonical-urls.ts                (STATIC entry)
apps/e2e/src/fixtures/page-reads.ts                    (assertion)
apps/e2e/tests/group-buys.spec.ts                      (new describe)
plan/phases/phase_29_group_buys_past.md                (this file)
plan/steps/01_build_plan.md                            (tick [x] at ship)
```
