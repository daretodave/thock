# Phase 14 — Search (`/search` + header affordance)

> Agent-facing brief. Concise, opinionated, decisive. Ships
> client-side full-text search backed by a MiniSearch index built
> at compile time. The header gets a real link (replacing the
> phase-1 disabled icon button). No third-party indexing, no
> server-side roundtrip.

## Routes (locked in `plan/bearings.md`)

- `/search` — replace the phase 4 stub.

## Sections (top → bottom)

1. **Header** — eyebrow `search`, italic display H1 `Search
   thock`, lede paragraph (locked).
2. **Input** — full-width search field with `name="q"`. Auto-focus
   on mount. Reads `?q=` on first render so deep-links from header
   suggestions or the eventual phase 16 404-soft "Did you mean?"
   work. Debounced 120ms before re-querying.
3. **Results** — list of `<ArticleResult>` rows: title, lede
   excerpt, pillar + tag chips, score-derived highlight count.
   Empty-query state shows a small "Try a switch name, brand, or
   tag" hint. Empty-results state shows "No matches for
   `<query>`" + a list of pillar links as fallback.

No spelling-correction UI, no faceted filters, no autocomplete.
The MVP is "type → see article hits" — refinements ship in
phase 16 polish if the seed grows.

## Index shape

A precomputed JSON file at
`apps/web/src/lib/search/index.generated.json` containing two
keys:

- `serialized` — `MiniSearch.toJSON()` output (the trie + posting
  lists).
- `documents` — array of `{ id, slug, title, lede, pillar, tags,
  publishedAt }` records, indexed by `id` (slug). Used to render
  results without re-reading the article files.

Builder script: `apps/web/scripts/generate-search-index.mts`
runs before `next build` (alongside `generate-data-manifest.mts`)
via the existing `prebuild` hook. Reads `getAllArticles()` from
`@thock/content`, instantiates MiniSearch with fields `title`
(weight 4) + `lede` (weight 2) + `body` (weight 1) + `tags`
(weight 3), serializes, writes JSON.

## Runtime helpers

`apps/web/src/lib/search/runtime.ts`:

- `loadSearchIndex()` — synchronous import of the JSON, returns
  `{ index: MiniSearch, documents: Record<id, doc> }`. Cached
  module-level so deserialization happens once per cold lambda.
- `searchArticles(query, limit = 25)` — queries the index, maps
  hits to documents, returns `{ id, slug, title, lede, pillar,
  tags, score }` rows.

## Components

### Reused (already shipped)

- `<TagChip>` (packages/ui) — chips inside results.
- Header search-icon button — repurpose as a `<Link
  href="/search">`.

### New

- `<SearchPanel>` in
  `apps/web/src/app/search/SearchPanel.tsx` — `'use client'`
  component owning the input + results state.
- `<ArticleResult>` in
  `apps/web/src/components/search/ArticleResult.tsx` — pure
  presentational row.
- `<HeaderSearchLink>` — replace the disabled `<button>` in
  `<Header>` with a `<Link>` carrying the same icon + tooltip.

## Cross-links

**In:**
- Header search icon → `/search`.
- Phase 16's 404-soft will deep-link to `/search?q=<slug>`
  (forward-compat — handled here by reading `?q=`).

**Out:**
- Each result → `/article/<slug>`.

**Retro-fit:** Header. The disabled `<button>` becomes an
anchor; one file edit.

## SEO

- `generateMetadata` — title `Search`, description = lede,
  canonical `/search`.
- JSON-LD: keep the existing `WebSite` + `BreadcrumbList`. No
  per-query JSON-LD (search results aren't crawlable content;
  the page itself is the entity).
- `robots: noindex` for `/search?q=…` URLs (any path with a
  query string). The bare `/search` stays indexable.

## Empty / loading / error states

- **Empty query** — input + hint. No skeleton; the client
  renders instantly once the JS loads.
- **No matches** — "No matches for `<query>`. Try a broader
  term, or browse a pillar." + 5 pillar links.
- **Loading** — colocated `loading.tsx`, header shape only.
- **Error** — colocated `error.tsx` 'use client'.

## Decisions made upfront — DO NOT ASK

- **Header affordance:** existing disabled `<button>` becomes a
  `<Link href="/search">`. No modal, no command palette. The
  modal is post-MVP if the seed warrants.
- **Lede copy (locked):** "Search every article, tag, and part
  across thock. Built locally — no third-party indexing." (Same
  as the phase 4 stub; matches the "no third-party data" voice
  from `bearings.md`.)
- **Field weights:** `title:4, tags:3, lede:2, body:1`. Title
  matches dominate; bodies still match because guides are
  long-form.
- **Body inclusion:** YES. Guides have keywords buried in body
  text that title alone won't surface.
- **Search across:** articles only for MVP. Tags/parts (the
  `data/` records) wait for phase 17 — the seed is too small to
  justify a polymorphic result row.
- **Result cap:** 25. Beyond that, the result set is too noisy;
  the user should refine the query.
- **Query debounce:** 120ms. Faster feels twitchy with the
  in-browser MiniSearch; slower feels broken.
- **No URL persistence beyond first load.** The input updates
  results in-place; we don't push history entries on every
  keystroke. A "share this query" button is post-MVP.
- **Stopword behaviour:** MiniSearch defaults (English).
- **Fuzzy match:** `fuzzy: 0.2, prefix: true`. Catches typos +
  partial words without flooding results.

## Mobile reflow

Single-column at every breakpoint (the input + results stack is
already mobile-native).

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `searchArticles` | returns ranked hits, applies field weights, handles empty query, applies fuzzy + prefix, caps at limit | n/a |
| `<SearchPanel>` | n/a (client component, covered by e2e) | input updates results, deep-link `?q=` populates input + results |
| `/search` | n/a | input visible, can type a known seed term and find ≥1 result, header link routes to /search |
| Header link | n/a | clicking the search icon navigates to /search |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/search`:

```ts
'/search': {
  pattern: '/search',
  ...html([
    { kind: 'h1-matches', pattern: /search/i },
    {
      kind: 'min-link-count',
      selector: 'input[type="search"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/search.spec.ts` covering input render, type
and find a result, deep-link `?q=`, and header-link navigation.

## Build pipeline

Add to `apps/web/package.json`:

```jsonc
{
  "scripts": {
    "prebuild": "pnpm build:manifest && pnpm build:search",
    "build:search": "tsx scripts/generate-search-index.mts"
  }
}
```

Hide `apps/web/src/lib/search/index.generated.json` from git via
existing `.gitignore` pattern (manifest already follows this
shape — `*.generated.json`).

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: search — phase 14

- /search ships full-text search over every article, powered by
  a MiniSearch index built at compile time. No third-party
  indexing, no server roundtrip.
- New apps/web/scripts/generate-search-index.mts wires the
  index into prebuild. Runtime helper at lib/search/runtime.ts.
- Header search icon becomes a real link.
- Field weights: title:4, tags:3, lede:2, body:1. Fuzzy 0.2,
  prefix true. Result cap 25; debounce 120ms.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 14's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups

- Search across tags/parts (phase 17).
- Command-palette modal (post-MVP).
- "Did you mean?" 404-soft in phase 16 reads from this index.
- `?q=` URL persistence with debounced history push (post-MVP).
- Highlighted snippets in result rows (post-MVP).
