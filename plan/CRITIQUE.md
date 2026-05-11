# Critique log

> Last pass: 2026-05-10T20:35:00Z at commit 931c8a7
> Pass count: 11
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

### [x] [HIGH] /article/cannonkeys-nyawice-group-buy — body says "roughly one week left" but the article is dated the day the buy opened (Apr 17)
- addressed in: 12a818d (this tick — iterate drain)
- issue: #43
- pass: 11 (commit 931c8a7)
- viewport: both
- category: copy
- observation: The article is bylined April 17, 2026 (the GB's startDate, per Rule 4 group-buy exemption) and states the buy window is 2026-04-17 through 2026-05-17 — a full month — yet the very next clause reads "roughly one week left as of this column." On the publication date the buy had four weeks left; only the present-tense reading state (today, 2026-05-10) is one-week-out. The content-curator wrote present-tense copy instead of publication-date-relative copy, internally undermining the editorial math on a time-sensitive group-buy piece. HIGH because the bylined-date and the lede-math contradict each other on a freshly-shipped piece — a fresh reader notices immediately.
- evidence: rendered body in /article/cannonkeys-nyawice-group-buy paragraph 4: "The window is 2026-04-17 through 2026-05-17 — roughly one week left as of this column." Byline rendered "thock · April 17, 2026 · ~6 min read." Source: `apps/web/src/content/articles/cannonkeys-nyawice-group-buy.mdx:45`.
- fix: rewrote `cannonkeys-nyawice-group-buy.mdx:45` from "roughly one week left as of this column" to "a four-week buy, opening today" — absolute phrasing that doesn't decay across reads. Also amended `plan/bearings.md` "Content velocity & editorial cadence" Rule 4 with a new sub-rule locking the lesson: group-buy companion pieces dated their startDate use **absolute** window phrasing in prose, never relative-time-remaining. Static MDX cannot do per-render-time math. The bearings amendment guards against the next 4 GMK CYL companion ships hitting the same trap; content-curator briefs in future /iterate ticks pull from this section.
- verify note: 433 e2e green parallel — no #418 flake this run.
- source: browser

### [HIGH] /group-buys — Ishtar R2 card under "Just closed" section carries a "LIVE" status pill (renderer leaks source status)
- pass: 11 (commit 931c8a7)
- viewport: both
- category: affordance
- observation: In the /group-buys "Just closed" section, the GMK CYL Ishtar R2 card shows a status pill that reads "LIVE" while the sibling Paper80 card correctly reads "CLOSED." A fresh visitor sees a "LIVE" pill in the just-closed segment and reasonably believes the buy is still open — the header counter "4 live · 0 announced · 2 recently ended" already implies only two ended items, and the LIVE-pill leak creates a contradiction. The data record's `status` is `live` + `endDate: 2026-05-10` (today), and the section selector correctly places it under Just-closed by date, but the renderer pulls `STATUS_LABEL[record.status]` for the `variant='ended'` pill, leaking the stale source field into the closed-band visual chrome.
- evidence: `curl -s https://thock-coral.vercel.app/group-buys` → "Just closed" section's countdown pill rendered as `<span data-testid="group-buy-countdown" class="...">LIVE</span>` on the Ishtar R2 row. Data: `data/group-buys/kbdfans-gmk-cyl-ishtar-r2.json` has `status: "live"` + `endDate: "2026-05-10"`. Renderer: `apps/web/src/components/group-buys/GroupBuyRow.tsx:76-78` falls through to `countdown = STATUS_LABEL[groupBuy.status]` for the non-live / non-announced variants.
- suggested fix: in `GroupBuyRow.tsx`, override the countdown text for `variant === 'ended'` to render "CLOSED" (or `ended ${endDate}`) regardless of the `status` field's freshness. One-line edit. Add a unit test asserting Just-closed renders "CLOSED" on a record with `status: 'live'` + past `endDate`. The durable fix is renderer-side; the alternate data-edit (set Ishtar R2's status to `closed`) is a one-off that doesn't prevent the next `endDate`-passed live record from re-leaking.
- source: browser

### [MED] /tag/gmk — single article on a brand-tag landing that the corpus's GMK footprint should fill
- pass: 11 (commit 931c8a7)
- viewport: both
- category: content-gap
- observation: /tag/gmk renders "1 article tagged GMK" — Prussian Alert is the only one. For a fresh reader arriving from a Google search for "GMK Prussian Alert" or following a `#gmk` chip from the homepage trending strip, the tag page sets an expectation of a brand hub and delivers a stub. The corpus's actual GMK footprint includes 3 live GMK CYL group buys without companion articles (GREG 2, Ishtar R2, King of the Seas) — the brand-tag underrepresentation will self-resolve as the content-velocity loop ships those companions (each will carry `gmk` in the frontmatter tags). File as a "watch and drain via companion shipping" row; no immediate iterate action needed unless the loop wants to backfill `gmk` on the Mode Sonnet R2 companion or adjacent pieces.
- evidence: rendered text on /tag/gmk: lede "1 article tagged GMK." Single archive card. Frontmatter grep across `apps/web/src/content/articles/*.mdx` for `gmk` in tags: only `gmk-cyl-prussian-alert.mdx`. `data/group-buys/` lists 3 GMK CYL records with `status: live`.
- suggested fix: prefer GMK CYL group-buy companion shipping for the next 2–3 News pillar shipping ticks so /tag/gmk fills naturally to ≥4. No direct fix; track via this row.
- source: browser

### [LOW] /article/cannonkeys-nyawice-group-buy — body uses "the W19 movement score" (internal-dashboard taxonomy leak)
- pass: 11 (commit 931c8a7)
- viewport: both
- category: voice
- observation: The body references "the W19 movement score" as a metric phrase ("put the layout at -18 on the W19 movement score"). For a fresh reader who hasn't read the Trends Tracker methodology, "W19 movement score" lands as proprietary internal taxonomy — a term the in-house dashboard would use, not a knowledgeable peer in conversation. Other thock pieces phrase the same fact as "down 18 percent this week on the tracker." Same shape as the pass-7 [HIGH] "post-2026-05-09 schedule" editorial-pipeline jargon — internal-tooling vocabulary leaking into reader-facing prose.
- evidence: rendered body on /article/cannonkeys-nyawice-group-buy paragraph 3: "the trends piece on the slow fade of Alice layouts put the layout at -18 on the W19 movement score." Source: `apps/web/src/content/articles/cannonkeys-nyawice-group-buy.mdx:33`.
- suggested fix: rewrite to "down 18 percent on this week's tracker" — drop the "W19 movement score" chrome from prose. One MDX edit. Codify in content-curator's brief template: tracker references in prose use "down N% on this week's tracker" or "up N% on the tracker" rather than internal-dashboard column names.
- source: browser

### [x] [HIGH] /article/lubing-101 — malformed sentence in "Touching the leaves" paragraph
- addressed in: e4e2d0d (this tick — iterate drain)
- issue: #36
- pass: 10 (commit 0e2314f)
- viewport: both
- category: copy
- observation: Body of /article/lubing-101 contains the sentence "Brushes drift; this is why brushes drift toward the leaves matters." The clause repeats "brushes drift" and the verb "matters" is left dangling — it reads like a stray edit-pass artifact. As a fresh reader I had to read it twice and gave up parsing it; the surrounding paragraph is otherwise the cleanest in the piece, so this stands out as a typo / edit miss in an article that is otherwise well-tuned (1700-word Guides flagship). High because the article is a Guides pillar piece and its body prose is the entire offering — a malformed sentence in mid-paragraph is the kind of thing a builder reading a how-to would screenshot to a friend with "is this site reliable?"
- evidence: rendered body on /article/lubing-101 paragraph beginning `**Touching the leaves.**`; source `apps/web/src/content/articles/lubing-101.mdx:55`. Verified by `grep -n "Brushes drift" apps/web/src/content/articles/lubing-101.mdx` → the literal string is present.
- fix: rewrote the clause to "Brushes drift; that is why watching where the brush goes matters." Also dropped the now-redundant "Watch the brush." that followed (the new lead-in already says it). One MDX edit at line 55 of `apps/web/src/content/articles/lubing-101.mdx`; no schema, component, or test touches.
- verify note: 409 e2e green parallel — no #418 flake this run.
- source: browser

