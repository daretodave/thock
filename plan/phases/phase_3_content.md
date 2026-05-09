# Phase 3 — `@thock/content` package + seed articles

> Substrate phase. Builds the editorial-side companion to phase 2's
> `@thock/data`: MDX-in-repo loader, frontmatter schema, tag
> taxonomy, MDX component registry. Ships 6 seed articles (one per
> pillar + a Trends Tracker preview) so phase 5+ has real content.
> Updates the home page to render an article list — proof-of-pipeline
> only; the full home page lands in phase 6.

## Scope

After this phase:

- `packages/content/` exposes typed loaders for articles + tags from
  `apps/web/src/content/articles/*.mdx`.
- A frontmatter Zod schema enforces shape at load time; loaders
  return parsed records, not raw MDX.
- `apps/web/src/content/tags.json` defines the tag taxonomy
  (categories: `switch | layout | brand | material | profile |
  misc`) and is the source of truth for `<TagChip>` color tinting.
- `@thock/content/mdx` exports the custom-component map MDX
  rendering uses across the site (`<PullQuote>`, `<Callout>`,
  `<Caption>`, `<Source>`, `<PartReference>`, `<Mono>`,
  `<KeyboardImage>`).
- 6 seed MDX articles cover all five pillars plus a Trends Tracker
  preview; each is real editorial copy from the curator (no lorem
  ipsum) so the verify gate exercises real shapes.
- The phase-1 placeholder home renders the most recent 6 articles
  as a vertical list with title + lede + pillar tag + read time.
  Phase 6 replaces this with the full home composition.

What this phase does **not** ship:
- `/article/[slug]` route — phase 5.
- `<ArticleCard>` editorial atom — phase 5 introduces the canonical
  variant cascade. The home list is intentionally minimal.
- `<TagChip>` styled with category color — added in phase 5 with
  the rest of the editorial atoms.
- `getActiveGroupBuys` — already lives in `@thock/data` (phase 2).
  The build-plan-row mention was a holdover; do not duplicate.

## Outputs

```
packages/content/
├── package.json                              # @thock/content
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                              # re-exports schema + loaders + types
│   ├── schema/
│   │   ├── frontmatter.ts                    # ArticleFrontmatterSchema (Zod)
│   │   └── tags.ts                           # TagsConfigSchema, TagSchema
│   ├── loaders/
│   │   ├── paths.ts                          # findRepoRoot reuse via @thock/data, articlesDir, tagsFile
│   │   ├── articles.ts                       # getAllArticles, getArticleBySlug, getArticlesByPillar, getArticlesByTag, getRelatedArticles
│   │   ├── tags.ts                           # getAllTags
│   │   ├── parts.ts                          # getReferencedParts(article) — resolves through @thock/data
│   │   ├── memo.ts                           # __resetForTests
│   │   └── index.ts
│   ├── mdx/
│   │   ├── PullQuote.tsx
│   │   ├── Callout.tsx
│   │   ├── Caption.tsx
│   │   ├── Source.tsx
│   │   ├── PartReference.tsx                 # placeholder render this phase; phase 5 wires tooltip
│   │   ├── Mono.tsx                          # re-exports @thock/ui Mono
│   │   ├── KeyboardImage.tsx                 # uses next/image
│   │   ├── components.tsx                    # mdxComponents map exported as default
│   │   └── index.ts
│   ├── util/
│   │   ├── readTime.ts                       # 200 wpm, ceil, floor 1 minute
│   │   └── slug.ts                           # filename → slug; slug shape assert
│   └── __tests__/
│       ├── schema/
│       │   ├── frontmatter.test.ts
│       │   └── tags.test.ts
│       ├── loaders/
│       │   ├── articles.test.ts
│       │   ├── tags.test.ts
│       │   └── related.test.ts
│       └── util/
│           └── readTime.test.ts

apps/web/src/content/
├── tags.json                                 # tag taxonomy (32+ entries)
└── articles/
    ├── gateron-oil-king-deep-dive.mdx        # deep-dive pillar
    ├── mode-sonnet-r2-group-buy-coverage.mdx # news pillar
    ├── alice-layout-decline.mdx              # trends pillar
    ├── building-mode-sonnet-with-oil-kings.mdx # ideas pillar
    ├── beginners-switch-buying-guide.mdx     # guides pillar
    └── trends-tracker-preview.mdx            # trends preview (Trends Tracker article)

apps/web/src/app/page.tsx                     # rewrites the phase-1 placeholder to render the list
apps/web/src/components/home/                 # NEW
├── HomeArticleList.tsx                       # minimal list — phase 6 replaces with full home
└── __tests__/HomeArticleList.test.tsx
```

