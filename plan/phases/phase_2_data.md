# Phase 2 — `@thock/data` package

> Substrate phase. No new pages. Replaces the phase-1 stub with the
> real package: Zod schemas (source of truth), generated JSON
> Schema files, typed loaders, and the validate CLI that
> `pnpm verify` runs as a hard gate. One seed record per entity
> type so loaders return real data. Ship without asking; document
> every judgment call in the commit body.

## Scope

`packages/data/` becomes the GitHub-as-DB SDK for thock. After this
phase:

- Six Zod schemas (`switch`, `keycap-set`, `board`, `vendor`,
  `group-buy`, `trend`) live in `packages/data/src/schemas/`.
- Generated JSON Schema files land in `data/schemas/<entity>.schema.json`.
- Six loaders are exported from `@thock/data` with colocated unit
  tests covering happy path + missing slug + cross-ref resolution.
- A `validate` CLI walks `/data/` and validates every record +
  cross-reference, with informative errors. `pnpm verify` calls it
  as a hard gate.
- One seed record per entity exists so loaders have something to
  return for tests and so phase 3 can render real data.

`data/README.md` already exists from the scaffold and stays as is.
`data/BACKLOG.md` and `data/AUDIT.md` already exist with empty
templates and stay.

## Outputs

```
packages/data/
├── package.json                                # @thock/data (replaces phase-1 stub)
├── tsconfig.json
├── vitest.config.ts
├── tsup.config.ts                              # generates JSON Schema + dts during validate
├── src/
│   ├── index.ts                                # public surface — re-exports schemas + loaders
│   ├── schemas/
│   │   ├── shared.ts                           # SlugSchema, IsoDateSchema, UrlSchema, helpers
│   │   ├── switch.ts                           # SwitchSchema
│   │   ├── keycap-set.ts                       # KeycapSetSchema
│   │   ├── board.ts                            # BoardSchema
│   │   ├── vendor.ts                           # VendorSchema
│   │   ├── group-buy.ts                        # GroupBuySchema
│   │   ├── trend.ts                            # TrendSnapshotSchema (one weekly file)
│   │   └── index.ts                            # re-exports schemas + inferred types
│   ├── loaders/
│   │   ├── paths.ts                            # resolveDataDir, listSlugs, readJson helpers
│   │   ├── switches.ts                         # getAllSwitches, getSwitchBySlug
│   │   ├── keycap-sets.ts                      # getAllKeycapSets, getKeycapSetBySlug
│   │   ├── boards.ts                           # getAllBoards, getBoardBySlug
│   │   ├── vendors.ts                          # getAllVendors, getVendorBySlug
│   │   ├── group-buys.ts                       # getActiveGroupBuys, getGroupBuyBySlug
│   │   ├── trends.ts                           # getTrendSnapshot, getLatestTrendSnapshot
│   │   ├── memo.ts                             # tiny memoize wrapper around fs reads
│   │   └── index.ts
│   ├── validate/
│   │   ├── cli.ts                              # entry — `node dist/validate/cli.js`
│   │   ├── index.ts                            # programmatic API used by tests
│   │   ├── walk.ts                             # walks /data/<entity>/*.json
│   │   ├── crossrefs.ts                        # resolves slug → record across entities
│   │   └── report.ts                           # pretty-prints failures
│   └── __tests__/
│       ├── schemas/
│       │   ├── switch.test.ts
│       │   ├── vendor.test.ts
│       │   ├── group-buy.test.ts
│       │   └── trend.test.ts
│       ├── loaders/
│       │   ├── switches.test.ts
│       │   ├── vendors.test.ts
│       │   └── group-buys.test.ts
│       └── validate/
│           └── crossrefs.test.ts
└── scripts/
    └── generate-json-schema.ts                 # zod-to-json-schema → data/schemas/

data/
├── schemas/                                    # generated — listed in .gitattributes as generated
│   ├── switch.schema.json
│   ├── keycap-set.schema.json
│   ├── board.schema.json
│   ├── vendor.schema.json
│   ├── group-buy.schema.json
│   └── trend.schema.json
├── switches/gateron-oil-king.json              # seed
├── keycap-sets/gmk-olivia.json                 # seed
├── boards/mode-sonnet.json                     # seed
├── vendors/cannonkeys.json                     # seed
├── group-buys/cannonkeys-mode-sonnet-r2.json   # seed (active)
└── trends/2026-W19.json                        # seed (current ISO week per project clock)
```

