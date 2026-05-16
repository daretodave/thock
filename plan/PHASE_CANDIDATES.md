# Phase candidates

> Last pass: 2026-05-16 at commit 36d99cd
> Last oversight: 2026-05-16 — promoted both Pending candidates: [7.5] Trends Tracker Phase B → phase 31 (time-critical; W21 starts 2026-05-18), [6.5] A11y Phase B → phase 32 (stops the 21-commit text-text-3 iterate drip); added user-requested fun phase 33 ("Find your switch" interactive recommender). Pending now empty — next /expand repopulates. (Prior oversight 2026-05-11 at 7939291 — promoted phases 26–29.)
> Pass count: 13
> Posture: bold
> Pass 13 notes: 21 commits since pass 12 (fb0e3c3). Cloud-mode pass — content-gap-survey returned "all pillars comfortable" (5/5 pillars ≥8/8 in 30d window; first natural shortfall expected ~May 31 as oldest articles approach 30d boundary). Window's load-bearing events: phases 31–33 all shipped (Tracker Phase B automated snapshot cadence `f8006d1`, A11y Phase B PageSectionKicker + axe serious gate `f41cc25`, "Find your switch" quiz `faf99f5`); 7 additional a11y + test + content drains (#113 remaining text-text-3 `2e4d25c`, #114 PartIndexCard status badge `61c65c2`, #115 newsletter empty-state `aba950b`, #116 lubing-101 guideSection `ae5c111`, #117 TrackerSummaryGrid + TrackerCategorySection unit tests `3edaf73`). No spec drift, no design landings. Data: W21 snapshot pre-shipped (`f8006d1`); 48 total trend rows across 3 weeks (W19–W21), 15 with null articleSlug. **Pass 13 files 2 candidates** — (1) /parts root browse landing [6.0] upgraded from Considered 5.5: Phase 33 quiz creates a prominent home-page entry point routing users to /part/switch/[slug] detail pages; the /parts unified catalog landing completes the browse triangle; (2) Tracker Rule 2 linkage audit helper [5.5]: bearings.md Rule 2 requires article coverage within 14d of a trend's first appearance; W19's 3 null-articleSlug rows cross the 14d threshold 2026-05-18 (Monday) with no detection mechanism in place.
> Pass 11 notes: 7 commits since pass 10 (bac96d8). Cloud-mode pass — `/iterate` failure-mode 6 fired (no AUDIT.md Pending rows above 3.0; content-gap-survey returned "all pillars comfortable"). Window's load-bearing events: (1) A11y Phase B drain ran 3 more commits since pass 10 — `4dc57be` (GroupBuyRow kind/region/metadata + group-buys page summaries), `f58f97a` (/search label + result eyebrow + date), `067dbde` (Callout title + Caption + PullQuote attribution in MDX prose components). All 11 text-text-3→text-text-2 drains since Phase 26 shipped follow the identical pattern; 35 instances remain per grep (text-text-3 combined with text-micro or text-small across apps/web/src/ + packages/content/src/mdx/). TagChip category label carries `opacity-70` (packages/ui/src/TagChip.tsx:77) — a distinct mechanism from text-text-3 but same WCAG 1.4.3 failure class at 12px; not yet filed as an audit row. (2) `09c2f2d` fix(og,mdx): renderable og images + GFM tables landed — OG image rendering and MDX table support patched. (3) No spec drift, no new design exports, no new data entity types. **Pass 11 files 0 new candidates** — both Pending candidates ([7.5] Tracker Phase B, [5.5] A11y Phase B) remain valid with strengthened signal (see notes on each below); neither has been promoted or rejected. Tracker Phase B gains W21 gap urgency (data/trends has only W19 + W20; week 21 of 2026 is now open). A11y Phase B gains the TagChip opacity-70 dimension in its scope.
> Pass 10 notes: 20 commits since pass 9 (c0c4a06). Cloud-mode pass — `/march` Step 3c fired after content-gap-survey returned "all pillars comfortable." Window's load-bearing events: (1) Lighthouse CI shipped (`5926ac7`) — `.lighthouserc.json` + `.github/workflows/lighthouse.yml` wired via `treosh/lighthouse-ci-action@v12`, triggered on Vercel Preview deployment_status; AUDIT.md row #85 marked [x] in same expand commit. (2) A11y Phase B drain ran 8 commits in this window — text-text-3 → text-text-2 across byline, footer, attribution link, TrendingTile, rail headings, figcaptions, GroupBuysWidget kicker, TrackerTable/ArchiveStrip — all WCAG AA serious violations. (3) Stale Considered [3.0] Lighthouse CI removed (shipped). **Pass 10 files 1 candidate** — [5.5] A11y Phase B systematic completion sweep: 40+ remaining text-text-3 at text-micro/text-small remain across apps/web/src/{components,app}/ + packages/content/src/mdx/; clearing all in one coordinated commit (rather than ~7-10 more iterate ticks) would close WCAG 1.4.3 site-wide with batch regression guards. Tracker Phase B [7.5] remains the top Pending candidate, unchanged.
> Pass 9 notes: 37 commits since pass 8 (f12c8e8). Cloud-mode pass — `/march` Step 3c fired after content-gap-survey returned "all pillars comfortable" (all 5 pillars at 8/8 articles, first natural shortfall expected ~20 days). Window's load-bearing events: (1) Phase 30 shipped (`cc1b8ed`) — `scripts/content-gap-survey.mjs` now auto-refills the content queue; (2) InlineViz retrofit complete (`eb9d7f2`–`1c7e6e4`) — 40 articles × 2 SVG diagrams, bearings rule is write-time-only; (3) Domain cutover to `thock.xyz` (`fc970fb`) — `siteConfig.siteUrl` canonical, legacy `thock-coral.vercel.app` still resolves; (4) Vercel Speed Insights wired + Lighthouse CI path unblocked (AUDIT.md note: `workflows: write` permission grant in progress as of 2026-05-14 /oversight); (5) All pass-8 iterate-shaped critique rows drained: `/tag/gmk` self-resolved via companion shipping, W19 jargon + "0 announced" + "SIGNATURE" eyebrow + pillar card density + unlinked-rows all `[x]`. Stale Considered items pruned: [4.5] Tracker editorial discipline (all 3 sub-findings drained), [3.5] editorial date-staggering (drained at `a3f5653`), [5.0] tag-category topic (drained at `248ee57`), [7.0] cloud schedule (shipped as phase 25). **Pass 9 files 1 candidate** — [7.5] Tracker Phase B: weekly snapshot automation. The gate condition (Phase A shipped at `4d44b1a`) is now satisfied; the tracker route serves any `data/trends/YYYY-WNN.json` but only W19 and W20 exist, leaving the site's signature feature static. Remaining Considered items ([5.5] /parts browse-landing, [4.0] editorial voice unification, [3.5] home above-fold composition, [3.0] Lighthouse CI) unchanged below threshold.
> Pass 8 notes: 20 commits since pass 7 (a3f5653). Cloud-mode pass — `/march` Step 3c fired after the content-gap queue exhausted itself a second time (deep-dives went 4→5→6→7→8 across `d9f23ae` / `e24508d` / `8d97d97` / `702b8a9` via the same cloud-march manual-refill pattern pass 7 documented as the operational stall). **Pillar-quota Rule-1 milestone reached at `702b8a9`** — all 5 pillars now at 8/8 (trends + news + ideas + guides + deep-dives), 40 articles total. The AUDIT.md content-gap bias header's auto-clearance condition ("corpus hits quota ≥8/pillar AND audit no longer surfaces content-gap rows scoring above 5.0") is functionally satisfied; the bias-removal edit itself is `/oversight` cleanup (or `/iterate` if reclassified mechanical). Otherwise no new phase-shaped signal: 20-commit window shipped 4 deep-dives content drains + 4 critique-row iterate drains (LOW pass-8 `/tag/<slug>` lede, MED pass-10 `/tag/modding` "topic" eyebrow, MED pass-7 aside-callout heading, LOW pass-9 pillar eyebrow slug rewrite) + 2 a11y bumps (text-text-3 → text-text-2, text-accent-mu → text-accent) + 1 publishedAt spread fix. No new spec/design drift; no entity adds under `data/`. **Pass 8 files 0 candidates** — the existing Pending [7.0] content-velocity queue auto-refill (pass 7) and [5.5] in-article inline visualizations (oversight 2026-05-11) both remain the right next promotions; the remaining unaddressed critique rows ([MED] `/tag/gmk` single article, [LOW] `cannonkeys-nyawice` W19 jargon leak, [LOW] `/group-buys` "0 announced" segment, [LOW] `/trends/tracker` "SIGNATURE" eyebrow, [LOW] `/trends` pillar card density, [LOW] `/trends/tracker` unlinked-rows cue) all stay iterate-shaped and below threshold.
> Pass 7 notes: 52 commits since pass 6 (aeaa808). Cloud-mode pass — `/expand` ran from `.github/workflows/march.yml` after Step 3b.5 found the content-gap queue empty. Window shipped 4 phases (26 a11y, 27 tracker archive, 28 /tags, 29 /group-buys/past) plus 8 autonomous content drains (6 guides + 1 deep-dives + 1 ideas) plus cloud-loop infra hardening (8675eb2 hourly cadence + 30/24h ceiling + Opus 4.7; 66ec5e7 analytics gate). The window's load-bearing signal is operational: the Rule-1 pillar-quota content-gap queue that phase 25 seed-primed exhausted itself on commit `a3f5653` (guides 8/8) with deep-dives still at 4/8 — no row in `plan/AUDIT.md` survives for the next `/ship-content` tick to drain, so the cloud loop fell through to `/expand` rather than continuing content velocity. `skills/ship-content.md` Step 8 ticks the resolved row but does not file the next-shortfall row. Pass 7 files 1 Pending candidate ([7.0] content-velocity queue auto-refill — the operational fix that unblocks continued autonomous content drain across the remaining 4 deep-dives shortfalls + future Rule-2/3/4 demand) and 1 Considered note ([5.5] /parts browse-landing surface — 18-record parts catalog now has no index; pattern mirrors phase 28 /tags + phase 29 /group-buys/past but signal lacks critique demand). Existing Pending [5.5] inline-visualizations row remains; pass-11 critique LOW/MED rows (W19 vocab, /tag/modding "TAG · MISC", aside-title-as-heading, eyebrow `pillar · NN of 05`, /trends/tracker unlinked-rows cue) all remain iterate-shaped — none scored above threshold.
> Pass 5 notes: 20 commits since pass 4. Pre-tick state: critique pass 10 fired (6 findings — 1 HIGH, 3 MED, 2 LOW); 4 of those drained in same-day ticks (lubing-101 copy bug, "Last 72h" kicker, home "0d" → "today", Sleeper-on-flat-row addressed in pass-9 drain). Massive signal at the top of the window: **user-directed /oversight 2026-05-10 locked the content-velocity directive in `bearings.md`** (pillar quota ≥8, tracker linkage 14d, group-buy companion, publishedAt gap-fill) + the AUDIT.md content-gaps bias. First content-velocity tick shipped immediately after at 4260294 (Trends piece "How Hall-effect quietly became the new mid-premium default", date-staggered to fill the 2026-04-10–2026-04-29 gap). Pass 5 files 1 new candidate ([6.5] /ship-content skill to codify the content-curator + brander + tags.json + verify-gate drain pattern that just proved out — the loop has 25+ content-gap rows to drain and the per-tick orchestration cost compounds) + 2 Considered-below-threshold notes (/schedule cloud cadence for weekly content runs — depends on /ship-content existing first; existing-corpus publishedAt restamp — iterate-shaped, 1 data-edit tick).
> Pass 3 notes: 14 commits since pass 2. Critique pass 7 fired and surfaced one architectural finding worth promoting (the streaming `<main>` landmark issue) plus four phantoms and a meta-observation about reader sub-agent text-extraction reliability. Pass 2's two candidates ([7.5] per-part pages, [6.5] #418 investigation) remain Pending; pass-1's ([6.5] a11y audit, [5.5] /tags index) also remain Pending. The /418 investigation gained partial diagnostic findings inline at the critique-row verify-note level (TZ ruled out, PageStub stale, Server-Component `new Date()` ruled out — remaining suspects are next/font race + Suspense streaming protocol). Pass 3 files 1 new candidate. Meta: pass-7's 4-of-6 phantom-finding rate revealed that reader sub-agent's accessibility-tree text extraction systematically drops link/code element content from prose AND elides adjacent short-text generic elements; future critique passes should default-verify visual-detail findings against rendered HTML before promoting to Pending. Documented in plan/CRITIQUE.md pass-7 self-assessment summary.
> Pass 2 notes: 38 commits since pass 1. Fresh signals — phase 18/19/20 real-data backfill landed (parts catalog grew substantially across switches / keycap-sets / boards / vendors) and the React #418 hydration flake originally predicted to self-resolve by phase 16 has not. Pass 2 files 2 candidates derived from those signals; the 2 pass-1 candidates ([6.5] a11y audit, [5.5] /tags index) remain Pending awaiting `/oversight`. The original promotion ([8.0] real-data backfill) shipped clean — phases 18–20 all `[x]`.