`apps/e2e/tests/smoke.spec.ts` updates: assert the home page lists
≥1 article title (proves pipeline). The mobile spec is unchanged
shape but its "no horizontal scroll" assertion still applies.

## Stack pins

- `gray-matter@^4.0.3` — frontmatter parser.
- `next-mdx-remote@^5.0.0` — RSC-compatible MDX renderer.
- `remark-gfm@^4.0.1` — GitHub Flavored Markdown plugin (tables,
  strikethrough, etc.).
- Existing: `zod`, `@thock/data` (workspace), `@thock/ui`,
  `@thock/tokens`.

`@thock/content` ships source TS via the `exports` map (same shape
as `@thock/data` and `@thock/ui`); apps/web's `transpilePackages`
list adds it.

## Frontmatter schema (source of truth)

```ts
{
  slug: SlugSchema,            // from @thock/data shared
  title: z.string().min(4).max(200),
  lede: z.string().min(20).max(400),
  author: z.string().min(2),
  pillar: z.enum(['news', 'trends', 'ideas', 'deep-dives', 'guides']),
  tags: z.array(z.string()).min(1).max(8),    // tag slugs; must exist in tags.json
  publishedAt: IsoDateSchema,
  updatedAt: IsoDateSchema.nullable(),
  heroImage: z.string().url().nullable(),
  heroImageAlt: z.string().min(2).nullable(),
  featured: z.boolean().default(false),
  popularityScore: z.number().min(0).max(100).default(0),
  // editorial knobs used by later phases:
  guideSection: z.enum(['firmware', 'modding', 'switches', 'keycaps']).nullable().default(null),
  // referenced parts (resolved via @thock/data):
  mentionedParts: z.array(z.object({
    id: z.string().min(1),                   // local id used inside MDX <PartReference id="...">
    kind: z.enum(['switch', 'keycap-set', 'board']),
    slug: SlugSchema,                        // the data slug
  })).default([]),
}
```

The frontmatter parse runs through Zod; validation errors include
the file path. Loaders `throw` on first invalid file (so verify
gate catches it); the message points at frontmatter line numbers
when gray-matter exposes them.

## Tags taxonomy (`apps/web/src/content/tags.json`)

```json
{
  "tags": [
    { "slug": "linear", "name": "Linear", "category": "switch" },
    { "slug": "tactile", "name": "Tactile", "category": "switch" },
    { "slug": "clicky", "name": "Clicky", "category": "switch" },
    { "slug": "silent", "name": "Silent", "category": "switch" },
    { "slug": "60", "name": "60%", "category": "layout" },
    ...
  ]
}
```

Categories match the token palette (`tag-switch`, `tag-layout`,
`tag-brand`, `tag-material`, `tag-profile`, plus a `misc` fallback
that uses `text-3` color). Initial taxonomy: ~32 tags spread evenly,
including:

- **switch:** linear, tactile, clicky, silent, lubed, factory-lubed.
- **layout:** 60, 65, tkl, full, alice, split, ortho, 75.
- **brand:** gateron, kailh, cherry, gmk, novelkeys, mode, wuque,
  cannonkeys, drop.
