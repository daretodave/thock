// scripts/__tests__/group-buy-article-staleness-check.test.mjs
//
// Unit tests for scripts/group-buy-article-staleness-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { __test } from '../group-buy-article-staleness-check.mjs'

const {
  findStaleCompanions,
  loadPatterns,
  extractBody,
  extractFrontmatterText,
  parseFrontmatterField,
  extractBodyParagraphs,
  checkArticle,
  scanArticles,
  formatAuditRow,
  alreadyFiled,
} = __test

const PATTERNS = loadPatterns()

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeGroupBuyRecord(slug, status, relatedArticle) {
  const data = { slug, status, name: slug, vendorSlug: 'test-vendor' }
  if (relatedArticle !== undefined) data.relatedArticle = relatedArticle
  return { file: `${slug}.json`, data }
}

function makeMdx(frontmatterFields, body) {
  return `---\n${frontmatterFields}\n---\n${body}`
}

// Writes `slug`.mdx into a fresh temp articles dir and returns that dir.
function tmpArticlesDir(slug, content) {
  const dir = mkdtempSync(join(tmpdir(), 'gbasc-test-'))
  writeFileSync(join(dir, `${slug}.mdx`), content, 'utf8')
  return dir
}

const CLEAN_FRONTMATTER = `slug: test-article
title: "Test Group Buy Closed Out After a Five-Week Run"
lede: "The test group buy ran from June 1 through July 1, 2026, and closed with a full sellout."
author: thock
pillar: news
tags: [group-buy, test]
publishedAt: '2026-06-01T14:00:00.000Z'`

const CLEAN_BODY = `The test group buy opened June 1, 2026, and ran through July 1, 2026, closing out with a full sellout across every storefront.

## What shipped

The kit included a base set, two novelty packs, and a deskmat, per the vendor listing.`

// ── findStaleCompanions ───────────────────────────────────────────────────────

describe('findStaleCompanions', () => {
  test('includes a closed record with relatedArticle', () => {
    const records = [makeGroupBuyRecord('closed-buy', 'closed', 'closed-buy-coverage')]
    const stale = findStaleCompanions(records)
    assert.equal(stale.length, 1)
    assert.equal(stale[0].relatedArticle, 'closed-buy-coverage')
  })

  test('includes a cancelled record with relatedArticle', () => {
    const records = [makeGroupBuyRecord('cancelled-buy', 'cancelled', 'cancelled-buy-coverage')]
    const stale = findStaleCompanions(records)
    assert.equal(stale.length, 1)
  })

  test('excludes a delayed record even with relatedArticle', () => {
    const records = [makeGroupBuyRecord('delayed-buy', 'delayed', 'delayed-buy-coverage')]
    const stale = findStaleCompanions(records)
    assert.equal(stale.length, 0)
  })

  test('excludes a live record with relatedArticle', () => {
    const records = [makeGroupBuyRecord('live-buy', 'live', 'live-buy-coverage')]
    const stale = findStaleCompanions(records)
    assert.equal(stale.length, 0)
  })

  test('excludes a closed record with no relatedArticle', () => {
    const records = [makeGroupBuyRecord('no-companion-buy', 'closed')]
    const stale = findStaleCompanions(records)
    assert.equal(stale.length, 0)
  })
})

// ── extractFrontmatterText / parseFrontmatterField ───────────────────────────

describe('parseFrontmatterField', () => {
  test('extracts a double-quoted field', () => {
    const fm = extractFrontmatterText(makeMdx(CLEAN_FRONTMATTER, CLEAN_BODY))
    assert.equal(parseFrontmatterField(fm, 'title'), 'Test Group Buy Closed Out After a Five-Week Run')
  })

  test('returns empty string when field is absent', () => {
    const fm = extractFrontmatterText(makeMdx('slug: foo', 'body'))
    assert.equal(parseFrontmatterField(fm, 'lede'), '')
  })
})

// ── extractBodyParagraphs ─────────────────────────────────────────────────────

describe('extractBodyParagraphs', () => {
  test('skips a leading heading and JSX block, returns first N prose paragraphs', () => {
    const { bodyLines } = extractBody(
      makeMdx(
        CLEAN_FRONTMATTER,
        `## Heading first

<Callout type="note" title="Skip me">
  JSX content should not count as a paragraph.
</Callout>

First real paragraph of prose.

Second real paragraph of prose.

Third paragraph should not be included.`,
      ),
    )
    const paragraphs = extractBodyParagraphs(bodyLines, 2)
    assert.equal(paragraphs.length, 2)
    assert.equal(paragraphs[0], 'First real paragraph of prose.')
    assert.equal(paragraphs[1], 'Second real paragraph of prose.')
  })
})

// ── checkArticle — clean (A1 behavior at the single-article level) ──────────

describe('checkArticle — clean article', () => {
  test('finds no matches for past-tense frontmatter and body', () => {
    const dir = tmpArticlesDir('clean-article', makeMdx(CLEAN_FRONTMATTER, CLEAN_BODY))
    const result = checkArticle(join(dir, 'clean-article.mdx'), PATTERNS)
    assert.equal(result.matches.length, 0)
  })
})

// ── scanArticles — the 4 required acceptance cases (A2, A3, A4) ─────────────

describe('scanArticles — case 1: clean article (closed record, past-tense companion)', () => {
  test('files no row', () => {
    const dir = tmpArticlesDir('clean-closed-coverage', makeMdx(CLEAN_FRONTMATTER, CLEAN_BODY))
    const records = [makeGroupBuyRecord('clean-closed-buy', 'closed', 'clean-closed-coverage')]
    const flagged = scanArticles(records, dir, PATTERNS)
    assert.equal(flagged.length, 0)
  })
})