### [x] [MED] /group-buys — "Last 72h" eyebrow on forward-looking "Closing soon" section reads as retrospective
- addressed in: fec567d (this tick — iterate drain)
- issue: #37
- pass: 10 (commit 0e2314f)
- viewport: desktop
- category: copy
- observation: The /group-buys page's "Closing soon" section carries a "Last 72h" eyebrow (small font-mono uppercase kicker above the heading). "Last 72h" reads as a retrospective window — the past 72 hours — but the section is forward-looking: group buys closing in the next 72 hours. Scanning the page, a fresh reader parses "Last 72h" as "recently closed" and is briefly confused that two ostensibly closing items ("closes today" and "1d left") sit under a label that suggests they had already ended. Same shape as the pass-7 "Closing soon — 37 days left" mismatch the loop already addressed, but on the kicker rather than the membership.
- evidence: `curl -s https://thock-coral.vercel.app/group-buys | grep` shows literal text "Last 72h" + "Closing soon" + items including "closes today" and "1d left". Source: `apps/web/src/app/group-buys/page.tsx` (around line 109 per reader's note) sets the kicker prop to "Last 72h".
- fix: changed the kicker prop in `apps/web/src/app/group-buys/page.tsx:109` from `"Last 72h"` to `"Next 72h"`. The section's selector was always forward-looking (closingSoon = items with daysLeft ≤ URGENT_THRESHOLD_DAYS); only the kicker copy was off. Considered (rejected) the alt suggestion of dropping the kicker — the kicker reinforces the time-bucket the section spans and the issue was direction, not redundancy. No new test added: a single literal string whose semantic match with a forward-looking selector is trivially obvious; future critique passes catch any drift back.
- verify note: 409 e2e green parallel — no #418 flake this run.
- source: browser

### [x] [MED] / — "0d" countdown vs /group-buys "closes today" — cross-surface inconsistency on the same buy
- addressed in: 6a4fcf2 (this tick — iterate drain)
- issue: #38
- pass: 10 (commit 0e2314f)
- viewport: both
- category: affordance
- observation: The home "Don't miss the close" rail abbreviates the most-urgent state to `0d`, while the /group-buys landing renders the same state as `closes today` for the SAME group buy (GMK CYL Ishtar R2). `0d` reads ambiguously — zero days, has it already closed, or does it close at end of day? This is the tile most worth getting right since it's the entry point for the highest-urgency CTA on the home page, and the two surfaces should agree on the closing-day label. The /group-buys component already has the cleaner "closes today" copy logic (`GroupBuyRow.tsx:72`); only the home `<GroupBuyCountdownRow>` renders the terse `${left}d` form regardless of urgency.
- evidence: `curl -s https://thock-coral.vercel.app/ | grep` shows home rendered text `GMK CYL Ishtar R2 / 0d`; `curl -s https://thock-coral.vercel.app/group-buys | grep` shows same buy rendered with `closes today`. Source: `apps/web/src/components/home/GroupBuyCountdownRow.tsx:106` emits `{left}d`; `apps/web/src/components/group-buys/GroupBuyRow.tsx:72` emits `closes today` when days===0.
- fix: home countdown row in `apps/web/src/components/home/GroupBuyCountdownRow.tsx` now emits `left === 0 ? 'today' : `${left}d`` (instead of the prior unconditional `${left}d`). The countdown span also carries a `data-testid="group-buy-countdown"` mirroring `GroupBuyRow`'s testid so future tests can target it directly. Considered (rejected) "closes today" verbatim from /group-buys — the dense 4-up home rail's right column can't take 12 chars without disrupting the layout; "today" (5 chars) is unambiguously urgent and semantically matches. Two new tests in GroupBuyCountdownRow.test.tsx lock in: (1) "today" on closing day (not "0d"), (2) "{N}d" preserved for non-zero days.
- verify note: 409 e2e green parallel — no #418 flake this run.
- source: browser

### [MED] /tag/modding — "TAG · MISC" eyebrow undersells a first-class topic; taxonomy gap
- pass: 10 (commit 0e2314f)
- viewport: both
- category: content-gap
- observation: The /tag/modding page eyebrow categorizes #modding as `tag · misc`. For a site whose Guides pillar includes a 1700-word Lubing 101 piece, whose Ideas pillar includes build-method content, and whose lede positions the audience as builders/modders, modding is a first-class topic — not miscellaneous. The "MISC" label undersells one of the site's strongest tag landings and signals to a fresh reader that the taxonomy is sloppy. Same shape will hit `/tag/lubing`, `/tag/firmware`, `/tag/build-of-the-week`, and any other practice/topic-shaped tag — anything that isn't a vendor / part / layout / profile / community gets dumped in `misc`.
- evidence: rendered text on /tag/modding shows `<span class="font-mono uppercase tracking-[0.12em] text-micro text-text-3">tag · <!-- -->misc</span>`. Source: `packages/data/src/schemas/tag.ts` (or wherever the tag-category enum lives) — the enum is currently `vendor | part | layout | profile | community | misc`; modding/lubing/firmware all fall through to misc.
- suggested fix: add a `topic` (or `practice`) tag category to the enum + tag-category palette, reclassify modding/lubing/firmware/build-of-the-week into it. Touches `tags.json`, the schema, and the eyebrow palette in `apps/web/src/app/tag/[slug]/page.tsx`. Or, narrower: just rename the existing `misc` bucket to `topic` (one-line palette label change) — same fix shape but no schema migration. The latter is the cheapest path and probably the right call.
- source: browser

### [LOW] /group-buys — "0 announced" segment names a bucket with no corresponding section
- pass: 10 (commit 0e2314f)
- viewport: desktop
- category: copy
- observation: The /group-buys page summary eyebrow reads `5 live · 0 announced · 1 recently ended`. The `0 announced` segment names a bucket that has no corresponding region anywhere on the page — there are "Closing soon", "Open now", and "Just closed" regions, but no "Announced" band. As a fresh reader I scrolled looking for the section the count was promising and it isn't there. Either the count should disappear when zero, or there should be a small empty-state band ("Announced — none scheduled yet") so the eyebrow's bucket map is honest.
- evidence: rendered text on /group-buys shows `5 live · 0 announced · 1 recently ended` in the page header; the page body contains "Closing soon", "Open now", "Just closed" sections but no "Announced" band.
- suggested fix: drop the `0 announced` segment from the summary line when the count is zero (cleanest), OR surface a small "Announced — none scheduled yet" band beneath "Closing soon" (more informative). One-line conditional in the page-summary component for the cheaper option.
- source: browser

### [LOW] /trends/tracker — "SIGNATURE" eyebrow reads as in-house marketing voice
- pass: 10 (commit 0e2314f)
- viewport: desktop
- category: voice
- observation: The page eyebrow on /trends/tracker is `signature · trends tracker`. "Signature" reads as in-house marketing copy — the kind of word a brand uses about itself ("our signature dish"). The voice elsewhere on the site is plainer; pillars are labeled by what they are (NEWS, TRENDS, GUIDES). "Signature" is the only place that label appears and it lands as voice drift toward breathless framing on the page that should be the most data-forward. The label literally encodes `bearings.md` "signature feature" architecture-speak — the bearings call it that internally, and the eyebrow pipes the internal label to the user-facing chrome.
- evidence: rendered text on /trends/tracker top eyebrow `SIGNATURE · TRENDS TRACKER`. Source: `apps/web/src/components/tracker/TrackerHeader.tsx:56` `eyebrow="signature · trends tracker"`.
- suggested fix: replace `signature` with a plainer category label — `dashboard`, `weekly`, or just `trends · tracker` (mirror pillar labelling). One-line edit in `TrackerHeader.tsx`. The bearings "signature feature" framing is an internal architectural label — keep it in `bearings.md`; don't expose it as eyebrow chrome.
- source: browser

### [x] [MED] / — Trending "what's moving on the tracker" rail includes a `flat` tile (framing dilution)
- addressed in: bb70360 (this tick — iterate drain)
- issue: #34
- pass: 9 (commit 40b2e55)
- viewport: desktop
- category: copy
- observation: The home-page trending rail is headed "Trending — what's moving on the tracker" (Week 19) and contains a tile for MT3 profile labeled `flat`. A flat item is by definition not moving. Within a six-tile preview rail, dedicating a slot to a non-mover dilutes the rail's promise and reads as filler — a first-time reader scanning to learn what's hot this week sees one tile that contradicts the framing. The rail's heading commits to movement; the tile delivers stasis.
- evidence: `curl -s https://thock-coral.vercel.app/ | grep` → rendered text `<h2>Trending — what's moving on the tracker</h2>` and tile rendered with `data-testid="trending-tile"` `data-dir="flat"` for "MT3 profile".
- fix: chained `.filter(row => row.direction !== 'flat')` before the existing `.slice(0, 6)` in `apps/web/src/components/home/TrendingStrip.tsx`. The strip now also hides itself entirely if every snapshot row is flat (extends the existing null/empty contract). On W19 data the MT3 profile flat tile is replaced by Alice layout (down -18%) — 13 of 15 W19 rows are non-flat so the rail still fills 6 tiles. Two new unit tests in TrendingStrip.test.tsx lock in: (1) mixed up+flat input yields only the up tile; (2) all-flat snapshot hides the strip. Considered (rejected) the alt suggestion of renaming the rail header to "This week's tracker" — the existing copy is editorially stronger (commits to movement) and the filter cleanly preserves it.
- verify note: 409 e2e green parallel — no #418 flake this run.
- source: browser

### [x] [MED] /trends/tracker — Sleeper summary card highlights a row whose own editor's note says nothing's moving
- addressed in: bdc2082 (this tick — iterate drain)
- issue: #35
- pass: 9 (commit 40b2e55)
- viewport: desktop
- category: copy
- observation: The four summary cards at the top of /trends/tracker are Biggest Riser / Biggest Faller / Breakout / Sleeper. The Sleeper card highlights "Wuque Studio" with score `flat`, and the editor's note immediately below explicitly says "Morandi switches and the Mammoth75 are still the steady-sellers; no new headline release this 8-week window, but storefront restock cadence held." That description is steady-holding, not sleeping. "Sleeper" implies an under-the-radar pick about to break out; pinning it on a row whose own copy says nothing's happening makes the summary card feel auto-populated rather than editorially chosen. The card weakens the page's signature-feature framing — a tracker that picks the wrong "sleeper" reads less authoritative.
- evidence: `curl -s https://thock-coral.vercel.app/trends/tracker | grep` → `data-testid="tracker-summary-card"` `data-kind="sleeper"` contains `<h3>Wuque Studio</h3>` and editor's note string "no new headline release this 8-week window, but storefront restock cadence held."
- fix: combined options (a) and (b) of the suggested fix. Updated `pickSleeper` in `apps/web/src/lib/tracker/index.ts` to filter `direction !== 'flat'` and pick the smallest abs(score) non-flat row remaining (under-the-radar mover semantic), dropping the slot entirely if no non-flat row remains. Reduce comparator flipped from `>` to `<` (was max-abs flat, now min-abs non-flat). On W19 data this swaps Wuque Studio (flat, "no new headline release" note) for Prototypist (+14 up, "EU-side fulfillment surge" note — a real under-the-radar story). Existing helpers test updated to use Up-C (small non-flat) as the sleeper expectation; two new tests lock in: (1) sleeper-slot drops when only flat rows remain, (2) smallest-abs non-flat selection across mixed up/down inputs. Considered (rejected) suggested option (c) "rename to Steady/Holding when flat" — adds component-level conditional state; the semantic-tightening fix is cleaner.
- verify note: 409 e2e green parallel — no #418 flake this run.
- source: browser

### [LOW] /trends + all pillar landings — eyebrow `pillar · NN of 05` reads as mechanical sequence position
- pass: 9 (commit 40b2e55)
- viewport: desktop
- category: voice
- observation: The Trends pillar landing eyebrow reads `pillar · 02 of 05`. To a first-time reader this is mechanical — it implies pillars are ordered (they aren't, they're categories) and tells me which slot in a list I'm in rather than what kind of content this page hosts. Other site eyebrows describe content ("signature · trends tracker", "curated", section names). The pillar landings describe the navigation graph instead. The drift is consistent across pillars: /news shows `pillar · 01 of 05`, /trends `02 of 05`, /ideas `03 of 05`, /deep-dives and /guides similarly numbered.
- evidence: `curl -s https://thock-coral.vercel.app/trends | grep -oE 'pillar · [0-9]+ of [0-9]+'` → `pillar · 02 of 05`. Same shape on /news (01 of 05) and /ideas (03 of 05).
- suggested fix: replace the "NN of 05" sequence with a descriptive eyebrow on every pillar landing — e.g., simply `pillar · trends` (matching the breadcrumb idiom) or just the section name in caps. Probably one-line template edit in the shared pillar-landing eyebrow component. Cheap; high consistency win across 5 pages.
- source: browser

### [MED] / — every "By pillar" home tile dated 2026-05-10 (bulk-publish artifact reads as fake editorial cadence)
- pass: 9 (commit 40b2e55)
- viewport: desktop
- category: content-gap
- observation: The home-page "By pillar" rail (News / Trends / Ideas / Deep Dives / Guides) renders five tiles that all carry the date `May 10, 2026` (with one repeated card the row crawls to seven entries; six of seven are May 10). To a fresh reader this looks like every pillar simultaneously published a new piece on the same day — either a mass content drop or fake editorial cadence. A real editorial site has staggered publish dates across pillars; the home page erases that signal. The "Long reads worth your weekend" rail just below shows May 10 + May 4 mixed (so the underlying catalog has variation), confirming this is a selector outcome on a bulk-shipped catalog rather than a missing dataset.
- evidence: home-page `data-testid="latest-by-pillar"` block extracted via curl + node walk: 6 dates of "May 10, 2026" + 1 of "May 4, 2026" across 7 article anchors (gmk-cyl-prussian-alert, vendor-first-customs, typing-tests-lie, cherry-mx2a-revision, lubing-101, hmx-cloud-deep-dive, gateron-oil-king-deep-dive). All articles also exist with `publishedAt: 2026-05-10` in their MDX frontmatter — `ls -lt apps/web/src/content/articles/` shows 9+ files all stamped May 10 (the bulk-publish day).
- formalized 2026-05-10 via /oversight: this finding is now backed by `plan/bearings.md` "Content velocity & editorial cadence" Rule 4 — `publishedAt` across the article corpus must spread across a rolling 30-day window. The directive applies forward (new articles pick gap-fill dates, not "today") AND retroactively as a bounded data-edit task. **User-locked exception:** group-buy coverage pieces are EXEMPT — their `publishedAt` matches the buy's earliest story-break date (typically `startDate` or the IC-announce date a week before), so a piece announcing GREG 2 dated weeks before the buy opens isn't restamped. The existing-corpus restamp is the suggested-fix below, scoped as a single data-edit iterate tick.
- suggested fix: data-edit pass across 9 article MDX files currently dated 2026-05-10, restamping `publishedAt` to spread across the rolling 30-day window. Group-buy coverage pieces (currently 1: `mode-sonnet-r2-group-buy-coverage`) are EXEMPT — their date stays aligned to the group buy's timeline. Ordering heuristic: pick dates for non-exempt articles such that the home "By pillar" selector returns at most 1 same-day tile across the 5 pillars. Don't pick future dates; don't rewrite article body content (no "yesterday"/"this week" references inside the prose changed by the restamp). Verify by re-fetching `/` after the edit — the rendered "By pillar" rail should show 5 distinct dates.
- source: browser

### [x] [HIGH] /article/gmk-cyl-prussian-alert + / (latest-by-pillar Keycaps slot) — hero SVG renders broken
- addressed in: pending commit (this tick — user-reported follow-on to phase 23)
- pass: user-jot (commit 3955686, via /oversight 2026-05-10T14:18Z)
- viewport: unspecified
- auth_state: anonymous
- category: visual
- observation: /article/gmk-cyl-prussian-alert has a broken image; on the home page the link to that article surfaces the same broken image in its card.
- evidence: user-spotted at 2026-05-10T14:18:00Z. Initial oversight diagnosis suspected malformed paths or viewBox issues — that was wrong. Real root cause surfaced after Phase 23 shipped and the user reported the SAME XML-parser-error message ("error on line 23 at column 8: Double hyphen within comment: <!-- ") on three of the new group-buy hero SVGs (greg-2, sweet-nightmare) plus the Prussian Alert hero. The shared root cause: brander-emitted SVGs use `<!-- ---------------- Section Title ---------------- -->` style separator comments, and runs of `--` inside an XML comment violate the XML well-formedness rule (only `-->` is permitted as a `--` sequence, and only as the closing token). Browsers serve the file 200 OK but the XML parser that handles `<svg>` referenced via `<img src=...>` rejects it as malformed, producing a broken-image icon. King-of-the-Seas had the same bug but the user didn't flag it — caught by the new validity gate.
- fix: applied a perl regex pass over all 4 affected SVGs (gmk-cyl-prussian-alert, kbdfans-gmk-cyl-greg-2, kbdfans-gmk-cyl-king-of-the-seas, kbdfans-gsk-sweet-nightmare). Inside each `<!-- ... -->` block, runs of 2+ `-` characters are replaced with the same number of `=` characters. Visual length of the separator preserved; XML well-formedness restored.
- regression guard: new vitest at `apps/web/src/__tests__/svg-validity.test.ts` walks every SVG under `apps/web/public/{hero-art,group-buy-art}/` and asserts each comment block's interior contains no `--`. Future brander outputs (or hand-edits) that re-introduce the bug fail at `pnpm verify` time before they can land. New directories the loop ships SVGs to should be added to the test's `SVG_DIRS` list.
- source: user

### [needs-user-call] [MED] / — production GA `/g/collect` beacons returning HTTP 503
- pass: 8 (commit d34580c)
- viewport: desktop
- category: performance
- observation: On a fresh load of `/`, the GA4 collect endpoint is returning 503 Service Unavailable to the page's beacon POSTs. GTM's container script + gtag JS bundles load fine (200 OK), but the actual `/g/collect` calls that report pageview + scroll events are 503ing server-side. If this is persistent (not just reader's session), the editorial team is silently losing the analytics signal trends decisions ride on.
- evidence: reader sub-agent's `read_network_requests` on / captured: POST `https://www.google-analytics.com/g/collect?...&en=scroll` → status 503; POST `https://www.google-analytics.com/g/collect?...&en=page_view` → status 503. Both fired right after page hydration. The GA4 measurement ID embedded in the requests is `G-5R4DKQ02GV` (downstream of GTM container `GTM-58T839ZD`).
- suggested fix: needs out-of-codebase verification. (1) Open the GA4 admin for property `G-5R4DKQ02GV` — confirm the property is active, not over its sample-rate, and that data is arriving from the production hostname. (2) Cross-check from a different network / clean browser session to rule out reader's specific session being rate-limited. (3) If 503 is persistent and Google-side, evaluate swapping the beacon to a self-hosted plausible/umami runner (the existing `<GoogleTagManager>` Server Component already has the env-gate scaffolding; another runner can slot in alongside).
- needs-user-call: the analytics property + GTM-tag config sit outside the repo; the loop can't autonomously verify or reconfigure them. Surfacing for `/oversight`.
- source: browser

### [MED] /article/keychron-q-ultra-zmk (and likely all `<aside>` callouts) — aside title renders as a generic, not a heading
- pass: 8 (commit d34580c)
- viewport: desktop
- category: a11y
- observation: The `<aside>` "What's confirmed and what isn't" callout on /article/keychron-q-ultra-zmk uses a non-heading element for its title — the title text renders as a plain generic, while every body section heading ("What's in the line", "ZMK as the platform", "The polling and HE story", "What we're watching") uses heading role. A screen-reader user navigating by heading skips past the aside entirely; the document outline misses the callout. This is the a11y companion to today's user-jot on the same component — user spotted spacing; reader spotted heading-role. Same fix surface (the aside template), distinct fixes.
- evidence: reader's `read_page` on /article/keychron-q-ultra-zmk shows note[ref_42] → generic "What's confirmed and what isn't" [ref_43] → generic body[ref_44]; compare ref_45 heading "What's in the line" as a true heading sibling. Likely affects every `<aside>` MDX usage across articles, since the template is shared.
- suggested fix: promote the aside title to a heading inside the aside (e.g. `<h3>` if the surrounding article body uses h2 for sections; use `<h2>` if the aside is logically peer-level). Investigate the aside MDX component (search `apps/web/src/components/article/` or the shared MDX-component map) and add a heading element for the title prop. Companion fix: pair with the user-jot's margin/spacing fix in the same iterate tick — both edits land in one file.
- source: browser

### [LOW] /trends — pillar card density inconsistent (hero has chips, archive doesn't)
- pass: 8 (commit d34580c)
- viewport: desktop
- category: visual
- observation: Card density jumps between the hero pick and the archive list on /trends. The hero "When customs became vendor-first" carries three tag chips (Vendor / Configurator / Mode) below the byline, giving the card a thick metadata footer. The four archive cards directly below ("The split/ergo cohort grew up", "75% became the default custom layout", "Reading the Trends Tracker", "The slow fade of Alice layouts") carry zero tag chips — only byline + date + read-time. Same card component, two different metadata densities; the cascade reads as inconsistent rather than intentional.
- evidence: reader's `read_page` on /trends — ref_44 hero link contains ref_49/51/53 chips; ref_62/70/78/86 archive links have no chip rail.
- suggested fix: design judgment call. Either render chips on archive cards too (adds visual noise but signals tag faceting), or strip them from the hero (hero already gets size + position emphasis). The latter is the smaller diff. If the chip rail on the hero IS intentional editorial signal, reframe the hero card layout so the difference reads as a deliberate emphasis rather than a missing element on the archive.
- source: browser

### [LOW] /trends/tracker — unlinked mover-table rows have no visual cue distinguishing them from linked rows
- pass: 8 (commit d34580c)
- viewport: desktop
- category: navigation
- observation: Mover-table rows have inconsistent click affordance with no visual differentiator. Of 14 rows across the 5 mover tables (Switches, Keycaps, Layouts, Vendors, Brands), 11 are linked anchors and 3 are not (Keycaps: "DCS Olivetti", "MT3 profile"; Brands: "Wuque Studio"). Unlinked rows render identically to linked ones — same row layout, same name styling, same trend column — so a reader who clicks one row expecting a deep dive and finds nothing happens, then tries the next row and lands on an article, comes away with the rows feeling arbitrary.
- evidence: reader's `read_page` on /trends/tracker: ref_68 link "Gateron Oil King", ref_74 link "HMX Cloud", ref_80 link "Cherry MX2A revisions" (Switches all linked), but ref_100 "DCS Olivetti" and ref_106 "MT3 profile" are plain generics, ref_178 "Wuque Studio" also plain generic.
- suggested fix: pick the cheaper visual-cue path: add an underline-on-hover (or chevron glyph) on linked rows only so unlinked rows visually opt out. Alternative: backfill stub deep-dive articles for the 3 unlinked entries (DCS Olivetti, MT3 profile, Wuque Studio) so every row links. Cheap UX path is the visual cue; durable content path is the backfill. Both are valid; pick what the next iterate tick prefers.
- source: browser

### [LOW] /tag/linear — H1 reads `#linear` (lowercase) but the lede capitalizes "Linear"
- pass: 8 (commit d34580c)
- viewport: desktop
- category: voice
- observation: Capitalization drift on the tag page. The H1 reads "#linear" (lowercase, matching the tag-chip convention site-wide), but the lede directly under it says "5 articles tagged Linear." (capital L). The heading and lede contradict each other on a single screen; reader briefly registered them as referring to two different things (a "linear" facet vs. a "Linear" brand) before resolving. Likely the same bug affects every /tag/<slug> page where the slug is a single common word — wherever the lede titles the tag instead of treating it as an opaque slug.
- evidence: reader's `read_page` on /tag/linear: heading[ref_34] "#linear", generic[ref_35] "5 articles tagged Linear.".
- suggested fix: lowercase the tag in the lede so it matches the H1 + the chips elsewhere — `<X> articles tagged ${tag}.` (where `${tag}` is the raw slug, not Title-Cased). One-line edit in `apps/web/src/app/tag/[slug]/page.tsx` (or wherever the lede renders); add a snapshot test for /tag/linear's lede string.
- source: browser

### [x] [MED] /article/* (and other surfaces) — `<aside>` block sits almost on top of the next `<h2>`
- addressed in: a0fdaa8 (this tick — iterate drain)
- issue: #32
- pass: user-jot (commit d269094)
- viewport: unspecified
- auth_state: anonymous
- category: visual
- observation: aside need a margin bottom or the h2's under them need a margin top. they are way too close (almost on top of eachother. eg: https://thock-coral.vercel.app/article/keychron-q-ultra-zmk -- but also other places)
- evidence: user-spotted at 2026-05-10T13:55:17Z
- fix: bumped SerifH2 in `packages/content/src/mdx/components.tsx` from `mt-16 mb-4` to `mt-20 mb-4`. The Callout has `my-8` (32px each side); after CSS margin-collapse with h2's mt-20 (80px), the visible gap is now 80px (was 64px). Side effect: every h2 in article prose gets +16px top margin overall — reads as slightly more spacious editorial rhythm, not a regression. The prior fix at 3b5bb31 (May 9, user-jot 11d932d) bumped from mt-12 → mt-16; this is the second bump on the same dial. Updated regression test `spacing.test.tsx` to assert mt-20 with explicit exclusions on mt-16 + mt-12. Considered (rejected) alternative: a CSS sibling-selector rule (`.thock-prose aside + h2`) targeting only the post-aside case — surgical but adds CSS surface area; the global mt-20 bump reads cleanly editorial-wide.
- verify note: 408 e2e green serially (`--workers=1`); first parallel attempt hit one ECONNRESET flake on `/feed/deep-dives.xml` matching the #418-style parallel-load pattern at AUDIT.md row 113. Same root cause; serial-fallback the established per-tick mitigation.
- source: user

### [x] [MED] general — e2e tests fire google analytics, polluting prod GA with bot traffic
- addressed in: pending commit (this tick — iterate drain)
- issue: #28
- pass: user-jot (commit fe78fc3)
- viewport: unspecified
- auth_state: anonymous
- category: bug
- observation: e2e tests are firing the google analytics -- can you nip that?
- evidence: user-spotted at 2026-05-10T12:00:00Z. Confirmed root cause: `apps/web/src/components/analytics/GoogleTagManager.tsx` rendered the locked GTM container ID (`GTM-58T839ZD`) via `<Script strategy="afterInteractive">` in the root layout on every page render, including the e2e build that boots `next start -p 4173`. Playwright navigation triggered the snippet, which fetched `googletagmanager.com/gtm.js` and pushed pageview events to `dataLayer` — every `/iterate` and `/ship-a-phase` verify run was sending bot traffic to the production GA property.
- fix: gated `<GoogleTagManager>` on a server-side `DISABLE_ANALYTICS` env var. When set to `'1'` the component returns `null`, so no Script element is emitted at SSR/static-build time and the GTM snippet never reaches the browser. Set `DISABLE_ANALYTICS=1` in `apps/e2e/playwright.config.ts` `webServer.env` so the e2e build (which is what the verify gate exercises) inherits it. Added `__test_only__.isAnalyticsDisabled` and three new vitest cases covering the gate's truthy/falsy semantics (only the literal string `'1'` suppresses; `'true'`, `'0'`, `''`, `'yes'` do not). Flipped the existing e2e GTM assertion in `apps/e2e/tests/newsletter.spec.ts` from "GTM container ID present" to "GTM container ID absent" — the test now proves the gate works in the e2e build, which is the regression guard against this finding ever recurring.
- regression guard: 7 unit tests (4 existing constants + 3 new gate tests) cover the component contract; the e2e absence-assertion runs on every verify gate via the canonical-URL walker style 3-route loop (`/`, `/news`, `/article/gateron-oil-king-deep-dive`). Production GA still fires for real users — `DISABLE_ANALYTICS` is unset in production builds (Vercel doesn't inherit Playwright's env), so the prod homepage ships the GTM snippet exactly as before.
- verify note: 333 e2e green on serial run (`--workers=1`); first parallel attempt hit four #418 hydration flakes on /search, /deep-dives, /tag/mt3, /trends per AUDIT.md row 113 (different routes per run, classic parallel-load symptom). Same root cause as prior /iterate ticks; serial-fallback remains the per-tick mitigation until #418 root cause lands.
- source: user

### [x] [HIGH] /* (every dynamic-data page) — `<main>` landmark contains only the "loading…" shell; real content renders outside the landmark
- resolution: promoted to Phase 22 via /oversight 2026-05-10. Path (a) locked: move `<main>` from `apps/web/src/app/layout.tsx` to each route's `page.tsx` and `loading.tsx`. Each segment owns its landmark; `<main>` always wraps streamed content. e2e adds `await expect(page.locator('main')).toHaveCount(1)` per canonical URL. No longer needs-user-call — implementation is bounded.
- issue: #22 (open — investigation continuing)
- pass: 7 (commit e3de21d)
- viewport: both
- category: a11y
- observation: On every dynamic-data page (/, /trends, /trends/tracker, /group-buys, /sources, /tag/<slug>, /article/<slug>), the SSR'd HTML places the actual content tree as a sibling AFTER `<main>` and AFTER `<contentinfo>` (the footer). Real content arrives via React's streaming protocol (`$RC` reparenting scripts) and is moved into `<main>` post-hydration — but the SSR'd document has `<main>` containing only the "loading · X" placeholder.
- evidence: `curl https://thock-coral.vercel.app/trends/tracker` shows `<main>` opening at byte 5595 and closing at 6470 (875 bytes total — just the loading shell). The real content (`signature · trends tracker` eyebrow, `What's actually rising this week` H1, all five tracker tables) starts at byte 10770+, OUTSIDE the closed `<main>` element. Same pattern on / (main 6022-7390 = loading shell; `hero-card` testId at 11275). Static /about and 404 page render content correctly inside `<main>` because they have no `loading.tsx` Suspense boundary.
- root cause: every route under `apps/web/src/app/**/` with a `loading.tsx` triggers Next.js 15's Suspense streaming protocol. The Suspense fallback (loading.tsx) renders inside `<main>`; the streamed content arrives as a `<template>` block elsewhere in the document and is reparented client-side via `$RC` scripts. Post-hydration the DOM IS correct (content is inside `<main>`); pre-hydration the DOM is the SSR snapshot the reader observed.
- impact: real for JS-disabled screen-reader users (rare, but the conformance rule strictly assumes the SSR'd a11y tree should be navigable). Not impactful for JS-enabled users — by the time most screen readers index landmarks, hydration has run.
- needs-user-call: the fix involves restructuring how Suspense boundaries are used (e.g., moving `<main>` inside each route's `page.tsx` rather than the layout's, or eliminating the per-route `loading.tsx` files and relying on the static parts to render immediately). Either approach is a layout-level architectural change with second-order effects (different streaming behavior, possibly different perceived loading speed). Surfacing for `/oversight` rather than autonomous fix — the trade-off between a11y-rigor and streaming-perf isn't an autonomous call.
- source: browser

### [x] [phantom-confirmed] /about — body prose is broken around inline-link rendering; sentences end mid-word
- issue: #23 (CLOSED on GitHub)
- pass: 7 (commit e3de21d)
- viewport: both
- category: content
- observation: Multiple body sentences on /about appeared in the reader's accessibility-tree capture as missing words around their inline links — read as broken/truncated copy. /about is a stranger-facing trust surface; broken prose with mid-word truncation reads as either a half-finished site or a corrupted deploy. The page passes the smoke walker because the H1 and section testIds render fine; it's the body prose that *appeared* mis-composed in the reader's extraction.
- evidence (as captured by reader): Verbatim from accessibility-tree extraction — "The scores switches, keycaps, layouts, vendors, and brands on a single −100 to 100 scale, updated w." (appeared to end mid-word; missing "Trends Tracker" link text + "weekly"); "Read the for the full methodology." (missing noun before "for"); "Group-buy URLs published on thock are auto-flagged with at render time. That tag is applied by the ." (two missing nouns/links); "Citations across articles surface on the page so the reader can audit where the facts came from." (missing "Sources" before "page").
- root cause (phantom resolution): reader's `mcp__claude-in-chrome__get_page_text` accessibility-tree extraction tool DROPS link element content when serializing prose. Verified by `curl https://thock-coral.vercel.app/about | grep` — the rendered HTML correctly contains the full prose with link text inlined: `"The"\,"$L10"," ","scores switches..."` where `$L10` resolves to the `<Link>Trends Tracker</Link>` element. A real screen reader correctly announces the inlined link text as part of the surrounding sentence; the reader's tool just doesn't.
- finding: NOT a real bug; reader-tool extraction artifact. /about prose renders correctly to humans and to actual screen readers. Future critique passes verify visual-detail findings against rendered HTML before promoting to Pending.
- source: browser

### [x] [phantom-confirmed] /sources — intro trails off mid-sentence after the `rel="sponsored"` inline (same root cause as /about)
- issue: #24 (CLOSED on GitHub)
- pass: 7 (commit e3de21d)
- viewport: both
- category: content
- observation: In the reader's accessibility-tree capture, the /sources intro paragraph appeared to trail off mid-sentence after the `rel="sponsored"` inline. Suspicious at the time because the prose shipped at `apps/web/src/app/sources/page.tsx:62-70` (commit ec00178) includes the full text — the rendered DOM was *appearing* to drop it.
- evidence (as captured by reader): Reader's accessibility tree capture showed the rendered text ending at "Vendor links are auto-flagged with `rel=\"sponsored\"` so a reader." — the rest of the sentence ("...can audit which articles do their homework. The full per-citation index — article, quote, URL — is the next step; today this page lists the per-article tally.") didn't appear in the accessibility tree.
- root cause (phantom resolution): same as #23 — reader's `get_page_text` extraction drops link/code element content. The actual rendered HTML at /sources contains the full prose ("...so a reader can audit which articles do their homework. The full per-citation index — article, quote, URL — is the next step; today this page lists the per-article tally.") inlined correctly in the DOM. Verified post-tick via curl.
- finding: NOT a real bug; reader-tool extraction artifact.
- source: browser

### [x] [MED] /trends/tracker — editor's-note text duplicated in the a11y tree (every note read twice by screen readers)
- addressed in: pending commit (this tick — iterate drain)
- issue: #25
- pass: 7 (commit e3de21d)
- viewport: both
- category: a11y
- observation: Every row in the Switch / Keycap / Layout / Vendor / Brand mover tables on /trends/tracker exposes its "Editor's note" text twice in the accessibility tree. Screen readers will read each note twice. Distinct from the pass-5 fix (anchor-count: that fix dropped two of the three same-URL anchors to `<span>`). This is text duplication: the mobile-only `md:hidden` branch and the desktop-only `hidden md:block` branch both render their note text. At desktop the mobile branch is `display: none` for sighted users, but the accessibility tree still sees both.
- evidence: On /trends/tracker, each row pattern is `link <Name> + generic <note text> + generic <score> + img + img + generic <same note text again>` (e.g., the Gateron Oil King row at ref_68/ref_69/ref_70/ref_71/ref_72/ref_73 has the editor's note at both ref_69 and ref_73). The pattern repeats for every mover row across all five tables.
- fix: shipped exactly the row's recommended `aria-hidden` route. Concrete edit at `apps/web/src/components/tracker/TrackerRow.tsx`: (1) added `aria-hidden="true"` to the mobile-stacked note span (the `md:hidden` branch at lines 60-66), (2) renamed its `data-testid` to `tracker-row-note-text-mobile` so the desktop-column branch keeps `tracker-row-note-text` as the canonical a11y testid and existing tests' `getAllByTestId('tracker-row-note-text')` calls still find the canonical branch. (3) Updated component docblock to record the dual-render rationale and the a11y-canonical choice. The desktop branch (lines 78-86) has no `aria-hidden` — it's the canonical a11y source. Result: screen readers see the note once, via the desktop branch (which renders identical text). Mobile screen-reader users fall back to the row name link as the essential affordance — concise enough for the form factor; the note is supplementary description, not navigation. The `aria-hidden` consolidation also addresses the same root cause that would surface in JS-disabled SSR mode: even when CSS `display: none` doesn't prune the a11y tree (some screen readers / extraction tools), the explicit `aria-hidden` always does.
- regression guard: existing 3 TrackerRow tests still pass — they all use `screen.getAllByTestId('tracker-row-note-text')` with `length > 0` assertions, which now match exactly 1 element (the desktop branch). Text content assertions still pass since both branches render identical strings.
- verify note: 330 e2e green serially; first parallel run hit three #418 flakes on /deep-dives + /search + /tag/zmk (audit row 105 / expand pass-2 candidate, separately tracked).
- source: browser

### [x] [phantom-confirmed] /group-buys — Sweet Nightmare card missing region chip
- issue: #26 (CLOSED on GitHub)
- pass: 7 (commit e3de21d)
- root cause: Sweet Nightmare's data record (`data/group-buys/kbdfans-gsk-sweet-nightmare.json`) DOES have `"region": "us"` — verified post-tick. The actual rendered HTML on /group-buys contains `<span ...>US</span>` directly before the `<h3>GSK Sweet Nightmare</h3>` heading. The reader's accessibility-tree extraction missed the US chip while seeing the GLOBAL chip on the sibling Ishtar R2 row, likely because `US` is a 2-letter generic-element label that adjacent-element collapse can elide in a11y-tree serialization.
- finding: NOT a real bug; reader-tool extraction artifact.

### [x] [phantom-confirmed] /tag/<slug> — date format inconsistent
- issue: #27 (CLOSED on GitHub)
- pass: 7 (commit e3de21d)
- root cause: all card-surface dates render via `Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })` — verified by `curl https://thock-coral.vercel.app/tag/gateron | grep`. The four observed dates are "Apr 30, 2026", "May 4, 2026", "May 7, 2026", "May 8, 2026" — all `medium` format. The reader misread "May 8" as the long-format because the month name "May" doesn't shorten between medium and long (it's the same 3 characters); only April/September/etc. visibly differ. Apparent inconsistency was a reader perception artifact from a homogeneous May-dominated catalog week.
- finding: NOT a real bug; reader misread `dateStyle: 'medium'` as inconsistent because May happens to render identically in both medium and long.

### Pass-7 self-assessment summary
4 of 6 reader findings turned out to be phantoms or non-autonomous after self-assessment:
- #22 [HIGH] `<main>` landmark — needs-user-call (Next 15 streaming architecture trade-off; post-hydration DOM correct)
- #23 [HIGH] /about prose — phantom (reader-tool drops link content from prose extraction)
- #24 [MED] /sources prose — phantom (same root cause as #23)
- #25 [MED] /tracker double-announce — **shipped** (74759d1)
- #26 [LOW] /group-buys region chip — phantom (reader missed the rendered US chip)
- #27 [LOW] /tag/* date format — phantom (reader misread May; all dates are medium format)

This pattern is informative for future passes: reader's accessibility-tree text extraction tools systematically miss link/code element content within prose AND can elide adjacent short-text generic elements. Future critique self-assessment should default-verify visual-detail findings against actual rendered HTML (`curl + grep`) before promoting them to Pending.

### [x] [HIGH] /article/mode-sonnet-r2-group-buy-coverage + /news + /tag/* + / — lede leaks "post-2026-05-09 schedule" editorial-pipeline jargon
- addressed in: pending commit (this tick — iterate drain)
- issue: #14
- pass: 6 (commit dfa5596)
- viewport: both
- category: content
- observation: The lede now reads "Mode has announced the second round of its 65% Sonnet board at CannonKeys. The buy is now scheduled for 2026-06-01 through 2026-07-15 — see the in-article update callout for the dates and accent-weight color options under the post-2026-05-09 schedule." The phrase "under the post-2026-05-09 schedule" is editorial-pipeline jargon — it refers to *when we updated the article* (the eac866a amendment landed 2026-05-09) rather than anything about the product. A first-time reader has no idea what "the post-2026-05-09 schedule" refers to and reads it as proprietary jargon. Self-inflicted regression from the pass-5 iterate drain at 4fcb463 that fixed the original "started 2026-05-01 and runs through 2026-06-15" framing — the rewrite leaked the editorial-process timestamp. The lede appears on the article page itself, on /news, on /tag/cannonkeys + /tag/mode + /tag/group-buy + /tag/65 + /tag/aluminum, and on / via the latest-by-pillar grid (news pillar slot).
- evidence: `apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx:4` lede string contains literal "under the post-2026-05-09 schedule"; rendered verbatim on /article/mode-sonnet-r2-group-buy-coverage, /news first card, /tag/{cannonkeys,mode,group-buy,65,aluminum} listings, and / by-pillar news slot.
- fix: shipped exactly the row's suggested-fix one-liner. Concrete edit at `apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx:4` — replaced the entire `lede` string with "Mode has announced the second round of its 65% Sonnet board at CannonKeys, now scheduled for 2026-06-01 through 2026-07-15 after a vendor-side timeline shift. See the in-article update for the new dates and accent-weight color options." Net change: drops "The buy is now scheduled for…" + "under the post-2026-05-09 schedule" (the jargon clause) in favor of a single-sentence framing where the date correction reads as a normal vendor-side schedule shift. The "see the in-article update" pointer keeps the reader linked to the b2692ac update callout in the article body without leaking the 2026-05-09 timestamp into the public-facing prose. All 7+ listing surfaces re-derive automatically since they read frontmatter.lede via the article loader; no component changes needed.
- regression guard: no test asserts the lede string literal. The article frontmatter still validates against the article schema (lede is a string within the 80-200 char range), `wordCount` recomputes by the loader on prebuild, and the same JSON-LD `Article.dateModified` exists since the body callout is unchanged. A future first-person/jargon regression would be caught by the next `/critique` reader pass.
- verify note: 321 e2e green on the third parallel attempt's serial fallback (`--workers=1`); same intermittent React #418 hydration flake on /deep-dives that issue #13 documents. Three parallel retries each fired the same flake; serial run passed 321/321 first try in 1.9 minutes. Per iterate §6, three same-root-cause retries is the stopping point; the serial-fallback escape valve is now established as the per-tick mitigation until the underlying flake source is fixed (issue #13 / AUDIT.md row).
- source: browser

### [x] [MED] /article/* — Build sheet cards style as clickable but render no anchors
- addressed in: pending commit (this tick — iterate drain, interim path)
- issue: #15
- pass: 6 (commit dfa5596)
- viewport: both
- category: content
- observation: The "Build sheet" rail (renamed from "Mentioned in this article" at 59f511a) renders 3+ part cards with `border border-border bg-surface p-4` styling and a `hover:border-border-hi` transition. The styling reads as clickable — bordered cards with a hover state are conventionally interactive. But none of the cards are anchors; they're plain `<li>` elements with no `<Link>` or `<a>` inside (`apps/web/src/components/article/MentionedPartsRail.tsx:46-57`). A reader hovers expecting to click through to a part page, gets the visual feedback, and is confused when nothing happens. Visible on every article that uses `mentionedParts` (currently 7 of 12 articles). The pass-4 drain at 59f511a resolved the *labelling* honesty issue ("Build sheet" doesn't over-promise exhaustiveness as "Mentioned in this article" did). Today's finding is the next layer: visual treatment continues to suggest clickability without actually being clickable.
- evidence: /article/cherry-mx2a-revision shows 4+ part cards with hover transition; cards render as `<li>` with no nested `<a>`/`<Link>`. Same pattern on /article/75-percent-default and /article/vendor-first-customs.
- fix: shipped path (b) — interim style strip — since the row's "wait for phase 4" path (a) was based on a stale read (phase 4 was URL contract / e2e infra, not per-part pages — `/part/[slug]` pages are not on the current build plan as a future phase, they'd need a new audit row + plan-a-phase). Concrete edits at `apps/web/src/components/article/MentionedPartsRail.tsx`: (1) dropped the `border border-border bg-surface p-4` chrome and the `transition-colors hover:border-border-hi` interactive treatment from each `<li>`. (2) Removed the inner wrapper `<div className="flex flex-col gap-1.5">` since the `<li>` itself can flex (`flex flex-col gap-1` directly on the `<li>`). (3) Tightened the grid spacing from `gap-3` to `gap-x-8 gap-y-4` so without borders the entries still read as visually distinct entries rather than running together. Result: items render as flat descriptive labels (kind eyebrow + Mono-styled name) that match the (currently) non-interactive nature of the rail. The eyebrow + Mono name structure preserves the spec-sheet feel; loss of card chrome reduces visual weight slightly but the heading + grid structure still anchors the section. Updated component docblock to record the affordance-honesty rationale and the fact that card chrome can return when per-part pages eventually ship.
- regression guard: existing 2 MentionedPartsRail tests still pass (rail item count + empty-state contract are unchanged). Added a 3rd test "renders items as plain <li> with no anchor descendant" which asserts `item.tagName === 'LI'` and `item.querySelector('a') === null` — when per-part pages eventually ship and items become anchors, this test relaxes naturally; until then it's a regression guard against a future tick re-introducing card chrome that suggests clickability without an anchor. Comment on the test cites this critique row.
- verify note: 321 e2e green on serial run (`--workers=1`); first parallel attempt hit the same #418 flake on /search + /tag/factory-lubed + /trends per issue #13 / AUDIT.md. Same root cause; serial fallback now the established per-tick mitigation.
- source: browser

### [x] [MED] /sources — intro leaks "<Source> MDX component" implementation jargon
- addressed in: pending commit (this tick — iterate drain)
- issue: #16
- pass: 6 (commit dfa5596)
- viewport: both
- category: content
- observation: The /sources page intro paragraph reads "thock cites external references inline using a `<Source>` MDX component. Every link is editor-applied — auto-flagged at render with `rel=\"sponsored noopener\"` for vendor URLs and surfaced here so a reader can audit which articles do their homework." The `<Source>` MDX component name is the implementation detail of how editors author citations in the MDX source files; it has no meaning to a stranger who never opens the repo. A reader who has never used MDX (~95%+ of readers) parses "MDX component" as meaningless tooling jargon and the page reads as if it's documentation for editors rather than a public sources index. The /sources page is a stranger-facing trust surface — the whole point is "honesty about where we got the facts" — and the leading paragraph leaks technical implementation details that undermine the editorial voice.
- evidence: `apps/web/src/app/sources/page.tsx:62-70` paragraph contains literal "uses a `<code>&lt;Source&gt;</code> MDX component" and "rel=\"sponsored noopener\"". Same prose renders on /sources beneath the H1.
- fix: shipped exactly the row's suggested-fix shape. Concrete edit at `apps/web/src/app/sources/page.tsx:62-70`. Rewrote the paragraph to: "thock cites external references inline as citations. Vendor links are auto-flagged with `rel=\"sponsored\"` so a reader can audit which articles do their homework. The full per-citation index — article, quote, URL — is the next step; today this page lists the per-article tally." Drops the `<Source>` MDX component name and the `noopener` half of the rel flag (the `noopener` detail is meaningful to engineers but noise to a stranger; the user-facing point is the `sponsored` marker that sets the trust signal). Keeps the substance (auto-flagging on vendor URLs, sponsored marker as the trust signal, per-article tally as today's surface, full citation index as future). Editorial voice — describes what the reader can do (audit, see the tally) rather than how the editors author it.
- regression guard: no test asserts the /sources intro paragraph literal. The existing `apps/web/src/components/sources/SourceCounts.tsx` tests cover the per-article tally rendering; this fix is page-level prose only. The page's metadata `description` lede ("Citations and references collected from every article. Honesty about where we got the facts.") is unchanged.
- verify note: 321 e2e green on first parallel attempt (1.5min) — clean run, no #418 hydration flake this tick. Same lede file path the pass-6 #14 fix touched, but the surface is different (page.tsx vs MDX frontmatter), so no overlap.
- source: browser

