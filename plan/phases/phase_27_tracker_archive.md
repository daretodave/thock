# Phase 27 — Trends Tracker multi-week archive surface (Phase A)

## Outcome

`/trends/tracker/[week]` renders any historical `data/trends/<YYYY-WNN>.json`
snapshot. The existing `/trends/tracker` (latest view) gains a "Weekly archive"
nav strip linking back through all available prior weeks. Phase B (recurring
snapshot cadence / cron-vs-march path lock) stays in PHASE_CANDIDATES until
Phase A ships and `/oversight` makes the path call.

## Why

Two trend snapshots exist (`2026-W19`, `2026-W20`). Right now there is no way
to read the older one — it is silently overwritten in the UI by "latest". The
archive surface makes every snapshot a permanent, addressable URL and lets
readers track how the market has shifted week-over-week.

Secondary: the build plan brief explicitly defers Phase B (cadence rule) to
post-Phase-A oversight — this phase only ships the surface.

## Scope

### New routes

- `apps/web/src/app/trends/tracker/[week]/page.tsx`
  - `generateStaticParams()` — one entry per isoWeek in `getAllTrendSnapshots()`
  - `generateMetadata()` — title `"Trends Tracker — Week {N}, {YYYY}"`,
    canonical `/trends/tracker/{isoWeek}`
  - Page body: same layout as `/trends/tracker` but reads
    `getTrendSnapshot(params.week)` instead of `getLatestTrendSnapshot()`. Call
    `notFound()` for unknown weeks.
  - JSON-LD: CollectionPage + BreadcrumbList (Home → Trends → Tracker →
    "Week N") + Dataset (matching the latest-tracker's Dataset shape).
  - Navigation: `← Back to latest` link at top; `← prev week / next week →`
    pagination at bottom (derived from sorted snapshot list).

- `apps/web/src/app/trends/tracker/[week]/loading.tsx`
  — skeleton matching the tracker layout.

- `apps/web/src/app/trends/tracker/[week]/not-found.tsx`
  — plain branded 404 with link back to `/trends/tracker`.

### Updates to `/trends/tracker` (latest view)

- Add a "Weekly archive" strip at the bottom of the page (after all category
  sections). Rendered by a new `<TrackerArchiveStrip>` component:
  - Shows the most recent 8 snapshots (or all if fewer than 8), newest-first.
  - Each entry: week label (`Week 19 / 2026`), a mini direction summary
    (count of up / flat / down rows), link to `/trends/tracker/{isoWeek}`.
  - Current week is highlighted (marked "latest") and is not a link.
  - Only renders when more than 1 snapshot exists (≥ 2 needed to show history).

### `<TrackerArchiveStrip>` component

- `apps/web/src/components/tracker/TrackerArchiveStrip.tsx`
  — accepts `{ snapshots: TrendSnapshot[], currentWeek: string }`.
- `apps/web/src/components/tracker/__tests__/TrackerArchiveStrip.test.tsx`
  — unit tests: renders nothing with ≤1 snapshot, renders N cards with N>1,
  marks current week as non-link, marks others as links.

### Sitemap

`apps/web/src/app/sitemap.ts` — add one entry per isoWeek at priority 0.7,
`lastModified` = `snapshot.publishedAt`.

```ts
import { getAllTrendSnapshots } from '@/lib/data-runtime'

const trackerWeekEntries = getAllTrendSnapshots().map((s) => ({
  url: canonicalUrl(`/trends/tracker/${s.isoWeek}`),
  lastModified: s.publishedAt,
  priority: 0.7,
}))
```

### Canonical URLs fixture

`apps/e2e/src/fixtures/canonical-urls.ts` — add `listTrendWeeks(root)` that
reads `data/trends/*.json`, extracts `isoWeek`, and pushes entries with pattern
`/trends/tracker/[week]`. Mirrors the existing `listPartSlugs` pattern.

### E2E

`apps/e2e/tests/tracker-archive.spec.ts`:

1. `GET /trends/tracker/2026-W19` → 200, renders H1 containing "rising",
   week-number block shows "19".
2. `GET /trends/tracker/2026-W20` → 200 (verifying both weeks resolve).
3. `/trends/tracker/2026-W19` emits CollectionPage + BreadcrumbList + Dataset
   JSON-LD.
4. `/trends/tracker/unknown-week` → 404 (Next.js not-found boundary).
5. `/trends/tracker` archive strip renders and contains a link to
   `/trends/tracker/2026-W19`.
6. Navigation: `/trends/tracker/2026-W19` shows a "next week" link pointing at
   `/trends/tracker/2026-W20`.

## Decisions

- **Route param name**: `week` (matches `isoWeek` semantics; short, unambiguous).
- **Phase B deferred**: cron-vs-march cadence path lock stays in PHASE_CANDIDATES
  until /oversight after Phase A ships.
- **Archive strip cap**: 8 entries — matches the "top-N count" standing
  decision in `bearings.md`.
- **No new design file needed**: archive uses the existing tracker component
  kit (`TrackerHeader`, `TrackerSummaryGrid`, `TrackerCategorySection`) with
  minor prop additions.
- **`generateStaticParams` at build time**: ISR would be simpler but all snapshots
  are committed to the repo — static generation is the right choice.

## Files touched

```
apps/web/src/app/trends/tracker/[week]/page.tsx          (new)
apps/web/src/app/trends/tracker/[week]/loading.tsx       (new)
apps/web/src/app/trends/tracker/[week]/not-found.tsx     (new)
apps/web/src/app/trends/tracker/page.tsx                 (update — archive strip)
apps/web/src/components/tracker/TrackerArchiveStrip.tsx  (new)
apps/web/src/components/tracker/__tests__/TrackerArchiveStrip.test.tsx (new)
apps/web/src/app/sitemap.ts                              (update)
apps/e2e/src/fixtures/canonical-urls.ts                  (update)
apps/e2e/tests/tracker-archive.spec.ts                   (new)
plan/phases/phase_27_tracker_archive.md                  (this file)
plan/steps/01_build_plan.md                              (tick [x] at ship)
```
