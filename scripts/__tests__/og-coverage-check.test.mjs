// scripts/__tests__/og-coverage-check.test.mjs
//
// Unit tests for scripts/og-coverage-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../og-coverage-check.mjs'

const { findGaps, toRouteLabel, alreadyFiled, formatAuditRow, EXCLUDED_SEGMENTS } = __test

const APP_DIR = '/fake/app'

// ── findGaps ──────────────────────────────────────────────────────────────────

describe('findGaps — gap detection', () => {
  test('returns empty when all routes have OG handlers', () => {
    const routeDirs = [
      '/fake/app',
      '/fake/app/about',
      '/fake/app/article/[slug]',
    ]
    const ogDirs = [
      '/fake/app',
      '/fake/app/about',
      '/fake/app/article/[slug]',
    ]
    assert.deepEqual(findGaps(routeDirs, ogDirs), [])
  })

  test('returns gap when a route lacks OG handler', () => {
    const routeDirs = ['/fake/app/about', '/fake/app/new-route']
    const ogDirs = ['/fake/app/about'] // new-route is missing
    const gaps = findGaps(routeDirs, ogDirs)
    assert.deepEqual(gaps, ['/fake/app/new-route'])
  })

  test('returns all gaps when multiple routes lack OG handlers', () => {
    const routeDirs = ['/fake/app/a', '/fake/app/b', '/fake/app/c']
    const ogDirs = ['/fake/app/b']
    const gaps = findGaps(routeDirs, ogDirs)
    assert.deepEqual(gaps, ['/fake/app/a', '/fake/app/c'])
  })

  test('returns empty when routeDirs is empty', () => {
    assert.deepEqual(findGaps([], ['/fake/app/about']), [])
  })
})

// ── toRouteLabel ──────────────────────────────────────────────────────────────

describe('toRouteLabel — route labelling', () => {
  test('converts root app dir to /', () => {
    assert.equal(toRouteLabel(APP_DIR, APP_DIR), '/')
  })

  test('converts subdirectory to route path', () => {
    assert.equal(toRouteLabel(`${APP_DIR}/about`, APP_DIR), '/about')
  })

  test('converts dynamic segment directory correctly', () => {
    assert.equal(toRouteLabel(`${APP_DIR}/article/[slug]`, APP_DIR), '/article/[slug]')
  })

  test('converts nested route correctly', () => {
    assert.equal(
      toRouteLabel(`${APP_DIR}/trends/tracker/[week]`, APP_DIR),
      '/trends/tracker/[week]',
    )
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled — deduplication', () => {
  test('returns true when pending row exists for route', () => {
    const audit = `### [ ] [seo] [4.8] /new-route missing opengraph-image.tsx
- category: seo
- filed: 2026-06-21 by og-coverage-check.mjs — /new-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), true)
  })

  test('returns false when no row exists for route', () => {
    const audit = `### [ ] [seo] [4.8] /other-route missing opengraph-image.tsx
- filed: 2026-06-21 by og-coverage-check.mjs — /other-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), false)
  })

  test('returns false when row is already completed ([x])', () => {
    const audit = `### [x] [seo] [4.8] /new-route missing opengraph-image.tsx
- filed: 2026-06-21 by og-coverage-check.mjs — /new-route
`
    assert.equal(alreadyFiled(audit, '/new-route'), false)
  })

  test('returns false on empty AUDIT.md content', () => {
    assert.equal(alreadyFiled('', '/about'), false)
  })
})

// ── EXCLUDED_SEGMENTS ────────────────────────────────────────────────────────

describe('EXCLUDED_SEGMENTS — API and utility exclusions', () => {
  test('contains api segment', () => {
    assert.ok(EXCLUDED_SEGMENTS.has('api'))
  })

  test('does not exclude legitimate page route segments', () => {
    assert.ok(!EXCLUDED_SEGMENTS.has('about'))
    assert.ok(!EXCLUDED_SEGMENTS.has('tools'))
    assert.ok(!EXCLUDED_SEGMENTS.has('quiz'))
  })
})
