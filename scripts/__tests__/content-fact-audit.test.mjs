// scripts/__tests__/content-fact-audit.test.mjs
//
// Unit tests for scripts/content-fact-audit.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { __test } from '../content-fact-audit.mjs'

const {
  extractBody,
  extractFrontmatterText,
  parseMentionedParts,
  wordDistance,
  findNameMentions,
  findGramNumbers,
  detectField,
  findNumericMismatches,
  checkArticle,
  formatAuditRow,
  alreadyFiled,
  claimKey,
} = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMdx(frontmatterFields, body) {
  return `---\n${frontmatterFields}\n---\n${body}`
}

function tmpMdx(content) {
  const dir = mkdtempSync(join(tmpdir(), 'cfa-test-'))
  const filePath = join(dir, 'test-article.mdx')
  writeFileSync(filePath, content, 'utf8')
  return filePath
}

function cleanup(filePath) {
  try { unlinkSync(filePath) } catch { /* ok */ }
}

const OIL_KING = {
  slug: 'gateron-oil-king',
  name: 'Gateron Oil King',
  springGrams: { actuation: 55, bottomOut: 65 },
}

const V3_CREAM_BLUE = {
  slug: 'akko-v3-cream-blue-pro',
  name: 'Akko V3 Cream Blue Pro',
  springGrams: { actuation: 45, bottomOut: 55 },
}

// ── extractBody / extractFrontmatterText ──────────────────────────────────────

describe('extractBody', () => {
  test('strips frontmatter and returns body start line', () => {
    const content = '---\nslug: foo\ntitle: Foo\n---\nBody line 1\n'
    const { body, bodyStartLine } = extractBody(content)
    assert.equal(body, 'Body line 1\n')
    assert.equal(bodyStartLine, 5)
  })

  test('handles content with no frontmatter', () => {
    const content = 'Just body text\n'
    const { body, bodyStartLine } = extractBody(content)
    assert.equal(body, 'Just body text\n')
    assert.equal(bodyStartLine, 1)
  })
})

describe('extractFrontmatterText', () => {
  test('extracts the YAML between the fences', () => {
    const content = '---\nslug: foo\n---\nBody\n'
    assert.equal(extractFrontmatterText(content), 'slug: foo')
  })
})

// ── parseMentionedParts ───────────────────────────────────────────────────────

describe('parseMentionedParts', () => {
  test('parses id, slug, kind from YAML', () => {
    const yaml = `slug: foo
mentionedParts:
  - id: oil-king
    kind: switch
    slug: gateron-oil-king`
    const parts = parseMentionedParts(yaml)
    assert.equal(parts.length, 1)
    assert.deepEqual(parts[0], { id: 'oil-king', kind: 'switch', slug: 'gateron-oil-king' })
  })

  test('returns empty array when mentionedParts key is absent', () => {
    assert.deepEqual(parseMentionedParts('slug: foo\ntitle: Bar\n'), [])
  })
})

// ── wordDistance ───────────────────────────────────────────────────────────────

describe('wordDistance', () => {
  test('counts whitespace-separated tokens between two offsets', () => {
    const text = 'one two three four five'
    // 'two' starts at 4, 'four' starts at 14 — 'three' is the only token
    // strictly between them.
    assert.equal(wordDistance(text, 4, 14), 1)
  })

  test('is order-independent', () => {
    const text = 'one two three four five'
    assert.equal(wordDistance(text, 14, 4), 1)
  })

  test('returns 0 when both offsets fall within the same token', () => {
    const text = 'one two'
    assert.equal(wordDistance(text, 0, 1), 0)
  })
})

// ── findNameMentions ──────────────────────────────────────────────────────────

describe('findNameMentions', () => {
  test('finds a plain-text full-name mention', () => {
    const body = 'The Gateron Oil King is a popular linear switch.'
    const mentions = findNameMentions(body, { id: 'oil-king' }, OIL_KING)
    assert.equal(mentions.length, 1)
    assert.equal(mentions[0], body.indexOf('Gateron Oil King'))
  })

  test('finds a PartReference id= alias mention even without the name in source', () => {
    const body = 'The <PartReference id="oil-king" /> runs heavier than most.'
    const mentions = findNameMentions(body, { id: 'oil-king' }, OIL_KING)
    assert.equal(mentions.length, 1)
    assert.equal(mentions[0], body.indexOf('id="oil-king"'))
  })

  test('finds both when name and alias both appear', () => {
    const body = 'The <PartReference id="oil-king" /> — Gateron Oil King — runs heavy.'
    const mentions = findNameMentions(body, { id: 'oil-king' }, OIL_KING)
    assert.equal(mentions.length, 2)
  })
})

// ── findGramNumbers ────────────────────────────────────────────────────────────

