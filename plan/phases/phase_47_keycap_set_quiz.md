# Phase 47 — `/quiz/keycap-set` keycap-set recommender

> **Mirrors phase 33 (`/quiz/switch`)** — same shape, different catalog
> and scoring dimensions.

## Outcome

A new interactive route at `/quiz/keycap-set` that answers 4 questions
about the user's profile, material, legend, and availability preferences,
then ranks the `getAllKeycapSets()` catalog and links top-3 matches to
existing `/part/keycap-set/[slug]` pages.

## Why

The keycap-set catalog crossed 10 records at phase 34. The switch quiz
(phase 33) demonstrated the pattern; the keycap-set quiz is the natural
twin. Cross-links between `/quiz/keycap-set` and `/part/keycap-set/[slug]`
complete the discovery loop for keycap sets.

## URL

`/quiz/keycap-set` — static, no slug segment.

## Questions (4)

1. **Profile height** — how tall and shaped you want your keycaps:
   - `uniform` → "Low and uniform — Cherry / OEM / XDA" (cherry, oem, xda, dsa score high)
   - `spherical-tall` → "Tall and spherical — SA style" (sa high, mt3 partial)
   - `cylindrical-tall` → "Tall and cylindrical — MT3 / OEM sculpted" (mt3 high, sa partial)
   - `no-pref` → "No preference" (neutral)

2. **Material** — ABS vs. PBT vs. no preference:
   - `abs` → "ABS — vibrant color, smooth surface" (abs: 10, mixed: 5)
   - `pbt` → "PBT — durable, textured, shine-resistant" (pbt: 10, mixed: 5)
   - `no-pref` → "No preference" (neutral)

3. **Legends** — how you want legends applied:
   - `doubleshot` → "Doubleshot — legends that never fade" (doubleshot: 10, dye-sub: 4)
   - `dye-sub` → "Dye-sub — vivid colors and complex art" (dye-sub: 10, doubleshot: 4)
   - `no-pref` → "No preference" (neutral)

4. **Availability** — when you want to buy:
   - `now` → "Available right now — in-stock" (in-stock: 10, group-buy: 2)
   - `group-buy` → "I can wait for a group buy" (group-buy: 10, in-stock: 8, sold-out: 4)
   - `no-pref` → "No preference" (neutral)

## Scoring logic

Pure function `recommendKeycapSet(answers, catalog)` in
`apps/web/src/lib/quiz/recommendKeycapSet.ts` — additive integer weights
over the `KeycapSet` record's `profile`, `material`, `legendType`, and
`status` fields. Returns top-3 `ScoredKeycapSet` (slug + score), ties
broken alphabetically. 5 Vitest unit tests alongside.

## Components

Reuse `QuizProgress` and `QuizStep` (already generic). Create:
- `KeycapSetResultCard.tsx` — shows profile + material + legendType label
  instead of switch type; links to `/part/keycap-set/<slug>`.
- `KeycapSetQuiz.tsx` — `'use client'` quiz orchestrator mirroring `SwitchQuiz`.
- `__tests__/KeycapSetQuiz.test.tsx` — component tests (renders, advances).

## Server page

`apps/web/src/app/quiz/keycap-set/page.tsx`:
- `buildMetadata` with title "Find your keycap set".
- `WebApplication` + `BreadcrumbList` JSON-LD.
- `getAllKeycapSets()` from `@/lib/data-runtime`.
- `<main id="main">` (phase 22 landmark contract).
- `loading.tsx` pulse skeleton.

## Cross-links (retrofit)

- `/part/keycap-set/[slug]` detail page: add "Find your keycap set →" link
  (parallel to the existing "Compare this switch →" on switch detail).
- `apps/web/src/app/page.tsx` home CTA strip: mention keycap-set quiz next
  to the switch quiz line.
- `plan/bearings.md` URL contract table: add `/quiz/keycap-set` row.

## E2E + fixtures

- `apps/e2e/tests/quiz.spec.ts`: new describe block mirroring the switch
  quiz block (5 tests: H1, progress "1 of 4", advances on click, results
  show `/part/keycap-set/` links + browse-all affordance, start-over
  resets, JSON-LD).
- `apps/e2e/src/fixtures/canonical-urls.ts`: add `/quiz/keycap-set` entry.
- `apps/e2e/src/fixtures/page-reads.ts`: add `/quiz/keycap-set` entry
  with `h1-matches: /find your keycap set/i`.

## No schema change

All scoring uses existing `KeycapSet` fields. No new data record needed.

## Decisions (autonomous)

- 4 questions (matches switch quiz) — profile + material + legends +
  availability. Aesthetic color is a sub-dimension of all three; not a
  standalone axis for a 10-record catalog.
- `no-pref` on every question scores neutral (0) so it doesn't penalize
  any record.
- `KeycapSetResultCard` is a separate component, not a generic `ResultCard`
  — the display fields differ enough (profile/material/legendType vs.
  switch type) that a generic would add complexity for no reuse.
