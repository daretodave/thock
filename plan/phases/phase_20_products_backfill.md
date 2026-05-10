# Phase 20 — Switches / keycap-sets / boards backfill (scout-driven)

> Agent-facing brief. Concise, opinionated, decisive. The third
> and final phase of the **Real-data backfill** mini-plan promoted
> from PHASE_CANDIDATES (expand pass 1, score 8.0) via /oversight
> on 2026-05-09.
>
> Phase 18 backfilled group buys (5 records → 6 + 2 new vendors).
> Phase 19 backfilled trends (5 rows → 15) + added the `note`
> schema additive. Phase 20 closes the loop: it ships real
> records for the three product entity types so future articles
> can reference them via `<PartReference>` and so the data layer
> stops looking like seed-only stubs.
>
> **No schema changes.** No component changes. No new routes.
> Pure data ship — scout researches, ship-data writes, the
> existing `<PartReference>` / `MentionedPartsRail` /
> `getReferencedParts` machinery picks them up automatically when
> articles cite them.

## Routes (no new routes)

- No new pages. Switches, keycap-sets, and boards do not have
  their own page surfaces in the URL contract — they are
  referenced *inline* in article bodies via the
  `<PartReference>` MDX component (see phase 5).
- Surfaces that read these entities passively:
  - `<PartReference slug="...">` (MDX) — looks up the slug in
    `data/{switches,keycap-sets,boards}/`. Renders inline part
    info.
  - `<MentionedPartsRail>` (article page) — gathers parts
    referenced in the article body.
  - `getReferencedParts(article)` (data-runtime helper) —
    backing data lookup.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getAllSwitches()`, `getSwitchBySlug(slug)` | manifest | already shipped phase 2; auto-picks up new records |
| `getAllKeycapSets()`, `getKeycapSetBySlug(slug)` | manifest | same |
| `getAllBoards()`, `getBoardBySlug(slug)` | manifest | same |
| `getAllVendors()` | manifest | needed only if scout's records reference vendors not in registry |

No new helpers. No edits to existing helpers.

## Components

**Zero new components.** Zero edits to existing components.
The page-family code shipped in phase 5 (`<PartReference>`,
`<MentionedPartsRail>`) reads these records on demand — no
changes needed when the row count grows.

## Scout brief (sub-agent prompt)

When this phase runs (`/ship-a-phase` will invoke), spawn the
`scout` sub-agent with this brief:

> Research **popular / canonical mechanical-keyboard products**
> across three entity types and return JSON candidates ready
> for `data/switches/`, `data/keycap-sets/`, and `data/boards/`
> records on the thock site (build plan phase 20 ships these).
>
> Today's date is **2026-05-09**.
>
> ## Targets
>
> - **6–8 switches** — mix of types (linear, tactile, clicky,
>   silent variants); cover both budget enthusiast workhorses
>   and current premium standouts. Existing seed:
>   `gateron-oil-king` (don't duplicate).
> - **4–5 keycap sets** — mix of profiles (cherry, MT3, KAT,
>   SA) and materials (ABS doubleshot, PBT dye-sub). Mix of
>   in-stock GMK runs, recent group-buy sets, and at least one
>   "discontinued grail" set. Existing seed: `gmk-olivia`
>   (don't duplicate).
> - **3–4 boards** — mix of layouts (60, 65, 75, TKL, alice or
>   split). Mix of `in-stock` (current premium customs),
>   `group-buy` (active or recently-closed runs), and
>   `discontinued` (a notable historical board). Existing
>   seed: `mode-sonnet` (don't duplicate).
>
> Quality > quantity. If you can deliver only 5 switches /
> 3 keycap sets / 2 boards with high confidence, ship that;
> the next iterate tick can grow the catalog.
>
> Bias toward records that connect to phase-19 trends rows or
> phase-18 group-buy records — that's where the data will earn
> its keep:
> - **Switches**: HMX Cloud (phase 19 row), Cherry MX Black
>   (current MX2A line), Holy Pandas (community standard
>   tactile), Akko V3 Cream Blue Pro (clicky + popular),
>   Gateron Pro 3.0 Yellow (workhorse linear), Tecsee Sapphire
>   V2 (premium linear), Aflion Endorphin (silent linear).
> - **Keycap sets**: GMK CYL Olivetti (DCS Olivetti referenced
>   in phase-19 trends; verify the GMK CYL set vs the DCS run),
>   GMK Bento (community classic), Drop + MiTo MT3 Dasher
>   (popular MT3 set), MW Endpoint (recent run), KAT Drifter
>   (popular KAT).
> - **Boards**: Bakeneko65 (CannonKeys evergreen), Class65
>   (CannonKeys), QK75 (recent 75% favorite, ties to phase-19
>   `75% layout` trend), Mammoth75 (Wuque, ties to phase-19
>   `Wuque Studio` row), Class80 / TKL.
>
> ## Schemas (authoritative)
>
> ### Switch (`packages/data/src/schemas/switch.ts`)
>
> ```json
> {
>   "slug": "<vendor-or-mfr>-<short>",
>   "name": "<as the vendor / manufacturer lists it>",
>   "vendorSlug": "<slug from data/vendors/ — see below>",
>   "type": "linear" | "tactile" | "clicky" | "silent-linear" | "silent-tactile",
>   "housingTop": "pc" | "pom" | "nylon" | "pa66" | "lcp" | "mixed" | "unknown",
>   "housingBottom": "pc" | "pom" | "nylon" | "pa66" | "lcp" | "mixed" | "unknown",
>   "stem": "pom" | "pc" | "lcp" | "mixed" | "unknown",
>   "springGrams": { "actuation": <number 0-200>, "bottomOut": <number 0-200> },
>   "travelMm": <number 0-10>,
>   "factoryLubed": <boolean>,
>   "releasedAt": "<YYYY-MM-DD or null>",
>   "status": "in-production" | "discontinued" | "limited",
>   "description": "<one to two sentences, 20-800 chars, knowledgeable-peer voice>",
>   "updatedAt": "<ISO 8601 datetime with offset>"
> }
> ```
>
> ### Keycap-set (`packages/data/src/schemas/keycap-set.ts`)
>
> ```json
> {
>   "slug": "<short-slug>",
>   "name": "<as listed>",
>   "vendorSlug": "<slug from data/vendors/>",
>   "profile": "cherry" | "oem" | "mt3" | "sa" | "kat" | "kam" | "xda" | "dsa",
>   "material": "abs" | "pbt" | "resin" | "mixed",
>   "legendType": "doubleshot" | "dye-sub" | "pad-printed" | "engraved" | "blank",
>   "designer": "<designer name or null>",
>   "releasedAt": "<YYYY-MM-DD or null>",
>   "status": "in-stock" | "sold-out" | "group-buy" | "discontinued",
>   "imageUrl": null,
>   "description": "<20-800 chars>",
>   "updatedAt": "<ISO datetime>"
> }
> ```
>
> ### Board (`packages/data/src/schemas/board.ts`)
>
> ```json
> {
>   "slug": "<short-slug>",
>   "name": "<as listed>",
>   "vendorSlug": "<slug from data/vendors/>",
>   "layout": "tkl" | "60" | "65" | "75" | "full" | "alice" | "split" | "ortho" | "other",
>   "caseMaterial": "aluminum" | "polycarbonate" | "wood" | "fr4" | "plastic" | "mixed",
>   "mountStyle": "gasket" | "top-mount" | "tray-mount" | "integrated-plate" | "leaf-spring" | "pcb-mount",
>   "hotswap": <boolean>,
>   "wireless": <boolean>,
>   "releasedAt": "<YYYY-MM-DD or null>",
>   "status": "in-stock" | "group-buy" | "discontinued",
>   "imageUrl": null,
>   "description": "<20-800 chars>",
>   "updatedAt": "<ISO datetime>"
> }
> ```
>
> ## Vendor registry
>
> Existing vendor slugs (from phases 2 + 18):
> - `cannonkeys`
> - `kbdfans`
> - `wuque-studio`
>
> If a candidate references a vendor outside the registry,
> include a vendor record per `packages/data/src/schemas/vendor.ts`:
>
> ```json
> {
>   "slug": "<lowercase-hyphen>",
>   "name": "<display name>",
>   "url": "<homepage URL>",
>   "countryCode": "<ISO 3166-1 alpha-2>",
>   "description": "<20-600 chars>",
>   "status": "active" | "inactive",
>   "updatedAt": "<ISO datetime>"
> }
> ```
>
> Likely new vendors for this phase: `mode-designs` (boards),
> `drop` (keycaps), `novelkeys` (switches + keycaps), `gmk`
> (manufacturer — but GMK isn't a storefront, so prefer the
> partner-vendor that ran the GB instead).
>
> ## Voice rules for `description`
>
> - Knowledgeable-peer; reasoning over hype.
> - State *what the part is* + *one specific thing it's known
>   for* in 1–2 sentences.
> - **Never** "the best", "industry-leading", "you don't want to
>   miss".
> - 20–800 chars (mid-range targets ~150 chars).
> - Match the existing seed shape (see
>   `data/switches/gateron-oil-king.json` etc. for tone).
>
> ## Output format
>
> Return a single JSON object in a fenced ```json block:
>
> ```json
> {
>   "switches": [{...}, ...],         // 6-8 records
>   "keycapSets": [{...}, ...],       // 4-5 records
>   "boards": [{...}, ...],           // 3-4 records
>   "vendors": [{...}, ...],          // any new vendors needed
>   "rejections": [
>     { "candidate": "<entity>/<slug>", "reason": "..." }
>   ],
>   "notes": "<paragraph: research method, what surprised you, gaps>"
> }
> ```
>
> **Do not write any files.** JSON only — the calling tick
> handles the writes.

