# Phase 33 — "Find your switch" interactive recommender

> **Generated on-demand by /ship-a-phase (cloud run 2026-05-16)**

## Outcome

Ship `/quiz/switch` — a 4-question interactive quiz that scores the live switch catalog by sound profile, actuation feel, spring weight, and primary use, returning the top 3 matches as `/part/switch/[slug]` links.

## Why

User-requested fun phase. Converts the phase-21 part pages + phase-20 switch data into an interactive entry point that earns its URL. No schema change, no new data records. The scoring logic is pure TypeScript; future switches automatically appear in results as `getAllSwitches()` grows.

## Routes shipped

- `/quiz/switch` — the recommender page (4 questions + results)

URL contract additive: `/quiz/switch` is a permanent new URL. No sub-routes at this phase. No `/quiz` index (only one quiz — add the index when a second quiz ships).

## Content / data reads

| Helper | Source | Use |
|---|---|---|
| `getAllSwitches()` | `apps/web/src/lib/data-runtime/index.ts` | Full catalog for scoring |

No new loaders needed.

## New modules

### `apps/web/src/lib/quiz/recommendSwitch.ts`

Pure, side-effect-free scoring function:

```ts
export type QuizAnswers = {
  soundProfile: 'thocky' | 'crisp' | 'silent' | 'neutral'
  actuationFeel: 'smooth' | 'tactile'
  springWeight: 'light' | 'medium' | 'heavy'
  primaryUse: 'gaming' | 'typing' | 'office'
}

export type ScoredSwitch = { switch: Switch; score: number }

export function recommendSwitch(
  answers: QuizAnswers,
  catalog: Switch[],
): ScoredSwitch[]   // top-3, desc by score; ties broken alphabetically by slug
```

**Scoring weights (additive integers):**

`soundProfile`:
- `thocky`: type==='linear' +4, housingTop==='pc' +2, housingBottom==='nylon' +2, stem==='pom' +2
- `crisp`: type.startsWith('linear') +4, housingTop==='nylon' +3, housingBottom==='nylon' +3
- `silent`: type==='silent-linear' +10
- `neutral`: +0 all

`actuationFeel`:
- `smooth`: type.startsWith('linear') +8
- `tactile`: type==='tactile' +8

`springWeight` (against `springGrams.actuation`):
- `light` (≤45g): ≤45 → +8, ≤55 → +4, else +0
- `medium` (46–59g): 46–59 → +8, ≤65 → +4, else +0
- `heavy` (≥60g): ≥60 → +8, ≥55 → +4, else +0

`primaryUse`:
- `gaming`: type.startsWith('linear') +4, springGrams.actuation≤50 +3
- `typing`: type==='tactile' +6, type.startsWith('linear') +2
- `office`: type==='silent-linear' +8, type==='linear' +2, type==='tactile' +1

Return: all scored switches sorted descending; slice to top 3. Empty catalog → [].

### `apps/web/src/lib/quiz/__tests__/recommendSwitch.test.ts`

- Test A: heavy tactile answers → tactile switch with high spring in top-3
- Test B: silent + office answers → cherry-mx2a-silent-black in first position
- Test C: smooth + gaming + light answers → linear, ≤50g switch in top-3
- Test D: empty catalog → returns []
- Test E: result count ≤ 3 even with 8 switches

## Components

### `apps/web/src/components/quiz/SwitchQuiz.tsx`

`"use client"` — manages all interactive state (answers, step, results).

Renders:
1. `<QuizProgress>` — passive step counter ("Question 2 of 4")
2. `<QuizStep>` — current question + options (auto-advances on selection)
3. `<ResultCard[]>` — shown after all 4 answers; receives top-3 from `recommendSwitch()`
4. "Start over" button in results state

Accepts `switches: Switch[]` as prop (passed from the server page).

### `apps/web/src/components/quiz/QuizStep.tsx`

Props: `question: string, options: QuizOption[], selected: string | null, onSelect: (value: string) => void`.

`QuizOption = { value: string; label: string; description: string }`.

Renders: H2 question + a list of radio-styled buttons (large, full-width touch target). Clicking an option calls `onSelect` immediately (auto-advance, no separate "Next" button). Keyboard: Enter/Space on focused option triggers selection (native `<button>` handles this).

No ARIA role juggling — each option is a `<button>`. Focus moves to the first option of the next question on auto-advance (via `useEffect` + `ref`).

### `apps/web/src/components/quiz/QuizProgress.tsx`

Props: `current: number, total: number`. Renders "Question N of M" plus a simple fill bar (`w-[N/M * 100%]` clamped). Passive display, no interaction.

