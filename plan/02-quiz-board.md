# 02 — /quiz/board: board recommender quiz

> A short quiz at `/quiz/board` that recommends boards from the
> catalog, completing the quiz trio next to `/quiz/switch` and
> `/quiz/keycap-set`.

## Why

`/tools` advertises two quizzes (switch, keycap-set) and two
compare pages (switch, board). The board quiz is the obvious gap:
`data/boards/` holds 10 boards that differ on formFactor,
mountingStyle, hotswap, caseMaterial and pcbType, which map cleanly
onto 4-5 questions. `/compare/board` already exists; the quiz adds
the discovery angle in front of it. Candidate `[6.5]` (proposed
2026-06-15, expand pass 127), promoted via `/oversight` 2026-11-01
as part of a deliberate shift toward reader-facing features.

## Design

Mirror `/quiz/keycap-set` (phase 47) and `/quiz/switch` (phase 33)
exactly — the switch quiz is the closer sibling here since it also
links forward into a `/compare/*` page:

- `apps/web/src/app/quiz/board/page.tsx` + `loading.tsx` +
  `opengraph-image.tsx` (reuse `PillarOGContent`, hex palette only;
  see the Satori/oklch landmine already worked around there).
- Pure `recommendBoard(answers, catalog)` helper with a weighted
  score map and unit tests; a `BoardQuiz` client component reusing
  `QuizStep` / `QuizProgress`, with a new `BoardResultCard` (mirrors
  `KeycapSetResultCard`, not the generic `ResultCard`, since the
  spec/label shape differs).
- Questions, one per `BoardSchema` field that actually
  differentiates the 10-board catalog (`packages/data/src/schemas/
  board.ts`): `layout`, `mountStyle`, `caseMaterial`, `hotswap`,
  `wireless`. (The spec's original draft named `formFactor` and
  "rough budget" / `pcbType` — neither exists on `BoardSchema`;
  `layout` is the real field, and `wireless` is the real fifth
  differentiator, swapped in during chunking's reality-check.)
  Results link to `/part/board/<slug>` and, mirroring the switch
  quiz, a "Compare top 2 →" link to `/compare/board?a=&b=` with the
  top two results preselected.
- `WebApplication` JSON-LD; sitemap, canonical URLs, page reads and
  `quiz.spec.ts` extended; `/tools` gains the card; `/compare/board`
  gains a "Not sure? Take the quiz →" link (mirrors
  `compare-quiz-link` on `/compare/switch`).
- URL contract: `/quiz/board` added to `plan/bearings.md`.

### Decisions made upfront (do not ask)

- Same visual and interaction language as the two existing quizzes;
  no new components unless reuse is impossible.
- Recommendations come only from `data/boards/` via `@thock/data`.
  No hardcoded board copy.
- Question dimensions are `layout`, `mountStyle`, `caseMaterial`,
  `hotswap`, `wireless` (5 questions) — not the draft's `formFactor`
  / budget / `pcbType`, which don't exist on `BoardSchema`.

## Acceptance

- **A3** `/tools`, `/compare/board`, sitemap, canonical URLs and
  bearings all list the new route; e2e covers the happy path and
  a11y (desktop + mobile).

## Open questions

None.

## Chunks

Measure: 1 open · 2 closed · next A4

- [ ] **02.2** Wire into `/tools`, `/compare/board`, sitemap, canonical URLs, bearings, e2e + a11y coverage · S · closes A3 · needs —
