# Phase candidates

> Last pass: 2026-05-13 at commit f12c8e8
> Last oversight: 2026-05-11 at commit 7939291 — promoted all 4 pending candidates (a11y 6.5 → phase 26, trends archive 6.0 → phase 27, /tags 5.5 → phase 28, GB archive 5.5 → phase 29); filed new pending candidate [in-article inline visualizations] from user oversight feedback; moved /ship-content (phase 24) + cloud schedule (phase 25) rows to Promoted for hygiene.
> Pass count: 8
> Posture: bold
> Pass 8 notes: 20 commits since pass 7 (a3f5653). Cloud-mode pass — `/march` Step 3c fired after the content-gap queue exhausted itself a second time (deep-dives went 4→5→6→7→8 across `d9f23ae` / `e24508d` / `8d97d97` / `702b8a9` via the same cloud-march manual-refill pattern pass 7 documented as the operational stall). **Pillar-quota Rule-1 milestone reached at `702b8a9`** — all 5 pillars now at 8/8 (trends + news + ideas + guides + deep-dives), 40 articles total. The AUDIT.md content-gap bias header's auto-clearance condition ("corpus hits quota ≥8/pillar AND audit no longer surfaces content-gap rows scoring above 5.0") is functionally satisfied; the bias-removal edit itself is `/oversight` cleanup (or `/iterate` if reclassified mechanical). Otherwise no new phase-shaped signal: 20-commit window shipped 4 deep-dives content drains + 4 critique-row iterate drains (LOW pass-8 `/tag/<slug>` lede, MED pass-10 `/tag/modding` "topic" eyebrow, MED pass-7 aside-callout heading, LOW pass-9 pillar eyebrow slug rewrite) + 2 a11y bumps (text-text-3 → text-text-2, text-accent-mu → text-accent) + 1 publishedAt spread fix. No new spec/design drift; no entity adds under `data/`. **Pass 8 files 0 candidates** — the existing Pending [7.0] content-velocity queue auto-refill (pass 7) and [5.5] in-article inline visualizations (oversight 2026-05-11) both remain the right next promotions; the remaining unaddressed critique rows ([MED] `/tag/gmk` single article, [LOW] `cannonkeys-nyawice` W19 jargon leak, [LOW] `/group-buys` "0 announced" segment, [LOW] `/trends/tracker` "SIGNATURE" eyebrow, [LOW] `/trends` pillar card density, [LOW] `/trends/tracker` unlinked-rows cue) all stay iterate-shaped and below threshold.
> Pass 7 notes: 52 commits since pass 6 (aeaa808). Cloud-mode pass — `/expand` ran from `.github/workflows/march.yml` after Step 3b.5 found the content-gap queue empty. Window shipped 4 phases (26 a11y, 27 tracker archive, 28 /tags, 29 /group-buys/past) plus 8 autonomous content drains (6 guides + 1 deep-dives + 1 ideas) plus cloud-loop infra hardening (8675eb2 hourly cadence + 30/24h ceiling + Opus 4.7; 66ec5e7 analytics gate). The window's load-bearing signal is operational: the Rule-1 pillar-quota content-gap queue that phase 25 seed-primed exhausted itself on commit `a3f5653` (guides 8/8) with deep-dives still at 4/8 — no row in `plan/AUDIT.md` survives for the next `/ship-content` tick to drain, so the cloud loop fell through to `/expand` rather than continuing content velocity. `skills/ship-content.md` Step 8 ticks the resolved row but does not file the next-shortfall row. Pass 7 files 1 Pending candidate ([7.0] content-velocity queue auto-refill — the operational fix that unblocks continued autonomous content drain across the remaining 4 deep-dives shortfalls + future Rule-2/3/4 demand) and 1 Considered note ([5.5] /parts browse-landing surface — 18-record parts catalog now has no index; pattern mirrors phase 28 /tags + phase 29 /group-buys/past but signal lacks critique demand). Existing Pending [5.5] inline-visualizations row remains; pass-11 critique LOW/MED rows (W19 vocab, /tag/modding "TAG · MISC", aside-title-as-heading, eyebrow `pillar · NN of 05`, /trends/tracker unlinked-rows cue) all remain iterate-shaped — none scored above threshold.
> Pass 5 notes: 20 commits since pass 4. Pre-tick state: critique pass 10 fired (6 findings — 1 HIGH, 3 MED, 2 LOW); 4 of those drained in same-day ticks (lubing-101 copy bug, "Last 72h" kicker, home "0d" → "today", Sleeper-on-flat-row addressed in pass-9 drain). Massive signal at the top of the window: **user-directed /oversight 2026-05-10 locked the content-velocity directive in `bearings.md`** (pillar quota ≥8, tracker linkage 14d, group-buy companion, publishedAt gap-fill) + the AUDIT.md content-gaps bias. First content-velocity tick shipped immediately after at 4260294 (Trends piece "How Hall-effect quietly became the new mid-premium default", date-staggered to fill the 2026-04-10–2026-04-29 gap). Pass 5 files 1 new candidate ([6.5] /ship-content skill to codify the content-curator + brander + tags.json + verify-gate drain pattern that just proved out — the loop has 25+ content-gap rows to drain and the per-tick orchestration cost compounds) + 2 Considered-below-threshold notes (/schedule cloud cadence for weekly content runs — depends on /ship-content existing first; existing-corpus publishedAt restamp — iterate-shaped, 1 data-edit tick).
> Pass 3 notes: 14 commits since pass 2. Critique pass 7 fired and surfaced one architectural finding worth promoting (the streaming `<main>` landmark issue) plus four phantoms and a meta-observation about reader sub-agent text-extraction reliability. Pass 2's two candidates ([7.5] per-part pages, [6.5] #418 investigation) remain Pending; pass-1's ([6.5] a11y audit, [5.5] /tags index) also remain Pending. The /418 investigation gained partial diagnostic findings inline at the critique-row verify-note level (TZ ruled out, PageStub stale, Server-Component `new Date()` ruled out — remaining suspects are next/font race + Suspense streaming protocol). Pass 3 files 1 new candidate. Meta: pass-7's 4-of-6 phantom-finding rate revealed that reader sub-agent's accessibility-tree text extraction systematically drops link/code element content from prose AND elides adjacent short-text generic elements; future critique passes should default-verify visual-detail findings against rendered HTML before promoting to Pending. Documented in plan/CRITIQUE.md pass-7 self-assessment summary.
> Pass 2 notes: 38 commits since pass 1. Fresh signals — phase 18/19/20 real-data backfill landed (parts catalog grew substantially across switches / keycap-sets / boards / vendors) and the React #418 hydration flake originally predicted to self-resolve by phase 16 has not. Pass 2 files 2 candidates derived from those signals; the 2 pass-1 candidates ([6.5] a11y audit, [5.5] /tags index) remain Pending awaiting `/oversight`. The original promotion ([8.0] real-data backfill) shipped clean — phases 18–20 all `[x]`.