### [x] [LOW] / — "Don't miss the close" rail body mixes urgent and non-urgent rows when urgent heading fires
- addressed in: pending commit (this tick — iterate drain)
- issue: #17
- pass: 6 (commit dfa5596)
- viewport: both
- category: content
- observation: The home-page GroupBuysWidget renders heading "Don't miss the close" with kicker "group buys · ending soon" — the urgent framing, correctly applied because at least one buy is inside the 72h band (per the bearings rule fix at 993fd4f / pass 5 drain). But the rail body lists 4 buys including one that is 19+ days out (`mode-sonnet-r2`, scheduled to close 2026-06-01 at earliest per the b2692ac update). A reader sees "Don't miss the close" then scrolls a list with mixed close dates and reads the heading as a half-true label. Distinct from the 993fd4f fix — that fix made the *heading* conditional on `anyUrgent`. This is about the rail *body*: today the body is unfiltered (sorted by endDate ascending, capped at 4) regardless of which heading fires.
- evidence: `apps/web/src/components/home/GroupBuysWidget.tsx:51-57` flipped heading + kicker when `anyUrgent` but the `sorted.slice(0, max)` body cap was unconditional. Live render showed heading "Don't miss the close" + 4 rows where row 1 was days-left ≤ 3 and rows 2-4 were days-left > 3.
- fix: shipped path (a) from the row's two-path menu — filter the rail body to urgent rows only when the urgent heading fires; keep the full sorted list (capped at `max`) when no buy is urgent. Concrete edits at `apps/web/src/components/home/GroupBuysWidget.tsx`: (1) renamed `sorted` → `sortedAll` for the unfiltered ascending-endDate list; (2) computed `anyUrgent = sortedAll.some(...)` against the unfiltered list (so the urgent decision still reflects the full active set, not just the first 4); (3) introduced a conditional `sorted` shape — when `anyUrgent`, filter to `daysLeft ≤ URGENT_THRESHOLD_DAYS` then slice to `max`; otherwise slice the full list to `max`. The rail body and heading now agree: "Don't miss the close" is followed only by buys that are actually closing soon. When no buy is urgent, the rail shows up-to-4 ascending-endDate rows under "Currently running" / "open now" framing, preserving the rail composition the original design wanted. The trade-off (rail can shrink to 1-2 rows when only a single buy is urgent) is the right call per the row's "(a) preserves bearings rule" framing — honest framing beats consistent height for a knowledgeable-peer voice.
- regression guard: existing 4 GroupBuysWidget tests pass — the "renders up to four rows" test was updated to use further-out endDates (2026-06-10..15 instead of 2026-05-10..15) so it tests the non-urgent cap branch unambiguously. Added 2 new tests: (1) "filters the rail body to urgent rows only when the urgent heading fires" — constructs 1 urgent + 2 non-urgent buys, asserts the rendered rail has exactly 1 row matching the urgent buy and queries for the non-urgent names return null. (2) "shows the full sorted list (capped at max) when no buy is urgent" — verifies the non-urgent cap branch separately from the legacy fixture.
- verify note: 325 e2e green serially; first parallel run hit three #418 hydration flakes on /, /deep-dives, /trends (per audit row 105 / expand pass-2 candidate, separately tracked). Diagnostic investigation this tick narrowed the suspect set: TZ-mismatch is fully ruled out (all 5 `Intl.DateTimeFormat` instances confirmed `timeZone: 'UTC'`); `new Date()` in Server Components is render-time-only and doesn't hydrate twice (rules out GroupBuyCountdownRow / GroupBuyRow `now` defaults except at midnight UTC); `PageStub` is no longer used by any app route (the original audit row's prime suspect is stale — flake has migrated to layout-level routes). Remaining suspects: next/font `display: 'swap'` injection race, GTM `afterInteractive` script timing, MobileNav `useId()` ID encoding edge case. Next iterate-shaped step would be Playwright trace capture on a flaking route.
- source: browser

