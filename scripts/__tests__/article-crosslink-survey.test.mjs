// scripts/__tests__/article-crosslink-survey.test.mjs
//
// Unit tests for scripts/article-crosslink-survey.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { __test } from '../article-crosslink-survey.mjs'

const { parseFrontmatter, extractBody, hasLinkTo, findUnlinkedPairs } = __test

// ── helpers ───────────────────────────────────────────────────────────────────

function makeArticle(slug, pillar, tags, bodyText = '') {
  return { slug, pillar, tags, bodyLines: bodyText.split('\n') }
}

// ── parseFrontmatter ──────────────────────────────────────────────────────────

describe('parseFrontmatter', () => {
  test('parses inline tags array', () => {
    const content = `---
slug: gateron-oil-king-deep-dive
pillar: deep-dives
tags: [linear, factory-lubed, gateron, pom]
---
Body text here.`
    const fm = parseFrontmatter(content)
    assert.equal(fm.slug, 'gateron-oil-king-deep-dive')
    assert.equal(fm.pillar, 'deep-dives')
    assert.deepEqual(fm.tags, ['linear', 'factory-lubed', 'gateron', 'pom'])
  })

  test('parses multi-line tags block', () => {
    const content = `---
slug: case-materials-compared
pillar: guides
tags:
  - aluminum
  - polycarbonate
  - abs
---
Body text here.`
    const fm = parseFrontmatter(content)
    assert.equal(fm.slug, 'case-materials-compared')
    assert.deepEqual(fm.tags, ['aluminum', 'polycarbonate', 'abs'])
  })

  test('strips quotes from numeric-looking tags', () => {
    const content = `---
slug: test
pillar: news
tags: ["75", layout, trends-2026]
---
Body.`
    const fm = parseFrontmatter(content)
    assert.deepEqual(fm.tags, ['75', 'layout', 'trends-2026'])
  })
})

// ── extractBody ───────────────────────────────────────────────────────────────

describe('extractBody', () => {
  test('strips frontmatter fences', () => {
    const content = '---\nslug: foo\n---\nHello world\n'
    const { bodyLines } = extractBody(content)
    assert.equal(bodyLines[0], 'Hello world')
  })

  test('returns full content when no frontmatter', () => {
    const content = 'Just body\n'
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.equal(bodyLines[0], 'Just body')
    assert.equal(bodyStartLine, 1)
  })
})

// ── hasLinkTo ─────────────────────────────────────────────────────────────────

describe('hasLinkTo', () => {
  test('detects markdown link', () => {
    const lines = ['See [Oil King](/article/gateron-oil-king-deep-dive) for details.']
    assert.ok(hasLinkTo(lines, 'gateron-oil-king-deep-dive'))
  })

  test('returns false when link absent', () => {
    const lines = ['No link here.']
    assert.ok(!hasLinkTo(lines, 'gateron-oil-king-deep-dive'))
  })
})

// ── findUnlinkedPairs — gap case ──────────────────────────────────────────────

describe('findUnlinkedPairs — gap', () => {
  test('returns pair when ≥2 shared tags and neither body links the other', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'linear', 'gateron'], 'No links here.'),
      makeArticle('article-b', 'deep-dives', ['pom', 'linear', 'cherry'], 'Also no links.'),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 1)
    assert.equal(pairs[0].slugA, 'article-a')
    assert.equal(pairs[0].slugB, 'article-b')
    assert.deepEqual(pairs[0].sharedTags, ['pom', 'linear'])
    assert.ok(pairs[0].samePillar)
    assert.equal(pairs[0].score, 4.5)
  })

  test('assigns lower score for cross-pillar pairs', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'linear'], ''),
      makeArticle('article-b', 'guides', ['pom', 'linear'], ''),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 1)
    assert.ok(!pairs[0].samePillar)
    assert.equal(pairs[0].score, 3.6)
  })
})

// ── findUnlinkedPairs — control: link present ─────────────────────────────────

describe('findUnlinkedPairs — control: link present', () => {
  test('returns no pair when article-a links to article-b', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'linear'], 'See [B](/article/article-b).'),
      makeArticle('article-b', 'deep-dives', ['pom', 'linear'], 'No return link needed.'),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 0)
  })

  test('returns no pair when article-b links back to article-a', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'linear'], 'No forward link.'),
      makeArticle('article-b', 'deep-dives', ['pom', 'linear'], 'See [A](/article/article-a).'),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 0)
  })
})

// ── findUnlinkedPairs — control: fewer than 2 shared tags ─────────────────────

describe('findUnlinkedPairs — control: tag threshold', () => {
  test('returns no pair when only 1 shared tag', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'gateron'], ''),
      makeArticle('article-b', 'deep-dives', ['pom', 'cherry'], ''),
    ]
    // Only 1 shared tag (pom) — threshold is ≥2, so no pair
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 0)
  })

  test('returns no pair when zero shared tags', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom', 'gateron'], ''),
      makeArticle('article-b', 'guides', ['aluminum', 'beginner'], ''),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    assert.equal(pairs.length, 0)
  })

  test('returns no pair when exactly 1 shared tag with threshold ≥2', () => {
    const articles = [
      makeArticle('article-a', 'deep-dives', ['pom'], ''),
      makeArticle('article-b', 'deep-dives', ['pom'], ''),
    ]
    const pairs = findUnlinkedPairs(articles, null)
    // pom shared, but count=1 < 2 → no pair
    assert.equal(pairs.length, 0)
  })
})

// ── findUnlinkedPairs — scope flag ───────────────────────────────────────────

describe('findUnlinkedPairs — scope slug', () => {
  test('scopes to pairs involving the specified slug', () => {
    const articles = [
      makeArticle('alpha', 'guides', ['pom', 'linear'], ''),
      makeArticle('beta', 'guides', ['pom', 'linear'], ''),
      makeArticle('gamma', 'guides', ['pom', 'linear'], ''),
    ]
    // Without scope: 3 pairs (alpha↔beta, alpha↔gamma, beta↔gamma)
    // With scope=alpha: only pairs involving alpha (alpha↔beta, alpha↔gamma)
    const all = findUnlinkedPairs(articles, null)
    const scoped = findUnlinkedPairs(articles, 'alpha')
    assert.equal(all.length, 3)
    assert.equal(scoped.length, 2)
    assert.ok(scoped.every((p) => p.slugA === 'alpha' || p.slugB === 'alpha'))
  })
})
