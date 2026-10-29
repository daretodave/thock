# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

> **Rule 1: sliding window (locked 2026-05-14 — see `plan/bearings.md`
> § Rule 1).** Each pillar carries ≥2 articles published within the
> last 30 days, always. The rule is self-replenishing — articles
> aging out generate new shortfalls without any external priming.
>
> Three states, codified in bearings.md and emitted by the audit-row
> generator (phase 30 ships `scripts/content-gap-survey.mjs`):
>
> - **Comfortable** — every pillar ≥ 2 in 30d. No Rule-1 row files.
> - **Hot pursuit** — one or more pillars at exactly 1 in 30d. Row
>   files at score **7.0** for that pillar. Loop ships on next tick.
> - **Critical hot pursuit** — one or more pillars at 0 in 30d. Row
>   files at score **9.5**, above every other priority. Loop drops
>   iterate / polish until the pillar recovers.
>
> Pillar selection when multiple are cold: oldest most-recent
> publishedAt wins; tie-breaker is lowest count, then editorial
> prominence (Trends > News > Ideas > Deep Dives > Guides).
>
> **Current state (2026-05-14):** all 40 articles aged 1–10 days,
> all pillars at 8 in 30d → comfortable. First natural shortfall
> arrives in ~20 days as the oldest articles cross the threshold.
> No Rule-1 row to file yet.
>
> Rules 2 / 3 / 4 (tracker linkage, group-buy companion, publishedAt
> gap-fill) are unchanged. They compete on raw `impact × ease`.

> **PRUNE 2026-06-14 (via `/oversight`):** the 65 open
> `[cross-links] [3.6]` *adjacent-pillar* rows were deleted in bulk.
> Rationale: these were the weakest cross-link signal (adjacent
> pillar, ≥2 shared tags) and were draining 1/tick — ~58% of recent
> maintenance bandwidth went to them. The 52 stronger
> `[cross-links] [4.5]` *same-pillar* rows are kept; phase 46
> (cross-link drain efficiency) makes `/iterate` cluster-aware so
> those drain per-article instead of 1/tick. Phase 39's
> `article-crosslink-survey` will re-file adjacent-pillar pairs on
> the empty-queue path; if the drain re-dominates, raise the
> survey's adjacent-pillar floor rather than re-pruning by hand.

> **POSTURE: drained 2026-05-09** — the brand-assets-first
> posture set at 12:30Z is cleared. All four drain items shipped
> the same day: (1) favicon — `apps/web/src/app/icon.svg` +
> `apple-icon.tsx` wired via Next App Router auto-discovery
> (`0e7c9fd`); (2) default OG — already in place at
> `apps/web/src/app/opengraph-image.tsx` since phase 4 (`fc1b0b0`);
> (3) per-pillar OG variants — five `apps/web/src/app/<pillar>/opengraph-image.tsx`
> handlers + shared `<PillarOGContent>` template (`0dab0a8`);
> (4) hero placeholders for the six seed articles — SVGs at
> `apps/web/public/hero-art/<slug>.svg` + provenance JSON siblings
> + frontmatter `heroImage`/`heroImageAlt` wiring (`0e7c9fd`).
> `/march` resumes normal dispatch — phase 15 (Newsletter) is the
> next pending phase.

> **Iterate-bias category: cleared 2026-05-09** along with the
> posture. Iterate scoring returns to category-neutral.

> **Article hero art directive (locked 2026-05-09 — durable
> after the posture drained):** every article (current and future)
> renders a colorful keyboard SVG as its hero placeholder until
> real photography backfills. Style: simple, single splash of
> color, line-drawing weight consistent across articles,
> illustrative of the article's subject (switch cross-section
> for switch-deep-dives, keycap profile silhouette for keycap
> pieces, keyboard outline + callout for build pieces, sparkline
> for trends pieces, layout silhouette for ergonomic pieces).
> Hero SVGs land under `apps/web/public/hero-art/<slug>.svg` with
> a sibling `<slug>.svg.json` provenance file. The article
> frontmatter `heroImage` field references the absolute path.
>
> **Forward-looking wiring (added 2026-05-09 same drain):** new
> articles drafted by `/iterate` no longer ship art-less. The
> iterate skill's content-gap delegation now bundles
> `content-curator` (prose) + `brander` (hero SVG) + frontmatter
> wiring as a single commit — see `skills/iterate.md` § Step 3.
> The audit's "articles missing `heroImage`" finding (§4.A) is
> reserved for backfilling already-shipped articles, not for
> letting new ones slip through. Non-article asset findings
> (broken favicon, missing OG variant, stale render) still go
> through `/ship-asset` directly — that lane stays demand-pull
> per `skills/ship-asset.md` §1.

### [ ] [seo] [2.7] Hero-art key-layout for the two dedicated Mode Sonnet articles still visually depicts a 65% shape (16-column, no function row) after the layout correction to 75%
- category: seo
- filed: 2026-08-23 by /iterate (drain of `[6.4]` mode-sonnet catalog correction)
- impact: 6 (`mode-sonnet-r2-group-buy-coverage.svg` and `building-mode-sonnet-with-oil-kings.svg` are hand-authored key-layout illustrations drawn with the row/column counts of a genuine 65% board — now inconsistent with the article prose and the corrected catalog record. The `<title>` accessibility text was softened this tick to drop the false "65%" claim, but the visible artwork itself still reads as a 65% silhouette)
- ease: 4 (requires `brander` to redraw the key-layout grid to a 75% shape — extra key columns/rows — rather than a text-only edit; two files)
- score: 2.7 (impact × ease / 10)
- evidence: `apps/web/public/hero-art/mode-sonnet-r2-group-buy-coverage.svg` comment "65% layout (same skeleton as the build piece, repositioned)"; `apps/web/public/hero-art/building-mode-sonnet-with-oil-kings.svg` comment "65% layout: 5 rows × 16 columns"
- next: `/ship-asset` — brander redraws both hero SVGs with a 75%-shaped key grid (add a compressed function row); update the `<title>` text and provenance JSON `subject` fields to match once redrawn

