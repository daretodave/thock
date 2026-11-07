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

- **A2** The tab-walk e2e check runs in the verify gate (desktop and
  mobile) and fails on any element without one.

## Open questions

None.

## Chunks

Measure: 1 open · 2 closed · next A4

- [ ] **05.2** Tab-walk e2e coverage check · M · closes A2 · needs —
  - New `apps/e2e/tests/focus-visible.spec.ts`, desktop + mobile
    (mirroring `a11y.spec.ts`'s per-route describe shape): for
    each of home, article, pillar, tag, part, compare, quiz,
    group-buys, search (one concrete slug per dynamic route, e.g.
    `/article/gateron-oil-king-deep-dive`, `/tag/linear`,
    `/part/switch/gateron-oil-king`,
    `/compare/switch?a=akko-v3-cream-blue-pro&b=c3-tangerine-r2`),
    press Tab repeatedly (bounded iteration, not `until wrap`) and
    read `document.activeElement`'s computed `outline`/
    `box-shadow` via `page.evaluate`, asserting every stop has a
    non-`none` outline or box-shadow with ≥3:1 contrast against
    its background (port the luminance/contrast math from
    `packages/tokens/__tests__/contrast.test.ts` rather than
    re-deriving it).
  - Wire the new spec file into `pnpm verify`'s e2e leg (it already
    runs `apps/e2e`'s full suite against `next start :4173`; no
    config change expected beyond the new file existing under
    `apps/e2e/tests/`).
  - If 05.1's chosen token fails the ≥3:1 check on either theme for
    any route, that's this chunk's signal to go back and adjust
    05.1's token/offset — fix forward in this chunk rather than
    filing a follow-up, since the two chunks ship in the same
    session.
