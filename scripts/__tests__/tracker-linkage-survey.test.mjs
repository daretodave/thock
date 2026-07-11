// scripts/__tests__/tracker-linkage-survey.test.mjs
//
// Unit tests for scripts/tracker-linkage-survey.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../tracker-linkage-survey.mjs'

const { findMissingLinks, alreadyFiled } = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSnapshot(isoWeek, publishedAt, rows) {
  return { isoWeek, publishedAt, rows }
}

function makeRow(name, direction, articleSlug) {
  return { name, direction, score: 50, spark: [], articleSlug: articleSlug || null, note: '' }
}

// today for tests — fixed date so arithmetic is deterministic
const TODAY = new Date('2026-06-11T12:00:00.000Z')

// 20 days ago (> 14 day threshold)
const OLD_DATE = '2026-05-22T00:00:00.000Z'
// 5 days ago (< 14 day threshold)
const RECENT_DATE = '2026-06-06T00:00:00.000Z'

// ── findMissingLinks — violation ──────────────────────────────────────────────

describe('findMissingLinks — violation', () => {
  test('flags non-flat row with no articleSlug older than 14 days', () => {
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Gateron Lanes', 'up', null),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].name, 'Gateron Lanes')
    assert.equal(missing[0].firstSeenWeek, '2026-W20')
    assert.ok(missing[0].agedays >= 20, `expected agedays >= 20, got ${missing[0].agedays}`)
  })

  test('flags topic unlinked across multiple old snapshots', () => {
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Topic A', 'up', null),
        makeRow('Topic A', 'up', null), // duplicate row in same snapshot (edge case)
      ]),
      makeSnapshot('2026-W21', '2026-05-25T00:00:00.000Z', [
        makeRow('Topic A', 'up', null),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].name, 'Topic A')
    // first seen should be W20 (the earliest)
    assert.equal(missing[0].firstSeenWeek, '2026-W20')
  })

  test('flags a topic re-unlinked in a later run after being linked in an earlier run (regression: "ever linked" masking)', () => {
    // Reproduces the real W22 / W24-W26 / W28 recurrence: a topic is linked
    // in one run, goes flat (run breaks), then comes back non-flat in a new
    // run that is never linked. The old "ever linked" check treated the
    // topic as permanently linked after the first run and never re-flagged it.
    const snapshots = [
      makeSnapshot('2026-W15', '2026-04-13T00:00:00.000Z', [
        makeRow('Prototypist', 'up', 'vendor-first-customs'),
      ]),
      makeSnapshot('2026-W16', '2026-04-20T00:00:00.000Z', [
        makeRow('Prototypist', 'flat', null), // run breaks here
      ]),
      makeSnapshot('2026-W17', OLD_DATE, [
        makeRow('Prototypist', 'up', null), // new run starts, never linked
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].name, 'Prototypist')
    assert.equal(missing[0].firstSeenWeek, '2026-W17')
  })

  test('flags a topic whose run continues non-flat but drops its slug in a later snapshot', () => {
    // No flat break at all — the run just keeps going, but a later week's
    // independently-authored snapshot forgot to carry the slug forward.
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Topic B', 'up', 'topic-b-article'),
      ]),
      makeSnapshot('2026-W21', '2026-05-25T00:00:00.000Z', [
        makeRow('Topic B', 'down', null),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].name, 'Topic B')
    // run started at W20 (never broke), so age is measured from there
    assert.equal(missing[0].firstSeenWeek, '2026-W20')
  })
})

// ── findMissingLinks — no violation (has articleSlug) ────────────────────────

describe('findMissingLinks — no violation (has articleSlug)', () => {
  test('does not flag topic that gains articleSlug in a later snapshot', () => {
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Linked Topic', 'up', null), // no slug in first snapshot
      ]),
      makeSnapshot('2026-W21', '2026-05-25T00:00:00.000Z', [
        makeRow('Linked Topic', 'up', 'linked-topic-article'), // linked in second
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 0)
  })

  test('does not flag topic with articleSlug in the same old snapshot', () => {
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Already Linked', 'up', 'already-linked-article'),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 0)
  })
})

// ── findMissingLinks — no violation (within 14-day window) ───────────────────

describe('findMissingLinks — no violation (within 14-day window)', () => {
  test('does not flag non-flat row first seen only 5 days ago', () => {
    const snapshots = [
      makeSnapshot('2026-W23', RECENT_DATE, [
        makeRow('New Entrant', 'up', null),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 0)
  })
})

// ── findMissingLinks — flat rows are ignored ──────────────────────────────────

describe('findMissingLinks — flat rows excluded', () => {
  test('does not flag flat rows regardless of age', () => {
    const snapshots = [
      makeSnapshot('2026-W20', OLD_DATE, [
        makeRow('Flat Topic', 'flat', null),
      ]),
    ]
    const missing = findMissingLinks(snapshots, TODAY)
    assert.equal(missing.length, 0)
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled', () => {
  test('returns true when topic row exists in AUDIT content', () => {
    const content = '### [ ] [content-gaps] [5.5] Gateron Lanes — Rule 2 tracker linkage missing\n'
    assert.equal(alreadyFiled(content, 'Gateron Lanes'), true)
  })

  test('returns false when topic row is absent', () => {
    const content = '### [ ] [content-gaps] [5.5] Other Topic — Rule 2 tracker linkage missing\n'
    assert.equal(alreadyFiled(content, 'Gateron Lanes'), false)
  })

  test('returns false for empty content', () => {
    assert.equal(alreadyFiled('', 'Any Topic'), false)
  })
})
