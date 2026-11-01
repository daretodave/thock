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
  others against vendor primary sources).
- Surface it: the switch part page spec table, `/parts` switch
  filters, a `/compare/switch` row, and a `/quiz/switch` weight if
  the quiz can absorb it without adding a question.

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
- **A3** The part page, `/parts` filters and `/compare/switch`
  render sensing (and actuation range when present), with unit and
  e2e coverage for an HE record.

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

Not chunked yet.