describe('scanArticles — case 2: frontmatter-staleness hit (closed record, present-tense title/lede)', () => {
  test('files one row naming the frontmatter match', () => {
    const fm = `slug: stale-fm-article
title: "Test Keycap Set Group Buy Is Live Now at Test Vendor"
lede: "The test keycap set group buy opens today and runs through August 15, 2026."
author: thock
pillar: news
tags: [group-buy, test]
publishedAt: '2026-06-01T14:00:00.000Z'`

    const dir = tmpArticlesDir('stale-fm-article', makeMdx(fm, CLEAN_BODY))
    const records = [makeGroupBuyRecord('stale-fm-buy', 'closed', 'stale-fm-article')]
    const flagged = scanArticles(records, dir, PATTERNS)

    assert.equal(flagged.length, 1)
    assert.equal(flagged[0].articleSlug, 'stale-fm-article')
    assert.equal(flagged[0].groupBuySlug, 'stale-fm-buy')
    assert.equal(flagged[0].groupBuyFile, 'data/group-buys/stale-fm-buy.json')

    const locations = flagged[0].matches.map((m) => m.location)
    assert.ok(locations.includes('title'))
    assert.ok(locations.includes('lede'))
  })
})

describe('scanArticles — case 3: body-callout-staleness hit (past-tense frontmatter, present-tense Update paragraph)', () => {
  test('files one row naming the body-paragraph match even though frontmatter is clean', () => {
    const body = `The test group buy opened June 1, 2026, and ran through July 1, 2026, closing out with a full sellout across every storefront.

Update — a restock round for the test group buy opens August 1, 2026, and runs through August 15, 2026.

## Later section

More unrelated past-tense prose about the kit contents.`

    const dir = tmpArticlesDir('stale-callout-article', makeMdx(CLEAN_FRONTMATTER, body))
    const records = [makeGroupBuyRecord('stale-callout-buy', 'closed', 'stale-callout-article')]
    const flagged = scanArticles(records, dir, PATTERNS)

    assert.equal(flagged.length, 1)
    assert.equal(flagged[0].articleSlug, 'stale-callout-article')
    const locations = flagged[0].matches.map((m) => m.location)
    assert.ok(locations.includes('body-paragraph-2'))
    assert.ok(!locations.includes('title'))
    assert.ok(!locations.includes('lede'))
  })
})

describe('scanArticles — case 4: delayed record is never flagged', () => {
  test('a delayed record with a present-tense companion files no row', () => {
    const fm = `slug: delayed-article
title: "Test Keycap Set Group Buy Is Live Now at Test Vendor"
lede: "The test keycap set group buy opens today and runs through August 15, 2026."
author: thock
pillar: news
tags: [group-buy, test]
publishedAt: '2026-06-01T14:00:00.000Z'`

    const dir = tmpArticlesDir('delayed-article', makeMdx(fm, CLEAN_BODY))
    const records = [makeGroupBuyRecord('delayed-buy', 'delayed', 'delayed-article')]
    const flagged = scanArticles(records, dir, PATTERNS)
    assert.equal(flagged.length, 0)
  })
})

describe('scanArticles — read-only / resilience', () => {
  test('a missing companion article is logged and skipped, not thrown', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gbasc-test-empty-'))
    const records = [makeGroupBuyRecord('missing-article-buy', 'closed', 'does-not-exist')]
    assert.doesNotThrow(() => {
      const flagged = scanArticles(records, dir, PATTERNS)
      assert.equal(flagged.length, 0)
    })
  })
})

// ── formatAuditRow / alreadyFiled ─────────────────────────────────────────────

describe('formatAuditRow', () => {
  test('names the article, the group-buy record, and the matched phrase', () => {
    const flagged = {
      groupBuySlug: 'stale-fm-buy',
      groupBuyFile: 'data/group-buys/stale-fm-buy.json',
      status: 'closed',
      articleSlug: 'stale-fm-article',
      matches: [{ location: 'title', patternId: 'stale-buy-is-live-bare', match: 'buy is live' }],
    }
    const row = formatAuditRow(flagged, new Date('2026-11-10'))
    assert.match(row, /stale-fm-article/)
    assert.match(row, /data\/group-buys\/stale-fm-buy\.json/)
    assert.match(row, /`buy is live`/)
    assert.match(row, /^- category: content$/m)
  })
})

describe('alreadyFiled', () => {
  test('returns true when a pending row for the slug already names the phrase', () => {
    const content = `
### [ ] [content] [3.6] stale-fm-article — present-tense buy-window language after group-buy closed
- category: content
- matches:
  - title: \`buy is live\` (stale-buy-is-live-bare)
`
    assert.equal(alreadyFiled(content, 'stale-fm-article', ['buy is live']), true)
  })

  test('returns false when the slug row exists but not for this phrase', () => {
    const content = `
### [ ] [content] [3.6] stale-fm-article — present-tense buy-window language after group-buy closed
- category: content
- matches:
  - title: \`buy opens\` (stale-buy-opens)
`
    assert.equal(alreadyFiled(content, 'stale-fm-article', ['buy is live']), false)
  })

  test('returns false when the row is already completed ([x])', () => {
    const content = `
### [x] [content] [3.6] stale-fm-article — present-tense buy-window language after group-buy closed
- matches:
  - title: \`buy is live\` (stale-buy-is-live-bare)
`
    assert.equal(alreadyFiled(content, 'stale-fm-article', ['buy is live']), false)
  })

  test('returns false for empty content', () => {
    assert.equal(alreadyFiled('', 'any-article', ['buy is live']), false)
  })
})
