# Phase 4 — URL contract + hermetic e2e infrastructure

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body.
> **Substrate phase — every later page family inherits the
> `@thock/seo` helpers, the URL stubs, the sitemap/robots/RSS, and
> the hermetic e2e harness this phase ships.**

## Scope (one-liner)

Lock the URL contract: every route in `bearings.md` exists with a
real or stub page, every URL has SEO + canonical + JSON-LD via
`@thock/seo`, the sitemap enumerates everything, RSS feeds work,
and the hermetic Playwright harness walks every canonical URL on
each `pnpm verify`.

## Outputs

```
packages/seo/                                    # @thock/seo (new)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── siteConfig.ts                            # canonical metadata (moved from apps/web/src/lib/)
    ├── canonicalUrl.ts
    ├── buildMetadata.ts
    ├── buildJsonLd.ts                           # WebSite, Article, BreadcrumbList, CollectionPage
    ├── pillars.ts                               # Pillar → display label / href
    └── __tests__/
        ├── canonicalUrl.test.ts
        ├── buildMetadata.test.ts
        ├── buildJsonLd.test.ts
        └── pillars.test.ts

apps/web/src/app/                                # routes (new + edits)
├── sitemap.ts                                   # enumerate all canonical URLs
├── robots.ts                                    # /robots.txt
├── feed.xml/route.ts                            # global RSS
├── feed/[pillar]/route.ts                       # per-pillar RSS
├── article/
│   ├── [slug]/page.tsx                          # stub: H1 + lede; phase 5 replaces with full template
│   └── [slug]/not-found.tsx
├── tag/
│   ├── [slug]/page.tsx                          # stub: tag chip + name; phase 12 fills in
│   └── [slug]/not-found.tsx
├── news/page.tsx                                # stub: H1 + "soon" copy
├── trends/page.tsx                              # stub
├── trends/tracker/page.tsx                      # stub (phase 8 ships)
├── ideas/page.tsx                               # stub
├── deep-dives/page.tsx                          # stub
├── guides/page.tsx                              # stub
├── group-buys/page.tsx                          # stub (phase 13 ships)
├── about/page.tsx                               # stub
├── newsletter/page.tsx                          # stub
├── search/page.tsx                              # stub
└── sources/page.tsx                             # stub

apps/web/src/components/page-stub/               # shared stub component
├── PageStub.tsx
└── __tests__/PageStub.test.tsx

apps/web/src/lib/siteConfig.ts                   # DELETED (lives in @thock/seo now)
apps/web/src/app/layout.tsx                      # imports siteConfig from @thock/seo
apps/web/src/app/opengraph-image.tsx             # imports siteConfig from @thock/seo
apps/web/src/app/page.tsx                        # imports siteConfig from @thock/seo + buildMetadata
apps/web/src/components/ui/Header.tsx            # nav unchanged (already real); confirm it links

apps/e2e/src/                                    # NEW — hermetic e2e fixtures
├── fixtures/
│   ├── canonical-urls.ts                        # derived from @thock/content + @thock/data
│   ├── page-reads.ts                            # typed assertions per URL pattern
│   └── __tests__/canonical-urls.test.ts         # the deriver itself is unit-tested under @thock/e2e
└── tsconfig.json (extended `include`)

apps/e2e/tests/
├── smoke.spec.ts                                # walks every canonical URL — 200 + page-reads contract
├── mobile/
│   └── smoke.mobile.spec.ts                     # walks every canonical URL at 375px
└── (existing home-only specs deleted — superseded by walker)

plan/steps/01_build_plan.md                      # tick phase 4 [x] + log commit hash
```

## Routes (every URL the contract enumerates)

Static:
- `/` — home (already shipped — phase 6 replaces with full composition).
- `/news`, `/trends`, `/trends/tracker`, `/ideas`, `/deep-dives`, `/guides` — pillar landings (phases 7–11 fill in).
- `/about`, `/newsletter`, `/search`, `/sources`, `/group-buys` — landing stubs.
- `/sitemap.xml`, `/robots.txt`, `/feed.xml` — route handlers.
- `/feed/news.xml`, `/feed/trends.xml`, `/feed/ideas.xml`, `/feed/deep-dives.xml`, `/feed/guides.xml` — per-pillar.

