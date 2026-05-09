# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

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

(Older findings drained as they ship. Empty until other audit
passes accumulate signals.)
