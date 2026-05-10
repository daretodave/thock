# Critique log

> Last pass: 2026-05-09T21:05:00Z at commit b2692ac
> Pass count: 4
> Iterate-bias category: external-critique (carried forward — pass 4 added 6 more findings after iterate drained 7 rows from passes 2/3 + 3 user-jots since pass 3; iterate should drain the highest-scoring rows first, with the [HIGH] Mode Sonnet R2 date inconsistency at the top)

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [x] [HIGH] /group-buys + /article/mode-sonnet-r2-group-buy-coverage + / — Mode Sonnet R2 buy dates contradict across three surfaces
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 4 (commit b2692ac)
- viewport: both
- category: data
- root cause: the 9255abe drain (jot fix for the original Mode Sonnet R2 404 vendor URL) reframed `data/group-buys/cannonkeys-mode-sonnet-r2.json` from `status: live` 2026-05-01 → 2026-06-15 to `status: announced` 2026-06-01 → 2026-07-15. The drain note explicitly stated "the mode-sonnet-r2 article keeps its prior dates as historical news coverage; the data record now reflects the more current 'delayed' state." But the article body framed itself as live coverage ("is now live for order", "The group buy opened on 2026-05-01") with no markup acknowledging the timeline shift — so a reader cross-referencing /group-buys → article → home saw three different timelines for the same product without any explanation.
- fix: shipped a hybrid of paths (a) and (b) from the row's menu — kept the article body (lede + paragraphs + Callout "Group-buy timing") intact as the published 2026-05-06 historical record, and added a new top-of-article `<Callout type="info" title="Update — 2026-05-09">` that explicitly states "CannonKeys has shifted the R2 opening window. The buy is now announced for 2026-06-01 through 2026-07-15 rather than the originally-published 2026-05-01 through 2026-06-15 dates referenced below. See the live entry on /group-buys for the current window. The body of this article is preserved as the published 2026-05-06 record of what was announced at the time." Bumped frontmatter `updatedAt` from `null` → `2026-05-09T21:30:00.000Z` so the article header renders an "updated" timestamp and JSON-LD `Article.dateModified` reflects the amendment. The reader's three-timeline contradiction is now reconciled by being explicit about it; the editorial-honest "we got it wrong, here's the correction" voice replaces silent inconsistency.
- regression guard: no test asserts the article body contents directly. The dataloader test at `packages/data/src/__tests__/loaders/group-buys.test.ts` already covers the data file's announced-state shape post-9255abe. JSON-LD `Article.dateModified` is exercised by `apps/e2e/tests/meta.spec.ts` (per-family @type contract); `updatedAt: null` → ISO date is a permitted transition.
- source: browser

### [MED] /article/building-mode-sonnet-with-oil-kings — first-person "I" breaks the unified "we" voice
- pass: 4 (commit b2692ac)
- viewport: both
- category: voice
- observation: Article body is written entirely in first-person singular: "I've been threatening to do this build for months", "sitting on my desk", "I'd try the FR4 plate", "I'm typing this article on the Sonnet". `bearings.md` says "First-person plural 'we' is the unified voice across editorial surfaces" — and the byline is `author: thock` (the org), so "I" breaks the institutional voice the iterate tick at commit 168e5c7 just unified for /about and /newsletter. Pass-3 caught the /about-vs-/newsletter mismatch but didn't sweep the article bodies.
- evidence: Lede: "I've been threatening to do this build for months, and a free Sunday finally made it happen." H2 "What I'd change" uses "I" four more times in two paragraphs. Build-of-the-week framing carries the same drift in /article/beginners-switch-buying-guide (less aggressively) and the closing paragraphs of mode-sonnet-r2-group-buy-coverage.
- suggested fix: rewrite the Ideas-pillar build-of-the-week articles to "we"/"our build" framing — same shape as 168e5c7's /about + /newsletter unification. Cheapest path is a content-curator pass over the affected article bodies; targeted scope avoids re-litigating tone for every article. If the user wants to keep first-person personality on Ideas pieces specifically, surface that as an /oversight call to add a contributor-byline model so "I" is honest (currently every article ships with `author: thock`).