## Cross-links

**In:**
- Existing seed records remain — `gateron-oil-king` (switch),
  `gmk-olivia` (keycap-set), `mode-sonnet` (board).
- Articles that already reference parts via `<PartReference>`:
  `building-mode-sonnet-with-oil-kings.mdx`,
  `gateron-oil-king-deep-dive.mdx`. These references will
  continue to resolve unchanged.

**Out:**
- Future articles can `<PartReference slug="<new-record-slug>">`
  any of the new records.
- The `MentionedPartsRail` density on existing articles does
  not change (no existing article references these new
  records yet).

**Retro-fit:** zero. New records sit in `data/` waiting to be
referenced; nothing in the existing component / route layer
needs to change.

## Decisions made upfront — DO NOT ASK

- **No schema changes.** The three existing schemas
  (`switch.ts`, `keycap-set.ts`, `board.ts`) cover every
  candidate scout might return. If a candidate doesn't fit
  the schema, scout drops it (per phase 18 / 19 rejection
  pattern).
- **`imageUrl` stays null** for keycap-sets and boards. Real
  product imagery is rights-managed; the `<PartReference>`
  shape already handles `imageUrl: null` gracefully.
- **No SOURCE-page critique drain.** The `/sources` "1 cite
  uniformity" critique row (CRITIQUE.md line 87) reads source
  counts from `<Source>` MDX tags inside articles, not from
  product records. The phase scope row in
  `plan/steps/01_build_plan.md` mentioned this drain but the
  causal chain was wrong — phase 20 does **not** drain
  /sources critique. That row stays open for a future
  iterate or content tick that adds new articles with more
  citations.