Dynamic:
- `/article/[slug]` — every slug from `getAllArticles()`.
- `/tag/[slug]` — every slug from `getAllTags()`.

`getActiveGroupBuys()` records do not get individual URLs (group-buy
detail pages are out of scope; group buys are listed only on
`/group-buys` and the home widget).

## Content / data reads

| Helper | Source | Use |
|---|---|---|
| `getAllArticles()` | `@thock/content` | sitemap, RSS, canonical-urls fixture |
| `getArticleBySlug(slug)` | `@thock/content` | `/article/[slug]` stub |
| `getArticlesByPillar(pillar)` | `@thock/content` | per-pillar RSS feed |
| `getAllTags()` | `@thock/content` | sitemap, canonical-urls fixture |
| `getTagBySlug(slug)` | `@thock/content` | `/tag/[slug]` stub |
| `getActiveGroupBuys()` | `@thock/data` | `/group-buys` stub (count only) |

## `@thock/seo` surface

```ts
// siteConfig.ts — single source of truth
export const siteConfig = {
  name: 'thock',
  url: 'https://thock-coral.vercel.app',
  description: '…',
  tagline: 'keyboards, deeply.',
  publisher: {
    '@type': 'Organization',
    name: 'thock',
    url: 'https://thock-coral.vercel.app',
  },
} as const

// canonicalUrl.ts
export function canonicalUrl(path: string): string
//  - normalizes leading/trailing slashes; '/' → siteConfig.url
//  - throws on non-leading-slash paths

// buildMetadata.ts
export function buildMetadata(input: {
  title: string                 // page-specific (template applies "<title> — thock")
  description: string
  path: string                  // canonical path, e.g. '/article/foo'
  ogImage?: string              // optional override; falls back to /opengraph-image.png
  type?: 'website' | 'article'
  publishedAt?: string          // ISO; only for type=article
  updatedAt?: string
}): Metadata                    // Next's Metadata type

// buildJsonLd.ts — small set; one helper per JSON-LD shape we use
export function buildWebSiteJsonLd(): WebSite
export function buildArticleJsonLd(input: {
  headline: string
  description: string
  path: string
  publishedAt: string
  updatedAt?: string
  author: string
  heroImage?: string | null
}): Article
export function buildBreadcrumbListJsonLd(crumbs: { name: string; path: string }[]): BreadcrumbList
export function buildCollectionPageJsonLd(input: {
  name: string
  description: string
  path: string
}): CollectionPage

// pillars.ts — single source for pillar display ↔ slug
export const PILLARS = [
  { slug: 'news',       label: 'News',       href: '/news' },
  { slug: 'trends',     label: 'Trends',     href: '/trends' },
  { slug: 'ideas',      label: 'Ideas',      href: '/ideas' },
  { slug: 'deep-dives', label: 'Deep Dives', href: '/deep-dives' },
  { slug: 'guides',     label: 'Guides',     href: '/guides' },
] as const
export function pillarLabel(slug: Pillar): string
export function pillarHref(slug: Pillar): string
```

The package has **no peer on `next`** in production code — it
imports `Metadata` as a `type` only (compiled away). Tests use
plain object equality, not Next runtime.

## Stub page composition (`<PageStub>` shared component)

```tsx
<PageStub
  eyebrow="news"               // optional kicker line (mono, accent)
  title="News"
  lede="Curated coverage…"
  status="placeholder"         // | "phase-deferred"
  deferredTo="Phase 7"         // optional — surfaces "lands in <phase>" line
/>
```

Stub renders:
- `<Container>` → `<Stack gap={4}>`:
  - eyebrow line (mono, uppercase, accent-mu).
  - H1 in serif, type-1 size, lower-case text.
  - lede paragraph (text-2, max-w 60ch).
  - "Lands in phase N" mono micro-line if `deferredTo` is set.

Tests assert each prop renders, plus default fallback when only
`title` is given.

## SEO per route (every page calls `buildMetadata` + a JSON-LD shape)

| Route | metadata title | JSON-LD |
|---|---|---|
| `/` | (default) | WebSite |
| `/news` etc. (pillars) | "<Pillar>" | CollectionPage + BreadcrumbList |
| `/trends/tracker` | "Trends Tracker" | CollectionPage + BreadcrumbList |
| `/article/[slug]` | frontmatter.title | Article + BreadcrumbList |
| `/tag/[slug]` | "#<tag>" | CollectionPage + BreadcrumbList |
| `/group-buys` | "Group buys" | CollectionPage |
| `/about`, `/sources`, `/newsletter`, `/search` | "About" / etc. | WebSite |

