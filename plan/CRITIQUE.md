# Critique log

> Last pass: 2026-05-09T00:10:00Z at commit 16b53c3
> Pass count: 1
> Iterate-bias category: external-critique  (set automatically by march; cleared by oversight)

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [MED] /news — pillar advertises "1 article · newest first" but renders zero cards
- pass: 1 (commit 16b53c3)
- viewport: both
- category: navigation
- observation: The news pillar landing claims "1 ARTICLE · NEWEST FIRST" and then renders only the "Lands in Phase 7" stub note — no card. The real Mode Sonnet R2 news article exists at `/article/mode-sonnet-r2-group-buy-coverage` and is shown on the home page, so a curious reader who clicks "News" from the header concludes the site is broken. Same shape on `/tag/linear` (advertises "3 articles" with no links).
- evidence: Page text on `/news`: "pillar / news / Curated coverage… / 1 article · newest first / Lands in Phase 7". `/article/mode-sonnet-r2-group-buy-coverage` renders a real H1.
- suggested fix: Either render the real article cards above the "Lands in Phase X" note (one-card stub is fine), or change the count line to "1 article — full pillar lands Phase 7" with the count linking to the slug, so a path out exists. Apply the same fix on `/tag/<slug>` stubs.
- source: browser

### [HIGH] Tag chips like "#ALICE" read as person names to first-time visitors
- pass: 1 (filed via /oversight 2026-05-09 from user observation)
- viewport: both
- category: content
- observation: A reader landing on the home page sees "#ALICE" surfaced under the trending strip / latest-by-pillar without context. "Alice" is a layout style in the keyboard hobby (split body, centered B), but to a first-time visitor it reads as a person's name. The same chip appears at the bottom of `/article/trends-tracker-preview`. Several other tag chips have the same problem (chip text alone strips the categorical context that makes the term meaningful).
- evidence: User-reported on `/` and on `/article/trends-tracker-preview`: "who's alice? get rid of these names/tags that don't mean anything." The chip renders as `#alice` (uppercase from CSS) with no kind/category visual cue; the page provides no glossary or tooltip.
- suggested fix: One of (a) prefix tag chips with their category (`switch · linear`, `layout · alice`, `brand · gmk`), (b) attach a hover tooltip with the category, or (c) on the home page, suppress chips entirely for cards where the title doesn't already disambiguate. Prefer (a) — the categorical color is already present per `decisions.jsx` "tag color = category, not vibe" but the color alone isn't a glossary. Add a one-line glossary block to the article-page tag rail too.
- source: user

## Done

### [x] [HIGH] mobile nav — primary links unreachable at 375px, no toggle
- addressed in: pending commit (this tick)
- pass: 1 (commit 16b53c3)
- root cause: the desktop nav was `hidden md:flex` and there was no `<md` toggle, so the 5 pillar links were entirely unreachable on phones. Phase 16 listed this as polish scope; pulled forward at user direction.
- fix: new client component `apps/web/src/components/ui/MobileNav.tsx` renders a hamburger toggle visible only at `<md` and a slide-down drawer holding the 5 pillar links. Drawer closes on link click, on Escape, and when the viewport widens past `md`. `Header.tsx` stays a server component and embeds the client `<MobileNav />` next to the search affordance; the desktop nav is unchanged.
- regression guard: new mobile e2e at `apps/e2e/tests/mobile/nav.mobile.spec.ts` opens the drawer at 375px, verifies all 5 pillar links are present, and asserts clicking one routes to `/news`. Five unit tests in `apps/web/src/components/ui/__tests__/MobileNav.test.tsx` cover the open/close state, link rendering, and toggle aria-expanded.