> Generated by `/expand`. Reviewed and promoted via
> `/oversight`. See `skills/expand.md` for the contract.

## Pending

### [ ] [score 6.0] /parts root browse landing — unified catalog index for switches, keycap-sets, and boards
- proposed: 2026-05-16, expand pass 13 (upgraded from Considered 5.5 at pass 7)
- source signals:
  - **Phase 21 gap**: `/part/[kind]/[slug]` detail pages and `/part/[kind]` kind-index pages exist, but no `/parts` landing unifies the three kinds. Readers navigating from `/part/switch/gateron-oil-king` to `/part/board/...` have no path without going through articles.
  - **Phase 33 signal (new at pass 13)**: The "Find your switch" quiz ships a prominent home-page CTA (`→ /quiz/switch`) that routes users directly to `/part/switch/[slug]` result pages. This makes the parts catalog an active discovery surface for the first time — but quiz results only surface switches; a reader curious about boards or keycap-sets has no obvious next step.
  - **Pattern match**: Phase 28 (`/tags`), Phase 29 (`/group-buys/past`) both follow this exact pattern: existing detail/kind pages → add a top-level browse landing → closes the navigation triangle. CollectionPage + ItemList JSON-LD + sitemap entry.
- rationale: The original Considered threshold ("25+ records OR critique flags 'no entry point'") was set before Phase 33 existed. Phase 33 changes the context: the quiz actively routes readers to part detail pages from the home page — making /parts the natural "browse all catalog" complement to the quiz's "find one match" entry. A /parts landing with three categorical sections (Switches · Keycap sets · Boards) with record counts and kind-index links completes the navigation triangle (quiz → result → /parts → kind-index → detail) and gives readers an unprompted way to explore the full catalog.
- proposed scope (1 phase):
  1. New route `apps/web/src/app/parts/page.tsx` rendering three categorical sections with record counts and links to `/part/switch`, `/part/keycap-set`, `/part/board`. Thin wrapper — all data comes from existing loaders (`getAllSwitches()`, `getAllKeycapSets()`, `getAllBoards()`).
  2. CollectionPage + ItemList JSON-LD (3 top-level items, one per kind). BreadcrumbList: Home → Parts.
  3. Sitemap entry at changefreq monthly (grows with catalog); `canonical-urls` + `page-reads` fixtures extended.
  4. e2e: `apps/e2e/tests/parts.spec.ts` extends with /parts H1, three-section structure, kind-link hrefs, JSON-LD shape.
  5. One affordance: add "Browse all parts →" link on `/quiz/switch` results view (below the top-3 matches) so quiz users have a clear next step.
