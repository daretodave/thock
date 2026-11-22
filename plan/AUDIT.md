# Site audit

> Standing rules (Rule 1 sliding window etc.) live in `plan/bearings.md`; past header notes are in git history.

## Pending

### [needs-user-call] [user-issue #1068] [HIGH] "Cloud loop: GH_TOKEN/GITHUB_TOKEN invalid in march.yml run, masking triage/critique gh checks" open past the 24h SLA
- category: external-issue
- impact: 8
- ease: 5
- evidence: issue #1068 opened 2026-11-07, open 42h with no row in the queue; the SLA is 24h (sla_hours in plan/bearings.md). Issue already labeled `triage:needs-user` by a prior triage pass — it asks the owner to pick a push-credential strategy (wire `ACTIONS_PAT`, or point `GH_TOKEN`/the git remote at `DEFAULT_WORKFLOW_TOKEN` or equivalent), a repo-secret decision the loop cannot make unilaterally.
- next: failure mode 5 (iterate §6) — surfaced, not auto-routed; this run's own `gh auth status` succeeded (logged in as `claude[bot]` via `GH_TOKEN`), so the credential picture may already differ from what #1068 described, but closing/resolving it is still the owner's call.
- lock: issue-1068-credential-call · since: 2026-11-12 · until: owner comments or closes #1068 · max_age: 14d
- generator: issue-age · filed 2026-11-08

### [user-issue #1092] [HIGH] "Cloud march failed: 2026-11-20" open past the 24h SLA
- category: external-issue
- impact: 8
- ease: 5
- evidence: issue #1092 opened 2026-11-21, open 24h with no row in the queue; the SLA is 24h (sla_hours in plan/bearings.md).
- next: /triage routes it (a bug goes to /bug); reference #1092 in the commit body.
- generator: issue-age · filed 2026-11-22

## Drained findings (kept for audit-trail; do not re-open)

### [x] [external-issue] [user-issue #1084] [HIGH] "Cloud march failed: 2026-11-17 — verify gate blocked by Next.js agent-upgrade security nudge" open past the 24h SLA — closed this tick, already fixed by 03f0cf4e
- category: external-issue
- impact: 8
- ease: 5
- evidence: issue #1084 opened 2026-11-17, filed by `issue-age` generator 2026-11-18 as open past the 24h SLA. By the time this row was filed, commit `03f0cf4e` (2026-11-18T02:29:40Z, earlier the same day) had already bumped Next.js to 16.4.6, fixing GHSA-mfr8-8qww-v76h/GHSA-vc7v-qv4w-wrv8 — the exact advisories whose build-time security nudge blocked #1084's gate. `pnpm-lock.yaml` confirms `next@16.4.6`; multiple commits (09.1-09.3 chunks) landed cleanly through the full gate including e2e since.
- next: closed `gh issue close 1084` with the fix citation this tick; no build work needed.
- generator: issue-age · filed 2026-11-18

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

### [x] [engineering] [3.6] GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned cookieless Plausible tag
- resolved 2026-11-01 via `/oversight`: switched to cookieless. GTM/GA4 removed; Vercel Web Analytics + Speed Insights (already wired) are the only telemetry. `bearings.md` + `spec.md` reconciled; e2e guards against any GTM/GA4 reintroduction.
- category: engineering
- filed: 2026-09-05 by cloud /iterate audit (fresh general-purpose sweep, angle: analytics/consent)
- impact: 6 (`apps/web/src/components/analytics/GoogleTagManager.tsx:18-20`'s own code comment reads "No consent gate yet — thock collects no PII; GTM is page-level pageview tracking only" — but GDPR/PECR consent requirements for non-essential cookies turn on cookie use, not PII collection, so the reasoning doesn't actually clear the compliance bar. Rendered unconditionally from `apps/web/src/app/layout.tsx:70`, gated only by a `DISABLE_ANALYTICS` bot-suppression flag, not user consent. `plan/bearings.md:73` still states `Analytics | Plausible (script tag, eventual) | Privacy-respecting` — docs were never reconciled after the GTM pivot locked via `/oversight 2026-05-09`, so this is an undocumented architecture change plus an unaddressed compliance gap, not a one-off bug)
- ease: 6 (either add a lightweight consent gate around the existing `next/script` call, or drop GTM for the originally-planned cookieless Plausible tag — either way `bearings.md:73` needs updating to match reality)
- score: 3.6 (impact × ease / 10)
- evidence: `apps/web/src/components/analytics/GoogleTagManager.tsx:18-20`; `apps/web/src/app/layout.tsx:70`; `plan/bearings.md:73`
- next: `/oversight` call — pick consent-gate-GTM vs. revert-to-Plausible, then implement + reconcile bearings.md

