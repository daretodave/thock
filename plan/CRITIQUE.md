# Critique log

> Last pass: 2026-05-09T16:50:00Z at commit e270ced
> Pass count: 2
> Iterate-bias category: external-critique (set 2026-05-09 by pass 2 — six findings filed; iterate should drain the highest-scoring rows first)

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [HIGH] /article/* — no hero art; locked directive not yet implemented
- pass: 2 (commit e270ced)
- viewport: both
- category: visual
- observation: Every article — including the freshly-published `/article/trends-tracker-preview` — renders only eyebrow + H1 + lede + byline at the top of the page. There is no figure, image, or SVG above (or beside) the H1, even though `plan/bearings.md` § "Article hero art" (locked 2026-05-09 via /oversight) makes per-article colorful keyboard SVGs a durable directive. The article page reads as if its art slot is missing rather than intentionally minimal.
- evidence: On https://thock-coral.vercel.app/article/trends-tracker-preview the article banner contains a link "Trends", an h1 "Reading the Trends Tracker", a serif lede, and the "thock · May 8, 2026 · 5 min read" line — and nothing else above it. A network filter for `.svg` returns no requests scoped to the article surface; no `<img>` or `<svg>` element exists in the article tree. Same shape across the other five seed articles.
- suggested fix: ship one hero SVG per seed article (six total) under `apps/web/public/article-hero/<slug>.svg` per the directive style guide (single accent + warm-bronze stroke, ~2px on 1200×750), wire `ArticleBanner` to render it above the eyebrow, and gate behind a frontmatter `heroArt: <path>` so future articles fail loud when missing. Loop-friendly: each asset is one /ship-asset call.
- source: browser

### [HIGH] /trends/tracker — lede claims rows link to deep dives, but no row links anywhere
- pass: 2 (commit e270ced)
- viewport: desktop
- category: content
- observation: The dashboard's lede reads "Each row links to the deep dive that earned it." A first-time reader scans the five tables looking for those links and finds none — every row name is plain text, and the desktop editor's-note column is uniformly an em dash. Either the lede or the data is lying, and on the page that the bearings call out as "the signature feature" the inconsistency is glaring.
- evidence: `apps/web/src/app/trends/tracker/page.tsx:29` hard-codes the lede verbatim. `data/trends/2026-W19.json` ships every row with `"articleSlug": null`, so `TrackerRow` (`apps/web/src/components/tracker/TrackerRow.tsx:33-34`) computes `noteHref = null` for every row and renders "—" in the editor's-note column. At least two rows could resolve cleanly today: "Gateron Oil King" → `gateron-oil-king-deep-dive`, "Alice layout" → `alice-layout-decline`.
- suggested fix: backfill `articleSlug` on the two rows where a seed article exists, and either (a) wrap the row name in a Link when an article resolves (so the lede claim becomes literally true) or (b) soften the lede to "Each row links to the deep dive that earned it, when one exists." Then add a tracker e2e that asserts the lede claim against the snapshot — if a future snapshot ships without any linked rows, the build fails before deploy.
- source: browser

### [MED] /tag/[slug] — "← all tags" affordance lies about its destination
- pass: 2 (commit e270ced)
- viewport: both
- category: a11y
- observation: Every `/tag/<slug>` page renders a small mono "← all tags" link in the header. A reader reaches it expecting an index of every tag (grouped by category, ideally). The href is `/`, dumping them on home — where there is no tag list at all. The link both teaches the wrong destination and signals a missing /tags route.
- evidence: `apps/web/src/app/tag/[slug]/page.tsx:115-120` — the Link is `href="/"` with the literal text `← all tags`. Confirmed live on https://thock-coral.vercel.app/tag/gateron (ref_18 in the reader pass).
- suggested fix: cheapest fix — relabel the back-link to `← home` so the destination matches the affordance, and file a follow-up to ship `/tags` as a real index page (simple list grouped by the five categories from `decisions.jsx`, links each chip to `/tag/<slug>`). Either change is one-file; the rename is a one-line edit, the index page is a half-day phase candidate.
- source: browser

### [MED] /group-buys + / — "Closing soon" framing applied to a buy with 37 days left
- pass: 2 (commit e270ced)
- viewport: desktop
- category: voice
- observation: Two surfaces show the same auto-generated mismatch. On `/group-buys`, the live section renders kicker "Live now" + heading "Closing soon" — and the only row underneath says "37d left". On `/`, the home group-buys widget shows "group buys · ending soon" + "Don't miss the close" with the same 37-day buy. Both contradict the bearings rule that brass urgency is reserved for the last 72 hours. Hype-bro voice on a knowledgeable-peer site.
- evidence: `apps/web/src/app/group-buys/page.tsx:103` hard-codes `<HomeSectionHeading kicker="Live now" title="Closing soon" />` regardless of any row's window. `apps/web/src/components/home/GroupBuysWidget.tsx:54` hard-codes "group buys · ending soon" similarly. Seed buy `data/group-buys/cannonkeys-mode-sonnet-r2.json` has window 2026-05-01 → 2026-06-15; on 2026-05-09 the page renders 37d remaining.
- suggested fix: drop "Closing soon" as the live heading entirely and use "Live now" (matching the kicker) — split a "Closing soon" sub-section that only renders when at least one row is inside a 72h window. Mirror the same logic in the home widget: when no live buy is <72h, replace "ending soon / don't miss the close" with neutral "live group buy" framing. The 72h check already exists in the seed-window math; reuse it for the headings.
- source: browser

### [MED] /trends — pillar archive labeled "All Trends pieces" but excludes the hero
- pass: 2 (commit e270ced)
- viewport: both
- category: content
- observation: The pillar lands the freshly-published "Reading the Trends Tracker" as its hero card and then renders an archive heading "All Trends pieces" — but the archive list contains only "The slow fade of Alice layouts." A reader sees the count and the cards disagree by exactly one (the hero), and the same pattern is present on every pillar (News, Deep Dives, Ideas) by code structure.
- evidence: `apps/web/src/app/trends/page.tsx:44-45` deliberately splits `lead = all[0]; archive = all.slice(1)`, then renders the archive under title "All Trends pieces" (line 120). News/Ideas/Deep-Dives use the same shape. Live confirmation on https://thock-coral.vercel.app/trends.
- suggested fix: rename the archive heading to "More Trends pieces" (matching the actual content) across all four pillar pages — single string change per file. Alternative: include the hero in the archive list so the heading stays accurate; risk is the hero-card visually duplicating into the list immediately below. Renaming is the lower-friction fix and matches the bearings voice.
- source: browser

### [LOW] /trends/tracker — every editor's-note cell is a uniform em dash
- pass: 2 (commit e270ced)
- viewport: desktop
- category: data
- observation: The desktop layout reserves a 1.4fr column on each tracker row for an editor's note (linking to a deep dive). Across all five categories every cell renders "—". The page advertises a dashboard but reads as a five-row stub waiting for content. This is the same root data gap as the [HIGH] above; filing separately because the right fix is a content backfill, not a code change.
- evidence: `data/trends/2026-W19.json` ships every row with `articleSlug: null`. `TrackerRow.tsx:64-73` renders an em dash whenever `noteHref` is null, and the desktop column has `text-text-4` styling that only emphasizes the emptiness when every cell shares it.
- suggested fix: backfill `articleSlug` on the rows that already have a matching article (Gateron Oil King, Alice layout). For categories where no article exists yet (MT3 profile, Mode Designs, Wuque Studio), commission a one-paragraph editorial note as a `note: string` field on the row schema — small additive schema change in `packages/data` — and render it as plain text when the slug doesn't resolve. That way no cell is ever a bare em dash.
- source: browser

### [MED] /group-buys — seed CTA points at a 404 vendor URL (user jot)
- pass: user-jot (commit 593b1f9)
- viewport: both
- category: data
- auth_state: anonymous
- observation: On https://thock-coral.vercel.app/group-buys the only seed group buy ("Mode Sonnet R2") renders a "view at vendor" CTA pointing to https://cannonkeys.com/products/mode-sonnet-r2 — which is not a valid product page on the vendor's site. First impressions of /group-buys break immediately when the user clicks the only available link.
- suggested fix: open the seed record at `data/group-buys/cannonkeys-mode-sonnet-r2.json` and either (a) replace the `url` with a real CannonKeys product page (verify with a HEAD probe) or (b) reframe this seed as `status: announced` with no product URL until R2 actually drops. While we're in the file, audit the other URL fields (`imageUrl` is null — fine for now). Same audit pass should add a `data:link-rot` step to the smoke walker (post-MVP) so future seed entries can't ship a dead vendor URL silently.
- source: user


### [x] [MED] /tag/[slug] — pillar stub advertises "N articles" but renders zero cards (resolved by phase 12)
- addressed in: phase 12 (pending commit)
- pass: 1 (commit 16b53c3 — narrowed to /tag from broader /news+/tag finding 2026-05-09)
- root cause: at filing time, `/tag/[slug]` was a phase-4 stub with the count text but no article list. Phase 12 replaces the stub with the canonical tag page — categorical-tinted header + chronological article list + JSON-LD CollectionPage/ItemList. Empty tags now render a clear "no articles tagged X yet" panel rather than a misleading count.


### [x] [MED] /trends/tracker — first row collides with the table header (user jot)
- addressed in: pending commit (this tick)
- pass: user-jot (commit 285e423)
- root cause: `<TrackerRow>` had `first:pt-0 first:border-t-0` to clean up standalone use, but inside `<TrackerTable>` the header row sits directly above the first body row. Zeroing the first row's top padding made "01 Gateron Oil King" sit flush against the header label cells with no breathing room.
- fix: drop `first:pt-0` from the TrackerRow grid className. The first row now keeps its `py-4` (16px) top padding, giving clear separation from the header. `first:border-t-0` stays so the row's top border doesn't double up against the header's `border-b`.
- regression guard: new e2e in `apps/e2e/tests/trends.spec.ts` asserts the first row's computed `padding-top` is greater than 8px at desktop width.

### [x] [MED] /news — pillar advertises "1 article" but renders zero cards (resolved by phase 7)
- addressed in: phase 7 (commit 80a0290)
- pass: 1 (commit 16b53c3)
- root cause: at filing time, `/news` was a phase-4 PageStub with no article list. Phase 7 replaced it with the canonical pillar landing (PillarHero + ArticleCard hero + PillarArchiveList). curl confirms `hero-card` testid renders. The /tag/[slug] half of this finding is split into a separate Pending row above; phase 12 closes it.

### [x] [HIGH] Tag chips like "#ALICE" read as person names to first-time visitors
- addressed in: pending commit (this tick)
- pass: 1 (filed via /oversight 2026-05-09 from user observation)
- root cause: `<TagChip>` rendered just the slug (`#alice`) with no category context, so first-time readers saw a name-shaped string and had no way to know "alice" referenced a layout style, not a person.
- fix: `packages/ui/src/TagChip.tsx` now prefixes typed-category chips with their category label (`layout · alice`, `switch · linear`, `brand · gmk`). Misc-category chips keep the legacy `#name` form since there's no useful prefix. The categorical color tint per `decisions.jsx` is unchanged. `aria-label` is set to a more legible `"layout tag: Alice"` format. A `data-category` attribute is exposed for downstream styling.
- regression guard: updated unit suite in `packages/ui/src/__tests__/TagChip.test.tsx` (8 tests) covers the new prefix shape, the misc-category fallback, the data-category attribute, and the aria-label format. Existing ArticleTagRail test still passes — it grepped on `unknown-tag` substring which the new shape preserves for misc.
- non-fix: tag-rail glossary block (the critique suggested a one-line tag-rail explainer) deferred — the prefix already clears up confusion at the chip level; a separate glossary would duplicate context and add visual noise.

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
