// scripts/__tests__/newsletter-gap-survey.test.mjs
//
// Unit tests for scripts/newsletter-gap-survey.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../newsletter-gap-survey.mjs'

const { surveyNewsletter, extractFrontmatter, alreadyFiled, GAP_DAYS } = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString()
}

function makeNewsletter(issue, publishedAt) {
  return { slug: `thock-weekly-${String(issue).padStart(3, '0')}`, publishedAt, issue }
}

function today() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}

// ── surveyNewsletter — gap detected ──────────────────────────────────────────

describe('surveyNewsletter — gap detected', () => {
  test('returns gap when last issue is exactly 7 days old', () => {
    const newsletters = [makeNewsletter(1, daysAgo(7))]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'gap')
    assert.equal(result.daysSince, 7)
    assert.equal(result.nextIssue, 2)
  })

  test('returns gap when last issue is 10 days old', () => {
    const newsletters = [makeNewsletter(1, daysAgo(10))]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'gap')
    assert.equal(result.daysSince, 10)
  })

  test('returns gap when no newsletters exist', () => {
    const result = surveyNewsletter([], today())
    assert.equal(result.status, 'gap')
    assert.equal(result.daysSince, null)
    assert.equal(result.nextIssue, 1)
    assert.equal(result.lastSlug, null)
  })

  test('nextIssue increments correctly when multiple newsletters exist', () => {
    const newsletters = [
      makeNewsletter(1, daysAgo(14)),
      makeNewsletter(2, daysAgo(8)),
    ]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'gap')
    assert.equal(result.nextIssue, 3)
    assert.equal(result.lastIssue, 2)
  })
})

// ── surveyNewsletter — current ────────────────────────────────────────────────

describe('surveyNewsletter — current', () => {
  test('returns current when last issue is 0 days old', () => {
    const newsletters = [makeNewsletter(1, daysAgo(0))]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'current')
    assert.equal(result.daysSince, 0)
  })

  test('returns current when last issue is 6 days old', () => {
    const newsletters = [makeNewsletter(1, daysAgo(6))]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'current')
    assert.equal(result.daysSince, 6)
  })

  test('threshold is exactly GAP_DAYS', () => {
    assert.equal(GAP_DAYS, 7)
    const newsletters = [makeNewsletter(1, daysAgo(GAP_DAYS - 1))]
    const result = surveyNewsletter(newsletters, today())
    assert.equal(result.status, 'current')
  })
})

// ── extractFrontmatter ────────────────────────────────────────────────────────

describe('extractFrontmatter', () => {
  test('extracts publishedAt, slug, and issue from valid frontmatter', () => {
    const content = `---
slug: thock-weekly-001
issue: 1
publishedAt: '2026-06-16T09:00:00.000Z'
---
body`
    const fm = extractFrontmatter(content)
    assert.ok(fm)
    assert.equal(fm.slug, 'thock-weekly-001')
    assert.equal(fm.issue, 1)
    assert.equal(fm.publishedAt, '2026-06-16T09:00:00.000Z')
  })

  test('returns null when no frontmatter block', () => {
    const fm = extractFrontmatter('no frontmatter here')
    assert.equal(fm, null)
  })

  test('returns null when publishedAt is missing', () => {
    const content = `---
slug: test
---
body`
    const fm = extractFrontmatter(content)
    assert.equal(fm, null)
  })
})

// ── alreadyFiled ─────────────────────────────────────────────────────────────

describe('alreadyFiled', () => {
  test('returns true when AUDIT.md contains pending newsletter row', () => {
    const audit = `### [ ] [newsletter] [4.0] Weekly digest — issue 002 due (8 days since issue 1)\n- category: content-gaps\n- filed: 2026-06-21 by newsletter-gap-survey.mjs`
    assert.equal(alreadyFiled(audit), true)
  })

  test('returns false when AUDIT.md has no newsletter row', () => {
    const audit = `### [x] [content-gaps] [7.0] some other row`
    assert.equal(alreadyFiled(audit), false)
  })

  test('returns false when newsletter row is already completed', () => {
    const audit = `### [x] [newsletter] [4.0] Weekly digest — issue 002 due`
    assert.equal(alreadyFiled(audit), false)
  })
})
