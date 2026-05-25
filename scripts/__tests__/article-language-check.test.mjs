// scripts/__tests__/article-language-check.test.mjs
//
// Unit tests for scripts/article-language-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { __test } from '../article-language-check.mjs'

const { extractBody, checkFile, loadPatterns, escapeRegex } = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMdx(frontmatter, body) {
  return `---\n${frontmatter}\n---\n${body}`
}

// Write a temp MDX file and return the path.
function tmpMdx(content) {
  const dir = mkdtempSync(join(tmpdir(), 'alc-test-'))
  const filePath = join(dir, 'test-article.mdx')
  writeFileSync(filePath, content, 'utf8')
  return filePath
}

// ── extractBody ───────────────────────────────────────────────────────────────

describe('extractBody', () => {
  test('strips frontmatter and returns correct body start line', () => {
    const content = '---\nslug: foo\ntitle: Foo\n---\nBody line 1\nBody line 2\n'
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.deepEqual(bodyLines, ['Body line 1', 'Body line 2', ''])
    // frontmatter is lines 1-4 (---\nslug\ntitle\n---), body starts at line 5
    assert.equal(bodyStartLine, 5)
  })

  test('handles content with no frontmatter', () => {
    const content = 'Just body text\nMore body\n'
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.deepEqual(bodyLines, ['Just body text', 'More body', ''])
    assert.equal(bodyStartLine, 1)
  })

  test('body start line is correct for multi-line frontmatter', () => {
    const fm = 'slug: foo\ntitle: Bar\nauthor: thock\npillar: news\n'
    const content = `---\n${fm}---\nbody starts here\n`
    const { bodyLines, bodyStartLine } = extractBody(content)
    assert.equal(bodyLines[0], 'body starts here')
    // frontmatter: line 1 (---), 4 fm lines (2-5), closing --- (line 6) → body starts line 7
    assert.equal(bodyStartLine, 7)
  })
})

// ── escapeRegex ───────────────────────────────────────────────────────────────

describe('escapeRegex', () => {
  test('escapes special regex characters', () => {
    const re = new RegExp(escapeRegex('check back (soon)'), 'gi')
    assert.ok(re.test('please check back (soon)'))
    assert.ok(!re.test('check back soon'))
  })
})

// ── Positive test: MDX body with temporal anti-pattern → violation detected ──

describe('checkFile — positive cases (violations expected)', () => {
  const patterns = loadPatterns()

  test('detects "will revisit" unfulfillable promise', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nWe will revisit when the numbers land.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.length > 0, 'expected at least one violation')
    assert.ok(
      violations.some((v) => v.patternId === 'unfulfillable-revisit'),
      'expected unfulfillable-revisit violation'
    )
  })

  test('detects "report back" unfulfillable promise', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      "\nWe'll report back when builds begin shipping.\n"
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'unfulfillable-report-back'))
  })

  test('detects "check back" implied future update', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nCheck back for updates as the buy closes.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'unfulfillable-check-back'))
  })

  test('detects "the buy is live" stale status phrase', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nThe buy is live as of 2026-05-15.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'stale-buy-live'))
  })

  test('detects "approximately 2026" imprecise date year', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: guides\npublishedAt: 2026-05-01',
      '\nLead time is listed as approximately 2026.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'approximate-date-year'))
  })

  test('detects "approximately Q4" imprecise quarter', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nLead time is listed as approximately Q4 2026.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'approximate-date-quarter'))
  })

  test('detects "4 weeks from now" relative time reference', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nThe board ships 4 weeks from now.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(violations.some((v) => v.patternId === 'relative-time-weeks'))
  })

  test('reports correct line number (skipping frontmatter)', () => {
    const fm = 'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01'
    const body = '\nFirst body line.\nWe will revisit when the data lands.\nThird line.\n'
    const content = `---\n${fm}\n---\n${body}`
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, loadPatterns())
    const v = violations.find((x) => x.patternId === 'unfulfillable-revisit')
    assert.ok(v, 'expected a revisit violation')
    // frontmatter: 1 (---) + 5 lines + 1 (---) = 7 lines; body starts at line 8
    // body line 2 (blank) = line 8, "First body line." = line 9,
    // "We will revisit..." = line 10
    assert.equal(v.line, 10, `expected line 10, got ${v.line}`)
  })

  test('does not detect violations in frontmatter', () => {
    // Put an anti-pattern in the lede (frontmatter field) — should not fire
    const content = `---\nslug: test\ntitle: Test\nlede: "We will revisit this topic."\nauthor: thock\n---\nClean body text.\n`
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, loadPatterns())
    assert.equal(violations.length, 0, 'expected no violations from frontmatter text')
  })
})

