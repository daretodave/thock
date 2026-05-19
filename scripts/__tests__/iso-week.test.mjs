// scripts/__tests__/iso-week.test.mjs
//
// Unit tests for the pure isoWeekString() helper in scripts/iso-week.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../iso-week.mjs'

const { isoWeekString } = __test

describe('isoWeekString', () => {
  test('known Monday of W21 → 2026-W21', () => {
    assert.equal(isoWeekString(new Date('2026-05-18T12:00:00Z')), '2026-W21')
  })

  test('known Sunday of W21 → 2026-W21 (same week)', () => {
    assert.equal(isoWeekString(new Date('2026-05-24T12:00:00Z')), '2026-W21')
  })

  test('Monday after W21 → 2026-W22 (week rollover)', () => {
    assert.equal(isoWeekString(new Date('2026-05-25T12:00:00Z')), '2026-W22')
  })

  test('Dec 29 2025 → 2026-W01 (year-boundary: Thursday of this week is Jan 1 2026)', () => {
    // Dec 29 is Monday; the Thursday is Jan 1, 2026 → belongs to 2026-W01
    assert.equal(isoWeekString(new Date('2025-12-29T12:00:00Z')), '2026-W01')
  })

  test('Jan 1 2026 → 2026-W01', () => {
    // Jan 1, 2026 is a Thursday — definitively in W01 of 2026
    assert.equal(isoWeekString(new Date('2026-01-01T12:00:00Z')), '2026-W01')
  })
})
