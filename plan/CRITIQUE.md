# Critique log

> Last pass: 2026-10-29T01:37:00Z at commit 3f16c84b
> Pass count: 14
> Iterate-bias category: external-critique (pass 14 fired 10 commits after pass 13, but >24h elapsed (26h) — scripted walk per UI: both, anonymous-only, Chrome available in cloud CI this run. Reader visited 7 routes x 2 viewports (/, /news, /trends/tracker, /group-buys, /tools, /quiz/switch, /compare/switch) via .nexus/walk screenshots + walk.json; surfaced 3 candidates, self-assessment kept 1 after verifying all three against source. Dropped: nav active-state phantom (reader misread screenshot contrast — curl-verified aria-current="page" + active class already render correctly on /quiz/switch, fixed since 9180dc0a); trending-dot "no legend, doesn't recur" claim was factually wrong (bg-tag-* colors recur site-wide via packages/ui/src/TagChip.tsx on /tag/[slug] pages, just not on the 7 sampled routes). Filed: [LOW] /tools + /quiz/switch — the "Find your switch" tools-card description and the quiz page's own lede describe the same 4-question flow with different framing (sound/feel/spring-weight/use vs. typing-style) and numeral style (digit vs. spelled-out), reading as two independently-written descriptions of the same feature. Reader-tool artifact rate: 67% this pass (2 of 3 raw findings didn't survive source verification) — every finding checked against curl + grep, not taken at screenshot face value.)
> Pass 13 last pass: 2026-10-27T23:31:41Z at commit a03ead8e
> Pass 11 last pass: 2026-10-26T18:54:00Z at commit a01a911
> Iterate-bias category: external-critique (pass 11 fired 12 commits after pass 10, after the content-velocity directive shipped + 4 new content pieces drained the pillar quotas — Trends now at quota 8/8, News 3→4, group-buy companions 5→4 missing. Reader's pass 11 visited 6 URLs (/, /article/cannonkeys-nyawice-group-buy, /trends, /trends/tracker, /group-buys, /tag/gmk) and surfaced 6 candidates; self-assessment kept 4 (1 duplicate of pass-9 date-staggering finding, 1 self-hedged %-unit nit). Filed: [HIGH] /article/cannonkeys-nyawice-group-buy — body says "roughly one week left as of this column" but the article is dated 2026-04-17 (the buy's startDate per Rule 4 group-buy exemption) and the window runs to 2026-05-17 (4 weeks from publish, not 1 — content-curator wrote present-tense reading-state copy instead of publication-date-relative copy); [HIGH] /group-buys "Just closed" section — Ishtar R2 card carries a "LIVE" status pill despite sitting under the Just-closed band (renderer pulls STATUS_LABEL[record.status] regardless of variant; the data has status:'live' + endDate today so the row's section placement is right but the pill text leaks); [MED] /tag/gmk — only 1 article (Prussian Alert) despite 3 unfinished GMK CYL group-buy companions in the live set; tag will self-fill as the loop ships those companions; [LOW] /article/cannonkeys-nyawice-group-buy — body uses "the W19 movement score" as a metric phrase, reads as internal-dashboard taxonomy. Reader-tool artifact rate: 0% — every finding verified against curl-grep or data inspection.)
> Pass 10 last pass: 2026-05-10T18:55:00Z at commit 0e2314f
> Iterate-bias category: external-critique (pass 10 fired 12 commits after pass 9, after a drain that shipped pass-9's [MED] aside-spacing user-jot (#32, a0fdaa8), [MED] /trends/tracker heading-skip a11y (#33, f70b1f3), [MED] / Trending rail flat tile (#34, bb70360), and [MED] /trends/tracker Sleeper card on flat row (#35, bdc2082) — all four pass-9 [MED] findings drained in 4 consecutive iterate ticks. Reader's pass 10 visited 6 URLs (/, /article/lubing-101, /trends, /trends/tracker, /group-buys, /tag/modding) and surfaced 6 candidates; self-assessment kept 6 (none dropped — every reader finding verified against rendered HTML / source). Filed: [HIGH] /article/lubing-101 — malformed sentence "Brushes drift; this is why brushes drift toward the leaves matters." (real copy bug, mdx line 55, surfaces in body prose); [MED] /group-buys — "Last 72h" eyebrow on forward-looking "Closing soon" section reads retrospective; [MED] / — "0d" countdown vs /group-buys "closes today" cross-surface inconsistency on the same buy; [MED] /tag/modding — "TAG · MISC" eyebrow undersells modding (taxonomy gap; same shape will hit /tag/lubing, /tag/firmware); [LOW] /group-buys — "0 announced" segment names a bucket with no corresponding section; [LOW] /trends/tracker — "SIGNATURE" eyebrow reads as in-house marketing voice. Reader-tool artifact rate: 0% this pass — every finding holds up under curl-grep verification.)
> Pass 9 last pass: 2026-05-10T17:15:00Z at commit 40b2e55
> Pass 8 last pass: 2026-05-10T14:00:00Z at commit d34580c
> Pass 7 last pass: 2026-05-10T08:30:00Z at commit e3de21d
> Pass 6 last pass: 2026-05-10T07:30:00Z at commit dfa5596
> Pass 5 last pass: 2026-05-10T02:45:00Z at commit 790b415

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [x] [LOW] /tools + /quiz/switch — tools-card description and quiz lede describe the same flow with different framing — addressed in 5dc60b24, closes #1059
- pass: 14 (commit 3f16c84b)
- viewport: both
- category: voice
- observation: The `/tools` page's "Find your switch" card describes the quiz as "Answer 4 questions about sound, feel, spring weight, and use — get your top switch matches from the thock catalog." The quiz page itself (`/quiz/switch`) describes the same flow as "Answer four quick questions to find the mechanical keyboard switch that matches your typing style — then explore the full spec on its page." Both are accurate but frame the same 4-question quiz differently (named dimensions vs. "typing style") and use different numeral style (digit vs. spelled-out), reading as two independently-written descriptions of one feature rather than one voice.
- evidence: `apps/web/src/app/tools/page.tsx:35` (`'Answer 4 questions about sound, feel, spring weight, and use — get your top switch matches from the thock catalog.'`) vs. `apps/web/src/app/quiz/switch/page.tsx:52-53` (`Answer four quick questions to find the mechanical keyboard switch that matches your typing style — then explore the full spec on its page.`).
- suggested fix: share one description string between the `/tools` card and the `/quiz/switch` lede (e.g. export it once from a shared quiz-copy module), or make the card copy a strict, consistently-worded subset of the page's framing.
- source: walk

### [MED] /trends/tracker — Sleeper summary card reads as a second Biggest Faller (same down-arrow, same declining spark)
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

### [needs-user-call] [MED] / — production GA `/g/collect` beacons returning HTTP 503
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

### [MED] /compare/switch — empty pre-selection state has no preview or suggested pairs, reads unfinished
- pass: 12 (commit a01a911)
- viewport: desktop
- category: comprehension
- observation: The default state most first-time visitors land on (no switches selected) is almost entirely empty: two selects, a disabled Compare button, one line of helper text, and a "take the quiz" link, then roughly 400px of dead space before the footer. Nothing orients a first-time visitor on what the tool's output looks like or why they'd use it.
- evidence: walk screenshot `url--desktop--compare-switch.png` — all content sits in the top ~340px of an 800px viewport; the rest is blank.
- suggested fix: add a sample comparison preview or a short list of popular/suggested switch pairs to fill the empty state and demonstrate the tool's value.
- source: walk

### [LOW] /group-buys — lede's second sentence fragment reads as SaaS feature-bullet copy, not editorial voice
- pass: 12 (commit a01a911)
- viewport: desktop
- category: voice
- observation: The lede reads "Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked." The three-term fragment reads like a product feature list, inconsistent with the "knowledgeable peer" voice used elsewhere (e.g. the tracker's conversational "What's actually rising this week").
- evidence: walk screenshot `url--desktop--group-buys.png`, lede under the "Group buys" H1: "Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked."
- suggested fix: rewrite the second sentence in plain editorial prose, e.g. "We track start/end dates, region availability, and which vendor is running each one."
- source: walk

### [LOW] /tools + /group-buys heroes — no illustration, leaving an empty right-hand gap inconsistent with the home hero
- pass: 12 (commit a01a911)
- viewport: desktop
- category: visual
- observation: Hero treatment is inconsistent across landing pages: the home page hero pairs its text with a line-art switch illustration filling the right half of the section, while the `/tools` and `/group-buys` heroes have no illustration, leaving bare dark space where the art would sit.
- evidence: walk screenshots `url--desktop--tools.png` and `url--desktop--group-buys.png` (bare space right of hero copy) vs. `url--desktop--home.png` (switch-exploded-view SVG filling the same slot).
- suggested fix: either add matching illustrations to the other pillar/tool hero sections, or narrow the hero text column so the empty space doesn't read as unfinished.
- source: walk