### [ ] [content] [2.4] `plate-materials-explained.mdx`'s POM+gasket-mount "combination to be careful with" framing is now in tension with Mode's own confirmed flagship configuration
- category: content
- filed: 2026-08-23 by /iterate (drain of `[6.4]` mode-sonnet catalog correction)
- impact: 6 (the article's "Combinations" section advises POM+gasket-mount can read as "dead — present, quiet, no top-end strike" and should be paired with stiff top/bottom-mount cases instead. Mode's own flagship Sonnet configuration is exactly POM stock plate + gasket-style Mounting Block System, marketed by Mode itself as "softest plate with a muted sound" — not framed as a caution. This tick already removed the specific false "Mode lineup ships polycarbonate" and "sound like a Mode video" claims from the polycarbonate paragraph without touching the POM caution paragraph, since resolving the apparent tension properly needs acoustic-damping research this tick didn't have scope for, not just a word swap)
- ease: 4 (needs either scout research into how Mode's Mounting Block System's own compliance budget differs from a classic foam-strip gasket — which may fully explain why POM works there but not on a foam-strip gasket — or a content-curator prose pass reconciling the two claims)
- score: 2.4 (impact × ease / 10)
- evidence: `apps/web/src/content/articles/plate-materials-explained.mdx` "Combinations" section (POM+gasket-mount caution) vs. this tick's scout research confirming Mode's Sonnet ships POM as its stock/no-upcharge plate on a block-mount system the hobby files as gasket-mount
- next: `/iterate` — scout research on whether Mode's block-mount compliance budget differs meaningfully from a foam-strip gasket (which would resolve the tension without contradicting either claim), then a small prose reconciliation pass

### [needs-user-call] [engineering] [3.6] GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned cookieless Plausible tag
- category: engineering
- filed: 2026-09-05 by cloud /iterate audit (fresh general-purpose sweep, angle: analytics/consent)
- impact: 6 (`apps/web/src/components/analytics/GoogleTagManager.tsx:18-20`'s own code comment reads "No consent gate yet — thock collects no PII; GTM is page-level pageview tracking only" — but GDPR/PECR consent requirements for non-essential cookies turn on cookie use, not PII collection, so the reasoning doesn't actually clear the compliance bar. Rendered unconditionally from `apps/web/src/app/layout.tsx:70`, gated only by a `DISABLE_ANALYTICS` bot-suppression flag, not user consent. `plan/bearings.md:73` still states `Analytics | Plausible (script tag, eventual) | Privacy-respecting` — docs were never reconciled after the GTM pivot locked via `/oversight 2026-05-09`, so this is an undocumented architecture change plus an unaddressed compliance gap, not a one-off bug)
- ease: 6 (either add a lightweight consent gate around the existing `next/script` call, or drop GTM for the originally-planned cookieless Plausible tag — either way `bearings.md:73` needs updating to match reality)
- score: 3.6 (impact × ease / 10)
- evidence: `apps/web/src/components/analytics/GoogleTagManager.tsx:18-20`; `apps/web/src/app/layout.tsx:70`; `plan/bearings.md:73`
- next: `/oversight` call — pick consent-gate-GTM vs. revert-to-Plausible, then implement + reconcile bearings.md

## Drained findings (kept for audit-trail; do not re-open)

### [x] [external-critique] [voice] [3.6] /tools + /quiz/switch — tools-card description and quiz lede describe the same flow with different framing — addressed in 5dc60b24, closes #1059
- category: external-critique
- filed: critique pass 14 (reader sub-agent, scripted walk)
- impact: 4 (two heavily-linked utility surfaces describing the same feature inconsistently)
- ease: 9 (single lede string edit, no schema/route/component change)
- score: 3.6 (impact × ease / 10)
- evidence: `apps/web/src/app/tools/page.tsx:35` vs. `apps/web/src/app/quiz/switch/page.tsx:52-53`
- action: `/quiz/switch` lede rewritten to echo the `/tools` card's wording (digit numeral, named dimensions), keeping only its own closing clause
- issue: #1059

## Open findings

### [needs-user-call] [bug] [4.2] `/article/[slug]` and `/tag/[slug]` soft-404 fix is structurally blocked — real 404 status and the "did you mean" not-found UX are mutually exclusive under current Next.js routing
- category: bug
- filed: 2026-07-18 by cloud /iterate audit (fresh general-purpose sweep, then investigated + reverted same tick)
- impact: 7 (same impact reasoning as the closed-out #524 partial fix: these are the two highest-traffic dynamic route families, and soft-404s risk Search Console flags/wasted crawl budget)
- ease: 6 (originally scored — the fix looked mechanical: convert `article/[slug]/not-found.tsx` and `tag/[slug]/not-found.tsx` from reading `headers()` server-side to `usePathname()` client-side, then add `dynamicParams = false`. Implemented and verified directly against a local `next build && next start`: confirmed this does NOT work. With `dynamicParams` at the default (`true`), unknown slugs render the segment's own `not-found.tsx` — "did you mean" suggestions intact — but HTTP status is 200 (the pre-existing soft-404). With `dynamicParams = false`, unknown slugs correctly 404 — confirmed via curl — but Next.js bypasses the segment's own `not-found.tsx` boundary entirely and falls back to the root `not-found.tsx` ("Lost in the layout."), losing the suggestions; this happens regardless of whether the not-found page reads the pathname server-side or client-side, because the routing-layer rejection happens before the segment boundary is considered at all. `apps/e2e/tests/polish.spec.ts`'s two "did you mean" tests caught this immediately when the change was verify-gated. The two properties (accurate 404 status, segment-level "did you mean" UX) are confirmed mutually exclusive for these two routes under the current Next.js version — same trade-off already accepted for `/vendor/[slug]`/`/newsletter/[slug]`/`/part/[kind]` in #524, but those routes had no "did you mean" feature to lose, so it was free there. Here it isn't — an autonomous ease score can't be assigned to "which regression do we prefer")
- score: 4.2 (impact × ease / 10, as originally computed before the ease reassessment above — carried forward for continuity with the closed issue, not a live autonomous priority)
- next: `/oversight` call on which is preferred: (a) keep the current soft-404 (200 status, working "did you mean" suggestions) — the status quo since #524; or (b) accept `dynamicParams = false` (real 404, but the not-found page falls back to generic root copy with no suggestions) — same trade-off already made for the other 4 entity routes. A third option — building the "did you mean" suggestions into the *root* `not-found.tsx` with route-aware behavior — wasn't scoped in this investigation and could be a future `/plan-a-spec` candidate if (b) is preferred but the UX loss is unacceptable.
- issue: #533 (opened, investigated same tick, closed not-planned — see issue comments for the full local-repro evidence trail)
> Filed same-tick as investigated: the fresh sweep's top finding (score 4.2) matched a standing follow-up gap from #524's partial resolution, was implemented, and failed its own e2e coverage (`polish.spec.ts`'s two "did you mean" assertions) on the first `pnpm verify` pass. Rather than iterate blindly against a gate that was correctly catching a real, structural regression, did a direct local repro (`next build && next start` + curl, both `dynamicParams` states) to confirm the constraint before reverting — this is a routing-layer limitation, not an implementation bug, so further iterate-tick attempts at "just read the pathname differently" would repeat this same dead end. All file changes reverted to a clean working tree; no commit shipped this line of investigation. Falls through to the next candidate finding for this tick.

### [needs-user-call] [engineering] [3.0] mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed
- category: engineering
- filed: 2026-08-09 by cloud /iterate audit (fresh general-purpose sweep, discovered while investigating why #776 and #799 sat open with no AUDIT.md row)
- impact: 5 (two MED-severity, fully-verified content bugs — #776 and #799 — sat live and un-actioned for up to 2+ days purely because `skills/iterate.md` §5 Step 2.5 only writes an `- issue: #N` field onto a row that's already in `AUDIT.md`; if a finding is mirrored to GitHub but not picked that same tick, and never gets a formal row, it's invisible to every future audit since `/iterate` reads `AUDIT.md`, not the open-issues list, as its source of truth)
- ease: 6 (a fix here is process, not a content edit — e.g. amend Step 2.5 to always leave a Pending row behind regardless of whether the finding is picked that tick, or add a march/iterate step that cross-checks `gh issue list --label loop:opened` against `AUDIT.md` Pending rows before declaring "no actionable work")
- score: 3.0 (impact × ease / 10)
- observation: confirmed via `gh issue list --state open`: at filing time #776 (2026-08-07) and #799 (2026-08-09) both carried `loop:opened`/`source:audit`/`severity:med` labels with no corresponding `AUDIT.md` row of their own (only a passing prose mention of #799 inside an unrelated row's resolution note). #776 was shipped this same tick (see row above); #799 (W23 GMK CYL Ramune "four-week" vs actual five-week window mislabel, `data/trends/2026-W23.json`) remains open for a future tick to pick up via the normal Step 2.5 "reuse #N" path.
- next: this is a loop-bookkeeping question, not a content fix — belongs to `/oversight` or `/plan-a-spec` to decide whether Step 2.5 should change or a reconciliation step should be added; not something a single autonomous tick should decide unilaterally.
- issue: #776, #799 (both referenced; no new issue opened for this meta-finding itself)

### [ ] [seo] [2.0] `cannonkeys-mode-sonnet-r2.svg` hero art still visually depicts a 65% layout after the group-buy record's text was corrected to 75%
- category: seo
- filed: 2026-08-26 by /iterate (drain of `[5.4]` cannonkeys-mode-sonnet-r2 data correction, same class as the existing `[2.7]` row above for the two dedicated Mode Sonnet articles)
- impact: 5 (`apps/web/public/group-buy-art/cannonkeys-mode-sonnet-r2.svg` is a hand-authored key-layout illustration drawn with a genuine 65% row/column count — the `aria-label`/`<title>` were softened this tick to drop the false "65%" claim, but the visible artwork itself, and its internal composition comments, still read as a 65% silhouette; the group-buy is closed/archived on `/group-buys/past`, lower traffic than an active listing, hence impact 5 rather than 6)
- ease: 4 (requires `brander` to redraw the key-layout grid to a 75% shape — add a compressed function row and rebalance proportions — rather than a text-only edit; also update the provenance JSON `subject`/`prompt` fields once redrawn)
- score: 2.0 (impact × ease / 10)
- evidence: `apps/web/public/group-buy-art/cannonkeys-mode-sonnet-r2.svg` comments "65% layout" / "No F-row (the defining 65% tell vs. 75%)" / "65% at ~13.5u wide × ~5.5u tall"; `apps/web/public/group-buy-art/cannonkeys-mode-sonnet-r2.json` provenance `subject`/`prompt` fields both still describe a 65% board
- next: `/ship-asset` — brander redraws the hero SVG with a 75%-shaped key grid (add a compressed function row); update the provenance JSON `subject`/`prompt` fields to match once redrawn

### [ ] [data] [2.4] committed `apps/web/src/lib/data-runtime/*.generated.json` + search index drift from `/data` after data-only commits
- category: data
- filed: 2026-08-28 by cloud /iterate → /expand tick (side effect of running `pnpm verify`)
- impact: 3 (dev-mode only — `next dev` has no `predev` regen step, so a stale committed manifest shows stale data locally; production is unaffected because `apps/web/package.json`'s `prebuild` script regenerates `manifest.generated.json` / `og-manifest.generated.json` / `search/index.generated.json` fresh from `/data` + content before every `next build`, and Vercel always runs a full build)
- ease: 8 (`pnpm --filter @thock/web build:manifest && pnpm --filter @thock/web build:search && pnpm --filter @thock/web build:viz-manifest`, then commit the 3 regenerated files)
- score: 2.4 (impact × ease / 10)
- observation: `git diff` after a routine `pnpm verify` run showed `apps/web/src/lib/data-runtime/manifest.generated.json` picking up the `4d3819e1` DCS Dolch/Molch spark-array fix that had landed several commits earlier — none of the data-only commits since then (`4d3819e1`, `57162340`) had regenerated + committed the derived manifests in the same commit. `skills/ship-data.md` doesn't mention the generated manifests at all.
- evidence: `pnpm verify` (build leg) regenerated `apps/web/src/lib/data-runtime/manifest.generated.json`, `og-manifest.generated.json`, and `apps/web/src/lib/search/index.generated.json` with real content diffs (not just `generatedAt` timestamp) relative to the committed versions at HEAD.
- suggested fix: either (a) add a `git add` of the 3 generated files to `skills/ship-data.md`'s commit step so data fixes stay in sync, or (b) `.gitignore` the generated files entirely and rely solely on `prebuild` (removes the sync problem at the cost of losing them from `next dev`'s zero-build startup path — would need a `predev` script added first). Not urgent: no production impact observed.

### [ ] [seo] [1.8] `apps/web/public/favicon.svg` is a byte-identical, fully unreferenced duplicate of `apps/web/src/app/icon.svg`
- category: seo
- filed: 2026-08-30 by cloud /iterate audit (fresh sweep — icon/manifest asset reference-graph check, disjoint from pass 396's favicon/apple-icon/manifest presence check)
- impact: 2 (zero user-facing effect — Next.js auto-serves `<link rel="icon">` from `app/icon.svg`'s build-time convention, so browsers never request `/favicon.svg`; the file is inert, not broken)
- ease: 9 (one `git rm`, no other file references it — not in `manifest.ts`, not in `layout.tsx` metadata, not in any component)
- score: 1.8 (impact × ease / 10)
- observation: `diff apps/web/public/favicon.svg apps/web/src/app/icon.svg` is byte-identical (5 lines each). `git log --follow` shows `public/favicon.svg` was added at the phase-1 monorepo bootstrap (`3ffa51c6`), before the `app/icon.svg` App Router convention existed. `manifest.ts`'s `icons` array lists `/icon.svg` and `/apple-icon`, never `/favicon.svg`; `layout.tsx`'s `metadata` object has no `icons` field either. Grepped `apps/web/src` and `packages/*/src` for `favicon.svg` — zero hits outside the file itself.
- evidence: `apps/web/public/favicon.svg` (5 lines) vs `apps/web/src/app/icon.svg` (5 lines), `diff` exit 0. `manifest.test.ts` only asserts the manifest object's shape, never touches the public file — pass 396's "confirmed present" note checked existence, not reachability.
- suggested fix: `git rm apps/web/public/favicon.svg` — no code or config references it, so removal is a zero-risk repo-hygiene cleanup. Not urgent: no production impact observed.
- category: data
- filed: 2026-08-30 by cloud /iterate audit (fresh disjoint sweep, angle: recently-shipped data vs. sibling-article cross-reference)
- impact: 5 (user-visible factual contradiction between the tracker note and the article it links to via `articleSlug` — `/trends/tracker/2026-W34`'s own note says the GMK Just Beachy buy opened across four vendors, but the linked article `gmk-cyl-just-beachy-group-buy-opens.mdx`'s entire thesis is a simultaneous five-vendor, five-region launch, and the prior week's own row (`2026-W33.json`) and the group-buy data record both list all five)
- ease: 8 (one-line JSON string edit to the `note` field, no schema/route/component change; W33 and W35 already correct, only W34 is the outlier)
- score: 4.0 (impact × ease / 10)
- observation: `data/trends/2026-W34.json`'s GMK Beachy row `note` reads "Group buy opened Aug 18 across Divinikey, Prototypist, KBDfans, and UniKeys kittings; first-week sign-ups tracking above typical CYL openers." — omits Keebz N Cables (Oceania). `data/trends/2026-W33.json`'s antecedent row: "GB opens Aug 18 across Keebz N Cables (Oceania), Divinikey (US), Prototypist (UK), KBDfans (China), Unikeys (Canada)." `data/group-buys/divinikey-gmk-cyl-just-beachy.json` description and the linked article's title/lede/body/hero-art alt text all confirm five vendors across five regions, naming Keebz N Cables for Oceania. Newsletter issues 007 and 009 also list all five.
- evidence: `data/trends/2026-W33.json`, `data/trends/2026-W34.json`, `data/group-buys/divinikey-gmk-cyl-just-beachy.json:15`, `apps/web/src/content/articles/gmk-cyl-just-beachy-group-buy-opens.mdx` (lede + body + hero alt)
- next: restore Keebz N Cables to the W34 row's `note` field, matching the corpus-wide five-vendor framing
- issue: #956

### [needs-user-call] [a11y] [1.3] default-state UI-component borders fail WCAG 1.4.11 non-text contrast (1.42:1 / 2.24:1 vs. 3:1 minimum) — real fix is a global dark-theme lightness call, not a mechanical edit
- category: a11y
- filed: 2026-09-08 by cloud /iterate audit (pass 424, fresh general-purpose sweep, angle: numeric WCAG contrast computation on tokens.css OKLCH values — text-color contrast was already guarded by existing component tests, but non-text/UI-component border contrast had never been computed)
- impact: 5 (`--thock-border` (dark-mode `oklch(0.305 0.007 250)`) measures **1.42:1** against `--thock-bg` and **1.24:1** against `--thock-surface`; `--thock-border-hi` measures **2.24:1** / **1.97:1** — both well under the 3:1 minimum SC 1.4.11 requires for a UI component's visual boundary. This is the sole rest-state boundary indicator for every text input, `<select>`, and border-styled button site-wide: `ButtondownForm.tsx:76-77,85-86` (email input + both submit buttons), `SwitchCompareSelector.tsx:41` / `BoardCompareSelector.tsx:41` (compare-tool selects), plus `QuizStep.tsx`, `GroupBuyCountdownRow.tsx`, `GroupBuyRow.tsx`, `MobileNav.tsx`, `RootNotFound.tsx`. Focus state is unaffected (accent ring measures 9.97:1) — this only affects sighted low-vision users scanning the page before interacting.
- ease: 2 (verified independently: reaching 3:1 against `--thock-surface`, the stricter of the two backgrounds these borders sit on, requires raising `--thock-border`'s OKLCH lightness from 0.305 to ~0.52 — not a small token nudge but roughly doubling perceived border weight across every bordered surface on the site, a visible identity change to the "restrained, low-contrast dark" aesthetic locked via `/oversight`. `--thock-border-hi` would need a comparable jump to preserve its role as the stronger of the two. This is a brand-taste tradeoff between accessibility and the existing visual language, not a mechanical fix — same class of call `agents.md` reserves for `/oversight` brand-setup passes, which cloud cannot run.)
- score: 1.3 (impact × ease / 10, honestly re-scored after independently verifying the fix's true blast radius — an initial estimate of ease 6 assumed a "2-line bump" before checking how much lightness change 3:1 actually requires)
- evidence: `packages/tokens/src/tokens.css:15-16` (dark-mode `--thock-border`/`--thock-border-hi`); contrast independently recomputed via OKLCH→linear-sRGB→WCAG relative luminance (Björn Ottosson's oklab conversion matrices + W3C contrast formula), confirming 1.42/1.24/2.24/1.97:1 exactly; light-mode values (`--thock-border: oklch(0.88 0.004 85)` against `--thock-bg: oklch(0.965 0.004 85)`) not yet computed — worth checking in the same pass if this is ever picked up.
- next: `/oversight` call — decide whether to accept a visibly heavier border weight in dark mode for WCAG 1.4.11 compliance, or a lighter-touch alternative (e.g. a subtle background-fill or shadow cue instead of raising border lightness); then implement + re-verify contrast across all bordered components in one pass.

### [x] [data] [3.6] divinikey-gmk-cyl-just-beachy — status stale, endDate 2026-09-22 passed — addressed in commit `7490f7e0`, closes #1013
- category: data
- filed: 2026-09-25 by group-buy-status-check.mjs
- impact: 4 (buy shows status "announced" but endDate 2026-09-22 has passed — data hygiene gap)
- ease: 9 (update status field to 'closed' in data/group-buys/divinikey-gmk-cyl-just-beachy.json)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/divinikey-gmk-cyl-just-beachy.json
- action: update status from 'announced' to 'closed' in data/group-buys/divinikey-gmk-cyl-just-beachy.json
- issue: #1013
> **Resolved (2026-10-01):** flipped status to "closed", bumped updatedAt, regenerated data-runtime/OG manifests + search index. `pnpm verify` full gate green: typecheck, lint, 862/862 unit tests, 230/230 script tests, data:validate (89 records), build, size, 1280/1280 e2e.
> Picked as the top signal this tick: no unlabeled GitHub issues (triage gate); not Monday-relevant (W40 snapshot already existed); no pending phases/data-backlog work; content-gap queue empty (`content-gap-survey.mjs` — "all pillars comfortable") and all 6 other mechanical surveys re-ran clean, no rows filed. March's own expand Step 3c gate not met (0 commits since pass 435's own commit, well under the 20-commit/48h threshold). This row and its sibling `divinikey-gmk-cyl-orange-alert` row were the only two Pending AUDIT rows scoring ≥ 3.0 (both 3.6, tied); picked this one by file order, one-fix-per-tick rule applies — the sibling remains for the next tick.

### [x] [data] [3.6] divinikey-gmk-cyl-orange-alert — status stale, endDate 2026-09-14 passed — addressed in commit `efc47fa6`, closes #1015
- category: data
- filed: 2026-09-25 by group-buy-status-check.mjs
- impact: 4 (buy shows status "live" but endDate 2026-09-14 has passed — data hygiene gap)
- ease: 9 (update status field to 'closed' in data/group-buys/divinikey-gmk-cyl-orange-alert.json)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/divinikey-gmk-cyl-orange-alert.json
- action: update status from 'live' to 'closed' in data/group-buys/divinikey-gmk-cyl-orange-alert.json
- issue: #1015
> **Resolved (2026-10-02):** flipped status to "closed", bumped updatedAt, regenerated data-runtime/OG manifests + search index. `pnpm verify` full gate green: typecheck, lint, 862/862 unit tests, 230/230 script tests, data:validate (89 records), build, size, 1280/1280 e2e.
> Picked as the top signal this tick: no unlabeled GitHub issues (triage gate); not Monday-relevant (W40 snapshot already existed); no pending phases/data-backlog work; content-gap queue empty (`content-gap-survey.mjs` — "all pillars comfortable") and all 6 other mechanical surveys re-ran clean, no rows filed. March's own expand Step 3c gate not met (3 commits/~15h since pass 435's own commit, well under the 20-commit/48h threshold). This was the only Pending AUDIT row scoring ≥ 3.0 — the sibling `divinikey-gmk-cyl-just-beachy` row was already drained in the prior tick.

### [x] [user-issue #1007] [ci] [5.6] heartbeat.yml's flatline alarm fired a THIRD false positive (#1010) — the fix from this row's own action item still hasn't shipped — addressed in `bde7f7fc`
- category: ci
- filed: 2026-09-28 by digest pulse review; escalated 2026-09-29 by digest pulse review
- impact: 8 (a third recurrence of the identical false alarm, 2026-09-29T12:48Z's #1010, one day after this row was filed with the fix already diagnosed — the alarm is now actively misleading rather than merely occasionally wrong, and nobody has shipped the one-line query fix this row already specified)
- ease: 7 (root cause is isolated to one query; the fix is scoped to `.github/workflows/heartbeat.yml`'s `check_hours_since_last_march` helper — unchanged from the original diagnosis, still unshipped)
- score: 5.6 (impact × ease / 10)
- issue: #1007 (#1010 closed as duplicate this tick, evidence below)
- evidence: issue body reports "No completed march tick in 418h ... confirmed across two reads ~60s apart" (created 2026-09-28T13:48:03Z). `gh run list --workflow march -L 5` at digest time shows unbroken ~3-7h-apart successful ticks through `2026-09-28T10:29:19Z→10:45:02Z` — no gap anywhere near 418h. Reproduced the failure mode live: running `gh run list --workflow march --status completed -L 1 --json updatedAt,createdAt,databaseId` five times back-to-back (2s apart) returned the correct latest run (`36409997307`, `2026-09-28T10:29:19Z→10:45:02Z`) on 4 of 5 calls and a wildly stale run (`34556078000`, `2026-09-11T02:49:11Z→02:52:28Z` — 17 days old, ~408h, matching the issue's reported ~418h gap) on 1 of 5 — a ~20% miss rate for this exact query, right now, against no other variable than call timing.
- hypothesis: `--status completed` likely routes through a different (search-indexed, eventually-consistent) backend path than an unfiltered `gh run list`, and that path can return a stale-but-internally-consistent old run instead of erroring or returning nothing. The 2026-09-26 fix (`1e225605`) assumed the failure mode was "a single transient/empty read," so it added a 60s-later retry of the *same* query — but if the flaky path returns the *same* wrong answer on both reads (not implausible at a ~20% single-call miss rate, and plausible if there's any caching behind the search index), the debounce just confirms the false positive instead of catching it, which is exactly what happened here.
- action: change the query, not just the retry cadence. Options: (a) drop `--status completed` and instead pull `-L 5` unfiltered, sort client-side by `createdAt` descending, and take the newest entry with `conclusion == "success"`; (b) cross-check against a second independent signal (e.g. `gh api repos/{owner}/{repo}/actions/workflows/march.yml/runs?status=completed&per_page=1`); (c) if the flakiness turns out to be time-correlated rather than request-correlated, widen the debounce window (5-10 minutes instead of 60s) — but the live reproduction above was request-correlated (repeat calls seconds apart, no delay), which favors (a). Close #1007 in the fix commit.
> **Resolved (2026-09-29, commit `bde7f7fc`):** shipped option (a) — `check_hours_since_last_march` in `.github/workflows/heartbeat.yml` now pulls `gh run list --workflow march -L 5` unfiltered (no `--status completed`), sorts client-side by `createdAt` descending, and takes the newest run with `conclusion == "success"`. Verified 3 back-to-back calls against the live repo return the same, correct timestamp (`2026-09-29T11:14:54Z`). GitHub issue #1007 was already closed (filed as a false-alarm duplicate by the 2026-09-28 digest pass) — no `Closes #N` trailer needed. `pnpm verify` full gate green: typecheck, lint, 862/862 unit tests, 230/230 script tests, data:validate (89 records), build, size, 1277/1277 e2e — run as sequential foreground legs per cloud-mode rules after the combined `pnpm verify` call exceeded the tool's 600s timeout and auto-backgrounded (stopped and re-run leg-by-leg per the cloud-mode "never background the gate" rule).
> Escalated 2026-09-29 via `/digest` pulse review — #1010 ("No completed march tick in 441h", created 2026-09-29T12:48:18Z) is a third instance of this exact false positive; `.github/workflows/heartbeat.yml` still reads `gh run list --workflow march --status completed -L 1` (unchanged since #1007 was filed), confirming the fix was never shipped. Reproduced live at digest time: 5 back-to-back calls to the same query all returned the correct latest run (`36559233498`, `2026-09-29T11:02:03Z→11:14:54Z`); `gh run list --workflow march -L 30` shows 30/30 success with no gap wider than ~7h across 2026-09-27→2026-09-29. march was never down. Closed #1010 as a duplicate false alarm with this evidence. Not autonomously fixable by the digest (notes-only commit) — routed to the next `/iterate` tick with impact bumped from 6→8 given the third occurrence and the fact that this row's own diagnosed fix has now sat unshipped through two more false alarms.
> Filed 2026-09-28 via `/digest` pulse review — `march` was never actually down; this is entirely a monitoring-layer bug. Not autonomously fixable by the digest (notes-only commit); routed to the next `/iterate` tick. Issue `#1007` closed this digest tick with the evidence above so the existing-issue dedupe in `heartbeat.yml` doesn't suppress the next alarm (real or false).

### [x] [content-gap] [7] news pillar — 1 of ≥2 articles in last 30d — addressed in 742493ee, closes #1009
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: news
- window-count: 1
- window-start: 2026-08-30
- score: 7
- next: /ship-content → news pillar article
- issue: #1009
> Filed 2026-09-29 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-09-29):** shipped `wooting-80he-plus-shipping-update.mdx` (publishedAt 2026-09-18, gap-fill midpoint of the 22-day gap between `keychron-q16-he-8k-ceramic-tmr` on 2026-09-07 and today's sentinel) — hard-news piece on the 80HE+ preorder's two-wave shipping timeline (ABS/Module late October 2026, zinc + Lekker Knob Large mid-December 2026), grounded in Wooting's own blog post and product page plus thock's 2026-W40 tracker "Wooting" brand row. News pillar now carries a fresh anchor well inside the 30-day window. `pnpm verify` full gate green: typecheck, lint, unit tests, script tests, data:validate, build, size, 1277/1277 e2e.

### [x] [HOT PURSUIT] [content-gap] [7] trends pillar — 1 of ≥2 articles in last 30d — addressed in 87196ca6, closes #1011
- category: content-gaps
- impact: 8 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: trends
- window-count: 1
- window-start: 2026-08-31
- score: 7
- next: /ship-content → trends pillar article
- issue: #1011
> Filed 2026-09-30 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-10-01):** shipped `gmk-cyl-red-devils-r2-comeback.mdx` (publishedAt 2026-09-10, gap-fill midpoint of the 18-day gap between the 30-day-window sentinel and `wooting-rapid-trigger-head-start` on 2026-09-19) — trends-analysis piece on GMK CYL Red Devils' six-years-later re-run drawing an unusually sustained eight-week tracker climb (10→68), grounded in the 2026-W40 tracker note's football-fandom-crossover read and the joint Omnitype/Keebz N Cables group buy (Sept 14–Oct 10, 2026, Q1 2027 ship estimate). Trends pillar now carries a fresh anchor well inside the 30-day window. `pnpm verify` full gate green: typecheck, lint, 862/862 unit tests, 230/230 script tests, data:validate, build, size, 1280/1280 e2e.

### [x] [cross-links] [4.5] gmk-cyl-red-devils-r2-comeback ↔ dcs-grass-valley-decline — no prose cross-link (same pillar, ≥2 shared tags: keycaps, group-buy, trends-2026) — addressed in commit `c4e78b7a`, closes #1012
- category: cross-links
- filed: 2026-10-01 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, group-buy, trends-2026
- article-a: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- article-b: apps/web/src/content/articles/dcs-grass-valley-decline.mdx
- action: add [dcs-grass-valley-decline](/article/dcs-grass-valley-decline) to gmk-cyl-red-devils-r2-comeback body, or vice versa
- issue: #1012
> **Resolved (2026-10-01):** drained as part of the 5-pair cluster for hub `gmk-cyl-red-devils-r2-comeback` (Phase 46 cluster-aware drain). Linked in the "What to watch" section, contrasting Red Devils' still-climbing shape with Grass Valley's clean post-close momentum transfer. See commit `c4e78b7a`.

### [x] [cross-links] [4.5] gmk-cyl-red-devils-r2-comeback ↔ dcs-olivetti-comeback — no prose cross-link (same pillar, ≥2 shared tags: keycaps, cherry-profile, trends-2026) — addressed in commit `c4e78b7a`, closes #1012
- category: cross-links
- filed: 2026-10-01 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, cherry-profile, trends-2026
- article-a: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- article-b: apps/web/src/content/articles/dcs-olivetti-comeback.mdx
- action: add [dcs-olivetti-comeback](/article/dcs-olivetti-comeback) to gmk-cyl-red-devils-r2-comeback body, or vice versa
- issue: #1012
> **Resolved (2026-10-01):** drained as part of the 5-pair cluster for hub `gmk-cyl-red-devils-r2-comeback` (Phase 46 cluster-aware drain). Linked in the "Reading the climb" section as a comparable multi-year-gap revival with a sustained climb. See commit `c4e78b7a`.

### [x] [cross-links] [4.5] gmk-cyl-red-devils-r2-comeback ↔ gmk-cyl-og-extensions-interest-check — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, cherry-profile, trends-2026) — addressed in commit `c4e78b7a`, closes #1012
- category: cross-links
- filed: 2026-10-01 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, cherry-profile, trends-2026
- article-a: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-og-extensions-interest-check.mdx
- action: add [gmk-cyl-og-extensions-interest-check](/article/gmk-cyl-og-extensions-interest-check) to gmk-cyl-red-devils-r2-comeback body, or vice versa
- issue: #1012
> **Resolved (2026-10-01):** drained as part of the 5-pair cluster for hub `gmk-cyl-red-devils-r2-comeback` (Phase 46 cluster-aware drain). Linked in the "Reading the climb" section alongside dcs-olivetti-comeback as a matching unbroken-climb precedent. See commit `c4e78b7a`.

### [x] [cross-links] [4.5] gmk-cyl-red-devils-r2-comeback ↔ gmk-cyl-ta-neo-production-tracking — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, cherry-profile, group-buy, trends-2026) — addressed in commit `c4e78b7a`, closes #1012
- category: cross-links
- filed: 2026-10-01 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, cherry-profile, group-buy, trends-2026
- article-a: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-ta-neo-production-tracking.mdx
- action: add [gmk-cyl-ta-neo-production-tracking](/article/gmk-cyl-ta-neo-production-tracking) to gmk-cyl-red-devils-r2-comeback body, or vice versa
- issue: #1012
> **Resolved (2026-10-01):** drained as part of the 5-pair cluster for hub `gmk-cyl-red-devils-r2-comeback` (Phase 46 cluster-aware drain). Linked in the "What to watch" section, contrasting Red Devils' still-climbing shape with TA Neo's three-week post-close cooldown. See commit `c4e78b7a`.

### [x] [cross-links] [4.5] gmk-cyl-red-devils-r2-comeback ↔ prototypist-vendor-spotlight — no prose cross-link (same pillar, ≥2 shared tags: group-buy, trends-2026) — addressed in commit `c4e78b7a`, closes #1012
- category: cross-links
- filed: 2026-10-01 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: group-buy, trends-2026
- article-a: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- article-b: apps/web/src/content/articles/prototypist-vendor-spotlight.mdx
- action: add [prototypist-vendor-spotlight](/article/prototypist-vendor-spotlight) to gmk-cyl-red-devils-r2-comeback body, or vice versa
- issue: #1012
> **Resolved (2026-10-01):** drained as part of the 5-pair cluster for hub `gmk-cyl-red-devils-r2-comeback` (Phase 46 cluster-aware drain). Linked in the "joint Omnitype / Keebz N Cables run" section, noting Prototypist's own multi-vendor fulfillment track record as a parallel. See commit `c4e78b7a`.

### [x] [docs] [2.7] `.nvmrc`/`engines.node` (20) drifted from CI's `node-version` 22 — addressed in this commit, closes #1016
- category: docs
- filed: 2026-10-02 by cloud /iterate audit (mirrored as issue #1016; the mirroring tick ended before writing this row or shipping the fix — same orphaned-mirror pattern as the standing `[needs-user-call]` "mirrored-issue drain gap" row; caught this tick while reading open GitHub issues as an `/expand` triage-backlog signal)
- impact: 3 (`.nvmrc` pins Node 20 and `package.json`'s `engines.node` floor read `>=20.10.0`, but both cloud workflows — `march.yml`, `night.yml` — have pinned `node-version: 22` since the cloud loop was introduced, and every commit shipped through the loop has actually been verified on 22, not 20; a developer running `nvm use` locally gets a different runtime than CI)
- ease: 9 (three one-line edits: `.nvmrc`, `package.json` engines floor, `bearings.md` tree-comment)
- score: 2.7 (impact × ease / 10)
- evidence: `.nvmrc` → `20`; `package.json` → `"node": ">=20.10.0"`; `plan/bearings.md:122` → `# node 20`; `.github/workflows/march.yml:60` and `.github/workflows/night.yml:44` → `node-version: 22`
- next: bump `.nvmrc` to `22`, `package.json` engines floor to `>=22`, fix the `bearings.md` tree comment
- issue: #1016
> **Resolved (2026-10-02):** bumped `.nvmrc` to `22`, `package.json`'s `engines.node` to `>=22`, and `plan/bearings.md:122`'s tree comment to `# node 22` — aligning local dev with the Node version actually battle-tested across hundreds of green CI runs. `march.yml`/`night.yml` untouched (already correct). Also closed duplicate orphaned mirror issue #1014 (same underlying `divinikey-gmk-cyl-orange-alert` stale-status finding as #1015, which the actual fix commit `efc47fa6` already closed — #1014 was a same-day duplicate mirror from an earlier tick that never got the `- issue: #N` field written back before dying, leaving it un-drained).

### [x] [HOT PURSUIT] [content-gap] [7] deep-dives pillar — 1 of ≥2 articles in last 30d — addressed in c3bce9e7, closes #1018
- category: content-gaps
- impact: 6 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: deep-dives
- window-count: 1
- window-start: 2026-09-03
- score: 7
- next: /ship-content → deep-dives pillar article
- issue: #1018
> Filed 2026-10-03 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-10-10):** shipped `tmr-switches-deep-dive.mdx` — a mechanism explainer on Tunnel Magnetoresistance switch sensing (tunnel-junction physics vs. standard Hall-effect sensing, sensitivity/noise-floor tradeoffs, and what the headroom buys rapid-trigger firmware), the deep-dive counterpart to the existing Hall-effect deep dive and two TMR product news pieces that never explained the underlying mechanism. `publishedAt` gap-filled to 2026-09-27 (largest gap in the 30-day window, 2026-09-15 to 2026-10-10). Language gate, mentionedParts gate both clean. `pnpm verify` full gate green: typecheck, lint, unit + script tests, data:validate, build, size, 1292/1292 e2e.

### [x] [newsletter] [4.0] Weekly digest — issue 012 due (7 days since issue 11) — addressed in `600a9ec6`, closes #1019
- category: content-gaps
- filed: 2026-10-03 by newsletter-gap-survey.mjs
- impact: 5 (newsletter archive going stale reduces /newsletter value and reader trust in cadence)
- ease: 8 (content-curator weekly round-up: 5 pillar picks + tracker insight)
- score: 4.0 (impact × ease / 10)
- next: /ship-content → newsletter type (weekly round-up, 5 pillar picks, tracker insight)
- last-issue: 2026-09-26 (thock-weekly-011)
- days-since: 7
- issue: #1019
> Filed 2026-10-03 by newsletter-gap-survey.mjs. 7 days since issue 11. Threshold: ≥7 calendar days.
> **Resolved (2026-10-20, cloud /march):** shipped `thock-weekly-012.mdx` — 5 pillar picks (artisan-keycaps-buying-guide, synthwave-tkl-theme-build, tmr-switches-five-week-climb, gmk-cyl-zombie-group-buy, tmr-switches-deep-dive) plus a 2026-W42 tracker check-in (Hall-effect ceiling, Keychron flat 100, Split/Ergo flat 100, Mode Designs' post-fulfillment dip). `publishedAt` 2026-10-20 — today, the cadence-due date itself, not a gap-fill (newsletter issues anchor to their ship date). Language gate clean; mentionedParts/cross-link gates don't apply to newsletter MDX (strict schema has no `mentionedParts`/`tags` fields). `pnpm verify` full gate green: typecheck, lint, 862 unit tests, 230 script tests, data:validate, build, size, 1313/1313 e2e.

### [x] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in c29438f0, closes #1020
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-09-07
- score: 7
- next: /ship-content → guides pillar article
- issue: #1020
> Filed 2026-10-07 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-10-10):** shipped `switch-actuation-weight-buying-guide.mdx` — a guides-pillar buying guide explaining actuation vs bottom-out gram weights, grounded in 5 catalog switches (Gateron Magnetic Jade, Cherry MX2A Red, Durock T1, Kailh Box Jade, C3 Equalz Tangerine R2). `publishedAt` gap-filled to 2026-10-01 (largest gap in the 30-day window, 2026-09-22 to 2026-10-10). Language gate, mentionedParts gate both clean. `pnpm verify` full gate green: typecheck, lint, unit + script tests, data:validate, build, size, 1289/1289 e2e.

### [x] [cross-links] [4.5] switch-actuation-weight-buying-guide ↔ beginners-switch-buying-guide — no prose cross-link (same pillar, ≥2 shared tags: linear, tactile, clicky, beginner)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, tactile, clicky, beginner
- article-a: apps/web/src/content/articles/switch-actuation-weight-buying-guide.mdx
- article-b: apps/web/src/content/articles/beginners-switch-buying-guide.mdx
- action: add [beginners-switch-buying-guide](/article/beginners-switch-buying-guide) to switch-actuation-weight-buying-guide body, or vice versa
- addressed in: 10f0ee9a (hub-clustered drain, switch-actuation-weight-buying-guide cross-links — 1 pair; the only pending row for this hub)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ cherry-mx2a-revision — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/cherry-mx2a-revision.mdx
- action: add [cherry-mx2a-revision](/article/cherry-mx2a-revision) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ clicky-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/clicky-switches-deep-dive.mdx
- action: add [clicky-switches-deep-dive](/article/clicky-switches-deep-dive) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ gateron-lanes-tactile-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-lanes-tactile-deep-dive.mdx
- action: add [gateron-lanes-tactile-deep-dive](/article/gateron-lanes-tactile-deep-dive) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ gateron-magnetic-jade-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: magnetic, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: magnetic, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-magnetic-jade-deep-dive.mdx
- action: add [gateron-magnetic-jade-deep-dive](/article/gateron-magnetic-jade-deep-dive) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ hmx-cloud-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- action: add [hmx-cloud-deep-dive](/article/hmx-cloud-deep-dive) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ keyboard-acoustics-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/keyboard-acoustics-deep-dive.mdx
- action: add [keyboard-acoustics-deep-dive](/article/keyboard-acoustics-deep-dive) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [cross-links] [4.5] tmr-switches-deep-dive ↔ optical-switches-explained — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- article-b: apps/web/src/content/articles/optical-switches-explained.mdx
- action: add [optical-switches-explained](/article/optical-switches-explained) to tmr-switches-deep-dive body, or vice versa
- addressed in: 6b5fb51e (hub-clustered drain, tmr-switches-deep-dive cross-links — 7 pairs)

### [x] [HOT PURSUIT] [content-gap] [7] news pillar — 1 of ≥2 articles in last 30d — addressed in 65b30e52, closes #1021
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: news
- window-count: 1
- window-start: 2026-09-10
- score: 7
- next: /ship-content → news pillar article
- issue: #1021
> Filed 2026-10-10 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ divinikey-dcs-dolch-group-buy — no prose cross-link (same pillar, ≥2 shared tags: keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/divinikey-dcs-dolch-group-buy.mdx
- action: add [divinikey-dcs-dolch-group-buy](/article/divinikey-dcs-dolch-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ divinikey-gmk-cyl-orange-alert-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/divinikey-gmk-cyl-orange-alert-group-buy.mdx
- action: add [divinikey-gmk-cyl-orange-alert-group-buy](/article/divinikey-gmk-cyl-orange-alert-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-greg-2-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-greg-2-group-buy.mdx
- action: add [gmk-cyl-greg-2-group-buy](/article/gmk-cyl-greg-2-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-ishtar-r2-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-ishtar-r2-group-buy.mdx
- action: add [gmk-cyl-ishtar-r2-group-buy](/article/gmk-cyl-ishtar-r2-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-just-beachy-group-buy-opens — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-just-beachy-group-buy-opens.mdx
- action: add [gmk-cyl-just-beachy-group-buy-opens](/article/gmk-cyl-just-beachy-group-buy-opens) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-king-of-the-seas-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-king-of-the-seas-group-buy.mdx
- action: add [gmk-cyl-king-of-the-seas-group-buy](/article/gmk-cyl-king-of-the-seas-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-masterpiece-r2-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-masterpiece-r2-group-buy.mdx
- action: add [gmk-cyl-masterpiece-r2-group-buy](/article/gmk-cyl-masterpiece-r2-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-pandemonium-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-pandemonium-group-buy.mdx
- action: add [gmk-cyl-pandemonium-group-buy](/article/gmk-cyl-pandemonium-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-prussian-alert — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-prussian-alert.mdx
- action: add [gmk-cyl-prussian-alert](/article/gmk-cyl-prussian-alert) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-ramune-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-ramune-group-buy.mdx
- action: add [gmk-cyl-ramune-group-buy](/article/gmk-cyl-ramune-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gmk-cyl-selene-group-buy — no prose cross-link (same pillar, ≥2 shared tags: gmk, keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gmk, keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gmk-cyl-selene-group-buy.mdx
- action: add [gmk-cyl-selene-group-buy](/article/gmk-cyl-selene-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [cross-links] [4.5] gmk-cyl-zombie-group-buy ↔ gsk-sweet-nightmare-group-buy — no prose cross-link (same pillar, ≥2 shared tags: keycaps, group-buy) — addressed in a31bd8cc
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, group-buy
- article-a: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- article-b: apps/web/src/content/articles/gsk-sweet-nightmare-group-buy.mdx
- action: add [gsk-sweet-nightmare-group-buy](/article/gsk-sweet-nightmare-group-buy) to gmk-cyl-zombie-group-buy body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] trends pillar — 1 of ≥2 articles in last 30d — addressed in 06336a7e, closes #1022
- category: content-gaps
- impact: 8 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: trends
- window-count: 1
- window-start: 2026-09-12
- score: 7
- next: /ship-content → trends pillar article
- issue: #1022
> Filed 2026-10-12 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] tmr-switches-five-week-climb ↔ hall-effect-mainstream — no prose cross-link (same pillar, ≥2 shared tags: magnetic, hall-effect) — addressed in commit `6ef0321b`
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: magnetic, hall-effect
- article-a: apps/web/src/content/articles/tmr-switches-five-week-climb.mdx
- article-b: apps/web/src/content/articles/hall-effect-mainstream.mdx
- action: add [hall-effect-mainstream](/article/hall-effect-mainstream) to tmr-switches-five-week-climb body, or vice versa

### [x] [cross-links] [4.5] tmr-switches-five-week-climb ↔ keychron-nova-socket-hybrid — no prose cross-link (same pillar, ≥2 shared tags: tmr, magnetic, keychron) — addressed in commit `6ef0321b`
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: tmr, magnetic, keychron
- article-a: apps/web/src/content/articles/tmr-switches-five-week-climb.mdx
- article-b: apps/web/src/content/articles/keychron-nova-socket-hybrid.mdx
- action: add [keychron-nova-socket-hybrid](/article/keychron-nova-socket-hybrid) to tmr-switches-five-week-climb body, or vice versa

### [x] [cross-links] [4.5] tmr-switches-five-week-climb ↔ wooting-rapid-trigger-head-start — no prose cross-link (same pillar, ≥2 shared tags: hall-effect, rapid-trigger) — addressed in commit `6ef0321b`
- category: cross-links
- filed: 2026-10-12 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: hall-effect, rapid-trigger
- article-a: apps/web/src/content/articles/tmr-switches-five-week-climb.mdx
- article-b: apps/web/src/content/articles/wooting-rapid-trigger-head-start.mdx
- action: add [wooting-rapid-trigger-head-start](/article/wooting-rapid-trigger-head-start) to tmr-switches-five-week-climb body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] ideas pillar — 1 of ≥2 articles in last 30d — addressed in 392f5a52, closes #1023
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ideas
- window-count: 1
- window-start: 2026-09-12
- score: 7
- next: /ship-content → ideas pillar article
- issue: #1023
> Filed 2026-10-12 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> Resolved (2026-10-13): shipped `synthwave-tkl-theme-build.mdx` (publishedAt 2026-10-02, gap-fill midpoint of the 21-day gap between `bento-box-theme-build` on 2026-09-22 and today) — "Build of the week: the Drop CTRL goes synthwave under GMK Laser and Ink V2 Yellow." Ideas now carries a fresh anchor well inside the 30-day window. `pnpm verify` full gate green: typecheck, lint, unit tests, script tests, data:validate, build, size, 1304/1304 e2e.

### [x] [cross-links] [4.5] synthwave-tkl-theme-build ↔ bento-box-theme-build — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, cherry-profile) — addressed in 92bc389d, closes #1035
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, cherry-profile
- article-a: apps/web/src/content/articles/synthwave-tkl-theme-build.mdx
- article-b: apps/web/src/content/articles/bento-box-theme-build.mdx
- action: add [bento-box-theme-build](/article/bento-box-theme-build) to synthwave-tkl-theme-build body, or vice versa

### [x] [cross-links] [4.5] synthwave-tkl-theme-build ↔ building-mode-sonnet-with-oil-kings — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, linear) — addressed in 92bc389d, closes #1035
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, linear
- article-a: apps/web/src/content/articles/synthwave-tkl-theme-build.mdx
- article-b: apps/web/src/content/articles/building-mode-sonnet-with-oil-kings.mdx
- action: add [building-mode-sonnet-with-oil-kings](/article/building-mode-sonnet-with-oil-kings) to synthwave-tkl-theme-build body, or vice versa

### [x] [cross-links] [4.5] synthwave-tkl-theme-build ↔ mission-control-theme-build — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, tkl) — addressed in 92bc389d, closes #1035
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, tkl
- article-a: apps/web/src/content/articles/synthwave-tkl-theme-build.mdx
- article-b: apps/web/src/content/articles/mission-control-theme-build.mdx
- action: add [mission-control-theme-build](/article/mission-control-theme-build) to synthwave-tkl-theme-build body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in bad0b566, closes #1024
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-09-13
- score: 7
- next: /ship-content → guides pillar article
- issue: #1024
> **Resolved (2026-10-13):** shipped `apps/web/src/content/articles/artisan-keycaps-buying-guide.mdx` (~1550 words, guides pillar, publishedAt 2026-10-09T14:00:00.000Z gap-fill — largest gap in the rolling 30-day window). Hero SVG at `/hero-art/artisan-keycaps-buying-guide.svg` (muted terracotta splash, annotated keycap row with the artisan accent cap called out). 3 InlineViz SVGs (mass-produced vs. artisan comparison matrix, MX/Alps/low-profile stem cross-sections, entry/mid/grail pricing ladder). New tag `artisan` (misc) added to tags.json. Language gate + mentionedParts gate clean. `pnpm verify` full gate green: typecheck, lint, unit tests, data:validate, build, size, 1310/1310 e2e.
> Filed 2026-10-13 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] artisan-keycaps-buying-guide ↔ ansi-iso-jis-keyboard-layout-guide — no prose cross-link (same pillar, ≥2 shared tags: keycaps, beginner) — addressed in 48165030
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, beginner
- article-a: apps/web/src/content/articles/artisan-keycaps-buying-guide.mdx
- article-b: apps/web/src/content/articles/ansi-iso-jis-keyboard-layout-guide.mdx
- action: add [ansi-iso-jis-keyboard-layout-guide](/article/ansi-iso-jis-keyboard-layout-guide) to artisan-keycaps-buying-guide body, or vice versa
- issue: [mirror-failed: 2026-10-25T10:51:00Z] (GH_REPO/GH_TOKEN unavailable — no .env in cloud runner)

### [x] [cross-links] [4.5] artisan-keycaps-buying-guide ↔ keycap-materials-compared — no prose cross-link (same pillar, ≥2 shared tags: keycaps, beginner) — addressed in 48165030
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, beginner
- article-a: apps/web/src/content/articles/artisan-keycaps-buying-guide.mdx
- article-b: apps/web/src/content/articles/keycap-materials-compared.mdx
- action: add [keycap-materials-compared](/article/keycap-materials-compared) to artisan-keycaps-buying-guide body, or vice versa
- issue: [mirror-failed: 2026-10-25T10:51:00Z] (GH_REPO/GH_TOKEN unavailable — no .env in cloud runner)

### [x] [cross-links] [4.5] artisan-keycaps-buying-guide ↔ keycap-profiles-compared — no prose cross-link (same pillar, ≥2 shared tags: keycaps, beginner) — addressed in 48165030
- category: cross-links
- filed: 2026-10-13 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: keycaps, beginner
- article-a: apps/web/src/content/articles/artisan-keycaps-buying-guide.mdx
- article-b: apps/web/src/content/articles/keycap-profiles-compared.mdx
- action: add [keycap-profiles-compared](/article/keycap-profiles-compared) to artisan-keycaps-buying-guide body, or vice versa
- issue: [mirror-failed: 2026-10-25T10:51:00Z] (GH_REPO/GH_TOKEN unavailable — no .env in cloud runner)

### [x] [HOT PURSUIT] [content-gap] [7] deep-dives pillar — 1 of ≥2 articles in last 30d — addressed in edb1df91, closes #1029
- category: content-gaps
- impact: 6 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: deep-dives
- window-count: 1
- window-start: 2026-09-20
- score: 7
- next: /ship-content → deep-dives pillar article
- issue: #1029
> Filed 2026-10-20 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ buckling-spring-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: tactile, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: tactile, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/buckling-spring-deep-dive.mdx
- action: add [buckling-spring-deep-dive](/article/buckling-spring-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ cherry-mx2a-revision — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/cherry-mx2a-revision.mdx
- action: add [cherry-mx2a-revision](/article/cherry-mx2a-revision) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ clicky-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/clicky-switches-deep-dive.mdx
- action: add [clicky-switches-deep-dive](/article/clicky-switches-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ gazzew-boba-family-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: tactile, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: tactile, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/gazzew-boba-family-deep-dive.mdx
- action: add [gazzew-boba-family-deep-dive](/article/gazzew-boba-family-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ hmx-cloud-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- action: add [hmx-cloud-deep-dive](/article/hmx-cloud-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ keyboard-acoustics-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/keyboard-acoustics-deep-dive.mdx
- action: add [keyboard-acoustics-deep-dive](/article/keyboard-acoustics-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ magnetic-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/magnetic-switches-deep-dive.mdx
- action: add [magnetic-switches-deep-dive](/article/magnetic-switches-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ optical-switches-explained — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/optical-switches-explained.mdx
- action: add [optical-switches-explained](/article/optical-switches-explained) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [cross-links] [4.5] tactile-stem-geometry-deep-dive ↔ tmr-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: switches, deep-dive)
- category: cross-links
- filed: 2026-10-22 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, deep-dive
- article-a: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- article-b: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- action: add [tmr-switches-deep-dive](/article/tmr-switches-deep-dive) to tactile-stem-geometry-deep-dive body, or vice versa
- addressed in: 412a00c9 (hub-clustered drain, tactile-stem-geometry-deep-dive cross-links — 9 pairs)

### [x] [HOT PURSUIT] [content-gap] [7] trends pillar — 1 of ≥2 articles in last 30d — addressed in 415779ea (closes #1030)
- category: content-gaps
- impact: 8 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: trends
- window-count: 1
- window-start: 2026-09-22
- score: 7
- next: /ship-content → trends pillar article
- issue: #1030
> Filed 2026-10-22 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [HOT PURSUIT] [content-gap] [7] news pillar — 1 of ≥2 articles in last 30d — addressed in 82b1b80e, closes #1031
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: news
- window-count: 1
- window-start: 2026-09-22
- score: 7
- next: /ship-content → news pillar article
- issue: #1031
> Filed 2026-10-22 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [HOT PURSUIT] [content-gap] [7] ideas pillar — 1 of ≥2 articles in last 30d — addressed in e944eaa6, closes #1033
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ideas
- window-count: 1
- window-start: 2026-09-23
- score: 7
- next: /ship-content → ideas pillar article
- issue: #1033
> Filed 2026-10-23 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] cannonkeys-mass80-extras-restock ↔ cannonkeys-blaine-v2-se-group-buy — no prose cross-link (same pillar, ≥2 shared tags: cannonkeys, group-buy) — addressed in 89dd8a9c, closes #1037
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: cannonkeys, group-buy
- article-a: apps/web/src/content/articles/cannonkeys-mass80-extras-restock.mdx
- article-b: apps/web/src/content/articles/cannonkeys-blaine-v2-se-group-buy.mdx
- action: add [cannonkeys-blaine-v2-se-group-buy](/article/cannonkeys-blaine-v2-se-group-buy) to cannonkeys-mass80-extras-restock body, or vice versa
- issue: #1037

### [x] [cross-links] [4.5] cannonkeys-mass80-extras-restock ↔ cannonkeys-nyawice-group-buy — no prose cross-link (same pillar, ≥2 shared tags: cannonkeys, group-buy) — addressed in 89dd8a9c, closes #1037
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: cannonkeys, group-buy
- article-a: apps/web/src/content/articles/cannonkeys-mass80-extras-restock.mdx
- article-b: apps/web/src/content/articles/cannonkeys-nyawice-group-buy.mdx
- action: add [cannonkeys-nyawice-group-buy](/article/cannonkeys-nyawice-group-buy) to cannonkeys-mass80-extras-restock body, or vice versa
- issue: #1037

### [x] [cross-links] [4.5] cannonkeys-mass80-extras-restock ↔ mode-sonnet-r2-group-buy-coverage — no prose cross-link (same pillar, ≥2 shared tags: cannonkeys, group-buy) — addressed in 89dd8a9c, closes #1037
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: cannonkeys, group-buy
- article-a: apps/web/src/content/articles/cannonkeys-mass80-extras-restock.mdx
- article-b: apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx
- action: add [mode-sonnet-r2-group-buy-coverage](/article/mode-sonnet-r2-group-buy-coverage) to cannonkeys-mass80-extras-restock body, or vice versa
- issue: #1037

### [x] [cross-links] [4.5] cannonkeys-mass80-extras-restock ↔ wuque-studio-summer-update — no prose cross-link (same pillar, ≥2 shared tags: vendor, group-buy) — addressed in 89dd8a9c, closes #1037
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: vendor, group-buy
- article-a: apps/web/src/content/articles/cannonkeys-mass80-extras-restock.mdx
- article-b: apps/web/src/content/articles/wuque-studio-summer-update.mdx
- action: add [wuque-studio-summer-update](/article/wuque-studio-summer-update) to cannonkeys-mass80-extras-restock body, or vice versa
- issue: #1037

### [x] [cross-links] [4.5] frankenswitching-explained ↔ holee-mod-explained — no prose cross-link (same pillar, ≥2 shared tags: modding, switches) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, switches
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/holee-mod-explained.mdx
- action: add [holee-mod-explained](/article/holee-mod-explained) to frankenswitching-explained body, or vice versa

### [x] [cross-links] [4.5] frankenswitching-explained ↔ lubing-switches-guide — no prose cross-link (same pillar, ≥2 shared tags: modding, switches, linear, tactile) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, switches, linear, tactile
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/lubing-switches-guide.mdx
- action: add [lubing-switches-guide](/article/lubing-switches-guide) to frankenswitching-explained body, or vice versa

### [x] [cross-links] [4.5] frankenswitching-explained ↔ stabilizer-servicing-guide — no prose cross-link (same pillar, ≥2 shared tags: modding, linear) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, linear
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/stabilizer-servicing-guide.mdx
- action: add [stabilizer-servicing-guide](/article/stabilizer-servicing-guide) to frankenswitching-explained body, or vice versa

### [x] [cross-links] [4.5] frankenswitching-explained ↔ switch-films-worth-it — no prose cross-link (same pillar, ≥2 shared tags: modding, switches, linear, tactile) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, switches, linear, tactile
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/switch-films-worth-it.mdx
- action: add [switch-films-worth-it](/article/switch-films-worth-it) to frankenswitching-explained body, or vice versa

### [x] [cross-links] [4.5] frankenswitching-explained ↔ tape-mod — no prose cross-link (same pillar, ≥2 shared tags: modding, linear) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, linear
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/tape-mod.mdx
- action: add [tape-mod](/article/tape-mod) to frankenswitching-explained body, or vice versa

### [x] [cross-links] [4.5] frankenswitching-explained ↔ typing-tests-lie — no prose cross-link (same pillar, ≥2 shared tags: modding, switches) — addressed in d477e66c, closes #1036
- category: cross-links
- filed: 2026-10-24 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: modding, switches
- article-a: apps/web/src/content/articles/frankenswitching-explained.mdx
- article-b: apps/web/src/content/articles/typing-tests-lie.mdx
- action: add [typing-tests-lie](/article/typing-tests-lie) to frankenswitching-explained body, or vice versa

### [x] [content] [4.9] gmk-cyl-zombie-group-buy.mdx asserts a confirmed, open group buy that the site's own W43 tracker research found was never more than an interest check — addressed in bd42429c, closes #1039
- category: content
- filed: 2026-10-25 by cloud /iterate audit (fresh general-purpose sweep, angle: recent-article factual correction vs. newer tracker data)
- impact: 7 (title, lede, opening paragraph, and a dedicated section all assert GMK CYL Zombie is a confirmed, order-taking group buy open October 2-31, 2026 across KBDfans and KeyAtlas. `data/trends/2026-W43.json`'s own row note — researched and committed 2026-10-25 in `12f810da` — says "Vendor listings still show Zombie at interest-check stage with a waiting list rather than a confirmed live group buy, despite the expected Oct 2-31 window." Independently confirmed live against KBDfans: `curl https://kbdfans.com/products/gmk-cyl-zombie` renders a "Notify me" / interest-check submit button, not an add-to-cart flow. The W43 score also reversed — 70 (W42, up) to 45 (W43, down), its first down week after eight straight climbs. The article's own closing "What to watch" section poses an open forecast question that this new data already answers. No `data/group-buys/*.json` record exists for this set, so the mechanical group-buy-status-check/companion surveys never see this class of drift — they only compare a trend note against a group-buy record's `status` field, not against an already-published article's prose.)
- ease: 7 (single MDX file content correction — title/lede/opening paragraph/section header rewrite plus an appended Update callout resolving the forecast, mirroring the established `work-louder-openai-codex-micro` lede-correction and `gmk-cyl-og-extensions-interest-check` Update-callout precedents; also a text-only edit to the hand-authored `buy-window-timeline.svg`'s baked-in "group buy opens/closes" labels, no redraw needed since it's a line/text SVG not an illustrated image)
- score: 4.9 (impact × ease / 10)
- evidence: `apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx` title/lede/lines 17,25,27,47; `data/trends/2026-W42.json` vs `2026-W43.json` Zombie rows (score 70→45, direction up→down, note added); live vendor page interest-check button text
- next: correct title/lede/opening framing to "interest check, not confirmed group buy"; append an Update callout citing the W43 reversal; fix `buy-window-timeline.svg` + its InlineViz alt/caption text; bump `updatedAt`
- issue: #1039

### [x] [engineering] [4.8] `scripts/pulse.mjs` misreports the loop's own queue health on four counts — critique "pending" has overstated the real backlog ~69x, AUDIT pending always reads 0, critique last-pass age reads "NaNd ago", and the project name is an unresolved template literal — already fixed in a01a9118 (landed ~1.3h after this row was filed, bundled into an unrelated commit), closes #1057
- category: engineering
- filed: 2026-10-26 by /digest nightly pulse review
- impact: 6 (four separate bugs surfaced while gathering this tick's pulse, all in `scripts/pulse.mjs`, all silent — no error, just wrong numbers in the file the whole loop (and every digest's "Queues now" line) treats as ground truth. (1) **The big one:** `countRows()` counts every `### ` line under a `## Pending` section regardless of whether it's `### [x]` (already addressed) or `### [ ]` (actually open) — it never filters on the checkbox. `plan/CRITIQUE.md`'s `## Pending` section holds 69 `### ` rows, but 67 are `[x]` (resolved, left in place as an audit trail per that file's own convention) and only 1 is a genuine open item (`[needs-user-call]` GA-beacon row); the 69th is a non-finding `### Pass-7 self-assessment summary` header that isn't a finding row at all. Real pending: effectively 1, not 69 — pulse has been overstating the critique backlog by roughly 69x, and every digest's "Queues now" critique-pending number inherited that distortion. This predates the nexus v2 migration; CRITIQUE.md's "resolved rows stay under Pending" convention is long-standing (pass count 11, last real pass 2026-05-10). (2) `pendingSection()` greps `plan/AUDIT.md` for a literal `^## Pending\s*$` header; the nexus v2 migration (`217f39dc`/`f82707e5`, merged 2026-10-26) restructured `AUDIT.md` into `## Drained findings` + `## Open findings` and dropped the `## Pending` header entirely, so `pendingSection()` now always returns `[]` for AUDIT.md — pulse has printed "audit 0 pending" every tick since, regardless of actual content. Ground truth this tick: 5 real `### [ ]` rows (all parked sub-3.0: `[2.7]`, `[2.4]`, `[2.0]`, `[2.4]`, `[1.8]`), and bug (1)'s indiscriminate-counting flaw would hit this section too once the header match is fixed, so both bugs need fixing together or the AUDIT count will just inherit the same [x]-counting flaw. (3) `header(critique, 'Last pass')`'s regex `^> Last pass:\s*(.+)$` captures the whole rest of the line; `plan/CRITIQUE.md`'s header reads `Last pass: 2026-05-10T20:35:00Z at commit 931c8a7`, so `lastPass` becomes the full string and `ago(`${lastPass}T00:00:00Z`)` builds an unparseable date, printing "last pass NaNd ago" instead of the real ~169d. (4) line 77 prints the literal `pulse — <PROJECT_LOWER>` — an unresolved template placeholder, never substituted with "thock".)
- ease: 8 (four isolated, mechanical string/regex fixes in one file, no schema or data changes: filter `countRows()` to `/^### \[ \]/` instead of `/^### /`; point `pendingSection()`'s header match at AUDIT.md's actual `## Open findings` section; trim `header()`'s captured value to the leading ISO-8601 timestamp before the `ago()` call; replace the `<PROJECT_LOWER>` literal with "thock")
- score: 4.8 (impact × ease / 10)
- evidence: `scripts/pulse.mjs:61-63` (`countRows()`, no `[x]`/`[ ]` filter), `scripts/pulse.mjs:65-69` (`header()`), `scripts/pulse.mjs:116-121` (AUDIT `pendingSection()` call), `scripts/pulse.mjs:77` (`<PROJECT_LOWER>` literal); `plan/CRITIQUE.md`'s `## Pending` section: 69 total `### ` rows, 67 `[x]`, 0 `[ ]`, 1 `[needs-user-call]`, 1 non-finding summary header (hand-counted via `awk`/`grep` over the section this tick); `plan/AUDIT.md` has no `## Pending` header (only `## Drained findings` at line 1583 and `## Open findings` at line 1612) but carries 5 `### [ ]` rows; `plan/CRITIQUE.md:3` reads `> Last pass: 2026-05-10T20:35:00Z at commit 931c8a7`; this tick's raw `node scripts/pulse.mjs` output: `pulse — <PROJECT_LOWER>` / `audit  0 pending` / `critique  69 pending, last pass NaNd ago`
- next: fix all four string/regex bugs in `scripts/pulse.mjs` directly (no gate/cadence/rule change, so this is a plain bug fix, not an `/oversight`-gated tuning candidate); re-run `node scripts/pulse.mjs` and confirm it reports a real critique-pending count near 1, the real AUDIT pending count, and a finite critique-age value
- issue: (none filed by this digest — filing GitHub issues is a shipping-skill action, not digest's; the next `/iterate` pass that picks this row up opens one)
> Discovered while gathering this tick's pulse (`skills/digest.md` Step 2's `node scripts/pulse.mjs` command). The AUDIT-side header mismatch is a fresh regression from the nexus v2 plan-upgrade merge; the countRows `[x]`-counting flaw and the critique header-overcapture are long-standing, just never checked against ground truth before. Not fixed by this digest — breadth/pulse-discovered findings become AUDIT rows, not fixes, per `skills/digest.md` §4.2.
> **Update (2026-10-27), digest pass (nightly) — all four symptoms now read clean; looks fixed, not yet marked closed.** Tonight's pulse pull (`node scripts/pulse.mjs`) prints `pulse — thock` (literal resolved), `audit  10 pending` (real content, not 0), and `critique  5 pending, last pass 21h ago` (finite age, not NaN) — all three symptoms this row named are gone. The likely cause: commit `a01a9118` (2026-10-26T18:51:52Z, local, "plan: turn the improvement dial to bold") lands as part of a nexus-kit upgrade to 0.6.2 and its own body states plainly "pulse counts open rows only (critique read 69 pending for 1, audit 0 for 10)" — an exact match to bugs (1) and (2) above. Reading current `scripts/pulse.mjs`: `countRows()` now filters `/^### \[(?!x\])/i` (bug 1 fixed) and `pendingSection()` falls back to scanning the whole file when no literal `## Pending` header exists, which is how it now reaches AUDIT.md's real rows despite the `## Drained findings`/`## Open findings` split (bug 2 fixed by a different mechanism than this row's own `next:` suggestion, but the symptom is gone); line 77 prints `thock`, not `<PROJECT_LOWER>` (bug 4 fixed). Not independently confirming bug (3)'s exact mechanism (the `header()` regex) was touched, only that its symptom (NaN) no longer reproduces. Not closing this row myself — per the meta-loop rail, filing the observation for `/oversight` or the next `/iterate` tick to confirm against `a01a9118`'s diff and close with that commit cited.

### [x] [newsletter] [4.0] Weekly digest — issue 013 due (7 days since issue 12)
- category: content-gaps
- filed: 2026-10-27 by newsletter-gap-survey.mjs
- impact: 5 (newsletter archive going stale reduces /newsletter value and reader trust in cadence)
- ease: 8 (content-curator weekly round-up: 5 pillar picks + tracker insight)
- score: 4.0 (impact × ease / 10)
- next: /ship-content → newsletter type (weekly round-up, 5 pillar picks, tracker insight)
- last-issue: 2026-10-20 (thock-weekly-012)
- days-since: 7
- issue: #1051
- addressed in: d2df27a7 (this tick — ship-content newsletter dispatch)
> Filed 2026-10-27 by newsletter-gap-survey.mjs. 7 days since issue 12. Threshold: ≥7 calendar days.

### [x] [HOT PURSUIT] [content-gap] [7] deep-dives pillar — 1 of ≥2 articles in last 30d — addressed in 4e478c2c, closes #1056
- category: content-gaps
- impact: 6 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: deep-dives
- window-count: 1
- window-start: 2026-09-28
- score: 7
- next: /ship-content → deep-dives pillar article
- issue: #1056
> Filed 2026-10-28 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ cherry-mx2a-revision — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: linear, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/cherry-mx2a-revision.mdx
- action: add [cherry-mx2a-revision](/article/cherry-mx2a-revision) to gateron-ink-housings-deep-dive body, or vice versa

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ gateron-lanes-tactile-deep-dive — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: gateron, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gateron, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-lanes-tactile-deep-dive.mdx
- action: add [gateron-lanes-tactile-deep-dive](/article/gateron-lanes-tactile-deep-dive) to gateron-ink-housings-deep-dive body, or vice versa

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ gateron-magnetic-jade-deep-dive — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: gateron, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: gateron, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-magnetic-jade-deep-dive.mdx
- action: add [gateron-magnetic-jade-deep-dive](/article/gateron-magnetic-jade-deep-dive) to gateron-ink-housings-deep-dive body, or vice versa

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ gateron-oil-king-deep-dive — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: linear, gateron, polycarbonate, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, gateron, polycarbonate, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-oil-king-deep-dive.mdx
- action: add [gateron-oil-king-deep-dive](/article/gateron-oil-king-deep-dive) to gateron-ink-housings-deep-dive body, or vice versa

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ hmx-cloud-deep-dive — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: linear, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- action: add [hmx-cloud-deep-dive](/article/hmx-cloud-deep-dive) to gateron-ink-housings-deep-dive body, or vice versa

### [x] [cross-links] [4.5] gateron-ink-housings-deep-dive ↔ plate-materials-explained — no prose cross-link, addressed in ade2eb04, closes #1058 (same pillar, ≥2 shared tags: polycarbonate, deep-dive)
- category: cross-links
- filed: 2026-10-28 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: polycarbonate, deep-dive
- article-a: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- article-b: apps/web/src/content/articles/plate-materials-explained.mdx
- action: add [plate-materials-explained](/article/plate-materials-explained) to gateron-ink-housings-deep-dive body, or vice versa
