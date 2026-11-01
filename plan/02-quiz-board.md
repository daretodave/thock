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

Mirror `/quiz/keycap-set` (phase 47) exactly:

- `apps/web/src/app/quiz/board/page.tsx` + `loading.tsx` +
  `opengraph-image.tsx` (hex palette only; see the Satori/oklch
  landmine).
- Pure `recommendBoard(answers, catalog)` helper with a weighted
  score map and unit tests; a `BoardQuiz` client component reusing
  `QuizStep` / `ResultCard` / `QuizProgress`.
- Questions: layout/size, mounting style (feel), case material,
  hotswap required, rough budget. Results link to
  `/part/board/<slug>` and offer `/compare/board` with the top two
  preselected.
- `WebApplication` JSON-LD; sitemap, canonical URLs, page reads and
  `quiz.spec.ts` extended; `/tools` gains the card;
  `/compare/board` gains a "Find your board" link.
- URL contract: `/quiz/board` added to `plan/bearings.md`.

### Decisions made upfront (do not ask)

- Same visual and interaction language as the two existing quizzes;
  no new components unless reuse is impossible.
- Recommendations come only from `data/boards/` via `@thock/data`.
  No hardcoded board copy.

## Acceptance

- **A1** `/quiz/board` renders, walks every question, and returns
  1-3 ranked boards that exist in the catalog, each linking to its
  part page.
- **A2** `recommendBoard` is pure and unit-tested, including ties
  and an answer set no board fully matches (closest match, never an
  empty result).
- **A3** `/tools`, `/compare/board`, sitemap, canonical URLs and
  bearings all list the new route; e2e covers the happy path and
  a11y (desktop + mobile).

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

Not chunked yet.