- **Bias the candidate set toward records that intersect
  phase-18 group-buys + phase-19 trends.** When a switch
  shows up in the trends tracker (HMX Cloud) or a keycap is
  on the live group-buys page, having a product record
  unlocks future `<PartReference>` mentions and tighter
  cross-linking. The brief lists priorities accordingly.
- **Quality cap, not floor.** Scout's brief is 6–8 / 4–5 /
  3–4. If scout can only produce 5 / 3 / 2 with high
  confidence, that's still acceptable — the catalog grows
  via future iterate ticks. Don't fabricate.
- **Vendor record growth in-scope** (same decision as phase
  18). New vendors land in `data/vendors/` in this commit.
- **No deletions.** Unlike phase 18 (which deleted the
  fictional Mode Sonnet R2), phase 20's existing 3 seed
  records are real-or-real-enough and stay. The seed
  describes products that exist; nothing to retire.

## Empty / loading / error states

Already handled by phase 5 (`<PartReference>` resolves slug
or renders `[unknown part:<slug>]`) and phase 5
(`<MentionedPartsRail>` hides when no parts found). No new
states needed.

## SEO

No metadata changes. Switches, keycap-sets, and boards do not
have their own pages — JSON-LD + canonical are unchanged.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `data/switches/*.json` | `data:validate` (Zod parse against `SwitchSchema`) | n/a |
| `data/keycap-sets/*.json` | `data:validate` | n/a |
| `data/boards/*.json` | `data:validate` | n/a |
| `data/vendors/*.json` (any new) | `data:validate` | n/a |
| Cross-refs | `data:validate` (vendor slugs resolve) | n/a |

