// scripts/__tests__/content-gap-survey.test.mjs
//
// Unit tests for the pure-functional core of scripts/content-gap-survey.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../content-gap-survey.mjs'

const {
  surveyContentGaps,
  formatAuditRow,
  extractFrontmatter,
  PILLARS,
  PILLAR_IMPACT,
} = __test

// Fixed reference date for determinism
const TODAY = new Date('2026-06-15T00:00:00.000Z')
const YESTERDAY = '2026-06-14'
const DAY_29 = '2026-05-17' // 29 days before TODAY — still in window
const DAY_31 = '2026-05-15' // 31 days before TODAY — outside window

function article(pillar, publishedAt) {
  return { pillar, publishedAt }
}

function comfortableSet() {
  return PILLARS.flatMap((p) => [article(p, YESTERDAY), article(p, DAY_29)])
}

// ── Test A: 1 article in 30d, deep-dives ─────────────────────────────────────
describe('surveyContentGaps — hot pursuit', () => {
  test('Test A: 1 article in 30d for deep-dives → rule=1 pillar="deep-dives" score=7.0', () => {
    const articles = [
      article('news', YESTERDAY),      article('news', DAY_29),
      article('trends', YESTERDAY),    article('trends', DAY_29),
      article('ideas', YESTERDAY),     article('ideas', DAY_29),
      article('guides', YESTERDAY),    article('guides', DAY_29),
      // deep-dives: only 1 in window + 1 outside
      article('deep-dives', YESTERDAY),
      article('deep-dives', DAY_31),
    ]
    const result = surveyContentGaps(articles, TODAY)
    assert.equal(result.status, 'candidate')
    assert.equal(result.candidate.pillar, 'deep-dives')
    assert.equal(result.candidate.state, 'hot-pursuit')
    assert.equal(result.candidate.score, 7.0)
    assert.equal(result.candidate.windowCount, 1)
    assert.equal(result.candidate.impact, PILLAR_IMPACT['deep-dives'])
  })
})

// ── Test B: 0 articles in 30d, news ──────────────────────────────────────────
describe('surveyContentGaps — critical hot pursuit', () => {
  test('Test B: 0 articles in 30d for news → score=9.5 critical-hot-pursuit', () => {
    const articles = [
      article('trends', YESTERDAY),    article('trends', DAY_29),
      article('ideas', YESTERDAY),     article('ideas', DAY_29),
      article('deep-dives', YESTERDAY), article('deep-dives', DAY_29),
      article('guides', YESTERDAY),    article('guides', DAY_29),
      // news: all outside window
      article('news', DAY_31),
      article('news', '2026-04-01'),
    ]
    const result = surveyContentGaps(articles, TODAY)
    assert.equal(result.status, 'candidate')
    assert.equal(result.candidate.pillar, 'news')
    assert.equal(result.candidate.state, 'critical-hot-pursuit')
    assert.equal(result.candidate.score, 9.5)
    assert.equal(result.candidate.windowCount, 0)
  })
})

// ── Comfortable ───────────────────────────────────────────────────────────────
describe('surveyContentGaps — comfortable', () => {
  test('all pillars at ≥2 articles → comfortable', () => {
    const result = surveyContentGaps(comfortableSet(), TODAY)
    assert.equal(result.status, 'comfortable')
  })

  test('empty article list → trends picked (highest prominence)', () => {
    const result = surveyContentGaps([], TODAY)
    assert.equal(result.status, 'candidate')
    assert.equal(result.candidate.pillar, 'trends')
    assert.equal(result.candidate.score, 9.5)
  })
})

// ── Tie-breaking ──────────────────────────────────────────────────────────────
describe('surveyContentGaps — tie-breaking', () => {
  test('critical beats hot', () => {
    const articles = [
      article('news', DAY_31),           // critical (0 in window)
      article('deep-dives', YESTERDAY),  // hot (1 in window)
      article('trends', YESTERDAY),    article('trends', DAY_29),
      article('ideas', YESTERDAY),     article('ideas', DAY_29),
      article('guides', YESTERDAY),    article('guides', DAY_29),
    ]
    const result = surveyContentGaps(articles, TODAY)
    assert.equal(result.candidate.state, 'critical-hot-pursuit')
    assert.equal(result.candidate.pillar, 'news')
  })

  test('among equal-state: pillar with older most-recent publishedAt wins', () => {
    const articles = [
      article('ideas', '2026-04-01'),
      article('deep-dives', '2026-03-01'), // older → should win
      article('news', YESTERDAY),      article('news', DAY_29),
      article('trends', YESTERDAY),    article('trends', DAY_29),
      article('guides', YESTERDAY),    article('guides', DAY_29),
    ]
    const result = surveyContentGaps(articles, TODAY)
    assert.equal(result.candidate.pillar, 'deep-dives')
  })
})

// ── extractFrontmatter ────────────────────────────────────────────────────────
describe('extractFrontmatter', () => {
  test('extracts pillar and publishedAt from standard MDX frontmatter', () => {
    const content = `---
slug: test-article
pillar: news
publishedAt: '2026-05-01T12:00:00.000Z'
title: "Test"
---

Body text.`
    const fm = extractFrontmatter(content)
    assert.equal(fm.pillar, 'news')
    assert.equal(fm.publishedAt, '2026-05-01T12:00:00.000Z')
  })

  test('returns null for content without frontmatter', () => {
    const result = extractFrontmatter('No frontmatter here')
    assert.equal(result, null)
  })

  test('handles datetime publishedAt (ISO with time component)', () => {
    const content = `---\npillar: trends\npublishedAt: '2026-04-14T00:00:00.000Z'\n---\nBody.`
    const fm = extractFrontmatter(content)
    assert.ok(fm)
    assert.equal(fm.publishedAt.slice(0, 10), '2026-04-14')
  })
})

// ── formatAuditRow ─────────────────────────────────────────────────────────────
describe('formatAuditRow', () => {
  test('hot-pursuit row contains expected labels and score', () => {
    const candidate = {
      pillar: 'guides', state: 'hot-pursuit', score: 7.0,
      windowCount: 1, windowStart: '2026-05-16',
      mostRecentPublishedAt: '2026-06-10', impact: 5,
    }
    const row = formatAuditRow(candidate, TODAY)
    assert.ok(row.includes('HOT PURSUIT'))
    assert.ok(row.includes('guides'))
    assert.ok(row.includes('7.0'))
    assert.ok(row.includes('category: content-gaps'))
    assert.ok(row.includes('rule: Rule 1'))
  })

  test('critical-hot-pursuit row contains emergency language', () => {
    const candidate = {
      pillar: 'news', state: 'critical-hot-pursuit', score: 9.5,
      windowCount: 0, windowStart: '2026-05-16',
      mostRecentPublishedAt: null, impact: 7,
    }
    const row = formatAuditRow(candidate, TODAY)
    assert.ok(row.includes('CRITICAL HOT PURSUIT'))
    assert.ok(row.includes('9.5'))
    assert.ok(row.includes('critical hot pursuit'))
  })
})