> Generated by `/expand`. Reviewed and promoted via
> `/oversight`. See `skills/expand.md` for the contract.

## Pending

### [score 7.0] Content-velocity queue auto-refill — make the Rule-1/2/3/4 content-gap queue self-replenishing
- proposed: 2026-05-12, expand pass 7
- source signals:
  - **Operational stall, observed live**: cloud `/march` tick (this run) found `plan/AUDIT.md` content-gap queue empty after the `4e62877` → `a3f5653` drain pair shipped guides article 8 of 8. Pillar counts now: trends 8/8, news 8/8, ideas 8/8, guides 8/8, **deep-dives 4/8** (4 articles short). Step 3b.5 of `/march` had no row ≥ 3.0 to dispatch — fell through to `/expand`.
  - **`skills/ship-content.md` Step 8 (lines 296–311)**: ticks the addressed row to `[x]` and appends the resolution commit, but emits no follow-up. The seed-prime in phase 25 was a one-shot — there is no "after-drain refill" hook. The skill assumes an external mechanism keeps the queue non-empty; no such mechanism exists.
  - **Pattern leakage beyond Rule 1**: critique pass 11 `[MED] /tag/gmk — single article` row (CRITIQUE.md L43) is a Rule-3 (group-buy companion) demand for the 3 live GMK CYL group buys that have no companion articles. That demand is not in the queue either; it's only noted as "self-fills as the loop ships those companions" — but the loop has no way to surface "ship those companions" without a content-gap row. Same gap mechanism, different rule.
  - **Cloud-loop cadence amplifies the cost**: `8675eb2` shipped hourly cadence + 30/24h ceiling. The cloud loop now has capacity to drain ~24 content rows/day if the queue were primed. With an empty queue, hourly ticks fall through to `/iterate` and produce small polish work instead of the content velocity the directive (`bearings.md` "Content velocity & editorial cadence") asks for.
  - **Bearings rule is the contract**: `bearings.md` "Content velocity & editorial cadence" locks all four rules (pillar quota ≥8, tracker linkage within 14d, group-buy companion, publishedAt gap-fill). The queue must reflect all four, not just Rule 1.