### `apps/web/src/components/quiz/ResultCard.tsx`

Props: `sw: Switch, score: number, maxScore: number, rank: number`.

Renders:
- Rank badge (1 / 2 / 3)
- Switch name (linked to `/part/switch/[slug]`)
- Type badge (Linear / Silent Linear / Tactile)
- Match bar: `(score / maxScore * 100)%` fill in accent color
- One-line description excerpt (first 80 chars)

### `apps/web/src/components/quiz/__tests__/`

- `QuizStep.test.tsx`: renders question + all options, calls onSelect on click, selected option has `aria-pressed="true"`.
- `ResultCard.test.tsx`: renders name, link href, type badge, score bar.
- `QuizProgress.test.tsx`: renders correct "N of M" text.

## Page structure

`apps/web/src/app/quiz/switch/page.tsx` — **server component**:

```tsx
import { buildMetadata, JsonLd, buildJsonLd, canonicalUrl } from '@thock/seo'
import { getAllSwitches } from '@/lib/data-runtime'
import { SwitchQuiz } from '@/components/quiz/SwitchQuiz'
import { Container } from '@thock/ui'

export const metadata = buildMetadata({
  title: 'Find your switch',
  description: 'Answer 4 questions and find your ideal mechanical keyboard switch.',
  path: '/quiz/switch',
})

export default function QuizSwitchPage() {
  const switches = getAllSwitches()
  return (
    <main id="main">
      <Container>
        <JsonLd data={buildJsonLd({ type: 'WebApplication', path: '/quiz/switch' })} />
        <SwitchQuiz switches={switches} />
      </Container>
    </main>
  )
}
```

`apps/web/src/app/quiz/switch/loading.tsx` — skeleton with `<main id="main">`:

```tsx
export default function QuizSwitchLoading() {
  return (
    <main id="main">
      <Container>
        <div className="animate-pulse py-16 space-y-6 max-w-2xl mx-auto">
          <div className="h-3 bg-surface rounded w-1/4" />
          <div className="h-8 bg-surface rounded w-3/4" />
          <div className="space-y-3">
            {[0,1,2,3].map(i => <div key={i} className="h-16 bg-surface rounded" />)}
          </div>
        </div>
      </Container>
    </main>
  )
}
```

## SEO

`generateMetadata` in `page.tsx`:
```ts
{
  title: 'Find your switch — thock',
  description: 'Answer 4 questions and find your ideal mechanical keyboard switch.',
  canonical: 'https://thock.xyz/quiz/switch',
}
```

