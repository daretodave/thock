# 03 — Switch sensing: model hall-effect, TMR and optical switches

> The switch catalog records how a switch senses a press
> (mechanical contact, hall-effect, TMR, optical), so magnetic
> switches are first-class instead of passing as plain linears.

## Why

Field research (2026-10-26) found magnetic hall-effect switches
with adjustable actuation and rapid trigger are the defining 2026
switch trend, and thock already publishes on them ("Gateron
Magnetic Jade", the TMR five-week-climb trend piece). The schema
cannot say so: `data/switches/gateron-magnetic-jade.json` is stored
as `type: "linear"` with a leaf-spring-shaped `springGrams`, and
its HE nature lives only in prose. A reader filtering for HE
switches, the switch quiz, or a compare page has nothing to key on.
Candidate `[6.0]` (research, 2026-10-26), promoted via `/oversight`
2026-11-01.

## Design

- Sensing is orthogonal to feel, so do not add values to `type`.
  Add `sensing: 'mechanical' | 'hall-effect' | 'tmr' | 'optical'`
  to `SwitchSchema` (`packages/data/src/schemas/switch.ts`),
  defaulting to `mechanical` so existing records stay valid;
  regenerate `data/schemas/switch.schema.json`.
- Optional `actuationRangeMm: { min, max }` for adjustable switches
  (HE/TMR). Rapid-trigger and force-curve data wait for a later
  pass.
- Backfill: set `sensing` on every existing record that is not
  mechanical (at least `gateron-magnetic-jade`; scout-verify any
  others against vendor primary sources). A corpus grep for
  hall-effect/TMR/optical language at chunking time (2026-11-06)
  found only `gateron-magnetic-jade` among the 18 catalog records.
- Surface it: a "Sensing" row on the switch part page spec table
  (`PartSpec.tsx`) and the `/compare/switch` table
  (`SwitchCompareTable.tsx`) — reality-checked at chunking time:
  neither `/parts` nor `/part/switch` has a filter mechanism today
  (both are plain sorted lists, see `apps/web/src/app/part/[kind]/
  page.tsx` and `helpers.ts`), so "switch filters" is corrected to
  a sensing tag on the `/part/switch` index card (`PartIndexCard`)
  instead of inventing a filter feature this spec doesn't need. No
  `/quiz/switch` weight: none of its four existing axes maps to
  sensing without adding a question, and the Acceptance section
  below never required it.

### Decisions made upfront (do not ask)

- The schema change is additive only; no existing field changes
  meaning.
- `springGrams` stays for HE switches (vendors still quote a
  force); the spec table labels it "force" rather than "spring"
  when `sensing` is not mechanical.

## Acceptance

- **A1** `sensing` exists in the Zod schema and generated JSON
  Schema with a `mechanical` default; `data:validate` passes and
  schema tests cover the new field.
- **A2** Every non-mechanical switch in `data/switches/` carries
  the correct `sensing` value, each verified against a vendor
  primary source.
- **A3** The part page spec sheet, the `/part/switch` index card
  and `/compare/switch` render sensing (and actuation range when
  present), with unit and e2e coverage for an HE record.

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

- [ ] **03.1** Add `sensing` enum (default `mechanical`) + optional
  `actuationRangeMm` to `SwitchSchema`, regenerate
  `switch.schema.json`, schema tests for the field and its default
  · S · closes A1 · needs —
- [ ] **03.2** Backfill `sensing: 'hall-effect'` on
  `data/switches/gateron-magnetic-jade.json` (scout-verified
  against a vendor primary source); `data:validate` green · S ·
  closes A2 · needs 03.1
- [ ] **03.3** Surface `sensing`: `SENSING_LABEL` in
  `spec-labels.ts`; a "Sensing" row in `PartSpec.tsx` and
  `SwitchCompareTable.tsx` (relabel "Spring" → "Force" when
  `sensing !== 'mechanical'`, per Design); a sensing tag on
  `PartIndexCard` for switches; unit tests for the relabel/row
  logic plus e2e coverage on the gateron-magnetic-jade part page
  and compare table · M · closes A3 · needs 03.1, 03.2
