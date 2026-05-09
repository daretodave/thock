# Phase 16 — Polish (`/404`, `/about`, `/sources` + a11y audit)

> Agent-facing brief. Concise, opinionated, decisive. Ships the three remaining PageStub pages with real content + JSON-LD + e2e, and lists the deferred polish items (a11y audit, 404-soft for missing article slugs, MDX `<Source>` auto-extraction) as audit rows so the next /iterate tick picks them up. Phase 16's original scope had ~7 deliverables; three of them already shipped earlier today (mobile hamburger menu in pass-1 critique drain, per-pillar OG handlers in the brand-asset drain, footer newsletter CTA in phase 15), so the residual work is tighter than the build-plan row implies.

## Routes (locked in `plan/bearings.md`)

- `/about` — replace the phase 4 PageStub.
- `/sources` — replace the phase 4 PageStub.
- `/404` — root-level `app/not-found.tsx`. Article and tag routes already have their own `not-found.tsx` (phase 5 + phase 12); this is the global fallback for paths that don't match any route at all.

## In scope this tick

1. **`apps/web/src/app/not-found.tsx`** — branded global 404.
   Eyebrow `404`, italic display H1 `Lost in the layout`, lede explaining the misroute, an inline search affordance pointing at `/search`, and a five-link pillar nav so the reader recovers in one click. JSON-LD `BreadcrumbList` (Home → 404).
2. **`/about`** — replace PageStub with real editorial copy.
   Eyebrow `about`, italic display H1 `who we are`, lede locked, body covering: what thock covers (the four pillars), voice (knowledgeable peer, lowercase wordmark, mono on technical terms), how trends scoring works (one paragraph linking `/trends/tracker`), how we handle vendor relationships (the "no affiliate arrangement" disclosure that already lives in the Mode Sonnet R2 article verbatim — extract and reuse). JSON-LD `WebSite` + `BreadcrumbList`.
3. **`/sources`** — replace PageStub with a citation-philosophy page.
   Eyebrow `sources`, italic display H1 `where we got the facts`, lede explaining thock's stance on citations, a section listing every article that uses inline `<Source>` references with a count + link to the article. The full per-citation index (link → article + quote) is **deferred** to a future tick (see Follow-ups) — the MDX walker is non-trivial. This tick ships the per-article aggregate. JSON-LD `WebSite` + `BreadcrumbList`.

No new routes outside the three above. Sitemap already enumerates `/about` and `/sources` (phase 4); `/404` is correctly excluded.

## Components

New under `apps/web/src/components/about/` and `apps/web/src/components/sources/`:

- `apps/web/src/components/about/AboutBody.tsx` — server component, renders the locked sectioned copy (pillars / voice / trends scoring / vendor disclosure).
- `apps/web/src/components/sources/SourceCounts.tsx` — server component, accepts a list of `{ article, sourceCount }` rows and renders a sectioned list grouped by pillar.
- `apps/web/src/components/not-found/RootNotFound.tsx` — client-or-server component with the inline search input that POSTs to `/search?q=…`. (Server component; the input is a `<form action="/search" method="get">` so no client JS needed.)

Existing primitives reused: `<Container>`, `<Stack>`, `<Wordmark>` from `@thock/ui`; `<HomeSectionHeading>` from `apps/web/src/components/home/`; `<JsonLd>` + `buildMetadata` + `buildBreadcrumbListJsonLd` + `buildWebSiteJsonLd` from `@thock/seo`; `<TagChip>` if any cross-link makes sense.

A new helper in `packages/content/src/util/`:

- `countSourceTags(body: string): number` — pure regex over the MDX body string counting `<Source ` occurrences. The body string is already loaded by `getAllArticles()`. Unit-tested with 0/1/many cases.

## Cross-links

- **In (verify):** Footer's Newsletter / RSS / About / Sources links (phase 15 footer) all resolve.
- **Out (ship):**
  - `/404` links to the five pillars (`/news`, `/trends`, `/ideas`, `/deep-dives`, `/guides`) plus a search input.
  - `/about` links to `/trends/tracker` (paragraph on scoring) and `/sources` (paragraph on citations).
  - `/sources` links to each article that has ≥1 `<Source>`.
- **Retro-fit:** none. Footer already lists About + Sources + RSS + Newsletter.

## SEO

| Route | Title | JSON-LD |
|---|---|---|
| `/about` | `About` | WebSite + BreadcrumbList |
| `/sources` | `Sources` | WebSite + BreadcrumbList |
| `/404` (not-found) | `Page not found` | BreadcrumbList only |

`buildMetadata({ title, description, path })` for each, mirroring the existing PageStubs' calls.

## Empty / loading / error states — copy locked