JSON-LD is rendered inline as `<script type="application/ld+json">`
in each page's body (Next-recommended approach for App Router).
A small helper `<JsonLd graph={…}>` in `@thock/seo/JsonLd` renders
it; one helper used everywhere.

## Sitemap / robots / RSS

- `app/sitemap.ts` uses `MetadataRoute.Sitemap`. Yields:
  - every static URL above
  - every `getAllArticles()` slug as `/article/<slug>` with `lastModified = updatedAt ?? publishedAt`
  - every `getAllTags()` slug as `/tag/<slug>`
  - the per-pillar RSS feeds (`/feed/<pillar>.xml`)
- `app/robots.ts` — allow all; references `siteConfig.url + '/sitemap.xml'`.
- `app/feed.xml/route.ts` — Atom-flavored RSS over the **20 most recent articles** across all pillars. `Content-Type: application/rss+xml; charset=utf-8`.
- `app/feed/[pillar]/route.ts` — same shape, filtered to one pillar; 404 if pillar not in `PILLARS`.

RSS shape: minimal valid `<rss version="2.0">` with `<channel>` (title, link, description, lastBuildDate) + `<item>` per article (title, link, description=lede, pubDate, guid=canonical url). No HTML body in description. **Validate in unit test** — parse as XML and check structure.

## Cross-link retrofit (in this phase)

- `<Header>` already links to `/news`, `/trends`, `/ideas`, `/deep-dives`, `/guides` — verify each link 200s after stubs ship.
- `<Footer>` already links to `/about`, `/sources`, `/newsletter`, `/feed.xml` — verify after route handlers + stubs ship.
- `apps/web/src/components/home/HomeArticleList.tsx` — already routes `/article/<slug>`; verify after article stub ships.

No structural rewrites of existing pages.

## Hermetic e2e infrastructure

### `apps/e2e/src/fixtures/canonical-urls.ts`

```ts
import { getAllArticles, getAllTags } from '@thock/content'
import { PILLARS } from '@thock/seo'

export type CanonicalUrl = {
  path: string                  // e.g. '/article/foo'
  pattern: string               // e.g. '/article/[slug]' (key into pageReads)
}

export function getCanonicalUrls(): CanonicalUrl[] {
  // Order: static URLs → dynamic articles → dynamic tags → feeds.
  // De-dupe + sort by path for stable test reports.
}
```

The function is **pure** (it reads through `@thock/content` /
`@thock/data` loaders, which read JSON/MDX synchronously at module
load). Playwright tests call it once at file load.

### `apps/e2e/src/fixtures/page-reads.ts`

```ts
export type PageRead = {
  pattern: string                 // '/article/[slug]'
  assertions: PageAssertion[]
}

export type PageAssertion =
  | { kind: 'h1-present' }
  | { kind: 'h1-matches'; pattern: RegExp }
  | { kind: 'has-canonical-link' }
  | { kind: 'no-console-errors' }
  | { kind: 'no-horizontal-scroll-at-375' }
  | { kind: 'response-content-type'; matcher: RegExp }
  | { kind: 'min-link-count'; selector: string; min: number }

export const pageReads: Record<string, PageRead>
```

Phase 4 ships entries for every URL pattern that exists after this
phase. Each later page family appends/upgrades its entry.

### `apps/e2e/tests/smoke.spec.ts`

Walks `getCanonicalUrls()`. For each URL:
- assert HTTP 200 (or 301 to a 200 if applicable — none planned for phase 4).
- if HTML: run page-reads assertions.
- if XML/text (sitemap/robots/feeds): assert content-type + no console errors are vacuously true.
- assert no console errors across all pages (collected per test).

Target wall time under 60s on a developer machine; Playwright
parallel workers handle the URL list. Use `test.describe.parallel`
+ a generated `test.each` over the URLs.

### `apps/e2e/tests/mobile/smoke.mobile.spec.ts`

Same walker, mobile project (375×800). Asserts
`scrollWidth - clientWidth ≤ 1` per URL.

### Harness wiring