### [x] [MED] every page — `<title>` duplicates the site name
- addressed in: pending commit (this tick)
- pass: 1 (commit 16b53c3)
- root cause: `packages/seo/src/buildMetadata.ts` was suffixing the title (`"News — thock"`) and `apps/web/src/app/layout.tsx` then applied its `title.template = "%s — thock"` on top, yielding `"News — thock — thock"`. The root segment (`/`) was inconsistent because Next.js skips the layout's template for the root page itself, so home rendered with a single suffix while every nested route doubled.
- fix: switch buildMetadata to return `title: { absolute: "<title> — thock" }` so Next.js skips the template entirely. The suffix now appears exactly once on every route, root or nested. OG / Twitter title slots stay fully suffixed (the template never applied there).
- regression guard: new e2e test in `apps/e2e/tests/article.spec.ts` walks `/`, `/news`, `/article/<slug>`, `/trends/tracker`, `/tag/<slug>` and asserts each `<title>` contains exactly one `— thock`. Updated unit test in `packages/seo/src/__tests__/buildMetadata.test.ts` checks the `{ absolute }` shape.

### [x] [HIGH] /article/gateron-oil-king-deep-dive — `[unknown part:oil-king]` placeholder leaks into article prose
- addressed in: pending commit (this tick)
- pass: 1 (commit 16b53c3)
- root cause: `PartReference` (`packages/content/src/mdx/PartReference.tsx`) resolves an article's `mentionedParts` via `parts ?? (article ? getReferencedParts(article) : [])`. The shared `mdxComponents` map registered the component with neither prop bound, so `parts` was always undefined and `article` was always undefined — every `<PartReference id="…">` fell through to the `[unknown part:<id>]` fallback. The seed article frontmatters did contain the right `mentionedParts` rows; the resolver just never saw them.
- fix: `apps/web/src/components/article/ArticleBody.tsx` now accepts a `parts: ResolvedPart[]` prop and builds a per-render components map that wraps `PartReference` with the parts list closured in. The article page route already computes `parts = getReferencedParts(article)` for the MentionedPartsRail; piping the same list to ArticleBody costs nothing extra.
- regression guard: new e2e test in `apps/e2e/tests/article.spec.ts` walks both `/article/gateron-oil-king-deep-dive` and `/article/beginners-switch-buying-guide`, asserts the body never contains the literal string `"[unknown part:"`, and confirms the resolved part name (`Oil King`) appears in the prose.

### [x] [HIGH] /article/* — inline `<Mono>` spans render as block siblings (root cause: missing prose styles)
- addressed in: pending commit (this tick)
- pass: 1 (commit 16b53c3)
- root cause (revised): the live HTML actually rendered `<span class="font-mono">` correctly inline within `<p>`. The visual was caused by Tailwind preflight resetting `p { margin: 0 }` and `.thock-prose` having zero declared rules — adjacent paragraphs collapsed against each other, which made surrounding mono tokens appear stranded. Fix: declare `.thock-prose p` margin in `apps/web/src/styles/components.css` plus matching rules for `ul`, `ol`, `li`, `blockquote`, `hr`, `strong`. New regression-guard e2e (`article.spec.ts`) asserts (a) first body `<p>` has `margin-bottom > 8px` and (b) the "five categories" paragraph contains all five mono tokens within the same `<p>`.

### [x] [HIGH] /article/trends-tracker-preview — body content renders as walls of text where it should be lists
- addressed in: pending commit (this tick) — same root cause as the inline-Mono finding
- pass: 1 (filed via /oversight 2026-05-09 from user observation)
- root cause: identical to the [x] above — `.thock-prose` had no styles, so bold-led paragraphs (`**Name.** ...`, `**Type.** ...`) collapsed into a single visual block. Fix: prose-paragraph margin in components.css. The "What we're tracking" h2's mt-12 was already in place via the SerifH2 mdxComponent — what the user perceived as "no top margin" was actually the wall-of-text effect immediately below it making the heading look glued to the next paragraph.
- follow-up: the user's #ALICE-tag-chip-confusion observation (HIGH, separate finding above) still stands; addressed in a future tick.
