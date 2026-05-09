# Phase 10 — Deep Dives pillar (`/deep-dives`)

> Agent-facing brief. Concise, opinionated, decisive. Mirrors
> phase 7 (News) and phase 9 (Ideas) — the only twist is the sort
> axis: deep-dives sorts by `readTime` descending so the most
> ambitious pieces surface first, matching the audience's
> expectation that this pillar carries the long-form work.

## Routes (locked in `plan/bearings.md`)

- `/deep-dives` — replace the phase 4 stub with the canonical
  pillar landing.

## Sections (top → bottom)

1. **Pillar header** (`<PillarHero>`) — eyebrow `PILLAR · 04 of 05`,
   italic display H1 `Deep Dives`, lede paragraph (locked), single
   right-rail RSS pill.
2. **Lead article** — longest-read article in `pillar = "deep-dives"`,
   sorted by `readTime` desc, tie-break `publishedAt` desc.
   Rendered as `<ArticleCard variant="hero">`.
3. **Archive list** — every other deep-dives article in the same
   sort order, rendered as `<ArticleCard variant="row">` via
   `<PillarArchiveList>`. Cap 25.

The design's "On the rise" featured row stays deferred (per phase
7 brief's rationale — needs a curated featured mechanism that
doesn't exist).

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticlesByPillar('deep-dives')` | manifest | hero + archive |
| `getAllTags()` | manifest | tag-name + category for chips |

Same shape as phase 7 / 9 — only the sort comparator differs.

## Components

### Reused (already shipped)

- `<PillarHero>` (phase 7).
- `<ArticleCard variant="hero">` and `variant="row">` (phase 6).
- `<PillarArchiveList>` (phase 7).
- `<HomeSectionHeading>` (phase 6).

### New

None at the component layer. A small page-local helper
`sortDeepDivesByLength` (in
`apps/web/src/app/deep-dives/helpers.ts`) returns the article list
sorted by `readTime` desc, tie-break `publishedAt` desc. Pure,
unit-tested.

## Cross-links

**In:**
- Article-page eyebrow for `pillar="deep-dives"` already links to
  `/deep-dives`; verify it lands on the real H1.
- Home page deep-dives long-reads rail (phase 6) already links to
  individual articles; no retro-fit.

**Out:**
- Cards → `/article/<slug>`.
- RSS pill → `/feed/deep-dives.xml` (already served).
- Tag chips inside cards → `/tag/<slug>` (stub until phase 12).

**Retro-fit:** none. Header nav already lists Deep Dives.

## SEO

- `generateMetadata` — title `Deep Dives`, description = lede,
  canonical `/deep-dives`.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  deep-dives articles (≤ 25). Same shape as phase 7 / 9.

## Empty / loading / error states

- **No articles in pillar** — pillar header + one-paragraph
  empty panel: "No deep dives yet. The long reads land soon."
- **Loading** — colocated `loading.tsx`, pillar-shape skeleton.
- **Error** — colocated `error.tsx` 'use client' identical in
  shape to phase 7 / 9.

## Decisions made upfront — DO NOT ASK

- **Lede copy (locked):** "Long-form, sourced, and unhurried. The
  pieces that earn a quiet evening and a fresh cup of coffee."
  Same as the phase 4 stub.
- **Sort:** `readTime` desc; tie-break `publishedAt` desc; final
  tie-break by slug asc for stability across builds.
- **Read-time display in archive cards:** the `<ArticleCard>`
  meta row already shows `{readTime} min read`. No additional
  amplification — the archive is already a list of long reads,
  the read-time per row stays at its current weight (text-small).
- **Hero `<ArticleCard>` read-time:** also unchanged. The pillar
  identity ("long-form") is signaled by the lede + the consistent
  sort, not by oversized read-time numbers.
- **Archive cap:** 25. Beyond 25, drop silently; pagination ships
  in phase 16 polish.

## Mobile reflow

Inherits phase 7's pillar reflow.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/deep-dives` | n/a | renders H1 matching `/deep dives/i`, ≥1 article-card link, RSS pill links to /feed/deep-dives.xml, ItemList JSON-LD present |
| `sortDeepDivesByLength` | sorts by readTime desc, tie-break publishedAt desc, then slug asc; handles empty input | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/deep-dives`:

```ts
'/deep-dives': {
  pattern: '/deep-dives',
  ...html([
    { kind: 'h1-matches', pattern: /deep dives/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="hero-card"], [data-testid="article-card-row"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/deep-dives.spec.ts` covering pillar hero,
RSS pill, JSON-LD shape, and the article-card link.

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: deep-dives pillar — phase 10

- /deep-dives replaces the phase 4 stub with the canonical
  pillar landing — pillar header, lead article (longest-read),
  archive list (also sorted by readTime desc).
- Reused phase 7/9 primitives — no new components. Page-local
  helper sortDeepDivesByLength implements the readTime-desc
  comparator.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical
  /deep-dives. RSS pill links to /feed/deep-dives.xml.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 10's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups

- "On the rise" featured row (phase 16+).
- Pagination beyond 25 (phase 16).
- Per-pillar OG image art (phase 16).
- Reading-time histogram or "30+ min reads only" filter (post-MVP).