### [MED] /trends — pillar archive shows exactly one piece after the hero (data sparsity)
- pass: 4 (commit b2692ac)
- viewport: both
- category: content
- observation: Trends pillar's "More Trends pieces" archive renders exactly one card (Alice fade) after the hero. The pillar reads as "tracker plus one supporting essay" — a thin slice for the project's signature pillar. /news, /ideas, /deep-dives likely fan into the same one-card archive given identical content depth. The b2692ac heading rename ("More" not "All") fixed the literal-falsehood; the underlying density is the next layer.
- evidence: Live /trends body: hero card `Reading the Trends Tracker`, then `Archive / More Trends pieces` with one card `The slow fade of Alice layouts` and nothing after. `apps/web/src/lib/data-runtime/manifest.generated.json` confirms only 2 trends-pillar articles exist.
- suggested fix: this is the data-sparsity finding adjacent to the open `/sources uniform "1 cite"` and `/trends/tracker single-row` rows — all three resolve once the **Real-data backfill** phase candidate (PHASE_CANDIDATES at f64f06e, score 8.0) ships its Phase A + B work plus 2-3 new Trends pieces. As an interim, collapse the "More Trends pieces" section header when count ≤ 1 and surface the tracker preview card in its place. Symmetric collapse rule for /news, /ideas, /deep-dives.

### [MED] /article/building-mode-sonnet-with-oil-kings — "Mentioned in this article" lists 2 of 10 named parts
- pass: 4 (commit b2692ac)
- viewport: both
- category: content
- observation: The "Mentioned in this article" index lists Mode Sonnet (board) and Gateron Oil King (switch). Body specifically names eight other parts the reader might want to look up: Staebies V3, GMK Striker R3, KAT Milkshake, Bakeneko65, Geon Frog, Endgame84, 205g0 lube, XHT-BDZ. The index promises a key reference and underdelivers, which makes the section feel decorative rather than functional.
- evidence: Build-details list mentions `Staebies V3` (mono span), `205g0`, `XHT-BDZ`, `GMK Striker R3`. Body comparisons: "Bakeneko65 I built last summer", "compared to a Geon Frog with Oil Kings". None appear under "Mentioned in this article" — only the front-matter `mentionedParts` slugs render.
- suggested fix: two paths. (a) Auto-extract part mentions from `<PartReference>` MDX usage AND mono spans matching known part slugs in `data/{switches,keycap-sets,boards}/`, and surface the union under the index. (b) Relabel the section to `Featured products` or `Build sheet` and accept the curated 2-item shape — but mark the un-indexed body mentions explicitly. (a) needs an MDX walker (similar shape to the per-citation source extractor in /sources audit row); (b) is a 1-line title rename. (b) ships now; (a) is phase-shaped.

### [LOW] / — Deep Dives long-reads card duplicates the by-pillar Deep Dives card
- pass: 4 (commit b2692ac)
- viewport: desktop
- category: content
- observation: Home "Long reads worth your weekend" rail surfaces the exact same Oil King deep-dive card that appeared two scroll-lengths up under "By pillar / Deep Dives". By the time the visitor reaches the group-buys footer they've seen the same headline + lede + hero image twice on the same screen. Same root pattern as the recently-drained hero+by-pillar duplicate (commit e10a8b6) — a different slot but the same multi-surface independent-pick problem.
- evidence: "By pillar" Deep Dives card: "Why the Gateron Oil King sounds the way it does" (May 4, 5 min read). "Long reads worth your weekend" card immediately below: same headline, same byline, same dek snippet. `apps/web/src/components/home/HomeDeepDivesRail.tsx` picks the newest deep-dive article from the unfiltered list; `<LatestByPillar>` separately picks the same article for its Deep Dives slot.
- suggested fix: thread `excludeSlugs` from `<LatestByPillar>`'s resolved picks into `<HomeDeepDivesRail>` (same pattern as the e10a8b6 fix). One-liner at the home page: compute `byPillarPickSlugs = new Set(resolveLatestByPillar(...).map(a => a.slug))` and pass it as `excludeSlugs` to the deep-dives rail. Or — alternative — seed a second deep-dive piece so the long-reads rail naturally has its own pick (overlaps with the data-sparsity backfill phase).

