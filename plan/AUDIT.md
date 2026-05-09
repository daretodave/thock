# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

> **Bias: cleared 2026-05-09** (was external-critique, set 2026-05-09).
> All HIGH critique findings drained across 4 ticks: prose styles,
> PartReference resolver binding, title duplication, mobile nav,
> tag-chip category prefix. The remaining MED is a /tag/[slug]
> stub which phase 12 ships. `/march` can resume phase 9 (Ideas
> pillar) on the next tick.

> **Brand-asset backlog (set via /oversight 2026-05-09):** the
> site has no favicon, no per-route OG art, and no hero image
> content for articles or the home pick. Use `/ship-asset` to
> drain — favicon first (smallest blast radius), OG default
> second, then hero placeholders (colorful keyboard SVGs are
> acceptable; real photography can backfill later). Phase 16
> polish was the planned home for OG templates; pull this work
> forward via `/ship-asset` so phase 16 stays scoped to the
> remaining footer / mobile menu / a11y work.

## Open findings

### [HIGH] Verification gap — `pnpm verify` doesn't exercise the production runtime

> Recorded by `/oversight` on 2026-05-08 after phase 4 shipped.

Phase 4's `pnpm verify` was fully green and `pnpm deploy:check`
reported ready, yet every dynamic route on
`https://thock-coral.vercel.app` returned HTTP 500 immediately after
the push:

- `/article/[slug]` (every seed)
- `/tag/[slug]` (every seed)
- `/sitemap.xml`
- `/feed.xml`, `/feed/[pillar].xml`

Static-prerendered routes (home, pillars, group-buys, about,
newsletter, search, sources, robots) returned 200 — Next
serialized them at build time so the lambda never re-evaluated
the data loaders. The dynamic routes failed because the loaders
called `findRepoRoot()` (walks up looking for
`pnpm-workspace.yaml`), and that walk doesn't resolve to the
right path inside Netlify's bundled function.

**Why the loop missed it:**
- The e2e walker runs against local `next start -p 4173`, which
  has the full repo on disk. The bundled production lambda
  doesn't.
- `pnpm deploy:check` confirms the host reports `state=ready`,
  which means the **build** succeeded — not that **routes serve
  2xx**.

**Action:** Phase 4b (production runtime hotfix) ships the loader
fix and adds `pnpm deploy:smoke` — a post-push HTTP probe of one
URL per pattern against the live site. The smoke becomes the new
post-push gate every shipping skill must run after
`deploy:check`. Update `bearings.md` "Verify gate" and the four
shipping skills accordingly when the smoke lands.

Score: **5.0** (production was broken for the user; the gate
chain didn't catch it).

---

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
