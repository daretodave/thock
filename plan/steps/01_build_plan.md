# 01 — Build plan

> Style guardrails for every phase below. Always ship unit tests
> alongside code — never "add tests later". Break work into small,
> focused components in folders; never jam-pack a single file. Pure
> helpers go in their own `.ts` modules with their own tests; React
> components live in folders with sub-section components and a
> colocated `__tests__/`. Prefer 5 small files with clear names
> over 1 dense file. The verify gate enforces this; reviewers and
> the next loop tick depend on it.

## Status (at-a-glance)

`/march`, `/ship-a-phase`, and (transitively) `/loop` read this
block to find the next phase. Format: `[ ]` pending → `[x]` shipped
(with commit hash). Tick in this file in the same commit that ships
the phase.

**Substrate (phases 1–4):**
- [ ] Phase 1 — Monorepo bootstrap (root install, `apps/web` Next.js, `packages/tokens`, `packages/ui`, `packages/tsconfig`, `apps/e2e`, Netlify deploy verified)
- [ ] Phase 2 — `@thock/data` package (Zod schemas → JSON Schema, validate script, loaders for switches/keycap-sets/boards/vendors/group-buys/trends, 1 seed record per type)
- [ ] Phase 3 — `@thock/content` package + seed articles (MDX loaders, frontmatter Zod, tags.json taxonomy, 6 seed articles across pillars, 3 seed group buys)
- [ ] Phase 4 — URL contract scaffolding (every route from bearings exists with stub or real page; `@thock/seo` with buildMetadata + JSON-LD + canonicalUrl + siteConfig; sitemap.xml; robots.txt; global + per-pillar RSS feeds)

**Page families (phases 5–13):**
- [ ] Phase 5 — Article page (canonical template — `/article/[slug]`)
- [ ] Phase 6 — Home (`/` — hero pick, trending, latest-by-pillar, group-buys widget)
- [ ] Phase 7 — News pillar (`/news`)
- [ ] Phase 8 — Trends pillar + Trends Tracker (`/trends`, `/trends/tracker`)
- [ ] Phase 9 — Ideas & Builds pillar (`/ideas`)
- [ ] Phase 10 — Deep Dives pillar (`/deep-dives`)
- [ ] Phase 11 — Guides pillar (`/guides`)
- [ ] Phase 12 — Tag pages (`/tag/[slug]`)
- [ ] Phase 13 — Group Buys (`/group-buys` + home widget retrofit)

**Cross-cutting (phases 14–17):**
- [ ] Phase 14 — Search (`/search` + header search affordance, MiniSearch index built at build time)
- [ ] Phase 15 — Newsletter signup + RSS finalize (Buttondown embed, `/newsletter`, per-pillar feeds validated)
- [ ] Phase 16 — Polish (`/404`, `/about`, `/sources`, footer, OG image templates per family, mobile menu, accessibility audit pass)
- [ ] Phase 17 — Performance + meta (sitemap completeness, JSON-LD audit, lighthouse pass, image optimization audit, bundle size budget)

> **After phase 17:** the loop transitions to `/iterate` — content
> gaps, data gaps, link rot, OG art, ongoing trend snapshots.
> `/march` makes that transition automatic.

---

## Per-phase scope

Each row above corresponds to one phase. The detailed brief lives
at `plan/phases/phase_<N>_<topic>.md`. If a brief is missing when
the loop reaches its phase, the loop generates one from the scope
below + `phase_5_article.md` (canonical template) + any matching
`design/<family>/` export.

### Phase 1 — Monorepo bootstrap

Stand up the monorepo skeleton: root install works, `apps/web` is
a Next.js 15 app that renders a placeholder home page with header +
footer, `packages/tokens` exports the design-token CSS + TS,
`packages/ui` exports `<Wordmark>`, `<Mono>`, `<Container>`,
`packages/tsconfig` provides shared TS configs, `apps/e2e` runs a
single Playwright spec against the dev server. `pnpm verify` runs
clean. Push triggers a Netlify build to thock.netlify.app and the
deploy is green. **Detailed brief: `phase_1_bootstrap.md`.**

### Phase 2 — `@thock/data` package

`packages/data/` with Zod schemas for `switch`, `keycap-set`,
`board`, `vendor`, `group-buy`, `trend`. Generated JSON Schema
files at `data/schemas/`. Loaders (`getAllSwitches`, `getSwitchBySlug`,
etc.) with full unit tests. Validate script at `pnpm
--filter @thock/data validate` that walks `/data/` and validates
every JSON record + cross-references. Hook it into `pnpm verify`.
1 seed record per entity type so the loaders have something to
return. `data/README.md`, `data/BACKLOG.md` (empty), `data/AUDIT.md`
(empty).

### Phase 3 — `@thock/content` package + seed articles

`packages/content/` with `getAllArticles`, `getArticleBySlug`,
`getArticlesByPillar`, `getArticlesByTag`, `getAllTags`,
`getActiveGroupBuys`, `getRelatedArticles`. Frontmatter Zod schema.
Tag taxonomy in `apps/web/src/content/tags.json` (categories:
switch / layout / material / brand / profile / misc). 6 seed MDX
articles (one per pillar + one Trends Tracker preview). Custom MDX
component registry exported from `@thock/content/mdx`. Unit tests
for every loader. The home page from phase 1 is updated to render
a list of articles to prove the pipeline (full home page is
phase 6).

### Phase 4 — URL contract scaffolding

