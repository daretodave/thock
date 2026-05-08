# design/ — INDEX

> Map of what's in this folder. The autonomous loop reads flat
> `design/*.jsx` files keyed by name. Subfolders are not used.
> Re-exporting from claude design overwrites these in place; this
> INDEX stays stable.

## Authoritative references (read first)

| File | What it is | When to read |
|---|---|---|
| `tokens.css` | Final design tokens — palette (OKLCH), typography, spacing, type ramp | **Phase 1.** Adopt as `packages/tokens/src/tokens.css` verbatim (rename `--kh-*` → `--thock-*` or keep — your call; the loop renames). |
| `decisions.jsx` | The design team's own AI-facing brief — SETTLED, PUSHED BACK, OPEN QUESTIONS | **Every phase.** Cross-check against `plan/bearings.md`; `decisions.jsx` wins on conflicts. |
| `brand.jsx` | Wordmark exploration, palette swatches, type families | Phase 1 (wordmark + tokens). |

## Page-family references

Each maps to a phase brief. The canonical sibling for page-family
phases is the article (phase 5).

| File | Family | Phase | Notes |
|---|---|---|---|
| `page-article.jsx` | article | 5 | Canonical template — every later page family mirrors its structural pattern. |
| `page-home.jsx` | home | 6 | Hero pick, trending, latest-by-pillar, group-buys widget. |
| `page-pillar.jsx` | pillar landings | 7–11 | Used as the template for News, Trends, Ideas, Deep Dives, Guides. |
| `page-trends-tracker.jsx` | trends-tracker | 8 | Signature feature — table over chart, sparkline supports. |
| `page-mobile.jsx` | (cross-cutting) | 16 | Mobile reflow patterns; reference for every page family's mobile spec. |
| `page-tag.jsx` | tag pages | 12 | **Empty** — design not yet exported. Phase 12 ships from sibling + bearings. |
| `page-group-buys.jsx` | group buys | 13 | **Empty** — same. |
| `page-empty-states.jsx` | (cross-cutting) | 16 | **Empty** — same. |

## Component / atom references

| File | Use during |
|---|---|
| `atoms.jsx` | Phase 5+ when building `<TagChip>`, `<ArticleCard>`, `<Mono>`, `<Byline>`, etc. |
| `primitives.jsx` | Phase 8 (`<Sparkline>`, `<TrendDirectionGlyph>`) and any chart-adjacent surface. |
| `primitives-showcase.jsx` | Visual reference of every primitive in one canvas — useful when the implementation drifts. |

## Scaffold / canvas (do not ship as production code)

| File | Purpose |
|---|---|
| `app.jsx`, `index.html`, `design-canvas.jsx` | Entry points for previewing the design exports in a browser. Reference only — production app code lives in `apps/web/`. |

## Reading conventions

- Files are JSX-with-inline-styles (CSS variable refs like
  `var(--kh-bg)`). Treat them as **structural reference**, not
  drop-in code. The agent extracts component composition,
  hierarchy, and copy; styling moves to Tailwind utility classes
  reading from `packages/tokens` (which derives from `tokens.css`).
- The export uses `--kh-*` (Keyboard Hub) variable names from
  before the project was renamed. The agent translates to
  `--thock-*` when adopting tokens.css into `packages/tokens/`.
  This is purely cosmetic; the design intent is unchanged.

## Empty files

`page-tag.jsx`, `page-group-buys.jsx`, `page-empty-states.jsx`
are 0 bytes. The corresponding phases (12, 13, 16) ship from the
canonical sibling + bearings, and a follow-up commit can integrate
the design when it's re-exported. No need to wait.

## Adding new families

If a new page family appears in the build plan and the design
needs to be re-exported, claude design produces a new
`page-<family>.jsx` at this directory. Append a row to the table
above; no other changes needed.
