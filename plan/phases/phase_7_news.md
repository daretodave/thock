# Phase 7 — News pillar (`/news`)

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body. **Phase 7
> establishes the canonical pillar-landing structure. Phases 8 (the
> Trends pillar wrapper, not the tracker), 9, 10, 11 mirror this
> shape — only the eyebrow / lede / sort axis differ.**

## Routes (locked in `plan/bearings.md`)

- `/news` — replace the phase 4 stub with the full pillar landing.

The Trends Tracker (`/trends/tracker`) and tag pages (`/tag/[slug]`)
are out of scope; Trends pillar (`/trends`) ships with phase 8.

## Sections (top → bottom)

1. **Pillar header** — eyebrow `PILLAR · 01 of 05`, italic display
   `News`, lede paragraph (locked copy below), trailing right-rail
   pill linking to the pillar's RSS feed (`/feed/news.xml`). Bottom
   border hairline.
2. **Lead article** — newest article in `pillar = "news"` rendered
   as `<ArticleCard variant="hero">`. Hidden if zero news articles.
3. **Archive list** — every other news article in
   publishedAt-desc, rendered as `<ArticleCard variant="row">`.
   Section heading `kicker="Archive" title="All News pieces"`. Empty
   state when only the lead exists: hide the heading too. Empty
   state when zero articles total: render a one-paragraph
   "no-news-yet" panel with link back to `/`.
4. **Footer** — global footer (already shipped in phase 1).

The design's "On the rise" 3-up grid (mid-section between hero and
archive) is **deferred** to phase 8 / phase 16 — it requires either
a curated "featured" mechanism (post-MVP) or the trends tracker
(phase 8). News stays clean: lead + archive.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticlesByPillar('news')` | manifest filter | hero + archive |
| `getAllTags()` | manifest | tag-name + category for `<ArticleCard>` chips |

The pillar landing reads from one loader and renders one section
shape — the lightest page family in the build.

## Components

### Reused from `apps/web/src/components/home/` (phase 6)

- `<ArticleCard variant="hero">` — pillar lead.
- `<ArticleCard variant="row">` — archive rows.
- `<HomeSectionHeading>` — the kicker + title hairline pattern is
  reusable here. Renamed in phase 7? **No** — keep it under the
  `home/` folder for now; phase 8 lifts both `ArticleCard` and the
  section heading into a shared `apps/web/src/components/pillar/`
  module when it builds the second consumer (Trends pillar). Phase
  7 just imports them across the folder boundary. Document the call.

### New, in `apps/web/src/components/pillar/`

- **`<PillarHero>`** — eyebrow (`PILLAR · NN of 05`), italic display
  H1, lede paragraph, optional trailing-rail RSS link block.
- **`<PillarArchiveList>`** — wraps the archive rows. Hides when
  passed an empty list. Accepts a `tagsBySlug` map for chip lookups.

### Already shipped, no changes

- `<Container>`, `<Stack>`, `<TagChip>` from `@thock/ui`.
- `pillarLabel` / `pillarHref` from `@thock/seo`.

## Cross-links

**In** (already shipped — verify):
- Article-page eyebrow (`<ArticleHero>` from phase 5) already links
  to `/news` for `pillar="news"` articles. Verify the link still
  resolves to a real H1 (not a `PageStub`) post-deploy.
- Home page latest-by-pillar 4-up cards already link to news
  articles via `/article/[slug]` — those don't change.

**Out** (this phase ships these):
- Hero card → `/article/<slug>`.
- Archive rows → `/article/<slug>`.
- RSS pill → `/feed/news.xml` (phase 4 already serves the feed).
- Tag chips inside cards → `/tag/[slug]` (stub until phase 12).

**Header nav retro-fit:** the global header (`apps/web/src/components/ui/Header.tsx`)
already lists pillars. Verify the `News` link routes to the new
landing and styles `aria-current="page"` correctly. No header code
change needed unless a dropped link is found.

## SEO

- `generateMetadata` — title `pillarLabel('news')` + " — thock"
  suffix from `siteConfig.tagline` parity, description = the lede
  copy below, canonical `/news`.
- `buildJsonLd` — keep the existing `CollectionPage` + `BreadcrumbList`
  graphs already shipped in the phase 4 stub. **Add an `ItemList`**
  enumerating the pillar's articles (one `ListItem.url` per real
  article) so search engines see the pillar as a curated set. Cap
  at 25 entries (matches the design's archive density before
  pagination would kick in; pagination ships in phase 16).
- No per-route OG image yet — `/news/opengraph-image.tsx` is
  deferred to phase 16. The default site OG (wordmark on warm
  black) covers the surface.

## Empty / loading / error states

- **No articles in pillar** — render the pillar header + a
  one-paragraph empty panel: "No news yet. The editorial side
  warms up shortly. ← back to home". Hide the archive heading and
  list. Production has 1 news article in seed content so this is a
  defensive branch.
- **Only the lead, no archive** — render the lead, hide the archive
  heading, hide the archive list.
- **Loading** — `loading.tsx` colocated with `page.tsx`: skeleton
  pillar header + skeleton hero card + 3 skeleton row cards. Mirror
  `apps/web/src/app/article/[slug]/loading.tsx`'s shape.
- **Error** — `error.tsx` 'use client' boundary identical in
  structure to the article one (red-tinted mono digest, "Try again"
  button + back-to-home link).

## Decisions made upfront — DO NOT ASK

- **Lede copy (locked):** "Curated coverage of mechanical keyboard
  releases, vendor moves, and the broader industry beat." Same as
  the phase 4 stub so the existing description metadata stays
  consistent across CollectionPage JSON-LD and OG.
- **Hero pick:** newest article by `publishedAt` in
  `pillar = "news"`. No editorial-pin mechanism this phase
  (phase 16 polish revisits if/when curation lands).
- **Archive sort:** `publishedAt` desc. Tie-break by slug asc for
  stability across builds.
- **Archive cap:** 25 rows. If the pillar grows past 25, the
  trailing 26+ are silently dropped and a TODO row at the bottom
  notes "Older News pieces are archived per-tag — pagination lands
  in phase 16." For seed content (1 article) this never triggers.
- **Pillar number copy:** `01 of 05` for News, `02 of 05` for
  Trends, `03 of 05` for Ideas, `04 of 05` for Deep Dives, `05 of
  05` for Guides. The order is locked by `PILLARS` in
  `@thock/seo/pillars.ts`.
- **`<PillarHero>` placement of the RSS pill:** right side at `lg:`,
  stacks below the lede on mobile. The pill renders a small mono
  block matching the design's "trends-tracker" right-rail block —
  reuse the same Tailwind classes for visual consistency across
  pillar pages.
- **`<PillarHero>` italics:** the H1 displays the pillar label with
  italic stress on a single token (per the design's `<em>`
  treatment). For News the whole word is italicized (`<em>News</em>`)
  since it's a single short word.
- **Pillar header bottom border:** 1px hairline matching the
  article hero's `border-b border-border`. No design-export-pinned
  divider art.
- **Container width:** standard `<Container>` (78rem max). The
  pillar landing matches the home page composition width, not the
  article's reading column.
- **Mobile reflow:** RSS pill stacks below the lede; archive rows
  drop to single-column with the row card's existing
  `sm:grid-cols-[200px_1fr]` reflow handling the rest.

## Mobile reflow

- Pillar header → `flex-col gap-6` then `lg:flex-row lg:items-end`
  for the RSS pill side-by-side at desktop.
- Archive list inherits `<ArticleCard variant="row">`'s reflow
  (image stacks above body at `<sm:`).
- No new responsive utilities introduced; Tailwind's `sm:` / `lg:`
  cover the reflow.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/news` (pillar landing) | n/a | renders H1 matching `/news/i`, ≥1 article-card link, canonical link, JSON-LD ItemList; no horizontal scroll at 375px |