`@thock/seo` package: `buildMetadata`, `buildJsonLd`, `canonicalUrl`,
`siteConfig`. `apps/web/src/app/sitemap.ts` enumerating every route
from the URL contract. `app/robots.ts`. `app/feed.xml/route.ts`
(global RSS) and `app/feed/[pillar]/route.ts`. `<Header>` gets the
canonical pillar nav. Empty-but-valid pillar routes (each `/news`,
`/trends`, etc. returns a stub page with the right `<title>` so
sitemap + crawling work; full pillar UIs land in phases 7–11).
`app/opengraph-image.tsx` site-default OG image (used as fallback
when per-route OG isn't set).

### Phase 5 — Article page (canonical template)

`/article/[slug]` — the entity hub for editorial content. Hero with
big image, eyebrow (pillar name as link), H1, lede, byline +
read-time. Body renders MDX via `@thock/content/mdx` registry. Tag
rail. "Mentioned in this article" rail (parts referenced via
frontmatter or inline `<PartReference>`). Related articles rail
(same pillar or shared tags). JSON-LD `Article`. **This is the
structural template every later page family copies.** Detailed
brief: `phase_5_article.md`.

### Phase 6 — Home

`/` — hero pick (`featured: true` article, falls back to newest),
trending row (top 5 by recent + a `popularityScore` from
frontmatter), latest by each pillar (one row per pillar with 3–4
cards), group-buys-ending-soon widget (top 3 by `endDate`).
Newsletter CTA in footer (signup form is phase 15; phase 6 ships
an inert form pointing at `/newsletter`).

### Phase 7 — News pillar

`/news` — pillar landing. Hero card + large cards + row cards
cascade per `bearings.md`. Sort: newest first. JSON-LD:
`CollectionPage`. Header nav highlights the current pillar.

### Phase 8 — Trends pillar + Trends Tracker

`/trends` — same pillar template as news. Plus `/trends/tracker` —
the **signature** Trends Tracker dashboard. Tracker rows: name,
category (switch / keycap / layout / vendor / brand), direction
glyph (up / down / flat), week score, sparkline. Data source:
`data/trends/<YYYY-WW>.json` via `@thock/data`. Each row links to
the trend's deep-dive article if linked. Empty rows render with
"early data" muted styling.

### Phase 9 — Ideas & Builds pillar

`/ideas` — pillar template. "Build of the week" featured slot at
top (picks article tagged `build-of-the-week` with most recent
`publishedAt`). Otherwise standard cascade.

### Phase 10 — Deep Dives pillar

`/deep-dives` — pillar template. Read-time displayed prominently
(audience expects long-form). Sort by length descending as a v1
default — most ambitious deep dives surface first.

### Phase 11 — Guides pillar

`/guides` — pillar template. Sectioned by `guideSection`
frontmatter (firmware, modding, switches, keycaps). Sort by
`updatedAt` desc within each section so freshness signals are
honest.

### Phase 12 — Tag pages

`/tag/[slug]` — every tag in `tags.json` gets a page. Shows tag
name + category-tinted chip, count, article list. Cross-link
retrofit: every `<TagChip>` everywhere is now clickable. JSON-LD:
`CollectionPage`.

### Phase 13 — Group Buys

`/group-buys` — index of active group buys (sorted by `endDate`
asc). Each card: image, vendor, dates, region, external link with
`rel="sponsored noopener"`. Cross-link retrofit: home page
group-buys widget verifies it reads from the same `@thock/data`
loader (no duplication).

### Phase 14 — Search

`/search` — title + body + tag search powered by a MiniSearch index
built at build time. Header gets a search affordance (icon → modal
or `/search` route — pick whichever is simpler). Index registers in
`@thock/content/search`.

### Phase 15 — Newsletter signup + RSS finalize

Replace the inert footer form from phase 6 with a Buttondown embed.
Dedicated `/newsletter` page with archive of past digests (read
from `apps/web/src/content/newsletters/*.mdx` if any exist;
otherwise empty state). Per-pillar RSS feeds finalized — every
`/feed/<pillar>.xml` route validates against an RSS schema.

### Phase 16 — Polish

- `/404` — branded not-found page with search box and pillar links.
- `/about` — editorial standards, voice, who we are.
- `/sources` — index of every citation across the site (collected
  from inline `<Source>` components in MDX at build time).
- Footer — full nav, RSS link, newsletter CTA, copyright.
- `app/opengraph-image.tsx` per family — final OG templates.
- Mobile hamburger menu in `<Header>` (deferred from phase 1).
- Accessibility audit: contrast, focus rings, alt text, keyboard nav.
- 404-soft: missing article slug renders not-found with "Did you
  mean?" via MiniSearch.

### Phase 17 — Performance + meta

- Sitemap completeness: every URL the site can serve is listed.
- JSON-LD audit: every page has the right type; validate against
  schema.org via a build-time script.
- Lighthouse pass: target ≥ 95 across the board on `/` and
  `/article/[slug]`.
- Image optimization audit: every image goes through `next/image`
  with `priority` only on hero.
- Bundle-size budget: write a `pnpm size` script that fails CI if
  the homepage JS exceeds 200KB gzipped.

---

## Carry-overs / known gaps (update as phases ship)

(Empty until phases ship. Add `[-]` rows for partial-but-shipped
phases with linked notes here.)

## Phase log (commit hashes)

(Empty until phase 1 ships. One line per shipped phase, format:
`phase <N> — <commit hash> — <one-line summary>`.)
