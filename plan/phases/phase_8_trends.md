# Phase 8 — Trends pillar + Trends Tracker

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body. **Phase 8
> ships two surfaces — the Trends pillar landing (mirroring News from
> phase 7) and the Trends Tracker dashboard, the site's signature
> data view. The tracker is the second consumer of `<PillarHero>`,
> which validates the abstraction phase 7 introduced.**

## Routes (locked in `plan/bearings.md`)

- `/trends` — replace the phase 4 stub with the canonical pillar
  landing.
- `/trends/tracker` — replace the phase 4 stub with the dashboard
  view of the latest `TrendSnapshot`.

## Sections — `/trends`

Mirrors phase 7 News exactly:

1. **Pillar header** (`<PillarHero>`) — eyebrow `PILLAR · 02 of 05`,
   italic display H1 `Trends`, lede paragraph (locked below). Right
   rail uses a **dashboard pill** linking to `/trends/tracker`
   instead of the news RSS pill (Trends still gets RSS too — both
   pills stack).
2. **Lead article** — newest `pillar = "trends"` as
   `<ArticleCard variant="hero">`. Hidden if zero.
3. **Archive list** — `<PillarArchiveList>` of remaining trends
   articles, sorted by publishedAt desc, capped at 25.

## Sections — `/trends/tracker`

1. **Tracker header** — eyebrow `SIGNATURE · TRENDS TRACKER`, italic
   display H1 `What's actually rising this week`, lede paragraph
   with the snapshot's `publishedAt` injected, right-side big week
   number block (`WEEK NN / 2026`). Bottom border hairline.
2. **Summary cards** — `<TrackerSummaryGrid>` rendering the top
   movers from the latest snapshot. 4 named slots:
   - `BIGGEST RISER` = row with the highest positive score where
     `direction === 'up'`. Falls back to the highest-score row if
     no `up` row exists.
   - `BIGGEST FALLER` = row with the lowest (most negative) score
     where `direction === 'down'`. Falls back to the lowest-score
     row.
   - `BREAKOUT` = `up` row with the steepest spark slope (last
     value − first value). Excludes any row already used.
   - `SLEEPER` = `flat` row with the highest absolute score; or
     any unused row if none qualify.
   If a slot can't be filled, hide that card (do not render an
   empty placeholder). Hide the whole grid only when zero rows.
3. **Per-category sections** — `<TrackerCategorySection>`, one per
   present category (switch / keycap / layout / vendor / brand) in
   that order. Each renders a `<HomeSectionHeading>` (kicker =
   pluralized category, title = `{Category} movers`) and a
   `<TrackerTable>`. Categories with zero rows are skipped (no
   heading).
4. **Empty state** — when `getLatestTrendSnapshot()` is null, render
   a one-paragraph "no snapshot yet" panel with copy locked below
   and a back-to-`/trends` link. Skip every other section.

The design's tabs + filter row are deferred to phase 16 polish; with
seed data of 5 rows total, tabs would look hollow. Per-category
sections give the same coverage at this phase's data scale.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticlesByPillar('trends')` | manifest | `/trends` hero + archive |
| `getLatestTrendSnapshot()` | manifest | tracker header, summary cards, category sections |
| `getArticleBySlug(row.articleSlug)` | manifest | tracker editor's-note resolution |
| `getAllTags()` | manifest | tag-by-slug lookup for archive chip rendering |

## Components

### Reused (already shipped)

- `<PillarHero>` (phase 7) — both `/trends` and `/trends/tracker`
  use it. Tracker passes a custom `heading` for the SIGNATURE
  framing.
- `<PillarArchiveList>` (phase 7) — `/trends` archive.
- `<ArticleCard variant="hero">` (phase 6) — `/trends` lead.
- `<HomeSectionHeading>` (phase 6) — tracker per-category section
  headings.
- `<Sparkline>`, `<TrendDirectionGlyph>` (phase 6).
- `<TagChip>` (phase 4).

### New, in `apps/web/src/components/tracker/`

- **`<TrackerHeader>`** — wraps `<PillarHero>` with the
  signature-styled eyebrow + week-number block. Takes
  `{ snapshot: TrendSnapshot }` and computes display copy.
- **`<TrackerSummaryGrid>`** — 4-up named-slot grid.
  Sub-component `<TrackerSummaryCard>` for an individual slot.
- **`<TrackerCategorySection>`** — section heading + table for one
  category. Takes `{ rows, category, articlesBySlug }`.
- **`<TrackerTable>`** — renders one `<TrackerRow>` per snapshot
  row in score-desc order within the category. Header row labels:
  rank / switch / score / 8-wk / editor's note.
- **`<TrackerRow>`** — rank, name, score (signed percent),
  direction glyph, sparkline, optional editor's-note linking to
  the row's article when `articleSlug` resolves.

### Pure helpers

