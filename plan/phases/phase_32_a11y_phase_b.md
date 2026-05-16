# Phase 32 — A11y Phase B: systematic completion

> **Generated on-demand by /ship-a-phase (cloud run 2026-05-16)**

## Outcome

A11y Phase B closes the remaining WCAG 1.4.3 surface (one `text-text-3` on the
header search button), consolidates the 13-instance inline kicker pattern into a
reusable `<PageSectionKicker>` component so future routes cannot copy the bad
class, and upgrades `apps/e2e/tests/a11y.spec.ts` from Phase A (critical-only
hard gate) to Phase B (hard-fail on serious violations too).

The iterate drip that ran between phase 31 and this phase already drained all 25
`text-text-3` audit rows. Phase 32 ships the structural changes that make the
drain permanent:

1. **`<PageSectionKicker>`** — shared component, always `text-text-2`. Single
   canonical class string, one test, one place to change if tokens change.
2. **13 inline span replacements** — every `data-testid="page-section-kicker"` span
   in route `page.tsx` files replaced with `<PageSectionKicker>`.
3. **Header.tsx fix** — last remaining `text-text-3` (search icon button).
4. **Phase B axe gate** — `runAxe()` upgraded to hard-fail on serious violations,
   not just critical. Safe now that all serious rows are `[x]` in AUDIT.md.

## Why

The iterate drip closed 25 individual audit rows across 21 commits. Phase 32
prevents the 26th by removing the copy-paste vector: when a new route page is
added, the developer (or loop) now imports `<PageSectionKicker>` instead of
hand-copying a 5-class span. The Phase B gate catches any future regression.

## Scope

### Files to create
- `apps/web/src/components/ui/PageSectionKicker.tsx`
- `apps/web/src/components/ui/__tests__/PageSectionKicker.test.tsx`

### Files to modify (inline span → component)
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/news/page.tsx`
- `apps/web/src/app/trends/page.tsx`
- `apps/web/src/app/ideas/page.tsx`
- `apps/web/src/app/deep-dives/page.tsx`
- `apps/web/src/app/guides/page.tsx`
- `apps/web/src/app/group-buys/page.tsx`
- `apps/web/src/app/group-buys/past/page.tsx`
- `apps/web/src/app/tag/[slug]/page.tsx`
- `apps/web/src/app/trends/tracker/page.tsx` (2 instances)
- `apps/web/src/app/trends/tracker/[week]/page.tsx`
- `apps/web/src/app/trends/tracker/[week]/not-found.tsx`

### Files to modify (text-text-3 fix)
- `apps/web/src/components/ui/Header.tsx` — search icon button `text-text-3 → text-text-2`

### Files to modify (Phase B gate upgrade)
- `apps/e2e/tests/a11y.spec.ts` — `runAxe()` hard-fails on `serious` violations
  in addition to `critical`. Comment at top updated from "Phase A" to "Phase B".

## Component spec

```tsx
// apps/web/src/components/ui/PageSectionKicker.tsx
interface Props {
  children: React.ReactNode
  testId?: string   // defaults to "page-section-kicker"
  className?: string  // allows surface-specific override if ever needed
}
```

Class string: `font-mono uppercase tracking-[0.12em] text-micro text-text-2`

The `data-testid` is always set (defaults to `"page-section-kicker"`) so existing
axe regression guards in the a11y spec don't need to change.

## Phase B gate spec

`runAxe()` changes from:
```ts
const critical = violations.filter(v => v.impact === 'critical')
if (critical.length > 0) throw new Error(...)
```
to:
```ts
const critical = violations.filter(v => v.impact === 'critical')
const serious = violations.filter(v => v.impact === 'serious')
const hard = [...critical, ...serious]
if (hard.length > 0) throw new Error(...)
```

The `console.warn` for non-critical moves to moderate + minor only.

## Test requirements

- Unit test for `<PageSectionKicker>`:
  - renders children
  - has `data-testid="page-section-kicker"` by default
  - accepts custom `testId`
  - has `text-text-2` class (WCAG AA regression guard)
  - does NOT have `text-text-3` class

- No new e2e tests needed: existing `page-section-kicker` axe guard in
  `a11y.spec.ts` covers the component via the upgraded Phase B gate.

## Verify gate

Single `pnpm verify` green run. The Phase B upgrade means the axe suite now
hard-fails on any new serious violations introduced during build — if any exist,
they must be fixed before the phase can ship.