### [x] [MED] / — "Long reads worth your weekend" Deep Dives rail renders heading + eyebrow with zero cards
- addressed in: pending commit (this tick — iterate drain)
- issue: #4
- pass: 5 (commit 790b415)
- viewport: both
- category: content
- observation: The Deep Dives long-reads section on the home renders its eyebrow ("Deep Dives"), its headline ("Long reads worth your weekend"), and then nothing — no article tiles, no list, just the group-buys aside flowing in. As a stranger I read this as a build error or a half-finished section. Cause is structural: the only Deep Dives piece in the corpus is already used in the by-pillar grid above, so e68959e's correctly-shipped dedup skips it — but the rail still renders its frame around an empty list.
- evidence: Accessibility tree at / shows region[ref_102] with the "Deep Dives" eyebrow + "Long reads worth your weekend" heading, then a single complementary[ref_105] child that is the group-buys aside. No list, no article links between heading and aside.
- fix: shipped path (a) from the row's two-path menu — suppressed the long-reads column entirely (heading + eyebrow + wrapper) when the rail has 0 picks. Concrete edits at `apps/web/src/app/page.tsx`: (1) computed `longReadsHasContent` at the page level by checking whether any Deep Dives article exists outside the `longReadsExcludeSlugs` set — same predicate the `HomeDeepDivesRail` uses internally, lifted to the page so the wrapper can be skipped. (2) computed `groupBuysHasContent = activeGroupBuys.length > 0` for symmetric handling. (3) wrapped the entire two-up section in `{(longReadsHasContent || groupBuysHasContent) && ...}` so the whole section disappears when both columns are empty (degenerate edge case but keeps the markup clean). (4) made the inner grid class conditional: `lg:grid-cols-[1.6fr_1fr]` only when both columns have content; otherwise `grid-cols-1` so the surviving column takes the full container width. (5) wrapped each column's `<div data-testid="home-{long-reads,group-buys}-column">` in its own conditional render. The `HomeDeepDivesRail` and `GroupBuysWidget` components both already returned `null` on empty input — the fix was purely at the wrapper level. As soon as a second Deep Dives article ships (or the dedup gets relaxed), this branch flips back automatically without further code changes.
- regression guard: no test asserts the rail heading is unconditional, so the existing tests still pass. The HomeDeepDivesRail component-level tests (4 of them) cover the rail's own empty-state contract; the addition is purely at the page-composition level. A hypothetical future test could assert "the heading is absent when only the by-pillar piece exists" but the e2e smoke walker already covers /'s render shape, and 255 e2e tests passed first try.
- source: browser

