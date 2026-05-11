# Phase 26 — Accessibility audit pass (Phase A: discovery walker)

> **Status:** pending → shipping
> **Issue:** #58
> **Promoted:** 2026-05-11 via `/oversight` (score 6.5, pass-1 candidate)

## Outcome

Ship a playwright-axe discovery walker that audits every canonical URL for
WCAG 2.1 AA violations; fix the one known open violation (skip-to-main-content
link); file any remaining violations as `[a11y]` rows in `plan/AUDIT.md` for
subsequent `/iterate` Phase B drain.

## Why

The hand-audit (AUDIT.md resolved row, 2026-05-10) walked 8 pages manually
and found 2 findings — the heading-level skip was fixed at `f70b1f3`, the
skip-to-main-content link was filed as [LOW] but not yet shipped. An automated
axe runner provides:
- Permanent regression guard so future phases can't reintroduce a11y regressions
- Color-contrast and ARIA-role checking the hand checklist couldn't reach without
  a real browser
- A discoverable Phase B backlog: [a11y] rows in AUDIT.md that `/iterate` drains

## Path lock (decided at brief time)

**playwright-axe** (`@axe-core/playwright`). Rationale:
- Playwright is already wired into `pnpm verify` — no new test runner
- `@axe-core/playwright` is the only new devDep (<2 MB)
- Runs in the same e2e suite, same CI worker, same webServer boot

## Scope

### A1 — Skip-to-main-content link (drains open AUDIT.md [LOW] row)

- `apps/web/src/app/layout.tsx` — add visually-hidden-until-focused skip link
  as first child of `<body>`, targeting `#main`
- `apps/web/src/app/globals.css` — `.skip-link` CSS: `sr-only` normally,
  revealed on focus with position + bg + border
- All `page.tsx`, `loading.tsx`, `not-found.tsx` files with `<main>` — add
  `id="main"` so the skip link target resolves

### A2 — playwright-axe spec

- `apps/e2e/tests/a11y.spec.ts` — runs `@axe-core/playwright` with
  `wcag2a` + `wcag2aa` + `wcag21aa` tags on 7 canonical pages at desktop
  and 3 at mobile
- Spec fails on `critical` and `serious` violations; logs `moderate` and
  `minor` violations to stdout without failing (Phase A is a discovery pass —
  Phase B iterate ticks add hard assertions as each finding drains)
- Heading-level e2e from `trends.spec.ts` stays as the existing guard for that
  specific finding

### A3 — AUDIT.md update

- Mark the [LOW] skip-link row as `[x]` (resolved by this commit)
- Add one `[a11y]` row per `serious`/`moderate` violation axe finds that isn't
  already in AUDIT.md, with impact/ease scoring

## Files touched

```
apps/e2e/package.json                          + @axe-core/playwright devDep
apps/e2e/tests/a11y.spec.ts                    NEW — axe runner
apps/web/src/app/layout.tsx                    + skip link
apps/web/src/app/globals.css                   + .skip-link CSS
apps/web/src/app/page.tsx                      id="main" on <main>
apps/web/src/app/*/page.tsx (16 total)         id="main" on <main>
apps/web/src/app/*/loading.tsx (12 total)      id="main" on <main>
apps/web/src/app/*/not-found.tsx (5 total)     id="main" on <main>
plan/AUDIT.md                                  drain skip-link + new [a11y] rows
plan/steps/01_build_plan.md                    [x] Phase 26
```

## Decisions

- **Fail only on critical + serious**: Phase A is discovery. `moderate` and
  `minor` violations go to AUDIT.md. Serious violations include color-contrast
  failures, which may surface; if they do, handle inline. Critical violations
  (missing alt, empty buttons) are hard-fail immediately.
- **`id="main"` on all `<main>` elements**: The skip link `href="#main"` must
  resolve. Phase 22 moved `<main>` per-route; adding `id="main"` everywhere is
  the minimal fix — no Phase 22 assertions break because `body > main` still
  holds.
- **CSS approach for skip link**: Tailwind `sr-only` via a global `.skip-link`
  class in `globals.css` with a `focus:not-sr-only` override, ensuring the link
  is visible only on keyboard focus and invisible otherwise.

## Phase B (not a phase row)

Subsequent `/iterate` ticks drain each `[a11y]` row filed by this phase.
The axe spec gains one hard assertion per drained finding, building the
regression guard incrementally.