- `apps/e2e/package.json` — add `@thock/content` + `@thock/data` + `@thock/seo` as workspace deps so fixtures can import them.
- `apps/e2e/tsconfig.json` — extend `include` to cover `src/**/*`.
- `apps/e2e/playwright.config.ts` — already wired. No changes (still boots `next start -p 4173`).

## `pnpm verify` — gate confirmed

```
pnpm typecheck   # passes across new @thock/seo + apps/e2e/src + apps/web
pnpm test:run    # +seo unit tests + page-stub test + canonical-urls deriver test
pnpm data:validate
pnpm build       # next build with all new routes
pnpm e2e         # smoke walker desktop + mobile
```

The e2e leg is now the **hard gate** every later phase relies on.

## Empty / loading / error states

- **Stub pages** — render the `<PageStub>` component; that *is* the empty state until the family ships. Copy is decisive: `"News — curated coverage of mechanical keyboard releases and industry moves. Lands in phase 7."`
- **`/article/[slug]` not found** — `notFound()` triggers `not-found.tsx` with copy `"That article doesn't exist (yet)."` + a link home. Phase 5 polishes.
- **`/tag/[slug]` not found** — `notFound()` triggers `not-found.tsx` with copy `"No tag with that name."` + a link home.
- **`/feed/[pillar]` unknown pillar** — return a 404 response (`new Response(null, { status: 404 })`).
- **Loading** — none yet (RSC default; phase 5 introduces `loading.tsx`).
- **Error** — Next default `error.tsx` is fine for stubs.

## Decisions made upfront — DO NOT ASK

- **Move `siteConfig` to `@thock/seo` and delete the apps/web shim.** No backwards-compat re-export. All three current consumers (layout, opengraph-image, page) update their import in this commit. Per bearings hard rules — no shims when you can change the call sites.
- **`@thock/seo` does not depend on `next`.** Imports `Metadata` as `type` only. Keeps the package portable and unit-tested without a Next runtime.
- **JSON-LD via `<JsonLd>` component** rendered inline in the page body, not via `dangerouslySetInnerHTML` in a route segment. App Router supports this cleanly with `<script type="application/ld+json">{JSON.stringify(graph)}</script>`.
- **Single shared `<PageStub>`** instead of nine bespoke stubs. The brief's whole point is "this URL exists and 200s"; visual variety lands when each family's real implementation ships.
- **RSS uses RSS 2.0**, not Atom. Lower friction for the universe of feed readers; `lastBuildDate` and `pubDate` use RFC-822.
- **RSS truncates to 20 items** in the global feed, **all items per pillar** in pillar feeds (pillars are smaller). Pagination (`<atom:link rel="next">`) is out of scope until any pillar exceeds 50.
- **Sitemap includes per-pillar RSS feeds** as `xml` items (not just HTML). Crawlers like that.
- **Article stub at `/article/[slug]`** renders `<H1>title</H1>` + lede + a "Phase 5 ships the canonical template" mono note. The full body, related rail, mentioned-parts rail, JSON-LD `Article` body — phase 5 owns. Phase 4 ships the URL existing + canonical link + minimum JSON-LD `Article` (headline + datePublished + author + url) so the contract holds.
- **Tag stub at `/tag/[slug]`** renders `<TagChip>` (existing primitive) + tag name H1 + "Phase 12 ships" note + a count of articles tagged. No article list yet.
- **Pillar stubs (`/news`, `/trends`, `/ideas`, `/deep-dives`, `/guides`)** — title + lede from a `PILLARS_COPY` map in the page file (not in seo or bearings — pure phase-4 stub copy). Each calls `getArticlesByPillar` and renders the count as a mono line ("12 articles · 8 tags") so the page isn't visually empty. Real pillar UI lands in 7–11.
- **`/trends/tracker`** — separate stub (own page.tsx). Phase 8 builds it.
- **`/group-buys`** stub renders count of `getActiveGroupBuys()` ("3 active group buys; full index lands in phase 13"). Phase 13 ships the index.
- **`/about`, `/newsletter`, `/search`, `/sources`** — minimal `<PageStub>`. Phase 16 polishes /about and /sources; phase 14 ships /search; phase 15 ships /newsletter form.
- **The smoke walker is one test file** parametrized over URLs, not many test files. Reads cleaner; Playwright's parallel runner handles the load.
- **`canonical-urls.ts` is pure (sync)** because content/data loaders are. No `await` chains.
- **`@thock/seo` exports `PILLARS`** — moved from `apps/web/src/components/ui/Header.tsx`'s local const. Header re-imports. Single source of truth.
- **Update `Header.tsx`** to read `PILLARS` from `@thock/seo` (one-line change). No other Header changes.
- **Sitemap returns absolute URLs** (`siteConfig.url + path`), not relative — Next requires absolutes for `loc`.
- **Robots is permissive** — `User-agent: *`, `Allow: /`. References sitemap. No disallow rules.
- **OG default route handler** stays at `/opengraph-image.png` (already shipped phase 1). Phase 16 polishes per-family.