- rationale: this is a real operational gap revealed only by the cloud loop running long enough to exhaust its seed-primed queue. It is not a "should we ship more content" question — content velocity is locked by `bearings.md`. It is "the engine that decides what to ship next runs dry." Fix shape is small (skill amendment + a `computeContentGapShortfalls()` helper that surveys `data/` + `apps/web/src/content/articles/` + `data/trends/<week>.json` + `data/group-buys/*.json` against the four rules and returns the highest-priority shortfall). Cheap, impactful, blocking. The phase ships the mechanism; the queue refills itself thereafter.
- proposed scope: 1 phase, code + skill amendment + 1 verify-gate test.
  1. **New helper**: `scripts/content-gap-survey.mjs` (or a `@thock/content` exported function) that reads the four rules against current state and returns the top-N shortfalls scored by `impact × ease × bias-multiplier` per the AUDIT.md row template. Output is a JSON object `{ pillar?: string, rule: 1|2|3|4, score: number, suggestedTopic?: string, shortfall: string }[]`.
  2. **`skills/ship-content.md` Step 8 amendment**: after ticking the resolved row, invoke the helper; if any shortfall scores ≥ 3.0, write the next row into `plan/AUDIT.md` (same format as the phase-25 seed rows) in the same `audit:` follow-up commit. One row per drain — don't pre-fill the queue.
  3. **`skills/march.md` Step 3b.5 amendment**: when the queue is empty AND any pillar/rule shortfall scores ≥ 3.0, invoke the helper inline before falling through to expand. This is the safety net for cases where `/ship-content` exited without refilling (e.g. previous tick was an iterate, not a ship-content).
  4. **Verify gate**: one unit test in `packages/content/test/` (or `apps/web/test/`) that fakes a "4/8 deep-dives" state and asserts the helper returns a row with rule=1, pillar='deep-dives', score≥4.5. No new e2e needed — the bearings rules are the regression guard.
- estimated phases: 1
- conflicts: none. The `/march` and `/ship-content` amendments are additive; the existing `[x]` rows stay as audit-trail. `bearings.md` "Content velocity" is the durable rule the helper implements — not a new policy.
- promotion path: `/oversight` decides whether to (a) ship the helper as `scripts/` or as a `@thock/content` export, and (b) whether Rule 4 (gap-fill) should ever generate a *pillar-agnostic* row (any pillar still has room) or only fire as a tie-breaker between Rule-1 candidates. Recommend scripts/ + tie-breaker-only — keeps the helper minimal and the queue editorially coherent. Lock at brief time.

