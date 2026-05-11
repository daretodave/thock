# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

> Bias: content-gaps (set via oversight 2026-05-10) — `/iterate`
> multiplies content-gap finding scores by 1.5 until cleared.
> Drives the loop toward the four content-velocity rules in
> `plan/bearings.md` "Content velocity & editorial cadence":
> pillar quota ≥8, tracker linkage within 14 days, group-buy
> companion, publishedAt gap-fill. Clears when corpus hits
> quota (≥8/pillar) and the audit no longer surfaces
> content-gap rows scoring above 5.0, OR via `/oversight reset`.

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

## Drained findings (kept for audit-trail; do not re-open)

### [x] Brand-assets-first posture — drain pass complete
> Filed 2026-05-09T12:30Z by `/oversight` after six page-family
> phases shipped on top of unshipped brand assets. Drained
> 2026-05-09 in three commits: `0dab0a8` (per-pillar OG
> handlers + shared `<PillarOGContent>` template), `0e7c9fd`
> (favicon set + six seed-article hero SVGs + frontmatter
> wiring + heroImage schema fix), and the same drain commit
> that updated `skills/iterate.md` to bundle hero rendering
> into new content shipping going forward. Phase 15+ unblocked.

### [x] [HIGH] Verification gap — `pnpm verify` doesn't exercise the production runtime
> Filed 2026-05-08 by `/oversight`. Drained by phase 4b
> (`d0147cc` + `1b3944c`): replaced the lambda's filesystem
> walk with a pre-built data manifest, added `pnpm
> deploy:smoke` post-push gate, migrated host to Vercel.
> Production probes 2xx across 10 patterns. Marked drained on
> 2026-05-09T12:30Z during oversight pass.

## Open findings

