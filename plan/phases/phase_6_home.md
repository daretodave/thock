# Phase 6 — Home (`/`)

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body.

## Routes (locked in `plan/bearings.md`)

- `/` — replace the phase 3 stub with the full home composition.

No new sub-routes. The home is the only route this phase ships.

## Sections (top → bottom)

1. **Hero pick** — single `<ArticleCard variant="hero">` for the
   newest published article overall.
2. **Trending strip** — six `<TrendingTile>`s pulled from the
   latest `TrendSnapshot`'s top entries (rank 1–6 by current
   position). Sparkline + direction glyph + delta + tag dot.
3. **Latest by pillar** — 4-up grid, one card per pillar
   (`news`, `trends`, `deep-dives`, `guides`); show the most
   recent article per pillar. If a pillar has no articles, fall
   through to the next-newest other-pillar pick. Use
   `<ArticleCard variant="large">`.
4. **Two-up: long reads + group buys** —
   - Left (1.6fr): "Long reads worth your weekend" — the three
     most recent `deep-dives` articles as
     `<ArticleCard variant="row">`. Hide the section if there
     are zero deep-dives.
   - Right (1fr): `<GroupBuysWidget>` — top four active group
     buys sorted by ascending `daysLeft`, each with a thin
     progress sliver. Accent color triggers when `daysLeft ≤ 3`.
     Hide the widget entirely if `getActiveGroupBuys()` is empty.