- **material:** abs, pbt, pom, polycarbonate, aluminum.
- **profile:** cherry-profile, oem-profile, mt3, sa.
- **misc:** group-buy, beginner, build-of-the-week, deep-dive,
  modding.

The schema enforces `slug` matches kebab-case and `category` is
one of the six values above.

## Loader API surface

```ts
// from @thock/content
export {
  // schemas + types
  ArticleFrontmatterSchema, type ArticleFrontmatter,
  TagsConfigSchema, TagSchema, type Tag,

  // loaders
  getAllArticles, getArticleBySlug, getArticlesByPillar, getArticlesByTag,
  getAllTags, getTagBySlug,
  getRelatedArticles, getReferencedParts,

  // util
  computeReadTime,

  // dev hook
  __resetForTests,
}

// from @thock/content/mdx
export { mdxComponents } from './components'
export {
  PullQuote, Callout, Caption, Source, PartReference, Mono, KeyboardImage,
}
```

Behavior:

- `getAllArticles()` returns all articles sorted by `publishedAt`
  desc. Each has `{ frontmatter, body, slug, readTime }` where
  `body` is the raw MDX body string (rendering is the caller's
  job). Read time is precomputed from word count.
- `getArticleBySlug(slug)` returns the article or `null`.
- `getArticlesByPillar(pillar)` filters; sorts desc by
  `publishedAt`.
- `getArticlesByTag(tagSlug)` filters by tag membership; sorts
  desc.
- `getAllTags()` returns the tag list from `tags.json` validated
  against `TagsConfigSchema`. Memoized.
- `getTagBySlug(slug)` returns tag or `null`.
- `getRelatedArticles(article, n=4)` — same pillar OR ≥2 shared
  tags; weight = (sharedTags * 2) + (samePillar ? 3 : 0); sort
  weight desc, then `publishedAt` desc; cap at `n`. Excludes self.
- `getReferencedParts(article)` reads
  `frontmatter.mentionedParts` and resolves each through
  `@thock/data`. Returns `Array<{ id, kind, record }>`. Records
  whose slug doesn't resolve are silently dropped at this phase
  (validate CLI catches it as a separate concern).

All loaders memoized; tests reset via `__resetForTests`.

## MDX components

The `mdxComponents` map ships these mappings:

```ts
{
  PullQuote, Callout, Caption, Source, PartReference, Mono, KeyboardImage,
  // Standard tag overrides for editorial typography:
  h1: ({ children, ...props }) => null,    // disallow inline H1 — title is page-level
  h2: SerifH2,
  h3: SerifH3,
  a: AutoLink,                              // adds `rel="noopener"` for external
}
```

This phase ships the components rendering the **right shape**, not
the polished editorial styling. The polish lands in phase 5 when
`<ArticleBody>` consumes them in the canonical article template.
For phase 3 the home page doesn't render full MDX — it renders
`title + lede` only. The components exist so phase 5 can plug them
in without scaffolding new files.

`<PartReference>` this phase: renders the resolved record's `name`
as a `<Mono>` token plus an inline link to the vendor URL with
`rel="sponsored noopener"`. Tooltip-on-hover lands in phase 5.

## Seed articles (one per pillar + Trends Tracker preview)

Each MDX article ships:
- A real, editorial-voice ledes (no lorem; the curator agent owns
  the prose).
- `mentionedParts` referencing one or more of the phase-2 seed
  records (gateron-oil-king, gmk-olivia, mode-sonnet, cannonkeys
  vendor) so `<PartReference>` resolves.
- 2–3 inline `<Mono>` references (switch names, firmware refs).
- 1 `<Source>` citation per article minimum (so the future
  `/sources` index has data when phase 16 ships).
- 1 `<PullQuote>` or `<Callout>` per article so the MDX components
  are exercised across seeds.
