# Phase 18 — Group buys backfill (scout-driven)

> Agent-facing brief. Concise, opinionated, decisive. The first
> phase of the **Real-data backfill** mini-plan promoted from
> PHASE_CANDIDATES (expand pass 1, score 8.0) via /oversight on
> 2026-05-09. Drains user-jot 40fefe2 ("Mode Sonnet R2 is
> fictional; can an agent actually populate with some valid
> groupbuys?") and replaces the lone fictional seed with 4–6 real
> records research'd via the `scout` sub-agent.

## Routes (no new routes)

- `/group-buys` (already shipped phase 13). Phase 18 ships data,
  not a new surface.
- Home `<GroupBuysWidget>` (already shipped phase 6). Picks up
  the new records automatically via `getActiveGroupBuys()`.
- `/article/mode-sonnet-r2-group-buy-coverage` (no body change —
  the eac846a 2026-05-09 update callout already handles the
  tombstone framing for when the data record disappears).

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getAllGroupBuys()` | manifest | partition the new + retained records (Mode Sonnet R2 deleted; everything else from scout's research) |
| `getAllVendors()` | manifest | resolve vendor names; **add new entries** if scout's candidates aren't in the registry |
| `partitionGroupBuys(all, now)` | helper | already shipped phase 13; re-validates after the writes |
| `splitLiveByUrgency(live, now)` | helper | already shipped 993fd4f; surfaces 72h-band rows in the right section |

## Components

### Reused (already shipped)

- `<GroupBuyRow>` (phase 13) for the index page rows.
- `<GroupBuyCountdownRow>` (phase 6) for the home widget.
- `<HomeSectionHeading>` (phase 6) for section dividers.
- `partitionGroupBuys` + `splitLiveByUrgency` helpers (phase 13 +
  993fd4f).

### New

**Zero new components.** Phase 18 is a pure data ship — `scout`
researches, `ship-data` writes JSON, the existing components
render whatever lands.

## Scout brief (sub-agent prompt)

When this phase runs (`/ship-a-phase` will invoke), spawn the
`scout` sub-agent with this brief:

> Research **active / recently-announced / recently-closed group
> buys** at the major mechanical-keyboard vendors. Return a
> structured candidate set ready for `data/group-buys/` records.
>
> Vendors to check (priority order):
> 1. **CannonKeys** — `https://cannonkeys.com/collections/group-buys`
> 2. **NovelKeys** — `https://novelkeys.com/collections/group-buys`
> 3. **Mode Designs** — `https://modedesigns.com/collections/group-buys`
> 4. **Wuque Studio** — `https://wuquestudio.com`
> 5. **KBDfans** — `https://kbdfans.com/collections/group-buy`
> 6. **GeekHack interest-check / group-buy boards** —
>    `https://geekhack.org/index.php?board=132.0` (active GBs) +
>    `131.0` (interest checks)
>
> For each vendor page, **HEAD-probe every candidate URL** before
> returning it. Reject any URL that 404s or redirects to a generic
> storefront — that's the failure mode the user-jot 40fefe2
> originally flagged. Aim for **4–6 candidate records total**
> across vendors; quality over quantity. Prefer:
> - 2–3 currently `live` buys (window includes 2026-05-09; >0 days
>   left at the close edge).
> - 1–2 `announced` buys with a known startDate (future).
> - 1–2 `closed` buys from the last 90 days (for the "Recently
>   ended" section's archive padding).
>
> For each candidate, return JSON in this shape (matches
> `packages/data/src/schemas/group-buy.ts`):
>
> ```json
> {
>   "slug": "<vendor>-<short-slug>",
>   "name": "<exact product name as the vendor lists it>",
>   "vendorSlug": "<vendor slug — see existing data/vendors/>",
>   "productSlug": "<slug if a matching board/keycap-set/switch record exists, else null>",
>   "productKind": "board | keycap-set | switch",
>   "startDate": "<YYYY-MM-DD>",
>   "endDate": "<YYYY-MM-DD>",
>   "region": "global | US | EU | UK | APAC",
>   "url": "<verified vendor URL — HEAD-probed 2xx>",
>   "imageUrl": null,
>   "status": "live | announced | closed",
>   "description": "<one-sentence honest description, knowledgeable-peer voice, no hype>",
>   "updatedAt": "<ISO timestamp at scout-time>"
> }
> ```
>
> Voice rules for `description`:
> - Knowledgeable-peer, not hype-bro. ≤1 sentence. Match the
>   /about-page tone.
> - State what the product is + the GB shape ("Second round of the
>   Mode Sonnet 65 percent. Gasket-mount, hotswap PCB, three new
>   accent finishes.").
> - **Never** "Don't miss the close", "limited time", "exclusive".
>
> Also return a `vendors[]` array with any new vendor records that
> don't yet exist in `data/vendors/` — schema is
> `packages/data/src/schemas/vendor.ts`. Format:
>
> ```json
> {
>   "slug": "<lowercase-hyphen>",
>   "name": "<vendor display name>",
>   "url": "<vendor homepage>",
>   "region": "global | US | EU | UK | APAC",
>   "description": "<one sentence>"
> }
> ```
>
> **Do not write any files.** Return JSON only — the calling
> /ship-a-phase tick handles the writes.

## Cross-links

**In:**
- Home `<GroupBuysWidget>` reads `getActiveGroupBuys()`.
- `/group-buys` reads `getAllGroupBuys()`.
- The 993fd4f 72h-aware urgency framing is the right shape for
  the new live records.

**Out:**
- `/article/mode-sonnet-r2-group-buy-coverage` keeps its existing
  body + 2026-05-09 update callout. After this phase, the data
  record disappears — the article's pointer to /group-buys
  becomes a soft "see /group-buys for current Mode + CannonKeys
  offerings" reference. No body edit needed; the eac846a callout
  already framed the article as historical news coverage.

**Retro-fit:** zero. All consuming surfaces (`/group-buys`, home
widget, `/article/mode-sonnet-r2`) are already shipped and tested
against the schema, not against specific records.

## Decisions made upfront — DO NOT ASK

- **Mode Sonnet R2 retirement: delete, not archive.** Per
  /oversight 2026-05-09: `data/group-buys/cannonkeys-mode-sonnet-r2.json`
  is **deleted**. Not moved to `_archive/`. Not moved to
  `__fixtures__/`. The article body stays as historical news
  coverage; the data record was always seed-quality fictional and
  doesn't deserve audit-trail preservation.
- **Vendor record growth in-scope.** Phase 18 also writes new
  `data/vendors/<slug>.json` records when scout's candidates need
  vendors that aren't in the registry. Same record, same commit;
  splitting the vendor write to a follow-up tick is needless
  ceremony.
- **Image URLs stay null.** Real product imagery is rights-managed
  and we don't have a CDN. `imageUrl: null` is honest; the
  `<GroupBuyRow>` already handles the placeholder shape.
- **Scout candidate cap: 6.** More than 6 records start to
  meaningfully change the page composition (which would need a
  filtering UI per phase 13's note "Filters land if/when seed
  grows past ~30 active rows"). 6 is enough for the "Live now",
  "Announced", and "Recently ended" sections to feel populated
  without crossing the filter threshold.
- **HEAD-probe is non-negotiable.** Any URL that returns non-2xx
  is dropped from scout's candidate set. Re-running the original
  user-jot's 404 failure mode would defeat the phase's purpose.
- **Retain the existing live record path** if scout finds a real
  Mode Sonnet R2 GB at CannonKeys (unlikely per the user's
  observation, but not impossible). In that case keep the new
  record at `cannonkeys-mode-sonnet-r2.json` with the **real**
  data; the article's body covers itself.

## Empty / loading / error states

Already handled by phase 13 / phase 6. The page renders the
"quiet week" empty panel only when all three sections are empty,
which won't happen post-phase-18 (we'll have ≥4 records).

## SEO

No metadata changes. The CollectionPage / ItemList JSON-LD on
`/group-buys` automatically picks up the new ItemList entries
(live + announced records, per phase 13's contract).

## Scout failure modes

1. **Vendor pages don't expose a clean "group buys" endpoint.**
   Some vendors run GBs from product-page banners. Scout's brief
   accepts this — research the vendor's home / news / blog page
   if no `/collections/group-buys` exists. If a vendor's GB cadence
   is fully email-only (no web surface), drop it from this phase
   and surface as an iterate finding.
2. **HEAD-probe rate limit.** Scout's WebFetch budget is finite.
   If probing slows the candidate set below 4, **ship what we
   have** + file the rest as a follow-up `/ship-data` row in
   `data/BACKLOG.md`. Don't block the phase on extra HEAD probes.
3. **Schema validation fails on a candidate.** Reject that
   candidate; ship the others. Note the rejection in the commit
   body so a follow-up iterate tick can fix the schema if a
   recurring pattern emerges (e.g. new region values not in the
   enum).

## Ship procedure (the actual writes)

After scout returns the candidate JSON:

1. **Validate** every candidate against
   `packages/data/src/schemas/group-buy.ts` and `vendor.ts` via
   `zod.safeParse`. Reject failures inline.
2. **Write** `data/group-buys/<slug>.json` for each retained
   candidate. Pretty-print with 2-space indent + trailing newline
   (matches the existing seed shape).
3. **Write** `data/vendors/<slug>.json` for each new vendor.
4. **Delete** `data/group-buys/cannonkeys-mode-sonnet-r2.json`
   (use `git rm`).
5. **Regenerate** the manifest:
   `pnpm --filter @thock/web run prebuild` (re-emits
   `apps/web/src/lib/data-runtime/manifest.generated.json` and
   `apps/web/src/lib/search/index.generated.json`).
6. **Validate** the new data set: `pnpm --filter @thock/data
   validate` (exits non-zero if any record fails schema).

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `data/group-buys/*.json` | data:validate (Zod parse against `GroupBuySchema`) | n/a |
| `data/vendors/*.json` | data:validate | n/a |
| `/group-buys` | n/a | existing phase 13 e2e (≥1 row, JSON-LD ItemList present, CTA `rel="sponsored"`). Updated assertion: `≥4 group-buy-row` (was `≥1`). |
| Home widget | existing GroupBuysWidget tests still pass; the urgency-framing tests at 993fd4f cover the new records' 72h band by date arithmetic | n/a |

## Hermetic e2e registration

No new entries in `apps/e2e/src/fixtures/page-reads.ts`. The
existing `/group-buys` and `/` entries cover the new records.

**Bump** the `min` in the `/group-buys` row from `1` to `4` so
phase 18's record growth is asserted:

```ts
'/group-buys': {
  pattern: '/group-buys',
  ...html([
    { kind: 'h1-matches', pattern: /group buys/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="group-buy-row"]',
      min: 4,  // bumped from 1 — phase 18 ships ≥4 real records
    },
  ]),
},
```

## Verify gate

```bash
pnpm verify
```

Tightens the contract: `pnpm --filter @thock/data validate` must
green-light all records (manifest is regenerated as part of the
phase prebuild).

## Commit body template

```
data: real group buys backfill — phase 18

- Replaces the lone fictional Mode Sonnet R2 seed with N real
  group-buy records sourced via the scout sub-agent. CannonKeys,
  NovelKeys, Mode Designs, [...]. Every URL HEAD-probed 2xx at
  scout-time.
- Deletes data/group-buys/cannonkeys-mode-sonnet-r2.json
  (decision locked at /oversight 2026-05-09: delete, not
  archive). The article at /article/mode-sonnet-r2-group-buy-coverage
  stays as published news coverage; the eac846a 2026-05-09 update
  callout already handles the tombstone framing.
- New vendor records: <list> in data/vendors/ where scout's
  candidates referenced vendors not yet in the registry.
- Bumps the /group-buys e2e min-row assertion from 1 to 4.

Drains user-jot 40fefe2 (CRITIQUE.md row "Mode Sonnet R2 is
fictional; seed needs real vendor data").

Decisions locked at /oversight time:
- delete (not archive) the fictional R2 record
- vendor record growth in-scope
- imageUrl stays null
- scout candidate cap: 6
- HEAD-probe non-negotiable
```

## DoD

Flip Phase 18's `[ ]` → `[x]` in
`plan/steps/01_build_plan.md`, append commit hash. Mark the
user-jot CRITIQUE row [x] with the addressing commit. Commit and
push. Confirm green deploy.

## Follow-ups

- Phase 19 (trends backfill + `note` schema additive) picks up
  next.
- Phase 20 (switches / keycap-sets / boards) ships after that.
- If scout's GeekHack research surfaces a public group-buy data
  feed (RSS, JSON), surface as a new candidate via `/expand`:
  the loop could pull live updates rather than running a research
  pass per refresh.
- Vendor logo affordance is still post-MVP (carry-over from
  phase 13).