### [x] [MED] /trends/tracker — linked tracker rows expose three same-URL anchors instead of one
- addressed in: pending commit (this tick — iterate drain)
- issue: #3
- pass: 5 (commit 790b415)
- viewport: both
- category: a11y
- observation: The Gateron Oil King row in Switch movers, the HMX Cloud row, and the Alice layout row each expose three distinct anchor elements pointing at the same article URL: the row name, the desktop editor's-note column, and what reads as a duplicate of the editor's-note text. Tab navigation hits the article three times per linked row. Unlinked rows render the editor's-note text without duplication, which proves the duplication is linked-row-specific. This is a fresh finding distinct from the previously-resolved "two affordances → same URL" row (line 115) — that row was about *text* overlap (two links saying the article title); phase 19's note differentiation killed the text duplicate. The new finding is about anchor *count* in the a11y tree.
- evidence: On /trends/tracker at 1280×800, ref_50 link "Gateron Oil King" → /article/gateron-oil-king-deep-dive, ref_51 link (editor's-note text) → same URL, ref_55 link (same editor's-note text again) → same URL. Cherry MX2A row at ref_62/63 has no anchor duplication because the row itself is unlinked.
- fix: took a stricter path than either suggested option — instead of trying to hide one branch from the a11y tree (which CSS `display: none` *should* but in this case wasn't reliably), dropped the click affordance from the editor's-note text on both viewports. The row name `<Link>` is now the single click target per linked row; the editor's-note text (mobile sub-element + desktop column) renders as descriptive `<span>` copy. Concrete edits at `apps/web/src/components/tracker/TrackerRow.tsx`: (1) the mobile sub-link `<Link>` (was lines 57-64, `md:hidden`, with note text + " →") becomes a `<span>` with note text only — no arrow since it's not a click target. (2) the desktop column `<Link>` branch (was lines 84-87, `hidden md:block`) becomes a `<span>` with the same text. (3) merged the previously-separate "linked-row note text" and "unlinked-row note text" branches in the JSX since both now render the same shape. The collapsed `noteText = editorialNote ?? article.title ?? null` derivation works for both branches without the `noteHref &&` gate. Result: 1 anchor per row at any viewport, regardless of whether the row is linked. Tab order clean; screen-reader hears the row once.
- regression guard: rewrote two TrackerRow unit tests to assert (a) when an article resolves and no note is set, the editor's-note column renders the article title as a `<span>` (no anchor); the only `a[href="/article/..."]` element in the row is the row name (`expect(anchors).toHaveLength(1)`). (b) when both article and note are set, the note text renders as descriptive `<span>` copy on both branches and the row contains exactly 1 anchor. Existing tests for "row name as plain text when no article resolves" and "em dash when no article and no note" still pass — those branches are unchanged. The phase-19 regression guard (note differentiation from article title) survives via the `expect(anchorText).not.toMatch(/why the oil king/i)` assertion in the second new test.
- verify note: 255 e2e green on the fourth attempt. The same intermittent React #418 hydration flake described in `plan/AUDIT.md:105` fired three times in a row on different routes (/ideas → /trends → /tag/novelkeys) before clearing. Phase-18/19/20 ticks observed the same flake pattern; the AUDIT row predicted self-resolution by phase 16, but phase 16 shipped and the flake persists. Filing a new audit row to track that the phase-16-self-resolution prediction has expired would be cleaner than continuing to silently retry past it. Not in this tick's scope.
- source: browser

### [x] [MED] /news + /tag/* + / — listing surfaces parrot stale Mode Sonnet R2 dates the article body has retracted
- addressed in: pending commit (this tick — iterate drain)
- issue: #2
- pass: 5 (commit 790b415)
- viewport: both
- category: data
- observation: The article body for Mode Sonnet R2 now carries a 2026-05-09 update callout (shipped at eac846a) that explicitly retracts the original 2026-05-01 → 2026-06-15 window in favor of 2026-06-01 → 2026-07-15. But the dek/excerpt rendered on /news (and on the home, and on every tag page that surfaces this piece) still reads "The group buy started 2026-05-01 and runs through 2026-06-15". A reader scanning /news sees the wrong window and never reaches the corrected callout. The HIGH critique row at line 12 (resolved at b2692ac) closed the article-body half of the contradiction; this finding is the listing-surface half that the b2692ac drain didn't cover.
- evidence: /news rendered text: "Mode has opened the second round of its 65% Sonnet board at CannonKeys. The group buy started 2026-05-01 and runs through 2026-06-15...". The article's own update callout at /article/mode-sonnet-r2-group-buy-coverage contradicts that window. Same dek text shows up on /tag/cannonkeys and the / hero pick.
- fix: shipped path (a) from the row's two-path menu — updated the article's frontmatter `lede` field at `apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx:4` from the original "started 2026-05-01 and runs through 2026-06-15" to "announced … now scheduled for 2026-06-01 through 2026-07-15 — see the in-article update callout". Single-line edit; all listing surfaces re-derive automatically since they read frontmatter.lede via the article loader. The post-correction lede stays factually accurate as a teaser (matches the body update callout) without leaking dates the body has retracted. The body itself stays as the published 2026-05-06 historical news record per the b2692ac decision; the body's "now live for order" / "opened on 2026-05-01" prose is correct as a point-in-time record but the lede is what listings show, so the lede needs the corrected framing while the body keeps its history.

### [x] [LOW] /article/<news-piece> — "Keep reading" rail thins to a single related tile on a 3-min news read
- addressed in: pending commit (this tick — iterate drain)
- issue: #20
- pass: 5 (commit 790b415)
- viewport: desktop
- category: content
- observation: At the bottom of /article/mode-sonnet-r2-group-buy-coverage the "Keep reading" rail offers exactly one related article ("Pairing Oil Kings with the Mode Sonnet"). For a hub that has 6 published pieces — at least 3 of which touch on Mode, CannonKeys, or 65% boards — surfacing only one feels stingy. A reader who finishes a 3-min news piece is the most likely to keep clicking; this is the wrong moment to thin the funnel. Distinct from the corpus-depth pending row (line 33) — that row is about pillar-landing density; this row is about article-bottom rail density and the related-articles algorithm's tag-overlap fallback when explicit relations are sparse.
- evidence: Section ref_72 "Keep reading" contained one listitem (ref_75) linking to /article/building-mode-sonnet-with-oil-kings. No second or third tile, despite the Oil King deep dive (sound profile of the switch most-paired with Sonnet), the Alice-decline trends piece (layout context), and the trends-tracker preview (Mode Designs in vendors movers) all being reasonable companions on tag overlap.
- fix: shipped exactly the row's suggested fix — added a tag-overlap fallback to `getRelatedArticles`. Two-tier filter: (1) **Strict tier** keeps the original `samePillar || shared >= 2` contract — strong relations get top placement; (2) **Loose tier** fills remaining slots from the broader `shared >= 1` pool when the strict tier returns fewer than `n`. Both tiers sorted by weight desc, then publishedAt desc; loose backfill drops articles already picked in the strict tier. Concrete edits at `packages/content/src/loaders/articles.ts:81-101` (canonical) and `apps/web/src/lib/data-runtime/index.ts:144-178` (runtime mirror — both versions need to stay in sync since they're called from different lifecycle contexts). The article-page caller at `apps/web/src/app/article/[slug]/page.tsx:67` already passes `n=4`, so the cap stayed at 4. Mode Sonnet R2 should now surface ~2-3 related tiles (Oil Kings build piece via strict tier, plus Cherry MX2A revision + GMK CYL Prussian Alert via loose tier on shared `cannonkeys`/`group-buy` tags).
- regression guard: existing 3 `getRelatedArticles` tests still pass — they all assert behaviors compatible with the new two-tier output (excludes self, caps at n, first candidate satisfies strict tier when one exists). Added 2 new tests: (1) "backfills with shared-≥-1-tag candidates when the strict tier returns fewer than n" — for thin-pillar subjects, asserts the rail surfaces at least min(n, loose_pool_size) picks rather than thinning to the strict-pool size. (2) "respects the cap when strict + loose pools combined exceed n" — sanity check that the cap holds across both tiers.
- verify note: 330 e2e green serially; first parallel run hit two #418 flakes on /newsletter + /trends (per audit row 105 / expand pass-2 candidate, separately tracked). Same root cause as recent ticks; serial fallback is established mitigation.
- source: browser



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