The phase-1 `packages/data/package.json` stub is replaced wholesale.

## Stack pins

- `zod@^3.23` — schema source of truth.
- `zod-to-json-schema@^3.23` — generate `data/schemas/*.schema.json`.
- `tsx@^4.19` — run TS scripts (`generate-json-schema.ts`, `cli.ts`)
  without a separate build step.
- `vitest@^2`, `@thock/tsconfig`, `typescript@^5.6` — already
  installed across the monorepo.

No build artifact is published — the package exports `./src/...`
via the `exports` map and consumers (the validate CLI, the web
app, tests) read TS directly. The validate CLI runs through `tsx`.

## Schemas (source of truth)

Each schema includes `slug`, `name`, and an `updatedAt` ISO date.
The shared helpers (`packages/data/src/schemas/shared.ts`) define:

- `SlugSchema` — `/^[a-z0-9]+(-[a-z0-9]+)*$/`, min length 2.
- `IsoDateSchema` — `z.string().datetime({ offset: true })` (or a
  date-only `YYYY-MM-DD` `z.string().regex(...)` variant for
  release dates without time).
- `UrlSchema` — `z.string().url()`.
- `IsoWeekSchema` — `/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/`.

### Switch

```ts
{
  slug: SlugSchema,
  name: string,
  vendorSlug: SlugSchema,                  // cross-ref → vendors/<slug>.json
  type: 'linear' | 'tactile' | 'clicky' | 'silent-linear' | 'silent-tactile',
  housingTop: 'pc' | 'pom' | 'nylon' | 'pa66' | 'lcp' | 'mixed' | 'unknown',
  housingBottom: 'pc' | 'pom' | 'nylon' | 'pa66' | 'lcp' | 'mixed' | 'unknown',
  stem: 'pom' | 'pc' | 'lcp' | 'mixed' | 'unknown',
  springGrams: { actuation: number, bottomOut: number },
  travelMm: number,                        // total travel
  factoryLubed: boolean,
  releasedAt: 'YYYY-MM-DD' | null,
  status: 'in-production' | 'discontinued' | 'limited',
  description: string,                     // 1–3 sentences, editorial voice
  updatedAt: IsoDate,
}
```

### Keycap set

```ts
{
  slug, name,
  vendorSlug: SlugSchema,
  profile: 'cherry' | 'oem' | 'mt3' | 'sa' | 'kat' | 'kam' | 'xda' | 'dsa',
  material: 'abs' | 'pbt' | 'resin' | 'mixed',
  legendType: 'doubleshot' | 'dye-sub' | 'pad-printed' | 'engraved' | 'blank',
  designer: string | null,
  releasedAt: 'YYYY-MM-DD' | null,
  status: 'in-stock' | 'sold-out' | 'group-buy' | 'discontinued',
  imageUrl: UrlSchema | null,
  description: string,
  updatedAt: IsoDate,
}
```

### Board

```ts
{
  slug, name,
  vendorSlug: SlugSchema,
  layout: 'tkl' | '60' | '65' | '75' | 'full' | 'alice' | 'split' | 'ortho' | 'other',
  caseMaterial: 'aluminum' | 'polycarbonate' | 'wood' | 'fr4' | 'plastic' | 'mixed',
  mountStyle: 'gasket' | 'top-mount' | 'tray-mount' | 'integrated-plate' | 'leaf-spring' | 'pcb-mount',
  hotswap: boolean,
  wireless: boolean,
  releasedAt: 'YYYY-MM-DD' | null,
  status: 'in-stock' | 'group-buy' | 'discontinued',
  imageUrl: UrlSchema | null,
  description: string,
  updatedAt: IsoDate,
}
```

### Vendor

```ts
{
  slug, name,
  url: UrlSchema,
  countryCode: /^[A-Z]{2}$/,               // ISO 3166-1 alpha-2
  description: string,
  status: 'active' | 'inactive',
  updatedAt: IsoDate,
}
```

### Group buy

