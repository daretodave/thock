# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

> **POSTURE: brand-assets first** (set via `/oversight`
> 2026-05-09T12:30Z). `/march` should not pick up phase 15+
> until the brand-asset backlog drains via `/ship-asset`. The
> autonomous loop has no `/ship-asset` lane — the user runs
> `/ship-asset` directly until the backlog clears, then resumes
> `/march`. Order: (1) favicon, (2) default OG template,
> (3) per-pillar OG variants, (4) hero placeholders for the seed
> articles. `/iterate` may still drain non-asset findings (e.g.
> the open user-jot on /group-buys) without violating this
> posture.

> **Iterate-bias category: brand-assets-first**. The next
> `/iterate` tick that runs while the posture is in effect
> should drain the user-jot on /group-buys (a one-record data
> fix) but otherwise defer to /ship-asset.

> **Article hero art directive (locked 2026-05-09):** every
> article (current and future) renders a colorful keyboard SVG
> as its hero placeholder until real photography backfills.
> Style: simple, single splash of color, line-drawing weight
> consistent across articles, illustrative of the article's
> subject (e.g. a switch cross-section for switch-deep-dives, a
> keycap profile silhouette for keycap pieces, a keyboard
> outline for build pieces). The `content-curator` and
> `/ship-asset` agents are the producers. Hero SVGs land under
> `apps/web/public/hero-art/<slug>.svg` and the article
> frontmatter `heroImage` field references the path.

## Drained findings (kept for audit-trail; do not re-open)

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