JSON-LD: `WebApplication` type:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "thock switch recommender",
  "description": "A 4-question quiz that finds your ideal mechanical keyboard switch.",
  "url": "https://thock.xyz/quiz/switch",
  "applicationCategory": "UtilityApplication"
}
```

Note: `buildJsonLd` in `@thock/seo` currently handles `Article`, `WebSite`, `CollectionPage`, `BreadcrumbList`, `ItemList`. Add `WebApplication` support with `type: 'WebApplication'` branch, or inline the JSON-LD object directly via `<script type="application/ld+json">` in `JsonLd`.

Decision: inline the JSON-LD object directly rather than extending `buildJsonLd` — the quiz is the only WebApplication on the site and extending the SEO package for one call adds schema bloat. Pass the raw object to `<JsonLd>`.

## Cross-link / entry point

One "Find your switch →" affordance on the home page (`/`). Place it as a compact one-line CTA after the trending section and before the group-buys widget. Render as a styled `<Link>` inside a slim `<div>` — no structural change to the home page sections.

No nav change. No pillar page change. This is the only entry point at this phase.

## Sitemap

Add to `apps/web/src/app/sitemap.ts` static entries:
```ts
{ url: canonicalUrl('/quiz/switch'), lastModified: now, priority: 0.7 },
```

## `canonical-urls` fixture

Add to `apps/web/src/fixtures/canonical-urls.ts` STATIC array:
```ts
{ path: '/quiz/switch', pattern: '/quiz/switch', kind: 'html' },
```

## `page-reads` fixture

Add entry for `/quiz/switch`:
```ts
'/quiz/switch': { h1: true, footer: true, noConsoleErrors: true, noHorizontalScroll: true }
```

## E2E — `apps/e2e/tests/quiz.spec.ts`

```
1. Visit /quiz/switch → 200, H1 present
2. Assert QuizProgress renders "Question 1 of 4"
3. Click the first option → assert question advances to 2
4. Complete all 4 questions by clicking first option each time
5. Assert ResultCard renders ≥1 link matching /part/switch/[slug]
6. Assert JSON-LD type === "WebApplication"
7. At 375px: no horizontal scroll, H1 visible (mobile spec)
```

No mobile spec file — embed the 375px check in `quiz.spec.ts` as a second describe block (same pattern as smoke.spec.ts) or colocate in `apps/e2e/tests/mobile/quiz.mobile.spec.ts`. Decision: colocate as separate mobile spec per the phase-4 pattern for cleanliness.

## Decisions made upfront — DO NOT ASK

1. **4 questions, not 5.** Budget dropped — all 8 current switches are consumer tier (no meaningful price discrimination). Future budget question can be a follow-up phase when more data records exist.

2. **Auto-advance on option click.** No separate "Next" button. Faster UX; appropriate for 4 short questions.

3. **Always show top 3.** No "no results" state needed — scoring always produces a ranking (all-zeros tie broken alphabetically).

4. **Server component + client sub-component pattern.** `page.tsx` is the server component (metadata, data fetch, `<main id="main">`); `<SwitchQuiz>` is `"use client"` (state machine). This avoids the `generateMetadata` + client component conflict in Next.js App Router.

5. **`buildJsonLd` not extended.** Raw JSON-LD object passed directly to `<JsonLd>`. No SEO package surgery for one route.

6. **No `/quiz` index page.** Add when a second quiz ships.

7. **Entry point on home page only.** One compact CTA line after the trending section. No nav change, no pillar page change.

8. **`design/page-quiz.jsx` empty / missing.** This is a new interactive surface not in the original design export. Implementation from bearings + spec + canonical sibling pattern.

9. **`QuizStep` option = `<button>` not `<input type="radio">`.** Buttons are simpler to style to the thock aesthetic (full-width touch target) while maintaining full keyboard accessibility (Enter/Space). `aria-pressed` on selected option.

## Mobile reflow

- All quiz content in a single column, max-w-2xl, centered
- Option buttons full-width on all viewports
- Progress bar below the question H2 on mobile (above on desktop if wider)
- ResultCard stacks vertically on mobile; match bar stays readable at 375px
- No horizontal overflow — verified by the 375px e2e spec

## Pages × tests matrix

| Surface | Unit | E2E | Mobile E2E |
|---|---|---|---|
| `recommendSwitch.ts` | 5 tests | — | — |
| `QuizStep.tsx` | 3 tests | — | — |
| `ResultCard.tsx` | 2 tests | — | — |
| `QuizProgress.tsx` | 1 test | — | — |
| `/quiz/switch` | — | 6 assertions | 2 assertions |

## Verify gate

```bash
pnpm verify
# typecheck → test:run → data:validate → build → e2e
```

`data:validate` is unaffected (no new JSON records). `e2e` smoke walker auto-covers `/quiz/switch` once canonical-urls is updated.

## Commit body template

```
feat: switch recommender quiz — phase 33

- /quiz/switch: 4-question interactive quiz over getAllSwitches()
- recommendSwitch.ts: pure weighted-score helper, top-3 output
- SwitchQuiz client component manages step state + results
- QuizStep, ResultCard, QuizProgress components (+ unit tests)
- WebApplication JSON-LD; sitemap + canonical-urls updated
- Home page gains a "Find your switch →" CTA after trending section
- apps/e2e/tests/quiz.spec.ts: 6 desktop + 2 mobile assertions

Decisions:
- 4 questions (budget dropped — no price discrimination in 8-switch catalog)
- Auto-advance on option click (no Next button)
- Server page + "use client" SwitchQuiz sub-component (Next.js App Router pattern)
- Raw JSON-LD object passed to <JsonLd> (no buildJsonLd extension for single route)

Closes #<phase-issue>
```

## DoD

- `[ ]` `/quiz/switch` renders with H1, 4 questions, top-3 result links
- `[ ]` `recommendSwitch` unit tests pass (5 tests)
- `[ ]` Component unit tests pass (6 tests)
- `[ ]` `pnpm verify` green (typecheck + unit + data:validate + build + e2e)
- `[ ]` Deploy green (pnpm deploy:check + pnpm deploy:smoke)
- `[ ]` `plan/steps/01_build_plan.md` phase 33 ticked `[x]`

## Follow-ups (out of scope)

- `/quiz` index listing all recommenders (add when second quiz ships)
- "Save my result" / share link (requires state persistence — out of scope)
- Clicky switch questions (add when clicky switches exist in the catalog)
- Budget question (add when price data is in the switch schema)
- OG image for `/quiz/switch` (ship-asset drain)