- estimated phases: 1
- conflicts: none — extends Phase 21 surfaces; URL `/parts` not in contract yet but follows established `/tags` → `/tag/[slug]` → `/tag/[slug]/page.tsx` pattern. No schema change.

### [ ] [score 5.5] Tracker Rule 2 linkage audit helper — auto-file content-gap rows for unlinked trend entries
- proposed: 2026-05-16, expand pass 13
- source signals:
  - **bearings.md Rule 2** (locked at /oversight 2026-05-10): "Any trend that enters the tracker should link to a dedicated thock.xyz article within 14 days of first appearance. If no article exists, the next /ship-content tick should produce one."
  - **Phase 31 gap**: Phase 31 shipped the Monday snapshot gate (writing a new `data/trends/YYYY-WNN.json` each week), but has no mechanism to detect when the 14-day window on a null-articleSlug row has expired, nor to file a content-gap row so /ship-content can drain it.
  - **Imminent deadline**: W19 was published 2026-05-04; the 14-day window closes 2026-05-18. W19 has 3 rows with null `articleSlug`. W20 (3 nulls) follows 2026-05-25. Without the helper, these Rule 2 gaps accumulate silently — the tracker promises linked deep-dives but delivers orphaned rows indefinitely.
  - **Pattern proven**: Phase 30 (`scripts/content-gap-survey.mjs`) is the exact template: scan a data dir, identify gaps against a bearings rule, file AUDIT.md rows in the `/ship-content`-compatible format. The same pattern applied to tracker linkage is a 1-phase lift.
- rationale: Rule 2 is a bearings contract — not advisory. Without enforcement, the tracker will accumulate unlinked rows as weekly snapshots add 12–18 rows and scout research doesn't reliably match every trend to an existing article. The helper closes the gap the same way Phase 30 closed the Rule 1 gap: mechanical scan → filed rows → /ship-content drain. The march.md Step 0.5 amendment (run the survey immediately after writing the Monday snapshot) ensures Rule 2 rows land in the queue the same tick the trend first appears — before the 14-day clock even starts, if the trend has no obvious article match.
- proposed scope (1 phase):
  1. `scripts/tracker-linkage-survey.mjs`: reads all `data/trends/*.json`, collects rows where `articleSlug` is null AND `publishedAt` is >14 days ago; groups by topic name; deduplicates if the same topic appears across multiple null weeks; emits AUDIT.md rows in the `category: content-gaps` format with `rule: Rule 2 — tracker linkage`. `--write` flag appends to `plan/AUDIT.md`; dry-run default.
  2. `skills/march.md` Step 0.5 amendment: after writing the Monday snapshot and running `pnpm verify`, call `node scripts/tracker-linkage-survey.mjs --write` and, if rows were filed, commit the `plan/AUDIT.md` update in the same audit-tick commit (same pattern as `content-gap-survey.mjs --write`).
  3. One unit test: mocked trends dir with a W19-shaped file (null-slug row, publishedAt 15 days ago) → survey returns 1 row with correct AUDIT.md template fields.
  4. `skills/march.md` Step 3b.5 note: tracker-linkage rows use the same `category: content-gaps` tag, so `/ship-content` drains them in the same lane as Rule 1 rows. No new skill, no new dispatch lane.
- estimated phases: 1
- conflicts: none — `scripts/tracker-linkage-survey.mjs` mirrors `content-gap-survey.mjs`; march.md Step 0.5 is an additive amendment; no schema change; no new routes.

<!-- archived on promotion 2026-05-16 — original Pending rows preserved below for the audit trail