```ts
{
  slug, name,
  vendorSlug: SlugSchema,                  // cross-ref
  productSlug: SlugSchema | null,          // cross-ref into board / keycap-set / switch
  productKind: 'board' | 'keycap-set' | 'switch' | 'other',
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD',
  region: 'global' | 'us' | 'eu' | 'asia' | 'oceania' | 'mena',
  url: UrlSchema,                          // affiliate-marked at render time, not in data
  imageUrl: UrlSchema | null,
  status: 'announced' | 'live' | 'closed' | 'shipped',
  description: string,
  updatedAt: IsoDate,
}
```

### Trend snapshot

One file per ISO week.

```ts
{
  isoWeek: IsoWeekSchema,                  // '2026-W19'; matches filename
  publishedAt: IsoDate,
  rows: Array<{
    name: string,
    category: 'switch' | 'keycap' | 'layout' | 'vendor' | 'brand',
    direction: 'up' | 'down' | 'flat',
    score: number,                         // -100..100 weekly score
    spark: number[],                       // last 8 weekly scores; oldest → newest
    articleSlug: string | null,            // optional link to deep-dive article
  }>,
  updatedAt: IsoDate,
}
```

`articleSlug` is **not** validated against `@thock/content` — that
loader doesn't exist yet (phase 3). The cross-ref check for trends
is deferred; the brief notes the follow-up.

## Loader API surface

```ts
// from @thock/data
export {
  // schemas + types
  SwitchSchema, KeycapSetSchema, BoardSchema, VendorSchema,
  GroupBuySchema, TrendSnapshotSchema,
  type Switch, type KeycapSet, type Board, type Vendor,
  type GroupBuy, type TrendSnapshot,

  // loaders
  getAllSwitches, getSwitchBySlug,
  getAllKeycapSets, getKeycapSetBySlug,
  getAllBoards, getBoardBySlug,
  getAllVendors, getVendorBySlug,
  getAllGroupBuys, getActiveGroupBuys, getGroupBuyBySlug,
  getTrendSnapshot, getLatestTrendSnapshot,

  // validation (programmatic)
  validateAll, type ValidationResult,
}
```

Behavior:

- `getAll*` returns an array sorted by slug ascending (deterministic).
- `getXxxBySlug(slug)` returns `T | null` — never throws on missing.
- `getActiveGroupBuys()` filters out records whose `endDate` is
  past today (UTC) **or** whose `status` is `'closed' | 'shipped'`.
  Sorts ascending by `endDate`.
- `getLatestTrendSnapshot()` returns the snapshot with the
  highest `isoWeek`. Returns `null` if no snapshots exist.
- All loaders read from `<repoRoot>/data/<entity>/*.json` resolved
  via `findRepoRoot()` (walk up from `import.meta.url` until a
  `pnpm-workspace.yaml` is found). Memoized per-process; vitest
  resets the cache between tests via a `__resetForTests()` export.

## Validate CLI behavior

`pnpm --filter @thock/data validate` runs `tsx src/validate/cli.ts`.
Steps:

1. Walk `/data/<entity>/**/*.json` (skip `archive/`).
2. Parse each JSON; validate against the matching Zod schema.
3. Resolve cross-refs:
   - `switch.vendorSlug` → must be a `vendor` slug.
   - `keycap-set.vendorSlug` → vendor.
   - `board.vendorSlug` → vendor.
   - `group-buy.vendorSlug` → vendor.
   - `group-buy.productSlug` → `productKind` resolves to
     `boards/`, `keycap-sets/`, or `switches/`. (When `productKind:
     'other'`, `productSlug` must be `null`.)
4. Confirm filename matches `slug` field (`switches/foo.json` →
   record.slug === 'foo'). For trends: filename matches `isoWeek`
   (`trends/2026-W19.json` → record.isoWeek === '2026-W19').
5. Print a structured report. Exit 0 on success; exit 1 on any
   failure. Each failure cites the file path, the Zod error path,
   and a one-line hint.

The CLI is also reachable as a function: `validateAll(): Promise<ValidationResult>`
returns `{ ok: boolean, errors: ValidationError[] }`. Tests use this
form so we don't shell out from inside vitest.

## JSON Schema generation

`scripts/generate-json-schema.ts` runs `zod-to-json-schema` over
each Zod schema and writes `data/schemas/<entity>.schema.json`.
The validate CLI runs this generator first (so the JSON schemas
never drift from the Zod source). Generation is deterministic
(stable JSON.stringify with sorted keys); the file is committed
so editors with JSON-schema-aware tooling get autocompletion.