| `<PillarHero>` | renders eyebrow + italic H1 + lede; renders RSS pill when `feedHref` provided; hides RSS pill when null | n/a |
| `<PillarArchiveList>` | renders one row per article in input order; hides itself + heading slot when input is empty; respects `max` cap | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/news`:

```ts
'/news': {
  pattern: '/news',
  ...html([
    { kind: 'h1-matches', pattern: /news/i },
    { kind: 'min-link-count', selector: '[data-testid="article-card-row"], [data-testid="hero-card"]', min: 1 },
  ]),
},
```

Add a dedicated `apps/e2e/tests/news.spec.ts` for pillar-specific
checks (hero is the newest news article, RSS pill links to
`/feed/news.xml`, ItemList JSON-LD present).

## Verify gate

```bash
pnpm verify
```

(typecheck + unit + data:validate + build + e2e). All must pass
before commit.

## Commit body template

```
feat: news pillar — phase 7

- /news replaces the phase 4 stub with the canonical pillar
  landing — pillar header, hero pick, archive list.
- New components in apps/web/src/components/pillar/: <PillarHero>,
  <PillarArchiveList>. Reused from home: <ArticleCard> (hero/row),
  <HomeSectionHeading>.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical /news.
- RSS pill links to /feed/news.xml (already served by phase 4).

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 7's `[ ]` → `[x]` in
`plan/steps/01_build_plan.md`, append commit hash. Commit and push.

## Follow-ups (out of scope this phase)

- "On the rise" featured row — needs either a curated `featured`
  flag or the trends tracker (phase 8 / phase 16).
- Pagination beyond 25 rows (phase 16).
- Per-pillar OG image art (phase 16).
- Lifting `<ArticleCard>` and `<HomeSectionHeading>` to a shared
  `pillar/` module — defer until phase 8 ships the second consumer.
- Author landing pages (out of roadmap until phase 16+).
