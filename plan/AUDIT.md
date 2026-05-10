# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

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

### [MED] Accessibility audit pass — phase 16 follow-up
> Filed 2026-05-09 by phase 16 brief. Phase 16's polish scope listed an a11y pass: contrast against the OKLCH tokens, focus rings on every interactive, alt text on every `<img>`, heading order, keyboard nav. Deferred from the page-shipping tick because the audit itself wants its own structured pass with a checklist + per-finding fixes.
>
> **Action:** new audit pass that walks every canonical URL, runs axe-core (or a hand checklist) at desktop + mobile, files individual `[a11y]` rows here for each violation. Drain on subsequent /iterate ticks.
>
> Score: **5.5** (aggregate of many small issues; each fix is cheap but the discovery is the work).

### [LOW] /sources per-citation index — phase 16 follow-up
> Filed 2026-05-09 by phase 16 brief. The /sources page currently surfaces the per-article aggregate count of `<Source>` tags. The full per-citation index (article → quote → URL) requires an MDX walker that parses every body, extracts each `<Source href= text= />` tuple, dedupes by href, and surfaces (article, quote, source) rows. Worth shipping but not phase-16 scope.
>
> **Action:** new helper `extractSourceCitations(body: string): Array<{ href, text, position }>` in `@thock/content/util/`; new section on `/sources` rendering the deduped citation list. Probably wants its own ship-data flow if the citation count grows large.
>
> Score: **3.5** (real but cosmetic with the current article count of 6).

### [MED] Lighthouse CI — phase 17 follow-up
> Filed 2026-05-09 by phase 17 brief. The build-plan row for phase 17 listed a Lighthouse pass at ≥95 on `/` and `/article/[slug]`. Real lighthouse-ci wiring crosses a tooling boundary (paid runner, or local Chrome + a runner) that warrants `/oversight` rather than an autonomous decision. The bundle-size budget shipped this phase covers the JS-weight axis on its own.
>
> **Action:** `/oversight` picks a runner (Vercel preview comments via lighthouse-ci action, or a self-hosted runner). Once the runner is decided, ship the GitHub Actions workflow + budget config + artifact upload.
>
> Score: **5.0** (real signal but real setup cost; baseline bundle is small enough that scores are likely good already).

### [LOW] Tighten homepage bundle-size budget from 250 KB → 200 KB
> Filed 2026-05-09 by phase 17 brief. The bearings target is 200 KB gzipped for the homepage; phase 17 set the gate at 250 KB to leave one or two iterate ticks of headroom. After the loop drains any obvious chunk waste (lucide-react, large MDX shims, unused tag taxonomies), tighten the budget to 200 KB to match the bearings.
>
> **Action:** edit `apps/web/scripts/measure-bundle.mts` `DEFAULT_MAX_KB` to 200, or pass `--max=200` via the verify wiring in root `package.json`.
>
> Score: **2.5** (cosmetic until the chunk audit runs; chunk audit is the real work).

### [MED] PageStub routes flake under parallel e2e load (React #418 hydration)

> Recorded by `/iterate` on 2026-05-09 while draining the critique
> queue.

The smoke walker's "no console errors" assertion intermittently
fails on `/about`, `/newsletter`, and `/search` with the minified
React error #418 ("text content does not match server-rendered
HTML"). Failures move between the three URLs run-over-run; serial
playback of the same three URLs (`--workers=1`) passes 100% of
the time.

All three routes render `<PageStub>` (phase 4 stub for routes
without their own family yet). Suspect cause is a hydration
mismatch in `PageStub` — likely a server/client-divergent value
(date string, random key, font-loading class on `<html>` racing
with first paint). Could also be a Next 15 quirk with multiple
concurrent route prerenders sharing an inconsistent layout
snapshot.

**Action:** read `apps/web/src/components/page-stub/PageStub.tsx`,
look for any `Date.now()` / `Math.random()` / `useId()`-without-
`'use client'` patterns. If clean, suspect the next/font race —
the `${serif.variable}` etc. classes Next applies to `<html>` may
swap between SSR and CSR. Phase 16 polish replaces every PageStub
with a real route, so this finding self-resolves before then;
mark as a transient `[MED]` until phase 16 ships.

Score: **3.0** (intermittent, no user-facing impact yet, but
muddies the verify gate).

---

(Older findings drained as they ship. Empty until other audit
passes accumulate signals.)