The script also writes a top-level `data/schemas/README.md` line
"generated — do not hand-edit; run `pnpm --filter @thock/data
validate`" so it's obvious. (Already implied by the data/README.md;
the schemas/README.md just nails it down.)

## Seed records (one per entity)

Picked to cover the cross-reference graph:

- `vendors/cannonkeys.json` (status: active, US).
- `switches/gateron-oil-king.json` (vendorSlug: cannonkeys; linear,
  PC top / PC bottom, 50g actuation, 60g bottom-out).
- `keycap-sets/gmk-olivia.json` (vendorSlug: cannonkeys, cherry
  profile, ABS doubleshot — designer: ALPHS, status: discontinued
  to keep the data honest).
- `boards/mode-sonnet.json` (vendorSlug: cannonkeys, 65 layout,
  aluminum gasket-mount, hotswap true, wireless false).
- `group-buys/cannonkeys-mode-sonnet-r2.json` (vendorSlug:
  cannonkeys, productSlug: mode-sonnet, productKind: board, dates
  set so it counts as **active** on a typical loop tick).
- `trends/2026-W19.json` (one row per category to exercise the
  schema; numbers are illustrative, marked as such in description
  text — but the brief is editorial-voice, not "lorem ipsum").

Vendor descriptions, switch descriptions, etc., are short, dry,
factual sentences. No marketing copy.

## Tests

`packages/data/src/__tests__/`:

### Schema tests
- `switch.test.ts` — happy parse; rejects bad slug; rejects
  unknown `housingTop`.
- `vendor.test.ts` — happy parse; rejects non-ISO country code;
  rejects bad URL.
- `group-buy.test.ts` — happy parse; rejects `endDate < startDate`
  (refinement); rejects `productKind: 'other'` with non-null
  `productSlug`.
- `trend.test.ts` — happy parse; rejects bad `isoWeek`; rejects
  empty `rows`.

### Loader tests
- `switches.test.ts` — `getAllSwitches` returns the seed sorted
  by slug; `getSwitchBySlug('gateron-oil-king')` resolves;
  `getSwitchBySlug('missing')` returns null.
- `vendors.test.ts` — same shape as switches.
- `group-buys.test.ts` — `getActiveGroupBuys()` returns the seed
  when its end date is in the future; verifies a synthetic
  past-end record is filtered out via the `__withFakeRecords`
  test hook.

### Validate tests
- `crossrefs.test.ts` — given an in-memory record set, missing
  vendor slug fails with a citation; mismatched `productKind`
  fails with a citation; `productKind: 'other'` with non-null
  `productSlug` fails. Uses `validateAll({ records })` overload
  to bypass disk reads.

### No e2e change
This phase ships no new pages, so `apps/e2e/tests/` is untouched.
The existing smoke specs continue to assert phase-1 behavior.

## Verify gate

```bash
pnpm typecheck       # passes — packages/data has its own tsconfig
pnpm test:run        # passes — adds the new tests above
pnpm data:validate   # passes — replaces the phase-1 stub with the real CLI
pnpm build           # unchanged from phase 1 (apps/web doesn't read @thock/data yet)
pnpm e2e             # unchanged from phase 1
```

`pnpm data:validate` regenerates `data/schemas/*.schema.json` first,
then validates. If generation produces a diff against the
committed schemas, the CLI fails with "schemas drifted — re-run
generation and commit". The first ship commits the generated
schemas alongside the code.

## Decisions made upfront — DO NOT ASK

1. **Zod over @effect/schema, valibot, etc.** — bearings.md locks
   Zod as the schema lib.
2. **JSON Schema generation runs at validate time, not build time.**
   Generated files commit-tracked. Faster local feedback than a
   pre-commit hook; cheaper than wiring a dedicated CI step.
3. **No published artifact.** `@thock/data` is workspace-internal;
   consumers read the `./src/` exports map directly through Next.js
   `transpilePackages`. Adding to that list is the one apps/web
   change.
4. **Filename = slug rule.** Validator enforces. Slugs are forever
   (per data/README.md ground rule); renames require an explicit
   archive flow that lands in a later data-ops phase.
5. **One snapshot per ISO week.** Trends are not append-style logs.
   `getLatestTrendSnapshot()` is the home-page entry point.
6. **`getActiveGroupBuys()` filters by both endDate and status.**
   `closed`/`shipped` records stay in `group-buys/` until they're
   archived; the loader hides them. Archival is a follow-up.
7. **Cross-refs validated for vendors and group-buy products only
   this phase.** Article cross-refs (`trend.articleSlug`,
   `<PartReference id>` in MDX) wait for `@thock/content` in
   phase 3.
8. **No `imageUrl` validation beyond `z.string().url()`.** Image
   processing (next/image, sizing, CDN proxying) is phase 16
   polish; data only stores the canonical URL.
9. **Memoize loader reads in-process; reset hook for tests.** No
   filesystem watch — Next.js dev mode handles re-reads via its
   own module graph.
10. **No `data/README.md` rewrite.** The existing scaffold copy
    is correct. This phase appends one paragraph noting the schema
    files are generated; nothing else changes there.

## Mobile reflow

N/A — substrate phase, no new UI.

## Pages × tests matrix

| Surface                          | Unit tests | E2E |
|----------------------------------|------------|-----|
| schemas/switch.ts                | ✓          | —   |
| schemas/vendor.ts                | ✓          | —   |
| schemas/group-buy.ts             | ✓          | —   |
| schemas/trend.ts                 | ✓          | —   |
| loaders/switches.ts              | ✓          | —   |
| loaders/vendors.ts               | ✓          | —   |
| loaders/group-buys.ts            | ✓          | —   |
| validate/crossrefs.ts            | ✓          | —   |
| schemas/keycap-set.ts            | covered by validate happy-path | — |
| schemas/board.ts                 | covered by validate happy-path | — |
| loaders/keycap-sets,boards       | covered by happy-path of getAll | — |

The schemas covered "by happy-path" are still hit by every CLI run
since they validate seed records. Direct unit tests focus on the
schemas with non-trivial refinements (group-buy date order,
trend isoWeek, switch enums).

## Commit body template

```
feat: @thock/data schemas + loaders + validate — phase 2

- packages/data/ replaces the phase-1 stub. Six Zod schemas
  (switch, keycap-set, board, vendor, group-buy, trend) under
  packages/data/src/schemas/; inferred TS types exported from
  @thock/data alongside the loaders.
- Generated JSON Schema files at data/schemas/<entity>.schema.json.
  scripts/generate-json-schema.ts runs at validate time so the
  files never drift from Zod.
- Loaders: getAll<Entity>, get<Entity>BySlug, plus
  getActiveGroupBuys (filters past + closed) and
  getLatestTrendSnapshot. Memoized per-process with a
  __resetForTests hook.
- validate CLI walks /data/, validates schemas + cross-refs
  (vendor slugs, group-buy products), checks filename === slug,
  and prints a structured report. Exits 0/1.
- pnpm data:validate now hits the real CLI via tsx; pnpm verify
  picks it up unchanged from phase 1.
- One seed record per entity: cannonkeys (vendor), gateron-oil-king
  (switch), gmk-olivia (keycap-set), mode-sonnet (board),
  cannonkeys-mode-sonnet-r2 (active group buy), 2026-W19 (trends).
- N unit tests across schemas, loaders, and validate paths.

Decisions:
- JSON Schema regen at validate time, not build time.
- Cross-refs limited to vendors + group-buy products this phase;
  article cross-refs wait for @thock/content (phase 3).
- @thock/data stays workspace-internal — no published artifact.
- Filename === slug enforced by validator (slugs are forever).
- getActiveGroupBuys filters by both endDate and status so
  closed/shipped records stay in /data/ until archival lands.
```

## DoD — tick in `plan/steps/01_build_plan.md`

Flip Phase 2 `[ ]` → `[x]` with commit hash; append to phase log.
Commit:

```
plan: phase 2 shipped — @thock/data
```

## Follow-ups (out of scope this phase)

- `<PartReference id>` cross-ref validation against article MDX
  (needs `@thock/content` from phase 3).
- `trend.articleSlug` resolution against article slugs (same).
- `data:archive` CLI to move closed/shipped group buys into
  `group-buys/archive/`. Manual move + commit covers it for now.
- Image-pipeline integration for `imageUrl` fields (phase 16).
- `data-steward` flow for schema migrations (skill exists; no
  migration needed at phase 2).