5. **Builds row** — DEFER to phase 9 (Ideas pillar).
6. **Newsletter inline** — DEFER to phase 15.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getAllArticles()` | manifest, sorted by publishedAt desc | hero pick (first), latest-by-pillar fallback |
| `getArticlesByPillar(pillar)` | manifest filter | latest-by-pillar grid |
| `getLatestTrendSnapshot()` | manifest | trending strip rows + iso-week kicker |
| `getActiveGroupBuys()` | manifest filter | group-buys widget |
| `getAllTags()` | manifest | tag-name lookup for tile dots |

The home is the **first page that reads from every loader at
once**. Manifest cost (one disk read at module init) is amortized
across the whole render — verify the build doesn't regress build
time meaningfully.

## Components

### New, in `packages/ui/`

- **`<Sparkline>`** — pure SVG line chart, props
  `{ values: number[]; w?: number; h?: number; tone?: 'up' | 'down' | 'flat' }`.
  Stroke color from tone (oklch `--text-3` for flat, `--accent`
  for up, neutral text-2 for down — keeping the palette restrained
  per `decisions.jsx`). Renders nothing when `values.length < 2`.
- **`<TrendDirectionGlyph>`** — 12px or 16px SVG glyph,
  props `{ dir: 'up' | 'down' | 'flat'; size?: number }`. Up arrow,
  down arrow, em-dash. No color of its own — inherits via
  `currentColor`.

Both are reusable in phase 8 (Trends Tracker), so they live in
`packages/ui/`. Tests colocated in `packages/ui/src/__tests__/`.

### New, in `apps/web/src/components/home/`

- **`<ArticleCard>`** with variants:
  - `hero` — full-width, large image left + lede + tag chips.
  - `large` — 4-up grid card, image top + title + byline.
  - `row` — horizontal row card (image left, body right).
  - `compact` — title + pillar + date only (used in trending
    fallback). Carry the variant union to keep callers simple.
- **`<TrendingStrip>`** — wraps six `<TrendingTile>`s in a
  6-column grid (3 cols at md, 2 at sm).
- **`<TrendingTile>`** — `{ tag, label, delta, dir, sparkValues }`.
- **`<LatestByPillar>`** — 4-up grid resolver + `<ArticleCard>`
  renderer.
- **`<HomeDeepDivesRail>`** — three `<ArticleCard variant="row">`.
- **`<GroupBuysWidget>`** — header + four
  `<GroupBuyCountdownRow>` items + "All active group buys →"
  trailing link.
- **`<GroupBuyCountdownRow>`** — title, vendor, daysLeft,
  progress sliver.
- **`<HomeSectionHeading>`** — kicker + title + horizontal hairline
  + optional "more" link.

### Reused from packages/ui (already shipped)

- `<Container>`, `<Stack>`, `<Wordmark>`, `<Mono>`, `<TagChip>`.

### Decision: ArticleCard lives in `apps/web/` for phase 6

Lift to `packages/ui/` only when phase 7 (News pillar) needs it —
the component will see real cross-family use then. Don't
prematurely abstract.

## Cross-links

**In** (already shipped — verify still wired):
- All article slugs already render at `/article/[slug]` (phase 5
  shipped). Verify cards link there.

**Out** (this phase ships these — many resolve to stubs until
their family ships):
- Hero card → `/article/[slug]`.
- Trending tile labels → currently inert (phase 8 turns them into
  links to the tracker row); render them as bare text + delta.
- "Open Trends Tracker" link → `/trends/tracker` (stub for now).
- Latest-by-pillar pillar kicker → `/<pillar>` (stubs for news,
  trends, ideas, deep-dives, guides until their phases ship).
- "All articles" → omit; we don't have an /articles index yet
  (and won't — we have pillars + tags). Replace the design's "All
  articles" link with "All by pillar" pointing to a stub list
  page? **Decision: omit the trailing more-link on the
  latest-by-pillar block.** Each card already routes to its
  article.
- "Long reads worth your weekend" cards → `/article/[slug]`.
- Group-buy rows → currently inert. Phase 13 ships `/group-buy/[slug]`;
  phase 13 retro-fits this widget to link rows.
- "All active group buys →" → `/group-buys` (stub for now).

**Retro-fit** — none. The home is the consumer; nothing else
links *to* sections of the home.

## SEO

- `generateMetadata` — `title` from `siteConfig.tagline`,
  `description` from `siteConfig.description`, canonical `/`.
- `buildJsonLd` — keep the `WebSite` JSON-LD already shipped in
  the phase 3 home. **Add an `ItemList`** representing the four
  latest-by-pillar cards (Schema.org `ItemList` with
  `ListItem.url` for each). One JSON-LD `<script>` per type.
- No per-route OG image yet — `/opengraph-image.tsx` already
  exists and renders the wordmark on warm-black; phase 16
  finalizes per-family templates.

## Empty / loading / error states

- **No articles** — render an empty hero + "no articles yet"
  copy. Production has 6 seed articles, so this is a defensive
  fallback only; ship the empty branch but don't dwell on the
  copy.
- **No latest trend snapshot** — hide the trending strip
  entirely (don't render the section heading either).
- **No active group buys** — hide the right column; expand the
  long-reads column to full width via responsive grid utilities.
- **No deep-dives** — hide the long-reads section entirely; the
  group-buys widget keeps its position (or stretches if alone).
- **Loading** — `loading.tsx` renders skeleton hero + skeleton
  rails. Match `apps/web/src/app/article/[slug]/loading.tsx`'s
  shape.
- **Error** — `error.tsx` 'use client' boundary identical to
  the article one.

## Decisions made upfront — DO NOT ASK

- **Hero pick algorithm:** newest published article across all
  pillars. (Editorial picks ship in phase 16 polish.)
- **Trending tile delta wording:** integer percent with explicit
  sign (`+34%`, `-9%`, `flat`). Match the design exactly — copy
  is sourced from `TrendSnapshot.entries[i].delta` if numeric;
  fall back to `flat` when delta is null or zero.
- **Sparkline tone selection:** use the entry's `direction` field
  (`up | down | flat`). Don't recompute from values.
- **Latest-by-pillar pillar set:** `news`, `trends`,
  `deep-dives`, `guides`. (Drop `ideas` for the 4-up grid until
  phase 9 ships; ideas is the lowest-volume pillar in seed
  content.) If any chosen pillar has zero articles, fall through
  to the next newest article from any pillar.
- **Group-buys count:** 4 rows. Sort by ascending `daysLeft`,
  tie-break by alphabetical title.
- **Group-buy progress sliver math:** `1 - (daysLeft /
  totalDays)`, where `totalDays = ceil((endsAt - startedAt) /
  1day)`. If `totalDays` is missing or 0, sliver is empty.
- **Accent triggers ≤ 72h** per `decisions.jsx`. `daysLeft ≤ 3`
  ⇒ accent color on the day count + the sliver.
- **Hero card image:** if `frontmatter.heroImage` present, render
  full-width on `lg:`, contained on mobile. Otherwise: render a
  warm-tinted placeholder div (matching the `<Img tone="warm">`
  treatment in design).
- **TrendingTile labels:** plain text (not `<Mono>`-wrapped).
  Inline mono with body text is too dense for the strip — the
  card's typographic context is already mono-heavy.
- **`<ArticleCard variant>` typography:**
  - hero: H1-style serif, `text-h1` (clamp via Tailwind).
  - large: H3 serif.
  - row: H3 serif (left-image, right-body composition).
  - compact: H4 serif.
- **Container width:** the home is the first page to fill the
  full viewport; lift sections out of the article's `max-w-[60ch]`
  reading column. Use `<Container>` defaults (which already give
  `max-w-content` of `78rem`).
- **Mobile reflow:** trending strip drops to 2-col, latest-by-
  pillar to 1-col stacked, deep-dives + group-buys widget
  unstack vertically. No new media queries — Tailwind responsive
  utilities only.

## Mobile reflow

- `<TrendingStrip>`: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6`.
- `<LatestByPillar>`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- Two-up section: `grid-cols-1 lg:grid-cols-[1.6fr_1fr]`.
- Hero card: image stacks above title at `<sm:`, side-by-side at
  `lg:`.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/` (home) | n/a | renders H1 (hero title), canonical link, ≥1 trending tile, ≥1 latest-by-pillar card, ≥1 group-buy row, footer; no horizontal scroll at 375px |
| `<Sparkline>` | renders SVG with N-1 segments for N values; renders nothing for `values.length < 2`; tone class wired | n/a |
| `<TrendDirectionGlyph>` | renders the right shape per `dir`; size prop forwarded | n/a |
| `<ArticleCard>` | renders hero / large / row / compact variants; falls back to placeholder when no heroImage | n/a |
| `<TrendingStrip>` | hides when 0 entries; renders ≤6 tiles; tile order matches input | n/a |
| `<TrendingTile>` | renders label, delta, sparkline; tone class follows `dir` | n/a |
| `<LatestByPillar>` | resolves one card per pillar; falls through when a pillar is empty | n/a |
| `<HomeDeepDivesRail>` | hides at 0 deep-dives; takes top 3 in publishedAt-desc order | n/a |
| `<GroupBuysWidget>` | hides at 0 active; renders ≤4 rows sorted by daysLeft | n/a |
| `<GroupBuyCountdownRow>` | accent color when `daysLeft ≤ 3`; sliver math ≈ `1 - daysLeft/totalDays` | n/a |

## Hermetic e2e registration

Append to `apps/e2e/src/fixtures/page-reads.ts`:

```ts
'/': {
  pattern: '/',
  ...html([
    { kind: 'h1-matches', pattern: /thock/i },  // existing — keep
    // Phase 6 upgrades:
    { kind: 'min-link-count', selector: '[data-testid="hero-card"]', min: 1 },
    { kind: 'min-link-count', selector: '[data-testid="trending-tile"]', min: 1 },
    { kind: 'min-link-count', selector: '[data-testid="latest-by-pillar-card"]', min: 1 },
    // group-buys widget is conditional — assert with a soft min using
    // a separate flagged assertion; for the seed dataset we know there
    // are 3 active group buys so min: 1 is safe.
    { kind: 'min-link-count', selector: '[data-testid="group-buy-row"]', min: 1 },
  ]),
},
```

Existing `home.spec.ts` (if any) keeps its h1 check — phase 6
adds nothing new there beyond the page-reads upgrades + a
home-specific `apps/e2e/tests/home.spec.ts` if needed for any
home-only interactivity (currently none — fall back to the smoke
walker if so).

## Verify gate

```bash
pnpm verify
```

(typecheck + unit + data:validate + build + e2e). All must pass
before commit.

## Commit body template

```
feat: home page family — phase 6