`apps/web/src/lib/tracker/`:
- **`pickSummarySlots(rows)`** — implements the named-slot
  selection algorithm above. Pure, unit-tested.
- **`groupByCategory(rows)`** — returns a `Map<TrendCategory,
  TrendRow[]>` in canonical order, each list sorted by score desc
  with a stable tie-break on `name asc`.
- **`weekKicker(isoWeek)`** — `'2026-W19'` →
  `{ week: 19, year: 2026, label: 'Week 19 / 2026' }`.
- **`formatDelta(score, direction)`** — score `+34` → `'+34%'`,
  flat → `'flat'`, null → `'—'`. Reused signature from phase 6's
  `<TrendingTile>` (move that helper here, re-import from the home
  tile).

### Component reuse extension

`<PillarHero>`'s prop signature gains a `pills` array
(`Array<{ href, label, sublabel? }>`) and the existing `rssLink`
prop becomes a thin wrapper that maps to `pills[0]`. News page
unchanged behaviorally; trends pillar passes two pills. Tests
update to cover the new shape; existing PillarHero tests stay
green.

## Cross-links

**In:**
- Home page trending strip already references the latest snapshot
  (phase 6). Verify the snapshot still resolves.
- Article-page eyebrow for `pillar="trends"` articles already
  links to `/trends`; verify it now lands on the real H1.

**Out:**
- `/trends` archive rows → `/article/<slug>`.
- `/trends` hero → `/article/<slug>`.
- Both hero pills → `/trends/tracker` and `/feed/trends.xml`.
- Tracker editor's-note → `/article/<articleSlug>` when the
  snapshot row has one; renders as plain text otherwise.

**Retro-fit:** the home page trending strip currently links each
tile to nothing. Phase 8 leaves the strip itself unchanged — the
tile-to-tracker-row anchor wiring is a follow-up, not a retro-fit
(it requires per-row anchor IDs we'd need to design coherently and
test). Defer.

## SEO

`/trends`:
- `generateMetadata` — title `Trends`, description = lede,
  canonical `/trends`.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  trends articles (≤ 25). Same shape as phase 7 News.

`/trends/tracker`:
- `generateMetadata` — title `Trends Tracker`, description = lede,
  canonical `/trends/tracker`. Title gets a `Week NN, YYYY` suffix
  when a snapshot exists (`'Trends Tracker — Week 19, 2026'`).
- JSON-LD: `CollectionPage` (already present in the stub) +
  `BreadcrumbList` (Home → Trends → Tracker) + `Dataset` graph with
  `name`, `description`, `temporalCoverage` = `isoWeek`,
  `dateModified` = `publishedAt`. The Dataset graph is the right
  schema.org type for a periodic ranking — Google indexes it well.

## Empty / loading / error states

- **`/trends` no articles in pillar** — same fallback as phase 7
  News.
- **`/trends/tracker` no snapshot** — render the SIGNATURE eyebrow,
  the H1, and a panel: `"No tracker snapshot has shipped yet. Check
  back next Monday at 09:00 EST. ← Trends pillar"`.
- **`/trends/tracker` zero rows in snapshot** — render header +
  empty panel under the categories.
- **Loading** — `loading.tsx` colocated with each route. Skeleton
  header + skeleton grid for the tracker; skeleton hero + 3 row
  cards for the pillar.
- **Error** — `error.tsx` 'use client' identical in shape to
  phase 7 News error.

## Decisions made upfront — DO NOT ASK

- **`/trends` lede (locked):** "How taste in switches, layouts, and
  keycaps moves week-to-week. Editorial reads first; the tracker
  dashboard is one click away." Same as phase 4 stub.
- **`/trends/tracker` lede (locked):** "A weighted weekly score
  across community chatter, retail availability, and editorial
  mentions. Each row links to the deep dive that earned it.
  Updated weekly."
- **`/trends/tracker` H1:** `What's actually rising this week`
  with `actually` italicized — matches design exactly.
- **Week display:** `'2026-W19'` → header right block shows
  `2026 · WEEK` mono kicker, big serif `19`, mono `of 52`. Issue
  number is dropped (no source of truth in our schema).
- **Last-updated copy:** `Updated <publishedAt long>` rendered in
  mono accent inside the lede paragraph. Format =
  `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`.
- **Score formatting:** `+34%` for positive, `-9%` for negative,
  `flat` for zero or `direction === 'flat'` and `score === 0`,
  `'—'` for missing. Shared with phase 6 trending tile via the
  helper move.
- **Per-category section ordering:** `switch`, `keycap`, `layout`,
  `vendor`, `brand` — the order rows tend to flow naturally
  (switches first, brand-level last).
- **Within-section row ordering:** by `score` desc, tie-break by
  `name asc`. Rank within section.