- `/sources` empty state (no articles with `<Source>` yet — won't trigger today since several seed articles use it but worth covering): "Articles with cited sources show up here. We're adding them as the catalog grows."
- `/404` empty input: input shows placeholder "search articles, switches, builds…" and submitting empty does nothing.

## Decisions made upfront — DO NOT ASK

1. **`/404` is `app/not-found.tsx` at the route root**, not a hard `/404` route. Next.js's App Router conventions: any `not-found.tsx` is the fallback for its segment. The root `not-found.tsx` covers every unmatched path.
2. **The `/404` search input is a native HTML form POSTing to `/search` (method="get")** — no client JS, no debounce. The /search page already handles `?q=` deep-links from phase 14.
3. **`/sources` ships the article-aggregate, not the per-citation index.** The MDX `<Source>` walker would need to parse every body, extract every `<Source href= text= />`, dedupe by href, and surface (article, citation, quote) tuples. That's the right v2 but not phase-16 scope. The aggregate (article-level count) is enough to demonstrate citation hygiene.
4. **`/about` voice is locked from `plan/bearings.md`** — knowledgeable peer, lowercase "thock", mono on technical terms (Newsreader headlines / Plex Sans body / Mono accent). No "we" first-person if it can be avoided in editorial writing; first-person is fine in /about specifically since the page is about the masthead.
5. **No author photo, no team page.** thock's bearings entry locks `author: thock` for every article (phase 4b). The /about page reflects that singular voice.
6. **No comments / discussion thread on /about or /sources.** Out of spec; thock doesn't have a comments system.
7. **`/404` does NOT include "Did you mean?" suggestions via MiniSearch.** That's the 404-soft feature for `/article/<unknown-slug>` and `/tag/<unknown-slug>`. Different scope, different ranking criterion, deferred.
8. **`countSourceTags` uses a literal regex, not an AST parse.** The MDX bodies are simple enough that `/<Source\s/g` is sufficient. False positives are vanishingly unlikely (no other component starts with `<Source `).

## Mobile reflow

- `/404`: H1 sizes down via Tailwind responsive classes; pillar links stack vertically on `<sm`.
- `/about`: prose-paragraph max-width caps at `60ch` regardless of viewport; section headings at `mt-12 sm:mt-16`.
- `/sources`: article rows stack regardless of viewport.

## Pages × tests matrix

| Surface | Unit | E2E | Notes |
|---|---|---|---|
| `<AboutBody>` | ✓ (renders all sections) | rendered via /about | locked copy contract |
| `<SourceCounts>` | ✓ (empty + populated + sort by pillar) | rendered via /sources | data-driven |
| `<RootNotFound>` | n/a | rendered for `/this-route-doesnt-exist` | tests the form action |
| `countSourceTags` | ✓ (0 / 1 / many / regex edge cases) | n/a | pure helper |
| /404 (any unknown path) | n/a | renders the 404 + pillar links + search form | global fallback |
| /about | n/a | H1 + sections + JSON-LD | replaces stub |
| /sources | n/a | H1 + ≥1 article row + JSON-LD | replaces stub |

## Verify gate

`pnpm verify` must run clean. The known PageStub `#418` transient self-resolves once /about + /sources stop rendering PageStub (the audit row in `plan/AUDIT.md` predicted phase 16 would close this — leave the audit row open for now and let the next /iterate audit pass close it after deploy).

## Commit body template

```
feat: polish — /404 + /about + /sources — phase 16

- /404 (app/not-found.tsx): branded global fallback with pillar nav + search input.
- /about: editorial standards + voice + four-pillar overview.
- /sources: citation philosophy + per-article aggregate (count of <Source> tags).
- countSourceTags helper in @thock/content; SourceCounts + AboutBody + RootNotFound components.

Decisions:
- /404 search is a native form action="/search" — no client JS.
- /sources ships aggregate, not the per-citation index. Walker deferred (see brief).
- a11y audit + 404-soft for unknown article/tag slugs + MDX <Source> walker → audit rows for /iterate.
```

## DoD

- [x] /about, /sources PageStubs gone; real pages render.
- [x] app/not-found.tsx renders for any unknown path.
- [x] countSourceTags helper exported from @thock/content.
- [x] Three new components + tests; one new helper + tests.
- [x] All three pages have JSON-LD + buildMetadata.
- [x] `pnpm verify` green; deploy READY.
- [x] Build plan ticked: phase 16 → `[x]` with the addressing commit hash.
- [x] Audit rows for the three deferred items (a11y / 404-soft / source walker) appended to `plan/AUDIT.md`.

## Follow-ups (out of scope this phase)

- **A11y audit pass** — contrast against the OKLCH tokens, focus rings on every interactive, alt text on every `<img>`, heading order, keyboard nav. Tracked as a `category: a11y` audit row.
- **404-soft for `/article/<unknown-slug>`** — currently renders the article's not-found.tsx (phase 5). Add MiniSearch-powered "Did you mean?" suggestions. Same for `/tag/<unknown-slug>`.
- **`/sources` per-citation index** — MDX walker that extracts every `<Source href= text= />` tuple, dedupes by href, surfaces (article, quote, source) rows. Probably wants its own ship-data flow + new content type.
- **Footer enrichment** — add "Last build: <iso>" + "Built with [stack]" small print. Cosmetic.