- Read time 4–9 minutes typical (rounded by the helper).

The six articles:

1. **deep-dive:** "Why the Gateron Oil King sounds like that" —
   tear-down of housing materials and lubing as it relates to
   acoustic profile. References `gateron-oil-king` part.
2. **news:** "Mode Sonnet R2 group buy opens at CannonKeys" —
   short, factual coverage of the seed group buy. References
   `mode-sonnet` part + `cannonkeys-mode-sonnet-r2` GB.
3. **trends:** "The slow fade of Alice layouts" — opinion piece
   referencing trends snapshot. Tagged `alice`, `layout`.
4. **ideas:** "Building a Mode Sonnet around Oil Kings" — build
   log–shaped piece, single author voice. References both parts.
5. **guides:** "A beginner's guide to picking your first switch" —
   evergreen guide, `guideSection: 'switches'`, broad tag set.
6. **trends-preview** (under `trends` pillar): "Reading the Trends
   Tracker" — explainer for the dashboard. References the seed
   trends snapshot week conceptually.

The curator drafts each — main agent doesn't write prose. They're
delegated in parallel.

## Cross-links / wiring this phase ships

**In** (already shipped — verify):
- `apps/web/src/app/page.tsx` (phase 1) — replaced with the article
  list. The CTA-ish "Read the spec" chip is dropped (it pointed at
  `/about` which 404s). The H1 stays as `siteConfig.name`.

**Out** (this phase):
- Each article list item is a plain `<a href="/article/<slug>">` —
  the `/article/[slug]` route still 404s through phase 4 (no
  app/article folder exists yet). Phase 5 ships the route.
- Each item's pillar label is a plain text span — pillar pages
  don't exist as 200s yet (phase 4 ships stubs; phases 7–11 fill
  them).

**No retro-fits this phase** — phase 5 retrofits the home page
again to use `<ArticleCard variant="hero|large|row">` once those
atoms exist.

## SEO / Metadata

No new pages, so no per-route metadata changes. The phase-1 site
metadata stays. Phase 4 adds `@thock/seo`.

## Tests

### Schema tests
- `frontmatter.test.ts` — happy parse, missing pillar fails,
  bad-shape `mentionedParts` fails, default fields apply.
- `tags.test.ts` — happy parse, bad category fails, duplicate
  slugs fail.

### Loader tests
- `articles.test.ts` — `getAllArticles` returns 6 records sorted
  by `publishedAt` desc; `getArticleBySlug` resolves; missing slug
  → null; per-pillar filtering returns the right counts.
- `tags.test.ts` — `getAllTags` returns the taxonomy; `getTagBySlug`
  returns the entry; unknown slug → null.
- `related.test.ts` — given the seed set, `getRelatedArticles`
  returns 4 candidates excluding self; weight order honored.

### Util tests
- `readTime.test.ts` — 200wpm rounded ceil; floor 1; ignores
  frontmatter and code fences in count.

### App test
- `HomeArticleList.test.tsx` — renders 6 article titles; each item
  has an `href` matching `/article/<slug>`; the read-time chip is
  present.

### E2E
- `apps/e2e/tests/smoke.spec.ts` — extend the desktop spec with an
  assertion: at least one article title is visible on `/`. Mobile
  spec unchanged structurally.

## Verify gate

```bash
pnpm typecheck    # adds @thock/content
pnpm test:run     # +20 unit tests
pnpm data:validate # unchanged from phase 2
pnpm build        # apps/web reads @thock/content, builds the home list
pnpm e2e          # +1 assertion on home
```

## Decisions made upfront — DO NOT ASK

1. **`getActiveGroupBuys` lives in `@thock/data`, not
   `@thock/content`.** Build-plan row had a holdover; phase 2
   already ships it. Documented here to prevent duplication.
2. **Phase 3 does not ship `/article/[slug]`** — that's phase 5's
   canonical structural template. Phase 3 only proves the
   loader pipeline.