### [ ] [score 7.5] Trends Tracker Phase B — automated weekly snapshot cadence
- proposed: 2026-05-14, expand pass 9; signal confirmed passes 11 + 12
- source signals:
  - **Build-plan gate passed**: Phase 27 (tracker archive, `4d44b1a`) explicitly deferred Phase B until Phase A shipped. Phase A has shipped.
  - **Data sparsity**: `data/trends/` has 2 records (W19, W20) against 40 editorial articles. The archive route (`/trends/tracker/[week]`) will serve any `YYYY-WNN.json` but no automation exists to add new weeks.
  - **Signature feature framing**: `bearings.md` calls the Trends Tracker the site's "signature feature." A tracker with 2 weeks of history is a demo; weekly automation makes it a live product.
- rationale: The Phase A archive surface proves the infrastructure (static params, week-nav, sparkline strip, CollectionPage JSON-LD per week). Phase B is the data-supply complement: a scout-driven weekly research pass that produces one new `data/trends/YYYY-WNN.json` record each Monday. Without it, the tracker stalls at W20 indefinitely. The march.md Monday-tick amendment is the lowest-friction path — the cloud loop already runs hourly; on the first Monday tick where the current ISO week has no snapshot, dispatch a scout pass then `ship-data`. The `generateStaticParams` call in `/trends/tracker/[week]/page.tsx` already returns all historical snapshots from `getAllTrendSnapshots()`; adding a new record auto-extends the archive without code changes.
- proposed scope (1 phase):
  1. `skills/march.md` Step 1 amendment: before the triage gate, check if today is Monday AND the current ISO week (`YYYY-WNN`) has no `data/trends/<week>.json`. If both: dispatch `/ship-snapshot` (new micro-skill below) instead of the normal march flow.
  2. New `skills/ship-snapshot.md` (or inline in march): spawn `scout` sub-agent with brief "research keyboard community signals for week `<YYYY-WNN>`: top switch/keycap/layout/vendor/brand movers on Reddit/GeekHack/vendor sales, direction up/down/flat, score −100 to 100". Scout returns a 12–18 row dataset following the `data/trends/<week>.json` schema. Main agent writes the record, runs `pnpm verify`, commits via `ship-data` conventions, pushes.
  3. Update `apps/web/src/app/trends/tracker/[week]/page.tsx` `generateStaticParams` — confirm it reads from `getAllTrendSnapshots()` (already does); `dynamicParams=false` stays correct (only statically-known weeks served).
  4. One unit test: `getAllTrendSnapshots()` with a mocked snapshot dir returns all weeks in ISO-week-descending order.
  5. Update `plan/steps/01_build_plan.md` Phase 27 row to record Phase B ship commit.
- estimated phases: 1
- conflicts: none — Phase 27 anticipated this; URL contract already covers `/trends/tracker/[week]`; `bearings.md` Rule 2 (tracker-linkage-14d) is the content-side complement of this data-side phase.
- pass 11 signal update: `data/trends/` still has only W19 + W20 as of 2026-05-15. ISO week 20 ran through 2026-05-17; week 21 starts 2026-05-18. The tracker will be one week stale within 3 days. No new opposing signals. Candidate remains highest-priority Pending item.
- pass 12 signal update (2026-05-16): **Urgency elevated.** ISO week 21 starts 2026-05-18 — 2 days from now. The tracker surface (`/trends/tracker` and its archive strip) remains frozen at W20 data after Monday. No new data records, no opposing signals. Phase B is now the single highest-leverage ship: without it, the site's signature feature stalls permanently after every week boundary. The scout → ship-data flow is proven (18 real-data backfill ticks in phases 18–20); Phase B reuses the same pattern with a weekly cadence gate.

### [ ] [score 6.5] A11y Phase B systematic completion — sweep all remaining text-text-3 at small text sizes + extract shared PageSectionKicker component
- proposed: 2026-05-14, expand pass 10; scope updated pass 12
- source signals:
  - **Commit pattern (pass 10)**: 8 consecutive commits all performing identical `text-text-3` → `text-text-2` substitution at 12-14px contexts (byline `d486ad5`, footer `9998ae5`, attribution `5753b7a`, TrendingTile `dc99bef`, rail headings `9f857d5`, GroupBuysWidget `9cc6048`, TrackerTable/ArchiveStrip `72119d8`, figcaptions `531937e`).
  - **Commit pattern (pass 11–12, 13 more drains)**: `28944f3` (PillarHero sublabel), `2b3c3cd` (ArticleCard compact), `66d6027` (part pages), `67f377a` (nav back-links), `38dc757` (/tags + MDX table th + /sources elements), `693110d` (misc tags + /tags Misc + /tag eyebrow), `9646f2a` (**TagChip opacity-70 — RESOLVED**), `ce3c537` (TrackerArchiveStrip), `dc5be05` (/sources heading), `be1221c` (SuggestedArticles). **21 consecutive a11y drain commits total since Phase 26 shipped.** Each drain opened a GitHub issue, ran verify, filed an audit tick.
  - **Remaining scope (confirmed pass 12)**: `grep -rn "text-text-3"` across `apps/web/src/{components,app}/` yields **16 remaining `text-micro|text-small` instances** (down from 35 per pass 11 — 13 drains resolved in passes 11+12 + TagChip resolved). 13 of 16 are IDENTICAL `<span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">` inline kicker spans in route-level page.tsx files: news, guides, trends, ideas, deep-dives, tracker (2 instances), tracker-archive, tracker-archive-not-found, group-buys, group-buys-past, tag, and home. The remaining 3 are in `ArticleCard.tsx:50` (image-placeholder fallback kicker), `NewsletterArchive.tsx:52` (issue-number span), `PageStub.tsx:51` (stub kicker — rarely visible).
  - **DRY signal (new, pass 12)**: The 13 identical route-level kicker spans are the same component written 13 times. A `<PageSectionKicker text="..." />` component (1 new file, 13 import replacements) would fix the WCAG class in one place and eliminate the duplication. Every future route requiring a section kicker would use the shared component, preventing WCAG regressions from new routes writing the old class.
  - **Expand signal A**: 3+ findings under same a11y category, proven mechanical fix → coordinated pass wins over iterate ticks.