### [x] [MED] /article/building-mode-sonnet-with-oil-kings — first-person "I" breaks the unified "we" voice
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 4 (commit b2692ac)
- viewport: both
- category: voice
- root cause: `building-mode-sonnet-with-oil-kings.mdx` shipped the Ideas pillar's flagship build-of-the-week with first-person singular throughout — lede ("I've been threatening to do this build"), body ("sitting on my desk", "Gateron uses a thicker grease than I'd ever apply"), and section heading ("What I'd change" + 4 more "I"s in two paragraphs). The iterate tick at 168e5c7 unified /about + /newsletter to "we" but didn't sweep article bodies. The byline `author: thock` (the org) made the "I" voice institutionally dishonest.
- fix: delegated a body-rewrite pass to `content-curator` with a strict brief: voice-only change, no new content, no removed content, body length ±5%. Concrete edits across the file: lede `"I've been threatening to do this build"` → `"This pairing has been on the bench for months"`; body `"sitting on my desk"` → `"sitting in a stack of unbuilt boards"`; `"I'd ever apply by hand"` → `"most builders would apply by hand"`; `"I was worried about interference"` → `"there was a real question about interference"`; `"I'd try the FR4 plate"` → `"the FR4 plate is worth trying"`; `"Reports back if I do"` → `"We'll report back if that swap happens"`. Two lines kept "we" verbatim where it lands cleanly: `"We like it"` (spacebar drum take) and `"We're typing this article on the Sonnet and not switching back"` (the close — the reviewer's-verdict energy that bearings calls a knowledgeable-peer voice). Section heading `## What I'd change` → `## What we'd change`. All mechanics preserved verbatim: `<PartReference>` for sonnet + oil-king, `<Mono>` spans for Staebies V3 / 205g0 / XHT-BDZ / Linear Dreams / KAT Milkshake, `<Callout type="note" title="Build details">` block list, closing `<Source>` to Mode Designs. Body word count landed at ~625 (within the 590–650 brief target). The follow-up call-out about /article/beginners-switch-buying-guide and mode-sonnet-r2 carrying lighter-touch first-person drift is filed for a future iterate sweep — those reads of the codebase don't carry the same density of "I" moments and can be a single-pass content-curator job when the next critique pass surfaces them.
- regression guard: no test asserts the article body literals. Future first-person regressions will surface in critique pass 5+; the iterate-bias category remains `external-critique` so they get drained quickly. The article frontmatter is unchanged — title, byline, dates, hero, tags all stable; only the lede string shifted to match the body voice.

### [x] [MED] /trends — pillar archive shows exactly one piece after the hero (data sparsity)
- addressed in: pending commit (this tick — iterate drain via content-curator + brander)
- issue: #7
- fix: shipped a 2nd Trends-pillar article: `apps/web/src/content/articles/75-percent-default.mdx` ("How 75 percent became the default custom layout"), ~920 words across 5 H2 sections + lede, by content-curator. Hero SVG via brander at `apps/web/public/hero-art/75-percent-default.svg` + provenance JSON sibling — top-down 75-layout silhouette with a steel-blue sparkline trend curve and focal accent dot at the peak (oklch 0.74 0.085 215). Two new tags added to `apps/web/src/content/tags.json` (trends-2026, qwertykeys). Frontmatter `mentionedParts` references four phase-20 product records (mode-sonnet, qk75, bakeneko65, mammoth75) so the article's Build sheet (renamed at 59f511a) populates with real cross-links. Updated `data/trends/2026-W19.json` so the "75% layout" tracker row's `articleSlug` points at `75-percent-default` — the editor's-note column on /trends/tracker now links to the new piece, draining the implicit "tracker rows lacking linked deep-dive" gap mentioned in iterate.md §A. The /trends pillar archive grows from 1 piece to 2 pieces; the row's data-sparsity symptom is closed for /trends specifically. Same root pattern remains across /news + /deep-dives + /ideas + /guides — those'll drain via subsequent iterate ticks shipping pillar-specific pieces.
- regression guard: `packages/content/src/__tests__/loaders/articles.test.ts` "reads the six seed articles" hard-count test relaxed to a `toBeGreaterThanOrEqual(6)` floor with a comment naming the 75-percent-default ship — future iterate ticks don't keep flipping the assertion. The new article passes the article schema (frontmatter validates), has a hero image (no `heroImage: null`), uses real `<PartReference>` slugs that resolve in the manifest, and ships with a `<Source>` tag for the Source Counts page.
- pass: 4 (commit b2692ac)
- viewport: both
- category: content
- observation: Trends pillar's "More Trends pieces" archive renders exactly one card (Alice fade) after the hero. The pillar reads as "tracker plus one supporting essay" — a thin slice for the project's signature pillar. /news, /ideas, /deep-dives likely fan into the same one-card archive given identical content depth. The b2692ac heading rename ("More" not "All") fixed the literal-falsehood; the underlying density is the next layer.
- evidence: Live /trends body: hero card `Reading the Trends Tracker`, then `Archive / More Trends pieces` with one card `The slow fade of Alice layouts` and nothing after. `apps/web/src/lib/data-runtime/manifest.generated.json` confirms only 2 trends-pillar articles exist.
- suggested fix: this is the data-sparsity finding adjacent to the open `/sources uniform "1 cite"` and `/trends/tracker single-row` rows — all three resolve once the **Real-data backfill** phase candidate (PHASE_CANDIDATES at f64f06e, score 8.0) ships its Phase A + B work plus 2-3 new Trends pieces. As an interim, collapse the "More Trends pieces" section header when count ≤ 1 and surface the tracker preview card in its place. Symmetric collapse rule for /news, /ideas, /deep-dives.

### [x] [MED] /article/building-mode-sonnet-with-oil-kings — "Mentioned in this article" lists 2 of 10 named parts
- addressed in: pending commit (this tick — iterate drain, interim path)
- issue: #6
- pass: 4 (commit b2692ac)
- viewport: both
- category: content
- observation: The "Mentioned in this article" index lists Mode Sonnet (board) and Gateron Oil King (switch). Body specifically names eight other parts the reader might want to look up: Staebies V3, GMK Striker R3, KAT Milkshake, Bakeneko65, Geon Frog, Endgame84, 205g0 lube, XHT-BDZ. The index promises a key reference and underdelivers, which makes the section feel decorative rather than functional.
- evidence: Build-details list mentions `Staebies V3` (mono span), `205g0`, `XHT-BDZ`, `GMK Striker R3`. Body comparisons: "Bakeneko65 I built last summer", "compared to a Geon Frog with Oil Kings". None appear under "Mentioned in this article" — only the front-matter `mentionedParts` slugs render.
- fix: shipped path (b) from the row's two-path menu — relabeled the section heading from "Mentioned in this article" → "Build sheet". Concrete edit at `apps/web/src/components/article/MentionedPartsRail.tsx:31`. The new heading matches the curated 2-item shape honestly without overpromising exhaustiveness against every part the body names; "Build sheet" is editorial and matches the bearings voice (knowledgeable peer talking about a build). Also reframed the component-level docblock to explain the rename and reference this critique row. The row also notes the deeper auto-extract path (parse `<PartReference>` + mono spans matching known part slugs) is phase-shaped — that stays as a future audit row. Reader's pass-5 confirmation that the same root pattern fires on /article/mode-sonnet-r2-group-buy-coverage is automatically resolved by the same rename: the rail is shared, so every article using it gets the new heading.
- regression guard: existing 2 MentionedPartsRail tests still pass without modification — neither asserted the heading text. The `data-testid="mentioned-parts-rail"` selector and the per-card content assertions are unchanged. A future tick that picks up the auto-extract phase will reverse the rename if/when the rail genuinely lists every named part.
- verify note: 255 e2e green on the fifth attempt; serial run via `--workers=1` passed 100% on the second try. Same intermittent React #418 hydration flake described in `plan/AUDIT.md:105` — flake frequency under parallel load has been increasing across recent ticks, the prediction that it would self-resolve before phase 16 has expired, and the flake is now meaningfully gating /iterate cycles. A separate /iterate tick (or a new audit row) should investigate the root cause; this is no longer a "wait it out" issue. Filing here as a verify-gate observation; the actual investigation is out of scope for this row's drain.

### [x] [LOW] / — Deep Dives long-reads card duplicates the by-pillar Deep Dives card
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 4 (commit b2692ac)
- viewport: desktop
- category: content
- root cause: same multi-surface independent-pick pattern as the e10a8b6 hero/by-pillar dedup — `<HomeDeepDivesRail>` filtered the unfiltered article list for `pillar === 'deep-dives'` and took the newest, while `<LatestByPillar>` separately picked the same article for its Deep Dives slot. Two surfaces, one slot deeper than the prior fix.
- fix: shipped exactly the row's recommended one-liner. (1) Added `excludeSlugs?: ReadonlySet<string>` prop to `<HomeDeepDivesRail>` (the rail filters incoming articles before sorting + capping). (2) At `apps/web/src/app/page.tsx`, called `resolveLatestByPillar(latestByPillar, undefined, heroExcludeSlugs)` to materialize the by-pillar picks once, built `longReadsExcludeSlugs = new Set(byPillarPicks.map(a => a.slug))`, and passed it to `<HomeDeepDivesRail>`. The rail now skips any article the by-pillar grid already surfaced — no card appears twice on the same screen. The default `max=3` still applies; the rail just falls through to the next-newest unselected deep-dive when the top one is already in the by-pillar grid.
- regression guard: new `<HomeDeepDivesRail>` test "excludes slugs in excludeSlugs (regression guard for /critique pass 4)" constructs three deep-dives, excludes the newest, and asserts the rail renders the remaining two in publishedAt-desc order without the excluded slug. Comment cites this critique row.

### [x] /tag/gateron — latest-first sort weights peripheral tag mentions above core articles
- addressed in: pending commit (this tick — iterate drain)
- issue: #21
- pass: 4 (commit b2692ac)
- viewport: both
- category: navigation
- observation: Tag page promises "4 articles tagged Gateron" but the top result is "Reading the Trends Tracker" — a methodology explainer that mentions Gateron only because Oil King is on the tracker that week. Sorting by latest puts a tangentially-tagged article above the two articles that are actually about Gateron switches.
- evidence: Header reads "#gateron / 4 articles tagged Gateron". First card: "Trends / Reading the Trends Tracker" (May 8). Second: "Ideas / Pairing Oil Kings with the Mode Sonnet" (May 7). Third: "Deep Dives / Why the Gateron Oil King sounds the way it does" (May 4) — the article most directly about the tag. Sort was `publishedAt desc` via `sortArticlesForArchive`.
- fix: shipped a third path beyond the row's two-option menu — title-match heuristic, the cheapest path to "primary topic" vs "secondary mention" without a frontmatter schema change. New `sortArticlesForTagArchive(articles, tag)` helper at `apps/web/src/components/pillar/PillarArchiveList.tsx:50-101`: partitions into title-match (case-insensitive substring match against the tag's `name`, the slug-with-hyphens, or the slug itself) vs title-no-match; sorts each tier by publishedAt desc with slug tie-break; returns title-matched first. Tag page at `apps/web/src/app/tag/[slug]/page.tsx:65` swapped from `sortArticlesForArchive` to `sortArticlesForTagArchive(getArticlesByTag(tag.slug), tag)`. Pillar archives keep the strict latest-first sort — only tag pages get the title-match boost since pillars don't have the "primary vs secondary" ambiguity (every article in a pillar IS about that pillar). For /tag/gateron specifically, the Gateron Oil King deep dive ("Why the Gateron Oil King sounds the way it does") now ranks above the trends-tracker article since "Gateron" appears in the title; the Oil King build piece moves up too because "Oil Kings" appears in its title.
- regression guard: 4 new `sortArticlesForTagArchive` tests cover (1) the canonical Gateron case — title-matched older article ranks above newer tracker piece; (2) within-tier publishedAt-desc + slug tie-break; (3) multi-word slug matching ("group-buy" tag matches "Group Buy" in title); (4) all-non-matching graceful fallback to publishedAt-desc. Existing 2 `sortArticlesForArchive` tests unchanged — pillar sort is untouched.
- verify note: 330 e2e green serially; first parallel run hit two #418 flakes on /deep-dives + /tag/ortho (audit row 105 / expand pass-2 candidate, separately tracked).
- source: browser

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

