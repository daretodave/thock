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
