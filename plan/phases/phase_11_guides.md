# Phase 11 — Guides pillar (`/guides`)

> Agent-facing brief. Concise, opinionated, decisive. Mirrors
> phase 7 / 9 / 10 in primitives but **breaks the hero-lead
> shape**: guides are reference, not editorial highlights, so the
> page renders as **freshness-stamped sections** (no hero lead).
> The section heading is the anchor; within each section the
> newest update sits at the top.

## Routes (locked in `plan/bearings.md`)

- `/guides` — replace the phase 4 stub with the canonical pillar
  landing.

## Sections (top → bottom)

1. **Pillar header** (`<PillarHero>`) — eyebrow
   `PILLAR · 05 of 05`, italic display H1 `Guides`, lede
   paragraph (locked), single right-rail RSS pill.
2. **Section blocks** — one per `guideSection` enum value, in the
   canonical order: `firmware`, `modding`, `switches`, `keycaps`.
   Each block is `<HomeSectionHeading>` + a flat list of
   `<ArticleCard variant="row">` for that section's articles
   sorted by freshness desc. Empty sections are silently dropped.
3. **Catch-all** — articles in `pillar = "guides"` with
   `guideSection = null` collect into a final block titled
   "Other guides", sorted by freshness desc. Dropped silently if
   empty.

No hero card. No archive cap (the section structure itself caps
visual weight; if a section grows past ~25, that's a phase-16
pagination problem).

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticlesByPillar('guides')` | manifest | section grouping |
| `getAllTags()` | manifest | tag-name + category for chips |

Same shape as phase 7 / 9 / 10. New page-local helper
`groupGuidesBySection` in `apps/web/src/app/guides/helpers.ts`
returns an ordered array of `{ section, label, articles }`
groups, with each `articles` list pre-sorted by `updatedAt ??
publishedAt` desc (tie-break `slug` asc). Pure, unit-tested.

## Components

### Reused (already shipped)

- `<PillarHero>` (phase 7).
- `<ArticleCard variant="row">` (phase 6).
- `<HomeSectionHeading>` (phase 6).

### New

None at the component layer. The page renders sections inline
with `<Container>` + `<HomeSectionHeading>` + a thin map over
`<ArticleCard variant="row">`. Page-local helper
`groupGuidesBySection` is pure.

## Cross-links

**In:**
- Article-page eyebrow for `pillar="guides"` already links to
  `/guides`; verify it lands on the real H1.
- Home page Latest-by-pillar 4-up (phase 6) already links to
  individual articles; no retro-fit.

**Out:**
- Cards → `/article/<slug>`.
- RSS pill → `/feed/guides.xml` (already served).
- Tag chips inside cards → `/tag/<slug>` (stub until phase 12).

**Retro-fit:** none. Header nav already lists Guides.

## SEO

- `generateMetadata` — title `Guides`, description = lede,
  canonical `/guides`.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  every guide article (no cap; guides will likely stay <50).
  Same shape as phase 7 / 9 / 10.

## Empty / loading / error states

- **No articles in pillar** — pillar header + one-paragraph
  empty panel: "No guides yet. The reference shelf fills in soon."
- **Loading** — colocated `loading.tsx`, pillar-shape skeleton.
- **Error** — colocated `error.tsx` 'use client' identical in
  shape to phase 7 / 9 / 10.

## Decisions made upfront — DO NOT ASK

- **Lede copy (locked):** "Practical reference: firmware,
  modding, switches, keycaps. Sectioned and freshness-stamped so
  the answers age honestly." Same as the phase 4 stub.
- **No hero lead.** Reference content has no "newest pick"
  identity; the section grid is the visual anchor.
- **Section order:** `firmware`, `modding`, `switches`, `keycaps`
  — matches the schema enum declaration order in
  `packages/content/src/schema/frontmatter.ts`. Catch-all "Other
  guides" last.
- **Section labels (locked):** `Firmware`, `Modding`, `Switches`,
  `Keycaps`, and `Other guides` for the null bucket.
- **Within-section sort:** `updatedAt ?? publishedAt` desc;
  tie-break `publishedAt` desc; final tie-break `slug` asc for
  build stability. Mirrors deep-dives' tie-break chain.
- **No archive cap.** The section structure is the cap.
- **No section eyebrow / count chips.** The section heading
  carries the pillar identity; counts add visual noise.

## Mobile reflow

Inherits phase 7's pillar reflow. Section headings stack
naturally; rows already collapse to single-column.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/guides` | n/a | renders H1 matching `/guides/i`, ≥1 article-card-row link, RSS pill links to /feed/guides.xml, ItemList JSON-LD present, at least one section heading visible |
| `groupGuidesBySection` | groups in canonical order; sorts within section by updatedAt-or-publishedAt desc; preserves slug tie-break; drops empty sections; bundles null-section into "Other guides"; handles empty input | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/guides`:

```ts
'/guides': {
  pattern: '/guides',
  ...html([
    { kind: 'h1-matches', pattern: /guides/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="article-card-row"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/guides.spec.ts` covering pillar hero, RSS
pill, JSON-LD shape, the article-card-row link, and the
section-heading presence.

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: guides pillar — phase 11

- /guides replaces the phase 4 stub with the canonical pillar
  landing — pillar header, freshness-stamped sections grouped
  by guideSection (firmware, modding, switches, keycaps,
  catch-all "Other guides"). No hero lead.
- Reused phase 6/7 primitives — no new components. Page-local
  helper groupGuidesBySection implements the canonical-order
  grouping + within-section freshness sort.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical
  /guides. RSS pill links to /feed/guides.xml.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 11's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups

- Per-section "see all" links once a section grows past ~25
  articles (phase 16+).
- Per-pillar OG image art (phase 16).
- Section-level JSON-LD anchor (e.g. `name#firmware`) — post-MVP.
- Inline TOC for very long pages (post-MVP).
