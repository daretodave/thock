# Phase candidates

> Last pass: 2026-05-15 at commit 8da10d3
> Last oversight: 2026-05-11 at commit 7939291 — promoted all 4 pending candidates (a11y 6.5 → phase 26, trends archive 6.0 → phase 27, /tags 5.5 → phase 28, GB archive 5.5 → phase 29); filed new pending candidate [in-article inline visualizations] from user oversight feedback; moved /ship-content (phase 24) + cloud schedule (phase 25) rows to Promoted for hygiene.
> Pass count: 11
> Posture: bold
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

### [ ] [score 7.5] Trends Tracker Phase B — automated weekly snapshot cadence
- proposed: 2026-05-14, expand pass 9; signal confirmed pass 11
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

### [ ] [score 6.0] A11y Phase B systematic completion — sweep all remaining text-text-3 at small text sizes + TagChip opacity site-wide
- proposed: 2026-05-14, expand pass 10; signal strengthened pass 11
- source signals:
  - **Commit pattern (pass 10)**: 8 consecutive commits all performing identical `text-text-3` → `text-text-2` substitution at 12-14px contexts (byline `d486ad5`, footer `9998ae5`, attribution `5753b7a`, TrendingTile `dc99bef`, rail headings `9f857d5`, GroupBuysWidget `9cc6048`, TrackerTable/ArchiveStrip `72119d8`, figcaptions `531937e`).
  - **Commit pattern (pass 11, 3 more drains)**: `4dc57be` (GroupBuyRow kind/region/metadata, group-buys page summaries), `f58f97a` (/search label + result eyebrow + date), `067dbde` (Callout + Caption + PullQuote MDX components). **11 consecutive `text-text-3`→`text-text-2` drains total since Phase 26 shipped.** Each drain opened a GitHub issue, ran verify, filed an audit tick — ~4h of loop time per fix when a batch sweep takes the same 4h total.
  - **Remaining scope (confirmed pass 11)**: `grep -rn "text-text-3"` across `apps/web/src/{components,app}/ + packages/content/src/mdx/` yields **35 remaining `text-micro|text-small` instances** — PillarHero article-count, PartSpec/PartHero spec keys and metadata, MentionedInArticles, SuggestedArticles, ArticleCard fallback, PageStub, plus multiple route pages (sources, tags, news, guides, trends, tracker, parts, not-found).
  - **TagChip opacity-70 signal (new, pass 11)**: `packages/ui/src/TagChip.tsx:77` — `<span data-testid="tag-chip-category" className="opacity-70">` — the category label (e.g. "tag · switch") applies 70% opacity over the chip's base text color. This is a distinct mechanism from `text-text-3` but the same WCAG 1.4.3 failure class at 12px. The Phase 26 discovery pass explicitly flagged it as "a separate future audit pass"; 11 Phase B drain ticks have never touched it. Natural scope addition for the batch sweep.
  - **Expand signal A**: 3+ findings under same a11y category, proven mechanical fix → coordinated pass wins over iterate ticks.
- rationale: The iterate loop is draining these correctly but at ~4h per fix (issue + verify + commit + audit tick). At 35 remaining `text-text-3` instances + the TagChip opacity scope, that's ~35-40 more iterate ticks consuming loop time that could serve higher-value work. The fix pattern is fully proven and mechanical. A systematic sweep: (a) closes WCAG 1.4.3 compliance site-wide in one phase; (b) adds batch regression guards by surface family (not one guard per line); (c) reviews the TagChip opacity in the same pass. Score upgraded from 5.5 → 6.0 on signal multiplicity (11 drains, TagChip dimension added).
- proposed scope (1 phase):
  1. Audit: grep all `text-text-3 + (text-micro|text-small)` combos across `apps/web/src/` + `packages/content/src/mdx/`. Annotate each with background context (standard dark bg vs prose-block surface). Separately: measure TagChip opacity-70 effective contrast by category color (`TINT_BY_CATEGORY` in `packages/ui/src/TagChip.tsx`) against `--thock-bg`.
  2. Fix: swap `text-text-3` → `text-text-2` at all confirmed WCAG-failing contexts. For TagChip: either drop opacity modifier (if `text-tag-*` tints pass at 100%) or bump to `opacity-90`. Document any intentional-muting exceptions.
  3. Regression guards: `data-testid` + `AxeBuilder.include()` per surface family — group by page/component, not per instance. 10-15 new guards, not 35.
  4. `pnpm verify` — single green gate confirms all fixes.