No new unit tests. No new e2e specs. The existing data-runtime
loaders.test.ts asserts `>=N` on counts, so growing the row
count doesn't break anything.

## Hermetic e2e registration

No new `apps/e2e/src/fixtures/page-reads.ts` entries. No
existing entry's `min-link-count` needs a bump — switches,
keycap-sets, and boards have no dedicated page surface.

## Verify gate

```bash
pnpm verify
```

`pnpm --filter @thock/data validate` must green-light all
records. Manifest regenerates as part of the prebuild.

## Ship procedure (the actual writes)

After scout returns the candidate JSON:

1. **Validate** every candidate against its schema via
   `safeParse`. Reject failures inline.
2. **Validate cross-refs**: every `vendorSlug` either matches
   an existing `data/vendors/` record OR is included in
   scout's `vendors[]` array.
3. **Write** `data/switches/<slug>.json` for each retained
   switch. Pretty-print 2-space indent + trailing newline
   (matches existing seed shape).
4. **Write** `data/keycap-sets/<slug>.json` for each retained
   keycap set.
5. **Write** `data/boards/<slug>.json` for each retained
   board.
6. **Write** `data/vendors/<slug>.json` for each new vendor.
7. **Regenerate** the manifest:
   `pnpm --filter @thock/web run prebuild` (re-emits
   `manifest.generated.json` and `index.generated.json`).
8. **Validate** the new data set: `pnpm --filter @thock/data
   validate`.

## Commit body template

```
data: switches / keycap-sets / boards backfill — phase 20

- Scout-driven backfill of the three product entity types.
  Switches: 1 -> N. Keycap-sets: 1 -> M. Boards: 1 -> P.
  Vendor records: <list> if any new ones added.
- No schema changes. No component changes. No route changes.
  Pure data ship — existing <PartReference> / MentionedPartsRail
  / data-runtime loaders pick the records up automatically.
- Bias the candidate set toward records that intersect the
  phase-18 group-buys (vendor / GB linkage) and phase-19
  trends rows (HMX Cloud, 75% layout, Mode Designs, etc.) —
  future articles can <PartReference> any of these.

Decisions locked in the brief:
- no schema changes (existing schemas cover every candidate)
- imageUrl stays null
- vendor record growth in-scope
- quality cap not floor (scout returns what it can verify)
- no deletions; existing 3 seed records stay
```

## DoD

Flip Phase 20's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push. Confirm green deploy.

After phase 20: the loop transitions back to `/iterate` per
the build_plan note. `/march` makes the transition automatic.

## Follow-ups (out of scope)

- New articles that reference the new product records via
  `<PartReference>` — these come from /iterate + content-curator
  picking up content gaps.
- A `/parts/[slug]` route or `/switches/`, `/keycap-sets/`,
  `/boards/` index pages — not in the URL contract; if added
  later, they'd be a new page-family phase.
- Citation-list-per-article on `/sources` — separate audit row;
  unrelated to phase 20.
- Vendor logo affordance — carry-over from phase 13.
