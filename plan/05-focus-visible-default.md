# 05 — Sitewide focus-visible default + coverage check

> Every interactive element gets a visible keyboard focus ring by
> default, and a mechanical check keeps it that way, ending a
> 12-fix run of one-component-at-a-time repairs.

## Why

The same defect (an interactive element with no keyboard focus
indicator) has been fixed 12 separate times, component by
component, each fix claiming to be the last; the next sweep always
found more (`cd3c85d6`, `94614c58`, `c2b889a5`, `5dc7ac8a`,
`bfb2c833` and earlier). Keyboard users hit it immediately.
Candidate `[6.5]` (proposed 2026-07-22, expand pass 210), promoted
via `/oversight` 2026-11-01.

## Design

- A global `:focus-visible` default in the base layer
  (`apps/web/src/styles/components.css` or `globals.css`): a ring
  in the accent token with an offset, applied to `a`, `button`,
  `input`, `select`, `textarea`, `summary` and `[tabindex]`.
  Components that already define their own ring keep it; per-
  component ring classes identical to the default may be removed.
- Check: an e2e test that tabs through a representative set of
  routes (home, article, pillar, tag, part, compare, quiz,
  group-buys, search) and asserts every focused element has a
  visible outline or box-shadow with at least 3:1 contrast against
  its background.

### Decisions made upfront (do not ask)

- The ring uses existing tokens; no new colors.
- `:focus-visible` only, never `:focus`, so mouse clicks stay quiet.

## Acceptance

- **A1** The global default exists and every interactive element on
  the sampled routes shows a visible focus indicator.
- **A2** The tab-walk e2e check runs in the verify gate (desktop and
  mobile) and fails on any element without one.
- **A3** No visual change for mouse users (no ring on click).

## Open questions

None.

## Chunks

Measure: 3 open · 0 closed · next A4

Not chunked yet.
