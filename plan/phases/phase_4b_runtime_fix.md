# Phase 4b — Production runtime hotfix + content cleanup

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body. **This is
> a P0 hotfix prepended via `/oversight` after phase 4 shipped.
> Every dynamic route is 500 on production. Phase 5 cannot ship on
> top of a broken article route.**

## Background — why this phase exists

Phase 4 shipped the URL contract end-to-end. `pnpm verify` was
green, `pnpm deploy:check` reported ready, and the local e2e
walker hit 200 on every canonical URL.

In production at `https://thock.netlify.app`, the following return
HTTP 500 immediately after the phase 4 deploy:

- `/article/<any-seed-slug>`
- `/tag/<any-seed-slug>`
- `/sitemap.xml`
- `/feed.xml`
- `/feed/<pillar>.xml`

The static-prerendered routes (`/`, `/news`, `/trends`,
`/trends/tracker`, `/ideas`, `/deep-dives`, `/guides`,
`/group-buys`, `/about`, `/newsletter`, `/search`, `/sources`) all
return 200 — they serialize at build time and the lambda never
re-evaluates the loaders.

## Suspected root cause (verify before committing)

`packages/data/src/loaders/paths.ts` uses:

```ts
import { fileURLToPath } from 'node:url'
const here = dirname(fileURLToPath(import.meta.url))

function findRepoRoot() {
  // walks up from `here` looking for `pnpm-workspace.yaml`
}
```

In Netlify's bundled lambda, the function's filesystem layout
differs from the source workspace; the walk-up either:

1. Fails to find `pnpm-workspace.yaml` and throws, OR
2. Finds the wrong directory and the subsequent
   `readdirSync(<entityDir>)` throws because `data/` isn't there,
   OR
3. The bundled lambda doesn't include `/data/*.json` or
   `apps/web/src/content/**` files at all.

`@thock/content`'s loaders depend on `@thock/data`'s `paths.ts` —
so anything content-aware breaks too.

The static pillar/landing pages survived because Next prerendered
them at build time, before bundling.

## Scope

Three deliverables, in this order:

### 1. Make the loaders find their data in any runtime

Replace the `import.meta.url`-based root walk with a strategy that
works in dev, `next start`, and Netlify's bundled lambda. **Pick
the simplest approach that ships:**

**Approach A (recommended)** — pre-generate manifests at build time:

- Add a `prebuild` step (e.g. `apps/web/scripts/build-manifests.ts`)
  that imports the data + content loaders via tsx and writes
  `apps/web/.thock-data/{switches,keycap-sets,boards,vendors,group-buys,trends,articles,tags}.json`.
- The web app's loaders are re-pointed at these manifest files
  via `process.env.THOCK_DATA_DIR` or a baked-in
  `path.join(process.cwd(), '.thock-data')`.
- Manifests live alongside the build output; they get bundled into
  the lambda automatically.
- Add `apps/web/.thock-data/` to `.gitignore` (build artifact, not
  checked in).

**Approach B** — use `process.cwd()` as the root in the loaders:

- Replace `findRepoRoot()` with a function that, in production,
  trusts `process.cwd()` (Netlify sets this to the lambda's working
  dir, which contains the repo when bundled).
- Verify Netlify's `included_files` setting in `netlify.toml` keeps
  `data/**` and `apps/web/src/content/**` accessible to the lambda
  at runtime. If not, either add them to `included_files` or fall
  back to Approach A.

**Approach C** — Webpack-bake the data into the bundle via dynamic
imports / `JSON.parse(require(...))` at build time. Less idiomatic
in App Router; only if A/B both fail.

Pick A unless investigation reveals it's blocked. Document the
choice in the commit body Decisions.

### 2. Add a post-deploy smoke that catches this class of bug

`pnpm deploy:smoke` — runs after `pnpm deploy:check`, hits one
URL per pattern against the **live** site (not local), and exits
non-zero if any return non-2xx. Patterns to check:

- `/` (sanity)
- `/news` (one pillar landing)
- `/article/<a-known-seed-slug>` (the dynamic route that broke)
- `/tag/<a-known-tag-slug>`
- `/sitemap.xml`
- `/feed.xml`
- `/feed/news.xml`
- `/robots.txt`

Implementation: `scripts/deploy-smoke.mjs` using Node 20+ built-in
`fetch`. Reads `siteConfig.url` from `@thock/seo` (or hardcodes
`https://thock.netlify.app` — fine for a smoke). Concurrency: walk
all URLs in parallel; print pass/fail per URL.

