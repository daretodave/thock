# Phase 17 — Performance + meta (final build-plan phase)

> Agent-facing brief. Concise, opinionated, decisive. Ships the verification scaffolding for sitemap completeness, JSON-LD shape, raw `<img>` discipline, and homepage bundle size; defers Lighthouse to a post-phase-17 audit row. After this phase ships, `/march` transitions to `/iterate` mode (per `plan/steps/01_build_plan.md` §"After phase 17").

## Scope (what ships)

Five deliverables from the build-plan row, three drained directly + one already in place + one deferred:

1. **Sitemap completeness gate** — e2e test that fetches `/sitemap.xml`, parses it, and asserts every URL in `apps/e2e/src/fixtures/canonical-urls.ts` (the source of truth used by the smoke walker) appears in the sitemap. Catches future surfaces shipped without a sitemap update.
2. **JSON-LD audit gate** — e2e test that walks every canonical URL, extracts `<script type="application/ld+json">` blocks, parses each, and asserts the expected `@type` is present per route family (Article on /article/[slug]; CollectionPage + ItemList on pillars + tags; Dataset + CollectionPage on /trends/tracker; WebSite + BreadcrumbList on /, /about, /sources, /newsletter; BreadcrumbList on /search and 404s).
3. **Bundle-size budget** — new `pnpm size` script in `apps/web/`. Reads `.next/app-build-manifest.json`, identifies the chunks loaded by `/`, gzips each, sums them. Fails non-zero if the total exceeds 250 KB gzipped (the bearings target is 200 KB but baseline is ~110 KB so 250 leaves headroom for one or two iterate ticks before pushback). Output is human-readable. Wired into `pnpm verify` after `build`.
4. **Image discipline gate** — quick unit-level test that greps `apps/web/src/**/*.{tsx,jsx,mdx}` for raw `<img\b` tags (excluding `__tests__/`) and fails if any survive. Today's audit confirms none exist; this gate keeps it that way.
5. **Lighthouse pass** — *deferred* to a follow-up audit row. Real lighthouse-ci wiring needs either a paid CI host or local Chrome + a runner, both of which warrant a `/oversight` decision. Filed as `[MED] phase-17 follow-up: Lighthouse CI` in `plan/AUDIT.md`.

## Routes

No new routes ship in this phase. Touched surfaces are tests + scripts + the sitemap (only if the audit surfaces a missing URL).

## Deliverables

New files under `apps/web/scripts/`:
- `measure-bundle.mts` — reads `.next/app-build-manifest.json`, finds the chunks for `pages: '/'` (or `app: '/page'`), gzips each via `node:zlib`, sums them. Prints a human-readable line per route + a final total. Exits non-zero if `homepage gzipped > 250 KB` (configurable via `--max=NNN`).

New `pnpm size` script in `apps/web/package.json`:
- `"size": "tsx scripts/measure-bundle.mts"` — depends on `next build` having run already (it reads `.next/`).
- Wired into the root `pnpm verify` flow as a post-`build` step.

New e2e tests under `apps/e2e/tests/`:
- `meta.spec.ts` (combined, since both gates walk the canonical URL set):
  - `sitemap covers every canonical URL` — fetch `/sitemap.xml`, parse, assert every `canonical-urls.ts` entry of `kind: 'html'` appears as a `<loc>`.
  - `every canonical URL emits well-formed JSON-LD with the expected @type for its family` — walk the canonical set, fetch each URL, extract every `<script type="application/ld+json">`, parse each (must succeed), and assert at least one block carries the route family's expected type.

New unit test under `apps/web/`:
- `src/__tests__/no-raw-img.test.ts` — globs `src/**/*.{tsx,jsx,mdx}` excluding `__tests__/`, asserts no file contains a raw `<img\b` (allow `<Image>` from `next/image`).

## Cross-links

- **In (verify):** `apps/e2e/src/fixtures/canonical-urls.ts` is the source-of-truth feed for both new tests.
- **Out (ship):** none — no new routes.
- **Retro-fit:** `pnpm verify` order becomes `typecheck && test:run && data:validate && build && size && e2e`. The `size` step is a hard gate.

## SEO

No metadata changes. The phase verifies existing JSON-LD shape; it doesn't add new tags.