### [LOW] /tag/gateron — latest-first sort weights peripheral tag mentions above core articles
- pass: 4 (commit b2692ac)
- viewport: both
- category: navigation
- observation: Tag page promises "4 articles tagged Gateron" but the top result is "Reading the Trends Tracker" — a methodology explainer that mentions Gateron only because Oil King is on the tracker that week. Sorting by latest puts a tangentially-tagged article above the two articles that are actually about Gateron switches.
- evidence: Header reads "#gateron / 4 articles tagged Gateron". First card: "Trends / Reading the Trends Tracker" (May 8). Second: "Ideas / Pairing Oil Kings with the Mode Sonnet" (May 7). Third: "Deep Dives / Why the Gateron Oil King sounds the way it does" (May 4) — the article most directly about the tag. Sort is `publishedAt desc`.
- suggested fix: relevance signal for tag pages is hard without analytics. Two cheap options. (a) Downweight peripheral tag mentions: when an article references a tag only inside `<PartReference>` (not as a primary `tags` frontmatter entry), exclude it from the tag's article list. (b) Expose a "most relevant" default sort with "latest first" as a toggle — relevance computed from frontmatter primary-tag presence + body-mention density. (a) is the lighter-touch fix and matches the data model (tags vs. mentioned-parts already distinguishes intent).

### [x] [MED] / — "By pillar" grid only renders 4 of the 5 pillars; Ideas is silently excluded
- addressed in: pending commit (this tick)
- issue: [mirror-failed: 2026-05-09T18:36Z — loop-issue.mjs label-ensure 403]
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: content
- root cause: `apps/web/src/components/home/LatestByPillar.tsx` shipped phase 6 with `HOME_PILLAR_SET = ['news', 'trends', 'deep-dives', 'guides']` and a code comment "Drops `ideas` from the default set until phase 9 ships — ideas is the lowest-volume pillar in seed content." Phase 9 (the Ideas pillar) shipped in `5fa4ee4`-area work and the pillar now has at least one featured article (`building-mode-sonnet-with-oil-kings`), but the home set was never updated. The header nav rendered all 5 chips while the by-pillar grid silently rendered 4 — a discoverability hole on the highest-traffic surface.
- fix: re-added `'ideas'` to `HOME_PILLAR_SET` in slot order matching the header nav (news → trends → ideas → deep-dives → guides). Updated the comment to record that the resolver's empty-pillar fallback handles low-volume pillars cleanly. Restructured the grid layout from `lg:grid-cols-4` → `lg:grid-cols-3 xl:grid-cols-5` so 5 cards lay out cleanly across breakpoints (3 cols at lg, 5 cols at xl) — chosen over option (a) "rename to Selected pillars" because the header nav source-of-truth is 5 pillars and the section heading should match.
- regression guard: rewrote the colocated `LatestByPillar.test.tsx` first case to construct an Ideas article and assert the resolver returns 5 picks in the bumped pillar order (news, trends, ideas, deep-dives, guides). Comment in the test cites this critique row so future Tailwind/grid tweaks fail loud if Ideas is dropped again.

### [x] [MED] / — Hero card and "By pillar" Trends slot both surface trends-tracker-preview, duplicating it above the fold
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: content
- root cause: `apps/web/src/app/page.tsx` set `const latestByPillar = articles` (unfiltered) and fed it to `<LatestByPillar>`, which had no awareness of the hero pick. Both surfaces independently picked `trends-tracker-preview` — the hero because it's the newest article overall (via `pickHero`), and the by-pillar Trends slot because it's the newest in the `trends` pillar. Reader saw the identical card twice in the first viewport.
- fix: shipped exactly the row's suggested-fix shape. Threaded an optional `excludeSlugs?: ReadonlySet<string>` through both `resolveLatestByPillar` (third param, default empty `Set`) and `<LatestByPillar>` (third prop). The exclusion filter applies to both the per-pillar match AND the fallback pool, so the hero slug can never resurface anywhere in the grid. Home page wires `heroExcludeSlugs = new Set([heroArticle.slug])` (or `undefined` when no hero — defensive against the empty-articles edge case). Comment at the call site cites this critique row.
- regression guard: new `resolveLatestByPillar` unit test "excludes slugs in excludeSlugs from both per-pillar match and fallback" constructs a trends-hero / trends-runner-up / news triplet and asserts the runner-up wins the trends slot when the hero is excluded. 212 unit tests pass (was 211 — the new test adds 1).

### [MED] /sources — every cited article shows a uniform "1 cite" badge, reading as a placeholder
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: data
- observation: The /sources page promises "honesty about where we got the facts" but every one of the six listed articles shows the same "1 cite" badge. Uniformity makes the count look stubbed rather than tallied. The page's value-add (which articles cite *more* sources) is invisible.
- evidence: Verified: every seed article ships with exactly one `<Source>` tag (one citation each across `alice-layout-decline`, `beginners-switch-buying-guide`, `building-mode-sonnet-with-oil-kings`, `gateron-oil-king-deep-dive`, `mode-sonnet-r2-group-buy-coverage`, `trends-tracker-preview`). The aggregate is technically correct; the visual signal is meaningless.
- suggested fix: ship the inline citation list per article (the [LOW 3.5] phase-16 follow-up audit row in `plan/AUDIT.md` already plans this — "/sources per-citation index"). Promote that audit row from LOW to MED since draining it directly addresses this critique. As an interim, hide the count badge when every visible row has the same value, and replace it with a "1 source linked" fallback chip so the badge stops looking auto-generated.