### [x] [MED] /404 soft fallback for unknown article + tag slugs (deferred from phase 16) — addressed in pending commit (this tick)
- issue: #18
> Filed 2026-05-09 by phase 16 brief. The global `app/not-found.tsx` ships in phase 16 with a search input + pillar nav. Article and tag routes have their own `not-found.tsx` (phases 5 + 12) but they don't suggest "Did you mean…?" matches. Spec from `plan/steps/01_build_plan.md` § Phase 16 calls for MiniSearch-powered suggestions on `/article/<unknown-slug>` and `/tag/<unknown-slug>`. Cheap once the search index already ships (phase 14): the not-found page can call `searchIndex.search(slug)` and surface the top 3 hits.
>
> **Action:** update `apps/web/src/app/article/[slug]/not-found.tsx` and `apps/web/src/app/tag/[slug]/not-found.tsx` to call into the search index built by phase 14 and render up to 3 matches. New e2e in `apps/e2e/tests/polish.spec.ts` covers the suggestion path.
>
> Score: **6.0** (small surface, real reader UX win once article catalog grows).
>
> **Resolved (2026-05-10):** Shipped a `<SuggestedArticles>` Server Component at `apps/web/src/components/not-found/SuggestedArticles.tsx` that takes a slug, calls `searchArticles(slugAsQuery, 3)` from the phase-14 runtime, and renders 0–3 hits with pillar eyebrow + title + publishedAt. New `apps/web/src/middleware.ts` forwards `request.nextUrl.pathname` into an `x-pathname` header so Server Components can recover the slug (Next 15 doesn't pass route params to `not-found.tsx`). Both per-route not-found pages now read the header, derive the slug via a `pathnameToSlug` helper, and render the suggestions rail (article variant uses "did you mean", tag variant uses "articles touching that topic"). The slug-to-query transform replaces hyphens/underscores with spaces; empty slugs short-circuit to `null` so the 404 stays clean when no overlap exists. New e2e in `apps/e2e/tests/polish.spec.ts` covers the catalog-overlap + no-overlap + tag-fallback cases. Unit test for `pathnameToSlug` covers the `null` / root / trailing-slash edge cases. 324 e2e green on first parallel attempt — clean run, no #418 hydration flake.

### [x] [MED] Accessibility audit pass — phase 16 follow-up — addressed in pending commit (this tick)
> Filed 2026-05-09 by phase 16 brief. Phase 16's polish scope listed an a11y pass: contrast against the OKLCH tokens, focus rings on every interactive, alt text on every `<img>`, heading order, keyboard nav. Deferred from the page-shipping tick because the audit itself wants its own structured pass with a checklist + per-finding fixes.
>
> **Action:** new audit pass that walks every canonical URL, runs axe-core (or a hand checklist) at desktop + mobile, files individual `[a11y]` rows here for each violation. Drain on subsequent /iterate ticks.
>
> Score: **5.5** (aggregate of many small issues; each fix is cheap but the discovery is the work).
>
> **Resolved (2026-05-10):** Hand-audit pass walked 8 canonical URLs (/, /article/gateron-oil-king-deep-dive, /trends/tracker, /group-buys, /search, /about, /sources, /tag/gateron) by curling rendered HTML and grepping for the 9-pattern checklist below. The site is in remarkably good a11y shape — only **2 findings** filed:
>
> - **[MED] /trends/tracker — heading level skipped (h1 → h3)** filed below
> - **[LOW] all pages — no skip-to-main-content link** filed below
>
> What was checked clean across all 8 URLs (audit-trail for the next pass): (1) `<img alt>` — 13 images, 100% have descriptive alt text. (2) `<button>` accessible names — zero empty/unlabeled. (3) `<a>` accessible names — zero empty/unlabeled, zero `href="#"` placeholders. (4) `<input>` labels — only the footer newsletter input renders SSR (has matching `<label for>`); /search input is client-rendered → flagged for a separate browser-based pass once a real-browser tooling decision lands. (5) `<svg>` decorative gating — 66 SVGs total (40 on /trends/tracker sparklines), 100% have `aria-hidden="true"`, `role="img"`, `aria-label`, or `<title>`. (6) heading order — 7 of 8 pages clean, single h1 each; only /trends/tracker has the skip noted above. (7) `tabindex` — zero across all 8 pages, no focus-trap smells. (8) `role="button"` on non-`<button>` — zero. (9) `<html lang="en">` — present on every page.
>
> Color-contrast was not checked per the brief (can't be hand-checked from HTML alone — needs a real-browser pass with the OKLCH-token computed values). Filed as a known limitation, not as a finding. /search's client-rendered shell is the same: needs browser pass for input/listbox/aria-live coverage. Both deferred to a future axe-core / playwright-axe wiring decision (which the loop should propose via `/expand` if the next two iterate ticks find more pattern-class limits to the hand checklist).
>
> The 2 filed findings drain in subsequent /iterate ticks. The [MED] heading-skip is the cheapest concrete win; the [LOW] skip-link is a one-time root-layout edit that touches every route.

### [x] [LOW] /sources per-citation index — phase 16 follow-up — addressed in pending commit (this tick)
- issue: #19
> Filed 2026-05-09 by phase 16 brief. The /sources page currently surfaces the per-article aggregate count of `<Source>` tags. The full per-citation index (article → quote → URL) requires an MDX walker that parses every body, extracts each `<Source href= text= />` tuple, dedupes by href, and surfaces (article, quote, source) rows. Worth shipping but not phase-16 scope.
>
> **Action:** new helper `extractSourceCitations(body: string): Array<{ href, text, position }>` in `@thock/content/util/`; new section on `/sources` rendering the deduped citation list. Probably wants its own ship-data flow if the citation count grows large.
>
> Score: **3.5** (real but cosmetic with the current article count of 6).
>
> **Resolved (2026-05-10):** Shipped exactly the row's recommended action. Added `extractSourceCitations(body): SourceCitation[]` next to `countSourceTags` in `packages/content/src/util/sources.ts` — single regex matches both `<Source href="..." />` (self-closing) and `<Source href="...">text</Source>` (paired) forms, captures href + inner text + character offset; whitespace-collapses and trims the text content; skips tags missing an href attribute. Exported via `packages/content/src/index.ts`. Built `<CitationIndex>` + `buildCitationIndex` helper at `apps/web/src/components/sources/CitationIndex.tsx` that takes `(article, citation)` pairs, dedupes by href, sorts citing articles by publishedAt-desc per row, and sorts the final index by most-recent-citing-article. `/sources` page now renders the per-article tally first, then a "Citation index" section with the deduped per-citation list. Each row links to the external URL (with `rel="noopener" target="_blank"`), shows the host+path, and lists the citing articles. Mobile-safe: `break-all` on the host span and `break-words` on title links handle long URLs without horizontal overflow at 375px. New e2e in `apps/e2e/tests/polish.spec.ts` asserts the index renders with at least one row pointing at a real https URL. New unit tests in `packages/content/src/__tests__/util/sources.test.ts` cover the extractor's empty / paired / self-closing / order / whitespace-collapse / multi-line-attrs / missing-href edge cases. Article count is now 12 (not the 6 the audit row's score basis assumed); the catalog has 15 total citations across 12 articles, so the index is non-trivial. 325 e2e green serially; first parallel attempt hit two #418 flakes on / and /news (same root cause as expand pass-2 candidate).

### [MED] Lighthouse CI — phase 17 follow-up (path locked 2026-05-11 via /oversight)
> Filed 2026-05-09 by phase 17 brief. The build-plan row for phase 17 listed a Lighthouse pass at ≥95 on `/` and `/article/[slug]`. The bundle-size budget shipped this phase covers the JS-weight axis on its own; this row is for the full Lighthouse signal (perf + a11y + best-practices + SEO).
>
> **Path (locked 2026-05-11 via /oversight):** `lighthouse-ci` GitHub Action with Vercel-preview integration. Rationale: $0-marginal (matches the user's near-zero-cost preference) — the action runs on GH-hosted ubuntu using Chrome from npm, pings the Vercel-preview URL for the PR, asserts against `.lighthouserc.json` thresholds, and comments the score table on the PR. Free for public repos. The `treosh/lighthouse-ci-action@v12` action is the canonical choice; configuration lives in `.lighthouserc.json` at repo root.
>
> **Action (drainable by `/iterate` or `/ship-a-phase`):**
> 1. Add `.lighthouserc.json` with assertion thresholds (perf ≥90, a11y ≥95, best-practices ≥95, SEO ≥95, PWA optional). Start permissive; tighten via subsequent iterate ticks.
> 2. Add `.github/workflows/lighthouse.yml` triggered on `pull_request` (no schedule needed — assertions run per-PR against the Vercel preview URL pulled from the deployment status event).
> 3. `numberOfRuns: 3` median-of-3 to absorb single-run noise.
> 4. URLs to walk: `/`, `/article/gateron-oil-king-deep-dive` (canonical article shape), `/trends/tracker` (data-heavy page), `/group-buys` (visual-heavy page).
> 5. Artifact upload via the action's built-in `uploadArtifacts: true`.
>
> Score: **5.0** (path locked; runner choice no longer blocks. Real signal once it runs).

### [x] [LOW] Tighten homepage bundle-size budget from 250 KB → 200 KB — addressed in pending commit (this tick)
> Filed 2026-05-09 by phase 17 brief. The bearings target is 200 KB gzipped for the homepage; phase 17 set the gate at 250 KB to leave one or two iterate ticks of headroom. After the loop drains any obvious chunk waste (lucide-react, large MDX shims, unused tag taxonomies), tighten the budget to 200 KB to match the bearings.
>
> **Action:** edit `apps/web/scripts/measure-bundle.mts` `DEFAULT_MAX_KB` to 200, or pass `--max=200` via the verify wiring in root `package.json`.
>
> Score: **2.5** (cosmetic until the chunk audit runs; chunk audit is the real work).
>
> **Resolved (2026-05-10):** No chunk-audit needed — current homepage bundle measures 108.7 KB gzipped (per `pnpm --filter @thock/web run size`), well under both the 250 KB phase-17 budget and the 200 KB bearings target. The corpus growth + iterate ticks since phase 17 added no meaningful bundle weight (article body weight is build-time-rendered MDX, not client JS). Bumped `DEFAULT_MAX_KB` from 250 → 200 in `apps/web/scripts/measure-bundle.mts:31` to match bearings; updated the script docblock to reflect the rationale + current baseline. The verify gate now enforces the bearings target directly. No remaining headroom needs a chunk-audit; that work fires only if a future phase pushes bundle weight back toward the 200 KB ceiling. 330 e2e green first parallel attempt.

### [x] [MED] [a11y] /trends/tracker — heading level skipped (h1 → h3 with no h2) — addressed in f70b1f3 (closes #33)
> Filed 2026-05-10 by /iterate audit pass (resolves the [MED] Accessibility audit pass row above).
>
> **Observation:** /trends/tracker's heading sequence is `h1 h3 h3 h3 h3 h2 h2 h2 h2 h2`. The h1 "What's actually rising this week" (offset 10804 in rendered HTML) is followed directly by four h3 cards ("Gateron Oil King", "Cherry MX2A revisions", "HMX Cloud", "Wuque Studio") at offsets 11947–15171, then later switch/keycap/layout/vendor/brand "movers" h2 sections. The h3-after-h1-without-h2 is a heading-level skip — screen-reader users navigating by heading jumps will perceive the rising cards as belonging to a missing or implied h2 section.
>
> **WCAG:** 1.3.1 Info and Relationships (AA).
>
> **Action:** likely the cleanest fix is to wrap the four "rising this week" card titles under a real h2 sub-section heading (e.g. an h2 "Top movers this week" right after the h1) so the structure becomes `h1 → h2 → h3*4 → h2*5`. Alternative: promote the four card titles from h3 to h2, joining the existing five movers h2 sections — but that loses the visual subordination of "preview cards" vs "category tables." Probably the wrap-with-h2 path is right; component is `apps/web/src/components/tracker/<RisingThisWeek?>` (search the codebase to find the actual file).
>
> Score: **4.0** (impact 5 — single page, real but narrow audience of heading-nav screen-reader users; ease 8 — one component edit + one e2e to lock the order).
>
> **Resolved (2026-05-10):** wrapped `<TrackerSummaryGrid>` in `apps/web/src/app/trends/tracker/page.tsx` with a visible h2 "This week at a glance" right after the TrackerHeader's h1. Sequence is now `h1 → h2 → h3*4 → h2*5` (no skip). Wording chosen over the audit's suggested "Top movers this week" because the four cards include Sleeper (which is flat by design — see also pending [MED] critique #8) — "movers" framing dilutes the Sleeper kind. New e2e regression guard at `apps/e2e/tests/trends.spec.ts` walks every heading in document order and asserts no level jump > 1 going down — catches future skips automatically. Verify: 409 e2e green parallel (no #418 flake this run).

### [LOW] [a11y] all pages — no "skip to main content" link
> Filed 2026-05-10 by /iterate audit pass (resolves the [MED] Accessibility audit pass row above).
>
> **Observation:** zero `href="#main"` (or equivalent) skip-link anchors exist across the rendered HTML of all 8 audited URLs. `<main>` is present and singular on every page (good — landmark structure is correct), but it is not addressable via a keyboard-first bypass control. Sighted keyboard users and screen-reader users who skip past the header have to tab through every header link + mobile-nav-toggle on every page navigation.
>
> **WCAG:** 2.4.1 Bypass Blocks (A).
>
> **Action:** add a visually-hidden-until-focused `<a href="#main" class="skip-link">Skip to main content</a>` as the first child of `<body>` in `apps/web/src/app/layout.tsx`, plus `id="main"` on the existing `<main>` element. One-time layout component change, applies to all routes. CSS for the skip-link's focus-reveal goes in `apps/web/src/app/globals.css` (or as Tailwind classes inline). Test: e2e visits `/`, focuses the skip link via Tab, asserts it becomes visible and that activating it moves focus to `<main>`.
>
> Score: **2.8** (impact 4 — keyboard users on every page; ease 7 — one layout edit + one global CSS rule + one e2e).

### [5.25] ideas pillar — 3 of 8 article quota (needs 5 more)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 3/8 articles leaves the landing page sparse)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 5 articles (current 3, quota 8)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when ideas reaches 8 articles.

### [5.25] deep-dives pillar — 3 of 8 article quota (needs 5 more)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; long-form inventory at 3/8 is thin)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 5 articles (current 3, quota 8)
- next: /ship-content → deep-dives pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when deep-dives reaches 8 articles.

### [4.5] guides pillar — 2 of 8 article quota (needs 6 more)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 2/8 is the most severe absolute shortfall)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 6 articles (current 2, quota 8)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.

### [x] [MED] PageStub routes flake under parallel e2e load (React #418 hydration) — self-resolved via phase 16
> Filed 2026-05-09. Original prediction was "self-resolves before phase 16 ships" because phase 16's polish scope replaced every PageStub with a real route. Flake persisted briefly after `f3e5bac` shipped (one source of hydration mismatch was the formatter TZ issue, partially patched at `dfa5596`); the SECOND hydration source the TZ patch couldn't reach lived inside the PageStub itself and went away when every dynamic-data route got its own real page.
>
> **Resolved (confirmed 2026-05-11 via /oversight):** not observed in 10+ consecutive parallel verify runs (all noting "433 e2e green parallel — no #418 flake this run"). Serial-fallback (`--workers=1`) is no longer the established mitigation. Closing.

---

(Older findings drained as they ship. Empty until other audit
passes accumulate signals.)