3. **Home page is intentionally minimal.** A vertical list of 6
   articles. No card variants, no hero pick, no rails. Phase 6
   replaces it wholesale.
4. **`mentionedParts` schema is per-article.** Each article
   declares its own id-to-slug map; no global registry. Lets the
   editorial flow stay close to the prose without a separate
   join file.
5. **Tag slugs validated against `tags.json` at frontmatter parse
   time.** Unknown tag → article load throws. Surfaces typos in
   the verify gate.
6. **MDX is parsed at load time but rendered by the caller.**
   Loaders return the raw body string + parsed frontmatter; the
   article page renders via `next-mdx-remote/rsc`. Keeps the
   loader RSC-agnostic so server actions and tests can use the
   same output.
7. **`featured` and `popularityScore` default to false / 0.** The
   home page (phase 6) and pillar pages will read them; phase 3
   doesn't surface either.
8. **No author entity yet.** `frontmatter.author` is a free string.
   An `authors/` data type can land later if needed; mass author
   pages aren't in the spec.
9. **Read-time helper:** 200 wpm, `Math.ceil`, floor 1 minute.
   Strips MDX component tags + code fences before counting.
10. **`<KeyboardImage>` uses `next/image`** even when invoked from
    `@thock/content/mdx`. Apps/web `transpilePackages` resolves it.
11. **Component-curator drafts every seed article in parallel.**
    Six independent invocations, returning MDX file paths into
    `apps/web/src/content/articles/`. Main agent only validates
    the curator outputs satisfy the schema.

## Mobile reflow

Home list reflows to a single column (already the layout); the
existing 375px e2e assertion still applies.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| schema/frontmatter.ts | ✓ | — |
| schema/tags.ts | ✓ | — |
| loaders/articles.ts | ✓ | covered by home list |
| loaders/tags.ts | ✓ | — |
| loaders/related.ts | ✓ | — |
| util/readTime.ts | ✓ | — |
| HomeArticleList | ✓ | ✓ (smoke.spec.ts assertion) |

## Commit body template

```
feat: @thock/content + seed articles — phase 3

- packages/content/ ships: ArticleFrontmatterSchema, TagsConfigSchema,
  loaders (getAllArticles / getArticleBySlug / getArticlesByPillar /
  getArticlesByTag / getAllTags / getTagBySlug / getRelatedArticles /
  getReferencedParts), readTime util, and the MDX component map at
  @thock/content/mdx.
- apps/web/src/content/tags.json defines the tag taxonomy; six
  seed MDX articles cover all five pillars + Trends Tracker preview.
  Curator drafted; mentionedParts cross-reference @thock/data seeds.
- The phase-1 placeholder home renders an article list (HomeArticleList);
  phase 6 replaces this composition wholesale.
- E2E smoke spec extended with "home lists ≥1 article title".
- N unit tests across schema, loaders, util, and home list.

Decisions:
- getActiveGroupBuys stays in @thock/data; no duplication.
- Article route waits for phase 5; phase 3 only proves pipeline.
- Tag taxonomy validated at frontmatter parse time so typos fail
  loud in the verify gate.
- Loaders return raw MDX body + parsed frontmatter; rendering is
  caller-side (kept RSC-agnostic so tests can run on Node).
```

## DoD — tick in `plan/steps/01_build_plan.md`

Flip Phase 3 `[ ]` → `[x]` with the commit hash; append to phase
log. Commit:

```
plan: phase 3 shipped — @thock/content
```

## Follow-ups (out of scope this phase)

- Article route `/article/[slug]` — phase 5.
- `<ArticleCard>` editorial atom + variant cascade — phase 5.
- `<TagChip>` styling — phase 5 with the rest of the editorial
  atoms.
- Sources index `/sources` — phase 16 polish.
- Author entity / `/authors/` — out of spec.
- Search index seeding — phase 14.