Wire it up in two places:

1. `package.json` adds `"deploy:smoke": "node scripts/deploy-smoke.mjs"`.
2. The `verify` chain stays the same (still local). The smoke is a
   **post-push** gate in shipping skills, run after
   `pnpm deploy:check` returns ready. Update `agents.md` /
   `bearings.md` "Verify gate" to document the new step.

The smoke is **not** part of `pnpm verify` because it's
post-push. It can be invoked manually or by the loop after every
ship.

### 3. Nip the fabricated author names

User directive (oversight 2026-05-08): "if it's made up: nip
them." Audit confirms all author names in seed articles are
invented:

- `Mara Lin` (4 articles)
- `Reza Patel` (2 articles)
- `Tess Aoyama` (1 article)

**Action:** replace every `author:` frontmatter line with
`author: thock` across all 6 seed articles:

- `apps/web/src/content/articles/alice-layout-decline.mdx`
- `apps/web/src/content/articles/beginners-switch-buying-guide.mdx`
- `apps/web/src/content/articles/building-mode-sonnet-with-oil-kings.mdx`
- `apps/web/src/content/articles/gateron-oil-king-deep-dive.mdx`
- `apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx`
- `apps/web/src/content/articles/trends-tracker-preview.mdx`

The frontmatter schema (`author: z.string().min(2)`) accepts
`thock`. The byline renders as "thock" (lowercase per site
convention).

If this looks weird in some places (e.g. "By thock"), keep it —
it's an honest editorial byline until real authors land. The
schema change to make `author` nullable is **out of scope here**;
phase 16 (or a later content audit) can revisit.

## Tests

- **Unit:** if Approach A — test the manifest builder's output
  shape (every entity type emits a JSON file, every record
  validates against its schema). Test the loaders read manifests
  correctly.
- **Unit:** if Approach B — test the loader with `process.cwd()`
  set to a fixture dir.
- **E2E:** the existing smoke walker continues to pass locally.
- **New:** `scripts/deploy-smoke.mjs` is **not** unit-tested (it's
  a one-shot operational script). It's verified by running it
  against the live deploy after the hotfix push.

## Verify gate

```
pnpm verify     # local — typecheck, unit, data:validate, build, e2e
git push        # triggers Netlify
pnpm deploy:check
pnpm deploy:smoke   # NEW — must exit 0
```

If `deploy:smoke` returns non-zero, this phase has not shipped.
Iterate the fix until both `deploy:check` AND `deploy:smoke` pass.

## Commit body template

```
fix(runtime): production hotfix for dynamic routes — phase 4b

- packages/data + @thock/content loaders no longer rely on
  import.meta.url. <Approach chosen + one-line rationale>.
- /article/[slug], /tag/[slug], sitemap, feeds all return 200 on
  the live deploy.
- New scripts/deploy-smoke.mjs hits one URL per pattern against
  https://thock.netlify.app post-push; exits non-zero on any
  non-2xx. pnpm deploy:smoke wired up.
- Replaced fabricated author bylines (Mara Lin / Reza Patel /
  Tess Aoyama) with `thock` across all 6 seed articles per
  oversight 2026-05-08 directive.

Decisions:
- <chose Approach A/B/C — why>
- deploy:smoke kept out of `pnpm verify` (it's post-push).
  Future shipping skills must run it after deploy:check.
- author byline = `thock` (no schema change to nullable yet).
```

## DoD

- All 6 production dynamic routes return 200 against
  `https://thock.netlify.app`.
- `pnpm deploy:smoke` passes.
- `git grep -E "Mara Lin|Reza Patel|Tess Aoyama"` returns nothing
  in `apps/web/src/content/`.
- Phase 4b row flipped to `[x]` in `01_build_plan.md` with commit
  hash. Append to phase log.

## Follow-ups (out of scope this phase)

- Make `pnpm deploy:smoke` part of the standing shipping-skill
  contract (update `bearings.md` "Verify gate" + `ship-a-phase`,
  `ship-data`, `iterate` skills to invoke it after
  `deploy:check`). Can roll into a `ops:` commit alongside this
  fix if straightforward.
- `author` frontmatter schema → nullable + render fallback. Phase
  16 polish.
- A real author taxonomy (with bios, archive pages). Out of v1
  scope per spec.
- Authoring real human bylines requires real humans. The user can
  swap the `thock` byline for a real name any time.
