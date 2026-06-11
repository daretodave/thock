// scripts/__tests__/group-buy-status-check.test.mjs
//
// Unit tests for scripts/group-buy-status-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../group-buy-status-check.mjs'

const { findStaleRecords, alreadyFiled } = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAST_DATE = '2026-01-01'
const FUTURE_DATE = '2099-12-31'
const TODAY = new Date('2026-06-11')

function makeRecord(slug, status, endDate) {
  const data = { slug, status, name: slug, vendorSlug: 'test-vendor' }
  if (endDate !== undefined) data.endDate = endDate
  return { file: `${slug}.json`, data }
}

// ── findStaleRecords — violation ──────────────────────────────────────────────

describe('findStaleRecords — violation', () => {
  test('flags live record with past endDate', () => {
    const records = [makeRecord('test-buy', 'live', PAST_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 1)
    assert.equal(stale[0].slug, 'test-buy')
    assert.equal(stale[0].status, 'live')
    assert.equal(stale[0].endDate, PAST_DATE)
  })

  test('flags announced record with past endDate', () => {
    const records = [makeRecord('ann-buy', 'announced', PAST_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 1)
    assert.equal(stale[0].slug, 'ann-buy')
  })
})

// ── findStaleRecords — no violation (future endDate) ─────────────────────────

describe('findStaleRecords — no violation (future endDate)', () => {
  test('does not flag live record with future endDate', () => {
    const records = [makeRecord('future-buy', 'live', FUTURE_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 0)
  })

  test('does not flag announced record with future endDate', () => {
    const records = [makeRecord('future-ann', 'announced', FUTURE_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 0)
  })
})

// ── findStaleRecords — no violation (no endDate) ──────────────────────────────

describe('findStaleRecords — no violation (no endDate)', () => {
  test('does not flag live record without endDate', () => {
    const records = [makeRecord('open-buy', 'live')]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 0)
  })
})

// ── findStaleRecords — no violation (closed status) ──────────────────────────

describe('findStaleRecords — no violation (closed status)', () => {
  test('does not flag closed record with past endDate', () => {
    const records = [makeRecord('closed-buy', 'closed', PAST_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 0)
  })

  test('does not flag shipped record with past endDate', () => {
    const records = [makeRecord('shipped-buy', 'shipped', PAST_DATE)]
    const stale = findStaleRecords(records, TODAY)
    assert.equal(stale.length, 0)
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled', () => {
  test('returns true when slug stale row exists in AUDIT content', () => {
    const content = '### [ ] [data] [3.6] test-buy — status stale, endDate 2026-01-01 passed\n'
    assert.equal(alreadyFiled(content, 'test-buy'), true)
  })

  test('returns false when slug stale row is absent', () => {
    const content = '### [ ] [data] [3.6] other-buy — status stale, endDate 2026-01-01 passed\n'
    assert.equal(alreadyFiled(content, 'test-buy'), false)
  })

  test('returns false for empty content', () => {
    assert.equal(alreadyFiled('', 'any-buy'), false)
  })
})
