# Critique log

> Last pass: 2026-05-09T00:10:00Z at commit 16b53c3
> Pass count: 1
> Iterate-bias category: external-critique  (set automatically by march; cleared by oversight)

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [HIGH] /article/gateron-oil-king-deep-dive — `[unknown part:oil-king]` placeholder leaks into article prose
- pass: 1 (commit 16b53c3)
- viewport: both
- category: content
- observation: Two real articles render literal `[unknown part:<slug>]` text inside body paragraphs where the part-mention component should resolve to a linked chip. A first-time reader sees an obvious data error in the opening sentence of a flagship deep-dive and again inside the beginners' guide.
- evidence: Visible prose on `/article/gateron-oil-king-deep-dive`: "The first time a builder drops a set of [unknown part:oil-king] into a polycarbonate-plate NK87 v3…". Same fallback string appears on `/article/beginners-switch-buying-guide`: "The [unknown part:oil-king] from Gateron is a representative modern linear…".
- suggested fix: Either rename the article slug refs to match the real `gateron-oil-king` data slug, or extend the part resolver to alias short slugs to their canonical record. Add a build-time check that fails if any `<MentionedPart>` slug doesn't resolve.
- source: browser

### [HIGH] /article/* — inline `<Mono>` spans render as block siblings, stranding sentence text
- pass: 1 (commit 16b53c3)
- viewport: desktop
- category: visual
- observation: Inline mono terms (switch names, layout tokens, week labels) render outside their surrounding paragraph, so the running prose has comma-stranded gaps where the technical token should sit. Same root cause across at least two articles — the trends-tracker preview and the beginners' guide.
- evidence: Rendered text on `/article/trends-tracker-preview`: "Every row on the tracker belongs to one of five categories: , , , , and . The split is deliberate." On `/article/beginners-switch-buying-guide`: "A switch travels in a straight line from rest to bottom-out…" with the leading 'linear' token dangling as an adjacent sibling instead of being inlined.
- suggested fix: In `packages/content/src/mdx/`, ensure the `Mono` (or whichever inline component is being used) is registered in the mdxComponents map as inline (`span`-rooted) and not block-rooted. Verify with a single MDX paragraph mixing prose and `<Mono>` in a unit test.
- source: browser

### [HIGH] mobile nav — primary links unreachable at 375px, no toggle
- pass: 1 (commit 16b53c3)
- viewport: mobile
- category: navigation
- observation: At 375×800 the five pillar links in the header (News / Trends / Ideas / Deep Dives / Guides) exist in the DOM but are clipped or hidden, and no hamburger / menu toggle is rendered. A mobile reader who lands on an article cannot reach any other section. This is a fundamental UX failure for a content site.
- evidence: On the deep-dive article at 375×800, only `[thock home, Search, Deep Dives]` register as interactive. No element matches "hamburger menu button or mobile nav toggle".
- suggested fix: Add a mobile menu toggle that exposes the full primary nav at <640px. Phase 16 (Polish) lists this as scope, but the gap is acute enough on real-content phases (5+) that it shouldn't wait for 16.
- source: browser

### [MED] /news — pillar advertises "1 article · newest first" but renders zero cards
- pass: 1 (commit 16b53c3)
- viewport: both
- category: navigation
- observation: The news pillar landing claims "1 ARTICLE · NEWEST FIRST" and then renders only the "Lands in Phase 7" stub note — no card. The real Mode Sonnet R2 news article exists at `/article/mode-sonnet-r2-group-buy-coverage` and is shown on the home page, so a curious reader who clicks "News" from the header concludes the site is broken. Same shape on `/tag/linear` (advertises "3 articles" with no links).
- evidence: Page text on `/news`: "pillar / news / Curated coverage… / 1 article · newest first / Lands in Phase 7". `/article/mode-sonnet-r2-group-buy-coverage` renders a real H1.
- suggested fix: Either render the real article cards above the "Lands in Phase X" note (one-card stub is fine), or change the count line to "1 article — full pillar lands Phase 7" with the count linking to the slug, so a path out exists. Apply the same fix on `/tag/<slug>` stubs.
- source: browser