- rationale: The iterate loop has drained 21 text-text-3 contexts correctly; 16 remain. The remaining 16 are concentrated in a single code pattern repeated inline across 13 route files. A Phase B sweep: (a) extracts `<PageSectionKicker>` eliminating 13 inline duplicates; (b) fixes the 3 standalone component instances; (c) closes WCAG 1.4.3 compliance site-wide; (d) adds batch regression guards by surface family. Score upgraded from 6.0 → 6.5 on DRY signal dimension (component extraction multiplies the impact of the a11y fix, and prevents recurrence from new routes copying the wrong class).
- proposed scope (1 phase):
  1. Create `apps/web/src/components/ui/PageSectionKicker.tsx` — renders `<span className="font-mono uppercase tracking-[0.12em] text-micro text-text-2 data-testid">` with a `text` prop; add `data-testid="page-section-kicker"`. Unit test in colocated `__tests__/PageSectionKicker.test.tsx`.
  2. Replace all 13 inline kicker spans in route-level page.tsx files with `<PageSectionKicker text="..." />`.
  3. Fix the 3 remaining standalone instances: `ArticleCard.tsx:50` (image-placeholder fallback), `NewsletterArchive.tsx:52` (issue-number span), `PageStub.tsx:51` (stub kicker). Apply `text-text-2` directly (no shared-component fit — different semantic shapes).
  4. Regression guards: `AxeBuilder.include('[data-testid="page-section-kicker"]')` on 2–3 representative pages (/, /news, /trends/tracker) + one guard each for the 3 standalone fixes. ~5–6 guards total, not 16.
  5. `pnpm verify` — single green gate confirms all.
- estimated phases: 1
- conflicts: none — extends Phase 26 a11y Phase B work; no new routes or schema changes. TagChip opacity-70 was resolved at `9646f2a` (pass 12 window) — removed from scope.

_(previous Pending items: [7.0] content-velocity queue auto-refill promoted to phase 30 via /oversight 2026-05-14; [7.5] InlineViz retrofit shipped 2026-05-14 across all 40 articles, bearings rule is now write-time-only.)_

-->

## Considered (below threshold)