## Mobile reflow

- Stub pages stack naturally — Container's max-width handles the column. No new media queries.
- Article stub: H1 sizes down via `text-h1 sm:text-display`.
- All routes pass the 375px no-horizontal-scroll assertion in the mobile walker.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `@thock/seo/canonicalUrl` | normalizes paths; throws on bad input | n/a |
| `@thock/seo/buildMetadata` | sets title template, canonical, og | n/a |
| `@thock/seo/buildJsonLd` (each helper) | shape matches schema.org type | n/a |
| `@thock/seo/pillars` | label + href round-trip | n/a |
| `<PageStub>` | renders title, eyebrow, lede, deferredTo line | n/a |
| `canonical-urls.ts` (deriver) | includes static + dynamic URLs; de-dupes | n/a |
| `app/sitemap.ts` | snapshot test asserts every contract URL is present | n/a |
| `app/robots.ts` | snapshot — User-agent, sitemap line | n/a |
| `app/feed.xml/route.ts` | XML parses; root is `<rss>`; ≥1 `<item>` | walker checks content-type |
| `app/feed/[pillar]/route.ts` | same; unknown pillar → 404 | walker checks 200 for each known pillar |
| Every static + dynamic URL | n/a | smoke walker desktop + mobile |
| `/article/[slug]` (404 path) | n/a | unknown slug → 404 page |
| `/tag/[slug]` (404 path) | n/a | unknown slug → 404 page |

## Verify gate

`pnpm verify` — typecheck + test:run + data:validate + build + e2e.
All must pass before commit. The e2e leg is now the canonical harness
every later phase inherits.

## Commit body template

```
feat: url contract + hermetic e2e infra — phase 4

- @thock/seo (siteConfig, canonicalUrl, buildMetadata, buildJsonLd,
  pillars). siteConfig moved out of apps/web; consumers updated.
- Every URL contract route exists with a stub or real page.
- /sitemap.xml, /robots.txt, /feed.xml, /feed/[pillar].xml.
- <PageStub> shared across nine landing stubs.
- @thock/seo/JsonLd component renders structured data inline.
- apps/e2e/src/fixtures/canonical-urls.ts derives every URL from
  @thock/content + @thock/data; smoke walker hits each at desktop
  + mobile. Hermetic — next start on :4173, no external network.
- pnpm verify gate now includes the walker; e2e is a hard pre-push
  gate.

Decisions:
- siteConfig moved to @thock/seo; no backwards-compat shim.
- @thock/seo has no runtime dep on next; type-only Metadata import.
- One <PageStub> instead of bespoke per-family stubs (real UI ships
  family-by-family in phases 5–17).
- RSS 2.0 (not Atom); 20 most recent in global feed, all per pillar.
- Article stub minimal — only H1 + lede + JSON-LD Article skeleton;
  phase 5 ships the canonical template.
- Tag stub renders count of articles + chip; phase 12 ships index.
- Smoke walker is one parametric spec, not many spec files.
```

## DoD

Tick `[ ] Phase 4` → `[x]` in the "Status (at-a-glance)" block of
`plan/steps/01_build_plan.md`. Append commit hash to phase log.

## Follow-ups (out of scope this phase)

- Per-family OG art beyond the route default — phase 16 polish.
- Article body MDX render + tag rail + related rail — phase 5.
- Tag page article list — phase 12.
- Group-buy index card grid — phase 13.
- Pillar landing card cascades — phases 7–11.
- /search input — phase 14.
- /newsletter Buttondown embed — phase 15.
- /sources index aggregation — phase 16.
- JSON-LD validation against schema.org via build-time script — phase 17.
- RSS pagination — only when any pillar > 50 articles.