### [score 7.5] InlineViz retrofit — bring 2–3 viz to every existing article (Phase A shipped inline 2026-05-14)
- proposed: 2026-05-11, /oversight (user free-form). Re-scoped 2026-05-14 after Phase A shipped inline + bearings rule locked.
- Phase A status (shipped inline, no separate phase row needed):
  - `<InlineViz>` MDX component built and exported from `@thock/content/mdx`. Accent prop (named aliases `coral` / `amber` / `bronze` / `bordeaux` + raw CSS) maps to OKLCH tokens shared with hero-art.
  - Desktop float treatment + `_/-` step-shape connector arm + accent dot, layout math in `apps/web/src/styles/components.css` under `.thock-inline-viz`. Mobile reflows to column-bound inline block.
  - Bearings rule locked at the new `bearings.md` § "Inline-viz — 2–3 per article, no longer optional (locked 2026-05-14 via /oversight)".
  - `.claude/agents/content-curator.md` updated with the standing rule, the component API, the visual-language family, the no-fabrication discipline, and the provenance schema.
  - `.claude/agents/brander.md` updated to recognize `inline-viz` as a kind alongside `hero-art`.
  - Two articles validated end-to-end with 5 viz total: `acoustic-spec-rise` (3 coral viz) + `lubing-101` (2 amber viz). All on `main` at commits `5f42c92` (viz + component) through `fd320b2` (hero refactor).
- Phase B scope — retrofit the remaining 38 articles:
  - 40 articles total in `apps/web/src/content/articles/`. 2 already have viz (acoustic-spec-rise + lubing-101). 38 articles remain.
  - At 2–3 viz per article, the drain is 76–114 SVGs + 76–114 provenance JSONs + 38 MDX rewrites.
  - The work is iterate-shaped (one article per tick) but the volume is high enough that it benefits from being a tracked phase-level priority rather than scattered iterate ticks.
- source signals:
  - User free-form 2026-05-11: "articles (past and new) to include small visualizations ... must not be garbage or noise."
  - User 2026-05-14 after Phase A landed live on `acoustic-spec-rise` and `lubing-101`: "looks PERFECT. OK lock this in. and lets start with instructions for all future content to be BOLD above making data-viz in the formats we've established."
  - The bearings rule now says 2–3 per article is the baseline. The audit can flag any article missing it.
- proposed scope: 1 phase (the queue-drain mechanism) + iterate drain (the per-article work).
  1. **Add an audit row generator**: `scripts/inline-viz-survey.mjs` (or extend `scripts/content-gap-survey.mjs` from candidate 7.0) that surveys every article MDX for the count of `<InlineViz>` tags and files `[content][inline-viz][<slug>]` audit rows in `plan/AUDIT.md` for any article below 2.
  2. **Wire into `/iterate`**: rows scored ≥ 5.0 dispatch to the content-curator agent with a "retrofit this article — add 2–3 InlineViz pieces per the bearings rule" brief.
  3. **Drain rate**: 1 article/tick at the cloud hourly cadence → 38 articles in ~38 ticks ≈ 38 hours of continuous run, but realistically ~1–2 weeks given mixed-priority cloud schedule. Acceptable.
  4. **Verify gate**: existing `pnpm verify` covers the MDX compilation + SVG validity + e2e canonicals. No new test surface needed for the retrofit itself; the bearings rule is the regression guard for new articles.
- estimated phases: 1 (the survey + dispatch mechanism); the rest is iterate drain.
- conflicts: none. The component is shipped. The bearings rule is locked. The agents know the pattern. This phase is purely the orchestration to get the loop draining the backlog at hourly cadence.
- promotion path: `/oversight` decides (a) whether the survey lives as `scripts/` or as a `@thock/content` export (recommend `scripts/` — matches the candidate-7.0 content-gap-survey shape); (b) whether to interleave InlineViz retrofit rows with content-velocity Rule-1/2/3/4 rows or run them as a separate parallel queue (recommend separate queue — different bias, different priority); (c) the cutoff score for promotion to active drain (recommend 5.0 to start, raise as the backlog shrinks). Lock at brief time.

## Considered (below threshold)