## Decisions made upfront — DO NOT ASK

1. **Bundle-size budget set to 250 KB gzipped, not 200 KB.** The bearings target is 200 KB. Current baseline measured at the previous build is ~123 KB total (102 KB shared + ~21 KB on the heaviest route). 250 KB gives one or two iterate ticks of headroom; the budget can tighten to 200 KB once the audit surfaces real waste. A separate `[LOW]` audit row tracks the eventual 200 KB tighten.
2. **JSON-LD validation is an e2e walk, not a build-time AST scan.** Rendering through the live edge runtime catches metadata-route quirks that an AST analysis would miss; the e2e harness already runs against `next start` so reuse is free.
3. **Sitemap completeness asserts a *superset* relationship** (`canonical-urls ⊆ sitemap`), not equality. The sitemap may include URLs the canonical-urls fixture omits (e.g. extra dynamic article slugs the smoke walker doesn't probe individually). A strict equality check would force the fixture to grow on every article add; the superset check catches the regression we care about (a route ships without a sitemap entry).
4. **`pnpm size` reads `.next/app-build-manifest.json`** rather than running `next build` itself. The script is a measurement tool, not a build driver — `pnpm verify` invokes `build` first; `size` only inspects the artifact.
5. **Lighthouse is deferred to an audit row.** Real lighthouse-ci wiring crosses a tooling-boundary that warrants `/oversight`. Filing as `[MED]` in `plan/AUDIT.md` — drainable when the user picks a runner.
6. **The raw-`<img>` check is a unit test, not an ESLint rule.** ESLint config drift would silently disable the rule; a standalone vitest is hard to bypass and runs in CI by default.

## Pages × tests matrix

| Surface | Gate | Notes |
|---|---|---|
| /sitemap.xml | e2e — sitemap covers canonical-urls | superset |
| every canonical URL | e2e — well-formed JSON-LD with expected @type | per-family @type contract |
| `apps/web/src/**` | unit — no raw `<img>` | ESLint-style discipline gate |
| `/` homepage chunks | `pnpm size` | 250 KB gzipped ceiling |

## Verify gate

`pnpm verify` runs `typecheck && test:run && data:validate && build && size && e2e`. `size` runs after `build` so `.next/` exists. The known PageStub `#418` hydration transient still requires `--retries=2` on local; phase 17 doesn't fix it (the audit row says phase 16 self-resolves it once /about + /sources stop rendering PageStub, which is now true — the next pnpm verify should naturally drain the flake without retries).

## Commit body template

```
feat: performance + meta — phase 17 (final build-plan phase)

- pnpm size script: gzipped homepage bundle gate at 250 KB.
- e2e meta.spec.ts: sitemap completeness + per-family JSON-LD @type contract.
- unit no-raw-img.test.ts: image discipline gate keeps every <img> behind next/image.
- Lighthouse + 200 KB tighten deferred to audit rows.

Decisions:
- size budget set to 250 KB (200 KB target + headroom; tighten in iterate).
- Sitemap check is canonical-urls ⊆ sitemap (superset, not equality).
- /march transitions to /iterate after this phase (build-plan note).
```

## DoD

- [x] `pnpm size` script present + wired into `pnpm verify`.
- [x] `apps/e2e/tests/meta.spec.ts` ships sitemap + JSON-LD gates.
- [x] `apps/web/src/__tests__/no-raw-img.test.ts` ships the image-discipline gate.
- [x] Lighthouse + 200 KB tighten filed as audit rows.
- [x] `pnpm verify` green; deploy READY.
- [x] Build plan ticked: phase 17 → `[x]` with the addressing commit hash.

## Follow-ups (out of scope this phase)

- **Lighthouse CI** — automated lighthouse pass on `/` + `/article/[slug]` per push. Cross-tooling decision (runner choice, perf budget) → `/oversight`.
- **Tighten bundle-size budget to 200 KB** — once /iterate has drained any obvious chunk waste.
- **Per-route bundle budgets** — homepage is the canary; pillar pages, /article/[slug], and /trends/tracker each warrant their own budget once baseline numbers are in.
- **Sitemap last-modified accuracy** — currently every static entry uses `now` at request time. A future tick can wire per-route `updatedAt` from content/data lookups so search engines honor freshness.
