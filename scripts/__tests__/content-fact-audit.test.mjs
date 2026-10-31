// scripts/__tests__/content-fact-audit.test.mjs
//
// Unit tests for scripts/content-fact-audit.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
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
  checkNewsletter,
  extractNominalYear,
  findTrendScoreNumbers,
  findRowNameMentions,
  findTrendScoreMismatches,
  formatAuditRow,
  describeMismatch,
  alreadyFiled,
  claimKey,
  extractNominalDate,
  resolveCurrentIsoWeek,
  subtractIsoWeeks,
  findWeeksAgoClaims,
  findStreakClaims,
  findWeeksAgoMismatches,
  buildWeekScoreSeries,
  findStreakMismatches,
} = __test

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')

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

function tmpMdxNamed(content, fileName) {
  const dir = mkdtempSync(join(tmpdir(), 'cfa-test-'))
  const filePath = join(dir, fileName)
  writeFileSync(filePath, content, 'utf8')
  return filePath
}

// Resolver stub for findTrendScoreMismatches — a plain object keyed by week
// number, mirroring the shape resolveTrendWeek produces from disk.
function stubResolveWeek(weeks) {
  return (weekNum) => weeks[weekNum] || null
}

// Resolver stub for findWeeksAgoMismatches / findStreakMismatches — keyed by
// full ISO week string ("2026-W31"), mirroring resolveTrendWeekFile's shape.
function stubResolveIsoWeek(weeks) {
  return (isoWeek) => weeks[isoWeek] || null
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

// ── Tracker-score citations (chunk 01.2, acceptance A2) ──────────────────────

const ALICE_W35 = { isoWeek: '2026-W35', rows: [{ name: 'Alice layout', score: -66 }] }
const ALICE_W42 = { isoWeek: '2026-W42', rows: [{ name: 'Alice layout', score: 0 }] }

describe('findTrendScoreNumbers', () => {
  test('matches a bare signed/unsigned number', () => {
    const nums = findTrendScoreNumbers('the score sat at -40 this week, up from 12 last week')
    assert.deepEqual(nums.map((n) => n.value), [-40, 12])
  })

  test('excludes a 4-digit year-like number', () => {
    const nums = findTrendScoreNumbers('the window ending W19 2026 landed at -18 overall')
    assert.deepEqual(nums.map((n) => n.value), [-18])
  })

  test('excludes a number immediately followed by "percent" or "%"', () => {
    const nums = findTrendScoreNumbers('Alice is down 18 percent and Mode Designs is up 24%')
    assert.deepEqual(nums, [])
  })

  test('excludes a number embedded in an alphanumeric product token', () => {
    const nums = findTrendScoreNumbers('Keychron shipped the B40 75% and the QK75 kit at a score of -5')
    assert.deepEqual(nums.map((n) => n.value), [-5])
  })

  test('excludes a calendar day-of-month following a month name', () => {
    const nums = findTrendScoreNumbers('tracking at a score of 72 on the week of August 24')
    assert.deepEqual(nums.map((n) => n.value), [72])
  })

  test('excludes a number immediately following "g"/"gram(s)"', () => {
    const nums = findTrendScoreNumbers('the switch runs 55g actuation, scored at -12 this week')
    assert.deepEqual(nums.map((n) => n.value), [-12])
  })
})

describe('findRowNameMentions', () => {
  test('finds a case-insensitive literal mention', () => {
    const body = "Alice layout's score climbed again this week."
    assert.deepEqual(findRowNameMentions(body, 'Alice layout'), [0])
  })

  test('does not match a name embedded in a longer word', () => {
    const body = 'AliceLayoutCustom shipped a new colorway.'
    assert.deepEqual(findRowNameMentions(body, 'Alice layout'), [])
  })

  test('excludes a mention that is only a markdown link label to another article', () => {
    const body =
      'attention shifts to the [GMK CYL OG Extensions](/article/gmk-cyl-og-extensions-interest-check) interest check'
    assert.deepEqual(findRowNameMentions(body, 'GMK CYL OG Extensions'), [])
  })

  test('still matches plain-text mentions outside of a link', () => {
    const body = 'GMK CYL OG Extensions climbed to 70 from 62 this week.'
    assert.deepEqual(findRowNameMentions(body, 'GMK CYL OG Extensions'), [0])
  })
})

describe('findTrendScoreMismatches — core resolve-then-diff behavior', () => {
  test('does not flag a correct citation (real-corpus calibration shape)', () => {
    const body =
      "Alice layout's score on thock's tracker has climbed every week for eight consecutive readings, from a trough of -66 at W35 to a flat 0 at W42."
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({ 35: ALICE_W35, 42: ALICE_W42 }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('flags a mismatched score citation', () => {
    const body = "Alice layout's score read -40 in W35 this week, a sharp miss from where it had been."
    const mismatches = findTrendScoreMismatches(body, stubResolveWeek({ 35: ALICE_W35 }))
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].isoWeek, '2026-W35')
    assert.equal(mismatches[0].rowName, 'Alice layout')
    assert.equal(mismatches[0].foundValue, -40)
    assert.equal(mismatches[0].expectedValue, -66)
  })

  test('silently skips an unresolvable week (no matching trend file)', () => {
    const body = "Alice layout's score sat at a reading of -20 in W99 this week."
    const mismatches = findTrendScoreMismatches(body, stubResolveWeek({}))
    assert.deepEqual(mismatches, [])
  })

  test('skips when no named row resolves nearby (ambiguous — ease of guessing is not worth a false positive)', () => {
    const body = "The tracker's score sat at a reading of -20 in W35 this week, with no further context given."
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({ 35: { isoWeek: '2026-W35', rows: [{ name: 'Mode Designs', score: 10 }] } }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('skips a tight walked-series number list rather than guessing list position', () => {
    const body =
      'thock has recorded Alice layout climbing every single week on its score from W35 through W42: -66, -50, -40, -30, -18, -8, -5, 0.'
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({ 35: ALICE_W35, 42: ALICE_W42 }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('skips when a sentence has more candidate numbers than distinct weeks (comparison ambiguity)', () => {
    // Real-corpus shape (thock-weekly-012.mdx): one week token, two
    // numbers describing different points in time — proximity alone can't
    // tell which one the token actually anchors.
    const body = "Mode Designs' score is down to 72 after peaking at 98 two weeks back, in the W42 reading alone."
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({ 42: { isoWeek: '2026-W42', rows: [{ name: 'Mode Designs', score: 72 }] } }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('skips a repeated week token within one sentence rather than guessing which occurrence it is', () => {
    // Real-corpus shape (computex-2026-keyboard-highlights.mdx): the same
    // week token appears twice in one sentence (once as a citation, once
    // as a chart-annotation callback), and naive nearest-number-to-token
    // attribution pulls the wrong number toward the second occurrence.
    const body =
      'Hall Effect scores climbed from a score of 55 in W21 to a score of 76 in W25, with a marker at W21 labeled Computex.'
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({
        21: { isoWeek: '2026-W21', rows: [{ name: 'Hall Effect', score: 55 }] },
        25: { isoWeek: '2026-W25', rows: [{ name: 'Hall Effect', score: 76 }] },
      }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('requires an explicit "score" cue before attempting a citation', () => {
    const body = 'Prototypist carried 19 concurrent group buys in W20, the most of any vendor that week.'
    const mismatches = findTrendScoreMismatches(
      body,
      stubResolveWeek({ 20: { isoWeek: '2026-W20', rows: [{ name: 'Prototypist', score: 6 }] } }),
    )
    assert.deepEqual(mismatches, [])
  })
})

describe('checkNewsletter / checkArticle — tracker-score wiring end to end', () => {
  test('checkNewsletter finds no mismatch against the real thock-weekly-013.mdx calibration text', () => {
    // The real shipped newsletter cites Alice layout's score moving from
    // -66 at W35 to 0 at W42 — both true against the real
    // data/trends/2026-W35.json and data/trends/2026-W42.json records.
    // Regression guard: this exact sentence shape is what the chunk 01.2
    // false-positive guards above were calibrated against.
    const filePath = join(
      REPO_ROOT,
      'apps',
      'web',
      'src',
      'content',
      'newsletters',
      'thock-weekly-013.mdx',
    )
    const { slug, mismatches } = checkNewsletter(filePath)
    assert.equal(slug, 'thock-weekly-013')
    assert.deepEqual(mismatches, [])
  })

  test('checkArticle finds no mismatch against the real alice-layout-recovery.mdx calibration text', () => {
    const filePath = join(
      REPO_ROOT,
      'apps',
      'web',
      'src',
      'content',
      'articles',
      'alice-layout-recovery.mdx',
    )
    const { slug, mismatches } = checkArticle(filePath)
    assert.equal(slug, 'alice-layout-recovery')
    assert.deepEqual(mismatches, [])
  })

  test('checkNewsletter tags mismatches with dir: newsletters via a temp fixture', () => {
    const fm = `slug: test-newsletter
title: "thock weekly — issue 99"
issue: 99
publishedAt: '2026-10-27T09:00:00.000Z'`
    const body =
      "Alice layout's score read -40 in W35 this week, a sharp miss from where it had been."
    const filePath = tmpMdxNamed(makeMdx(fm, body), 'test-newsletter.mdx')
    try {
      const { slug, mismatches } = checkNewsletter(filePath)
      assert.equal(slug, 'test-newsletter')
      // data/trends/2026-W35.json is a real file with a real Alice layout
      // row (score -66) — -40 disagrees with it.
      assert.equal(mismatches.length, 1)
      assert.equal(mismatches[0].kind, 'trend-score')
      assert.equal(mismatches[0].dir, 'newsletters')
      assert.equal(mismatches[0].isoWeek, '2026-W35')
      assert.equal(mismatches[0].expectedValue, -66)
    } finally {
      cleanup(filePath)
    }
  })
})

describe('extractNominalYear', () => {
  test('parses the year off publishedAt', () => {
    assert.equal(extractNominalYear("publishedAt: '2026-10-27T09:00:00.000Z'"), 2026)
  })

  test('parses the year off a bare date field', () => {
    assert.equal(extractNominalYear('date: 2025-01-02'), 2025)
  })

  test('returns null when neither field is present', () => {
    assert.equal(extractNominalYear('slug: foo\ntitle: Bar'), null)
  })
})

describe('describeMismatch / claimKey / formatAuditRow — trend-score kind', () => {
  const trendMismatch = {
    kind: 'trend-score',
    dir: 'newsletters',
    isoWeek: '2026-W35',
    rowName: 'Alice layout',
    foundValue: -40,
    expectedValue: -66,
  }

  test('describeMismatch names the row, the week, and the real score', () => {
    const desc = describeMismatch(trendMismatch)
    assert.match(desc, /Alice layout/)
    assert.match(desc, /2026-W35/)
    assert.match(desc, /-40/)
    assert.match(desc, /-66/)
  })

  test('claimKey uses a distinct trend shape that cannot collide with a switch-citation key', () => {
    const switchMismatch = { switchSlug: 'alice layout', field: 'actuation', foundValue: -40 }
    assert.notEqual(claimKey('slug', trendMismatch), claimKey('slug', switchMismatch))
    assert.match(claimKey('slug', trendMismatch), /:trend:/)
  })

  test('formatAuditRow files a content-category row pointing at the newsletters dir', () => {
    const row = formatAuditRow('test-newsletter', trendMismatch, new Date('2026-10-31'))
    assert.match(row, /### \[ \] \[content\] \[3\.6\]/)
    assert.match(row, /tracker-score citation/)
    assert.match(row, /data\/trends\/2026-W35\.json/)
    assert.match(row, /apps\/web\/src\/content\/newsletters\/test-newsletter\.mdx/)
  })
})

// ── "N weeks ago" / streak-length sub-shape (chunk 01.3, acceptance A3) ──────

describe('extractNominalDate / resolveCurrentIsoWeek', () => {
  test('resolves the ISO week off a full publishedAt timestamp', () => {
    assert.equal(resolveCurrentIsoWeek("publishedAt: '2026-09-26T09:00:00.000Z'"), '2026-W39')
  })

  test('resolves the ISO week off a bare date field', () => {
    assert.equal(resolveCurrentIsoWeek('date: 2026-07-20'), '2026-W30')
  })

  test('returns null when neither field is present', () => {
    assert.equal(extractNominalDate('slug: foo\ntitle: Bar'), null)
    assert.equal(resolveCurrentIsoWeek('slug: foo\ntitle: Bar'), null)
  })

  test('returns null for an unparseable date value', () => {
    assert.equal(extractNominalDate("publishedAt: 'not-a-date'"), null)
  })
})

describe('subtractIsoWeeks', () => {
  test('subtracts weeks within the same year', () => {
    assert.equal(subtractIsoWeeks('2026-W39', 8), '2026-W31')
    assert.equal(subtractIsoWeeks('2026-W30', 8), '2026-W22')
    assert.equal(subtractIsoWeeks('2026-W31', 1), '2026-W30')
  })

  test('handles a Dec/Jan year rollover', () => {
    assert.equal(subtractIsoWeeks('2026-W02', 5), '2025-W49')
    assert.equal(subtractIsoWeeks('2026-W01', 1), '2025-W52')
  })

  test('returns null for a malformed ISO week string', () => {
    assert.equal(subtractIsoWeeks('not-a-week', 4), null)
  })
})

describe('findWeeksAgoClaims', () => {
  test('matches "from <value> <word> weeks ago/back/earlier"', () => {
    const claims = findWeeksAgoClaims(
      'up to 94 from 60 eight weeks ago, and separately up from 39 eight weeks earlier, also from 96 eight weeks back',
    )
    assert.deepEqual(
      claims.map((c) => [c.pastValue, c.weeksAgo]),
      [
        [60, 8],
        [39, 8],
        [96, 8],
      ],
    )
  })

  test('treats "from <value> last week" as a special-cased one-week-ago claim', () => {
    const claims = findWeeksAgoClaims('ticked up to 82 from 80 last week, with Engadget covering it')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].pastValue, 80)
    assert.equal(claims[0].weeksAgo, 1)
  })

  test('matches smaller number words too', () => {
    const claims = findWeeksAgoClaims('up from 91 two weeks ago and up from 55 four weeks ago')
    assert.deepEqual(
      claims.map((c) => [c.pastValue, c.weeksAgo]),
      [
        [91, 2],
        [55, 4],
      ],
    )
  })

  test('skips an unresolvable number word rather than guessing', () => {
    const claims = findWeeksAgoClaims('up sharply from a much lower score just weeks back')
    assert.deepEqual(claims, [])
  })

  test('does not match "N weeks ago" without a "from <value>" anchor', () => {
    const claims = findWeeksAgoClaims(
      'Three weeks ago thock closed a piece with two open questions about the market.',
    )
    assert.deepEqual(claims, [])
  })

  test('the claim index points at the numeric value, not the word "from"', () => {
    const body = 'up to 94 from 60 eight weeks ago'
    const claims = findWeeksAgoClaims(body)
    assert.equal(claims[0].index, body.indexOf('60'))
  })
})

describe('findStreakClaims', () => {
  test('matches an "up" streak-break claim', () => {
    const claims = findStreakClaims('still net negative, but its first gain in five weeks — as noted')
    assert.deepEqual(claims, [{ index: claims[0].index, direction: 'up', weeksClaimed: 5 }])
  })

  test('matches a "down" streak-break claim', () => {
    const claims = findStreakClaims('its first drop in three weeks came as a surprise')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].direction, 'down')
    assert.equal(claims[0].weeksClaimed, 3)
  })

  test('recognizes rise/increase as "up" and decline/fall as "down"', () => {
    assert.equal(findStreakClaims('its first rise in six weeks')[0].direction, 'up')
    assert.equal(findStreakClaims('its first increase in six weeks')[0].direction, 'up')
    assert.equal(findStreakClaims('its first decline in six weeks')[0].direction, 'down')
    assert.equal(findStreakClaims('its first fall in six weeks')[0].direction, 'down')
  })

  test('skips an unresolvable number word', () => {
    assert.deepEqual(findStreakClaims('its first gain in several weeks'), [])
  })
})

describe('findWeeksAgoMismatches — core resolve-then-diff behavior', () => {
  const CURRENT = {
    isoWeek: '2026-W39',
    rows: [
      { name: 'Keychron', score: 100 },
      { name: 'Cherry (MX + XTRFY)', score: 5 },
    ],
  }
  const PAST_W31 = {
    isoWeek: '2026-W31',
    rows: [
      { name: 'Keychron', score: 94 },
      { name: 'Cherry (MX + XTRFY)', score: -10 },
    ],
  }

  test('flags a mismatched "N weeks ago" citation (real thock-weekly-011 shape)', () => {
    const body = "Keychron holds the tracker's ceiling this week at a flat 100, up from 96 eight weeks ago, sustained by broad lineup presence."
    const mismatches = findWeeksAgoMismatches(
      body,
      '2026-W39',
      stubResolveIsoWeek({ '2026-W39': CURRENT, '2026-W31': PAST_W31 }),
    )
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].rowName, 'Keychron')
    assert.equal(mismatches[0].pastIsoWeek, '2026-W31')
    assert.equal(mismatches[0].weeksAgo, 8)
    assert.equal(mismatches[0].foundValue, 96)
    assert.equal(mismatches[0].expectedValue, 94)
  })

  test('does not flag a correct "N weeks ago" citation', () => {
    const body = 'Cherry (MX + XTRFY) continues its slow climb out of the hole, up to 5 from -10 eight weeks ago.'
    const mismatches = findWeeksAgoMismatches(
      body,
      '2026-W39',
      stubResolveIsoWeek({ '2026-W39': CURRENT, '2026-W31': PAST_W31 }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('returns no claims and does nothing when currentIsoWeek is null', () => {
    const body = 'Keychron holds the tracker ceiling, up from 96 eight weeks ago.'
    assert.deepEqual(findWeeksAgoMismatches(body, null, stubResolveIsoWeek({})), [])
  })

  test('skips when the current week itself is unresolvable', () => {
    const body = 'Keychron holds the tracker ceiling, up from 96 eight weeks ago.'
    assert.deepEqual(findWeeksAgoMismatches(body, '2026-W39', stubResolveIsoWeek({})), [])
  })

  test('skips when the past week file is unresolvable (missing archive)', () => {
    const body = 'Keychron holds the tracker ceiling, up from 96 eight weeks ago.'
    const mismatches = findWeeksAgoMismatches(
      body,
      '2026-W39',
      stubResolveIsoWeek({ '2026-W39': CURRENT }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('skips when the row does not resolve in the past week (renamed/missing — real Hall Effect shape)', () => {
    const body = 'Keychron holds the tracker ceiling, up from 96 eight weeks ago.'
    const pastWithoutRow = { isoWeek: '2026-W31', rows: [{ name: 'Some Other Row', score: 10 }] }
    const mismatches = findWeeksAgoMismatches(
      body,
      '2026-W39',
      stubResolveIsoWeek({ '2026-W39': CURRENT, '2026-W31': pastWithoutRow }),
    )
    assert.deepEqual(mismatches, [])
  })

  test('skips an ambiguous sentence mentioning two distinct row names (real "Keychron x Yusha Kobo" shape)', () => {
    // Real-corpus shape (thock-weekly-011.mdx): "Split/Ergo layout sits at
    // 99, up from 85 eight weeks ago ... on the strength of the Keychron x
    // Yusha Kobo 'Valkey Orb' ... announcement" — "Keychron" is a
    // second current-week row name that happens to also appear in the same
    // sentence, purely incidentally. Two distinct row-name candidates in
    // one sentence means the claim can't be safely attributed.
    const body =
      'Split/Ergo layout sits at 99, up from 85 eight weeks ago, on the strength of the Keychron x Yusha Kobo announcement.'
    const current = {
      isoWeek: '2026-W39',
      rows: [
        { name: 'Keychron', score: 100 },
        { name: 'Split/Ergo layout', score: 99 },
      ],
    }
    const past = { isoWeek: '2026-W31', rows: [{ name: 'Split/Ergo layout', score: 85 }] }
    const mismatches = findWeeksAgoMismatches(
      body,
      '2026-W39',
      stubResolveIsoWeek({ '2026-W39': current, '2026-W31': past }),
    )
    assert.deepEqual(mismatches, [])
  })
})

describe('buildWeekScoreSeries', () => {
  const MX2A_WEEKS = {
    '2026-W30': { isoWeek: '2026-W30', rows: [{ name: 'Cherry MX2A', score: -46 }] },
    '2026-W29': { isoWeek: '2026-W29', rows: [{ name: 'Cherry MX2A', score: -50 }] },
    '2026-W28': { isoWeek: '2026-W28', rows: [{ name: 'Cherry MX2A', score: -42 }] },
    '2026-W27': { isoWeek: '2026-W27', rows: [{ name: 'Cherry MX2A', score: -39 }] },
    '2026-W26': { isoWeek: '2026-W26', rows: [{ name: 'Cherry MX2A', score: -36 }] },
    '2026-W25': { isoWeek: '2026-W25', rows: [{ name: 'Cherry MX2A', score: -32 }] },
    '2026-W24': { isoWeek: '2026-W24', rows: [{ name: 'Cherry MX2A', score: -30 }] },
    '2026-W23': { isoWeek: '2026-W23', rows: [{ name: 'Cherry MX2A', score: -33 }] },
  }

  test('walks backward building a same-row score series until data runs out', () => {
    const series = buildWeekScoreSeries('2026-W30', 'Cherry MX2A', stubResolveIsoWeek(MX2A_WEEKS), 10)
    assert.deepEqual(
      series.map((s) => s.score),
      [-46, -50, -42, -39, -36, -32, -30, -33],
    )
  })

  test('stops early when a week file is missing', () => {
    const series = buildWeekScoreSeries('2026-W30', 'Cherry MX2A', stubResolveIsoWeek(MX2A_WEEKS), 2)
    assert.equal(series.length, 3)
  })

  test('stops when the row is renamed/missing partway through', () => {
    const partial = {
      '2026-W30': MX2A_WEEKS['2026-W30'],
      '2026-W29': { isoWeek: '2026-W29', rows: [{ name: 'A Different Row', score: 1 }] },
    }
    const series = buildWeekScoreSeries('2026-W30', 'Cherry MX2A', stubResolveIsoWeek(partial), 10)
    assert.equal(series.length, 1)
  })
})

describe('findStreakMismatches — core resolve-then-diff behavior', () => {
  const MX2A_WEEKS = {
    '2026-W30': { isoWeek: '2026-W30', rows: [{ name: 'Cherry MX2A', score: -46 }] },
    '2026-W29': { isoWeek: '2026-W29', rows: [{ name: 'Cherry MX2A', score: -50 }] },
    '2026-W28': { isoWeek: '2026-W28', rows: [{ name: 'Cherry MX2A', score: -42 }] },
    '2026-W27': { isoWeek: '2026-W27', rows: [{ name: 'Cherry MX2A', score: -39 }] },
    '2026-W26': { isoWeek: '2026-W26', rows: [{ name: 'Cherry MX2A', score: -36 }] },
    '2026-W25': { isoWeek: '2026-W25', rows: [{ name: 'Cherry MX2A', score: -32 }] },
    '2026-W24': { isoWeek: '2026-W24', rows: [{ name: 'Cherry MX2A', score: -30 }] },
    '2026-W23': { isoWeek: '2026-W23', rows: [{ name: 'Cherry MX2A', score: -33 }] },
  }

  test('does not flag a correct streak-length claim (real thock-weekly-004 shape)', () => {
    // Real data/trends/ shape: MX2A's last gain before this week's +4 move
    // was 5 weekly readings earlier — "its first gain in five weeks" is
    // accurate.
    const body = 'Cherry MX2A ticked up to -46 this week — still net negative, but its first gain in five weeks.'
    const mismatches = findStreakMismatches(body, '2026-W30', stubResolveIsoWeek(MX2A_WEEKS))
    assert.deepEqual(mismatches, [])
  })

  test('flags a mismatched streak-length claim', () => {
    const body = 'Cherry MX2A ticked up to -46 this week — still net negative, but its first gain in three weeks.'
    const mismatches = findStreakMismatches(body, '2026-W30', stubResolveIsoWeek(MX2A_WEEKS))
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].rowName, 'Cherry MX2A')
    assert.equal(mismatches[0].direction, 'up')
    assert.equal(mismatches[0].foundValue, 3)
    assert.equal(mismatches[0].expectedValue, 5)
  })

  test('skips when this week\'s own move does not match the claimed direction', () => {
    const body = 'Cherry MX2A ticked up to -46 this week — still net negative, but its first drop in five weeks.'
    const mismatches = findStreakMismatches(body, '2026-W30', stubResolveIsoWeek(MX2A_WEEKS))
    assert.deepEqual(mismatches, [])
  })

  test('skips when the archived walk runs out of data before the streak breaks', () => {
    const shortHistory = {
      '2026-W30': MX2A_WEEKS['2026-W30'],
      '2026-W29': MX2A_WEEKS['2026-W29'],
      '2026-W28': MX2A_WEEKS['2026-W28'],
    }
    const body = 'Cherry MX2A ticked up to -46 this week — still net negative, but its first gain in five weeks.'
    const mismatches = findStreakMismatches(body, '2026-W30', stubResolveIsoWeek(shortHistory))
    assert.deepEqual(mismatches, [])
  })

  test('returns no claims when currentIsoWeek is null', () => {
    const body = 'Cherry MX2A ticked up to -46 this week, its first gain in five weeks.'
    assert.deepEqual(findStreakMismatches(body, null, stubResolveIsoWeek(MX2A_WEEKS)), [])
  })
})

describe('describeMismatch / claimKey / formatAuditRow — trend-weeks-ago kind', () => {
  const weeksAgoMismatch = {
    kind: 'trend-weeks-ago',
    dir: 'newsletters',
    rowName: 'Keychron',
    currentIsoWeek: '2026-W39',
    pastIsoWeek: '2026-W31',
    weeksAgo: 8,
    foundValue: 96,
    expectedValue: 94,
  }

  test('describeMismatch names the row, the week-count, and the real score', () => {
    const desc = describeMismatch(weeksAgoMismatch)
    assert.match(desc, /Keychron/)
    assert.match(desc, /2026-W31/)
    assert.match(desc, /96/)
    assert.match(desc, /94/)
  })

  test('claimKey uses a distinct shape disjoint from trend-score and switch keys', () => {
    const trendScoreMismatch = { kind: 'trend-score', isoWeek: '2026-W31', rowName: 'Keychron', foundValue: 96 }
    const switchMismatch = { switchSlug: 'keychron', field: 'actuation', foundValue: 96 }
    assert.notEqual(claimKey('slug', weeksAgoMismatch), claimKey('slug', trendScoreMismatch))
    assert.notEqual(claimKey('slug', weeksAgoMismatch), claimKey('slug', switchMismatch))
    assert.match(claimKey('slug', weeksAgoMismatch), /:trend-weeks-ago:/)
  })

  test('formatAuditRow files a content-category row pointing at the newsletters dir', () => {
    const row = formatAuditRow('test-newsletter', weeksAgoMismatch, new Date('2026-10-31'))
    assert.match(row, /### \[ \] \[content\] \[3\.6\]/)
    assert.match(row, /"N weeks ago" citation/)
    assert.match(row, /data\/trends\/2026-W31\.json/)
    assert.match(row, /apps\/web\/src\/content\/newsletters\/test-newsletter\.mdx/)
  })
})

describe('describeMismatch / claimKey / formatAuditRow — trend-streak kind', () => {
  const streakMismatch = {
    kind: 'trend-streak',
    dir: 'newsletters',
    rowName: 'Cherry MX2A',
    currentIsoWeek: '2026-W30',
    direction: 'up',
    foundValue: 3,
    expectedValue: 5,
  }

  test('describeMismatch names the row, the claimed gap, and the real gap', () => {
    const desc = describeMismatch(streakMismatch)
    assert.match(desc, /Cherry MX2A/)
    assert.match(desc, /first gain/)
    assert.match(desc, /3 weeks/)
    assert.match(desc, /5 week/)
  })

  test('claimKey uses a distinct shape disjoint from trend-weeks-ago and switch keys', () => {
    const weeksAgoMismatch = { kind: 'trend-weeks-ago', pastIsoWeek: '2026-W22', rowName: 'Cherry MX2A', foundValue: 3 }
    assert.notEqual(claimKey('slug', streakMismatch), claimKey('slug', weeksAgoMismatch))
    assert.match(claimKey('slug', streakMismatch), /:trend-streak:/)
  })

  test('formatAuditRow files a content-category row pointing at the newsletters dir', () => {
    const row = formatAuditRow('test-newsletter', streakMismatch, new Date('2026-10-31'))
    assert.match(row, /### \[ \] \[content\] \[3\.6\]/)
    assert.match(row, /streak-length citation/)
    assert.match(row, /apps\/web\/src\/content\/newsletters\/test-newsletter\.mdx/)
  })
})

describe('checkNewsletter / checkArticle — "N weeks ago" / streak wiring end to end', () => {
  test('checkNewsletter catches the real thock-weekly-011.mdx "N weeks ago" drift (Keychron + Cherry)', () => {
    // Real shipped content: both rows cite "eight weeks ago" values that
    // match that week's own `spark[0]` convenience field but disagree with
    // the real archived data/trends/2026-W31.json record for that row —
    // see the comment above findWeeksAgoMismatches for why the archived
    // file (not spark) is treated as ground truth.
    const filePath = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters', 'thock-weekly-011.mdx')
    const { slug, mismatches } = checkNewsletter(filePath)
    assert.equal(slug, 'thock-weekly-011')
    const weeksAgo = mismatches.filter((m) => m.kind === 'trend-weeks-ago')
    assert.equal(weeksAgo.length, 2)
    const byRow = Object.fromEntries(weeksAgo.map((m) => [m.rowName, m]))
    assert.equal(byRow['Keychron'].foundValue, 96)
    assert.equal(byRow['Keychron'].expectedValue, 94)
    assert.equal(byRow['Cherry (MX + XTRFY)'].foundValue, -6)
    assert.equal(byRow['Cherry (MX + XTRFY)'].expectedValue, -10)
  })

  test('checkArticle catches the real hall-effect-rapid-trigger-plateau.mdx "N weeks ago" drift', () => {
    const filePath = join(
      REPO_ROOT,
      'apps',
      'web',
      'src',
      'content',
      'articles',
      'hall-effect-rapid-trigger-plateau.mdx',
    )
    const { slug, mismatches } = checkArticle(filePath)
    assert.equal(slug, 'hall-effect-rapid-trigger-plateau')
    const weeksAgo = mismatches.filter((m) => m.kind === 'trend-weeks-ago')
    assert.equal(weeksAgo.length, 1)
    assert.equal(weeksAgo[0].rowName, 'Gateron Oil King')
    assert.equal(weeksAgo[0].foundValue, 39)
    assert.equal(weeksAgo[0].expectedValue, 40)
  })

  test('checkNewsletter finds no "N weeks ago" / streak mismatch against the real thock-weekly-004.mdx calibration text', () => {
    // Real shipped content calibrates both shapes at once: "up to 94 from
    // 60 eight weeks ago" (Hall Effect/Rapid Trigger) and "its first gain
    // in five weeks" (Cherry MX2A) are both accurate against the real
    // archived data/trends/ series.
    const filePath = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters', 'thock-weekly-004.mdx')
    const { slug, mismatches } = checkNewsletter(filePath)
    assert.equal(slug, 'thock-weekly-004')
    const relevant = mismatches.filter((m) => m.kind === 'trend-weeks-ago' || m.kind === 'trend-streak')
    assert.deepEqual(relevant, [])
  })

  test('checkNewsletter tags a "trend-weeks-ago" mismatch with dir: newsletters via a temp fixture', () => {
    const fm = `slug: test-newsletter
title: "thock weekly — issue 99"
issue: 99
publishedAt: '2026-09-26T09:00:00.000Z'`
    const body =
      "Keychron holds the tracker's ceiling this week at a flat 100, up from 96 eight weeks ago, sustained by broad lineup presence."
    const filePath = tmpMdxNamed(makeMdx(fm, body), 'test-newsletter.mdx')
    try {
      const { slug, mismatches } = checkNewsletter(filePath)
      assert.equal(slug, 'test-newsletter')
      // data/trends/2026-W31.json is a real file with a real Keychron row
      // (score 94) — 96 disagrees with it.
      const weeksAgo = mismatches.filter((m) => m.kind === 'trend-weeks-ago')
      assert.equal(weeksAgo.length, 1)
      assert.equal(weeksAgo[0].dir, 'newsletters')
      assert.equal(weeksAgo[0].pastIsoWeek, '2026-W31')
      assert.equal(weeksAgo[0].expectedValue, 94)
    } finally {
      cleanup(filePath)
    }
  })
})