- /  replaces the phase 3 stub with hero pick, trending strip,
  latest-by-pillar grid, deep-dives long-reads rail, and the
  group-buys countdown widget.
- New primitives in packages/ui: <Sparkline>, <TrendDirectionGlyph>
  (reused by phase 8 trends tracker).
- New components under apps/web/src/components/home/: <ArticleCard>
  (4 variants), <TrendingStrip>, <LatestByPillar>, <HomeDeepDivesRail>,
  <GroupBuysWidget>, <HomeSectionHeading>.
- WebSite + ItemList JSON-LD; canonical /.
- Latest TrendSnapshot drives the trending strip; getActiveGroupBuys
  drives the widget; getArticlesByPillar drives the 4-up.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 6's `[ ]` → `[x]` in
`plan/steps/01_build_plan.md`, append commit hash. Commit and push.

## Follow-ups (out of scope this phase)

- Editorial / curated hero pick (phase 16 polish).
- Reader-builds row (phase 9 — ideas pillar).
- Inline newsletter signup (phase 15).
- Per-pillar more-links (the `/news`, `/trends` etc. landings ship
  in phases 7–11; the home links to them already).
- Trending tile → tracker row anchor links (phase 8).
- Group-buy row → `/group-buy/[slug]` (phase 13 retro-fits).
- Hero card OG image art beyond the wordmark default (phase 16).
