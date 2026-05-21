# Phase 34 — Parts catalog second data pass

> **Data-only phase.** No schema changes, no new routes, no component
> changes. Ships JSON records validated against existing schemas.
> Data-runtime manifest rebuild ripples records into `/part/[kind]/[slug]`,
> the Phase 33 quiz, and the Phase 35 `/parts` landing.

## Outcome

Add 8–10 switches, 3 keycap-sets, and 3 boards to fill underrepresented
catalog segments. Debtors: budget clicky, silent-tactile, hall-effect-as-linear,
premium linears, SA profile, PBT doubleshot, compact TKL, 75% from additional
vendors.

## Why

Current catalog (Phase 20 backfill):
- Switches: 8 records — linears (4), tactile (3), silent-linear (1). Missing: clicky (0), silent-tactile (0).
- Keycap-sets: 5 records — cherry (2), kat (1), mt3 (2). Missing: sa (0), pbt-doubleshot (0).
- Boards: 5 records — 65 (3), 75 (2), tkl (1). Missing: additional vendors, alice/split.

The Phase 33 quiz scores across `getAllSwitches()` — more records = more result
variety. Phase 35 `/parts` landing displays record counts per category.

## Records shipped

### Switches (8)

| Slug | Type | Vendor | Segment |
|------|------|--------|---------|
| kailh-box-white | clicky | novelkeys | budget clicky |
| kailh-box-jade | clicky | novelkeys | heavier clicky |
| gazzew-boba-u4 | silent-tactile | novelkeys | silent tactile |
| gazzew-boba-lt | silent-linear | novelkeys | ultra-light silent |
| gateron-ink-v2-yellow | linear | kbdfans | premium smooth linear |
| c3-tangerine-r2 | linear | cannonkeys | premium dark linear |
| gateron-magnetic-jade | linear | kbdfans | hall-effect linear (magnetic actuation, linear feel) |
| durock-t1 | tactile | cannonkeys | heavy premium tactile |

### Keycap-sets (3)

| Slug | Profile | Material | Vendor |
|------|---------|----------|--------|
| gmk-laser | cherry | abs | drop |
| sa-godspeed | sa | abs | drop |
| domikey-wob | cherry | pbt | kbdfans |

### Boards (3)

| Slug | Layout | Vendor |
|------|--------|--------|
| drop-ctrl | tkl | drop |
| kbd75v3 | 75 | kbdfans |
| ikki68-aurora | 65 | wuque-studio |

## No schema change

All records validate against existing schemas in `packages/data/src/schemas/`.
No Zod edits, no JSON Schema regeneration.

## Verify gate

`pnpm verify` — typecheck + test:run + data:validate + build + e2e.
Data:validate confirms all new slugs resolve, vendorSlugs cross-ref to existing
`data/vendors/`. The e2e smoke walker covers `/part/switch/[slug]` automatically
via `generateStaticParams` reading `getAllSwitches()`.

## Decisions

- Hall-effect actuation (Gateron Magnetic Jade) mapped to `type: linear` —
  the schema has no hall-effect enum and the feel is linear; description notes
  the magnetic mechanism.
- SA Godspeed chosen over SA Carbon (a DSA set with a confusing name overlap);
  Godspeed is the clearer canonical SA profile showcase.
- Ikki68 Aurora added as 65% despite existing 65% boards — distinct vendor
  (wuque-studio) and material (polycarbonate) add breadth.
- Split layout deferred — no existing vendor carries a mainstream split kit;
  adding a vendor for Keebio/ZSA belongs in a separate data pass.

## DoD

- [ ] 8 switch records land in `data/switches/`
- [ ] 3 keycap-set records land in `data/keycap-sets/`
- [ ] 3 board records land in `data/boards/`
- [ ] `pnpm data:validate` clean
- [ ] `pnpm verify` green
- [ ] Phase 34 ticked `[x]` in `plan/steps/01_build_plan.md`