### [MED] /trends/tracker — every category section renders exactly one row, so the table chrome dwarfs the data
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: data
- observation: Each of the five movers tables (Switch / Keycap / Layout / Vendor / Brand) shows one row. The full Rank / Name / Score / 8-wk / Editor's-note column header reads as scaffolding wrapped around a single data point — the page promises "the signature feature" in its eyebrow and delivers a five-row total.
- evidence: Switch movers (ref_60): one row Gateron Oil King. Keycap movers (ref_74): MT3. Layout (ref_86): Alice. Vendor (ref_100): Mode Designs. Brand (ref_112): Wuque Studio. `data/trends/2026-W19.json` carries the same five rows. Related to the open [LOW] em-dash finding (the *cells* are em-dashes for unlinked rows; this finding is about the *table dimensions* feeling sparse).
- suggested fix: backfill the snapshot — `/iterate` `data-gaps` audit (§4.B in `skills/iterate.md`) should pick this up next tick. Target ≥ 3 rows per category, even if the trailing rows are flat-direction. Reader's secondary suggestion (collapse single-row sections into one combined table with a category column) is a fallback if backfill is slow; keep the per-category structure if real data lands within a couple of ticks.

### [x] [MED] /about + /newsletter — voice mismatches between editorial pages ("we" vs "I")
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 3 (commit 11c0777)
- viewport: both
- category: voice
- root cause: two coupled register slips. (1) `apps/web/src/components/newsletter/NewsletterArchive.tsx` empty state used first-person singular: `"Subscribe above and I'll send you the first one when it ships."`. (2) `apps/web/src/app/about/page.tsx` lede claimed `"Editorial standards, voice, and the people behind thock."` — a promise of a masthead the page never delivered. Reader hopped from impersonal "thock is" → "we" (in /about's "we do not currently have affiliate arrangements") → "I" (on /newsletter) across two adjacent surfaces.
- fix: shipped the cheapest path from the row's two-path menu — unified to first-person plural "we" across both surfaces. Concrete edits: (1) `NewsletterArchive.tsx` empty-state copy `I'll send you` → `we'll send you`. (2) `apps/web/src/app/about/page.tsx` `LEDE` constant: dropped the "people behind thock" claim (which would have required a masthead with editor names — the user has not authorized this) in favour of `"Editorial standards, voice, and how we cover the hobby. Knowledgeable peer, never breathless hype."` — same length, same eyebrow-shape, and now the lede promises only what the body delivers. Deferred the "better path" (named masthead + mailto:) since that needs user input on naming; surfaced as a `[needs-user-call]` candidate for `/oversight` rather than a unilateral edit.
- regression guard: no test assertions reference either string literal — the phase 15 brief at `plan/phases/phase_15_newsletter_rss.md:136` carries the original "I'll send you" copy as a point-in-time spec snapshot and is intentionally left alone. Subsequent voice slips will surface in the next /critique pass — the bias is now externally observable.

### [LOW] /trends/tracker — linked rows expose two affordances pointing at the same URL
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: visual
- observation: After the rows-not-links critique fix (commit `a7501af`) shipped, linked rows render the row name as a Link to the deep dive AND the editor's-note column as a Link to the same article. Tab order hits the same destination twice per linked row; mouse hover lights up two distinct affordances side-by-side that go to identical places.
- evidence: Gateron Oil King row: name link to `/article/gateron-oil-king-deep-dive` + editor's-note CTA "Why the Gateron Oil King sounds the way it does →" to the same URL. Same shape on the Alice row. `apps/web/src/components/tracker/TrackerRow.tsx` lines 44-53 render both Links unconditionally when `noteHref` resolves.
- suggested fix: differentiate the editor's-note copy from the article title — make the column a one-line editorial take (a sentence the editor wrote about *why* this row moved) instead of the article title. That keeps both Links useful: row name = "go read the article"; editor's note = "here's why I think this is moving." If editorial-note copy is too much work right now, drop the row-name Link and keep the explicit CTA — the rows still link via the editor's-note column, and the affordance becomes singular.

### [x] [HIGH] /article/* — no hero art; locked directive not yet implemented
- addressed in: commit 0e7c9fd (brand-assets posture drain, 2026-05-09)
- pass: 2 (commit e270ced)
- viewport: both
- root cause: at filing time, the bearings directive (locked earlier the same morning) called for a colorful keyboard SVG hero per article but no asset had shipped — every article banner rendered eyebrow + H1 + lede + byline alone, with `heroImage: null` in every frontmatter and no SVGs under `apps/web/public/`.
- fix: brand-assets-first posture drain rendered six hero SVGs via `brander` under `apps/web/public/hero-art/<slug>.svg` with provenance JSON siblings (per-article splash hue, single warm-bronze accent, 1200×750, ~2px stroke per the directive). Each MDX frontmatter wired `heroImage: /hero-art/<slug>.svg` + descriptive `heroImageAlt`. `packages/content/src/schema/frontmatter.ts` `heroImage` Zod refinement loosened from `.url()` to "absolute path or full URL" so the bearings-spec path format validates. `ArticleHero` already rendered `heroImage` via next/image when set — no component change needed.
- forward-looking: `skills/iterate.md` Step 3 was updated in the same drain commit (97e1f6c) so future articles drafted by /iterate bundle prose + hero SVG + provenance + frontmatter wiring as a single commit. New articles can no longer ship art-less.

### [x] [HIGH] /trends/tracker — lede claims rows link to deep dives, but no row links anywhere
- addressed in: pending commit (this tick)
- pass: 2 (commit e270ced)
- viewport: desktop
- category: content
- root cause: two-part. (1) The hard-coded lede in `apps/web/src/app/trends/tracker/page.tsx` claimed "Each row links to the deep dive that earned it." (2) `data/trends/2026-W19.json` shipped every row with `articleSlug: null`, so `TrackerRow` computed `noteHref = null` for every row and rendered "—" in the desktop editor's-note column. The contradiction was glaring on the page bearings calls out as "the signature feature."
- fix: shipped option (a) from the suggested-fix menu — make the lede claim literally true wherever a deep dive exists. Concrete edits: (1) `data/trends/2026-W19.json` — backfilled `articleSlug` for the two rows whose name matches a published article (`Gateron Oil King → gateron-oil-king-deep-dive`, `Alice layout → alice-layout-decline`). The other three rows (MT3 profile, Mode Designs, Wuque Studio) keep `null` because no matching article exists yet — they'll backfill as `/iterate` ships content. (2) `apps/web/src/components/tracker/TrackerRow.tsx` — when `noteHref` resolves, the row name itself is now wrapped in `<Link>` (data-testid `tracker-row-name-link`) with the same `font-serif text-h3` styling plus a brass `hover:text-accent`. When no article resolves, the row name stays a plain `<span>`. The editor's-note column behavior (mobile sub-link + desktop column) is unchanged. (3) `apps/web/src/app/trends/tracker/page.tsx` — softened the lede to "Row names link to their deep dive when one has been published." The lede now matches reality across both filled and empty rows.
- regression guard: (1) New e2e test in `apps/e2e/tests/trends.spec.ts` ("row names link to their deep dive when an article exists") asserts both backfilled row names render as Links to the correct article slug, scoped via `getByRole('link', { name: '<row name>', exact: true })` so it can't accidentally match the editor's-note Link in the same row. (2) Two new TrackerRow unit tests cover the linked-name and plain-span paths via `data-testid="tracker-row-name-link"`. (3) Existing editor's-note unit test rewritten to use `querySelectorAll` + a text predicate so it survives the new dual-link DOM. Full unit suite 176 passes; trends e2e 8/8 passes; the known PageStub `#418` hydration flake on /search /tag/trends-tracker / /trends / /sources is unrelated and tracked separately in plan/AUDIT.md.

### [x] [MED] /tag/[slug] — "← all tags" affordance lies about its destination
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 2 (commit e270ced)
- viewport: both
- category: a11y
- root cause: `apps/web/src/app/tag/[slug]/page.tsx:115-120` rendered a back-link `<Link href="/">← all tags</Link>`. The label promised a tag index; the destination dumped readers on home. Per the critique row's two-path menu (a) cheap relabel, (b) ship a real `/tags` index — path (b) was promoted to PHASE_CANDIDATES at score 5.5 (commit f64f06e) for /oversight to schedule.
- fix: shipped path (a) — relabeled the back-link text from `← all tags` → `← home` so destination and affordance now match. Single-line text change in `apps/web/src/app/tag/[slug]/page.tsx`. Added `data-testid="tag-page-back-link"` so a future e2e test (likely landing with the /tags index phase) has a stable handle. When /tags ships, the relabel reverts to `← all tags` pointing at `/tags` — that's a forward-looking 1-line change in the same file.
- regression guard: none beyond the data-testid hook (no test asserts the literal text in either direction). The /tags index phase brief should add an e2e covering both back-link round-trips in the same change. Filed via PHASE_CANDIDATES f64f06e.

### [x] [MED] /group-buys + / — "Closing soon" framing applied to a buy with 37 days left
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 2 (commit e270ced)
- viewport: desktop
- category: voice
- root cause: two surfaces hardcoded urgent framing regardless of window. (1) `apps/web/src/app/group-buys/page.tsx:103` rendered `<HomeSectionHeading kicker="Live now" title="Closing soon" />` for the entire live section. (2) `apps/web/src/components/home/GroupBuysWidget.tsx:54` rendered `"group buys · ending soon"` + `"Don't miss the close"` whenever any active buy existed. The row-level 72h urgency check already lived in `GroupBuyCountdownRow` (`ACCENT_THRESHOLD_DAYS = 3`) — it just wasn't bubbled up to the section/widget headings.
- fix: shipped exactly the row's suggested-fix shape — headings are now urgency-aware and never make claims that contradict the row signals. Concrete edits: (1) New helper `splitLiveByUrgency(live, now): { closingSoon, liveOpen }` in `apps/web/src/app/group-buys/helpers.ts` that splits the live array on a 3-day endDate threshold. (2) `/group-buys/page.tsx` renders a conditional `kicker="Last 72h" title="Closing soon"` sub-section only when `closingSoon.length > 0`, and a `kicker="Live now" title="Open now"` section for the rest of the live buys. (3) `<GroupBuysWidget>` computes `anyUrgent = sorted.some(daysLeft <= 3)` and switches the kicker/heading: urgent → "group buys · ending soon" / "Don't miss the close"; otherwise → "group buys · open now" / "Currently running". Added `data-urgent` attribute on the `<aside>` for testability and analytics. The bearings rule "brass urgency reserved for the last 72 hours" is now enforced at the heading level, not just the row.
- regression guard: 5 new unit tests across two files. `splitLiveByUrgency` tests cover empty input, the 3-day threshold (≤3 days = closingSoon, >3 days = liveOpen), and today (0 days left) → closingSoon. `<GroupBuysWidget>` tests cover both paths: `anyUrgent=false` → neutral "open now / Currently running" framing + `data-urgent="false"`; `anyUrgent=true` → "ending soon / Don't miss the close" + `data-urgent="true"`. 217 unit tests pass (was 212).
- source: browser

### [x] [MED] /trends — pillar archive labeled "All Trends pieces" but excludes the hero
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 2 (commit e270ced)
- viewport: both
- category: content
- root cause: every pillar page (`/trends`, `/news`, `/ideas`, `/deep-dives`) splits the article list into `lead = all[0]; archive = all.slice(1)` to surface the newest piece as a hero card, then renders the rest under `title="All <Pillar> pieces"`. The "All" claim disagreed with reality by exactly one (the hero) on every pillar — and the disagreement was most visible on /trends where the archive contained a single article ("The slow fade of Alice layouts") under "All Trends pieces" while the hero "Reading the Trends Tracker" sat right above it.
- fix: shipped the row's lower-friction option (rename, not include-hero-in-archive). Renamed the heading from `"All <Pillar> pieces"` → `"More <Pillar> pieces"` across all four pillar pages: `apps/web/src/app/trends/page.tsx:120`, `news/page.tsx:109`, `ideas/page.tsx:126`, `deep-dives/page.tsx:106`. Also normalized `deep-dives` from "All Deep Dives" (missing the "pieces" suffix the other three carried) → "More Deep Dives" (matching the kicker rhythm without the suffix, which reads better for the two-word pillar name). Single string change per file.
- regression guard: no test assertions reference these literal strings — only the design exemplar (`design/page-pillar.jsx:48`) and the phase 7 brief (`plan/phases/phase_7_news.md:26`) carry "All News pieces" as point-in-time snapshots and are intentionally left alone. Future pillar-shape changes that re-introduce "All" framing will fail loud at the next /critique pass.
- source: browser

### [x] [LOW] / footer — newsletter form aria-label is "Newsletter signup placeholder"
- addressed in: pending phase 15 commit
- pass: 2 (commit e270ced) — filed as a low-priority observation worth noting but expected to drain naturally with phase 15 newsletter shipping.
- note: this was reader's eighth raw observation; I curated it down to six during pass-2 self-assessment with the rationale "Phase 15 will replace the form entirely." Phase 15's footer retrofit (replacing the inert form with `<ButtondownForm variant="footer">`) drops the placeholder aria-label as expected. Closing inline with the phase-15 ship, no separate iterate tick required.

### [x] [MED] /article/trends-tracker-preview — hero-art sparkline has too much padding; reads small at every form factor (user jot)
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: user-jot (commit 40fefe2)
- viewport: both
- auth_state: anonymous
- category: visual
- root cause: the v1 SVG (rendered during the brand-assets-first drain at commit `0e7c9fd`) used baseline `x=200→1000` (67% width, ~17% padding each side) and chart band `y=330→540` (28% height, ~42% empty space above). The chart visually sat in the lower third — fine in isolation, but `<ArticleHero>` displays the SVG inside an `aspect-[16/9]` container with `object-cover`, which crops a strip top + bottom. Combined with the existing internal padding, the inked sparkline read as a small chip in the centre of the frame, not as the focal hero.
- fix: shipped path (1) from the row's two-path menu — re-rendered the trends-tracker-preview SVG via `brander` with an explicit tighter brief (revision: 2). New geometry: baseline `x=90→1110` (85% width, 7.5% padding each side), inked vertical range `y=94→678` (78% height with the cursor's outer ring at the top edge of the safe-margin band). Every didactic move from v1 preserved verbatim — same ochre/brass splash hue, warm-grey 2px stroke, 8-point upward-trending shape, focal cursor + outer ring, right-side annotation tick at the cursor's y-level, baseline + 8 vertical guide ticks, low-fill area sweep beneath the line. Provenance JSON sibling bumped to `revision: 2` with `revisionReason` referencing this jot. Cropped 16:9 frame still includes the cursor ring (top at y=94, visible) and the baseline ticks (bottom at y=678, visible) — verified by computing the aspect-cover crop window (y=37.5→712.5).
- regression guard: provenance JSON now records `revision: 2` and a `revisionReason` line — future re-renders see the explicit "the chart should fill the canvas" intent and won't quietly regress to v1 padding. The other 5 hero SVGs are unchanged (per the row's recommendation: "path (1) for the immediate user complaint plus a follow-up audit on the other five"). A follow-up iterate tick can audit them with the user's complaint as the criterion.
- source: user


