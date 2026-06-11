// scripts/__tests__/article-parts-check.test.mjs
//
// Unit tests for scripts/article-parts-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { __test } from '../article-parts-check.mjs'

const {
  extractBody,
  extractFrontmatterText,
  parseMentionedParts,
  checkFile,
  escapeRegex,
} = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMdx(frontmatterFields, body) {
  return `---\n${frontmatterFields}\n---\n${body}`
}

function tmpMdx(content) {
  const dir = mkdtempSync(join(tmpdir(), 'apc-test-'))
  const filePath = join(dir, 'test-article.mdx')
  writeFileSync(filePath, content, 'utf8')
  return filePath
}

function cleanup(filePath) {
  try { unlinkSync(filePath) } catch { /* ok */ }
}

// Minimal catalog for tests
const TEST_CATALOG = [
  { slug: 'gateron-oil-king', name: 'Gateron Oil King', kind: 'switch' },
  { slug: 'mode-sonnet', name: 'Mode Sonnet', kind: 'board' },
  { slug: 'gmk-olivia', name: 'GMK Olivia', kind: 'keycap-set' },
]

// ── extractBody ───────────────────────────────────────────────────────────────

describe('extractBody', () => {
  test('strips frontmatter and returns body start line', () => {
    const content = '---\nslug: foo\ntitle: Foo\n---\nBody line 1\n'
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.deepEqual(bodyLines, ['Body line 1', ''])
    assert.equal(bodyStartLine, 5)
  })

  test('handles content with no frontmatter', () => {
    const content = 'Just body text\n'
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.deepEqual(bodyLines, ['Just body text', ''])
    assert.equal(bodyStartLine, 1)
  })
})

// ── parseMentionedParts ───────────────────────────────────────────────────────

describe('parseMentionedParts', () => {
  test('parses mentionedParts array from YAML', () => {
    const yaml = `slug: foo
mentionedParts:
  - id: oil-king
    kind: switch
    slug: gateron-oil-king
  - id: sonnet
    kind: board
    slug: mode-sonnet`

    const parts = parseMentionedParts(yaml)
    assert.equal(parts.length, 2)
    assert.deepEqual(parts[0], { slug: 'gateron-oil-king', kind: 'switch' })
    assert.deepEqual(parts[1], { slug: 'mode-sonnet', kind: 'board' })
  })

  test('returns empty array when mentionedParts key is absent', () => {
    const yaml = 'slug: foo\ntitle: Bar\nauthor: thock\n'
    const parts = parseMentionedParts(yaml)
    assert.deepEqual(parts, [])
  })

  test('handles mentionedParts followed by another top-level key', () => {
    const yaml = `slug: foo
mentionedParts:
  - id: oil-king
    kind: switch
    slug: gateron-oil-king
featured: false`

    const parts = parseMentionedParts(yaml)
    assert.equal(parts.length, 1)
    assert.deepEqual(parts[0], { slug: 'gateron-oil-king', kind: 'switch' })
  })
})

// ── checkFile — violation case ────────────────────────────────────────────────

describe('checkFile — violation', () => {
  test('flags entity name in prose absent from mentionedParts', () => {
    const fm = `slug: test-article
title: Test
lede: Test lede text here for testing purposes only.
author: thock
pillar: news
tags: [switches]
publishedAt: '2026-06-01T00:00:00.000Z'`

    const body = `The Gateron Oil King is a popular linear switch used in many builds.`
    const content = makeMdx(fm, body)
    const filePath = tmpMdx(content)

    try {
      const violations = checkFile(filePath, TEST_CATALOG)
      assert.equal(violations.length, 1)
      assert.equal(violations[0].entitySlug, 'gateron-oil-king')
      assert.equal(violations[0].entityKind, 'switch')
      assert.equal(violations[0].entityName, 'Gateron Oil King')
    } finally {
      cleanup(filePath)
    }
  })
})

// ── checkFile — no-violation case ────────────────────────────────────────────

describe('checkFile — no violation', () => {
  test('does not flag entity name when already in mentionedParts', () => {
    const fm = `slug: test-article
title: Test
lede: Test lede text here for testing purposes only.
author: thock
pillar: news
tags: [switches]
publishedAt: '2026-06-01T00:00:00.000Z'
mentionedParts:
  - id: oil-king
    kind: switch
    slug: gateron-oil-king`

    const body = `The Gateron Oil King is a popular linear switch used in many builds.`
    const content = makeMdx(fm, body)
    const filePath = tmpMdx(content)

    try {
      const violations = checkFile(filePath, TEST_CATALOG)
      assert.equal(violations.length, 0)
    } finally {
      cleanup(filePath)
    }
  })
})

// ── checkFile — not-in-catalog control ───────────────────────────────────────

describe('checkFile — not-in-catalog control', () => {
  test('does not flag a name that is not in the entity catalog', () => {
    const fm = `slug: test-article
title: Test
lede: Test lede text here for testing purposes only.
author: thock
pillar: news
tags: [switches]
publishedAt: '2026-06-01T00:00:00.000Z'`

    const body = `The FancySwitchXYZ is a hypothetical product not in the catalog.`
    const content = makeMdx(fm, body)
    const filePath = tmpMdx(content)

    try {
      const violations = checkFile(filePath, TEST_CATALOG)
      assert.equal(violations.length, 0)
    } finally {
      cleanup(filePath)
    }
  })
})

// ── escapeRegex ───────────────────────────────────────────────────────────────

describe('escapeRegex', () => {
  test('escapes special regex characters', () => {
    const result = escapeRegex('Drop + Matt3o MT3 /dev/tty')
    // Verify it does not throw when used in a RegExp
    assert.doesNotThrow(() => new RegExp(result, 'gi'))
    const re = new RegExp(result, 'gi')
    assert.ok(re.test('Drop + Matt3o MT3 /dev/tty'))
  })
})
