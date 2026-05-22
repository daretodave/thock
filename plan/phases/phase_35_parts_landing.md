# Phase 35 — /parts root browse landing

**Status:** shipped — `332ae7a`

## Outcome

New static route `/parts` that serves as the top-level catalog entry
point, completing the parts discovery triangle:
`/quiz/switch` → result → `/parts` → `/part/[kind]` → `/part/[kind]/[slug]`

## Why

Phase 21 shipped per-part detail pages and kind-index pages
(`/part/switch`, `/part/keycap-set`, `/part/board`). Phase 33 shipped
the `/quiz/switch` recommender. Phase 34 enriched the catalog to 20+
records. This phase closes the loop: a reader who doesn't know what
they're looking for can browse to `/parts`, pick a category, and land
on a kind-index. The quiz results page also gains a direct "Browse all
parts →" escape hatch so curious readers can explore beyond their
top-3 match.

## Scope

### New route — `apps/web/src/app/parts/`

- `page.tsx` — renders three categorical section rows (Switches ·
  Keycap sets · Boards) each showing record count and linking to the
  respective kind-index. Thin wrapper over `getAllSwitches()` /
  `getAllKeycapSets()` / `getAllBoards()` from the runtime adapter.
- `loading.tsx` — skeleton version of the three section rows.
- CollectionPage + BreadcrumbList (Home → Parts) + ItemList
  (one item per kind) JSON-LD via `@thock/seo`.
- Sitemap entry at priority 0.6.

### Fixture extensions

- `apps/e2e/src/fixtures/canonical-urls.ts` — adds `{ path: '/parts', pattern: '/parts', kind: 'html' }`.
- `apps/e2e/src/fixtures/page-reads.ts` — adds `/parts` entry with
  `h1-matches: /^parts$/i` + `min-link-count: parts-section-row ≥ 3`.

### E2E — `apps/e2e/tests/parts.spec.ts` (Phase 35 describe block)

4 new tests:
1. Renders eyebrow, H1, and three section rows.
2. Each section row links to the correct kind-index.
3. Emits CollectionPage + BreadcrumbList + ItemList JSON-LD.
4. Quiz results view carries a "Browse all parts" link
   (`data-testid="quiz-browse-all-parts-link"`, `href="/parts"`).

### Quiz affordance retrofit

`apps/web/src/components/quiz/SwitchQuiz.tsx` — results view (inside
`data-testid="quiz-results"`) gains:
```tsx
<Link href="/parts" data-testid="quiz-browse-all-parts-link">
  Browse all parts →
</Link>
```

## Decisions

- **No dedicated OG image** — `/parts` is a thin catalog index;
  the site-default OG (`/opengraph-image.png`) suffices. Per-family
  OG is worthwhile when a page has editorial identity; a catalog hub
  doesn't.
- **Section rows as `<Link>` wraps, not grid cards** — the three
  categories are navigation targets, not content items. A list of
  large link-rows with count + description provides the right
  information density without overpromising.
- **Loading skeleton mirrors the section structure** — three skeleton
  rows with identical dimensions so Suspense transitions don't cause
  layout shift.

## Tests shipped

- 4 new e2e tests in `apps/e2e/tests/parts.spec.ts` (Phase 35 block).
- `apps/e2e/tests/a11y.spec.ts` extended with `/parts` axe desktop
  coverage (shipped in subsequent drain commit `00da541`).
- `apps/web/src/__tests__/sitemap.test.ts` extended with `/parts`
  assertion (shipped in drain commit `00361e6`).
- `apps/e2e/tests/meta.spec.ts` extended with `/parts` JSON-LD type
  assertion (shipped in drain commit `1e17cd3`).
- SwitchQuiz unit test updated to filter `/parts` from relative-href
  checks (shipped alongside the affordance change in `332ae7a`).

## Follow-ups filed (post-ship audit drains)

All drained before this brief was written:

- `[test][3.6]` sitemap `/parts` assertion gap → `00361e6` (closes #166)
- `[test][4.5]` meta.spec.ts `/parts` JSON-LD gap → `1e17cd3` (closes #167)
- `[test][3.6]` SwitchQuiz quiz-browse-all-parts-link unit test → `c9272e0` (closes #168)
- `[a11y][4.0]` `/parts` missing from axe desktop suite → `00da541` (closes #169)
- `[seo][5.6]` `/part/[kind]` BreadcrumbList missing `/parts` node → `825d30b` (closes #171)