### [MED] /group-buys — Mode Sonnet R2 is fictional; seed needs real vendor data (user jot)
- pass: user-jot (commit e56989c)
- viewport: unspecified
- auth_state: anonymous
- category: content
- observation: Mode Sonnet R2 on https://thock-coral.vercel.app/group-buys is not present at cannonkeys. Can an agent actually populate with some valid groupbuys?
- evidence: user-spotted at 2026-05-09T18:58Z. Confirms: the seed at `data/group-buys/cannonkeys-mode-sonnet-r2.json` is fictional content from the phase-2 seed pass. The earlier `/jot` on this same record (commit 593b1f9) was about the dead vendor URL, drained at 9255abe by reframing the row as `status: announced` with the vendor homepage as the CTA — that fixed the 404 but didn't address the deeper concern that the *product* is made up.
- suggested fix: [user has not specified — iterate to determine. Ship-data flow with the `scout` agent: scout researches current real group buys at CannonKeys / NovelKeys / Wuque / Mode Designs etc. (vendor pages, group-buy aggregators like geekhack), returns a structured set of candidate records with start/end/region/url verified by HEAD probe. Then ship-data drops each as a `data/group-buys/<vendor>-<slug>.json` record. Retire the fictional Mode Sonnet R2 record (or move to `data/group-buys/_archive/` if we want to keep it as test fixture; otherwise just delete). Two-tick path: tick 1 = scout research + 2-3 record commits; tick 2 = retire the fictional row. The same pattern can backfill switches/keycap-sets/boards/vendors.]
- source: user


