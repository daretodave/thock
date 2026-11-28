# Critique log

> Last pass: 2026-11-28T09:49:41Z at commit 49fc6fae
> Pass count: 24
> Pass 23 last pass: 2026-11-27T17:16:18Z at commit 32425c04
> Pass 22 last pass: 2026-11-25T14:30:33Z at commit 76b1b65e
> Pass 21 last pass: 2026-11-22T07:49:30Z at commit 91d546f4
> Pass 20 last pass: 2026-11-20T08:27:23Z at commit ed0de5df
> Pass 19 last pass: 2026-11-10T09:45:00Z at commit b056da79
> Pass 17 last pass: 2026-11-05T16:09:48Z at commit 5ec23cdd

> External-observer feedback for thock. Populated by `/critique`,
> drained by `/iterate`. See `skills/critique.md` for the contract.

## Pending

### [MED] / and /news and /group-buys — an orphaned dot artifact recurs across unrelated card illustrations with no apparent purpose
- pass: 23 (commit 32425c04); re-observed pass 23 (commit 32425c04), severity bumped LOW → MED (now confirmed on a third, unrelated page — a shared-component defect, not an isolated hero quirk)
- viewport: desktop and mobile
- category: visual
- observation: the hero-variant `ArticleCard` (`apps/web/src/components/home/ArticleCard.tsx:102-140`) lays out its image and text columns as `lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-8`, but no JSX in that component renders a marker in the gap column. A small solid orange dot nonetheless appears vertically centered in that gap on both `/` (next to the "DEEP DIVES" eyebrow) and `/news` (next to the "NEWS" eyebrow for the Gateron Magnetic Jade article) — same relative position on both pages despite otherwise-unrelated hero illustrations (hand-drawn stem-runway diagram vs. magnet-sensor cross-section), so it isn't image content. Pass 23's mobile walk shows the same motif a third time, on the "GMK Just Beachy" group-buy card: a small orange dot top-right of the card art plus a red/pink dot bottom-center, both floating outside the keycap-grid illustration with no legend. Reads as leftover/unstyled markup shared by multiple card components, not an intentional design element confined to one page.
- evidence: walk screenshots `url--desktop--home.png` (dot at ~(693,186)), `url--desktop--news.png` (~(691,525)), `url--mobile--home.png` (~(352,145)), `url--mobile--news.png` (~(348,525)) (`.nexus/walk/2026-11-25T14-25-35-683Z/`, not committed); `url--mobile--group-buys.png` ("Just closed" card art, orange dot ~(350,570), red/pink dot ~(252,747)) (`.nexus/walk/2026-11-27T17-13-09-076Z/`, not committed — cite this line for re-verification).
- suggested fix: inspect the rendered DOM for the recurring dot markup (likely a shared decorative element used by both the hero `ArticleCard` and the group-buy card component, e.g. a leftover timeline/status marker) and either give it a clear purpose or remove it from all callers.
- source: walk

### [LOW] /trends/tracker — the Sleeper methodology caption is one dense, self-referential sentence
- pass: 23 (commit 32425c04)
- viewport: desktop
- category: comprehension
- observation: `TrackerSummaryGrid`'s criteria note (`apps/web/src/components/tracker/TrackerSummaryGrid.tsx:46-55`) explains four summary-card metrics in a single run-on sentence: "Riser, faller, and breakout are picked by this week's steepest move; sleeper, by how quiet its current level is — so its number can land bigger than a faller's without it having moved more." The clause defining Sleeper is immediately followed by a caveat about why its number can look misleading, both crammed into one sentence — harder to parse on first read than the page's otherwise restrained, short-sentence editorial voice.
- evidence: `url--desktop--trends-tracker.png` (the `data-testid="tracker-summary-criteria-note"` caption under the summary card row) (`.nexus/walk/2026-11-27T17-13-09-076Z/`, not committed — cite this line for re-verification); source at `apps/web/src/components/tracker/TrackerSummaryGrid.tsx:51-53`.
- suggested fix: split into two sentences — one defining how Sleeper is picked, a second stating the "can look bigger than a faller's" caveat separately.
- source: walk