- ~~[score 5.5] `/parts` browse-landing index~~ — **promoted to Pending [6.0] at pass 13** on Phase 33 quiz signal. See Pending above.
- [score 3.7] `/quiz` extension — keycap-set and board recommenders. Phase 33 ships switch recommender; the natural extension is parallel quizzes for keycap-sets (profile, material, legends) and boards (form factor, mounting style, budget). Data-gated: only 5 keycap-sets and 5 boards in catalog, too sparse for meaningful recommendations. Re-evaluate when catalog crosses 10 records per kind.
- [score 4.0] Editorial voice unification (`/about` "we" vs `/newsletter` "I"; `/group-buys` + `/` "Closing soon" / "ending soon" framing). Two critique findings cluster around editorial register mismatches. Drainable in ≤2 iterate ticks (one for the pronoun unify, one for the 72h-gate logic on the home widget + group-buys page). Iterate is the right shape, not a phase.
- [score 3.5] Home above-fold composition (`/` "By pillar" excludes Ideas + hero/by-pillar duplicate). Two MED critique findings on the same surface, both 1-line fixes (`HOME_PILLAR_SET.push('ideas')`, thread an `excludeSlugs` arg through `resolveLatestByPillar`). Iterate ticks own this.
- [score 4.0] Brander output validation gate generalization — extend the 40b2e55 XML well-formedness test from `apps/web/public/{hero-art,group-buy-art}/` to all brander-emitted SVGs (OG family, social cards, wordmark variants). Add a brander-side post-render hook that runs the validity check before writing the file (catches the bug before commit, not after). The current test catches at `pnpm verify` time which is the right gate; generalization is iterate-shaped (extend `SVG_DIRS` array as new brander destinations emerge).
- ~~[score 3.0] Lighthouse CI runner~~ — **shipped at `5926ac7`** (`.lighthouserc.json` + `.github/workflows/lighthouse.yml`; AUDIT.md row #85 marked [x]). Removing from Considered.
- ~~[score 4.5] Tracker editorial discipline~~ — **drained in pass-9 window** (flat MT3 tile `bb70360`, Sleeper card `bdc2082`, unlinked-rows cue `pending #87`). All three sub-findings are `[x]` in CRITIQUE.md. No remaining signal; removing from Considered.
- ~~[score 3.5] Editorial date-staggering~~ — **drained in pass-9 window** (`a3f5653` restamped four non-exempt articles; home rail now shows 5 distinct pillar-leader dates). Removing from Considered.
- ~~[score 5.0] Tag category 'topic' for modding/lubing/firmware~~ — **drained at `248ee57`** (added `CATEGORY_LABEL` display-map in `/tag/[slug]/page.tsx`, no schema migration; critique row [MED] /tag/modding `[x]`). Removing from Considered.
- ~~[score 7.0] Cloud `/schedule` cadence for weekly content runs~~ — **shipped as phase 25** (`1a26f56`). Stale note; removing.


## Promoted

### [score 7.5] Trends Tracker Phase B — automated weekly snapshot cadence
- promoted: 2026-05-16 via `/oversight` (this commit)
- assigned phase: **31**
- promotion decisions (locked at /oversight time):
  - **Time-critical**: ISO week 21 starts Mon 2026-05-18 (2 days from promotion). `data/trends/` holds only W19 + W20. Without Phase B the signature Trends Tracker freezes at W20 after Monday with no supply mechanism. Phase 31 is the next pending phase `/march` ships.
  - **Path locked — march.md Monday gate (not a standalone cron)**: amend `skills/march.md` Step 1 so that before the triage gate it checks `is-monday AND no data/trends/<current-ISO-week>.json`. If both, dispatch the snapshot flow inline instead of the normal march flow. This reuses the existing hourly cloud loop — no new GitHub workflow, no new secret, no `workflows: write` grant needed (the same constraint that blocked phase 25's redundant cron applies here).
  - **Snapshot flow**: spawn `scout` with the brief in the original candidate scope (research week's switch/keycap/layout/vendor/brand movers, direction + score −100..100, 12–18 rows). Main agent writes `data/trends/<YYYY-WNN>.json` to the existing schema, runs `pnpm verify`, commits + pushes via `ship-data` conventions. May live inline in march or as `skills/ship-snapshot.md` — implementer's call at brief time.
  - **No code-route change expected**: `/trends/tracker/[week]/page.tsx` `generateStaticParams` already reads `getAllTrendSnapshots()`; a new record auto-extends the archive + sitemap. Confirm, don't rebuild.
  - **Verify gate**: one unit test — `getAllTrendSnapshots()` over a mocked dir returns ISO-week-descending order. Update `plan/steps/01_build_plan.md` phase 27 row + phase 31 row with the ship commit.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warm via `/plan-a-phase phase 31`).
- original signals + scope: see the archived `## Pending` row (HTML-commented in this file on promotion). User answer at /oversight: "Promote as phase 31."
- estimated phases: 1
- conflicts: none — Phase 27 anticipated this; URL contract already covers `/trends/tracker/[week]`; complements `bearings.md` Rule 2.

### [score 6.5] A11y Phase B systematic completion — sweep remaining text-text-3 + extract PageSectionKicker
- promoted: 2026-05-16 via `/oversight` (this commit)
- assigned phase: **32**
- promotion decisions (locked at /oversight time):
  - **Why a phase, not more iterate ticks**: 21 consecutive single-instance `text-text-3` → `text-text-2` drains have shipped since Phase 26. 16 remain, 13 of them an identical inline kicker span across route `page.tsx` files. Continuing the drip costs ~13 more ticks and never extracts the duplication, so new routes keep reintroducing the bad class. A coordinated phase closes WCAG 1.4.3 site-wide in one commit and adds a shared component that prevents recurrence.
  - **Scope locked to the original candidate's 5-step proposed scope**: create `apps/web/src/components/ui/PageSectionKicker.tsx` (+ colocated unit test); replace the 13 inline kicker spans; fix the 3 standalone instances (`ArticleCard.tsx`, `NewsletterArchive.tsx`, `PageStub.tsx`) with `text-text-2` directly; ~5–6 axe regression guards by surface family (not 16); single `pnpm verify` green gate.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warm via `/plan-a-phase phase 32`).
- original signals + scope: see the archived `## Pending` row. User answer at /oversight: "Promote as phase 32."
- estimated phases: 1
- conflicts: none — extends Phase 26 a11y Phase B work; no new routes or schema changes.

### [score —] "Find your switch" interactive recommender — phase 33 (user-requested fun phase)
- promoted: 2026-05-16 via `/oversight` (this commit) — direct user request: "Anything fun we can add as phase 33?"
- assigned phase: **33**
- the fun, on-brand pick: thock is an editorial site about a tactile hobby with an 8+ record switch catalog (`data/switches/`) reachable only via in-article rails. A short interactive **switch recommender** turns the existing catalog into a playful entry point without new data, new assets, or external services.
- promotion decisions (locked at /oversight time):
  - **Route**: `apps/web/src/app/quiz/switch/page.tsx` (+ `loading.tsx` wrapping skeleton in `<main id="main">` per the phase-22 landmark contract). Client component for the interactive step state; the catalog is read at build time via the existing data-runtime loader (no client data fetch).
  - **Mechanic**: 4–5 single-select questions — sound profile (thock / clack / silent), actuation feel (linear / tactile / clicky), hand fatigue tolerance (light / medium / heavy spring), primary use (typing / gaming / mixed), budget tier (optional). Each answer applies weighted filters/scores over `getAllSwitches()`; results render the top 2–3 matches as cards linking to their existing `/part/switch/[slug]` pages (reuses phase 21 surfaces — no new detail pages).
  - **Pure + testable**: the scoring is a pure helper in its own `.ts` module (`recommendSwitch(answers, catalog)`) with its own unit tests (deterministic ranking; "all-tactile + heavy spring" → expected top result; empty/contradictory answers → graceful fallback ordering). Component split into small files (QuizStep, ResultCard, the page) per the build-plan style guardrails — no jam-packed single file.
  - **Discovery + SEO**: sitemap entry for `/quiz/switch`; canonical-urls + page-reads fixtures extended so the smoke walker covers it; `WebApplication` or `Quiz`-flavored JSON-LD (implementer picks the closest schema.org type at brief time). Add a small "Not sure where to start? Find your switch →" affordance somewhere honest (e.g. the future `/parts` index when it lands, or the switches-tag page) — keep it to one entry point, no nav-bar churn.
  - **e2e**: `apps/e2e/tests/quiz.spec.ts` — walk the quiz (answer each step, assert a result card with a `/part/switch/` href appears), assert no horizontal scroll at 375px, assert JSON-LD shape.
  - **No analytics special-casing**: page-level GTM already covers it; respects the existing `DISABLE_ANALYTICS=1` e2e gate.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warm via `/plan-a-phase phase 33`). Ships after 31 + 32 in phase order — it's the fun dessert, not a priority jump.
- estimated phases: 1
- conflicts: none — new route only, no schema change, reuses phase-21 part pages + existing switch data.

### [score 7.0] Content-velocity queue auto-refill — make the Rule-1/2/3/4 content-gap queue self-replenishing
- promoted: 2026-05-14 via `/oversight` (this commit)
- assigned phase: **30**
- promotion decisions (locked at /oversight time):
  - **Helper location**: ship at `scripts/content-gap-survey.mjs` (not `@thock/content` export). Keeps the surface minimal — the helper is operational tooling for skills, not application API.
  - **Rule 4 (gap-fill) scope**: fires only as tie-breaker between Rule-1 candidates, never as a pillar-agnostic standalone row. Keeps the queue editorially coherent — gap-fill is a scheduling preference, not a shipping reason on its own.
  - **Rule 1 algorithm**: sliding 30d window per pillar; comfortable (≥2) → no row; hot pursuit (=1) → score 7.0; critical hot pursuit (=0) → score 9.5. Pillar selection on multi-cold: oldest most-recent publishedAt → lowest window count → prominence (Trends > News > Ideas > Deep Dives > Guides). Window cutoff, floor, and score values are bearings constants; helper reads from a single named-constants block (mirrored from bearings.md § Rule 1).
  - **Skill amendments**: `skills/ship-content.md` Step 8 invokes the helper post-drain and writes the next row into `plan/AUDIT.md` in the same `audit:` follow-up commit (one row per drain — no pre-fill). `skills/march.md` Step 3b.5 invokes the helper inline on empty queue before falling through to `/expand`.
  - **Verify gate**: two unit tests — (a) "1 article in 30d, deep-dives" → rule=1 pillar='deep-dives' score=7.0; (b) "0 articles in 30d, news" → score=9.5 with critical-hot-pursuit framing.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase`.
- original signals + scope: see git history of this file at `ceefc38^` (pass-7 row); current bearings reframe makes Rule 1 algorithm sliding-window, fully captured in the promotion decisions above.

### [score 7.5] InlineViz retrofit — full-library pass (shipped 2026-05-14)
- promoted: 2026-05-14 inline (user-driven, no separate `/oversight` round). All 40 articles now carry 2 `<InlineViz>` each.
- shipped across five pillar commits on `main`:
  - deep-dives (8 articles, 16 viz) at `eb9d7f2`
  - guides (7, 14) at `ddd1c0e`
  - trends (7, 14) at `2eb8b3d`
  - ideas (8, 16) at `9a22c54`
  - news (8, 16) at `1c7e6e4`
- net: 80 hand-authored SVGs + 80 sibling `.svg.json` provenance files + 40 MDX rewrites. Component + bearings rule were locked Phase-A on 2026-05-14 before the drain (commits `5f42c92` through `fd320b2`); the retrofit drain itself ran in one contiguous session rather than the originally-proposed `/iterate` ticks.
- forward state: the bearings rule is **write-time only** going forward. There is no remaining backlog. New articles ship viz in the same commit via content-curator. No retrofit phase, no `scripts/inline-viz-survey.mjs`, no AUDIT-row drain needed — the bearings rule + content-curator brief is the regression guard.
- original candidate row + scope rationale: see git history of this file at `1c7e6e4^` for the proposal text (the original [7.5] row described an `/iterate`-shaped drain that turned out to be unnecessary once the work ran inline).

### [score 6.5] /ship-content skill — codify the content-velocity drain pattern
- promoted: 2026-05-11 via `/oversight` (this commit, hygiene cleanup — row originally tagged [PROMOTED] but left in `## Pending`)
- assigned phase: **24** (shipped at `8b49296`)
- promotion decisions (resolved at ship time): no /oversight calls; bearings rules resolved every promotion-time question. New skill at `skills/ship-content.md` codifies the 10-step content-velocity flow; `skills/march.md` Step 3b.5 + `skills/iterate.md` failure-mode 6 dispatch to it. See build-plan phase 24 row for shipped scope.

### [score 7.0] Cloud autonomous content schedule — `/loop /march` weekly cloud cron
- promoted: 2026-05-11 via `/oversight` (this commit, hygiene cleanup — row originally tagged [PROMOTED] but left in `## Pending`)
- assigned phase: **25** (shipped at `1a26f56`)
- promotion decisions (resolved at ship time): existing hourly cron already covers Monday 14:00 UTC; redundant cron entry would queue duplicate ticks in the march concurrency group. Instead, seed `plan/AUDIT.md` with Rule-1 content-gap rows so march Step 3b.5 dispatches `/ship-content` on every hourly tick. See build-plan phase 25 row for shipped scope.

### [score 6.5] Accessibility audit pass — discovery walker (Phase A only) — drains via /iterate (Phase B)
- promoted: 2026-05-11 via `/oversight` (this commit)
- assigned phase: **26**
- promotion decisions (locked at /oversight time):
  - **Phase A only as a phase row**: Phase B (drain) is *not* a separate phase — it's the natural iterate loop that consumes the `[a11y]` rows Phase A files. Same pattern as the content-velocity bias.
  - **Path lock (axe-core vs hand-checklist) deferred** to `/plan-a-phase phase 26` time. Recommend playwright-axe given playwright is already wired into `pnpm verify` (no devDep bloat — the axe-core npm dep is the only addition and it's <2MB). The hand-checklist work already ran inline at AUDIT row drain (commit `f70b1f3` + the [LOW] skip-link still open) and surfaced 2 findings; an automated regression-guard is what the next iteration earns. Final decision when the brief is drafted.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 26`).
- original signals + scope: see expand pass 1 candidate row (was in `## Pending`). Critique-row hook: PageStub keyboard-trap pre-emption, mobile-drawer focus-loop discovery, contrast against OKLCH tokens.

### [score 6.0] Trends Tracker multi-week archive surface — Phase A only
- promoted: 2026-05-11 via `/oversight` (this commit)
- assigned phase: **27**
- promotion decisions (locked at /oversight time):
  - **Phase A only as a phase row**: archive surface (`/trends/tracker/[week]`) ships autonomously. Phase B (recurring snapshot cadence) remains in `## Considered` until Phase A ships — the path lock between cloud `/schedule` cron (path a) vs `skills/march.md` amendment (path b) needs `/oversight` after the archive surface exists to test what the visible cadence feels like.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 27`).
- original signals + scope: see expand pass 4 candidate row (was in `## Pending`). Critique-row hooks: pass-9 [MED] Sleeper card on flat row, pass-9 [MED] Trending rail flat MT3 tile.

### [score 5.5] /tags index page — discovery surface + truthful back-link
- promoted: 2026-05-11 via `/oversight` (this commit)
- assigned phase: **28**
- promotion decisions (locked at /oversight time):
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 28`).
- original signals + scope: see expand pass 1 candidate row (was in `## Pending`). Critique-row hook: pass-2 MED `/tag/[slug]` "← all tags" mislabel (e270ced) drains in same commit as the new index ships.

### [score 5.5] Group-buy archive — `/group-buys/past` for closed buys
- promoted: 2026-05-11 via `/oversight` (this commit)
- assigned phase: **29**
- promotion decisions (locked at /oversight time):
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 29`).
- original signals + scope: see expand pass 6 candidate row (was in `## Pending`). Companion-article cross-references stay resolvable; same shape as phase 13 with a filter swap.

### [score 8.0] Real-data backfill — scout-driven seed expansion across vendors / switches / keycap-sets
- promoted: 2026-05-09 via `/oversight` (commit pending)
- assigned phases: **18 (group buys), 19 (trends + schema additive), 20 (switches / keycap-sets / boards)**
- promotion decisions (locked at /oversight time):
  - **Mode Sonnet R2 retirement**: **delete** `data/group-buys/cannonkeys-mode-sonnet-r2.json` once real seeds land (not archived to `_archive/`, not moved to fixtures). The article at `/article/mode-sonnet-r2-group-buy-coverage` stays as-is (the eac846a 2026-05-09 update callout already handles the timeline-mismatch tombstone framing).
  - **Promotion order**: contiguous 18 → 19 → 20. Phase 18 ships in autonomous `/march` mode; phases 19 + 20 follow once 18's pattern lands.
  - **Brief drafting**: phase 18 brief drafted inline as part of this oversight pass at `plan/phases/phase_18_group_buys_backfill.md`. Phases 19/20 briefs are drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase` once 18 ships).
- original signals + scope: see `## Pending` row above (moved here on promotion). Critique-row hooks: drains user-jot 40fefe2 (Mode Sonnet R2 fictional), pass-3 MED `/sources` "1 cite", pass-3 MED `/trends/tracker` single-row, pass-2 LOW `/trends/tracker` em-dash, and the data-sparsity signal across all 5 entity dirs.
- original proposed scope:
  1. **Phase 18 (was A) — group-buys backfill (scout-driven).** Scout researches active/announced group buys at CannonKeys, NovelKeys, Mode Designs, Wuque Studio, KBDfans, GeekHack aggregator. HEAD-probes URLs. Returns a candidate set with vendor/window/url/region. ship-data drops 4–6 new `data/group-buys/<vendor>-<slug>.json` records. Delete the fictional Mode Sonnet R2 record. Same phase: refresh `data/vendors/` if scout's candidate vendors aren't in the registry.
  2. **Phase 19 (was B) — trends backfill + schema additive.** Scout researches what's actually moving in the last 8 weeks (switch popularity, keycap-set GBs, layout adoption shifts). Add a `note: string?` field to the trends row schema in `packages/data`. Backfill `data/trends/2026-W19.json` to ≥3 rows per category. Render `note` plain-text in `TrackerRow` when slug is null. Drains the LOW em-dash + MED single-row + LOW duplicate-link findings simultaneously.
  3. **Phase 20 (was C) — switches / keycap-sets / boards backfill.** Scout researches: 6–8 currently-popular switches (real specs from manufacturer pages), 4–5 active keycap sets (profile, designer, status), 3–4 boards (the Mode-Sonnet-vs-Bakeneko-vs-Cycle7 archetypes). ship-data drops records. Updates ripple into `/sources` cite counts and `/by-pillar` densities.

### [score 7.5] Per-part pages `/part/[slug]` — turn the parts catalog into navigable surfaces
- promoted: 2026-05-10 via `/oversight` (this commit)
- assigned phase: **21**
- promotion decisions (locked at /oversight time):
  - **Route shape**: `/part/[kind]/[slug]` with `kind ∈ {switch, keycap-set, board}`. Three explicit kinds (not a single dynamic `[slug]`) so the URL is self-documenting and the loader doesn't need a kind-discovery step.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 21`).
- original signals + scope: see `## Pending` row that was moved here on promotion. Critique-row hooks: relaxes the pass-6 #15 stripped-chrome regression guard; surfaces the 13+ part records shipped in phases 18-20.
- original proposed scope:
  - New routes `apps/web/src/app/part/[kind]/[slug]/page.tsx` for `kind ∈ {switch, keycap-set, board}`. Render entity record's name, manufacturer, type spec, brief context, and a "mentioned in" rail showing every article whose `mentionedParts` lists this slug.
  - New e2e in `apps/e2e/tests/parts.spec.ts`: index walker over every part slug, status 200, JSON-LD shape, mentioned-in rail renders.
  - `MentionedPartsRail` items become anchors. The pass-6 #15 regression-guard test relaxes via a 1-line edit when the rail wraps in `<Link>`.
  - Sitemap entries; CollectionPage / Thing JSON-LD.

### [score 5.5] Streaming `<main>` landmark architectural call — Path (a) per-route `<main>` ownership
- promoted: 2026-05-10 via `/oversight` (this commit)
- assigned phase: **22**
- promotion decisions (locked at /oversight time):
  - **Path (a) locked**: move `<main>` from `apps/web/src/app/layout.tsx` to each route's `page.tsx`. Each `loading.tsx` also wraps its skeleton in `<main>`. Standard Next 15 + App Router pattern; preserves the per-route loading-skeleton UX while restoring SSR a11y-tree integrity.
  - **Why not Path (b)**: dropping `loading.tsx` files would lose the per-route perceived-speed win; restructuring per-route ownership has no downside trade-off in thock's footprint.
  - **Verify gate**: e2e adds `await expect(page.locator('main')).toHaveCount(1)` per canonical URL after the move. The smoke walker's existing `<h1>` assertion should be unaffected.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 22`).
- original signals + scope: see `## Pending` row that was moved here on promotion. Closes the [needs-user-call] [HIGH] CRITIQUE row #22 from pass 7 (now reclassified `[x]` with promotion pointer).

### [score 7.0] Group-buy hero art — schema additive + retrofit + durable shipping rule
- promoted: 2026-05-10 via `/oversight` (this commit, in response to user observation)
- assigned phase: **23**
- promotion decisions (locked at /oversight time):
  - **Mirror the article hero-art directive**: every group buy (current and future) gets a hero SVG generated by `brander`, stored under `apps/web/public/group-buy-art/<vendor>-<slug>.svg`, with a sibling `<vendor>-<slug>.svg.json` provenance file. The `bearings.md` "Article hero art" section gets a sibling subsection "Group-buy hero art" that codifies this as a durable rule (this commit ships that section update).
  - **Schema additive**: `packages/data/src/schemas/group-buy.ts` gets a `heroImage: string?` field (Zod additive, optional). The existing `imageUrl` field stays — that's vendor-supplied product imagery, not the loop-generated hero. `heroImage` is the loop's editorial illustration.
  - **Render surfaces**: `/group-buys` cards, home `<GroupBuysWidget>` rows, and any `<TrackerRow>` that tags a group buy. All three render `heroImage` if present; fall back to a coral-tinted placeholder block if absent (so a partial backfill doesn't leave broken-image holes).
  - **Backfill scope**: 6 existing records in `data/group-buys/` need hero art (cannonkeys-nyawice, kbdfans-gmk-cyl-greg-2, kbdfans-gmk-cyl-ishtar-r2, kbdfans-gmk-cyl-king-of-the-seas, kbdfans-gsk-sweet-nightmare, wuque-studio-paper80-whatever-studio). `brander` renders 6 SVGs; subject mapping per kind (board → keyboard outline; keycap-set → keycap profile silhouette; switch → switch cross-section if a future GB targets one).
  - **Going-forward rule**: `skills/ship-data.md` gets a one-liner amendment so any new group-buy record committed via `/ship-data` bundles a `brander` invocation in the same commit, with `heroImage` set in the JSON. This mirrors the article-hero rule from phases 5+ (content-curator + brander as one bundle). Phase 23 ships the amendment as part of the brief execution.
  - **Brief drafting**: drafted on-demand by `/ship-a-phase` (or pre-warmed by `/plan-a-phase phase 23`).
- source signal: user-spotted via `/oversight` 2026-05-10T14:18Z — "all group bys on /group-buys need to show an image" + "generate hero art per group by when they are added ALWAYS just like we do for other content (make this a rule in your shipping)".
- estimated phases: 1
- conflicts: none with `bearings.md` (extends the existing hero-art directive); none with the URL contract (no new routes); the schema additive is additive (nullable field, backwards-compatible).

## Rejected

### [score 6.5] React #418 hydration flake — dedicated investigation phase
- rejected: 2026-05-11 via `/oversight` (this commit) — **self-resolved**
- reason: pass-6 status update (commit `ec8d4c0`) recorded the flake had not been observed in 10+ consecutive parallel verify runs. Confirmed via /oversight: phase 16's PageStub-to-real-page replacement (`f3e5bac`) is the load-bearing fix — once every dynamic-data route had a real page (not the stub with its client/server-divergent state), the second hydration source the dfa5596 TZ patch couldn't reach went away. Serial-fallback mitigation is no longer the established per-tick pattern. The AUDIT.md row tracking this is cleared in the same commit.
- promotion path no longer needed: no investigation phase required.