### [x] [bug] [4.2] `/article/[slug]` and `/tag/[slug]` soft-404 fix is structurally blocked — real 404 status and the "did you mean" not-found UX are mutually exclusive under current Next.js routing
- resolved 2026-11-01 via `/oversight` (option: real 404 + root suggestions): both routes set `dynamicParams = false`; root `not-found.tsx` renders `RouteAwareNotFound`, which restores the entity copy + "did you mean" suggestions for /article/* and /tag/*. Segment not-found files removed (bypassed under dynamicParams=false). smoke.spec asserts 404 status.
- category: bug
- filed: 2026-07-18 by cloud /iterate audit (fresh general-purpose sweep, then investigated + reverted same tick)
- impact: 7 (same impact reasoning as the closed-out #524 partial fix: these are the two highest-traffic dynamic route families, and soft-404s risk Search Console flags/wasted crawl budget)
- ease: 6 (originally scored — the fix looked mechanical: convert `article/[slug]/not-found.tsx` and `tag/[slug]/not-found.tsx` from reading `headers()` server-side to `usePathname()` client-side, then add `dynamicParams = false`. Implemented and verified directly against a local `next build && next start`: confirmed this does NOT work. With `dynamicParams` at the default (`true`), unknown slugs render the segment's own `not-found.tsx` — "did you mean" suggestions intact — but HTTP status is 200 (the pre-existing soft-404). With `dynamicParams = false`, unknown slugs correctly 404 — confirmed via curl — but Next.js bypasses the segment's own `not-found.tsx` boundary entirely and falls back to the root `not-found.tsx` ("Lost in the layout."), losing the suggestions; this happens regardless of whether the not-found page reads the pathname server-side or client-side, because the routing-layer rejection happens before the segment boundary is considered at all. `apps/e2e/tests/polish.spec.ts`'s two "did you mean" tests caught this immediately when the change was verify-gated. The two properties (accurate 404 status, segment-level "did you mean" UX) are confirmed mutually exclusive for these two routes under the current Next.js version — same trade-off already accepted for `/vendor/[slug]`/`/newsletter/[slug]`/`/part/[kind]` in #524, but those routes had no "did you mean" feature to lose, so it was free there. Here it isn't — an autonomous ease score can't be assigned to "which regression do we prefer")
- score: 4.2 (impact × ease / 10, as originally computed before the ease reassessment above — carried forward for continuity with the closed issue, not a live autonomous priority)
- next: `/oversight` call on which is preferred: (a) keep the current soft-404 (200 status, working "did you mean" suggestions) — the status quo since #524; or (b) accept `dynamicParams = false` (real 404, but the not-found page falls back to generic root copy with no suggestions) — same trade-off already made for the other 4 entity routes. A third option — building the "did you mean" suggestions into the *root* `not-found.tsx` with route-aware behavior — wasn't scoped in this investigation and could be a future `/plan-a-spec` candidate if (b) is preferred but the UX loss is unacceptable.
- issue: #533 (opened, investigated same tick, closed not-planned — see issue comments for the full local-repro evidence trail)
> Filed same-tick as investigated: the fresh sweep's top finding (score 4.2) matched a standing follow-up gap from #524's partial resolution, was implemented, and failed its own e2e coverage (`polish.spec.ts`'s two "did you mean" assertions) on the first `pnpm verify` pass. Rather than iterate blindly against a gate that was correctly catching a real, structural regression, did a direct local repro (`next build && next start` + curl, both `dynamicParams` states) to confirm the constraint before reverting — this is a routing-layer limitation, not an implementation bug, so further iterate-tick attempts at "just read the pathname differently" would repeat this same dead end. All file changes reverted to a clean working tree; no commit shipped this line of investigation. Falls through to the next candidate finding for this tick.

### [x] [engineering] [3.0] mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed
- resolved 2026-11-01 via `/oversight` (option: reconciliation step): upstreamed to nexus (`ca3c79f`) as the stock `mirror-orphan` generator, adopted here via refill; it files a Pending row for every open mirror issue with no plan reference.
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

### [x] [a11y] [1.3] default-state UI-component borders fail WCAG 1.4.11 non-text contrast (1.42:1 / 2.24:1 vs. 3:1 minimum) — real fix is a global dark-theme lightness call, not a mechanical edit
- resolved 2026-11-01 via `/oversight` (option: form controls only): new `--thock-border-control` token (dark L0.55, light L0.61; >= 3:1 vs bg/bg-2/surface/surface-hi in both themes, guarded by `packages/tokens/__tests__/contrast.test.ts`) applied to inputs, selects and bordered buttons. Card/divider borders keep the quiet `--thock-border`.
- category: a11y
- filed: 2026-09-08 by cloud /iterate audit (pass 424, fresh general-purpose sweep, angle: numeric WCAG contrast computation on tokens.css OKLCH values — text-color contrast was already guarded by existing component tests, but non-text/UI-component border contrast had never been computed)
- impact: 5 (`--thock-border` (dark-mode `oklch(0.305 0.007 250)`) measures **1.42:1** against `--thock-bg` and **1.24:1** against `--thock-surface`; `--thock-border-hi` measures **2.24:1** / **1.97:1** — both well under the 3:1 minimum SC 1.4.11 requires for a UI component's visual boundary. This is the sole rest-state boundary indicator for every text input, `<select>`, and border-styled button site-wide: `ButtondownForm.tsx:76-77,85-86` (email input + both submit buttons), `SwitchCompareSelector.tsx:41` / `BoardCompareSelector.tsx:41` (compare-tool selects), plus `QuizStep.tsx`, `GroupBuyCountdownRow.tsx`, `GroupBuyRow.tsx`, `MobileNav.tsx`, `RootNotFound.tsx`. Focus state is unaffected (accent ring measures 9.97:1) — this only affects sighted low-vision users scanning the page before interacting.
- ease: 2 (verified independently: reaching 3:1 against `--thock-surface`, the stricter of the two backgrounds these borders sit on, requires raising `--thock-border`'s OKLCH lightness from 0.305 to ~0.52 — not a small token nudge but roughly doubling perceived border weight across every bordered surface on the site, a visible identity change to the "restrained, low-contrast dark" aesthetic locked via `/oversight`. `--thock-border-hi` would need a comparable jump to preserve its role as the stronger of the two. This is a brand-taste tradeoff between accessibility and the existing visual language, not a mechanical fix — same class of call `agents.md` reserves for `/oversight` brand-setup passes, which cloud cannot run.)
- score: 1.3 (impact × ease / 10, honestly re-scored after independently verifying the fix's true blast radius — an initial estimate of ease 6 assumed a "2-line bump" before checking how much lightness change 3:1 actually requires)
- evidence: `packages/tokens/src/tokens.css:15-16` (dark-mode `--thock-border`/`--thock-border-hi`); contrast independently recomputed via OKLCH→linear-sRGB→WCAG relative luminance (Björn Ottosson's oklab conversion matrices + W3C contrast formula), confirming 1.42/1.24/2.24/1.97:1 exactly; light-mode values (`--thock-border: oklch(0.88 0.004 85)` against `--thock-bg: oklch(0.965 0.004 85)`) not yet computed — worth checking in the same pass if this is ever picked up.
- next: `/oversight` call — decide whether to accept a visibly heavier border weight in dark mode for WCAG 1.4.11 compliance, or a lighter-touch alternative (e.g. a subtle background-fill or shadow cue instead of raising border lightness); then implement + re-verify contrast across all bordered components in one pass.

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

### [ ] [content] [3.6] hall-effect-rapid-trigger-plateau — Gateron Oil King "N weeks ago" citation disagrees with data/trends/2026-W25.json
- category: content
- filed: 2026-11-05 by content-fact-audit.mjs — hall-effect-rapid-trigger-plateau:trend-weeks-ago:2026-W25:Gateron Oil King:39
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/articles/hall-effect-rapid-trigger-plateau.mdx
- claim: Gateron Oil King cited at 39 from 8 weeks ago (2026-W25), but data/trends/2026-W25.json's rows[].score for that row is 40
- action: correct the prose citation to match data/trends/2026-W25.json's rows[].score (or correct the data record if the data is the one that's wrong)

### [ ] [content] [3.6] thock-weekly-011 — Keychron "N weeks ago" citation disagrees with data/trends/2026-W31.json
- category: content
- filed: 2026-11-05 by content-fact-audit.mjs — thock-weekly-011:trend-weeks-ago:2026-W31:Keychron:96
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/newsletters/thock-weekly-011.mdx
- claim: Keychron cited at 96 from 8 weeks ago (2026-W31), but data/trends/2026-W31.json's rows[].score for that row is 94
- action: correct the prose citation to match data/trends/2026-W31.json's rows[].score (or correct the data record if the data is the one that's wrong)

### [ ] [content] [3.6] thock-weekly-011 — Cherry (MX + XTRFY) "N weeks ago" citation disagrees with data/trends/2026-W31.json
- category: content
- filed: 2026-11-05 by content-fact-audit.mjs — thock-weekly-011:trend-weeks-ago:2026-W31:Cherry (MX + XTRFY):-6
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/newsletters/thock-weekly-011.mdx
- claim: Cherry (MX + XTRFY) cited at -6 from 8 weeks ago (2026-W31), but data/trends/2026-W31.json's rows[].score for that row is -10
- action: correct the prose citation to match data/trends/2026-W31.json's rows[].score (or correct the data record if the data is the one that's wrong)

### [ ] [a11y] [3.5] `focus-visible:ring-accent-mu` focus rings fall under the 3:1 WCAG 1.4.11 floor on dark-theme `bg-bg-2`/`bg-surface`/`bg-surface-hi` backgrounds — 74 files still use the token, only 4 fixed so far
- category: a11y
- filed: 2026-11-07 by chunk 05.2's builder (`apps/e2e/tests/focus-visible.spec.ts` tab-walk coverage check, within its 9-route/20-tab scope)
- impact: 5 (`--thock-accent-mu` only clears 3:1 against `--thock-bg` in dark theme, per `packages/tokens/__tests__/contrast.test.ts`'s existing guarantee for `--thock-accent` vs. `-mu` — any `focus-visible:ring-accent-mu`/`focus:ring-accent-mu` usage sitting on `bg-bg-2`, `bg-surface` or `bg-surface-hi` renders a keyboard focus ring under the accessible-contrast floor. Chunk 05.2 fixed the 4 instances reachable by its 9 canonical routes within 20 Tab presses (`Footer.tsx`, `ButtondownForm.tsx`, `PillarHero.tsx`, `QuizStep.tsx`'s option buttons) but a repo-wide grep (`grep -rl "ring-accent-mu" apps/web/src --include="*.tsx"`) still finds 74 files, most unaudited against their actual background)
- ease: 7 (same one-line swap, `ring-accent-mu` → `ring-accent`, per file — but needs a per-file background check first, since some usages may already sit on `--thock-bg` and are fine as-is, or use `bg-accent-mu` as text background rather than a ring, which is a different, already-tuned contrast case per `QuizStep.tsx`'s rank-badge regression guard)
- score: 3.5 (impact × ease / 10)
- evidence: `grep -rl "ring-accent-mu" apps/web/src --include="*.tsx" | wc -l` → 74; `packages/tokens/__tests__/contrast.test.ts` (the existing `--thock-accent` vs. `--thock-accent-mu` 3:1 guarantee); commit 7a0d7592 (05.2) for the 4 already-fixed instances
- next: `/iterate` — grep every remaining `ring-accent-mu` usage, resolve each file's actual rendered background (component source or a quick local `next start` probe), swap to `ring-accent` wherever the background isn't `--thock-bg`; leave `bg-accent-mu` (non-ring) usages untouched

### [x] [HOT PURSUIT] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in babf5f3b, closes #1070
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-10-08
- score: 7
- next: /ship-content → guides pillar article
- issue: #1070
> Filed 2026-11-07 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-11-07):** shipped `how-to-evaluate-a-group-buy.mdx` — a guides-pillar buyer's guide on judging a group buy's trustworthiness before paying (vendor track record, timeline red flags, region/vendor-kitting mechanics, refund/recourse policy, closing checklist). `publishedAt` gap-filled to 2026-10-31 (midpoint of the 14-day gap between 2026-10-24 and today in the 30-day window). Grounded in real catalog mechanics (GMK CYL Ramune's regional kitting) without inventing any named group-buy failure. Language gate, mentionedParts gate, cross-link survey all clean. `pnpm verify` full gate green: typecheck, lint, 1388/1388 e2e.

### [x] [content-gap] [7] news pillar — 1 of ≥2 articles in last 30d — addressed in 0bf491b2, closes #1071
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: news
- window-count: 1
- window-start: 2026-10-08
- score: 7
- next: /ship-content → news pillar article
- issue: #1071
> Filed 2026-11-07 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-11-07):** shipped `mm-studio-class80-discontinued.mdx` — a news-pillar lifecycle piece on CannonKeys' catalog record for the MM Studio Class80 flipping to `discontinued` (R1 sold out, R2 succeeded it, no R3 in the record). `publishedAt` gap-filled to 2026-10-25 (midpoint of the 26-day gap between 2026-10-12 and today in the 30-day window). Grounded entirely in `data/boards/class80.json` + prior thock coverage (`mounting-styles-compared.mdx`, `60-percent-layout-history.mdx`); no invented discontinuation reason or vendor statement. Language gate, mentionedParts gate clean. Cross-link survey filed 1 pair (`[4.5]` row above, left pending for a future tick). `pnpm verify` full gate green: typecheck, lint, 1391/1391 e2e.

### [ ] [cross-links] [4.5] mm-studio-class80-discontinued ↔ cannonkeys-blaine-v2-se-group-buy — no prose cross-link (same pillar, ≥2 shared tags: cannonkeys, gasket-mount)
- category: cross-links
- filed: 2026-11-07 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: cannonkeys, gasket-mount
- article-a: apps/web/src/content/articles/mm-studio-class80-discontinued.mdx
- article-b: apps/web/src/content/articles/cannonkeys-blaine-v2-se-group-buy.mdx
- action: add [cannonkeys-blaine-v2-se-group-buy](/article/cannonkeys-blaine-v2-se-group-buy) to mm-studio-class80-discontinued body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] trends pillar — 1 of ≥2 articles in last 30d — addressed in b4e6964b, closes #1073
- category: content-gaps
- impact: 8 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: trends
- window-count: 1
- window-start: 2026-10-08
- score: 7
- next: /ship-content → trends pillar article
- issue: #1073
> Filed 2026-11-07 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-11-08):** shipped `hall-effect-score-dips-wooting-ship-slips.mdx` — a trends-pillar follow-up to `hall-effect-rapid-trigger-plateau.mdx` (Aug), reading the Hall Effect/Rapid Trigger category's first-ever down-tick (100 → 95, 2026-W44) against Wooting's own late-October 80HE+ ABS/Module ship date going unconfirmed for a second straight week. Grounded entirely in `data/trends/2026-W37.json`–`2026-W44.json` score history and the existing `wooting-80he-plus-shipping-update.mdx` article; no invented vendor statements or dates. `publishedAt` gap-filled to 2026-11-04 (largest gap in the 30-day window). Language gate, mentionedParts gate clean. Cross-link survey filed 4 pairs (left pending for a future tick). `pnpm verify` full gate green: typecheck, lint, 1394/1394 e2e.

### [x] [cross-links] [4.5] hall-effect-score-dips-wooting-ship-slips ↔ hall-effect-mainstream — no prose cross-link (same pillar, ≥2 shared tags: hall-effect, trends-2026) — addressed in b40abe13
- category: cross-links
- filed: 2026-11-08 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: hall-effect, trends-2026
- article-a: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- article-b: apps/web/src/content/articles/hall-effect-mainstream.mdx
- action: add [hall-effect-mainstream](/article/hall-effect-mainstream) to hall-effect-score-dips-wooting-ship-slips body, or vice versa

### [x] [cross-links] [4.5] hall-effect-score-dips-wooting-ship-slips ↔ rapid-trigger-gaming-crossover — no prose cross-link (same pillar, ≥2 shared tags: hall-effect, trends-2026) — addressed in b40abe13
- category: cross-links
- filed: 2026-11-08 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: hall-effect, trends-2026
- article-a: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- article-b: apps/web/src/content/articles/rapid-trigger-gaming-crossover.mdx
- action: add [rapid-trigger-gaming-crossover](/article/rapid-trigger-gaming-crossover) to hall-effect-score-dips-wooting-ship-slips body, or vice versa

### [x] [cross-links] [4.5] hall-effect-score-dips-wooting-ship-slips ↔ tmr-switches-five-week-climb — no prose cross-link (same pillar, ≥2 shared tags: hall-effect, rapid-trigger) — addressed in b40abe13
- category: cross-links
- filed: 2026-11-08 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: hall-effect, rapid-trigger
- article-a: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- article-b: apps/web/src/content/articles/tmr-switches-five-week-climb.mdx
- action: add [tmr-switches-five-week-climb](/article/tmr-switches-five-week-climb) to hall-effect-score-dips-wooting-ship-slips body, or vice versa

### [x] [cross-links] [4.5] hall-effect-score-dips-wooting-ship-slips ↔ wooting-rapid-trigger-head-start — no prose cross-link (same pillar, ≥2 shared tags: hall-effect, rapid-trigger, wooting) — addressed in b40abe13
- category: cross-links
- filed: 2026-11-08 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: hall-effect, rapid-trigger, wooting
- article-a: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- article-b: apps/web/src/content/articles/wooting-rapid-trigger-head-start.mdx
- action: add [wooting-rapid-trigger-head-start](/article/wooting-rapid-trigger-head-start) to hall-effect-score-dips-wooting-ship-slips body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] ideas pillar — 1 of ≥2 articles in last 30d — addressed in cab9b0e9, closes #1075
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ideas
- window-count: 1
- window-start: 2026-10-09
- score: 7
- next: /ship-content → ideas pillar article
- issue: #1075
> Filed 2026-11-08 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [ ] [content] [3.6] hall-effect-score-dips-wooting-ship-slips — Wooting tracker-score citation disagrees with data/trends/2026-W45.json
- category: content
- filed: 2026-11-09 by content-fact-audit.mjs — hall-effect-score-dips-wooting-ship-slips:trend:2026-W45:Wooting:100
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- claim: Wooting cited at 100 for 2026-W45, but data/trends/2026-W45.json's rows[].score for that row is 87
- action: correct the prose citation to match data/trends/2026-W45.json's rows[].score (or correct the data record if the data is the one that's wrong)

### [ ] [content] [3.6] cannonkeys-blaine-v2-se-group-buy — present-tense buy-window language after group-buy closed
- category: content
- filed: 2026-11-10 by group-buy-article-staleness-check.mjs
- impact: 4 (frontmatter title/lede feeding <title>, the OG image, and JSON-LD headline — or early body prose — still reads present-tense after the linked group-buy record's status flipped to closed)
- ease: 9 (phrase rewrite to past tense or absolute dates — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/cannonkeys-blaine-v2-se.json
- article: apps/web/src/content/articles/cannonkeys-blaine-v2-se-group-buy.mdx
- matches:
  - body-paragraph-1: `runs through 2026-08-09` (stale-buy-runs-through-date)
- action: rewrite "runs through 2026-08-09" in cannonkeys-blaine-v2-se-group-buy.mdx using past-tense phrasing or absolute dates, matching the group-buy record's closed status

### [ ] [content] [3.6] gmk-cyl-just-beachy-group-buy-opens — present-tense buy-window language after group-buy closed
- category: content
- filed: 2026-11-10 by group-buy-article-staleness-check.mjs
- impact: 4 (frontmatter title/lede feeding <title>, the OG image, and JSON-LD headline — or early body prose — still reads present-tense after the linked group-buy record's status flipped to closed)
- ease: 9 (phrase rewrite to past tense or absolute dates — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/divinikey-gmk-cyl-just-beachy.json
- article: apps/web/src/content/articles/gmk-cyl-just-beachy-group-buy-opens.mdx
- matches:
  - title: `buy opens` (stale-buy-opens)
- action: rewrite "buy opens" in gmk-cyl-just-beachy-group-buy-opens.mdx using past-tense phrasing or absolute dates, matching the group-buy record's closed status

### [ ] [content] [3.6] divinikey-gmk-cyl-orange-alert-group-buy — present-tense buy-window language after group-buy closed
- category: content
- filed: 2026-11-10 by group-buy-article-staleness-check.mjs
- impact: 4 (frontmatter title/lede feeding <title>, the OG image, and JSON-LD headline — or early body prose — still reads present-tense after the linked group-buy record's status flipped to closed)
- ease: 9 (phrase rewrite to past tense or absolute dates — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/divinikey-gmk-cyl-orange-alert.json
- article: apps/web/src/content/articles/divinikey-gmk-cyl-orange-alert-group-buy.mdx
- matches:
  - lede: `runs through September` (stale-buy-runs-through-date)
  - body-paragraph-1: `runs through September` (stale-buy-runs-through-date)
- action: rewrite "runs through September" in divinikey-gmk-cyl-orange-alert-group-buy.mdx using past-tense phrasing or absolute dates, matching the group-buy record's closed status

### [ ] [content] [3.6] gmk-cyl-king-of-the-seas-group-buy — present-tense buy-window language after group-buy closed
- category: content
- filed: 2026-11-10 by group-buy-article-staleness-check.mjs
- impact: 4 (frontmatter title/lede feeding <title>, the OG image, and JSON-LD headline — or early body prose — still reads present-tense after the linked group-buy record's status flipped to closed)
- ease: 9 (phrase rewrite to past tense or absolute dates — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/kbdfans-gmk-cyl-king-of-the-seas.json
- article: apps/web/src/content/articles/gmk-cyl-king-of-the-seas-group-buy.mdx
- matches:
  - body-paragraph-2: `buy opens` (stale-buy-opens)
- action: rewrite "buy opens" in gmk-cyl-king-of-the-seas-group-buy.mdx using past-tense phrasing or absolute dates, matching the group-buy record's closed status

### [ ] [cross-links] [4.5] aurora-glow-theme-build ↔ bento-box-theme-build — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, 65)
- category: cross-links
- filed: 2026-11-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, 65
- article-a: apps/web/src/content/articles/aurora-glow-theme-build.mdx
- article-b: apps/web/src/content/articles/bento-box-theme-build.mdx
- action: add [bento-box-theme-build](/article/bento-box-theme-build) to aurora-glow-theme-build body, or vice versa

### [ ] [cross-links] [4.5] aurora-glow-theme-build ↔ building-mode-sonnet-with-oil-kings — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, linear)
- category: cross-links
- filed: 2026-11-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, linear
- article-a: apps/web/src/content/articles/aurora-glow-theme-build.mdx
- article-b: apps/web/src/content/articles/building-mode-sonnet-with-oil-kings.mdx
- action: add [building-mode-sonnet-with-oil-kings](/article/building-mode-sonnet-with-oil-kings) to aurora-glow-theme-build body, or vice versa

### [ ] [cross-links] [4.5] aurora-glow-theme-build ↔ synthwave-tkl-theme-build — no prose cross-link (same pillar, ≥2 shared tags: build-of-the-week, linear)
- category: cross-links
- filed: 2026-11-10 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: build-of-the-week, linear
- article-a: apps/web/src/content/articles/aurora-glow-theme-build.mdx
- article-b: apps/web/src/content/articles/synthwave-tkl-theme-build.mdx
- action: add [synthwave-tkl-theme-build](/article/synthwave-tkl-theme-build) to aurora-glow-theme-build body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in 3e5b3778, closes #1076
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-10-11
- score: 7
- next: /ship-content → guides pillar article
- issue: #1076
> Filed 2026-11-10 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [newsletter] [4.0] Weekly digest — issue 014 due (15 days since issue 13) — addressed in 0a15e953, closes #1077
- category: content-gaps
- filed: 2026-11-11 by newsletter-gap-survey.mjs
- impact: 5 (newsletter archive going stale reduces /newsletter value and reader trust in cadence)
- ease: 8 (content-curator weekly round-up: 5 pillar picks + tracker insight)
- score: 4.0 (impact × ease / 10)
- next: /ship-content → newsletter type (weekly round-up, 5 pillar picks, tracker insight)
- last-issue: 2026-10-27 (thock-weekly-013)
- days-since: 15
- issue: #1077
> Filed 2026-11-11 by newsletter-gap-survey.mjs. 15 days since issue 13. Threshold: ≥7 calendar days.
> **Resolved (2026-11-12):** shipped `thock-weekly-014.mdx` — 5 pillar picks (how-to-evaluate-a-group-buy, aurora-glow-theme-build, hall-effect-score-dips-wooting-ship-slips, mm-studio-class80-discontinued, gateron-ink-housings-deep-dive) plus a 2026-W46 tracker check-in (Hall Effect/Rapid Trigger up to 93, TMR flat at 97, Split/Ergo flat at 94, Keychron brand flat at 96, Wooting brand up to 94). `publishedAt` 2026-11-12 — the cadence-due date itself, not a gap-fill (newsletter issues anchor to their ship date). Caught and fixed a temporal-accuracy issue in the content-curator draft before commit: the MM Studio Class80 news pick originally read "flipped to discontinued this week," but the source article's own lede dates that status change to 2026-05-09 — reworded to "a change made back on 2026-05-09." Also trimmed the lede from 676 to 394 chars (schema caps `lede` at 400). `pnpm verify` full gate green: typecheck, lint, 167 unit tests (content package), script tests, data:validate, build, size, 1746/1746 e2e.

### [x] [HOT PURSUIT] [content-gap] [7] news pillar — 1 of ≥2 articles in last 30d — addressed in 878b7d03, closes #1078
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: news
- window-count: 1
- window-start: 2026-10-13
- score: 7
- next: /ship-content → news pillar article
- issue: #1078
> Filed 2026-11-12 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [HOT PURSUIT] [content-gap] [7] deep-dives pillar — 1 of ≥2 articles in last 30d — addressed in e6e0ae8a, closes #1086
- category: content-gaps
- impact: 6 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: deep-dives
- window-count: 1
- window-start: 2026-10-19
- score: 7
- next: /ship-content → deep-dives pillar article
- issue: #1086
> Filed 2026-11-18 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ cherry-mx2a-revision — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/cherry-mx2a-revision.mdx
- action: add [cherry-mx2a-revision](/article/cherry-mx2a-revision) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ clicky-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/clicky-switches-deep-dive.mdx
- action: add [clicky-switches-deep-dive](/article/clicky-switches-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ gateron-lanes-tactile-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/gateron-lanes-tactile-deep-dive.mdx
- action: add [gateron-lanes-tactile-deep-dive](/article/gateron-lanes-tactile-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ hmx-cloud-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- action: add [hmx-cloud-deep-dive](/article/hmx-cloud-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ keyboard-acoustics-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/keyboard-acoustics-deep-dive.mdx
- action: add [keyboard-acoustics-deep-dive](/article/keyboard-acoustics-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ magnetic-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/magnetic-switches-deep-dive.mdx
- action: add [magnetic-switches-deep-dive](/article/magnetic-switches-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ optical-switches-explained — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/optical-switches-explained.mdx
- action: add [optical-switches-explained](/article/optical-switches-explained) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ pcb-flex-cuts-explained — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, pcb)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, pcb
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/pcb-flex-cuts-explained.mdx
- action: add [pcb-flex-cuts-explained](/article/pcb-flex-cuts-explained) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ rapid-trigger-firmware-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, firmware)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, firmware
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/rapid-trigger-firmware-deep-dive.mdx
- action: add [rapid-trigger-firmware-deep-dive](/article/rapid-trigger-firmware-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ tactile-stem-geometry-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- action: add [tactile-stem-geometry-deep-dive](/article/tactile-stem-geometry-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [ ] [cross-links] [4.5] key-matrix-ghosting-deep-dive ↔ tmr-switches-deep-dive — no prose cross-link (same pillar, ≥2 shared tags: deep-dive, switches)
- category: cross-links
- filed: 2026-11-18 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: deep-dive, switches
- article-a: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- article-b: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- action: add [tmr-switches-deep-dive](/article/tmr-switches-deep-dive) to key-matrix-ghosting-deep-dive body, or vice versa

### [x] [HOT PURSUIT] [content-gap] [7] trends pillar — 1 of ≥2 articles in last 30d — addressed in 9e9fdf73, closes #1088
- category: content-gaps
- impact: 8 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: trends
- window-count: 1
- window-start: 2026-10-19
- score: 7
- next: /ship-content → trends pillar article
- issue: #1088
> Filed 2026-11-18 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [ ] [cross-links] [4.5] mode-lull-breaks-crown-mounting-encore ↔ 75-percent-default — no prose cross-link (same pillar, ≥2 shared tags: mode, trends-2026)
- category: cross-links
- filed: 2026-11-19 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: mode, trends-2026
- article-a: apps/web/src/content/articles/mode-lull-breaks-crown-mounting-encore.mdx
- article-b: apps/web/src/content/articles/75-percent-default.mdx
- action: add [75-percent-default](/article/75-percent-default) to mode-lull-breaks-crown-mounting-encore body, or vice versa

### [ ] [cross-links] [4.5] mode-lull-breaks-crown-mounting-encore ↔ prototypist-vendor-spotlight — no prose cross-link (same pillar, ≥2 shared tags: vendor, trends-2026)
- category: cross-links
- filed: 2026-11-19 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: vendor, trends-2026
- article-a: apps/web/src/content/articles/mode-lull-breaks-crown-mounting-encore.mdx
- article-b: apps/web/src/content/articles/prototypist-vendor-spotlight.mdx
- action: add [prototypist-vendor-spotlight](/article/prototypist-vendor-spotlight) to mode-lull-breaks-crown-mounting-encore body, or vice versa

### [ ] [cross-links] [4.5] mode-lull-breaks-crown-mounting-encore ↔ vendor-first-customs — no prose cross-link (same pillar, ≥2 shared tags: mode, vendor, trends-2026)
- category: cross-links
- filed: 2026-11-19 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: mode, vendor, trends-2026
- article-a: apps/web/src/content/articles/mode-lull-breaks-crown-mounting-encore.mdx
- article-b: apps/web/src/content/articles/vendor-first-customs.mdx
- action: add [vendor-first-customs](/article/vendor-first-customs) to mode-lull-breaks-crown-mounting-encore body, or vice versa

### [x] [newsletter] [4.0] Weekly digest — issue 015 due (7 days since issue 14) — addressed in c4cb5464, closes #1091
- category: content-gaps
- filed: 2026-11-19 by newsletter-gap-survey.mjs
- impact: 5 (newsletter archive going stale reduces /newsletter value and reader trust in cadence)
- ease: 8 (content-curator weekly round-up: 5 pillar picks + tracker insight)
- score: 4.0 (impact × ease / 10)
- next: /ship-content → newsletter type (weekly round-up, 5 pillar picks, tracker insight)
- last-issue: 2026-11-12 (thock-weekly-014)
- days-since: 7
- issue: #1091
> Filed 2026-11-19 by newsletter-gap-survey.mjs. 7 days since issue 14. Threshold: ≥7 calendar days.

### [ ] [engineering] [3.6] `article-parts-check.mjs`'s single-file mode fires false-positive violations against every newsletter issue — the fix it suggests is impossible under the strict `NewsletterFrontmatterSchema`
- category: engineering
- filed: 2026-11-20 by cloud /ship-content tick (newsletter issue 015 dispatch)
- impact: 6 (`skills/ship-content.md` Step 7b directs running `node scripts/article-parts-check.mjs <file>` as a blocking gate on every new piece, including newsletters per the "Newsletter cadence note" in Step 4. But `NewsletterFrontmatterSchema` (`packages/content/src/schema/newsletter.ts`) is `.strict()` with exactly 5 fields — `slug`, `title`, `lede`, `issue`, `publishedAt` — no `mentionedParts` field exists or can exist without breaking schema validation. The checker's single-file mode has no newsletter-vs-article branch, so it flags every catalog-entity mention in newsletter prose (verified reproducing against both the just-shipped issue 015 and the pre-existing issue 014: 2-3 violations each) with a "fix" — add to `mentionedParts` — that cannot be applied. Every prior newsletter dispatch either silently skipped Step 7b or ran it and treated the un-fixable violations as blocking noise; this tick proceeded past it rather than block indefinitely on a check the content type cannot pass)
- ease: 6 (two options: (a) `article-parts-check.mjs`'s single-file mode exits 0 immediately for any file outside `apps/web/src/content/articles/` — mirrors the scan mode's existing `ARTICLES_DIR`-only scope; or (b) `skills/ship-content.md`'s "Newsletter cadence note" explicitly says to skip Step 7b for newsletter rows, same as it already says to skip the brander sub-agent)
- score: 3.6 (impact × ease / 10)
- evidence: `scripts/article-parts-check.mjs` (no newsletter-path branch in single-file mode); `packages/content/src/schema/newsletter.ts` (`.strict()`, 5 fields, no `mentionedParts`); reproduced against `apps/web/src/content/newsletters/thock-weekly-014.mdx` (3 violations: MM Studio Class80, GMK CYL Ramune, Ikki68 Aurora) and `thock-weekly-015.mdx` (2 violations: Gateron Magnetic Jade, Bakeneko65)
- next: `/iterate` or `/plan-a-spec` — add a newsletter-path early-return to `article-parts-check.mjs`'s single-file mode (preferred: keeps the gate meaningful if it's ever pointed at a content type that does support `mentionedParts`), or amend `skills/ship-content.md` Step 7b to skip newsletters explicitly

### [ ] [seo] [5.4] 75-percent-default frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — 75-percent-default
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-05 even though the content last changed 2026-08-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/75-percent-default.mdx
- updatedAt: 2026-08-05
- lastContentCommitAt: 2026-08-30
- action: bump updatedAt in 75-percent-default.mdx's frontmatter to 2026-08-30 (or later)

### [ ] [seo] [5.4] acoustic-spec-rise frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — acoustic-spec-rise
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-05-24 even though the content last changed 2026-06-20)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/acoustic-spec-rise.mdx
- updatedAt: 2026-05-24
- lastContentCommitAt: 2026-06-20
- action: bump updatedAt in acoustic-spec-rise.mdx's frontmatter to 2026-06-20 (or later)

### [ ] [seo] [5.4] alice-layout-decline frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — alice-layout-decline
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-17 even though the content last changed 2026-06-20)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/alice-layout-decline.mdx
- updatedAt: 2026-06-17
- lastContentCommitAt: 2026-06-20
- action: bump updatedAt in alice-layout-decline.mdx's frontmatter to 2026-06-20 (or later)

### [ ] [seo] [5.4] alice-layout-recovery frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — alice-layout-recovery
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-18 even though the content last changed 2026-10-22)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/alice-layout-recovery.mdx
- updatedAt: 2026-10-18
- lastContentCommitAt: 2026-10-22
- action: bump updatedAt in alice-layout-recovery.mdx's frontmatter to 2026-10-22 (or later)

### [ ] [seo] [5.4] artisan-keycaps-buying-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — artisan-keycaps-buying-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-09 even though the content last changed 2026-10-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/artisan-keycaps-buying-guide.mdx
- updatedAt: 2026-10-09
- lastContentCommitAt: 2026-10-25
- action: bump updatedAt in artisan-keycaps-buying-guide.mdx's frontmatter to 2026-10-25 (or later)

### [ ] [seo] [5.4] aurora-glow-theme-build frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — aurora-glow-theme-build
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-07 even though the content last changed 2026-11-10)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/aurora-glow-theme-build.mdx
- updatedAt: 2026-11-07
- lastContentCommitAt: 2026-11-10
- action: bump updatedAt in aurora-glow-theme-build.mdx's frontmatter to 2026-11-10 (or later)

### [ ] [seo] [5.4] beginners-switch-buying-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — beginners-switch-buying-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-07 even though the content last changed 2026-08-23)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/beginners-switch-buying-guide.mdx
- updatedAt: 2026-06-07
- lastContentCommitAt: 2026-08-23
- action: bump updatedAt in beginners-switch-buying-guide.mdx's frontmatter to 2026-08-23 (or later)

### [ ] [seo] [5.4] bento-box-theme-build frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — bento-box-theme-build
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-22 even though the content last changed 2026-09-26)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/bento-box-theme-build.mdx
- updatedAt: 2026-09-22
- lastContentCommitAt: 2026-09-26
- action: bump updatedAt in bento-box-theme-build.mdx's frontmatter to 2026-09-26 (or later)

### [ ] [seo] [5.4] brass-weight-mod frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — brass-weight-mod
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-06 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/brass-weight-mod.mdx
- updatedAt: 2026-07-06
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in brass-weight-mod.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] buckling-spring-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — buckling-spring-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-13 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/buckling-spring-deep-dive.mdx
- updatedAt: 2026-08-13
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in buckling-spring-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] cannonkeys-mass80-extras-restock frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — cannonkeys-mass80-extras-restock
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-12 even though the content last changed 2026-10-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/cannonkeys-mass80-extras-restock.mdx
- updatedAt: 2026-10-12
- lastContentCommitAt: 2026-10-25
- action: bump updatedAt in cannonkeys-mass80-extras-restock.mdx's frontmatter to 2026-10-25 (or later)

### [ ] [seo] [5.4] case-materials-compared frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — case-materials-compared
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-08 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/case-materials-compared.mdx
- updatedAt: 2026-07-08
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in case-materials-compared.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] cherry-mx2a-revision frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — cherry-mx2a-revision
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-05 even though the content last changed 2026-08-08)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/cherry-mx2a-revision.mdx
- updatedAt: 2026-07-05
- lastContentCommitAt: 2026-08-08
- action: bump updatedAt in cherry-mx2a-revision.mdx's frontmatter to 2026-08-08 (or later)

### [ ] [seo] [5.4] cherry-tracker-slide-keychron-kickstarter-delivers frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — cherry-tracker-slide-keychron-kickstarter-delivers
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-30 even though the content last changed 2026-09-04)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/cherry-tracker-slide-keychron-kickstarter-delivers.mdx
- updatedAt: 2026-08-30
- lastContentCommitAt: 2026-09-04
- action: bump updatedAt in cherry-tracker-slide-keychron-kickstarter-delivers.mdx's frontmatter to 2026-09-04 (or later)

### [ ] [seo] [5.4] cherry-xtrfy-tmr-pivot frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — cherry-xtrfy-tmr-pivot
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-30 even though the content last changed 2026-08-26)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/cherry-xtrfy-tmr-pivot.mdx
- updatedAt: 2026-07-30
- lastContentCommitAt: 2026-08-26
- action: bump updatedAt in cherry-xtrfy-tmr-pivot.mdx's frontmatter to 2026-08-26 (or later)

### [ ] [seo] [5.4] clicky-switches-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — clicky-switches-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-15 even though the content last changed 2026-08-01)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/clicky-switches-deep-dive.mdx
- updatedAt: 2026-07-15
- lastContentCommitAt: 2026-08-01
- action: bump updatedAt in clicky-switches-deep-dive.mdx's frontmatter to 2026-08-01 (or later)

### [ ] [seo] [5.4] computex-2026-keyboard-highlights frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — computex-2026-keyboard-highlights
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-17 even though the content last changed 2026-08-09)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/computex-2026-keyboard-highlights.mdx
- updatedAt: 2026-06-17
- lastContentCommitAt: 2026-08-09
- action: bump updatedAt in computex-2026-keyboard-highlights.mdx's frontmatter to 2026-08-09 (or later)

### [ ] [seo] [5.4] custom-keyboard-kit-buyers-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — custom-keyboard-kit-buyers-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-14 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/custom-keyboard-kit-buyers-guide.mdx
- updatedAt: 2026-07-14
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in custom-keyboard-kit-buyers-guide.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] dcs-grass-valley-decline frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — dcs-grass-valley-decline
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-08 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/dcs-grass-valley-decline.mdx
- updatedAt: 2026-07-08
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in dcs-grass-valley-decline.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] dcs-olivetti-comeback frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — dcs-olivetti-comeback
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-05-24 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/dcs-olivetti-comeback.mdx
- updatedAt: 2026-05-24
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in dcs-olivetti-comeback.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] divinikey-dcs-dolch-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — divinikey-dcs-dolch-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-23 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/divinikey-dcs-dolch-group-buy.mdx
- updatedAt: 2026-08-23
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in divinikey-dcs-dolch-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] divinikey-gmk-cyl-orange-alert-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — divinikey-gmk-cyl-orange-alert-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-02 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/divinikey-gmk-cyl-orange-alert-group-buy.mdx
- updatedAt: 2026-09-02
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in divinikey-gmk-cyl-orange-alert-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] drop-holy-panda-x-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — drop-holy-panda-x-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-17 even though the content last changed 2026-07-21)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/drop-holy-panda-x-deep-dive.mdx
- updatedAt: 2026-06-17
- lastContentCommitAt: 2026-07-21
- action: bump updatedAt in drop-holy-panda-x-deep-dive.mdx's frontmatter to 2026-07-21 (or later)

### [ ] [seo] [5.4] durock-t1-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — durock-t1-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-08-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/durock-t1-deep-dive.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-08-24
- action: bump updatedAt in durock-t1-deep-dive.mdx's frontmatter to 2026-08-24 (or later)

### [ ] [seo] [5.4] frankenswitching-explained frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — frankenswitching-explained
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-21 even though the content last changed 2026-10-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/frankenswitching-explained.mdx
- updatedAt: 2026-10-21
- lastContentCommitAt: 2026-10-25
- action: bump updatedAt in frankenswitching-explained.mdx's frontmatter to 2026-10-25 (or later)

### [ ] [seo] [5.4] gateron-ink-housings-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gateron-ink-housings-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-24 even though the content last changed 2026-10-28)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gateron-ink-housings-deep-dive.mdx
- updatedAt: 2026-10-24
- lastContentCommitAt: 2026-10-28
- action: bump updatedAt in gateron-ink-housings-deep-dive.mdx's frontmatter to 2026-10-28 (or later)

### [ ] [seo] [5.4] gateron-lanes-tactile-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gateron-lanes-tactile-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-08 even though the content last changed 2026-08-23)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gateron-lanes-tactile-deep-dive.mdx
- updatedAt: 2026-07-08
- lastContentCommitAt: 2026-08-23
- action: bump updatedAt in gateron-lanes-tactile-deep-dive.mdx's frontmatter to 2026-08-23 (or later)

### [ ] [seo] [5.4] gateron-magnetic-jade-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gateron-magnetic-jade-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-21 even though the content last changed 2026-08-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gateron-magnetic-jade-deep-dive.mdx
- updatedAt: 2026-08-21
- lastContentCommitAt: 2026-08-24
- action: bump updatedAt in gateron-magnetic-jade-deep-dive.mdx's frontmatter to 2026-08-24 (or later)

### [ ] [seo] [5.4] gateron-magnetic-jade-sensing-backfill frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gateron-magnetic-jade-sensing-backfill
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-09 even though the content last changed 2026-11-12)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gateron-magnetic-jade-sensing-backfill.mdx
- updatedAt: 2026-11-09
- lastContentCommitAt: 2026-11-12
- action: bump updatedAt in gateron-magnetic-jade-sensing-backfill.mdx's frontmatter to 2026-11-12 (or later)

### [ ] [seo] [5.4] gazzew-boba-family-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gazzew-boba-family-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-27 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gazzew-boba-family-deep-dive.mdx
- updatedAt: 2026-07-27
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in gazzew-boba-family-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] gazzew-boba-u4t-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gazzew-boba-u4t-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-23 even though the content last changed 2026-08-26)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gazzew-boba-u4t-deep-dive.mdx
- updatedAt: 2026-07-23
- lastContentCommitAt: 2026-08-26
- action: bump updatedAt in gazzew-boba-u4t-deep-dive.mdx's frontmatter to 2026-08-26 (or later)

### [ ] [seo] [5.4] gmk-cyl-greg-2-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-greg-2-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-greg-2-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-greg-2-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-ishtar-r2-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-ishtar-r2-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-ishtar-r2-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-ishtar-r2-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-just-beachy-group-buy-opens frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-just-beachy-group-buy-opens
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-12 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-just-beachy-group-buy-opens.mdx
- updatedAt: 2026-08-12
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-just-beachy-group-buy-opens.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-king-of-the-seas-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-king-of-the-seas-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-king-of-the-seas-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-king-of-the-seas-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-masterpiece-r2-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-masterpiece-r2-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-masterpiece-r2-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-masterpiece-r2-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-pandemonium-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-pandemonium-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-pandemonium-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-pandemonium-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-prussian-alert frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-prussian-alert
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-24 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-prussian-alert.mdx
- updatedAt: 2026-07-24
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-prussian-alert.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-ramune-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-ramune-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-ramune-group-buy.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-ramune-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-red-devils-r2-comeback frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-red-devils-r2-comeback
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-10 even though the content last changed 2026-10-01)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-red-devils-r2-comeback.mdx
- updatedAt: 2026-09-10
- lastContentCommitAt: 2026-10-01
- action: bump updatedAt in gmk-cyl-red-devils-r2-comeback.mdx's frontmatter to 2026-10-01 (or later)

### [ ] [seo] [5.4] gmk-cyl-selene-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-selene-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-24 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-selene-group-buy.mdx
- updatedAt: 2026-07-24
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gmk-cyl-selene-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] gmk-cyl-zombie-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gmk-cyl-zombie-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-25 even though the content last changed 2026-10-26)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gmk-cyl-zombie-group-buy.mdx
- updatedAt: 2026-10-25
- lastContentCommitAt: 2026-10-26
- action: bump updatedAt in gmk-cyl-zombie-group-buy.mdx's frontmatter to 2026-10-26 (or later)

### [ ] [seo] [5.4] gsk-sweet-nightmare-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — gsk-sweet-nightmare-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-07 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/gsk-sweet-nightmare-group-buy.mdx
- updatedAt: 2026-07-07
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in gsk-sweet-nightmare-group-buy.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] hall-effect-mainstream frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — hall-effect-mainstream
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-08-09)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/hall-effect-mainstream.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-08-09
- action: bump updatedAt in hall-effect-mainstream.mdx's frontmatter to 2026-08-09 (or later)

### [ ] [seo] [5.4] hall-effect-rapid-trigger-plateau frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — hall-effect-rapid-trigger-plateau
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-22 even though the content last changed 2026-08-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/hall-effect-rapid-trigger-plateau.mdx
- updatedAt: 2026-08-22
- lastContentCommitAt: 2026-08-25
- action: bump updatedAt in hall-effect-rapid-trigger-plateau.mdx's frontmatter to 2026-08-25 (or later)

### [ ] [seo] [5.4] hall-effect-score-dips-wooting-ship-slips frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — hall-effect-score-dips-wooting-ship-slips
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-04 even though the content last changed 2026-11-12)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/hall-effect-score-dips-wooting-ship-slips.mdx
- updatedAt: 2026-11-04
- lastContentCommitAt: 2026-11-12
- action: bump updatedAt in hall-effect-score-dips-wooting-ship-slips.mdx's frontmatter to 2026-11-12 (or later)

### [ ] [seo] [5.4] hmx-cloud-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — hmx-cloud-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-12 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- updatedAt: 2026-08-12
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in hmx-cloud-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] holee-mod-explained frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — holee-mod-explained
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-31 even though the content last changed 2026-08-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/holee-mod-explained.mdx
- updatedAt: 2026-07-31
- lastContentCommitAt: 2026-08-30
- action: bump updatedAt in holee-mod-explained.mdx's frontmatter to 2026-08-30 (or later)

### [ ] [seo] [5.4] how-keycaps-are-made-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — how-keycaps-are-made-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-08 even though the content last changed 2026-08-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/how-keycaps-are-made-deep-dive.mdx
- updatedAt: 2026-08-08
- lastContentCommitAt: 2026-08-30
- action: bump updatedAt in how-keycaps-are-made-deep-dive.mdx's frontmatter to 2026-08-30 (or later)

### [ ] [seo] [5.4] how-to-evaluate-a-group-buy frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — how-to-evaluate-a-group-buy
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-31 even though the content last changed 2026-11-07)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/how-to-evaluate-a-group-buy.mdx
- updatedAt: 2026-10-31
- lastContentCommitAt: 2026-11-07
- action: bump updatedAt in how-to-evaluate-a-group-buy.mdx's frontmatter to 2026-11-07 (or later)

### [ ] [seo] [5.4] key-matrix-ghosting-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — key-matrix-ghosting-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-13 even though the content last changed 2026-11-18)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/key-matrix-ghosting-deep-dive.mdx
- updatedAt: 2026-11-13
- lastContentCommitAt: 2026-11-18
- action: bump updatedAt in key-matrix-ghosting-deep-dive.mdx's frontmatter to 2026-11-18 (or later)

### [ ] [seo] [5.4] keyboard-acoustics-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keyboard-acoustics-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-26 even though the content last changed 2026-08-08)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keyboard-acoustics-deep-dive.mdx
- updatedAt: 2026-07-26
- lastContentCommitAt: 2026-08-08
- action: bump updatedAt in keyboard-acoustics-deep-dive.mdx's frontmatter to 2026-08-08 (or later)

### [ ] [seo] [5.4] keyboard-cables-compared frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keyboard-cables-compared
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-16 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keyboard-cables-compared.mdx
- updatedAt: 2026-07-16
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in keyboard-cables-compared.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] keyboard-layout-sizes-buying-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keyboard-layout-sizes-buying-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-22 even though the content last changed 2026-08-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keyboard-layout-sizes-buying-guide.mdx
- updatedAt: 2026-08-22
- lastContentCommitAt: 2026-08-25
- action: bump updatedAt in keyboard-layout-sizes-buying-guide.mdx's frontmatter to 2026-08-25 (or later)

### [ ] [seo] [5.4] keycap-profiles-compared frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keycap-profiles-compared
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-09 even though the content last changed 2026-07-31)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keycap-profiles-compared.mdx
- updatedAt: 2026-06-09
- lastContentCommitAt: 2026-07-31
- action: bump updatedAt in keycap-profiles-compared.mdx's frontmatter to 2026-07-31 (or later)

### [ ] [seo] [5.4] keychron-q-ultra-zmk frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keychron-q-ultra-zmk
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-10 even though the content last changed 2026-08-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keychron-q-ultra-zmk.mdx
- updatedAt: 2026-06-10
- lastContentCommitAt: 2026-08-30
- action: bump updatedAt in keychron-q-ultra-zmk.mdx's frontmatter to 2026-08-30 (or later)

### [ ] [seo] [5.4] keychron-q16-he-8k-ceramic-tmr frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — keychron-q16-he-8k-ceramic-tmr
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-07 even though the content last changed 2026-09-16)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/keychron-q16-he-8k-ceramic-tmr.mdx
- updatedAt: 2026-09-07
- lastContentCommitAt: 2026-09-16
- action: bump updatedAt in keychron-q16-he-8k-ceramic-tmr.mdx's frontmatter to 2026-09-16 (or later)

### [ ] [seo] [5.4] leaf-spring-mount-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — leaf-spring-mount-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-04 even though the content last changed 2026-08-23)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/leaf-spring-mount-deep-dive.mdx
- updatedAt: 2026-08-04
- lastContentCommitAt: 2026-08-23
- action: bump updatedAt in leaf-spring-mount-deep-dive.mdx's frontmatter to 2026-08-23 (or later)

### [ ] [seo] [5.4] low-profile-keyboards-buying-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — low-profile-keyboards-buying-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-28 even though the content last changed 2026-11-11)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/low-profile-keyboards-buying-guide.mdx
- updatedAt: 2026-10-28
- lastContentCommitAt: 2026-11-11
- action: bump updatedAt in low-profile-keyboards-buying-guide.mdx's frontmatter to 2026-11-11 (or later)

### [ ] [seo] [5.4] lubing-101 frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — lubing-101
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-07 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/lubing-101.mdx
- updatedAt: 2026-06-07
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in lubing-101.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] lubing-switches-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — lubing-switches-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-05 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/lubing-switches-guide.mdx
- updatedAt: 2026-06-05
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in lubing-switches-guide.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] magnetic-switches-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — magnetic-switches-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-12 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/magnetic-switches-deep-dive.mdx
- updatedAt: 2026-06-12
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in magnetic-switches-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] mission-control-theme-build frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mission-control-theme-build
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-06 even though the content last changed 2026-09-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mission-control-theme-build.mdx
- updatedAt: 2026-09-06
- lastContentCommitAt: 2026-09-14
- action: bump updatedAt in mission-control-theme-build.mdx's frontmatter to 2026-09-14 (or later)

### [ ] [seo] [5.4] mixing-keycap-profiles frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mixing-keycap-profiles
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-20 even though the content last changed 2026-08-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mixing-keycap-profiles.mdx
- updatedAt: 2026-07-20
- lastContentCommitAt: 2026-08-24
- action: bump updatedAt in mixing-keycap-profiles.mdx's frontmatter to 2026-08-24 (or later)

### [ ] [seo] [5.4] mm-studio-class80-discontinued frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mm-studio-class80-discontinued
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-25 even though the content last changed 2026-11-07)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mm-studio-class80-discontinued.mdx
- updatedAt: 2026-10-25
- lastContentCommitAt: 2026-11-07
- action: bump updatedAt in mm-studio-class80-discontinued.mdx's frontmatter to 2026-11-07 (or later)

### [ ] [seo] [5.4] mode-lull-breaks-crown-mounting-encore frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mode-lull-breaks-crown-mounting-encore
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-16 even though the content last changed 2026-11-19)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mode-lull-breaks-crown-mounting-encore.mdx
- updatedAt: 2026-11-16
- lastContentCommitAt: 2026-11-19
- action: bump updatedAt in mode-lull-breaks-crown-mounting-encore.mdx's frontmatter to 2026-11-19 (or later)

### [ ] [seo] [5.4] mounting-styles-compared frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mounting-styles-compared
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-23 even though the content last changed 2026-08-31)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mounting-styles-compared.mdx
- updatedAt: 2026-08-23
- lastContentCommitAt: 2026-08-31
- action: bump updatedAt in mounting-styles-compared.mdx's frontmatter to 2026-08-31 (or later)

### [ ] [seo] [5.4] mt3-devtty-restock frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — mt3-devtty-restock
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-29 even though the content last changed 2026-09-13)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/mt3-devtty-restock.mdx
- updatedAt: 2026-08-29
- lastContentCommitAt: 2026-09-13
- action: bump updatedAt in mt3-devtty-restock.mdx's frontmatter to 2026-09-13 (or later)

### [ ] [seo] [5.4] o-ring-mod frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — o-ring-mod
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-11 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/o-ring-mod.mdx
- updatedAt: 2026-06-11
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in o-ring-mod.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] optical-switches-explained frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — optical-switches-explained
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-17 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/optical-switches-explained.mdx
- updatedAt: 2026-07-17
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in optical-switches-explained.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] pe-foam-mod frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — pe-foam-mod
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-07 even though the content last changed 2026-08-09)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/pe-foam-mod.mdx
- updatedAt: 2026-06-07
- lastContentCommitAt: 2026-08-09
- action: bump updatedAt in pe-foam-mod.mdx's frontmatter to 2026-08-09 (or later)

### [ ] [seo] [5.4] prototypist-vendor-spotlight frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — prototypist-vendor-spotlight
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-12 even though the content last changed 2026-08-29)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/prototypist-vendor-spotlight.mdx
- updatedAt: 2026-08-12
- lastContentCommitAt: 2026-08-29
- action: bump updatedAt in prototypist-vendor-spotlight.mdx's frontmatter to 2026-08-29 (or later)

### [ ] [seo] [5.4] rapid-trigger-firmware-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — rapid-trigger-firmware-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-02 even though the content last changed 2026-09-25)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/rapid-trigger-firmware-deep-dive.mdx
- updatedAt: 2026-09-02
- lastContentCommitAt: 2026-09-25
- action: bump updatedAt in rapid-trigger-firmware-deep-dive.mdx's frontmatter to 2026-09-25 (or later)

### [ ] [seo] [5.4] rapid-trigger-gaming-crossover frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — rapid-trigger-gaming-crossover
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-12 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/rapid-trigger-gaming-crossover.mdx
- updatedAt: 2026-06-12
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in rapid-trigger-gaming-crossover.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] retrobrighting-keycaps frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — retrobrighting-keycaps
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-22 even though the content last changed 2026-07-06)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/retrobrighting-keycaps.mdx
- updatedAt: 2026-06-22
- lastContentCommitAt: 2026-07-06
- action: bump updatedAt in retrobrighting-keycaps.mdx's frontmatter to 2026-07-06 (or later)

### [ ] [seo] [5.4] silent-switch-damping-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — silent-switch-damping-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-19 even though the content last changed 2026-08-26)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/silent-switch-damping-deep-dive.mdx
- updatedAt: 2026-08-19
- lastContentCommitAt: 2026-08-26
- action: bump updatedAt in silent-switch-damping-deep-dive.mdx's frontmatter to 2026-08-26 (or later)

### [ ] [seo] [5.4] sound-dampening-compared frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — sound-dampening-compared
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-08 even though the content last changed 2026-08-11)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/sound-dampening-compared.mdx
- updatedAt: 2026-06-08
- lastContentCommitAt: 2026-08-11
- action: bump updatedAt in sound-dampening-compared.mdx's frontmatter to 2026-08-11 (or later)

### [ ] [seo] [5.4] split-ergo-buyers-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — split-ergo-buyers-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-28 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/split-ergo-buyers-guide.mdx
- updatedAt: 2026-07-28
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in split-ergo-buyers-guide.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] split-ergo-cohort frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — split-ergo-cohort
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-05-24 even though the content last changed 2026-07-21)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/split-ergo-cohort.mdx
- updatedAt: 2026-05-24
- lastContentCommitAt: 2026-07-21
- action: bump updatedAt in split-ergo-cohort.mdx's frontmatter to 2026-07-21 (or later)

### [ ] [seo] [5.4] split-ergo-mechanics-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — split-ergo-mechanics-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-01 even though the content last changed 2026-08-23)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/split-ergo-mechanics-deep-dive.mdx
- updatedAt: 2026-08-01
- lastContentCommitAt: 2026-08-23
- action: bump updatedAt in split-ergo-mechanics-deep-dive.mdx's frontmatter to 2026-08-23 (or later)

### [ ] [seo] [5.4] split-ergo-parts-pairing frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — split-ergo-parts-pairing
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-08-26 even though the content last changed 2026-08-31)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/split-ergo-parts-pairing.mdx
- updatedAt: 2026-08-26
- lastContentCommitAt: 2026-08-31
- action: bump updatedAt in split-ergo-parts-pairing.mdx's frontmatter to 2026-08-31 (or later)

### [ ] [seo] [5.4] spring-swaps-explained frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — spring-swaps-explained
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-08 even though the content last changed 2026-07-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/spring-swaps-explained.mdx
- updatedAt: 2026-06-08
- lastContentCommitAt: 2026-07-14
- action: bump updatedAt in spring-swaps-explained.mdx's frontmatter to 2026-07-14 (or later)

### [ ] [seo] [5.4] stabilizer-servicing-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — stabilizer-servicing-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-09 even though the content last changed 2026-06-16)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/stabilizer-servicing-guide.mdx
- updatedAt: 2026-06-09
- lastContentCommitAt: 2026-06-16
- action: bump updatedAt in stabilizer-servicing-guide.mdx's frontmatter to 2026-06-16 (or later)

### [ ] [seo] [5.4] stabilizers-explained frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — stabilizers-explained
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-05-31 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/stabilizers-explained.mdx
- updatedAt: 2026-05-31
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in stabilizers-explained.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] switch-actuation-weight-buying-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — switch-actuation-weight-buying-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-01 even though the content last changed 2026-10-14)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/switch-actuation-weight-buying-guide.mdx
- updatedAt: 2026-10-01
- lastContentCommitAt: 2026-10-14
- action: bump updatedAt in switch-actuation-weight-buying-guide.mdx's frontmatter to 2026-10-14 (or later)

### [ ] [seo] [5.4] synthwave-tkl-theme-build frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — synthwave-tkl-theme-build
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-02 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/synthwave-tkl-theme-build.mdx
- updatedAt: 2026-10-02
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in synthwave-tkl-theme-build.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] tactile-stem-geometry-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — tactile-stem-geometry-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-15 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/tactile-stem-geometry-deep-dive.mdx
- updatedAt: 2026-10-15
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in tactile-stem-geometry-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] tape-mod frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — tape-mod
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-09 even though the content last changed 2026-06-15)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/tape-mod.mdx
- updatedAt: 2026-06-09
- lastContentCommitAt: 2026-06-15
- action: bump updatedAt in tape-mod.mdx's frontmatter to 2026-06-15 (or later)

### [ ] [seo] [5.4] tmr-switches-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — tmr-switches-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-10-14 even though the content last changed 2026-10-24)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/tmr-switches-deep-dive.mdx
- updatedAt: 2026-10-14
- lastContentCommitAt: 2026-10-24
- action: bump updatedAt in tmr-switches-deep-dive.mdx's frontmatter to 2026-10-24 (or later)

### [ ] [seo] [5.4] tmr-switches-five-week-climb frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — tmr-switches-five-week-climb
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-30 even though the content last changed 2026-10-15)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/tmr-switches-five-week-climb.mdx
- updatedAt: 2026-09-30
- lastContentCommitAt: 2026-10-15
- action: bump updatedAt in tmr-switches-five-week-climb.mdx's frontmatter to 2026-10-15 (or later)

### [ ] [seo] [5.4] topre-electrocapacitive-deep-dive frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — topre-electrocapacitive-deep-dive
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-15 even though the content last changed 2026-07-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/topre-electrocapacitive-deep-dive.mdx
- updatedAt: 2026-07-15
- lastContentCommitAt: 2026-07-30
- action: bump updatedAt in topre-electrocapacitive-deep-dive.mdx's frontmatter to 2026-07-30 (or later)

### [ ] [seo] [5.4] trends-tracker-preview frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — trends-tracker-preview
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-16 even though the content last changed 2026-07-21)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/trends-tracker-preview.mdx
- updatedAt: 2026-07-16
- lastContentCommitAt: 2026-07-21
- action: bump updatedAt in trends-tracker-preview.mdx's frontmatter to 2026-07-21 (or later)

### [ ] [seo] [5.4] typing-tests-lie frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — typing-tests-lie
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-06-08 even though the content last changed 2026-08-30)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/typing-tests-lie.mdx
- updatedAt: 2026-06-08
- lastContentCommitAt: 2026-08-30
- action: bump updatedAt in typing-tests-lie.mdx's frontmatter to 2026-08-30 (or later)

### [ ] [seo] [5.4] wooting-80he-plus-shipping-update frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — wooting-80he-plus-shipping-update
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-18 even though the content last changed 2026-09-29)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/wooting-80he-plus-shipping-update.mdx
- updatedAt: 2026-09-18
- lastContentCommitAt: 2026-09-29
- action: bump updatedAt in wooting-80he-plus-shipping-update.mdx's frontmatter to 2026-09-29 (or later)

### [ ] [seo] [5.4] wooting-rapid-trigger-head-start frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — wooting-rapid-trigger-head-start
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-09-19 even though the content last changed 2026-09-28)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/wooting-rapid-trigger-head-start.mdx
- updatedAt: 2026-09-19
- lastContentCommitAt: 2026-09-28
- action: bump updatedAt in wooting-rapid-trigger-head-start.mdx's frontmatter to 2026-09-28 (or later)

### [ ] [seo] [5.4] zmk-mainstream-shift frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — zmk-mainstream-shift
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-05-27 even though the content last changed 2026-07-22)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/zmk-mainstream-shift.mdx
- updatedAt: 2026-05-27
- lastContentCommitAt: 2026-07-22
- action: bump updatedAt in zmk-mainstream-shift.mdx's frontmatter to 2026-07-22 (or later)

### [ ] [seo] [5.4] zmk-wireless-split-firmware-guide frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-19 by stale-updated-at-check.mjs — zmk-wireless-split-firmware-guide
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-07-24 even though the content last changed 2026-07-28)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/zmk-wireless-split-firmware-guide.mdx
- updatedAt: 2026-07-24
- lastContentCommitAt: 2026-07-28
- action: bump updatedAt in zmk-wireless-split-firmware-guide.mdx's frontmatter to 2026-07-28 (or later)

### [x] [content-gap] [7] ideas pillar — 1 of ≥2 articles in last 30d
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ideas
- window-count: 1
- window-start: 2026-10-22
- score: 7
- next: /ship-content → ideas pillar article
- issue: #1093
- addressed: a081072c — "Switch break-in: what running a switch in actually changes" (switch-break-in-myth.mdx, publishedAt 2026-11-18)
> Filed 2026-11-21 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ frankenswitching-explained — no prose cross-link (same pillar, ≥2 shared tags: switches, linear, tactile, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, linear, tactile, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/frankenswitching-explained.mdx
- action: add [frankenswitching-explained](/article/frankenswitching-explained) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ holee-mod-explained — no prose cross-link (same pillar, ≥2 shared tags: switches, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/holee-mod-explained.mdx
- action: add [holee-mod-explained](/article/holee-mod-explained) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ lubing-switches-guide — no prose cross-link (same pillar, ≥2 shared tags: switches, linear, tactile, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, linear, tactile, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/lubing-switches-guide.mdx
- action: add [lubing-switches-guide](/article/lubing-switches-guide) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ spring-swaps-explained — no prose cross-link (same pillar, ≥2 shared tags: switches, linear, tactile, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, linear, tactile, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/spring-swaps-explained.mdx
- action: add [spring-swaps-explained](/article/spring-swaps-explained) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ stabilizer-servicing-guide — no prose cross-link (same pillar, ≥2 shared tags: linear, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/stabilizer-servicing-guide.mdx
- action: add [stabilizer-servicing-guide](/article/stabilizer-servicing-guide) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ switch-films-worth-it — no prose cross-link (same pillar, ≥2 shared tags: switches, linear, tactile, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, linear, tactile, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/switch-films-worth-it.mdx
- action: add [switch-films-worth-it](/article/switch-films-worth-it) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ tape-mod — no prose cross-link (same pillar, ≥2 shared tags: linear, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: linear, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/tape-mod.mdx
- action: add [tape-mod](/article/tape-mod) to switch-break-in-myth body, or vice versa

### [ ] [cross-links] [4.5] switch-break-in-myth ↔ typing-tests-lie — no prose cross-link (same pillar, ≥2 shared tags: switches, modding)
- category: cross-links
- filed: 2026-11-21 by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: switches, modding
- article-a: apps/web/src/content/articles/switch-break-in-myth.mdx
- article-b: apps/web/src/content/articles/typing-tests-lie.mdx
- action: add [typing-tests-lie](/article/typing-tests-lie) to switch-break-in-myth body, or vice versa

### [ ] [seo] [5.4] switch-break-in-myth frontmatter updatedAt is stale
- category: seo
- filed: 2026-11-21 by stale-updated-at-check.mjs — switch-break-in-myth
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since 2026-11-18 even though the content last changed 2026-11-21)
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/switch-break-in-myth.mdx
- updatedAt: 2026-11-18
- lastContentCommitAt: 2026-11-21
- action: bump updatedAt in switch-break-in-myth.mdx's frontmatter to 2026-11-21 (or later)