describe('findGramNumbers', () => {
  test('matches "<N>g" shorthand', () => {
    const nums = findGramNumbers('runs at 55g actuation')
    assert.deepEqual(nums.map((n) => n.value), [55])
  })

  test('matches "<N> gram" and "<N>-gram"', () => {
    const nums = findGramNumbers('a 7 gram spread, also a 12-gram spread')
    assert.deepEqual(nums.map((n) => n.value), [7, 12])
  })

  test('matches decimal values', () => {
    const nums = findGramNumbers('an 8.5-gram delta')
    assert.deepEqual(nums.map((n) => n.value), [8.5])
  })

  test('matches two adjacent hyphen-joined values', () => {
    const nums = findGramNumbers('the 45g-into-55g curve')
    assert.deepEqual(nums.map((n) => n.value), [45, 55])
  })

  test('does not match a density unit like "g/cm³"', () => {
    const nums = findGramNumbers('brass runs roughly 8.7 g/cm³ in density')
    assert.deepEqual(nums, [])
  })

  test('does not match a trailing-digit lubricant name like "205g0"', () => {
    const nums = findGramNumbers('similar to Krytox 205g0 in description')
    assert.deepEqual(nums, [])
  })
})

// ── detectField ────────────────────────────────────────────────────────────────

describe('detectField', () => {
  test('detects "actuation" keyword nearby', () => {
    const body = 'runs at 55g actuation and a heavier bottom-out'
    const idx = body.indexOf('55g')
    assert.equal(detectField(body, idx), 'actuation')
  })

  test('detects "bottom-out" keyword nearby', () => {
    const body = 'a heavy 65g bottom-out on this one'
    const idx = body.indexOf('65g')
    assert.equal(detectField(body, idx), 'bottomOut')
  })

  test('returns null when no keyword is nearby', () => {
    const body = 'this switch feels like it runs about 55g or so in the hand, nothing more to say'
    const idx = body.indexOf('55g')
    assert.equal(detectField(body, idx), null)
  })

  test('returns "delta" for a spread/delta/gap mention even when "bottom-out" is also nearby', () => {
    const body = 'a 12-gram spread to bottom-out, roughly double the other switch\'s own 6-gram spread'
    const idx = body.indexOf('12-gram')
    assert.equal(detectField(body, idx), 'delta')
  })
})

// ── findNumericMismatches — core resolve-then-diff behavior ──────────────────

describe('findNumericMismatches', () => {
  test('flags a wrong actuation citation near the switch name', () => {
    const body = 'The Gateron Oil King is a representative modern linear, on the heavier side at around 50g actuation.'
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].switchSlug, 'gateron-oil-king')
    assert.equal(mismatches[0].field, 'actuation')
    assert.equal(mismatches[0].foundValue, 50)
    assert.equal(mismatches[0].expectedValue, 55)
  })

  test('does not flag a correct citation', () => {
    const body = 'The Gateron Oil King runs at 55g actuation and 65g bottom-out.'
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 0)
  })

  test('attributes each number to the nearest of two switches across two sentences', () => {
    const body =
      'The Gateron Oil King runs roughly 55g into 65g across its travel. Meanwhile, over on the budget side, the Akko V3 Cream Blue Pro runs a noticeably lighter 45g into 55g.'
    const mismatches = findNumericMismatches(body, [
      { part: { id: 'oil-king' }, record: OIL_KING },
      { part: { id: 'v3-cream-blue-pro' }, record: V3_CREAM_BLUE },
    ])
    // Both switches are cited correctly (55/65 for Oil King, 45/55 for the
    // V3), so correct attribution must produce zero mismatches — misattributing
    // the second pair to Oil King (55 vs 45, 65 vs 55) would wrongly flag both.
    assert.equal(mismatches.length, 0)
  })

  test('flags a mismatch when attribution correctly isolates the wrong switch', () => {
    const body =
      'The Gateron Oil King runs at 55g actuation into 65g bottom-out. Meanwhile, over on the budget side, the Akko V3 Cream Blue Pro runs a noticeably lighter 40g actuation into 55g bottom-out.'
    const mismatches = findNumericMismatches(body, [
      { part: { id: 'oil-king' }, record: OIL_KING },
      { part: { id: 'v3-cream-blue-pro' }, record: V3_CREAM_BLUE },
    ])
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].switchSlug, 'akko-v3-cream-blue-pro')
    assert.equal(mismatches[0].foundValue, 40)
    assert.equal(mismatches[0].expectedValue, 45)
  })

  test('does not flag a "N-gram spread/delta" mention as an absolute-weight mismatch', () => {
    const body =
      "At 55g actuation and 67g bottom-out, the T1 doesn't run the heaviest actuation force here — but no other tactile climbs as far after the break: a 12-gram spread to bottom-out, roughly double the other switch's own 6-gram spread."
    const T1 = { slug: 'durock-t1', name: 'the T1', springGrams: { actuation: 55, bottomOut: 67 } }
    const mismatches = findNumericMismatches(body, [{ part: { id: 't1' }, record: T1 }])
    assert.deepEqual(mismatches, [])
  })

  test('ignores a number far outside the token window of any switch mention', () => {
    const filler = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ')
    const body = `The Gateron Oil King is well regarded. ${filler} Separately, a weight kit runs 50g or so.`
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 0)
  })

  test('flags an unspecified-field citation that matches neither recorded value', () => {
    const body = 'The Gateron Oil King feels like it runs about 50g in the hand.'
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].field, 'unspecified')
    assert.equal(mismatches[0].expectedActuation, 55)
    assert.equal(mismatches[0].expectedBottomOut, 65)
  })

  test('does not flag an unspecified-field citation that matches the recorded bottomOut', () => {
    const body = 'The Gateron Oil King feels like it runs about 65g in the hand.'
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 0)
  })

  test('finds a mismatch via the PartReference id= alias alone (no name text)', () => {
    const body = 'The <PartReference id="oil-king" /> is a budget entry point — 50g actuation, factory-lubed.'
    const mismatches = findNumericMismatches(body, [{ part: { id: 'oil-king' }, record: OIL_KING }])
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].foundValue, 50)
  })
})