### [x] [MED] /sources — every cited article shows a uniform "1 cite" badge, reading as a placeholder
- addressed in: pending commit (this tick — iterate drain, interim path)
- issue: #5
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: data
- observation: The /sources page promises "honesty about where we got the facts" but every one of the six listed articles shows the same "1 cite" badge. Uniformity makes the count look stubbed rather than tallied. The page's value-add (which articles cite *more* sources) is invisible.
- evidence: Verified: every seed article ships with exactly one `<Source>` tag (one citation each across `alice-layout-decline`, `beginners-switch-buying-guide`, `building-mode-sonnet-with-oil-kings`, `gateron-oil-king-deep-dive`, `mode-sonnet-r2-group-buy-coverage`, `trends-tracker-preview`). The aggregate is technically correct; the visual signal is meaningless.
- fix: shipped the **interim** path from the row's suggested-fix menu — when every visible row has the same `sourceCount`, the badge swaps from "N cite/cites" to a count-free "Source linked" / "Sources linked" chip. Concrete edit at `apps/web/src/components/sources/SourceCounts.tsx`: compute `uniqueCounts = new Set(cited.map(r => r.sourceCount))` once at component-level; when `uniqueCounts.size === 1`, render the badge as `Source${uniformValue === 1 ? '' : 's'} linked` instead of `${sourceCount} cite${sourceCount === 1 ? '' : 's'}`. Tagged the badge with `data-uniform={true|false}` for test introspection. The page's value-add (which articles cite more sources) is still invisible while the corpus carries one citation per article — that's a corpus-depth problem, not a presentation problem — but the badge no longer reads as a placeholder. The structural fix (per-citation index per article, tracked separately at `plan/AUDIT.md`'s LOW row "/sources per-citation index") stays open as the long-term drain; this tick ships the interim copy fix.
- regression guard: rewrote the existing "renders cite count with correct singular/plural form" test to assert the non-uniform path explicitly via `data-uniform="false"`, then added two new tests: (a) "renders the count-free 'Source linked' chip when every visible row has the same sourceCount" — asserts every badge carries `data-uniform="true"`, text matches `^source linked$/i`, and the legacy "cite" copy is absent. (b) "uses the plural 'Sources linked' chip when uniform count is greater than 1" — asserts the plural form fires for sourceCount=3 across two rows. Three tests total cover the new branch contract; the seven existing tests on this component all still pass.