// ── Negative test: MDX body without violations → no violation ─────────────────

describe('checkFile — negative cases (no violations expected)', () => {
  const patterns = loadPatterns()

  test('clean article with absolute date phrasing passes', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nThe buy opened on 2026-05-15 and runs through 2026-06-20.\nFollow the trends tracker for post-close movement data.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, 'expected no violations')
  })

  test('"approximately 8mm" measurement is not flagged (not a date)', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: deep-dives\npublishedAt: 2026-05-01',
      '\nThe profile is approximately 8mm tall at the home row.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, '"approximately 8mm" should not be flagged')
  })

  test('"approximately linear" adjective is not flagged', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: deep-dives\npublishedAt: 2026-05-01',
      '\nThe spring has an approximately linear force curve.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, '"approximately linear" should not be flagged')
  })

  test('past-tense tracker reference passes', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-01',
      '\nKeychron was at +30 on the tracker at the time this piece filed.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, 'past-tense tracker reference should pass')
  })

  test('"will" in non-promise context is not flagged', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: guides\npublishedAt: 2026-05-01',
      '\nThis technique will improve sound dampening in most builds.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, '"will" alone should not trigger unfulfillable-revisit')
  })

  test('"the W19 tracker" absolute anchor passes', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-05',
      '\nAlice is down 18 percent on the W19 tracker, with the trajectory unambiguously down.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, '"the W19 tracker" absolute anchor should pass')
  })
})

// ── relative-tracker-this-week ────────────────────────────────────────────────

describe('checkFile — relative-tracker-this-week pattern', () => {
  const patterns = loadPatterns()

  test('flags "this week\'s tracker" as a relative temporal reference', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-05',
      "\nAlice is down 18 percent on this week's tracker, with the trajectory down.\n"
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'relative-tracker-this-week'),
      'expected relative-tracker-this-week violation',
    )
  })

  test('"the W21 tracker" absolute form does not trigger the pattern', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-20',
      '\nHall Effect was at +55 on the W21 tracker this month.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, 'absolute week anchor should not trigger')
  })
})

// ── unfulfillable-stay-tuned ──────────────────────────────────────────────────

describe('checkFile — unfulfillable-stay-tuned pattern', () => {
  const patterns = loadPatterns()

  test('flags "stay tuned" as unfulfillable broadcast promise', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nStay tuned for updates as the buy progresses.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'unfulfillable-stay-tuned'),
      'expected unfulfillable-stay-tuned violation'
    )
  })
})

// ── unfulfillable-coming-soon ─────────────────────────────────────────────────

describe('checkFile — unfulfillable-coming-soon pattern', () => {
  const patterns = loadPatterns()

  test('flags "coming soon" as unfulfillable future-content promise', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nA full deep-dive on the switches is coming soon.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'unfulfillable-coming-soon'),
      'expected unfulfillable-coming-soon violation'
    )
  })
})

// ── approximate-date-month ────────────────────────────────────────────────────

describe('checkFile — approximate-date-month pattern', () => {
  const patterns = loadPatterns()

  test('flags "approximately June" as imprecise month-name date claim', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nEstimated delivery is approximately June 2026.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'approximate-date-month'),
      'expected approximate-date-month violation'
    )
  })
})

// ── relative-time-months ──────────────────────────────────────────────────────

describe('checkFile — relative-time-months pattern', () => {
  const patterns = loadPatterns()

  test('flags "3 months from now" as relative time reference', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nThe board ships 3 months from now per the vendor timeline.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'relative-time-months'),
      'expected relative-time-months violation'
    )
  })
})

