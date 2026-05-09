# Phase 12 — Tag pages (`/tag/[slug]`)

> Agent-facing brief. Concise, opinionated, decisive. Replaces
> the phase 4 stub at `/tag/[slug]` with the canonical tag page —
> a categorical-tinted header + chronological article list. No
> hero, no archive cap. The list **is** the page; the categorical
> tint and the count are the personality.

## Routes (locked in `plan/bearings.md`)

- `/tag/[slug]` — replace the phase 4 stub. Every tag in
  `apps/web/src/content/tags.json` resolves; missing slugs
  `notFound()`.

## Sections (top → bottom)

1. **Tag header** — categorical-tinted eyebrow `tag · <category>`,
   italic display H1 `#<slug>` (the readable shape that the home
   feedback flagged: e.g. `#alice` is fine when paired with the
   `LAYOUT` category eyebrow), single-line lede with article
   count (`12 articles tagged Linear`), and a small "All tags"
   anchor back to a (post-MVP) `/tags` index — for now it links
   to `/`.
2. **Article list** — every article whose `frontmatter.tags`
   includes this slug, sorted by `publishedAt` desc, tie-break
   `slug` asc. Rendered as `<ArticleCard variant="row">` via
   the same composition pillar pages use.
3. **Empty state** — when the tag exists in `tags.json` but no
   article references it. One paragraph: "No articles are tagged
   `<name>` yet."

No hero card, no per-pillar grouping (the home + pillar pages
already cover that axis), no related-tags rail (post-MVP — we'd
need a co-occurrence count and the seed dataset is too small to
make that ranking meaningful).

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getTagBySlug(slug)` | manifest | resolve / 404 |
| `getArticlesByTag(slug)` | manifest | render rows |
| `getAllTags()` | manifest | tagsBySlug for `<ArticleCard>` chips |
| `sortArticlesForArchive(articles)` | shared (phase 7) | chronological sort |

No new helpers in `packages/`. The page uses the existing
`sortArticlesForArchive` from `PillarArchiveList.tsx`.

## Components

### Reused (already shipped)

- `<ArticleCard variant="row">` (phase 6).
- `<TagChip>` (packages/ui — already routes to `/tag/<slug>`).
- `<HomeSectionHeading>` (phase 6) — for the article-list section
  heading.

### New

None. The page is pure composition. All decoration (categorical
tint, eyebrow, H1 styling) sits inline using existing tokens —
no new component layer.

## Cross-link retrofit

This is the phase that **closes the cross-link loop on chips**.
Every place a `<TagChip>` already renders becomes a real link:

| Surface | Existing chip render | Action |
|---|---|---|
| Article body tag rail | `<TagChip>` static? | flip to default (linked) |
| Article card meta row | `<TagChip>` static | flip to default |
| Tag-page own header | n/a | not chipped (h1) |
| Header / footer nav | n/a | unchanged |

Search every file for `static` prop usage on `<TagChip>` and drop
it where the surrounding context is a regular page (not "inside a
larger link"). One audit grep, one batch edit.

## SEO

- `generateMetadata({ params })` — title `#<slug>`, description
  derived from category + count (`Articles tagged <Name> on
  thock — N pieces`), canonical `/tag/<slug>`. The phase 4 stub
  already shipped `generateMetadata`; upgrade it.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  the article list (no cap; tags are typically <50). Same shape
  as pillar pages.

## Empty / loading / error states

- **Tag exists, zero articles** — pillar header + one-paragraph
  empty panel: "No articles tagged `<name>` yet."
- **Tag missing** — `notFound()` (404).
- **Loading** — colocated `loading.tsx`, header-shape skeleton.
- **Error** — colocated `error.tsx` 'use client' identical in
  shape to phase 7/9/10/11.

## Decisions made upfront — DO NOT ASK

- **H1 shape:** italic `#<slug>` lowercase. The `#` is part of
  the visual identity, even though the `<TagChip>` family
  dropped `#` in favor of the category prefix. The page's
  category eyebrow carries that prefix; the H1 keeps the
  hash-tag form because it's the canonical URL fragment readers
  associate with tag pages.
- **Sort axis:** `publishedAt` desc; tie-break `slug` asc.
  Mirrors pillar archive sort.
- **No archive cap.** Tag pages can grow as long as the tag
  warrants. Pagination is a phase 16+ concern.
- **No related-tags rail.** Post-MVP.
- **Tag-page hero placement:** no hero. The list is the page;
  promoting one row over the rest contradicts "this is every
  article tagged X."
- **Cross-link retrofit batched here.** The `<TagChip>` already
  routes correctly when not `static`; the audit pass drops
  unnecessary `static` props in one commit alongside the page.

## Mobile reflow

Inherits the article-card row's existing mobile collapse.
Header eyebrow + H1 stack naturally.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/tag/[slug]` | n/a | renders `#<slug>` H1, ≥1 article-card-row when seed has matches, CollectionPage + ItemList JSON-LD, returns 404 for unknown slug |
| Cross-link retrofit | n/a | clicking a `<TagChip>` from `/article/[slug]` lands on `/tag/<slug>` and the H1 matches |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/tag/[slug]`:

```ts
'/tag/[slug]': {
  pattern: '/tag/[slug]',
  ...html([
    { kind: 'h1-matches', pattern: /^#/ },
    {
      kind: 'min-link-count',
      selector: '[data-testid="article-card-row"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/tag.spec.ts` covering the H1, the article
list, JSON-LD, the 404 path for an unknown slug, and the
chip→tag-page round-trip.

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: tag pages — phase 12

- /tag/[slug] replaces the phase 4 stub with the canonical tag
  page — categorical-tinted header, chronological article list,
  empty / 404 states. No hero; the list is the page.
- Cross-link retrofit: dropped unnecessary `static` props on
  <TagChip> instances so every chip across the site lands on
  /tag/<slug>.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical
  /tag/<slug>.
- Drains the open MED critique finding (/tag/[slug] stub).

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 12's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Move the open `[MED] /tag/[slug]` critique
finding from `Pending` → `Done` in the same commit (or a
follow-up if scope splits). Commit and push.

## Follow-ups

- `/tags` index page enumerating every tag with counts (phase 16).
- Related-tags rail driven by co-occurrence (post-MVP).
- Pagination beyond ~25 rows (phase 16).
- Per-tag OG image (phase 16).
