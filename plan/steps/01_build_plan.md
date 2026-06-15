# 01 — Build plan

> Style guardrails for every phase below. Always ship unit tests
> alongside code — never "add tests later". Break work into small,
> focused components in folders; never jam-pack a single file. Pure
> helpers go in their own `.ts` modules with their own tests; React
> components live in folders with sub-section components and a
> colocated `__tests__/`. Prefer 5 small files with clear names
> over 1 dense file. The verify gate enforces this; reviewers and
> the next loop tick depend on it.

## Status (at-a-glance)

`/march`, `/ship-a-phase`, and (transitively) `/loop` read this
block to find the next phase. Format: `[ ]` pending → `[x]` shipped
(with commit hash). Tick in this file in the same commit that ships
the phase.

**Substrate (phases 1–4):**
- [x] Phase 1 — Monorepo bootstrap (root install, `apps/web` Next.js, `packages/tokens`, `packages/ui`, `packages/tsconfig`, `apps/e2e`, Netlify deploy verified) — `3ffa51c`
- [x] Phase 2 — `@thock/data` package (Zod schemas → JSON Schema, validate script, loaders for switches/keycap-sets/boards/vendors/group-buys/trends, 1 seed record per type) — `fdc3489`
- [x] Phase 3 — `@thock/content` package + seed articles (MDX loaders, frontmatter Zod, tags.json taxonomy, 6 seed articles across pillars, 3 seed group buys) — `21f153e`
- [x] Phase 4 — URL contract + hermetic e2e infrastructure (every route from bearings exists with stub or real page; `@thock/seo` with buildMetadata + JSON-LD + canonicalUrl + siteConfig; sitemap.xml; robots.txt; global + per-pillar RSS feeds; **`canonical-urls` fixture**; **`page-reads` fixture**; **smoke walker over every canonical URL**; **mobile spec template**; **`pnpm verify` runs e2e against `next start` on `:4173` as a hard gate**) — `fc1b0b0`
- [x] Phase 4b — Production runtime hotfix + content cleanup (P0; prepended via `/oversight` 2026-05-08 after phase 4 deployed and every dynamic route returned HTTP 500. Root cause: `@thock/data`'s `import.meta.url` + walk-for-`pnpm-workspace.yaml` didn't resolve in the bundled lambda. Shipped: pre-built data manifest under `apps/web/src/lib/data-runtime/manifest.generated.json` consumed by a thin adapter (all 15 apps/web call sites migrated); new `pnpm deploy:smoke` post-push gate; fabricated author bylines replaced with `thock`; host migrated from Netlify to Vercel after Netlify's free-tier credits ran out. All 10 production probes 2xx on `thock-coral.vercel.app`. **Detailed brief: `phase_4b_runtime_fix.md`.**) — `d0147cc` + `1b3944c`

**Page families (phases 5–13):**
- [x] Phase 5 — Article page (canonical template — `/article/[slug]`) — hero/byline/body/tag-rail/mentioned-parts/related-articles components, JSON-LD Article + BreadcrumbList, MDX render via `next-mdx-remote/rsc`, dep bumped to v6 to clear Vercel's vulnerability gate — `e41499c` + `15e6617`
- [x] Phase 6 — Home (`/` — hero pick, trending, latest-by-pillar, group-buys widget) — `f41bdeb`
- [x] Phase 7 — News pillar (`/news`) — `80a0290`
- [x] Phase 8 — Trends pillar + Trends Tracker (`/trends`, `/trends/tracker`) — `accb74f`
- [x] Phase 9 — Ideas & Builds pillar (`/ideas`) — `5597401`
- [x] Phase 10 — Deep Dives pillar (`/deep-dives`) — `cea650a`
- [x] Phase 11 — Guides pillar (`/guides`) — `dbb8323`
- [x] Phase 12 — Tag pages (`/tag/[slug]`) — `4612d9b`
- [x] Phase 13 — Group Buys (`/group-buys` + home widget retrofit) — `16380cd`

**Cross-cutting (phases 14–17):**
- [x] Phase 14 — Search (`/search` + header search affordance, MiniSearch index built at build time) — `aa46fed`
- [x] Phase 15 — Newsletter signup + RSS finalize (Buttondown embed at handle `thock`, `/newsletter` with empty-state archive, GTM `GTM-58T839ZD` wired via Next `<Script strategy="afterInteractive">`, handwritten RSS 2.0 validator + 6 e2e feeds, Footer retrofit drops the placeholder aria-label) — `5e46ae1` (brief) + `5fa4ee4` (ship)
- [x] Phase 15a — Loop issues mirror (inserted 2026-05-09 via /oversight: when `/iterate` picks a finding to ship, open a GitHub issue first; close via `Closes #N` commit trailer. Helper at `scripts/loop-issue.mjs`; updates to skills `iterate`, `jot`, `critique`, `triage`. Mirror at fix-time only — not at jot-time, no Projects v2 board. **Detailed brief: `phase_15a_loop_issues.md`.**) — `ee94d6c` (brief) + `a05b908` (ship)
- [x] Phase 16 — Polish (`/404` global root not-found, real `/about`, real `/sources`; OG family + mobile menu shipped earlier today via brand-asset drain + critique pass-1 drain; a11y audit, 404-soft for unknown article/tag slugs, and `/sources` per-citation index deferred as audit rows in `plan/AUDIT.md`) — `59d0db5` (brief) + `f3e5bac` (ship)
- [x] Phase 17 — Performance + meta (sitemap completeness e2e, per-family JSON-LD `@type` audit e2e, `pnpm size` script gating homepage gzipped JS at 250 KB, raw-`<img>` discipline gate; Lighthouse + 200 KB tighten deferred to audit rows) — `066f689` (brief) + `1f5b33c` (ship)

**Real-data backfill (phases 18–20, promoted via /oversight 2026-05-09 from PHASE_CANDIDATES expand pass 1 score 8.0):**
- [x] Phase 18 — Group buys backfill (scout researches active/announced group buys at CannonKeys, NovelKeys, Mode Designs, Wuque Studio, KBDfans; HEAD-probes vendor URLs; ship-data drops 4–6 records under `data/group-buys/<vendor>-<slug>.json`; **deletes** the fictional `cannonkeys-mode-sonnet-r2.json`; refreshes `data/vendors/` for any new vendors. Drains user-jot 40fefe2. **Detailed brief: `phase_18_group_buys_backfill.md`.**) — `e3dbac8`
- [x] Phase 19 — Trends backfill + schema additive (scout researches last-8-week movement; adds `note: string?` field to trends row schema in `packages/data`; backfills `data/trends/2026-W19.json` to ≥3 rows per category; renders `note` plain-text in `<TrackerRow>` when slug is null. Drains pass-3 MED single-row, pass-2 LOW em-dash, pass-3 LOW duplicate-link.) — `9a0d19e`
- [x] Phase 20 — Switches / keycap-sets / boards backfill (scout researches 6–8 popular switches, 4–5 keycap sets, 3–4 boards; ship-data drops records. Updates ripple into `/sources` cite counts and `/by-pillar` densities; resolves pass-3 MED `/sources` "1 cite" uniformity.) — `1f239c2`

**Promoted candidates (phases 21–23, promoted via /oversight 2026-05-10 from PHASE_CANDIDATES expand passes 2 + 3 + this oversight):**
- [x] Phase 21 — Per-part pages `/part/[kind]/[slug]` for `kind ∈ {switch, keycap-set, board}`. Render entity record's name, manufacturer, type spec, brief context, and a "mentioned in" rail showing every article whose `mentionedParts` lists this slug. New e2e in `apps/e2e/tests/parts.spec.ts` walks every part slug (200 + JSON-LD shape + mentioned-in rail). `MentionedPartsRail` items become anchors; the pass-6 #15 regression-guard relaxes naturally. Sitemap entries; CollectionPage / Thing JSON-LD. **Detailed brief: `phase_21_part_pages.md`.** — `18227b7` (brief) + `98749d1` (ship)
- [x] Phase 22 — Streaming `<main>` landmark restructure (Path a). Move `<main>` from `apps/web/src/app/layout.tsx` to each route's `page.tsx` (and each `loading.tsx` wraps its skeleton in `<main>`). e2e adds `body > main` count-one assertion per canonical URL. Closes the [HIGH] CRITIQUE row from pass 7 (`<main>` only contains the loading shell pre-hydration on every dynamic-data page). **Detailed brief: `phase_22_streaming_main.md`.** — `ec74801` (brief) + `b24be2f` (ship)
- [x] Phase 23 — Group-buy hero art (schema additive + retrofit + durable shipping rule). Mirror the article hero-art directive for group buys: schema additive (`heroImage: string?` on `packages/data/src/schemas/group-buy.ts`); 6 hero SVGs generated by `brander` under `apps/web/public/group-buy-art/<slug>.svg` (one per existing record); render surfaces on `/group-buys` cards and home `<GroupBuysWidget>`; `bearings.md` carries the "Group-buy hero art" durable rule (shipped at oversight `b5e98fa`); `skills/ship-data.md` Step 4a amendment so future group-buy adds bundle brander automatically. **Detailed brief: `phase_23_group_buy_hero_art.md`.** — `045f3e1` (brief) + `0efac31` (ship)

**Promoted candidates (phases 24–25, promoted via /oversight 2026-05-11 from PHASE_CANDIDATES expand passes 5 + 6 — cloud-loop content scaling decisions):**
- [x] Phase 24 — `/ship-content` skill (codify the content-curator + brander + tags.json + verify-gate drain pattern). New skill at `skills/ship-content.md` that bundles the proven content-velocity pattern as one autonomous flow: sync, read top content-gap audit row, verify it matches one of the 4 bearings rules, compute `publishedAt` via the rolling-30-day gap algorithm (with group-buy exemption), open GH issue, spawn `content-curator` + `brander` in parallel, validate + extend `tags.json` for missing tags (heuristic category pick from switch/layout/brand/material/profile/misc), `pnpm verify` with serial-fallback documented, commit + push with `Closes #N` trailer, `pnpm deploy:check` + `loop-issue.mjs close-comment`. Update `skills/march.md` Step 3 dispatcher: content-gap rows matching the bearings rules dispatch `/ship-content` instead of `/iterate`. Update `skills/iterate.md` failure-mode 6 to dispatch `/ship-content` when top finding is content-gap-shaped. No new e2e (the per-article verify gate is the regression guard). **Brief drafted on-demand by `/ship-a-phase`.** — `8b49296`
- [x] Phase 25 — Cloud autonomous content schedule (`/loop /march` on a weekly cloud cron, gates on phase 24). Extend `.github/workflows/march.yml` (or add `march-weekly.yml`) with a `cron: '0 14 * * 1'` trigger — Monday 14:00 UTC, off the existing every-2h scheduled window. The workflow fires `/loop /march` which now has `/ship-content` available as a dispatch target for content-gap rows. Falls through to `/iterate` or `/expand` if quotas are met. No new secrets; existing `CLAUDE_CODE_OAUTH_TOKEN` + `ACTIONS_PAT` + `VERCEL_TOKEN` cover it. The 12-commit/24h ceiling already bounds the cron's blast radius. Verify: at least one Monday cron tick lands a content commit or falls through cleanly. **Brief drafted on-demand by `/ship-a-phase`.** — `1a26f56`

**Promoted candidates (phases 26–29, promoted via /oversight 2026-05-11 from PHASE_CANDIDATES expand passes 1 + 4 + 6 — all four pending candidates promoted in score order):**
- [x] Phase 26 — Accessibility audit pass — Phase A discovery walker (score 6.5, pass-1 candidate). Ships `@axe-core/playwright` + `apps/e2e/tests/a11y.spec.ts` (7 canonical pages desktop + 3 mobile, WCAG 2.1 AA rules, Phase A: critical-only hard gate); skip-to-main-content link in `apps/web/src/app/layout.tsx` + `.skip-link` CSS in `globals.css`; `id="main"` on all 43 route `<main>` elements; `role="img"` on `Wordmark` outer span (drains aria-prohibited-attr). Phase A filed: color-contrast [a11y] AUDIT.md rows for text-text-3 / text-accent-mu at small sizes, link-in-text-block on /about. Phase B iterate loop drains those rows. **Brief: `phase_26_a11y_audit.md`.** — `7899462`
- [x] Phase 27 — Trends Tracker multi-week archive surface — Phase A only (score 6.0, pass-4 candidate). New route `apps/web/src/app/trends/tracker/[week]/page.tsx` rendering any `data/trends/<YYYY-WNN>.json`; `getAllTrendSnapshots()` loader; existing `/trends/tracker` "latest" view gains `← older weeks` affordance + sparkline strip showing last 4–8 weeks of category-direction signal. Sitemap entries; CollectionPage JSON-LD per week. e2e in `apps/e2e/tests/tracker-archive.spec.ts`. **Phase B (recurring snapshot cadence) remains in PHASE_CANDIDATES Considered until Phase A ships — path lock between cloud `/schedule` cron vs `skills/march.md` amendment deferred to that point.** Brief drafted on-demand by `/ship-a-phase`. — `4d44b1a`
- [x] Phase 28 — `/tags` index page (score 5.5, pass-1 candidate). New route `apps/web/src/app/tags/page.tsx` rendering every tag from `getAllTags()` grouped by the six categories (switch, layout, brand, material, profile, misc). Categorical-tinted heading per group; each chip links to `/tag/<slug>`. CollectionPage + BreadcrumbList + ItemList JSON-LD; sitemap entry. Updated `/tag/[slug]` back-link from `← home` → `← all tags` → `/tags` (drains CRITIQUE pass-2 truthfulness finding). New e2e in `apps/e2e/tests/tags.spec.ts`. Brief drafted on-demand. — `c83821e`
- [x] Phase 29 — Group-buy archive `/group-buys/past` (score 5.5, pass-6 candidate). New loader `getAllClosedGroupBuys()` returning records whose `endDate` is in the past, sorted desc. New route `apps/web/src/app/group-buys/past/page.tsx` rendering archive list with vendor, buy name, status pill (`CLOSED` / `SHIPPED`), close date. Small "view full archive →" affordance on `/group-buys` (under the "Just closed" rail). Sitemap entry + CollectionPage + BreadcrumbList + ItemList JSON-LD. e2e in `apps/e2e/tests/group-buys.spec.ts`. `relatedArticle` link deferred — schema field does not exist yet; a schema additive belongs to its own /ship-a-phase. Brief drafted on-demand. — `df17423`

**Promoted candidate (phase 30, promoted via /oversight 2026-05-14 from PHASE_CANDIDATES expand pass 7):**
- [x] Phase 30 — Content-velocity queue auto-refill (score 7.0, pass-7 candidate). Operational gap: when the `plan/AUDIT.md` content-gap queue drains, nothing files the next row, so the cloud loop falls through to `/iterate`/`/expand` instead of continuing content velocity. Ships `scripts/content-gap-survey.mjs` that surveys current state against `bearings.md` Rules 1-4 and returns the top-N shortfalls per the AUDIT.md row template. Rule 1 algorithm: sliding 30d window per pillar; comfortable (≥2) → no row; hot pursuit (=1) → score 7.0; critical hot pursuit (=0) → score 9.5. Multi-cold tie-break: oldest most-recent publishedAt → lowest window count → prominence (Trends > News > Ideas > Deep Dives > Guides). Rule 4 (gap-fill) fires only as tie-breaker between Rule-1 candidates, never as a pillar-agnostic standalone row. `skills/ship-content.md` Step 8 amendment invokes the helper post-drain and writes the next row into `plan/AUDIT.md` in the same `audit:` follow-up commit (one row per drain — no pre-fill). `skills/march.md` Step 3b.5 amendment invokes the helper inline on empty queue before falling through to expand. Two unit tests in `packages/content/test/` (or `apps/web/test/`): (a) "1 article in 30d, deep-dives" → rule=1 pillar='deep-dives' score=7.0; (b) "0 articles in 30d, news" → score=9.5 with critical-hot-pursuit framing. Bearings rule is the durable contract; the script implements it. **Brief drafted on-demand by `/ship-a-phase`.**

**Promoted candidates (phases 31–33, promoted via /oversight 2026-05-16 from PHASE_CANDIDATES expand passes 9 + 10 + this oversight):**
- [x] Phase 31 — Trends Tracker Phase B: automated weekly snapshot cadence (score 7.5, pass-9 candidate; **time-critical** — ISO week 21 starts 2026-05-18, `data/trends/` holds only W19+W20, the signature tracker freezes at W20 after Monday). Path locked at /oversight: amend `skills/march.md` Step 1 with a Monday gate (`is-monday AND no data/trends/<current-ISO-week>.json` → dispatch the snapshot flow inline) — reuses the hourly cloud loop, no new workflow/secret/`workflows:write` grant. Snapshot flow spawns `scout` (research week's switch/keycap/layout/vendor/brand movers, direction + score −100..100, 12–18 rows), writes `data/trends/<YYYY-WNN>.json` to the existing schema, `pnpm verify`, commits via `ship-data` conventions. `/trends/tracker/[week]/page.tsx` `generateStaticParams` already reads `getAllTrendSnapshots()` — confirm, don't rebuild; new record auto-extends archive + sitemap. One unit test (ISO-week-descending order over a mocked dir). **Brief: `phase_31_tracker_snapshot_cadence.md`.** — `f8006d1`
- [x] Phase 32 — A11y Phase B systematic completion (score 6.5, pass-10 candidate). Stops the 21-commit single-instance `text-text-3` → `text-text-2` iterate drip: 16 remain, 13 an identical inline kicker span across route `page.tsx` files. Create `apps/web/src/components/ui/PageSectionKicker.tsx` (+ colocated unit test) at `text-text-2`; replace the 13 inline spans; fix the 3 standalone instances (`ArticleCard.tsx`, `NewsletterArchive.tsx`, `PageStub.tsx`) directly; ~5–6 axe regression guards by surface family; single `pnpm verify` green gate. Closes WCAG 1.4.3 site-wide and prevents recurrence from new routes copying the bad class. Brief drafted on-demand by `/ship-a-phase`. — `f41cc25`
- [x] Phase 33 — "Find your switch" interactive recommender (user-requested fun phase). New route `apps/web/src/app/quiz/switch/page.tsx` (+ `loading.tsx` with `<main id="main">` per the phase-22 landmark contract). 4–5 single-select questions (sound profile, actuation feel, spring weight tolerance, primary use, optional budget) weighted-score over `getAllSwitches()`; top 2–3 matches link to existing `/part/switch/[slug]` pages (reuses phase 21 — no new detail pages). Scoring is a pure `recommendSwitch(answers, catalog)` helper in its own `.ts` module with unit tests; components split small (QuizStep / ResultCard / page) per the style guardrails. Sitemap + canonical-urls + page-reads extended; `WebApplication`/`Quiz` JSON-LD; one honest entry-point affordance (no nav churn). `apps/e2e/tests/quiz.spec.ts` walks the quiz + asserts a `/part/switch/` result + 375px no-scroll + JSON-LD. No schema change, no new assets, respects `DISABLE_ANALYTICS=1`. Ships after 31 + 32 in phase order. Brief drafted on-demand by `/ship-a-phase`. — `faf99f5`

**Promoted candidates (phases 34–35, promoted via /oversight 2026-05-21 from PHASE_CANDIDATES expand passes 13 + 14 — both [6.0] parts-surface candidates):**
- [x] Phase 34 — Parts catalog second data pass (score 6.0, pass-14 candidate). Scout researches 8–10 new switches across underrepresented segments (budget hall-effect, silent linear, light tactile, clicky, premium linear), 3–4 keycap-sets (SA, KAT/MT3, PBT doubleshot), 2–3 boards (75%, split, compact TKL); `/ship-data` drops records validated against existing schemas — no schema change, no route/component change. Data-runtime manifest rebuild ripples the new records into `/part/[kind]/[slug]`, the Phase 33 quiz (more result variety), and the Phase 35 `/parts` landing. Ships before 35 so the landing debuts against an enriched catalog. Brief drafted on-demand by `/ship-a-phase`. — `cf656ef`
- [x] Phase 35 — /parts root browse landing (score 6.0, pass-13 candidate). New route `apps/web/src/app/parts/page.tsx` rendering three categorical sections (Switches · Keycap sets · Boards) with record counts and links to `/part/switch` · `/part/keycap-set` · `/part/board` — thin wrapper over `getAllSwitches()` / `getAllKeycapSets()` / `getAllBoards()`. CollectionPage + ItemList + BreadcrumbList JSON-LD; sitemap entry; `canonical-urls` + `page-reads` fixtures extended; `apps/e2e/tests/parts.spec.ts` extended with /parts assertions. One affordance: "Browse all parts →" link on the `/quiz/switch` results view. Completes the discovery triangle (quiz → result → /parts → kind-index → detail). Brief drafted on-demand by `/ship-a-phase`. — `332ae7a`

**Promoted candidates (phases 36–37, promoted via /oversight 2026-05-23 from PHASE_CANDIDATES expand passes 24 + 14 — content-quality automation + cross-link schema additive):**
- [x] Phase 36 — Content language quality gate (score 4.5, pass-24 candidate, strengthened pass 25). Mechanical linter that catches static-MDX temporal anti-patterns at ship time, not at the next iterate audit. Pattern: 4+ consecutive copy-fix commits since 2026-05-21 (`75ad5a0` gmk-cyl-ramune approximate-dates, `f98048f` gmk-cyl-prussian-alert "we will revisit", `6fba00d` gmk-cyl-greg-2 same closer, `9055ece` building-mode-sonnet "report back", `0338e99` keychron-q-ultra-zmk temporal phrases) — same anti-pattern that bearings Rule 4 documents but doesn't enforce. Ships `scripts/article-language-check.mjs` with JSON-configurable forbidden-pattern list (`we will revisit`, `approximately [date]`, `the buy is live`, `check back`, etc.); CLI args scan named MDX files (gate mode) or `--write` to scan all of `apps/web/src/content/articles/` and append AUDIT rows. `skills/ship-content.md` Step 7 amendment: post-draft, pre-commit, run the checker on the new article; if violations, pass back to content-curator with revision brief and re-run once; hard-fail if violations persist. One Vitest unit test (positive + negative MDX strings). Optional one-time corpus scan in the ship commit. Brief drafted on-demand by `/ship-a-phase`. — `76edbc9`
- [x] Phase 37 — Group-buy relatedArticle schema additive (score 5.5, pass-14 candidate). Phase 29 explicitly deferred the `relatedArticle` field — schema additive belongs in its own /ship-a-phase. Companion articles now exist in corpus (cannonkeys-nyawice-group-buy, prussian-alert-group-buy, gmk-cyl-ramune-group-buy, etc.) so retrofit has real targets. Group-buy cards on `/group-buys` and `/group-buys/past` are editorial islands without a path to thock's coverage; this closes the gap. 5-step Phase-23-shaped lift: (1) `relatedArticle: z.string().optional()` on `packages/data/src/schemas/group-buy.ts` + regenerate JSON Schema; (2) retrofit existing `data/group-buys/*.json` records where a companion article exists (scan corpus); (3) render optional "Read our coverage →" link on `/group-buys` active cards + `/group-buys/past` archive rows (no layout change); (4) JSON-LD ItemList items carry `sameAs`/`relatedLink` when set; (5) `apps/e2e/tests/group-buys.spec.ts` asserts a "Read our coverage" link on at least one card where the field is set. Unblocks the Pending [5.5] Rule 3 companion survey (which becomes deterministic with this field instead of heuristic). Brief drafted on-demand by `/ship-a-phase`. — `fc17f19`

**Promoted candidates (phases 38–45, promoted via /oversight 2026-06-11 — automation suite to stop the cross-link drain, then three reader-facing surfaces from expand pass 124):**
- [x] Phase 38 — mentionedParts ship-time enforcement gate (score 6.5, pass-94 candidate). `scripts/article-parts-check.mjs` reads all `data/{switches,keycap-sets,boards}/*.json` entity names; flags entity names in a given article's prose absent from `mentionedParts` frontmatter (gate mode: named file, exit 1; `--json`). `skills/ship-content.md` Step 7b amendment: post-draft pre-commit gate, one content-curator revision retry, hard-fail on persistent violations (Phase-36 Step-7a shape). One-time corpus scan files AUDIT rows for residual gaps. Vitest unit tests (violation / no-violation / not-in-catalog control). Brief drafted on-demand by `/ship-a-phase`. — `e91eefc`
- [x] Phase 39 — Companion-article prose cross-link auditor (score 5.5, pass-119 candidate). `scripts/article-crosslink-survey.mjs`: for each article pair sharing ≥2 tags, checks for a markdown link to the sibling in either body; unlinked pairs file AUDIT rows (impact 5 same-pillar / 4 adjacent, ease 9). Dry-run default, `--write`, `--json`. `skills/march.md` Step 3b.5a + `skills/ship-content.md` Step 7c amendments run the survey automatically. One Vitest unit test (gap + control). Brief drafted on-demand. — `c2977a0`
- [x] Phase 40 — Group-buy Rule 3 companion survey (score 5.5, pass-15 candidate; deterministic since phase 37 shipped `relatedArticle`). `scripts/group-buy-companion-survey.mjs`: flags `status ∈ {live, announced}` records with no `relatedArticle`; files `content-gaps` rows (impact 7, ease 5). `skills/march.md` Step 3b.5a + `skills/ship-data.md` Step 4b amendments. One unit test. Brief drafted on-demand. — `fa8994e`
- [x] Phase 41 — Tracker Rule 2 linkage survey (score 5.5, pass-13 candidate). `scripts/tracker-linkage-survey.mjs`: collects trend rows with null `articleSlug` older than 14 days, dedupes by topic, files `content-gaps` rows tagged `rule: Rule 2`. `skills/march.md` Step 0.5 amendment runs it after the Monday snapshot. One unit test. Brief drafted on-demand. — `96cc87b`
- [x] Phase 42 — Stale group-buy status scanner (score 4.8, pass-16 candidate). `scripts/group-buy-status-check.mjs`: flags `status ∈ {live, announced}` with `endDate < today`; files `data` rows (impact 4, ease 9). `skills/march.md` Step 3b.5a + `skills/ship-data.md` Step 4c amendments. One unit test (stale + future-dated control). Brief drafted on-demand. — `48efcec`
- [x] Phase 43 — Article date archive `/archive` (score 6.5, pass-124 candidate; spec §5.3). Static route grouping `getAllArticles()` by `YYYY-MM` with month headings + counts; CollectionPage + BreadcrumbList JSON-LD; sitemap entry; `canonical-urls` + `page-reads` extended; e2e block; "Browse by date →" affordance on `/tags`. No schema change. Brief drafted on-demand. — `7536ca5`
- [x] Phase 44 — Switch comparison `/compare/switch` (score 6.5, pass-124 candidate; spec §13 Phase 3, 17 switches in catalog). Query-param shape `?a=<slug>&b=<slug>`; two-slot selector from `getAllSwitches()`; side-by-side spec table linking to `/part/switch/[slug]`; ItemList JSON-LD; sitemap entry for base route; fixtures + e2e extended; "Compare →" affordance on `/part/switch/[slug]`. Brief drafted on-demand. — `c99834b`
- [x] Phase 45 — Vendor index + detail `/vendors` + `/vendor/[slug]` (score 5.5, pass-124 candidate; 8 vendors in catalog, loaders exist). Index: name, countryCode, description, link. Detail: full description, vendor URL, active + past group-buys filtered by vendor, boards section; Organization JSON-LD with `sameAs`. `generateStaticParams` from `getAllVendors()`; sitemap; fixtures; `apps/e2e/tests/vendors.spec.ts`. No schema change. Brief drafted on-demand. — `4ed83e7`

**Promoted candidates (phases 46–49, promoted via /oversight 2026-06-14 — cross-link drain efficiency + both interactive surfaces + a discoverability phase to surface them):**
- [x] Phase 46 — Cross-link drain efficiency (score 6.0, pass-125 candidate). Make `/iterate` cluster-aware: when the top-scored finding is category `cross-links` for article X, drain ALL pending cross-link pairs touching X in one commit (collapses the ~52 surviving same-pillar `[4.5]` rows from ~52 ticks to ~15–20). Amend `skills/iterate.md` Step 3 + confirm/add `--slug` scoping on `scripts/article-crosslink-survey.mjs` + one Vitest unit test (3 X-rows + 1 Y-row → `--slug X` returns the 3) + `skills/march.md` Step 3b.5a note. Paired with the same-oversight AUDIT prune of 65 `[3.6]` adjacent-pillar rows. Ships first in this batch. No URL/schema change. Brief drafted on-demand by `/ship-a-phase`. — `073acf2`
- [x] Phase 47 — `/quiz/keycap-set` keycap-set recommender (score 5.5, pass-125 candidate; keycap-sets crossed 10 records). Mirrors phase-33 `/quiz/switch`: `apps/web/src/app/quiz/keycap-set/page.tsx` (+ `loading.tsx` with `<main id="main">`), 4–5 weighted questions over `getAllKeycapSets()` via a pure `recommendKeycapSet(answers, catalog)` helper with unit tests, ResultCard links to `/part/keycap-set/[slug]`, `WebApplication` JSON-LD, sitemap + `canonical-urls` + `page-reads` + `apps/e2e/tests/quiz.spec.ts` extended, `/quiz/keycap-set` in `bearings.md`. No schema change. Brief drafted on-demand. — `2e9b649`
- [ ] Phase 48 — `/compare/board` side-by-side comparison (score 4.5, pass-125 candidate; 9 boards). Mirrors phase-44 `/compare/switch`: `?a=&b=` query shape, `BoardCompareSelector` + `BoardCompareTable` (8 spec rows: layout, formFactor, mountingStyle, caseMaterial, pcbType, hotswap, priceUSD, released; diff rows elevated), dynamic `generateMetadata`, ItemList JSON-LD, sitemap + fixtures + `apps/e2e/tests/compare.spec.ts` extended, "Compare this board →" affordance on `/part/board/[slug]`, `/compare/board` in `bearings.md`. No schema change. Brief drafted on-demand.
- [ ] Phase 49 — Interactive-tools discoverability (score 6.0, **user-requested at this oversight**). User: the quiz + compare tools are "at the bottom of the site → make it more visible." Promote the four interactive tools (`/quiz/switch`, `/quiz/keycap-set`, `/compare/switch`, `/compare/board`) out of the footer into a first-class discovery surface — implementer picks the lowest-churn shape (header-nav entry, a home-page section, or a small `/tools` index landing); reuse existing nav/section components, no nav churn beyond one entry point. If a `/tools` route: full new-route contract (sitemap + fixtures + e2e + CollectionPage/ItemList JSON-LD + `bearings.md`); if nav/home-only: e2e asserts the entry point renders and all four links resolve. **Ships LAST** — needs 47 + 48 live first. Refine via `/plan-a-phase phase 49` or draft on-demand by `/ship-a-phase`.

> **Phases 46–49** (promoted 2026-06-14) are the next pending work —
> `/march` ships them in order: 46 first (it changes how the
> remaining cross-link queue drains), then 47 + 48 (the two
> interactive surfaces), then 49 (surfaces all four tools, so it
> needs 47 + 48 live). **After phase 49:** the loop returns to pure
> maintenance mode with the cross-link queue draining per-article.

> **Phases 38–45** (promoted 2026-06-11, all shipped) completed the next pending work —
> `/march` ships them in order. 38–42 complete the bearings-rule
> automation suite and stop the prose cross-link / mentionedParts
> drain that consumed ~40+ iterate commits across expand passes
> 94–124; 43–45 are the first new reader surfaces since `/parts`.
> **After phase 45:** the loop returns to pure maintenance mode
> (`/iterate` + `/ship-content` + Phase 31's Monday tracker
> snapshot), now with all four bearings content rules mechanically
> enforced. Same-commit ops fix at this oversight: Lighthouse CI
> runs against production `thock.xyz` were firing real GTM/GA
> page-views (~12 loads per push); `.lighthouserc.json` now blocks
> `googletagmanager.com` / `google-analytics.com` via
> `blockedUrlPatterns`.

> **Note on Netlify deploys before phase 1 ships:** auto-publishing
> stays on; deploys will fail until `apps/web/` exists. The deploy
> gate (`pnpm deploy:check`, run as Step 12 in every shipping
> skill) reports the failure clearly. Phase 1's first push trips
> it; the patch loop within phase 1 iterates to a green deploy.
> From phase 2 onward, a red `deploy:check` is a real regression
> requiring root-cause patching.

---

## Per-phase scope

Each row above corresponds to one phase. The detailed brief lives
at `plan/phases/phase_<N>_<topic>.md`. If a brief is missing when
the loop reaches its phase, the loop generates one from the scope
below + `phase_5_article.md` (canonical template) + any matching
`design/<family>/` export.

### Phase 1 — Monorepo bootstrap

Stand up the monorepo skeleton: root install works, `apps/web` is
a Next.js 15 app that renders a placeholder home page with header +
footer, `packages/tokens` exports the design-token CSS + TS,
`packages/ui` exports `<Wordmark>`, `<Mono>`, `<Container>`,
`packages/tsconfig` provides shared TS configs, `apps/e2e` runs a
single Playwright spec against the dev server. `pnpm verify` runs
clean. Push triggers a host build to thock-coral.vercel.app and
the deploy is green. **Detailed brief: `phase_1_bootstrap.md`.**

### Phase 2 — `@thock/data` package

`packages/data/` with Zod schemas for `switch`, `keycap-set`,
`board`, `vendor`, `group-buy`, `trend`. Generated JSON Schema
files at `data/schemas/`. Loaders (`getAllSwitches`, `getSwitchBySlug`,
etc.) with full unit tests. Validate script at `pnpm
--filter @thock/data validate` that walks `/data/` and validates
every JSON record + cross-references. Hook it into `pnpm verify`.
1 seed record per entity type so the loaders have something to
return. `data/README.md`, `data/BACKLOG.md` (empty), `data/AUDIT.md`
(empty).

### Phase 3 — `@thock/content` package + seed articles

`packages/content/` with `getAllArticles`, `getArticleBySlug`,
`getArticlesByPillar`, `getArticlesByTag`, `getAllTags`,
`getActiveGroupBuys`, `getRelatedArticles`. Frontmatter Zod schema.
Tag taxonomy in `apps/web/src/content/tags.json` (categories:
switch / layout / material / brand / profile / misc). 6 seed MDX
articles (one per pillar + one Trends Tracker preview). Custom MDX
component registry exported from `@thock/content/mdx`. Unit tests
for every loader. The home page from phase 1 is updated to render
a list of articles to prove the pipeline (full home page is
phase 6).

### Phase 4 — URL contract + hermetic e2e infrastructure

**Substrate this phase ships once and every later phase reuses.**

`@thock/seo` package: `buildMetadata`, `buildJsonLd`, `canonicalUrl`,
`siteConfig`. `apps/web/src/app/sitemap.ts` enumerating every route
from the URL contract. `app/robots.ts`. `app/feed.xml/route.ts`
(global RSS) and `app/feed/[pillar]/route.ts`. `<Header>` gets the
canonical pillar nav. Empty-but-valid pillar routes (each `/news`,
`/trends`, etc. returns a stub page with the right `<title>` so
sitemap + crawling work; full pillar UIs land in phases 7–11).
`app/opengraph-image.tsx` site-default OG image (used as fallback
when per-route OG isn't set).

**Hermetic e2e infrastructure (the test harness every later phase
inherits):**

- `apps/e2e/src/fixtures/canonical-urls.ts` — single source of
  truth listing every URL the site serves, derived programmatically
  from `@thock/content` + `@thock/data` (so every article slug,
  every tag slug, every active group buy gets included
  automatically). The sitemap and the smoke walker both consume
  this fixture.
- `apps/e2e/src/fixtures/page-reads.ts` — a typed map keyed by URL
  pattern (e.g. `/article/[slug]`) declaring what each page family
  fetches and asserts (e.g. "renders H1, ≥1 tag chip, footer; no
  console errors; no horizontal scroll at 375px"). Each later
  page-family phase appends its entry; phase 4 ships the type and
  the article + home + pillar entries (filled out as those phases
  ship — phase 4 ships the empty registry + types).
- `apps/e2e/tests/smoke.spec.ts` — walks every entry in
  `canonical-urls.ts`, asserts the response is 200 + valid HTML +
  no console errors. Target: full walk in under 60s. Runs against
  `next start` on `:4173` (hermetic — the production build, no
  external network).
- `apps/e2e/tests/mobile/smoke.mobile.spec.ts` — same walk at
  375×800 viewport asserting `scrollWidth - innerWidth ≤ 1` per
  page.
- `apps/e2e/playwright.config.ts` — `webServer` boots
  `pnpm --filter @thock/web build && pnpm --filter @thock/web start
  -p 4173` and waits for the port; `webServer.reuseExistingServer:
  !CI`. Hermetic by design.
- `pnpm verify` runs `typecheck → test:run → data:validate → build
  → e2e`. **E2E is a hard gate** — a red e2e is a blocked push.
  No `--no-verify`, no skipping.

After phase 4, every page-family phase (5–13) ships its own
`page-reads` entry + a per-family e2e spec; the smoke walker
catches everything else for free.

### Phase 4b — Production runtime hotfix + content cleanup

Prepended via `/oversight` 2026-05-08 after phase 4 deployed.
The deploy went green but every dynamic route on the live site
(`/article/[slug]`, `/tag/[slug]`, `/sitemap.xml`, `/feed.xml`,
`/feed/[pillar].xml`) returned HTTP 500. Root cause: the
`@thock/data` loader uses `import.meta.url` to walk up to
`pnpm-workspace.yaml`, which doesn't resolve in Netlify's
bundled lambda. The local `pnpm verify` passed because the e2e
harness runs against `next start` with the full repo on disk;
production runs in an isolated function. Phase 4b ships: (1) a
loader fix that works in any runtime — recommended path is
pre-built manifests under `apps/web/.thock-data/` consumed by
the loaders; (2) a new `pnpm deploy:smoke` post-push gate that
hits one URL per pattern against `https://thock-coral.vercel.app`
and exits non-zero on any non-2xx, closing the gap that let
the regression through; (3) replacement of fabricated author
bylines (`Mara Lin`, `Reza Patel`, `Tess Aoyama`) with
`thock` across all 6 seed articles per user directive.
**Detailed brief: `phase_4b_runtime_fix.md`.**

### Phase 5 — Article page (canonical template)

`/article/[slug]` — the entity hub for editorial content. Hero with
big image, eyebrow (pillar name as link), H1, lede, byline +
read-time. Body renders MDX via `@thock/content/mdx` registry. Tag
rail. "Mentioned in this article" rail (parts referenced via
frontmatter or inline `<PartReference>`). Related articles rail
(same pillar or shared tags). JSON-LD `Article`. **This is the
structural template every later page family copies.** Detailed
brief: `phase_5_article.md`.

### Phase 6 — Home

`/` — hero pick (`featured: true` article, falls back to newest),
trending row (top 5 by recent + a `popularityScore` from
frontmatter), latest by each pillar (one row per pillar with 3–4
cards), group-buys-ending-soon widget (top 3 by `endDate`).
Newsletter CTA in footer (signup form is phase 15; phase 6 ships
an inert form pointing at `/newsletter`).

### Phase 7 — News pillar

`/news` — pillar landing. Hero card + large cards + row cards
cascade per `bearings.md`. Sort: newest first. JSON-LD:
`CollectionPage`. Header nav highlights the current pillar.

### Phase 8 — Trends pillar + Trends Tracker

`/trends` — same pillar template as news. Plus `/trends/tracker` —
the **signature** Trends Tracker dashboard. Tracker rows: name,
category (switch / keycap / layout / vendor / brand), direction
glyph (up / down / flat), week score, sparkline. Data source:
`data/trends/<YYYY-WW>.json` via `@thock/data`. Each row links to
the trend's deep-dive article if linked. Empty rows render with
"early data" muted styling.

### Phase 9 — Ideas & Builds pillar

`/ideas` — pillar template. "Build of the week" featured slot at
top (picks article tagged `build-of-the-week` with most recent
`publishedAt`). Otherwise standard cascade.

### Phase 10 — Deep Dives pillar

`/deep-dives` — pillar template. Read-time displayed prominently
(audience expects long-form). Sort by length descending as a v1
default — most ambitious deep dives surface first.

### Phase 11 — Guides pillar

`/guides` — pillar template. Sectioned by `guideSection`
frontmatter (firmware, modding, switches, keycaps). Sort by
`updatedAt` desc within each section so freshness signals are
honest.

### Phase 12 — Tag pages

`/tag/[slug]` — every tag in `tags.json` gets a page. Shows tag
name + category-tinted chip, count, article list. Cross-link
retrofit: every `<TagChip>` everywhere is now clickable. JSON-LD:
`CollectionPage`.

### Phase 13 — Group Buys

`/group-buys` — index of active group buys (sorted by `endDate`
asc). Each card: image, vendor, dates, region, external link with
`rel="sponsored noopener"`. Cross-link retrofit: home page
group-buys widget verifies it reads from the same `@thock/data`
loader (no duplication).

### Phase 14 — Search

`/search` — title + body + tag search powered by a MiniSearch index
built at build time. Header gets a search affordance (icon → modal
or `/search` route — pick whichever is simpler). Index registers in
`@thock/content/search`.

### Phase 15 — Newsletter signup + RSS finalize

Replace the inert footer form from phase 6 with a Buttondown embed.
Dedicated `/newsletter` page with archive of past digests (read
from `apps/web/src/content/newsletters/*.mdx` if any exist;
otherwise empty state). Per-pillar RSS feeds finalized — every
`/feed/<pillar>.xml` route validates against an RSS schema.

**Locked embed snippets (provided by user via /oversight
2026-05-09T12:30Z — embed verbatim, theme via Tailwind classes
only, do NOT mutate the action / hidden field semantics):**

Buttondown form (footer + dedicated `/newsletter` page):

```html
<form
  action="https://buttondown.com/api/emails/embed-subscribe/thock"
  method="post"
  class="embeddable-buttondown-form"
>
  <label for="bd-email">Enter your email</label>
  <input type="email" name="email" id="bd-email" />
  <input type="submit" value="Subscribe" />
  <p>
    <a href="https://buttondown.com/refer/thock" target="_blank">
      Powered by Buttondown.
    </a>
  </p>
</form>
```

Notes for the implementer:
- The Buttondown handle in the URL is `thock` (the project name,
  matching the lowercase wordmark). Preserve verbatim.
- Style with Tailwind utility classes inside a thin wrapper
  component; do not change the form's `action`, `method`, or
  input `name` attributes.
- Show "Powered by Buttondown" attribution; small mono link in
  the same accent color as the rest of the secondary chrome.

Google Tag Manager (root-of-page; embed in `apps/web/src/app/layout.tsx`):

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-58T839ZD');</script>
<!-- End Google Tag Manager -->
```

Notes for the implementer:
- GTM container ID is `GTM-58T839ZD`. Wire via Next's `<Script>`
  component with `strategy="afterInteractive"` to keep core
  vitals clean. Drop into the root `layout.tsx` head block (or
  near the top of `<body>` per Next/GTM convention).
- No consent gate yet — thock collects no PII; GTM is page-level
  pageview tracking only. If we add forms beyond Buttondown,
  revisit and gate via the standard consent banner.
- Add a `// per /oversight 2026-05-09 — GTM container locked`
  comment so the next loop tick doesn't re-litigate the choice.

### Phase 16 — Polish

- `/404` — branded not-found page with search box and pillar links.
- `/about` — editorial standards, voice, who we are.
- `/sources` — index of every citation across the site (collected
  from inline `<Source>` components in MDX at build time).
- Footer — full nav, RSS link, newsletter CTA, copyright.
- `app/opengraph-image.tsx` per family — final OG templates.
- Mobile hamburger menu in `<Header>` (deferred from phase 1).
- Accessibility audit: contrast, focus rings, alt text, keyboard nav.
- 404-soft: missing article slug renders not-found with "Did you
  mean?" via MiniSearch.

### Phase 17 — Performance + meta

- Sitemap completeness: every URL the site can serve is listed.
- JSON-LD audit: every page has the right type; validate against
  schema.org via a build-time script.
- Lighthouse pass: target ≥ 95 across the board on `/` and
  `/article/[slug]`.
- Image optimization audit: every image goes through `next/image`
  with `priority` only on hero.
- Bundle-size budget: write a `pnpm size` script that fails CI if
  the homepage JS exceeds 200KB gzipped.

---

## Carry-overs / known gaps (update as phases ship)

(Empty until phases ship. Add `[-]` rows for partial-but-shipped
phases with linked notes here.)

## Phase log (commit hashes)

phase 1 — 3ffa51c — monorepo bootstrap; apps/web (Next 15), apps/e2e (Playwright), packages/{tokens,ui,tsconfig,data-stub}; pnpm verify green.
phase 2 — fdc3489 — @thock/data: 6 Zod schemas + JSON Schema generation + 6 loaders + validate CLI w/ cross-refs; 1 seed record per entity (cannonkeys, gateron-oil-king, gmk-olivia, mode-sonnet, mode-sonnet-r2 GB, 2026-W19 trends); 32 new unit tests.
phase 3 — 21f153e — @thock/content: frontmatter schema + tag taxonomy (38 tags) + loaders + MDX component registry; 6 curator-drafted seed articles (one per pillar + Trends Tracker preview) cross-referencing the phase-2 data seeds; phase-1 home replaced with HomeArticleList; +27 unit tests, 65 total.
phase 4 — fc1b0b0 — @thock/seo (siteConfig + canonicalUrl + buildMetadata + buildJsonLd + PILLARS + JsonLd); every URL-contract route shipped as a stub or real page (12 stubs + 2 dynamic stubs + sitemap + robots + global + per-pillar RSS); shared <PageStub>; hermetic e2e walker over every canonical URL (desktop + 375px mobile) wired into `pnpm verify` as the canonical harness; +27 seo tests, +21 web tests, +6 e2e fixture tests, 123 e2e tests across desktop + mobile.
phase 4b — d0147cc + 1b3944c — production runtime hotfix: pre-built data manifest at apps/web/src/lib/data-runtime/manifest.generated.json (regenerated as a `prebuild` step), thin adapter exposing the @thock/content + @thock/data API; all 15 apps/web call sites migrated from package imports to the runtime adapter so the bundled lambda no longer needs filesystem walks; fabricated author bylines (Mara Lin, Reza Patel, Tess Aoyama) replaced with `thock`; pnpm deploy:smoke probes one URL per pattern against the live site and exits non-zero on any non-2xx; host migration from Netlify to Vercel (driven by Netlify free-tier exhaustion, which independently surfaced the regression that the manifest fix addresses). 10/10 live probes pass on thock-coral.vercel.app; +12 data-runtime tests, 174 unit + 123 e2e total.
phase 15 — 5fa4ee4 — Buttondown embed wired into footer + new /newsletter page (handle `thock`, /oversight-locked snippet preserved verbatim); GTM container `GTM-58T839ZD` loaded via Next `<Script strategy="afterInteractive">` from the root layout; handwritten RSS 2.0 validator at apps/web/src/lib/rss/validate.ts plus 6 schema-validation e2e tests covering /feed.xml + 5 per-pillar feeds; @thock/content gains a `Newsletter` schema + empty-tolerant `getAllNewsletters()` loader (manifest + runtime adapter wired in lockstep); /newsletter PageStub replaced with a real page rendering form + empty-state archive + WebSite/BreadcrumbList JSON-LD; footer inert form replaced with `<ButtondownForm variant="footer">`, dropping the legacy "Newsletter signup placeholder" aria-label and inline-draining the matching [LOW] CRITIQUE pass-2 row; +20 unit + 12 e2e (188 e2e total, retries=2 clears the known #418 PageStub transient).
phase 16 — f3e5bac — root not-found + real /about + real /sources (PageStubs retired). app/not-found.tsx renders branded 404 with a search-form action="/search" + five-link pillar nav. /about ships four locked sections (pillars, voice, trends scoring, vendor-relationships disclosure). /sources ships per-article aggregate of <Source> citations via the new countSourceTags helper in @thock/content; per-citation extraction deferred to audit row. New components: AboutBody + SourceCounts + RootNotFound, all colocated with __tests__/. Three follow-up audit rows filed in plan/AUDIT.md: a11y audit pass [MED 5.5], 404-soft for unknown article+tag slugs [MED 6.0], /sources per-citation index [LOW 3.5]. Phase-16 mobile-menu and per-family OG slots already shipped earlier today (commits 16b53c3 critique-pass-1 drain + 0dab0a8 per-pillar OG handlers) so this commit covers the remaining page-work scope. +12 unit + 7 e2e (210 unit + 201 e2e total).
phase 17 — 1f5b33c — final build-plan phase. pnpm size script in apps/web/scripts/measure-bundle.mts reads .next/app-build-manifest.json + gzips homepage chunks via node:zlib (108.7 KB current vs 250 KB budget). apps/e2e/tests/meta.spec.ts ships two gate suites: sitemap completeness (canonical-urls ⊆ sitemap, 59 URLs covered) and JSON-LD shape audit (per-family @type contract walked across every canonical HTML URL — drills arrays + @graph). apps/web/src/__tests__/no-raw-img.test.ts walks every .tsx/.jsx/.mdx under apps/web/src (excluding __tests__/) and fails if any contains a raw <img> tag. Verify-gate order updated in root package.json: typecheck → test:run → test:scripts → data:validate → build → size → e2e. Two follow-up audit rows: Lighthouse CI [MED 5.0] (runner choice = /oversight call), tighten budget 250 KB → 200 KB [LOW 2.5]. Verify ran 254 e2e green on first try — the known PageStub #418 hydration transient cleared naturally now that phase 16 replaced /about and /sources with real pages, exactly as the audit predicted. After this phase the loop transitions to /iterate mode; /march will dispatch /iterate (or /critique on its rate-limited cadence) for every subsequent tick.
phase 24 — 8b49296 — new skills/ship-content.md codifies the 10-step content-velocity pattern (sync, AUDIT.md queue read, publishedAt 30-day gap-fill + group-buy exception, GitHub mirror, parallel content-curator + brander, tags.json category-heuristic extension, pnpm verify with serial-e2e fallback, commit + push, audit tick, deploy:check). skills/march.md Step 3 gains a new 3b.5 content-queue lane dispatching /ship-content when AUDIT.md content-gap rows score >= 3.0. skills/iterate.md Step 3 delegation and failure-mode 6 updated to route content-gap work through /ship-content instead of re-implementing the pattern inline. 448 e2e green (serial-worker CI run).
phase 25 — 1a26f56 — cloud content schedule primed. Seeds plan/AUDIT.md with 3 Rule-1 content-gap rows (ideas 5.25, deep-dives 5.25, guides 4.5 after 1.5x bias) so march Step 3b.5 dispatches /ship-content on every subsequent tick. No workflow cron change: the existing hourly cron already covers Monday 14:00 UTC; a redundant entry would queue duplicate ticks in the march concurrency group. ACTIONS_PAT lacks workflows permission; documented in brief instead. 448 e2e green (serial-worker CI run).
phase 26 — 7899462 — a11y audit pass Phase A.
phase 27 — 4d44b1a — tracker archive surface Phase A. /trends/tracker/[week] renders any historical snapshot (generateStaticParams for W19+W20, dynamicParams=false, CollectionPage+BreadcrumbList+Dataset JSON-LD, prev/next nav). /trends/tracker gains TrackerArchiveStrip (last 8 weeks, direction counts, current-week highlight). Sitemap + canonical-urls auto-extend. 9 new e2e tests in tracker-archive.spec.ts; 489 e2e green. @axe-core/playwright added to apps/e2e; new apps/e2e/tests/a11y.spec.ts walks 7 canonical pages at desktop + 3 at mobile with WCAG 2.1 AA axe rules (Phase A posture: critical-only hard gate; serious/moderate/minor logged + filed to AUDIT.md). Skip-to-main-content link added to root layout (WCAG 2.4.1 Bypass Blocks); .skip-link CSS in globals.css; id="main" on all 43 route <main> elements; Wordmark gains role="img" to permit aria-label (drains aria-prohibited-attr). Three [a11y] AUDIT.md rows filed: color-contrast at text-accent-mu small text [3.5], color-contrast at text-text-3 small text [3.0], link-in-text-block on /about [2.5]. 474 e2e green.
phase 28 — c83821e — /tags index page. New route /tags renders all 60 tags grouped by six categories (switch → layout → brand → material → profile → misc) with categorical-tinted headings and TagChip links. New components: TagsIndex + TagGroup; unit tests in __tests__/TagsIndex (8 tests). /tag/[slug] back-link updated from "← home" to "← all tags" → /tags (drains CRITIQUE pass-2 truthfulness finding). Sitemap + canonical-urls + page-reads extended. e2e: tags.spec.ts (6 tests: eyebrow/H1, category groups, chip hrefs, click-through, JSON-LD, back-link retrofit). 498 e2e green.
phase 29 — df17423 — /group-buys/past archive surface. New loader getAllClosedGroupBuys() in apps/web/src/lib/data-runtime/index.ts returns every closed/shipped buy plus lapsed-live records (status='live' with endDate < today), sorted endDate desc / name asc tie-break, no cap (live page keeps its own ENDED_CAP=6 "Just closed" rail). New route /group-buys/past renders the full history with variant="ended" rows, CollectionPage + BreadcrumbList (Home → Group buys → Past) + ItemList JSON-LD. /group-buys gains a "view full archive →" affordance under "Just closed". Sitemap entry at 0.5. canonical-urls + page-reads fixtures extended so the smoke walker covers /group-buys/past. e2e: new describe block in group-buys.spec.ts (3 archive tests: H1, ended-row+no-live-row check, JSON-LD) + archive-link retrofit assertion. relatedArticle wiring deferred — schema field does not exist yet; a schema additive belongs to its own /ship-a-phase. 505 e2e green.
phase 30 — cc1b8ed — content-velocity queue auto-refill. scripts/content-gap-survey.mjs surveys the 30d sliding window per pillar: comfortable (≥2) → no-op; hot-pursuit (=1) → score 7.0; critical-hot-pursuit (=0) → score 9.5. Tie-break: oldest most-recent publishedAt → lowest count → editorial prominence (Trends > News > Ideas > Deep Dives > Guides). CLI: dry-run default, --write appends to plan/AUDIT.md, --json for programmatic. packages/content/src/util/content-gap-survey.ts: typed pure surveyContentGaps() + formatAuditRow(). Test A (deep-dives 1-in-30d → score 7.0) + Test B (news 0-in-30d → score 9.5) in both Vitest (packages/content) and node:test (scripts/__tests__). skills/ship-content.md Step 8a: invokes --write post-drain in same audit commit. skills/march.md Step 3b.5a: invokes helper on empty queue, commits new row, dispatches /ship-content; falls through to expand when comfortable. 569 e2e green.
phase 31 — f8006d1 — Trends Tracker Phase B: automated weekly snapshot cadence. skills/march.md gains Step 0.5 Monday gate: IS_MONDAY=yes AND no data/trends/<current-iso-week>.json → spawn scout, write snapshot, pnpm verify, commit, return. scripts/iso-week.mjs zero-dep ESM helper prints current ISO 8601 week. packages/data/src/__tests__/loaders/trends.test.ts: 4 unit tests for isoWeek-ascending sort order and getLatestTrendSnapshot correctness. data/trends/2026-W21.json: 18-row scout-researched snapshot for ISO week 21 (May 18–24 2026) shipped now so tracker does not freeze at W20 when Monday arrives; /trends/tracker/2026-W21 pre-rendered at build via generateStaticParams. 609 e2e green.
phase 32 — f41cc25 — A11y Phase B systematic completion. New PageSectionKicker component at text-text-2 replaces 13 inline kicker spans across route page.tsx files (home, news, trends, ideas, deep-dives, guides, group-buys, group-buys/past, tag/[slug], tracker, tracker/[week], tracker/[week]/not-found); prevents copy-paste text-text-3 regressions in future routes. Header.tsx search icon button fixed: text-text-3 → text-text-2 (last remaining functional text-text-3). a11y.spec.ts upgraded Phase A → Phase B: runAxe() now hard-fails on serious violations in addition to critical — safe to enable because all 25 serious audit rows were drained by the iterate drip (phases 26–32, 21 commits). 6 unit tests for PageSectionKicker. 609 e2e green.
phase 33 — faf99f5 — "Find your switch" interactive quiz. /quiz/switch: 4-question interactive recommender (sound profile, actuation feel, spring weight, primary use) scoring getAllSwitches() with additive integer weights; top-3 matches render as ResultCard links to /part/switch/[slug]. Server page.tsx exports generateMetadata + WebApplication JSON-LD; SwitchQuiz is "use client" managing step state and results. Components: QuizStep (auto-advance on option click, aria-pressed on selected), ResultCard (rank badge, match bar, /part/switch/ link), QuizProgress (progress bar). 5 unit tests for recommendSwitch.ts + 7 component unit tests. Home page gains "Find your switch →" CTA one-liner. sitemap + canonical-urls + page-reads updated; quiz.spec.ts (5 desktop) + quiz.mobile.spec.ts (2 mobile). 620 e2e green.
phase 34 — cf656ef — parts catalog second data pass. 14 new records: 8 switches (kailh-box-white, kailh-box-jade [clicky segment now covered], gazzew-boba-u4 [silent-tactile], gazzew-boba-lt [silent-linear], gateron-ink-v2-yellow, c3-tangerine-r2 [premium linears], gateron-magnetic-jade [hall-effect as linear], durock-t1 [heavy tactile]); 3 keycap-sets (gmk-laser, sa-godspeed [first SA profile], domikey-wob [pbt doubleshot]); 3 boards (drop-ctrl [tkl/Drop], kbd75v3 [75/KBDfans], ikki68-aurora [65/polycarbonate/Wuque Studio]). No schema change. Manifest + search index rebuilt. 653 e2e green.
phase 35 — 332ae7a — /parts root browse landing. New static route /parts renders three categorical sections (Switches · Keycap sets · Boards) with record counts and links to kind-index pages. CollectionPage + BreadcrumbList (Home → Parts) + ItemList JSON-LD. Sitemap entry at 0.6. canonical-urls + page-reads fixtures extended. 4 new e2e tests in parts.spec.ts Phase 35 block (eyebrow/H1, section hrefs, JSON-LD, quiz affordance). /quiz/switch results view gains "Browse all parts →" link (data-testid=quiz-browse-all-parts-link) completing the discovery triangle quiz → result → /parts → kind-index → detail. 660 e2e green.
phase 36 — 76edbc9 — content language quality gate. scripts/article-language-check.mjs: mechanical linter for static-MDX temporal anti-patterns with gate mode (named files, exit 1 on violations), --write mode (corpus scan → AUDIT.md rows), and --json mode. scripts/article-language-patterns.json: 11 forbidden patterns covering unfulfillable editorial promises (will revisit, report back, check back, stay tuned, coming soon), stale buy status (the buy is live), imprecise date claims (approximately [year/quarter/month]), and relative time references ([N] weeks/months from now). 18 node:test unit tests (9 positive + 5 negative + 4 extractBody/escapeRegex). skills/ship-content.md Step 7 amended: Step 7a language gate runs pre-commit, passes violations back to content-curator once, hard-fails if violations persist. One-time corpus scan filed 2 AUDIT rows (gmk-cyl-ramune stale-buy-live, mode-sonnet-r2 approximate-date-quarter). 664 e2e green.
phase 37 — fc17f19 — group-buy relatedArticle schema additive. relatedArticle: z.string().optional() added to GroupBuySchema; JSON Schema regenerated. 8 of 9 group-buy records retrofitted where a companion article exists (wuque-studio-paper80-whatever-studio intentionally skipped — no thock coverage). GroupBuyRow renders "read our coverage →" link (data-testid="group-buy-coverage-link") when relatedArticle is set, visible on live/announced and ended variants. /group-buys and /group-buys/past pass sameAs on ItemList entries; buildItemListJsonLd extended with backward-compatible sameAs support. 3 new unit tests + 3 new e2e tests. 667 e2e green.
phase 38 — e91eefc — mentionedParts ship-time enforcement gate. scripts/article-parts-check.mjs: gate script loading entity catalog from data/{switches,keycap-sets,boards}/*.json, flags catalog entity names found in article prose absent from mentionedParts frontmatter (gate/--json/--write modes). scripts/__tests__/article-parts-check.test.mjs: 9 node:test unit tests (violation, no-violation, not-in-catalog control). skills/ship-content.md Step 7b amendment inserts mentionedParts check between language gate (7a) and commit (7c); one content-curator revision retry, hard-fail on persistence. One-time corpus scan filed 1 AUDIT row (mode-sonnet-r2-group-buy-coverage). 733 e2e green.
phase 39 — c2977a0 — companion-article prose cross-link auditor. scripts/article-crosslink-survey.mjs: for each article pair sharing ≥2 tags, checks if either body has a prose cross-link to the other; unlinked pairs file AUDIT rows (same-pillar score 4.5, cross-pillar 3.6; deduplication prevents re-filing). Modes: dry-run, --write, --json, --slug scope. scripts/__tests__/article-crosslink-survey.test.mjs: 15 node:test unit tests (parseFrontmatter inline+multi-line+quoted, extractBody, hasLinkTo, findUnlinkedPairs gap/link-present/tag-threshold/scope). skills/march.md Step 3b.5a: crosslink survey runs after content-gap-survey on empty-queue path. skills/ship-content.md Step 7: new Step 7c (non-gating crosslink survey scoped to new article) inserted before commit+push (now Step 7d). One-time corpus scan: 117 unlinked pairs filed to plan/AUDIT.md (59 same-pillar, 58 cross-pillar). 733 e2e green.
phase 40 — fa8994e — Group-buy Rule 3 companion survey. scripts/group-buy-companion-survey.mjs: reads all data/group-buys/*.json, flags status={live,announced} records missing relatedArticle, files content-gaps AUDIT rows (impact 7, ease 5, score 7.0). Modes: dry-run (exit 1 if any missing), --write (append AUDIT.md rows with dedup), --json. Exits clean on current corpus (all live buys have companions). scripts/__tests__/group-buy-companion-survey.test.mjs: 9 node:test unit tests (violation live, violation announced, no-violation closed, no-violation shipped, no-violation with relatedArticle ×2, alreadyFiled ×3). skills/march.md Step 3b.5a: group-buy companion survey runs after crosslink survey on empty-queue path. skills/ship-data.md Step 4b: companion survey runs after writing a group-buy record. 733 e2e green.
phase 41 — 96cc87b — Tracker Rule 2 linkage survey. scripts/tracker-linkage-survey.mjs: scans all data/trends/*.json snapshots; flags non-flat rows whose topic name has been unlinked for >14 calendar days; deduplicates by topic name; files content-gaps AUDIT rows (impact 6, ease 9, score 5.5). Modes: dry-run, --write, --json. Exits clean on current corpus (W24 unlinked topics Gateron Lanes, GMK CYL Pandemonium, Prototypist are only 3 days old). scripts/__tests__/tracker-linkage-survey.test.mjs: 9 node:test unit tests (violation, no-violation linked-later-snapshot, no-violation within-14d window, flat-row exclusion, alreadyFiled ×3). skills/march.md Step 0.5 amended: after Monday snapshot commits, runs tracker-linkage-survey --write; commits new rows if filed. 733 e2e green.
phase 43 — 7536ca5 — article date archive /archive. New static route /archive groups getAllArticles() by YYYY-MM (newest month first, articles within month newest first). Components: archiveUtils.ts (pure groupArticlesByMonth helper), ArchiveMonthGroup.tsx (month heading + article rows with pillar chip), ArchiveList.tsx. CollectionPage + BreadcrumbList + ItemList JSON-LD; sitemap entry at 0.5; canonical-urls + page-reads fixtures extended; 5 e2e tests in archive.spec.ts; 8 unit tests (archiveUtils) + 3 render tests (ArchiveList); /tags gains "Browse by date →" cross-link to /archive. Delivers spec §5.3 "Archive by date" requirement. 741 e2e green.
phase 44 — c99834b — switch comparison /compare/switch. New dynamic route reads searchParams ?a=<slug>&b=<slug>; SwitchCompareSelector (client, two <select> dropdowns, Compare button disabled when a===b or either empty, router.push on submit); SwitchCompareTable (9 spec rows — type, housing, stem, spring, travel, lubed, status, released — diff rows get data-differs="true" + elevated text color). Dynamic generateMetadata: "<A> vs <B>" when both params resolve. JSON-LD: BreadcrumbList always + ItemList with two ListItem entries when comparison active. Sitemap entry at 0.6. Cross-link: "Compare this switch →" affordance on /part/switch/[slug]. canonical-urls + page-reads fixtures extended; compare.spec.ts (8 tests) + compare.mobile.spec.ts (3 tests); 9 unit tests (SwitchCompareTable ×5 + SwitchCompareSelector ×4). 756 e2e green.
phase 45 — 4ed83e7 — vendor index + detail /vendors + /vendor/[slug]. /vendors lists all 8 vendors sorted active-first, alphabetical; VendorCard renders name, country, description (130-char truncated), detail link, external URL. /vendor/[slug] generateStaticParams from getAllVendors(); sections: hero (name, country, URL), description, active group buys (VendorGroupBuySection), past group buys, boards (VendorBoardSection). Organization JSON-LD (sameAs: vendor.url) + BreadcrumbList on detail; CollectionPage + BreadcrumbList + ItemList on index. Data-runtime: getGroupBuysByVendor() + getBoardsByVendor() helpers. Components: VendorCard, VendorGroupBuySection, VendorBoardSection (10 unit tests). Sitemap: /vendors + /vendor/* entries. Canonical-urls: /vendors static + listVendorSlugs() dynamic. Cross-link: "Browse vendors →" on /group-buys header. vendors.spec.ts (8 tests) + vendors.mobile.spec.ts (2 tests). 795 e2e green.
phase 46 — 073acf2 — cross-link drain efficiency. skills/iterate.md Step 3 gains cluster-aware cross-links delegation: when top finding is category:cross-links, identify hub article X (slug in most pending cross-link rows; tie-break alphabetical/article-a), collect all pending rows involving X via --slug X scope, drain all N pairs in one commit. skills/march.md Step 3b.5a gains cluster-aware note (no march orchestration needed beyond what iterate already handles). scripts/__tests__/article-crosslink-survey.test.mjs: 1 new node:test case — 3 X-rows (hub-x↔sib-a/b/c) + 1 Y-row (unrelated-y↔z) → findUnlinkedPairs(all,'hub-x') returns 3 (the cluster-drain invariant). 115 script tests total. 798 e2e green.
phase 47 — 2e9b649 — /quiz/keycap-set recommender. 4-question quiz (profile/material/legends/availability) over getAllKeycapSets(); pure recommendKeycapSet() helper with 7 unit tests. KeycapSetQuiz (client) + KeycapSetResultCard components reuse existing QuizProgress + QuizStep. WebApplication + BreadcrumbList JSON-LD; buildMetadata; loading.tsx pulse skeleton. Cross-links: "Find your keycap set →" on /part/keycap-set/[slug] detail pages; home CTA strip updated. Sitemap, canonical-urls, page-reads, quiz.spec.ts (+6 tests), quiz.mobile.spec.ts (+2 tests), sitemap.test.ts updated; bearings.md URL contract gains /quiz/keycap-set row. 812 e2e green; 554 unit tests green.