- **Editor's-note column copy:** when `row.articleSlug` resolves
  to an article, link to `/article/<slug>` with the article's
  `frontmatter.title` as the link text. Otherwise render an em-dash.
  No "click chatter" or other invented copy.
- **8-wk sparkline column header:** label is `8-wk` always (we
  haven't enforced spark length matching elsewhere; the snapshot
  schema permits 2–16). The header is decorative copy.
- **Summary card delta column:** mono signed percent + glyph +
  sparkline. No editor-note prose on summary cards (the design's
  copy is inviting but we don't have a source — defer to a future
  manual-curation feature).
- **Mobile reflow:** tracker header stacks vertically; summary
  grid drops to 1-col at `<sm`, 2-col at `sm`, 4-col at `lg`.
  Tracker table cells wrap; rank + sparkline columns shrink.
- **No tabs:** per-category sections instead. Phase 16 may revisit.
- **No filter row:** out of scope.
- **No follow-buttons / share buttons:** out of scope.

## Mobile reflow

- `<TrackerHeader>`: H1 sizes down via `text-h1 sm:text-display`;
  week-number block stacks below the lede on mobile.
- `<TrackerSummaryGrid>`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- `<TrackerTable>`: drops the editor's-note column at `<md` (the
  note still appears under the row title via stacked layout).
- `<PillarArchiveList>` reuses phase 7's reflow.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/trends` | n/a | renders H1 matching `/trends/i`, ≥1 article-card link, dashboard pill links to /trends/tracker, JSON-LD ItemList present |
| `/trends/tracker` | n/a | renders H1 matching `/rising/i`, week-number block visible, ≥1 summary card, ≥1 tracker row, Dataset JSON-LD present |
| `pickSummarySlots` | empty input → empty output; selects up/down/breakout/sleeper per the rule; never duplicates a row across slots | n/a |
| `groupByCategory` | groups rows by category in canonical order; sorts each group score desc; stable on tie | n/a |
| `weekKicker` | parses `2026-W19` correctly; falls back gracefully on bad input | n/a |
| `formatDelta` | signed percent / flat / em-dash branches | n/a |
| `<TrackerSummaryCard>` | renders kicker, name, signed-percent, sparkline; respects direction tone | n/a |
| `<TrackerRow>` | renders rank + name + score + glyph + sparkline; renders editor's-note as link when articleSlug resolves; em-dash otherwise | n/a |
| `<TrackerTable>` | header row + N body rows; empty input renders nothing | n/a |
| `<PillarHero>` `pills` array | renders multiple pills in order; rssLink shorthand still works | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/trends` and
`/trends/tracker`:

```ts
'/trends': {
  pattern: '/trends',
  ...html([
    { kind: 'h1-matches', pattern: /trends/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="hero-card"], [data-testid="article-card-row"]',
      min: 1,
    },
    { kind: 'min-link-count', selector: '[data-testid="pillar-hero-rss"]', min: 1 },
  ]),
},
'/trends/tracker': {
  pattern: '/trends/tracker',
  ...html([
    { kind: 'h1-matches', pattern: /rising/i },
    { kind: 'min-link-count', selector: '[data-testid="tracker-row"]', min: 1 },
  ]),
},
```

Add `apps/e2e/tests/trends.spec.ts` covering the pillar (dashboard
pill href) and the tracker (week-number block, ≥1 summary card,
Dataset JSON-LD).

## Verify gate

```bash
pnpm verify
```

(typecheck + unit + data:validate + build + e2e). All must pass
before commit.

## Commit body template

```
feat: trends pillar + tracker — phase 8

- /trends replaces the phase 4 stub with the canonical pillar
  landing (mirrors phase 7 News).
- /trends/tracker replaces the phase 4 stub with the signature
  tracker dashboard — header strip with week number, top-movers
  summary grid, per-category tables.
- New components in apps/web/src/components/tracker/:
  <TrackerHeader>, <TrackerSummaryGrid>, <TrackerSummaryCard>,
  <TrackerCategorySection>, <TrackerTable>, <TrackerRow>.
- New helpers in apps/web/src/lib/tracker/: pickSummarySlots,
  groupByCategory, weekKicker, formatDelta (relocated from the
  home trending tile).
- <PillarHero> gains a pills array; news pillar updated to use it.
- CollectionPage + BreadcrumbList + ItemList JSON-LD on /trends;
  CollectionPage + BreadcrumbList + Dataset JSON-LD on the tracker.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 8's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups (out of scope)

- Tabbed category navigation on the tracker (phase 16).
- Filter row (region, score window, vendor) — phase 16+.
- Per-row anchor IDs + home trending tile → tracker row deep links
  (phase 16).
- Compare mode (pin two switches side-by-side) — out of roadmap
  per `decisions.jsx` "what we'd build next" list.
- Per-route OG image art (phase 16).
- Historical week navigation (`/trends/tracker/2026-W18`) — out of
  spec scope.