### [LOW] / vs /trends/tracker — the current week/year label is formatted two different ways across pages citing the same figure
- pass: 22 (commit 76b1b65e)
- viewport: desktop
- category: comprehension
- observation: home's trending-strip kicker reads "WEEK 48 / 2026" (`isoWeekKicker`, `apps/web/src/app/page.tsx:48-52`: `` `Week ${match[2]} / ${match[1]}` ``), while the full Trends Tracker page's header stat block reads "2026 · WEEK" / "48" / "of 53" stacked vertically (`apps/web/src/components/tracker/TrackerHeader.tsx:53-61`). Same data point, inconsistent order (week-first vs. year-first) and separator (`/` vs. `·`) between the teaser a reader sees first and the full page it links to.
- evidence: walk screenshots `url--desktop--home.png` (eyebrow "WEEK 48 / 2026" above "Trending — what's moving on the tracker") and `url--desktop--trends-tracker.png` (top-right stat block "2026 · WEEK" / "48" / "of 53") (`.nexus/walk/2026-11-25T14-25-35-683Z/`, not committed — cite this line for re-verification).
- suggested fix: share one week/year label format (or at least one ordering/separator convention) between `isoWeekKicker` (home) and `TrackerHeader`'s rightRail block, so the same figure reads consistently across both surfaces.
- source: walk

### [x] [MED] /trends/tracker — the "SLEEPER" summary card still shows a signed negative delta, reading as a second faller — addressed in c9f02e4b
- pass: 21 (commit 91d546f4)
- viewport: desktop
- category: comprehension
- observation: `TrackerSummaryCard` (`apps/web/src/components/tracker/TrackerSummaryCard.tsx:28-37`) forces the sleeper slot's glyph, color and sparkline tone to neutral `flat` (fixed at pass 13, per the code comment at lines 29-32) specifically so it wouldn't "read as a second Riser or Faller card" — but `delta` is still computed as `formatDelta(row.score, row.direction)` using the row's real direction, not forced flat. So the card correctly neutralizes color/glyph/spark but still prints a signed number like "-40%" next to the neutral glyph. On the live `/trends/tracker` page this renders "SLEEPER · CannonKeys · -40%" directly beside "BIGGEST FALLER · GMK CYL Red Devils R2 · -16%" — two cards both showing negative percentages, one of which is picked purely by smallest magnitude (not direction) per `pickSummarySlots`'s docstring (`apps/web/src/lib/tracker/index.ts:74`). A reader has no way to tell from the number alone that "sleeper" ignores direction.
- evidence: `apps/web/src/components/tracker/TrackerSummaryCard.tsx:28` (`delta` not forced flat, unlike `tone`/`dir`/labels on lines 33-37); `apps/web/src/lib/tracker/index.ts:196-204` (`formatDelta` always signs by `direction`); walk screenshot `url--desktop--trends-tracker.png` (`.nexus/walk/2026-11-22T07-45-29-117Z/`, not committed — cite this line for re-verification) shows "SLEEPER" card reading "-40%".
- suggested fix: either show the sleeper card's magnitude unsigned (e.g. "40% moved" or "±40%") since its selection criterion is magnitude not direction, or add a one-word qualifier next to the number (e.g. "quietly -40%") so the neutral framing already applied to color/glyph extends to the number's read.
- source: web-fetch

### [MED] /tools, /compare/switch, /quiz/switch — inconsistent or missing eyebrow text breaks the Tools pillar's text trail
- pass: 21 (commit 91d546f4)
- viewport: desktop
- category: navigation
- observation: `/tools` renders the eyebrow "interactive tools" (`apps/web/src/app/tools/page.tsx:97-99`, `PageSectionKicker`). `/compare/switch` renders a different eyebrow, "catalog · switches" (`apps/web/src/app/compare/switch/page.tsx:108-112`), with no textual mention of Tools at all. `/quiz/switch` has no eyebrow/kicker element above its `<h1>Find your switch</h1>` (`apps/web/src/app/quiz/switch/page.tsx:50`) whatsoever. A reader who lands on `/compare/switch` or `/quiz/switch` via a shared link or search result has no in-page text tying it back to the Tools pillar — only the nav's bolded state, which a deep link bypasses.
- evidence: `apps/web/src/app/tools/page.tsx:97-99`; `apps/web/src/app/compare/switch/page.tsx:108-112`; `apps/web/src/app/quiz/switch/page.tsx:50` (no kicker present); walk screenshots `url--desktop--tools.png`, `url--desktop--compare-switch.png`, `url--mobile--quiz-switch.png` (`.nexus/walk/2026-11-22T07-45-29-117Z/`, not committed).
- suggested fix: standardize a shared "tools · <subpage>" eyebrow convention across `/tools`, `/compare/switch` and `/quiz/switch` so the pillar relationship reads in page text, not just in nav highlighting.
- source: web-fetch