### [x] [MED] /trends/tracker — every category section renders exactly one row, so the table chrome dwarfs the data
- addressed in: pending commit (this tick — phase 19 ship)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: data
- observation: Each of the five movers tables (Switch / Keycap / Layout / Vendor / Brand) shows one row. The full Rank / Name / Score / 8-wk / Editor's-note column header reads as scaffolding wrapped around a single data point — the page promises "the signature feature" in its eyebrow and delivers a five-row total.
- evidence: Switch movers (ref_60): one row Gateron Oil King. Keycap movers (ref_74): MT3. Layout (ref_86): Alice. Vendor (ref_100): Mode Designs. Brand (ref_112): Wuque Studio. `data/trends/2026-W19.json` carries the same five rows. Related to the open [LOW] em-dash finding (the *cells* are em-dashes for unlinked rows; this finding is about the *table dimensions* feeling sparse).
- fix: shipped phase 19 (trends backfill) per `plan/phases/phase_19_trends_backfill.md`. Spawned the `scout` sub-agent to research 8 weeks of mechanical-keyboard movement (2026-W11 through 2026-W19); scout returned 15 rows total, exactly 3 per category. New rows added: HMX Cloud + Cherry MX2A revisions (switch); GMK CYL Prussian Alert + DCS Olivetti (keycap); Split/ergo (Voyager, Glove80) + 75% layout (layout); CannonKeys + Prototypist (vendor); Keychron + Cherry (GMK manufacturer) (brand). Each of the 5 category tables now reads as a real top-3 dashboard rather than table chrome wrapped around a single data point. The scout's 1-paragraph methodology + sources are preserved in the commit body for audit. New e2e in `apps/e2e/tests/trends.spec.ts` ("renders at least three rows in every category section after the phase 19 backfill") asserts ≥3 rows in every category section so a future row-pruning regression fails loud. The `apps/e2e/src/fixtures/page-reads.ts` `min-link-count` floor for `[data-testid="tracker-row"]` bumps from 1 to 15.

### [x] [MED] /about + /newsletter — voice mismatches between editorial pages ("we" vs "I")
- addressed in: pending commit (this tick)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 3 (commit 11c0777)
- viewport: both
- category: voice
- root cause: two coupled register slips. (1) `apps/web/src/components/newsletter/NewsletterArchive.tsx` empty state used first-person singular: `"Subscribe above and I'll send you the first one when it ships."`. (2) `apps/web/src/app/about/page.tsx` lede claimed `"Editorial standards, voice, and the people behind thock."` — a promise of a masthead the page never delivered. Reader hopped from impersonal "thock is" → "we" (in /about's "we do not currently have affiliate arrangements") → "I" (on /newsletter) across two adjacent surfaces.
- fix: shipped the cheapest path from the row's two-path menu — unified to first-person plural "we" across both surfaces. Concrete edits: (1) `NewsletterArchive.tsx` empty-state copy `I'll send you` → `we'll send you`. (2) `apps/web/src/app/about/page.tsx` `LEDE` constant: dropped the "people behind thock" claim (which would have required a masthead with editor names — the user has not authorized this) in favour of `"Editorial standards, voice, and how we cover the hobby. Knowledgeable peer, never breathless hype."` — same length, same eyebrow-shape, and now the lede promises only what the body delivers. Deferred the "better path" (named masthead + mailto:) since that needs user input on naming; surfaced as a `[needs-user-call]` candidate for `/oversight` rather than a unilateral edit.
- regression guard: no test assertions reference either string literal — the phase 15 brief at `plan/phases/phase_15_newsletter_rss.md:136` carries the original "I'll send you" copy as a point-in-time spec snapshot and is intentionally left alone. Subsequent voice slips will surface in the next /critique pass — the bias is now externally observable.

### [x] [LOW] /trends/tracker — linked rows expose two affordances pointing at the same URL
- addressed in: pending commit (this tick — phase 19 ship)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 3 (commit 11c0777)
- viewport: desktop
- category: visual
- observation: After the rows-not-links critique fix (commit `a7501af`) shipped, linked rows render the row name as a Link to the deep dive AND the editor's-note column as a Link to the same article. Tab order hits the same destination twice per linked row; mouse hover lights up two distinct affordances side-by-side that go to identical places.
- evidence: Gateron Oil King row: name link to `/article/gateron-oil-king-deep-dive` + editor's-note CTA "Why the Gateron Oil King sounds the way it does →" to the same URL. Same shape on the Alice row. `apps/web/src/components/tracker/TrackerRow.tsx` lines 44-53 render both Links unconditionally when `noteHref` resolves.
- fix: took the suggested-fix's "differentiate the editor's-note copy from the article title" path. Phase 19 added `note: z.string().min(20).max(280).nullable().optional()` to `TrendRowSchema` and a render branch in `TrackerRow.tsx`: when both `articleSlug` and `note` are set, the editor's-note column (and the mobile sub-link) render the `note` text instead of the article title. The row name still Links to the article, the editor's-note column still Links to the same article — but the two affordances now carry different copy ("go read the piece" vs "here's why I think this is moving"). Concrete proof: Gateron Oil King row name still links to `/article/gateron-oil-king-deep-dive`; the editor's-note column on the same row now reads "Mode Sonnet 2026 builds and r/mk sound tests put Oil Kings in the typing-test rotation; vendor stock turning over weekly at NK and CK." instead of duplicating the article title. Same shape on Alice. New TrackerRow unit test ("renders the editor's note as the linked text when both article and note are set") asserts the column Link's text is the `note`, AND that the article title does NOT render as link text — regression-locks the duplicate-link surface from coming back.

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


### [x] [MED] /group-buys — Mode Sonnet R2 is fictional; seed needs real vendor data (user jot)
- addressed in: pending commit (this tick — phase 18 ship)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: user-jot (commit e56989c)
- viewport: unspecified
- auth_state: anonymous
- category: content
- observation: Mode Sonnet R2 on https://thock-coral.vercel.app/group-buys is not present at cannonkeys. Can an agent actually populate with some valid groupbuys?
- evidence: user-spotted at 2026-05-09T18:58Z. Confirms: the seed at `data/group-buys/cannonkeys-mode-sonnet-r2.json` is fictional content from the phase-2 seed pass. The earlier `/jot` on this same record (commit 593b1f9) was about the dead vendor URL, drained at 9255abe by reframing the row as `status: announced` with the vendor homepage as the CTA — that fixed the 404 but didn't address the deeper concern that the *product* is made up.
- fix: shipped phase 18 (group-buys backfill) per `plan/phases/phase_18_group_buys_backfill.md`. Spawned the `scout` sub-agent against the six-vendor priority list (CannonKeys, NovelKeys, Mode Designs, Wuque Studio, KBDfans, GeekHack); scout HEAD-probed every candidate URL and returned 6 verified records: 5 live (CannonKeys Nyawice, KBDfans GMK CYL King of the Seas, KBDfans GMK CYL GREG 2, KBDfans GSK Sweet Nightmare, KBDfans GMK CYL Ishtar R2 — closing edge 2026-05-10) + 1 recently closed (Wuque Studio Paper80 x Whatever Studio, closed 2026-04-14). All 6 written to `data/group-buys/<slug>.json`; `data/group-buys/cannonkeys-mode-sonnet-r2.json` deleted via `git rm` per /oversight 2026-05-09 lock-in (delete, not archive). Two new vendor records (kbdfans, wuque-studio) written to `data/vendors/`. Manifest regenerated; the e2e min-row assertion at `apps/e2e/src/fixtures/page-reads.ts` and the `apps/e2e/tests/group-buys.spec.ts` "at least one row" test both bumped from 1 to 4 so future regressions in the data set fail loud. Scout's rejection list is preserved in the commit body for audit (NovelKeys + Mode Designs had no GB endpoints with verifiable absolute dates; GeekHack candidates were ICs not vendor-hosted GBs; the original brief's `/collections/group-buys` URL was 404 at CannonKeys — actual path is `/collections/group-buy` singular).
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


### [x] [LOW] /trends/tracker — every editor's-note cell is a uniform em dash
- addressed in: pending commit (this tick — phase 19 ship)
- issue: [mirror-skipped: token lacks repo:labels write — same 403 path as 4b8c793]
- pass: 2 (commit e270ced)
- viewport: desktop
- category: data
- observation: The desktop layout reserves a 1.4fr column on each tracker row for an editor's note (linking to a deep dive). Across all five categories every cell renders "—". The page advertises a dashboard but reads as a five-row stub waiting for content. This is the same root data gap as the [HIGH] above; filing separately because the right fix is a content backfill, not a code change.
- evidence: `data/trends/2026-W19.json` ships every row with `articleSlug: null`. `TrackerRow.tsx:64-73` renders an em dash whenever `noteHref` is null, and the desktop column has `text-text-4` styling that only emphasizes the emptiness when every cell shares it.
- fix: shipped exactly the suggested-fix's path. Phase 19 added the `note: z.string().min(20).max(280).nullable().optional()` schema additive in `packages/data/src/schemas/trend.ts`. `TrackerRow.tsx` got a new render branch: when `note` is set and no article resolves, the desktop editor's-note column renders the `note` as plain `<span>` text (no Link, no em dash). When `note` is set AND an article resolves, the `note` becomes the linked text. Every one of the 15 rows in the backfilled snapshot ships with a `note`, so the bare em dash no longer appears anywhere in the live tracker. Two new TrackerRow unit tests cover the "note + no article -> plain text" and "note + article -> linked note text" branches; the legacy "em dash when no article and no note" test still passes (regression-locks the fallback). Drains alongside the duplicate-link finding above — both were closed by the same `note` field.
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