- estimated phases: 1
- conflicts: none — extends Phase 26 a11y Phase B work; no new routes or schema changes.

_(previous Pending items: [7.0] content-velocity queue auto-refill promoted to phase 30 via /oversight 2026-05-14; [7.5] InlineViz retrofit shipped 2026-05-14 across all 40 articles, bearings rule is now write-time-only.)_

## Considered (below threshold)

- [score 5.5] `/parts` browse-landing index — discovery surface for the 18-record parts catalog (8 switches + 5 keycap-sets + 5 boards). Pattern mirrors phase 28 `/tags` (categorical-tinted grouping + sitemap + CollectionPage/ItemList JSON-LD) and phase 29 `/group-buys/past` (archive-list shape). Phase 21 shipped `/part/[kind]/[slug]` detail pages with no index entry point; readers can only land on a part page via a `MentionedParts` rail from inside an article. Filed Considered because the catalog signal alone (18 records, growing) is below the threshold without a corresponding critique row asking for discovery. Re-evaluate when (a) part records cross 25, OR (b) a critique pass flags "no entry point to browse switches/keycaps/boards." Iterate-shaped while signal stays single-source.
- [score 4.0] Editorial voice unification (`/about` "we" vs `/newsletter` "I"; `/group-buys` + `/` "Closing soon" / "ending soon" framing). Two critique findings cluster around editorial register mismatches. Drainable in ≤2 iterate ticks (one for the pronoun unify, one for the 72h-gate logic on the home widget + group-buys page). Iterate is the right shape, not a phase.
- [score 3.5] Home above-fold composition (`/` "By pillar" excludes Ideas + hero/by-pillar duplicate). Two MED critique findings on the same surface, both 1-line fixes (`HOME_PILLAR_SET.push('ideas')`, thread an `excludeSlugs` arg through `resolveLatestByPillar`). Iterate ticks own this.
- [score 4.0] Brander output validation gate generalization — extend the 40b2e55 XML well-formedness test from `apps/web/public/{hero-art,group-buy-art}/` to all brander-emitted SVGs (OG family, social cards, wordmark variants). Add a brander-side post-render hook that runs the validity check before writing the file (catches the bug before commit, not after). The current test catches at `pnpm verify` time which is the right gate; generalization is iterate-shaped (extend `SVG_DIRS` array as new brander destinations emerge).
- ~~[score 3.0] Lighthouse CI runner~~ — **shipped at `5926ac7`** (`.lighthouserc.json` + `.github/workflows/lighthouse.yml`; AUDIT.md row #85 marked [x]). Removing from Considered.
- ~~[score 4.5] Tracker editorial discipline~~ — **drained in pass-9 window** (flat MT3 tile `bb70360`, Sleeper card `bdc2082`, unlinked-rows cue `pending #87`). All three sub-findings are `[x]` in CRITIQUE.md. No remaining signal; removing from Considered.
- ~~[score 3.5] Editorial date-staggering~~ — **drained in pass-9 window** (`a3f5653` restamped four non-exempt articles; home rail now shows 5 distinct pillar-leader dates). Removing from Considered.
- ~~[score 5.0] Tag category 'topic' for modding/lubing/firmware~~ — **drained at `248ee57`** (added `CATEGORY_LABEL` display-map in `/tag/[slug]/page.tsx`, no schema migration; critique row [MED] /tag/modding `[x]`). Removing from Considered.
- ~~[score 7.0] Cloud `/schedule` cadence for weekly content runs~~ — **shipped as phase 25** (`1a26f56`). Stale note; removing.


## Promoted

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