### [MED] every page — `<title>` duplicates the site name
- pass: 1 (commit 16b53c3)
- viewport: both
- category: meta
- observation: Browser tab titles end with "— thock — thock" on every URL visited (home, articles, pillar landings, tag pages). The site-name suffix is being applied twice in the metadata pipeline.
- evidence: Tab titles, verbatim: "Why the Gateron Oil King sounds the way it does — thock — thock", "News — thock — thock", "#linear — thock — thock", "keyboards, deeply. — thock — thock".
- suggested fix: In `packages/seo/`, drop the second `— thock` suffix — most likely the per-page title already includes it, then `Metadata.title.template` adds it again. Switch one or the other off.
- source: browser

### [HIGH] Tag chips like "#ALICE" read as person names to first-time visitors
- pass: 1 (filed via /oversight 2026-05-09 from user observation)
- viewport: both
- category: content
- observation: A reader landing on the home page sees "#ALICE" surfaced under the trending strip / latest-by-pillar without context. "Alice" is a layout style in the keyboard hobby (split body, centered B), but to a first-time visitor it reads as a person's name. The same chip appears at the bottom of `/article/trends-tracker-preview`. Several other tag chips have the same problem (chip text alone strips the categorical context that makes the term meaningful).
- evidence: User-reported on `/` and on `/article/trends-tracker-preview`: "who's alice? get rid of these names/tags that don't mean anything." The chip renders as `#alice` (uppercase from CSS) with no kind/category visual cue; the page provides no glossary or tooltip.
- suggested fix: One of (a) prefix tag chips with their category (`switch · linear`, `layout · alice`, `brand · gmk`), (b) attach a hover tooltip with the category, or (c) on the home page, suppress chips entirely for cards where the title doesn't already disambiguate. Prefer (a) — the categorical color is already present per `decisions.jsx` "tag color = category, not vibe" but the color alone isn't a glossary. Add a one-line glossary block to the article-page tag rail too.
- source: user

### [HIGH] /article/trends-tracker-preview — body content renders as walls of text where it should be lists
- pass: 1 (filed via /oversight 2026-05-09 from user observation)
- viewport: both
- category: content
- observation: Several sections of the trends-tracker-preview article render as undifferentiated paragraphs even though the prose is structured as a list. The "What we're tracking" section has no top margin from the heading above it, and the body reads `"Five columns, left to right. Name. The thing being tracked, written the way the community writes it. Gateron Oil King, not 'Gateron G Pro 3.0 Oil King v2.' If the community has settled on a shorthand, the tracker uses it."` — that's clearly meant to be a numbered or bulleted list of column descriptions, not a single paragraph. The "What this is not" section has the same problem.
- evidence: `https://thock-coral.vercel.app/article/trends-tracker-preview` — visible body. Headings like "What we're tracking" and "What this is not" sit flush against the preceding paragraph; their bodies render as a single unbroken paragraph instead of a list.
- suggested fix: Two fixes likely needed. (1) Edit `apps/web/src/content/articles/trends-tracker-preview.mdx` to use real markdown list syntax (`- Name —` etc.) and `##` headings with blank lines around them. (2) Audit `apps/web/src/styles/components.css` (or wherever the article body prose styles live) to ensure heading + adjacent paragraph spacing is correct (`h2 { margin-top: 2em }` or equivalent), and that adjacent `<li>` items render with the expected vertical rhythm. The first fix is content; the second may be needed across all articles.
- suggested fix-2: While in this article, also audit for the `#ALICE` tag chip mentioned in the previous finding — the same chip surfaces here at the bottom and lacks context.
- source: user

## Done

(empty — first pass)
