// scripts/__tests__/trend-snapshot-quality-check.test.mjs
//
// Unit tests for scripts/trend-snapshot-quality-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../trend-snapshot-quality-check.mjs'

const {
  checkCasingDrift,
  checkTopicRelevance,
  checkStatusClaims,
  checkDirectionSign,
  checkContinuity,
  buildGroupBuyByArticle,
  canonicalNames,
  alreadyFiled,
  rowSignature,
} = __test

// ── helpers ───────────────────────────────────────────────────────────────────

function makeSnapshot(isoWeek, rows) {
  return { isoWeek, publishedAt: '2026-01-01T00:00:00.000Z', rows, updatedAt: '2026-01-01T00:00:00.000Z' }
}

function makeRow(overrides = {}) {
  return {
    name: 'Test Topic',
    category: 'vendor',
    direction: 'flat',
    score: 0,
    spark: [0, 0],
    articleSlug: null,
    note: null,
    ...overrides,
  }
}

// ── Check A — name-casing drift ───────────────────────────────────────────────

describe('checkCasingDrift', () => {
  test('flags a canonical name mentioned with the wrong case', () => {
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ note: 'novelkeys restocked its interest-check page this week.' }),
    ])
    const violations = checkCasingDrift(snapshot, ['NovelKeys'])
    assert.equal(violations.length, 1)
    assert.equal(violations[0].check, 'A')
  })

  test('does not flag a canonical name mentioned with correct case', () => {
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ note: 'NovelKeys restocked its interest-check page this week.' }),
    ])
    const violations = checkCasingDrift(snapshot, ['NovelKeys'])
    assert.equal(violations.length, 0)
  })

  test('canonicalNames excludes "Drop" (common-word collision)', () => {
    const names = canonicalNames(
      [{ file: 'drop.json', data: { name: 'Drop' } }, { file: 'kbdfans.json', data: { name: 'KBDfans' } }],
      [],
    )
    assert.deepEqual(names, ['KBDfans'])
  })
})

// ── Check B — articleSlug topic relevance ─────────────────────────────────────

describe('checkTopicRelevance', () => {
  test('does not flag when a row keyword appears in article body', () => {
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ name: 'Hall Effect/Rapid Trigger', articleSlug: 'nova-socket' }),
    ])
    const lookup = (slug) => (slug === 'nova-socket' ? 'title: hybrid\n\nBody discusses hall effect switches at length.' : null)
    const violations = checkTopicRelevance(snapshot, lookup)
    assert.equal(violations.length, 0)
  })

  test('flags when no row keyword appears anywhere in the linked article', () => {
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ name: 'Hall Effect/Rapid Trigger', articleSlug: 'unrelated-article' }),
    ])
    const lookup = (slug) => (slug === 'unrelated-article' ? 'A piece about stabilizer rattle and nothing else.' : null)
    const violations = checkTopicRelevance(snapshot, lookup)
    assert.equal(violations.length, 1)
    assert.equal(violations[0].check, 'B')
  })
})

// ── Check C — status-claim agreement ──────────────────────────────────────────

describe('checkStatusClaims', () => {
  test('flags a note claiming the linked group buy closed when it is still live', () => {
    const gbByArticle = buildGroupBuyByArticle([
      { file: 'x.json', data: { slug: 'x', name: 'GMK CYL Ramune', relatedArticle: 'ramune-article', status: 'live' } },
    ])
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ articleSlug: 'ramune-article', note: 'GMK CYL Ramune closed this week after a final push.' }),
    ])
    const violations = checkStatusClaims(snapshot, gbByArticle)
    assert.equal(violations.length, 1)
    assert.equal(violations[0].check, 'C')
  })

  test('does not flag when status-claim language agrees with the record', () => {
    const gbByArticle = buildGroupBuyByArticle([
      { file: 'x.json', data: { slug: 'x', name: 'GMK CYL Ramune', relatedArticle: 'ramune-article', status: 'closed' } },
    ])
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ articleSlug: 'ramune-article', note: 'GMK CYL Ramune closed this week after a final push.' }),
    ])
    const violations = checkStatusClaims(snapshot, gbByArticle)
    assert.equal(violations.length, 0)
  })

  test('does not flag closing language about a different, unrelated buy in the same note', () => {
    const gbByArticle = buildGroupBuyByArticle([
      { file: 'x.json', data: { slug: 'x', name: 'Nyawice', relatedArticle: 'nyawice-article', status: 'live' } },
    ])
    const snapshot = makeSnapshot('2026-W01', [
      makeRow({ articleSlug: 'nyawice-article', note: 'GMK Spark closed this week; Nyawice remains open for orders.' }),
    ])
    const violations = checkStatusClaims(snapshot, gbByArticle)
    assert.equal(violations.length, 0)
  })
})

// ── Check D-sign — direction/spark consistency ────────────────────────────────

describe('checkDirectionSign', () => {
  test('does not flag "flat" with a small delta within tolerance', () => {
    const snapshot = makeSnapshot('2026-W01', [makeRow({ direction: 'flat', spark: [10, 11] })])
    assert.equal(checkDirectionSign(snapshot).length, 0)
  })

  test('flags "up" claimed with a zero delta', () => {
    const snapshot = makeSnapshot('2026-W01', [makeRow({ direction: 'up', spark: [10, 10] })])
    const violations = checkDirectionSign(snapshot)
    assert.equal(violations.length, 1)
    assert.equal(violations[0].check, 'D-sign')
  })

  test('flags "flat" with a delta beyond tolerance', () => {
    const snapshot = makeSnapshot('2026-W01', [makeRow({ direction: 'flat', spark: [10, 13] })])
    const violations = checkDirectionSign(snapshot)
    assert.equal(violations.length, 1)
  })
})

// ── Check D-continuity — shift-and-append ─────────────────────────────────────

describe('checkContinuity', () => {
  test('does not flag a valid shift-and-append pair', () => {
    const prev = makeSnapshot('2026-W01', [makeRow({ name: 'Topic', spark: [1, 2, 3, 4] })])
    const curr = makeSnapshot('2026-W02', [makeRow({ name: 'Topic', spark: [2, 3, 4, 5] })])
    assert.equal(checkContinuity(prev, curr).length, 0)
  })

  test('flags a fabricated discontinuity', () => {
    const prev = makeSnapshot('2026-W01', [makeRow({ name: 'Topic', spark: [1, 2, 3, 4] })])
    const curr = makeSnapshot('2026-W02', [makeRow({ name: 'Topic', spark: [9, 9, 9, 9] })])
    const violations = checkContinuity(prev, curr)
    assert.equal(violations.length, 1)
    assert.equal(violations[0].check, 'D-continuity')
  })
})

// ── alreadyFiled / rowSignature ────────────────────────────────────────────────

describe('alreadyFiled', () => {
  test('detects an existing row via its signature', () => {
    const v = { check: 'A', isoWeek: '2026-W01', row: 'NovelKeys' }
    const existing = `some preamble\n${rowSignature(v)}\nmore text`
    assert.equal(alreadyFiled(existing, v), true)
  })

  test('returns false when the signature is absent', () => {
    const v = { check: 'A', isoWeek: '2026-W01', row: 'NovelKeys' }
    assert.equal(alreadyFiled('nothing relevant here', v), false)
  })
})
