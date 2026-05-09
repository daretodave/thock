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
- [x] Phase 1 — Monorepo bootstrap (root install, `apps/web` Next.js, `packages/tokens`, `packages/ui`, `packages/tsconfig`, `apps/e2e`, Netlify deploy verified) — `3ffa51c`
- [x] Phase 2 — `@thock/data` package (Zod schemas → JSON Schema, validate script, loaders for switches/keycap-sets/boards/vendors/group-buys/trends, 1 seed record per type) — `fdc3489`
- [x] Phase 3 — `@thock/content` package + seed articles (MDX loaders, frontmatter Zod, tags.json taxonomy, 6 seed articles across pillars, 3 seed group buys) — `21f153e`
- [x] Phase 4 — URL contract + hermetic e2e infrastructure (every route from bearings exists with stub or real page; `@thock/seo` with buildMetadata + JSON-LD + canonicalUrl + siteConfig; sitemap.xml; robots.txt; global + per-pillar RSS feeds; **`canonical-urls` fixture**; **`page-reads` fixture**; **smoke walker over every canonical URL**; **mobile spec template**; **`pnpm verify` runs e2e against `next start` on `:4173` as a hard gate**) — `fc1b0b0`
- [x] Phase 4b — Production runtime hotfix + content cleanup (P0; prepended via `/oversight` 2026-05-08 after phase 4 deployed and every dynamic route returned HTTP 500. Root cause: `@thock/data`'s `import.meta.url` + walk-for-`pnpm-workspace.yaml` didn't resolve in the bundled lambda. Shipped: pre-built data manifest under `apps/web/src/lib/data-runtime/manifest.generated.json` consumed by a thin adapter (all 15 apps/web call sites migrated); new `pnpm deploy:smoke` post-push gate; fabricated author bylines replaced with `thock`; host migrated from Netlify to Vercel after Netlify's free-tier credits ran out. All 10 production probes 2xx on `thock-coral.vercel.app`. **Detailed brief: `phase_4b_runtime_fix.md`.**) — `d0147cc` + `1b3944c`

**Page families (phases 5–13):**
- [x] Phase 5 — Article page (canonical template — `/article/[slug]`) — hero/byline/body/tag-rail/mentioned-parts/related-articles components, JSON-LD Article + BreadcrumbList, MDX render via `next-mdx-remote/rsc`, dep bumped to v6 to clear Vercel's vulnerability gate — `e41499c` + `15e6617`
- [x] Phase 6 — Home (`/` — hero pick, trending, latest-by-pillar, group-buys widget) — `f41bdeb`
- [x] Phase 7 — News pillar (`/news`) — `80a0290`
- [x] Phase 8 — Trends pillar + Trends Tracker (`/trends`, `/trends/tracker`) — `accb74f`
- [x] Phase 9 — Ideas & Builds pillar (`/ideas`) — `5597401`
- [x] Phase 10 — Deep Dives pillar (`/deep-dives`) — `cea650a`
- [x] Phase 11 — Guides pillar (`/guides`) — `dbb8323`
- [x] Phase 12 — Tag pages (`/tag/[slug]`) — `4612d9b`
- [x] Phase 13 — Group Buys (`/group-buys` + home widget retrofit) — `16380cd`

**Cross-cutting (phases 14–17):**
- [x] Phase 14 — Search (`/search` + header search affordance, MiniSearch index built at build time) — `aa46fed`
- [ ] Phase 15 — Newsletter signup + RSS finalize (Buttondown embed, `/newsletter`, per-pillar feeds validated)
- [ ] Phase 16 — Polish (`/404`, `/about`, `/sources`, footer, OG image templates per family, mobile menu, accessibility audit pass)
- [ ] Phase 17 — Performance + meta (sitemap completeness, JSON-LD audit, lighthouse pass, image optimization audit, bundle size budget)

> **After phase 17:** the loop transitions to `/iterate` — content
> gaps, data gaps, link rot, OG art, ongoing trend snapshots.
> `/march` makes that transition automatic.

> **Note on Netlify deploys before phase 1 ships:** auto-publishing
> stays on; deploys will fail until `apps/web/` exists. The deploy
> gate (`pnpm deploy:check`, run as Step 12 in every shipping
> skill) reports the failure clearly. Phase 1's first push trips
> it; the patch loop within phase 1 iterates to a green deploy.
> From phase 2 onward, a red `deploy:check` is a real regression
> requiring root-cause patching.

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
clean. Push triggers a host build to thock-coral.vercel.app and
the deploy is green. **Detailed brief: `phase_1_bootstrap.md`.**

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

### Phase 4 — URL contract + hermetic e2e infrastructure

**Substrate this phase ships once and every later phase reuses.**

`@thock/seo` package: `buildMetadata`, `buildJsonLd`, `canonicalUrl`,
`siteConfig`. `apps/web/src/app/sitemap.ts` enumerating every route
from the URL contract. `app/robots.ts`. `app/feed.xml/route.ts`
(global RSS) and `app/feed/[pillar]/route.ts`. `<Header>` gets the
canonical pillar nav. Empty-but-valid pillar routes (each `/news`,
`/trends`, etc. returns a stub page with the right `<title>` so
sitemap + crawling work; full pillar UIs land in phases 7–11).
`app/opengraph-image.tsx` site-default OG image (used as fallback
when per-route OG isn't set).

**Hermetic e2e infrastructure (the test harness every later phase
inherits):**

- `apps/e2e/src/fixtures/canonical-urls.ts` — single source of
  truth listing every URL the site serves, derived programmatically
  from `@thock/content` + `@thock/data` (so every article slug,
  every tag slug, every active group buy gets included
  automatically). The sitemap and the smoke walker both consume
  this fixture.
- `apps/e2e/src/fixtures/page-reads.ts` — a typed map keyed by URL
  pattern (e.g. `/article/[slug]`) declaring what each page family
  fetches and asserts (e.g. "renders H1, ≥1 tag chip, footer; no
  console errors; no horizontal scroll at 375px"). Each later
  page-family phase appends its entry; phase 4 ships the type and
  the article + home + pillar entries (filled out as those phases
  ship — phase 4 ships the empty registry + types).
- `apps/e2e/tests/smoke.spec.ts` — walks every entry in
  `canonical-urls.ts`, asserts the response is 200 + valid HTML +
  no console errors. Target: full walk in under 60s. Runs against
  `next start` on `:4173` (hermetic — the production build, no
  external network).
- `apps/e2e/tests/mobile/smoke.mobile.spec.ts` — same walk at
  375×800 viewport asserting `scrollWidth - innerWidth ≤ 1` per
  page.
- `apps/e2e/playwright.config.ts` — `webServer` boots
  `pnpm --filter @thock/web build && pnpm --filter @thock/web start
  -p 4173` and waits for the port; `webServer.reuseExistingServer:
  !CI`. Hermetic by design.
- `pnpm verify` runs `typecheck → test:run → data:validate → build
  → e2e`. **E2E is a hard gate** — a red e2e is a blocked push.
  No `--no-verify`, no skipping.

After phase 4, every page-family phase (5–13) ships its own
`page-reads` entry + a per-family e2e spec; the smoke walker
catches everything else for free.

### Phase 4b — Production runtime hotfix + content cleanup

Prepended via `/oversight` 2026-05-08 after phase 4 deployed.
The deploy went green but every dynamic route on the live site
(`/article/[slug]`, `/tag/[slug]`, `/sitemap.xml`, `/feed.xml`,
`/feed/[pillar].xml`) returned HTTP 500. Root cause: the
`@thock/data` loader uses `import.meta.url` to walk up to
`pnpm-workspace.yaml`, which doesn't resolve in Netlify's
bundled lambda. The local `pnpm verify` passed because the e2e
harness runs against `next start` with the full repo on disk;
production runs in an isolated function. Phase 4b ships: (1) a
loader fix that works in any runtime — recommended path is
pre-built manifests under `apps/web/.thock-data/` consumed by
the loaders; (2) a new `pnpm deploy:smoke` post-push gate that
hits one URL per pattern against `https://thock-coral.vercel.app`
and exits non-zero on any non-2xx, closing the gap that let
the regression through; (3) replacement of fabricated author
bylines (`Mara Lin`, `Reza Patel`, `Tess Aoyama`) with
`thock` across all 6 seed articles per user directive.
**Detailed brief: `phase_4b_runtime_fix.md`.**

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

**Locked embed snippets (provided by user via /oversight
2026-05-09T12:30Z — embed verbatim, theme via Tailwind classes
only, do NOT mutate the action / hidden field semantics):**

Buttondown form (footer + dedicated `/newsletter` page):

```html
<form
  action="https://buttondown.com/api/emails/embed-subscribe/throc"
  method="post"
  class="embeddable-buttondown-form"
>
  <label for="bd-email">Enter your email</label>
  <input type="email" name="email" id="bd-email" />
  <input type="submit" value="Subscribe" />
  <p>
    <a href="https://buttondown.com/refer/throc" target="_blank">
      Powered by Buttondown.
    </a>
  </p>
</form>
```

Notes for the implementer:
- The Buttondown handle in the URL is `throc` as provided by the
  user (NOT `thock`). Preserve verbatim — they may have
  registered the handle that way intentionally.
- Style with Tailwind utility classes inside a thin wrapper
  component; do not change the form's `action`, `method`, or
  input `name` attributes.
- Show "Powered by Buttondown" attribution; small mono link in
  the same accent color as the rest of the secondary chrome.

Google Tag Manager (root-of-page; embed in `apps/web/src/app/layout.tsx`):

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-58T839ZD');</script>
<!-- End Google Tag Manager -->
```

Notes for the implementer:
- GTM container ID is `GTM-58T839ZD`. Wire via Next's `<Script>`
  component with `strategy="afterInteractive"` to keep core
  vitals clean. Drop into the root `layout.tsx` head block (or
  near the top of `<body>` per Next/GTM convention).
- No consent gate yet — thock collects no PII; GTM is page-level
  pageview tracking only. If we add forms beyond Buttondown,
  revisit and gate via the standard consent banner.
- Add a `// per /oversight 2026-05-09 — GTM container locked`
  comment so the next loop tick doesn't re-litigate the choice.

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

phase 1 — 3ffa51c — monorepo bootstrap; apps/web (Next 15), apps/e2e (Playwright), packages/{tokens,ui,tsconfig,data-stub}; pnpm verify green.
phase 2 — fdc3489 — @thock/data: 6 Zod schemas + JSON Schema generation + 6 loaders + validate CLI w/ cross-refs; 1 seed record per entity (cannonkeys, gateron-oil-king, gmk-olivia, mode-sonnet, mode-sonnet-r2 GB, 2026-W19 trends); 32 new unit tests.
phase 3 — 21f153e — @thock/content: frontmatter schema + tag taxonomy (38 tags) + loaders + MDX component registry; 6 curator-drafted seed articles (one per pillar + Trends Tracker preview) cross-referencing the phase-2 data seeds; phase-1 home replaced with HomeArticleList; +27 unit tests, 65 total.
phase 4 — fc1b0b0 — @thock/seo (siteConfig + canonicalUrl + buildMetadata + buildJsonLd + PILLARS + JsonLd); every URL-contract route shipped as a stub or real page (12 stubs + 2 dynamic stubs + sitemap + robots + global + per-pillar RSS); shared <PageStub>; hermetic e2e walker over every canonical URL (desktop + 375px mobile) wired into `pnpm verify` as the canonical harness; +27 seo tests, +21 web tests, +6 e2e fixture tests, 123 e2e tests across desktop + mobile.
phase 4b — d0147cc + 1b3944c — production runtime hotfix: pre-built data manifest at apps/web/src/lib/data-runtime/manifest.generated.json (regenerated as a `prebuild` step), thin adapter exposing the @thock/content + @thock/data API; all 15 apps/web call sites migrated from package imports to the runtime adapter so the bundled lambda no longer needs filesystem walks; fabricated author bylines (Mara Lin, Reza Patel, Tess Aoyama) replaced with `thock`; pnpm deploy:smoke probes one URL per pattern against the live site and exits non-zero on any non-2xx; host migration from Netlify to Vercel (driven by Netlify free-tier exhaustion, which independently surfaced the regression that the manifest fix addresses). 10/10 live probes pass on thock-coral.vercel.app; +12 data-runtime tests, 174 unit + 123 e2e total.
