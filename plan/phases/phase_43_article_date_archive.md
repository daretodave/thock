# Phase 43 — Article date archive `/archive`

**Status:** pending  
**Score:** 6.5 (pass-124 candidate; spec §5.3)  
**Depends on:** phases 1–42 (all shipped)

## Outcome

A static `/archive` route listing every article grouped by calendar month (newest
month first, articles within each month newest first). Delivers the "Archive by
date" requirement from spec §5.3. Adds a "Browse by date →" cross-link on `/tags`
so readers have a path from the tag-browsing surface to the date-browsing surface.

## Why

Spec §5.3 "Browsing & Discovery" lists four discovery surfaces: pillar pages,
tag pages, search, and archive by date. The first three shipped in phases 7–14.
The archive is the last missing surface; without it the spec has a gap and readers
have no way to browse the corpus chronologically.

## What ships

### Route
`apps/web/src/app/archive/page.tsx` — static, no params.

- Header: eyebrow "browse · by date", H1 "Archive", article count
- Body: `<ArchiveList>` rendering all month groups
- JSON-LD: CollectionPage + BreadcrumbList (Home → Archive) + ItemList
- `loading.tsx` with `<main id="main">` skeleton

### Components
`apps/web/src/components/archive/`
- `archiveUtils.ts` — pure `groupArticlesByMonth(articles)` helper returning
  `MonthGroup[]` sorted newest-month-first, articles within month newest-first.
  `MonthGroup = { key: string; label: string; articles: Article[] }`
- `ArchiveMonthGroup.tsx` — renders one month: heading + article count badge +
  article list rows (title → `/article/[slug]`, pillar chip)
- `ArchiveList.tsx` — iterates month groups, renders `<ArchiveMonthGroup>` per month

### Tests
- `apps/web/src/components/archive/__tests__/archiveUtils.test.ts` — unit tests
  for `groupArticlesByMonth` (ordering, grouping, empty input)
- `apps/web/src/components/archive/__tests__/ArchiveList.test.tsx` — render tests

### Fixtures + e2e
- `apps/e2e/src/fixtures/canonical-urls.ts` — add `/archive` static entry
- `apps/e2e/src/fixtures/page-reads.ts` — add `/archive` pattern entry
- `apps/e2e/tests/archive.spec.ts` — 5 tests: eyebrow+H1, month group renders,
  article links, JSON-LD, 375px no-scroll

### Cross-links
- `apps/web/src/app/tags/page.tsx` — add "Browse by date →" link to `/archive`
  below the TagsIndex, mirroring the quiz affordance on `/parts`

### Sitemap
- `apps/web/src/app/sitemap.ts` — add `/archive` at priority 0.5

## Decisions (pre-made, no user input needed)

- **No pagination:** fewer than 30 months at launch; show all.
- **Article row shape:** title (link) + pillar chip + read time. No lede.
- **Month label format:** "May 2026" (full month name + year).
- **Sort:** months newest-first; articles within month newest-first by publishedAt.
- **JSON-LD ItemList:** each item is an article (name = title, path = /article/slug).
  Limit to 50 items in the ItemList to avoid oversized JSON-LD; all articles still
  render in the DOM.