// ── tracker-will ──────────────────────────────────────────────────────────────

describe('checkFile — tracker-will pattern', () => {
  const patterns = loadPatterns()

  test('flags "tracker will be watching" as unfulfillable forward-looking promise', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nThe tracker will be watching the close-week signal when the order books settle.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'tracker-will'),
      'expected tracker-will violation'
    )
  })

  test('"tracker had" past-tense does not trigger tracker-will', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-10',
      '\nThe tracker had the Cloud at +36 in W19.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, '"tracker had" should not trigger tracker-will')
  })
})

// ── tracker-will-md-link ──────────────────────────────────────────────────────

describe('checkFile — tracker-will-md-link pattern', () => {
  const patterns = loadPatterns()

  test('flags "[Trends Tracker](url) will" markdown-link form', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-01',
      '\nThe [Trends Tracker](/trends/tracker) will be watching the close-week signal.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'tracker-will-md-link'),
      'expected tracker-will-md-link violation for markdown-link form'
    )
  })

  test('"[Trends Tracker](url) to see" CTA form does not trigger the pattern', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-01',
      '\nFollow the [Trends Tracker](/trends/tracker) to see which lever the industry picks up next.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(
      violations.filter((v) => v.patternId === 'tracker-will-md-link').length,
      0,
      '"[Trends Tracker](url) to see" CTA form should not trigger tracker-will-md-link'
    )
  })
})

// ── tracker-href-bare-week ────────────────────────────────────────────────────

describe('checkFile — tracker-href-bare-week pattern', () => {
  const patterns = loadPatterns()

  test('flags "[W19 Trends Tracker](/trends/tracker)" as bare-week tracker link', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-01',
      '\nAlice dropped in the [W19 Trends Tracker](/trends/tracker) with no sign of recovery.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'tracker-href-bare-week'),
      'expected tracker-href-bare-week violation for W19 link text form'
    )
  })

  test('"Follow the [Trends Tracker](/trends/tracker)" CTA does not trigger', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: news\npublishedAt: 2026-05-01',
      '\nFollow the [Trends Tracker](/trends/tracker) for post-close movement data.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(
      violations.filter((v) => v.patternId === 'tracker-href-bare-week').length,
      0,
      '"Follow the [Trends Tracker](/trends/tracker)" CTA should not trigger tracker-href-bare-week'
    )
  })
})

// ── live-tracker-stale ────────────────────────────────────────────────────────

describe('checkFile — live-tracker-stale pattern', () => {
  const patterns = loadPatterns()

  test('flags "live Trends Tracker" as stale present-tense reference', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-10',
      '\nThe live Trends Tracker has the Cloud at +36 for this week.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'live-tracker-stale'),
      'expected live-tracker-stale violation',
    )
  })

  test('flags markdown-link form "live [Trends Tracker](...)"', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-10',
      '\nThe live [Trends Tracker](/trends/tracker) has the Hall-effect category sloping up.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'live-tracker-stale'),
      'expected live-tracker-stale violation for markdown-link form',
    )
  })

  test('"W19 Trends Tracker" ISO-anchored form does not trigger the pattern', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-05-10',
      '\nThe W19 Trends Tracker had the Cloud at +36 — second in the linear category.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.equal(violations.length, 0, 'ISO-anchored form should not trigger live-tracker-stale')
  })

  test('flags "live [Trends Tracker]" split across two lines (bigram scan)', () => {
    const content = makeMdx(
      'slug: test\ntitle: Test\nauthor: thock\npillar: trends\npublishedAt: 2026-04-15',
      '\nThe ZMK adoption ceiling is essentially gone. The live\n[Trends Tracker](/trends/tracker) had the ZMK row sloping up.\n'
    )
    const filePath = tmpMdx(content)
    const violations = checkFile(filePath, patterns)
    assert.ok(
      violations.some((v) => v.patternId === 'live-tracker-stale'),
      'expected live-tracker-stale violation for cross-line pattern',
    )
  })
})