- [score 5.5] `/parts` browse-landing index — discovery surface for the 18-record parts catalog (8 switches + 5 keycap-sets + 5 boards). Pattern mirrors phase 28 `/tags` (categorical-tinted grouping + sitemap + CollectionPage/ItemList JSON-LD) and phase 29 `/group-buys/past` (archive-list shape). Phase 21 shipped `/part/[kind]/[slug]` detail pages with no index entry point; readers can only land on a part page via a `MentionedParts` rail from inside an article. Filed Considered because the catalog signal alone (18 records, growing) is below the threshold without a corresponding critique row asking for discovery. Re-evaluate when (a) part records cross 25, OR (b) a critique pass flags "no entry point to browse switches/keycaps/boards." Iterate-shaped while signal stays single-source.
- [score 4.0] Editorial voice unification (`/about` "we" vs `/newsletter` "I"; `/group-buys` + `/` "Closing soon" / "ending soon" framing). Two critique findings cluster around editorial register mismatches. Drainable in ≤2 iterate ticks (one for the pronoun unify, one for the 72h-gate logic on the home widget + group-buys page). Iterate is the right shape, not a phase.
- [score 3.5] Home above-fold composition (`/` "By pillar" excludes Ideas + hero/by-pillar duplicate). Two MED critique findings on the same surface, both 1-line fixes (`HOME_PILLAR_SET.push('ideas')`, thread an `excludeSlugs` arg through `resolveLatestByPillar`). Iterate ticks own this.
- [score 3.0] Lighthouse CI runner. Already audit-flagged at MED 5.0 but explicitly blocked on `/oversight` runner choice (paid runner vs self-hosted). Not autonomously schedulable; not an `/expand` candidate.
- [score 2.5] Bundle tighten 250 → 200 KB. Already audit-flagged at LOW 2.5; cosmetic until a chunk audit runs. Iterate when other bundle work surfaces a real-savings target.
- [score 4.5] Tracker editorial discipline — direction-aware filtering across summary chrome (pass-4 expand). Pass-9 filed two MED findings clustering around "flat-direction rows surface in summary contexts where they shouldn't" (home Trending rail flat MT3 tile + /trends/tracker Sleeper card on a flat Wuque Studio row); pass-8 filed a [LOW] companion on /trends/tracker mover-table rows with no article having no visual cue distinguishing them from linked rows. All three are drainable in 1-2 iterate ticks: a `filterMoversForRail()` helper that excludes `direction === 'flat'` rows + a Sleeper-card empty-state when no qualifying row exists + a subtle "—" muted-CTA on unlinked rows. Component-level fix; not phase-shaped.
- [score 4.0] Brander output validation gate generalization — extend the 40b2e55 XML well-formedness test from `apps/web/public/{hero-art,group-buy-art}/` to all brander-emitted SVGs (OG family, social cards, wordmark variants). Add a brander-side post-render hook that runs the validity check before writing the file (catches the bug before commit, not after). The current test catches at `pnpm verify` time which is the right gate; generalization is iterate-shaped (extend `SVG_DIRS` array as new brander destinations emerge).
- [score 3.5] Editorial date-staggering across the article catalog — pass-9 filed [MED] / "By pillar" home tile dates all 2026-05-10. Drainable as a single data-side iterate tick that adjusts `publishedAt` across 5–10 article MDX frontmatter files to spread across the past 1–2 weeks. Defensive secondary fix (selector emits warning when ≥4 of 5 by-pillar dates collide) is a separate small iterate. Not phase-shaped.
- [score 7.0] Cloud `/schedule` cadence for weekly content runs — promoted to Pending this pass (pass 6) at score 7.0. Cloud loop operational status removes the "unproven infrastructure" risk that kept this at Considered 5.5.
- [score 5.0] Tag category 'topic' for modding/lubing/firmware (drains pass-10 [MED] /tag/modding "TAG · MISC") — could be either iterate-shaped (rename `misc` bucket label to `topic` — one-line palette change, ~3 file edits) or phase-shaped (add new `topic` category to the tag enum + reclassify 5–7 existing tags + ripple into tag-page palette + e2e). The cheap iterate path is enough to drain the critique row; the heavier phase is over-engineering for a [MED]. Pass 11 added one more signal (/tag/gmk low article count) but it self-fills via companion shipping — still below phase threshold.


## Promoted

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