// ── checkArticle — end-to-end against a real temp .mdx file ──────────────────

describe('checkArticle', () => {
  test('returns no mismatches for an article with no switch mentionedParts', () => {
    const fm = `slug: test-article
title: Test
lede: Test lede text here for testing purposes only.
author: thock
pillar: news
tags: [switches]
publishedAt: '2026-06-01T00:00:00.000Z'`
    const body = 'Just some prose with no switches mentioned at all.'
    const filePath = tmpMdx(makeMdx(fm, body))
    try {
      const { slug, mismatches } = checkArticle(filePath)
      assert.equal(slug, 'test-article')
      assert.deepEqual(mismatches, [])
    } finally {
      cleanup(filePath)
    }
  })
})

// ── formatAuditRow / alreadyFiled / claimKey ──────────────────────────────────

describe('formatAuditRow', () => {
  test('files a content category row with the expected score', () => {
    const mismatch = {
      switchSlug: 'gateron-oil-king',
      switchName: 'Gateron Oil King',
      field: 'actuation',
      foundValue: 50,
      expectedValue: 55,
    }
    const row = formatAuditRow('test-article', mismatch, new Date('2026-10-31'))
    assert.match(row, /### \[ \] \[content\] \[3\.6\]/)
    assert.match(row, /category: content/)
    assert.match(row, /impact: 4/)
    assert.match(row, /ease: 9/)
    assert.match(row, /data\/switches\/gateron-oil-king\.json/)
  })
})

describe('claimKey', () => {
  test('is stable for identical mismatches and differs for different ones', () => {
    const m1 = { switchSlug: 'a', field: 'actuation', foundValue: 50 }
    const m2 = { switchSlug: 'a', field: 'actuation', foundValue: 50 }
    const m3 = { switchSlug: 'a', field: 'bottomOut', foundValue: 50 }
    assert.equal(claimKey('slug', m1), claimKey('slug', m2))
    assert.notEqual(claimKey('slug', m1), claimKey('slug', m3))
  })
})

describe('alreadyFiled — deduplication', () => {
  test('returns true when a pending row exists for the same claim', () => {
    const mismatch = { switchSlug: 'gateron-oil-king', field: 'actuation', foundValue: 50 }
    const audit = `### [ ] [content] [3.6] test-article — Gateron Oil King spring-weight citation disagrees with data/switches/gateron-oil-king.json
- category: content
- filed: 2026-10-31 by content-fact-audit.mjs — ${claimKey('test-article', mismatch)}
`
    assert.equal(alreadyFiled(audit, 'test-article', mismatch), true)
  })

  test('returns false when the row is already checked off ([x])', () => {
    const mismatch = { switchSlug: 'gateron-oil-king', field: 'actuation', foundValue: 50 }
    const audit = `### [x] [content] [3.6] test-article — Gateron Oil King spring-weight citation disagrees with data/switches/gateron-oil-king.json
- filed: 2026-10-31 by content-fact-audit.mjs — ${claimKey('test-article', mismatch)}
`
    assert.equal(alreadyFiled(audit, 'test-article', mismatch), false)
  })

  test('returns false when no matching claim exists', () => {
    assert.equal(
      alreadyFiled('', 'test-article', { switchSlug: 'a', field: 'actuation', foundValue: 50 }),
      false,
    )
  })

  test('does not dedupe a different claim on the same article', () => {
    const m1 = { switchSlug: 'gateron-oil-king', field: 'actuation', foundValue: 50 }
    const m2 = { switchSlug: 'gateron-oil-king', field: 'bottomOut', foundValue: 60 }
    const audit = `### [ ] [content] [3.6] test-article — claim one
- filed: 2026-10-31 by content-fact-audit.mjs — ${claimKey('test-article', m1)}
`
    assert.equal(alreadyFiled(audit, 'test-article', m2), false)
  })
})
