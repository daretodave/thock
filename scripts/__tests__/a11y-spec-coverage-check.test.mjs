// scripts/__tests__/a11y-spec-coverage-check.test.mjs
//
// Unit tests for scripts/a11y-spec-coverage-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../a11y-spec-coverage-check.mjs'

const { parseStaticHtmlRoutes, splitA11ySections, findGaps, alreadyFiled, formatAuditRow } =
  __test

// ── parseStaticHtmlRoutes ────────────────────────────────────────────────────

describe('parseStaticHtmlRoutes — STATIC array extraction', () => {
  test('extracts only html-kind paths, skipping xml/text', () => {
    const src = `
const STATIC: CanonicalUrl[] = [
  { path: '/', pattern: '/', kind: 'html' },
  { path: '/about', pattern: '/about', kind: 'html' },
  { path: '/sitemap.xml', pattern: '/sitemap.xml', kind: 'xml' },
  { path: '/robots.txt', pattern: '/robots.txt', kind: 'text' },
]
`
    assert.deepEqual(parseStaticHtmlRoutes(src), ['/', '/about'])
  })

  test('returns empty array when STATIC block is absent', () => {
    assert.deepEqual(parseStaticHtmlRoutes('export const x = 1'), [])
  })
})

// ── splitA11ySections ─────────────────────────────────────────────────────────

describe('splitA11ySections — desktop/mobile split', () => {
  test('splits at the mobile describe marker', () => {
    const src = `desktop stuff\ntest.describe('a11y — mobile (375px)', () => {\nmobile stuff\n})`
    const { desktop, mobile } = splitA11ySections(src)
    assert.ok(desktop.includes('desktop stuff'))
    assert.ok(!desktop.includes('mobile stuff'))
    assert.ok(mobile.includes('mobile stuff'))
  })

  test('treats entire source as desktop when marker is absent', () => {
    const { desktop, mobile } = splitA11ySections('no marker here')
    assert.equal(desktop, 'no marker here')
    assert.equal(mobile, '')
  })
})

// ── findGaps ──────────────────────────────────────────────────────────────────

describe('findGaps — gap detection', () => {
  test('covered-route passes — present in both suites, no gap', () => {
    const desktop = `runAxe(page, '/about')`
    const mobile = `runAxe(page, '/about')`
    assert.deepEqual(findGaps(['/about'], desktop, mobile), [])
  })

  test('gap-route flagged — missing from both suites', () => {
    const gaps = findGaps(['/new-route'], '', '')
    assert.deepEqual(gaps, [
      { route: '/new-route', missingDesktop: true, missingMobile: true },
    ])
  })

  test('mobile-gap flagged — present in desktop only', () => {
    const desktop = `runAxe(page, '/tools')`
    const gaps = findGaps(['/tools'], desktop, '')
    assert.deepEqual(gaps, [
      { route: '/tools', missingDesktop: false, missingMobile: true },
    ])
  })

  test('desktop-gap flagged — present in mobile only', () => {
    const mobile = `runAxe(page, '/tools')`
    const gaps = findGaps(['/tools'], '', mobile)
    assert.deepEqual(gaps, [
      { route: '/tools', missingDesktop: true, missingMobile: false },
    ])
  })

  test('does not false-positive on prefix collisions', () => {
    const desktop = `runAxe(page, '/trends/tracker')`
    const mobile = `runAxe(page, '/trends/tracker')`
    // '/trends' is a prefix of '/trends/tracker' but is a distinct route —
    // quote-delimited matching must not treat the longer string as covering it.
    const gaps = findGaps(['/trends'], desktop, mobile)
    assert.deepEqual(gaps, [
      { route: '/trends', missingDesktop: true, missingMobile: true },
    ])
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled — deduplication', () => {
  test('returns true when pending row exists for route', () => {
    const audit = `### [ ] [tests] [3.2] /new-route missing from both desktop and mobile suites in apps/e2e/tests/a11y.spec.ts
- filed: 2026-07-05 by a11y-spec-coverage-check.mjs — /new-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), true)
  })

  test('returns false when no row exists for route', () => {
    const audit = `### [ ] [tests] [3.2] /other-route missing from both desktop and mobile suites in apps/e2e/tests/a11y.spec.ts
- filed: 2026-07-05 by a11y-spec-coverage-check.mjs — /other-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), false)
  })

  test('returns false when row is already completed ([x])', () => {
    const audit = `### [x] [tests] [3.2] /new-route missing from both desktop and mobile suites in apps/e2e/tests/a11y.spec.ts
- filed: 2026-07-05 by a11y-spec-coverage-check.mjs — /new-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), false)
  })

  test('returns false on empty AUDIT.md content', () => {
    assert.equal(alreadyFiled('', '/about'), false)
  })
})

// ── formatAuditRow ────────────────────────────────────────────────────────────

describe('formatAuditRow — row shape', () => {
  test('includes route, score, and category', () => {
    const row = formatAuditRow(
      { route: '/new-route', missingDesktop: true, missingMobile: true },
      new Date('2026-07-05T00:00:00.000Z'),
    )
    assert.ok(row.includes('[tests] [3.2] /new-route'))
    assert.ok(row.includes('category: tests'))
    assert.ok(row.includes('a11y-spec-coverage-check.mjs — /new-route'))
  })
})
