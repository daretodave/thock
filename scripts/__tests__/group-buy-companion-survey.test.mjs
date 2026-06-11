// scripts/__tests__/group-buy-companion-survey.test.mjs
//
// Unit tests for scripts/group-buy-companion-survey.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../group-buy-companion-survey.mjs'

const { findMissingCompanions, alreadyFiled } = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRecord(slug, status, relatedArticle) {
  const data = { slug, status, name: slug, vendorSlug: 'test-vendor' }
  if (relatedArticle !== undefined) data.relatedArticle = relatedArticle
  return { file: `${slug}.json`, data }
}

// ── findMissingCompanions — violation ─────────────────────────────────────────

describe('findMissingCompanions — violation', () => {
  test('flags live record without relatedArticle', () => {
    const records = [makeRecord('test-buy', 'live')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].slug, 'test-buy')
    assert.equal(missing[0].status, 'live')
  })

  test('flags announced record without relatedArticle', () => {
    const records = [makeRecord('announced-buy', 'announced')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 1)
    assert.equal(missing[0].slug, 'announced-buy')
  })
})

// ── findMissingCompanions — no violation (closed) ────────────────────────────

describe('findMissingCompanions — no violation (closed)', () => {
  test('does not flag closed record without relatedArticle', () => {
    const records = [makeRecord('closed-buy', 'closed')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 0)
  })

  test('does not flag shipped record without relatedArticle', () => {
    const records = [makeRecord('shipped-buy', 'shipped')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 0)
  })
})

// ── findMissingCompanions — no violation (has relatedArticle) ─────────────────

describe('findMissingCompanions — no violation (has relatedArticle)', () => {
  test('does not flag live record with relatedArticle set', () => {
    const records = [makeRecord('live-buy', 'live', 'live-buy-coverage')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 0)
  })

  test('does not flag announced record with relatedArticle set', () => {
    const records = [makeRecord('ann-buy', 'announced', 'ann-buy-coverage')]
    const missing = findMissingCompanions(records)
    assert.equal(missing.length, 0)
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled', () => {
  test('returns true when slug row exists in AUDIT content', () => {
    const content = '### [ ] [content-gaps] [7.0] test-buy — Rule 3 companion article missing\n'
    assert.equal(alreadyFiled(content, 'test-buy'), true)
  })

  test('returns false when slug row is absent', () => {
    const content = '### [ ] [content-gaps] [7.0] other-buy — Rule 3 companion article missing\n'
    assert.equal(alreadyFiled(content, 'test-buy'), false)
  })

  test('returns false for empty content', () => {
    assert.equal(alreadyFiled('', 'any-buy'), false)
  })
})
