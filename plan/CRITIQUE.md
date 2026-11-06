# Critique log

> Last pass: 2026-11-06T00:16:44Z at commit 113926e9
> Pass count: 18
> Iterate-bias category: external-critique (pass 18 fired 16 commits after pass 17 — scripted walk per UI: both, anonymous-only (no Chrome MCP on the cloud runner; ui-walk.mjs scripted walk via CDP, 14 screens, 0 automated findings). Reader visited 7 routes x 2 viewports (/, /news, /trends/tracker, /group-buys, /tools, /quiz/switch, /compare/switch); surfaced 2 candidates, self-assessment kept 2. Filed: [HIGH] /group-buys — every one of the 18 group-buy records in `data/group-buys` carries `status: "closed"` with an `endDate` already past, so `live.length === 0` and `announced.length === 0` for every current visitor; the hero lede promises "Active group buys for boards, keycap sets, and switches" but the only content block a visitor sees is "RECENTLY ENDED — Just closed", contradicting the page's own premise (`apps/web/src/app/group-buys/helpers.ts` `isLive`/`isAnnounced`); [LOW] /quiz/switch — the "Quiet and office-friendly" answer's aside "Dampened — colleagues will thank you" (`SwitchQuiz.tsx:22`) reads quippier than the quiz's otherwise dry, factual tone. Reader-tool artifact rate: 0% this pass — both findings verified against source and data (`data/group-buys/*.json`, `apps/web/src/app/group-buys/helpers.ts`, `SwitchQuiz.tsx`) before filing.)
> Pass 17 last pass: 2026-11-05T16:09:48Z at commit 5ec23cdd
> Pass 16 last pass: 2026-10-31T04:11:00Z at commit 6b73abed
> Pass 13 last pass: 2026-10-27T23:31:41Z at commit a03ead8e
> Pass 11 last pass: 2026-10-26T18:54:00Z at commit a01a911
> Iterate-bias category: external-critique (pass 11 fired 12 commits after pass 10, after the content-velocity directive shipped + 4 new content pieces drained the pillar quotas — Trends now at quota 8/8, News 3→4, group-buy companions 5→4 missing. Reader's pass 11 visited 6 URLs (/, /article/cannonkeys-nyawice-group-buy, /trends, /trends/tracker, /group-buys, /tag/gmk) and surfaced 6 candidates; self-assessment kept 4 (1 duplicate of pass-9 date-staggering finding, 1 self-hedged %-unit nit). Filed: [HIGH] /article/cannonkeys-nyawice-group-buy — body says "roughly one week left as of this column" but the article is dated 2026-04-17 (the buy's startDate per Rule 4 group-buy exemption) and the window runs to 2026-05-17 (4 weeks from publish, not 1 — content-curator wrote present-tense reading-state copy instead of publication-date-relative copy); [HIGH] /group-buys "Just closed" section — Ishtar R2 card carries a "LIVE" status pill despite sitting under the Just-closed band (renderer pulls STATUS_LABEL[record.status] regardless of variant; the data has status:'live' + endDate today so the row's section placement is right but the pill text leaks); [MED] /tag/gmk — only 1 article (Prussian Alert) despite 3 unfinished GMK CYL group-buy companions in the live set; tag will self-fill as the loop ships those companions; [LOW] /article/cannonkeys-nyawice-group-buy — body uses "the W19 movement score" as a metric phrase, reads as internal-dashboard taxonomy. Reader-tool artifact rate: 0% — every finding verified against curl-grep or data inspection.)
> Pass 10 last pass: 2026-05-10T18:55:00Z at commit 0e2314f
> Iterate-bias category: external-critique (pass 10 fired 12 commits after pass 9, after a drain that shipped pass-9's [MED] aside-spacing user-jot (#32, a0fdaa8), [MED] /trends/tracker heading-skip a11y (#33, f70b1f3), [MED] / Trending rail flat tile (#34, bb70360), and [MED] /trends/tracker Sleeper card on flat row (#35, bdc2082) — all four pass-9 [MED] findings drained in 4 consecutive iterate ticks. Reader's pass 10 visited 6 URLs (/, /article/lubing-101, /trends, /trends/tracker, /group-buys, /tag/modding) and surfaced 6 candidates; self-assessment kept 6 (none dropped — every reader finding verified against rendered HTML / source). Filed: [HIGH] /article/lubing-101 — malformed sentence "Brushes drift; this is why brushes drift toward the leaves matters." (real copy bug, mdx line 55, surfaces in body prose); [MED] /group-buys — "Last 72h" eyebrow on forward-looking "Closing soon" section reads retrospective; [MED] / — "0d" countdown vs /group-buys "closes today" cross-surface inconsistency on the same buy; [MED] /tag/modding — "TAG · MISC" eyebrow undersells modding (taxonomy gap; same shape will hit /tag/lubing, /tag/firmware); [LOW] /group-buys — "0 announced" segment names a bucket with no corresponding section; [LOW] /trends/tracker — "SIGNATURE" eyebrow reads as in-house marketing voice. Reader-tool artifact rate: 0% this pass — every finding holds up under curl-grep verification.)
> Pass 9 last pass: 2026-05-10T17:15:00Z at commit 40b2e55
> Pass 8 last pass: 2026-05-10T14:00:00Z at commit d34580c
> Pass 7 last pass: 2026-05-10T08:30:00Z at commit e3de21d
> Pass 6 last pass: 2026-05-10T07:30:00Z at commit dfa5596

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [HIGH] /group-buys — every group-buy record is closed; the page's "Active group buys" promise is never true for current visitors
- pass: 18 (commit 113926e9)
- viewport: both
- category: comprehension
- observation: the hero lede reads "Active group buys for boards, keycap sets, and switches. We track start/end dates, region availability, and which vendor is running each one," but all 18 records in `data/group-buys/*.json` carry `status: "closed"` with an `endDate` already in the past (latest: 2026-09-22). `partitionGroupBuys`'s `isLive`/`isAnnounced` helpers (`apps/web/src/app/group-buys/helpers.ts:20-29`) key off `gb.status`, so `live.length === 0` and `announced.length === 0` for every visitor right now. The page renders only the "RECENTLY ENDED — Just closed" section below the summary line — a first-time visitor's first and only content block directly contradicts the lede's "active" framing.
- evidence: `data/group-buys/*.json` (18/18 records `status: "closed"`); `apps/web/src/app/group-buys/helpers.ts:20-29` (`isLive`/`isAnnounced`); walk screenshots `url--desktop--group-buys.png` / `url--mobile--group-buys.png` (`.nexus/walk/2026-11-06T00-16-44-961Z/`, not committed — cite this line for re-verification) show "Just closed" as the only visible section.
- suggested fix: either ship new live/announced group-buy records (a data-content gap — `/ship-data` or a content generator should keep at least one buy open), or, if the real-world lull is expected, swap the lede for state-aware copy ("No live buys right now — here's what just wrapped") instead of an evergreen "active group buys" claim that reads false whenever the live/announced buckets are empty.
- source: walk

### [LOW] /quiz/switch — one answer's aside reads quippier than the quiz's otherwise dry tone
- pass: 18 (commit 113926e9)
- viewport: desktop
- category: voice
- observation: the "Quiet and office-friendly" answer option pairs with the aside "Dampened — colleagues will thank you" (`apps/web/src/components/quiz/SwitchQuiz.tsx:22`). The other options on the same question use plain factual descriptors; this one leans toward a quippy aside against bearings' "knowledgeable peer, not breathless hype" voice.
- evidence: `apps/web/src/components/quiz/SwitchQuiz.tsx:22`; walk screenshot `url--desktop--quiz-switch.png` (`.nexus/walk/2026-11-06T00-16-44-961Z/`, not committed).
- suggested fix: swap to a factual descriptor matching the other options' tone, e.g. "Dampened — low noise floor, good for shared spaces."
- source: walk

### [MED] / — home hero shows no site tagline or description in the live (populated) state, only in the dead empty-state branch
- pass: 17 (commit 5ec23cdd)
- viewport: both
- category: comprehension
- observation: `HomePage` (`apps/web/src/app/page.tsx`) renders `<PageSectionKicker>{siteConfig.tagline}</PageSectionKicker>` only inside the `heroArticle === null` branch (lines 129-141) — the fallback shown when there are zero articles. The live site always has articles, so the rendered path is `<ArticleCard article={heroArticle} variant="hero" />`, which carries no site tagline, no description, nothing identifying the vertical. A first-time visitor sees the `thock.` wordmark, nav labels (News/Trends/Ideas/Deep Dives/Guides/Tools), and then jumps straight into a specific Deep Dives article headline with no one-line cue that this is a mechanical-keyboard site — the exact context the tagline exists to supply is wired to the one state that never renders in production.
- evidence: `apps/web/src/app/page.tsx:129-141` (tagline kicker only in the `!heroArticle` branch); walk screenshots `url--desktop--home.png` / `url--mobile--home.png` (`.nexus/walk/2026-11-05T16-04-13-575Z/`, not committed — cite this line for re-verification) show header → article hero with no intervening tagline.
- suggested fix: render a persistent one-line tagline/subhead (e.g. `siteConfig.tagline`) near the wordmark or above the hero in the populated path too, not only in the empty-state fallback.
- source: walk

### [MED] / — persistent nav and footer list every pillar plus Tools, but omit Group Buys entirely
- pass: 17 (commit 5ec23cdd)
- viewport: both
- category: navigation
- observation: `PrimaryNavLinks.tsx`'s `NAV_ITEMS` is `PILLARS` (News, Trends, Ideas, Deep Dives, Guides) plus a hardcoded Tools entry; the footer (`Footer.tsx`) lists About/Sources/RSS/Newsletter. Neither names Group Buys, even though `/group-buys` is a full page with its own data model, status bucketing, and a dedicated homepage widget (`GroupBuysWidget.tsx`, which does link to `/group-buys`). The page is reachable from home but has no persistent nav path back to it from an article, a pillar page, or `/tools` (whose 4 cards are quiz/switch, quiz/keycap-set, compare/switch, compare/boards — no group-buys card either).
- evidence: `apps/web/src/components/ui/PrimaryNavLinks.tsx:15-18` (`NAV_ITEMS` list); `apps/web/src/components/ui/Footer.tsx` (no group-buys link); `apps/web/src/app/tools/page.tsx` (4 cards, none for group buys); walk screenshots confirm identical header nav across `url--desktop--home.png`, `url--desktop--news.png`, `url--desktop--group-buys.png`, `url--desktop--tools.png` with no active/bold nav item when on `/group-buys`.
- suggested fix: add a Group Buys item to the header nav (or, if nav real-estate is a concern, a 5th card on `/tools` and a footer link) so the page has a persistent discovery path independent of the homepage widget.
- source: walk

### [MED] /trends/tracker — "Biggest Faller" summary card can show a smaller-magnitude number than the "Sleeper" card beside it
- pass: 16 (commit 6b73abed)
- viewport: desktop
- category: comprehension
- observation: `pickSummarySlots` (`apps/web/src/lib/tracker/index.ts`) ranks the riser/faller/breakout slots by `sparkSlope` (this week's actual movement, a deliberate pass-9 fix so a high-level-but-barely-moved row never gets crowned "biggest") and the sleeper slot by smallest `abs(score)` among what's left — two unrelated ranking criteria. But both `TrackerSummaryCard` and the main table row (`TrackerRow.tsx:43`) display `formatDelta(row.score, row.direction)`, i.e. the row's static -100..100 score dressed as a signed percentage, not the slope that won it the slot. This week that mismatch is visible: "BIGGEST FALLER / GMK CYL Red Devils R2 / -28%" sits directly beside "SLEEPER / GMK CYL Zombie / -40%" — a plainly bigger negative number under a card that isn't claiming to be the biggest mover.
- evidence: walk screenshot `url--desktop--trends-tracker.png` (`.nexus/walk/2026-10-31T04-11-47-938Z/`, not committed — cite this line for re-verification); `data/trends/2026-W44.json` rows `GMK CYL Red Devils R2` (score 28, down) and `GMK CYL Zombie` (score 40, down); `apps/web/src/lib/tracker/index.ts:42-90` (sparkSlope-based picking vs score-based sleeper picking); `apps/web/src/components/tracker/TrackerSummaryCard.tsx:28` (`formatDelta(row.score, row.direction)`).
- suggested fix: the mismatch is structural (ranking criterion ≠ displayed number), not a one-row data bug, so the safe fix is presentational rather than re-deriving the picking logic (which pass 9 deliberately chose for good reason): add a short caption under "This week at a glance" clarifying the cards are picked by this week's movement, not current score level — or label each card's number explicitly (e.g. "score" vs "move") so a reader scanning left-to-right doesn't read "biggest" as "biggest number shown here."
- source: walk

### [MED] /quiz/switch — no eyebrow kicker or Tools breadcrumb, unlike every sibling tool/pillar page
- pass: 16 (commit 6b73abed)
- viewport: desktop
- category: navigation
- observation: `/tools` renders a `PageSectionKicker` ("interactive tools") above its H1, and `/compare/switch` renders a "catalog · switches" kicker above its H1 — but `/quiz/switch`'s H1 ("Find your switch") sits directly under the nav with no kicker. Its breadcrumb JSON-LD is also just `Home → Find your switch`, with no "Tools" step, even though `/tools` links to the quiz as one of its interactive tools. The quiz reads as disconnected from the Tools section it's actually part of.
- evidence: walk screenshots `url--desktop--quiz-switch.png` (no kicker above "Find your switch") vs. `url--desktop--tools.png`/`url--desktop--compare-switch.png` (both show a kicker). Source: `apps/web/src/app/quiz/switch/page.tsx` (no `PageSectionKicker`, breadcrumb list `[{ name: 'Home', path: '/' }, { name: 'Find your switch', path: '/quiz/switch' }]`) vs. `apps/web/src/app/tools/page.tsx:89-91` (`<PageSectionKicker testId="tools-eyebrow">interactive tools</PageSectionKicker>`).
- suggested fix: add a `PageSectionKicker` (e.g. "tools · quiz") above the quiz H1, and add a "Tools" step to the breadcrumb JSON-LD between Home and "Find your switch," matching the pattern already used by `/tools` and `/compare/switch`.
- source: walk

### [x] [LOW] /tools + /quiz/switch — tools-card description and quiz lede describe the same flow with different framing — addressed in 5dc60b24, closes #1059
- pass: 14 (commit 3f16c84b)
- viewport: both
- category: voice
- observation: The `/tools` page's "Find your switch" card describes the quiz as "Answer 4 questions about sound, feel, spring weight, and use — get your top switch matches from the thock catalog." The quiz page itself (`/quiz/switch`) describes the same flow as "Answer four quick questions to find the mechanical keyboard switch that matches your typing style — then explore the full spec on its page." Both are accurate but frame the same 4-question quiz differently (named dimensions vs. "typing style") and use different numeral style (digit vs. spelled-out), reading as two independently-written descriptions of one feature rather than one voice.
- evidence: `apps/web/src/app/tools/page.tsx:35` (`'Answer 4 questions about sound, feel, spring weight, and use — get your top switch matches from the thock catalog.'`) vs. `apps/web/src/app/quiz/switch/page.tsx:52-53` (`Answer four quick questions to find the mechanical keyboard switch that matches your typing style — then explore the full spec on its page.`).
- suggested fix: share one description string between the `/tools` card and the `/quiz/switch` lede (e.g. export it once from a shared quiz-copy module), or make the card copy a strict, consistently-worded subset of the page's framing.
- source: walk

### [x] [MED] /trends/tracker — Sleeper summary card reads as a second Biggest Faller (same down-arrow, same declining spark) — addressed in 07846bf0, closes #1060
- pass: 13 (commit a03ead8e)
- viewport: both
- category: comprehension
- observation: `pickSleeper` (`apps/web/src/lib/tracker/index.ts`) picks the smallest-abs(score) non-flat row remaining after riser/faller/breakout are drawn — it has no preference for direction. This week's sleeper pick happens to be `direction: 'down'`, so the card renders the same red down-arrow + declining sparkline treatment as the Biggest Faller card right next to it. "Sleeper" conventionally reads as a quiet/under-the-radar riser, not a second decliner, so the two cards look like duplicates of the same signal rather than two distinct editorial callouts.
- evidence: walk screenshots `url--desktop--trends-tracker.png` / `url--mobile--trends-tracker.png` (`.nexus/walk/2026-10-27T23-28-09-153Z/`): "BIGGEST FALLER / GMK CYL Red Devils R2 / -28%" beside "SLEEPER / GMK CYL Zombie / -40%", both with a red down-arrow glyph and a declining spark line. Source: `apps/web/src/lib/tracker/index.ts` `pickSleeper` (no direction filter beyond excluding flat).
- suggested fix: either give the sleeper card its own visual treatment independent of direction (neutral arrow/color, since "sleeper" is about magnitude not direction), or restrict `pickSleeper`'s candidate pool to `direction === 'up'` rows so the slot only ever surfaces a quiet riser, matching the label's conventional meaning. Either keeps the four summary cards visually distinct.
- source: walk

### [LOW] /group-buys — hero stat segment and "Just closed" section kicker both say "recently ended" within ~150px
- pass: 13 (commit a03ead8e)
- viewport: both
- category: voice
- observation: the page's hero stat line renders `"${ended.length} recently ended"` and, a short scroll below, the "Just closed" section's `HomeSectionHeading` kicker is the literal string "Recently ended" — the same phrase repeated verbatim in close proximity reads as a copy-paste artifact rather than deliberate hierarchy.
- evidence: `apps/web/src/app/group-buys/page.tsx:107` (`ended.length > 0 ? \`${ended.length} recently ended\` : null`) and `apps/web/src/app/group-buys/page.tsx:174` (`<HomeSectionHeading kicker="Recently ended" title="Just closed" />`); confirmed in walk screenshots `url--desktop--group-buys.png` / `url--mobile--group-buys.png`.
- suggested fix: rename the hero stat segment (e.g. `"${ended.length} closed last 30d"`) so it doesn't restate the section kicker word-for-word.
- source: walk

### [x] [MED] / — production GA `/g/collect` beacons returning HTTP 503
- resolved 2026-11-01 via `/oversight`: moot. GTM/GA4 removed in favor of cookieless Vercel Web Analytics; no GA beacons remain.
- pass: 8 (commit d34580c)
- viewport: desktop
- category: performance
- observation: On a fresh load of `/`, the GA4 collect endpoint is returning 503 Service Unavailable to the page's beacon POSTs. GTM's container script + gtag JS bundles load fine (200 OK), but the actual `/g/collect` calls that report pageview + scroll events are 503ing server-side. If this is persistent (not just reader's session), the editorial team is silently losing the analytics signal trends decisions ride on.
- evidence: reader sub-agent's `read_network_requests` on / captured: POST `https://www.google-analytics.com/g/collect?...&en=scroll` → status 503; POST `https://www.google-analytics.com/g/collect?...&en=page_view` → status 503. Both fired right after page hydration. The GA4 measurement ID embedded in the requests is `G-5R4DKQ02GV` (downstream of GTM container `GTM-58T839ZD`).
- suggested fix: needs out-of-codebase verification. (1) Open the GA4 admin for property `G-5R4DKQ02GV` — confirm the property is active, not over its sample-rate, and that data is arriving from the production hostname. (2) Cross-check from a different network / clean browser session to rule out reader's specific session being rate-limited. (3) If 503 is persistent and Google-side, evaluate swapping the beacon to a self-hosted plausible/umami runner (the existing `<GoogleTagManager>` Server Component already has the env-gate scaffolding; another runner can slot in alongside).
- needs-user-call: the analytics property + GTM-tag config sit outside the repo; the loop can't autonomously verify or reconfigure them. Surfacing for `/oversight`.
- source: browser

### Pass-7 self-assessment summary
4 of 6 reader findings turned out to be phantoms or non-autonomous after self-assessment:
- #22 [HIGH] `<main>` landmark — needs-user-call (Next 15 streaming architecture trade-off; post-hydration DOM correct)
- #23 [HIGH] /about prose — phantom (reader-tool drops link content from prose extraction)
- #24 [MED] /sources prose — phantom (same root cause as #23)
- #25 [MED] /tracker double-announce — **shipped** (74759d1)
- #26 [LOW] /group-buys region chip — phantom (reader missed the rendered US chip)
- #27 [LOW] /tag/* date format — phantom (reader misread May; all dates are medium format)

This pattern is informative for future passes: reader's accessibility-tree text extraction tools systematically miss link/code element content within prose AND can elide adjacent short-text generic elements. Future critique self-assessment should default-verify visual-detail findings against actual rendered HTML (`curl + grep`) before promoting them to Pending.

### [x] [HIGH] /trends/tracker + / — "This week at a glance" row and home Trending rail each render a blank, unlabeled 4th grid slot — addressed in this commit, closes #1052
- pass: 12 (commit a01a911)
- viewport: desktop
- category: visual
- observation: `/trends/tracker`'s "This week at a glance" row shows two populated stat cards ("Biggest Faller" -28%, "Sleeper" -40%) followed by a plain dark rectangle with no heading, metric, or icon — reads as a broken/missing card, not an intentional empty state. The home page's "Trending — what's moving on the tracker" rail shows the same pattern: KEYCAP / SWITCH / BRAND tiles followed by an identical blank 4th box. Both surfaces share the same grid component, which doesn't hide or placeholder its slot when a 4th category/stat has no data.
- evidence: walk screenshot `url--desktop--trends-tracker.png` — blank ~600px-wide dark box right of the "Sleeper" card. `url--desktop--home.png` — blank dark box right of the BRAND column in the trending rail. (`.nexus/walk/2026-10-26T18-54-00-170Z/`, not committed — cite the walk.json line for re-verification.)
- suggested fix: either populate the 4th glance stat (e.g. "Biggest Riser") and 4th trending category, or collapse/hide the grid slot entirely when there's no data instead of rendering an empty card shell.
- source: walk
- issue: #1052
- root cause: `TrackerSummaryGrid.tsx` and `TrendingStrip.tsx` both hardcoded a fixed column-count class (`lg:grid-cols-4`, `xl:grid-cols-6`) independent of how many slots/tiles the snapshot actually produced (1-4 and 1-6 respectively); an unfilled grid track paints the container's bare `bg-border` fill, reading as a broken card. Fix: both components now pick their column classes from a literal lookup keyed by the real item count.

### [x] [MED] /compare/switch — empty pre-selection state has no preview or suggested pairs, reads unfinished — addressed in this commit, closes #1061
- pass: 12 (commit a01a911)
- viewport: desktop
- category: comprehension
- observation: The default state most first-time visitors land on (no switches selected) is almost entirely empty: two selects, a disabled Compare button, one line of helper text, and a "take the quiz" link, then roughly 400px of dead space before the footer. Nothing orients a first-time visitor on what the tool's output looks like or why they'd use it.
- evidence: walk screenshot `url--desktop--compare-switch.png` — all content sits in the top ~340px of an 800px viewport; the rest is blank.
- suggested fix: add a sample comparison preview or a short list of popular/suggested switch pairs to fill the empty state and demonstrate the tool's value.
- source: walk
- issue: #1061
> **Resolved (2026-10-30):** added `getSuggestedSwitchPairs` (`apps/web/src/lib/compare/suggested-switch-pairs.ts`) — a deterministic, type-diverse pick of 3 switch pairs from the catalog — and a `SuggestedSwitchPairs` component rendering them as quick-compare links under the existing "take the quiz" link in the empty state. Fills the dead space with an immediate way to see the tool's output. `pnpm verify` full gate green: typecheck, lint, 872/872 unit tests (new coverage: 5 lib tests, 3 component tests), script tests, data:validate, build, size, 1348/1348 e2e (new coverage: 2 compare.spec.ts cases).

### [x] [MED] /group-buys — lede's second sentence fragment reads as SaaS feature-bullet copy, not editorial voice — addressed in this commit, closes #1063
- pass: 12, re-confirmed pass 15 (commit a01a911; re-confirmed c6df4f89)
- viewport: desktop
- category: voice
- observation: The lede reads "Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked." The three-term fragment reads like a product feature list, inconsistent with the "knowledgeable peer" voice used elsewhere (e.g. the tracker's conversational "What's actually rising this week"). Severity bumped LOW→MED at pass 15: an independent reader pass surfaced this exact row again unprompted (it was in the pass-15 "already-addressed, skip" list and still came back), and a sibling-LEDE comparison across every other pillar page (`deep-dives`, `news`, `trends`, `guides`, `trends/tracker`) confirms this is the only lede that drops into an adjective-triplet fragment instead of a full descriptive sentence.
- evidence: walk screenshot `url--desktop--group-buys.png`, lede under the "Group buys" H1: "Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked." Sibling comparison: `apps/web/src/app/deep-dives/page.tsx:22`, `apps/web/src/app/news/page.tsx:24`, `apps/web/src/app/trends/page.tsx:24`, `apps/web/src/app/guides/page.tsx:21`, `apps/web/src/app/trends/tracker/page.tsx:32` all use full sentences; `apps/web/src/app/group-buys/page.tsx:26` is the outlier.
- suggested fix: rewrite the second sentence in plain editorial prose, e.g. "We track start/end dates, region availability, and which vendor is running each one."
- source: walk
- issue: #1063

### [LOW] /tools + /group-buys heroes — no illustration, leaving an empty right-hand gap inconsistent with the home hero
- pass: 12 (commit a01a911)
- viewport: desktop
- category: visual
- observation: Hero treatment is inconsistent across landing pages: the home page hero pairs its text with a line-art switch illustration filling the right half of the section, while the `/tools` and `/group-buys` heroes have no illustration, leaving bare dark space where the art would sit.
- evidence: walk screenshots `url--desktop--tools.png` and `url--desktop--group-buys.png` (bare space right of hero copy) vs. `url--desktop--home.png` (switch-exploded-view SVG filling the same slot).
- suggested fix: either add matching illustrations to the other pillar/tool hero sections, or narrow the hero text column so the empty space doesn't read as unfinished.
- source: walk
