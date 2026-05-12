# Phase 28 — `/tags` index page

> Brief drafted on-demand by `/ship-a-phase` (cloud tick 2026-05-12).

## Outcome

A browsable index at `/tags` listing every tag on thock, grouped by the
six categories (switch, layout, brand, material, profile, misc). Each
chip links to `/tag/<slug>` and carries its categorical tint. The
`/tag/[slug]` back-link is updated from `← home` to `← all tags` → `/tags`
(drains CRITIQUE pass-2 row — the link was labelled untruthfully before
`/tags` existed).

## Why

Tag pages already exist (phase 12) but there is no starting surface that
lets a reader browse all tags at once. The design brief (decisions.jsx)
explicitly calls out a "global tag index groups by category first"
pattern. Without `/tags`, the only discovery path is tag chips inside
articles — search-first, not browse-first.

## Scope

### New route

`apps/web/src/app/tags/page.tsx` (static — no dynamic params):
- Reads `getAllTags()` from `@/lib/data-runtime`
- Groups tags by category in display order: switch → layout → brand →
  material → profile → misc
- Renders a `<TagGroup>` per category with a categorical-tinted heading
  and a row of `<TagChip>` links
- CollectionPage + BreadcrumbList + ItemList JSON-LD
- `export const metadata = buildMetadata(...)` (static)

### New components

`apps/web/src/components/tags/`:
- `TagsIndex.tsx` — receives `tags: Tag[]`, groups by category, renders
  `<TagGroup>` per category
- `TagGroup.tsx` — receives `{ category, tags }`, renders tinted heading
  + chip row
- `__tests__/TagsIndex.test.tsx` — unit tests for grouping logic and
  render (mock `@thock/content` at the module boundary)

### Cross-link retrofit

`apps/web/src/app/tag/[slug]/page.tsx` — update the `← home` back-link
to `← all tags` pointing at `/tags`.

### Sitemap

`apps/web/src/app/sitemap.ts` — add `/tags` as a static entry
(priority 0.5).

### E2E fixture

`apps/e2e/src/fixtures/canonical-urls.ts` — add
`{ path: '/tags', pattern: '/tags', kind: 'html' }` to `STATIC`.

### E2E tests

`apps/e2e/tests/tags.spec.ts`:
- `/tags` renders eyebrow + H1 (`data-testid="tags-h1"`)
- At least one tag group heading is visible per category
- Each chip has `href="/tag/<slug>"`
- CollectionPage + ItemList JSON-LD emitted
- Back-link on `/tag/linear` now points to `/tags`

## JSON-LD

```
@graph: [
  CollectionPage { name: "All tags", path: "/tags" },
  BreadcrumbList [ Home → All tags ],
  ItemList { name: "Tags — all categories", items: all tag slugs }
]
```

## Decisions (pre-decided)

- Category display order: switch → layout → brand → material → profile →
  misc. Matches editorial prominence (switch taxonomy is most-used;
  misc is catch-all last).
- No OG image override — site-default OG suffices for an index page.
- No pagination — 60 tags is well under the 30-entry floor.
- Category headings use `text-tag-<category>` tint class from the
  existing `CATEGORY_TINT` map already in `/tag/[slug]/page.tsx`.

## Definition of done

- [ ] `/tags` renders at 200 with H1 "All tags"
- [ ] Tags grouped by category, chips link to `/tag/<slug>`
- [ ] `/tag/[slug]` back-link → `/tags`
- [ ] CollectionPage + ItemList JSON-LD present
- [ ] Sitemap includes `/tags`
- [ ] `pnpm verify` green
- [ ] Phase issue #60 closed via `Closes #60` trailer