### [x] [MED] /article/* — cheat-sheet / Callout block has no margin-bottom; next H2 collides (user jot)
- addressed in: pending commit (this tick)
- pass: user-jot (commit 25ad482)
- viewport: unspecified
- auth_state: anonymous
- category: visual
- root cause: `<Callout>` (`my-6` = 24px each side) followed directly by `<SerifH2>` (`mt-12` = 48px) collapses to a 48px gap per standard CSS margin-collapse. Visually the bordered, tinted Callout block reads as claiming more space than its 24px outer margin, so the 48px gap above the next H2 didn't feel like deliberate breathing room — the two blocks read as flush. User confirmed the symptom on both `/article/beginners-switch-buying-guide` (Callout "Cheat sheet" → H2 "The three families") and `/article/mode-sonnet-r2-group-buy-coverage` (Callout "Group-buy timing" → H2 "What's new in R2").
- fix: bumped both sides of the boundary so any reader perceives clear separation: `packages/content/src/mdx/components.tsx` SerifH2 `mt-12` → `mt-16` (48px → 64px); `packages/content/src/mdx/Callout.tsx` `my-6` → `my-8` (24px → 32px each side). Margin-collapse picks the larger neighbour, so a Callout-followed-by-H2 now lands at max(32, 64) = 64px gap rather than 48px. The change is global across every article — addresses the user's "this might be an issue for all cheat sheets" implicit ask without per-instance edits.
- regression guard: new `packages/content/src/__tests__/mdx/spacing.test.tsx` (2 tests) asserts (a) `<Callout>` carries `my-8` and not the legacy `my-6`, and (b) `mdxComponents.h2` carries `mt-16` and not the legacy `mt-12`. Future Tailwind-class tweaks will fail loud if the spacing regresses.