### [MED] home hero — the switch illustration's italic epigraph is close to illegible at render size
- pass: 21 (commit 91d546f4)
- viewport: both
- category: visual
- observation: `apps/web/public/hero-art/switch-break-in-myth.svg:79` bakes an italic caption directly into the SVG — "the path repeats - what wears is the surface it rubs, not the switch underneath it" — at `font-size="15"` inside a `viewBox="0 0 1200 750"`, with `opacity="0.6"` on an already-pale stroke color (`oklch(0.78 0.005 90)`). At the hero's actual rendered width (well under 1200px) the effective text size is a few pixels tall; combined with the reduced opacity, the line reads as a faint textured smudge rather than legible prose on both desktop and mobile screenshots.
- evidence: `apps/web/public/hero-art/switch-break-in-myth.svg:79` (the `<text>` element: `font-size="15"`, `opacity="0.6"`); walk screenshots `url--desktop--home.png` and `url--mobile--home.png` (`.nexus/walk/2026-11-22T07-45-29-117Z/`, not committed) show the line at the top of the illustration, same low legibility on both viewports.
- suggested fix: keep the ghost-echo motif (the stem-echo opacities at 0.14-0.48 elsewhere in the same SVG are intentional and shouldn't change — `UI magic: keep`), but raise just this caption's size and/or opacity enough to read as an intentional epigraph rather than noise, since unlike the echoes it's meant to be read.
- source: web-fetch

### [LOW] /news — an article teaser lede opens with a raw ISO date instead of editorial date prose
- pass: 21 (commit 91d546f4)
- viewport: desktop
- category: voice
- observation: The "Gateron Magnetic Jade sensing backfill" article's lede (`apps/web/src/content/articles/gateron-magnetic-jade-sensing-backfill.mdx:4`) opens "On 2026-11-06, thock's catalog backfilled a sensing field onto the Gateron Magnetic Jade's switch record, reading hall-effect...". The raw `YYYY-MM-DD` literal inline in prose reads like a system-log timestamp, not the "knowledgeable peer" voice bearings calls for — bylines elsewhere on the site format the same kind of date as "Nov 18, 2026".
- evidence: `apps/web/src/content/articles/gateron-magnetic-jade-sensing-backfill.mdx:4`; same string surfaces on `/news`'s teaser card per walk screenshot `url--desktop--news.png` (`.nexus/walk/2026-11-22T07-45-29-117Z/`, not committed).
- suggested fix: reformat the inline date in prose form ("On Nov 6, 2026, ...") to match the byline date convention used elsewhere.
- source: web-fetch

### [LOW] /compare/switch — the three "OR TRY A PAIR" suggestions daisy-chain the same switch across adjacent rows
- pass: 20 (commit ed0de5df)
- viewport: desktop
- category: comprehension
- observation: `getSuggestedSwitchPairs` (`apps/web/src/lib/compare/suggested-switch-pairs.ts:52-60`) builds `representatives` (one switch per type, ordered by `TYPE_PRIORITY`) and pairs `representatives[i]` with `representatives[(i + 1) % representatives.length]` for each of the 3 suggestion slots — a deliberate consecutive-slice pattern (docstring, lines 13-19) chosen to guarantee cross-type diversity. The side effect: pair 0's second switch is always pair 1's first switch (and so on), so a reader scanning the three rows sees the same switch reappear back-to-back twice (e.g. "...vs Akko V3 Cream Blue Pro" then "Akko V3 Cream Blue Pro vs...") rather than three independent comparisons.
- evidence: `apps/web/src/lib/compare/suggested-switch-pairs.ts:52-60` (the `for` loop pairing `representatives[i]`/`representatives[i+1]`); observed pairs on the live page: "C3 Equalz Tangerine R2 vs Akko V3 Cream Blue Pro", "Akko V3 Cream Blue Pro vs Kailh Box Jade", "Kailh Box Jade vs Cherry MX2A Silent Black"; screenshot `url--desktop--compare-switch.png` (`.nexus/walk/2026-11-20T08-23-20-125Z/`, not committed — cite this line for re-verification).
- suggested fix: keep the existing cross-type diversity guarantee (don't touch the type-selection logic), but widen the pairing stride so adjacent slots don't share a switch — e.g. pair `representatives[i]` with `representatives[(i + 2) % representatives.length]` instead of `i + 1` — so no switch appears in two consecutive suggestion rows.
- source: walk

### [x] [HIGH] /group-buys — every group-buy record is closed; the page's "Active group buys" promise is never true for current visitors — addressed in 2f417b1a, closes #1094
- pass: 18 (commit 113926e9)
- viewport: both
- category: comprehension
- observation: the hero lede reads "Active group buys for boards, keycap sets, and switches. We track start/end dates, region availability, and which vendor is running each one," but all 18 records in `data/group-buys/*.json` carry `status: "closed"` with an `endDate` already in the past (latest: 2026-09-22). `partitionGroupBuys`'s `isLive`/`isAnnounced` helpers (`apps/web/src/app/group-buys/helpers.ts:20-29`) key off `gb.status`, so `live.length === 0` and `announced.length === 0` for every visitor right now. The page renders only the "RECENTLY ENDED — Just closed" section below the summary line — a first-time visitor's first and only content block directly contradicts the lede's "active" framing.
- evidence: `data/group-buys/*.json` (18/18 records `status: "closed"`); `apps/web/src/app/group-buys/helpers.ts:20-29` (`isLive`/`isAnnounced`); walk screenshots `url--desktop--group-buys.png` / `url--mobile--group-buys.png` (`.nexus/walk/2026-11-06T00-16-44-961Z/`, not committed — cite this line for re-verification) show "Just closed" as the only visible section.
- suggested fix: either ship new live/announced group-buy records (a data-content gap — `/ship-data` or a content generator should keep at least one buy open), or, if the real-world lull is expected, swap the lede for state-aware copy ("No live buys right now — here's what just wrapped") instead of an evergreen "active group buys" claim that reads false whenever the live/announced buckets are empty.
- source: walk
- issue: #1094

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

### [x] [HIGH] /trends/tracker — "Biggest Faller" summary card can show a smaller-magnitude number than the "Sleeper" card beside it — addressed in c9f02e4b, closes #1101
- pass: 16 (commit 6b73abed); re-observed pass 19 (commit b056da79), severity bumped MED → HIGH (3 passes unaddressed, current data shows a wider gap than first observed)
- viewport: desktop
- category: comprehension
- observation: `pickSummarySlots` (`apps/web/src/lib/tracker/index.ts`) ranks the riser/faller/breakout slots by `sparkSlope` (this week's actual movement, a deliberate pass-9 fix so a high-level-but-barely-moved row never gets crowned "biggest") and the sleeper slot by smallest `abs(score)` among what's left — two unrelated ranking criteria. But both `TrackerSummaryCard` and the main table row (`TrackerRow.tsx:43`) display `formatDelta(row.score, row.direction)`, i.e. the row's static -100..100 score dressed as a signed percentage, not the slope that won it the slot. At pass 16: "BIGGEST FALLER / GMK CYL Red Devils R2 / -28%" sat beside "SLEEPER / GMK CYL Zombie / -40%". Re-observed at pass 19, same mismatch, wider gap: `data/trends/2026-W46.json` has "BIGGEST FALLER / GMK CYL Red Devils R2 / -18%" (picked by steepest `sparkSlope`, -42) beside "SLEEPER / CannonKeys / -42%" (picked by smallest `abs(score)`), with the sleeper's tone/dir/glyph additionally hard-forced to flat/gray (`TrackerSummaryCard.tsx:28-38`) regardless of its actual `down` direction — so the steeper decline reads as neutral while the milder one reads as the alarming red "biggest faller."
- evidence: walk screenshot `url--desktop--trends-tracker.png` (`.nexus/walk/2026-10-31T04-11-47-938Z/`, not committed); `data/trends/2026-W44.json` rows `GMK CYL Red Devils R2` (score 28, down) and `GMK CYL Zombie` (score 40, down). Pass 19: walk screenshot `url--desktop--trends-tracker.png` (`.nexus/walk/2026-11-10T09-41-07-574Z/`, not committed); `data/trends/2026-W46.json` rows `GMK CYL Red Devils R2` (score 18, down, sparkSlope -42) and `CannonKeys` (score 42, down, sparkSlope -10); `apps/web/src/lib/tracker/index.ts` `pickFaller`/`pickSleeper`; `apps/web/src/components/tracker/TrackerSummaryCard.tsx:28-38` (sleeper tone hard-forced to flat).
- suggested fix: the mismatch is structural (ranking criterion ≠ displayed number, and the sleeper slot's styling actively masks a real decline), not a one-row data bug, so the safe fix is presentational rather than re-deriving the picking logic (which pass 9 deliberately chose for good reason): stop hard-forcing the sleeper's tone to flat when `row.direction` is down/up — use the row's actual direction for tone/glyph — and add a short caption under "This week at a glance" clarifying the cards are picked by this week's movement, not current score level, so a reader scanning left-to-right doesn't read "biggest" as "biggest number shown here."
- source: walk
- resolution note: shipped the caption, but kept the sleeper's tone/glyph/spark forced flat rather than switching it to `row.direction` — the pass-21 MED row above found the signed delta itself was the part that undercut the forced-neutral framing ("reads as a second faller"), and reverting the force-flat would have reintroduced exactly what pass 13 set out to avoid. Dropping the delta's sign (`formatSleeperDelta`, `±42%`) resolves both: the number stops reading as a hidden/disguised decline, and the neutral styling stays intentional. Also closes the pass-21 MED row (same commit).

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