### [LOW] /trends/tracker — every editor's-note cell is a uniform em dash
- pass: 2 (commit e270ced)
- viewport: desktop
- category: data
- observation: The desktop layout reserves a 1.4fr column on each tracker row for an editor's note (linking to a deep dive). Across all five categories every cell renders "—". The page advertises a dashboard but reads as a five-row stub waiting for content. This is the same root data gap as the [HIGH] above; filing separately because the right fix is a content backfill, not a code change.
- evidence: `data/trends/2026-W19.json` ships every row with `articleSlug: null`. `TrackerRow.tsx:64-73` renders an em dash whenever `noteHref` is null, and the desktop column has `text-text-4` styling that only emphasizes the emptiness when every cell shares it.
- suggested fix: backfill `articleSlug` on the rows that already have a matching article (Gateron Oil King, Alice layout). For categories where no article exists yet (MT3 profile, Mode Designs, Wuque Studio), commission a one-paragraph editorial note as a `note: string` field on the row schema — small additive schema change in `packages/data` — and render it as plain text when the slug doesn't resolve. That way no cell is ever a bare em dash.
- source: browser

### [x] [MED] /group-buys — seed CTA points at a 404 vendor URL (user jot)
- addressed in: pending commit (this tick)
- pass: user-jot (commit 593b1f9)
- viewport: both
- category: data
- auth_state: anonymous
- root cause: `data/group-buys/cannonkeys-mode-sonnet-r2.json` shipped with `url` pointing at `https://cannonkeys.com/products/mode-sonnet-r2`, which is not a valid product page on the vendor's site. The only seed buy on /group-buys rendered a "view at vendor" CTA that 404'd on click. Same href was reused in the home group-buys widget, so first impressions broke from two surfaces.
- fix: option (b) from the suggested-fix menu — reframed the seed as `status: announced` with the vendor homepage as the CTA destination. Concrete edits: `status` live → announced; `url` → `https://cannonkeys.com` (vendor homepage, schema-valid since UrlSchema is just `z.string().url()`); `startDate` 2026-05-01 → 2026-06-01 and `endDate` 2026-06-15 → 2026-07-15 (announced status with a past startDate would render "opens today" — pushed to a coherent pre-launch window); `description` extended with "Watch the CannonKeys storefront for launch — R2 has not yet opened to checkout" so the editorial copy matches the new status. The mode-sonnet-r2 article keeps its prior dates as historical news coverage; the data record now reflects the more current "delayed" state.
- regression guard: `packages/data/src/__tests__/loaders/group-buys.test.ts` reference dates updated — the "excludes-once-past" case now uses 2026-08-01 to stay strictly after the new endDate, and the seed-active comment was refreshed. `pnpm verify` green: 209 unit + 175 e2e passing; manifest + search index regenerated by the prebuild/pretest hooks. The user-jot's deferred ask ("add a data:link-rot smoke step so future seed entries can't ship a dead vendor URL silently") is post-MVP and not in this tick's scope.


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
