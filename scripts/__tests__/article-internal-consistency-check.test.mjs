// scripts/__tests__/article-internal-consistency-check.test.mjs
//
// Unit tests for scripts/article-internal-consistency-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.
//
// Chunk 06.1 scope: clean-corpus and count-mismatch coverage only (spec
// plan/06-article-internal-consistency.md, acceptance A5's first two
// cases).
//
// Chunk 06.2 scope: dollar/gram-mismatch coverage (acceptance A5's third
// case). Sibling-citation-mismatch tests are chunk 06.3's job.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { __test } from '../article-internal-consistency-check.mjs'

const {
  extractBody,
  extractFrontmatterField,
  extractFirstHeading,
  extractFirstParagraphs,
  extractCountClaims,
  findEnumeratedListNear,
  findCountMismatches,
  extractDollarClaims,
  extractGramClaims,
  findFigureMismatches,
  checkArticle,
  checkNewsletter,
  checkContentFile,
  describeMismatch,
  formatAuditRow,
} = __test

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMdx(frontmatterFields, body) {
  return `---\n${frontmatterFields}\n---\n${body}`
}

function tmpMdx(content, fileName = 'test-article.mdx') {
  const dir = mkdtempSync(join(tmpdir(), 'aicc-test-'))
  const filePath = join(dir, fileName)
  writeFileSync(filePath, content, 'utf8')
  return filePath
}

// ── extractBody ───────────────────────────────────────────────────────────────

describe('extractBody', () => {
  test('splits frontmatter and body', () => {
    const content = '---\nslug: foo\nlede: "Hi"\n---\nBody text here\n'
    const { body, frontmatterText } = extractBody(content)
    assert.equal(body, 'Body text here\n')
    assert.equal(frontmatterText, 'slug: foo\nlede: "Hi"')
  })

  test('handles content with no frontmatter', () => {
    const content = 'Just body text\n'
    const { body, frontmatterText } = extractBody(content)
    assert.equal(body, content)
    assert.equal(frontmatterText, '')
  })
})

// ── extractFrontmatterField ───────────────────────────────────────────────────

describe('extractFrontmatterField', () => {
  test('extracts a single-line quoted field', () => {
    const fm = 'slug: foo\nlede: "A short lede."'
    assert.equal(extractFrontmatterField(fm, 'lede'), 'A short lede.')
  })

  test('joins a line-folded multi-line quoted field', () => {
    const fm = 'lede: "Four colorways ran at the vendor,\n  spanning the whole\n  lineup."'
    assert.equal(extractFrontmatterField(fm, 'lede'), 'Four colorways ran at the vendor, spanning the whole lineup.')
  })

  test('returns null when the field is absent', () => {
    const fm = 'slug: foo'
    assert.equal(extractFrontmatterField(fm, 'lede'), null)
  })
})

// ── extractFirstHeading / extractFirstParagraphs ─────────────────────────────

describe('extractFirstHeading', () => {
  test('finds the first heading line', () => {
    const body = '\nIntro paragraph.\n\n## A heading\n\nMore text.\n'
    assert.equal(extractFirstHeading(body), 'A heading')
  })

  test('returns null when there is no heading', () => {
    assert.equal(extractFirstHeading('Just prose, no headings.\n'), null)
  })
})

describe('extractFirstParagraphs', () => {
  test('skips headings and JSX blocks, returns prose paragraphs', () => {
    const body = [
      '## Heading',
      '',
      'First paragraph text.',
      '',
      '<InlineViz',
      '  src="/x.svg"',
      '  alt="some alt text"',
      '/>',
      '',
      'Second paragraph text.',
      '',
      'Third paragraph — not collected.',
      '',
    ].join('\n')
    const paragraphs = extractFirstParagraphs(body, 2)
    assert.deepEqual(paragraphs, ['First paragraph text.', 'Second paragraph text.'])
  })
})

// ── extractCountClaims ────────────────────────────────────────────────────────

describe('extractCountClaims', () => {
  test('extracts a digit count claim', () => {
    const claims = extractCountClaims('The buy shipped in four colorways of trim.')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].number, 4)
    assert.equal(claims[0].noun, 'colorways')
  })

  test('extracts a numeral count claim', () => {
    const claims = extractCountClaims('The board ships in 3 sizes at launch.')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].number, 3)
    assert.equal(claims[0].noun, 'sizes')
  })

  test('ignores stopword units like years/weeks/percent', () => {
    const claims = extractCountClaims('Two years ago, scores fell three percent over eight weeks.')
    assert.equal(claims.length, 0)
  })
})

// ── findEnumeratedListNear ────────────────────────────────────────────────────

describe('findEnumeratedListNear', () => {
  test('finds an em-dash-introduced comma list after the noun', () => {
    const body = 'The buy shipped in four colorways — orange, pink, baby blue, lilac.'
    const found = findEnumeratedListNear(body, 'colorways')
    assert.ok(found)
    assert.equal(found.count, 4)
    assert.deepEqual(found.items, ['orange', 'pink', 'baby blue', 'lilac'])
  })

  test('returns null when no list follows the noun', () => {
    const body = 'The buy shipped in four colorways of trim, nothing else to say.'
    assert.equal(findEnumeratedListNear(body, 'colorways'), null)
  })
})

// ── findCountMismatches / checkContentFile — the two required A5 cases ──────

describe('findCountMismatches', () => {
  test('clean: lede count matches the body enumeration', () => {
    const frontmatterText = 'slug: clean-colorway-buy\nlede: "A group buy ran with four colorways of trim available at checkout."'
    const body = [
      '',
      '## The buy',
      '',
      'The vendor opened the window on schedule.',
      '',
      'Pricing held steady across the whole run.',
      '',
      '## The colorways',
      '',
      'Buyers could pick from four colorways — orange, pink, baby blue, lilac.',
      '',
    ].join('\n')
    const mismatches = findCountMismatches(frontmatterText, body)
    assert.deepEqual(mismatches, [])
  })

  test('mismatch: lede count disagrees with the body enumeration', () => {
    const frontmatterText = 'slug: mismatch-colorway-buy\nlede: "A group buy ran with four colorways of trim available at checkout."'
    const body = [
      '',
      '## The buy',
      '',
      'The vendor opened the window on schedule.',
      '',
      'Pricing held steady across the whole run.',
      '',
      '## The colorways',
      '',
      'Buyers could pick from four colorways — orange, pink, baby blue.',
      '',
    ].join('\n')
    const mismatches = findCountMismatches(frontmatterText, body)
    assert.equal(mismatches.length, 1)
    assert.equal(mismatches[0].noun, 'colorways')
    assert.equal(mismatches[0].claimNumber, 4)
    assert.equal(mismatches[0].foundCount, 3)
    assert.deepEqual(mismatches[0].foundItems, ['orange', 'pink', 'baby blue'])
  })
})

// ── extractDollarClaims / extractGramClaims ──────────────────────────────────

describe('extractDollarClaims', () => {
  test('tags a dollar figure with the noun immediately following it', () => {
    const claims = extractDollarClaims('The base kit runs $150 kit at launch.')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].tag, 'kit')
    assert.equal(claims[0].value, 150)
  })

  test('skips a range ("$110 and $155") — not a single claim to diff', () => {
    const claims = extractDollarClaims('Pricing ran from $110 and $155 at the vendor.')
    assert.deepEqual(claims, [])
  })

  test('skips an en-dash range ("$110–$155")', () => {
    const claims = extractDollarClaims('Early tiers landed at $110–$155 across the run.')
    assert.deepEqual(claims, [])
  })
})

describe('extractGramClaims', () => {
  test('tags a gram figure with the word immediately preceding it', () => {
    const claims = extractGramClaims('This mod adds 62 grams to the plate overall.')
    assert.equal(claims.length, 1)
    assert.equal(claims[0].tag, 'adds')
    assert.equal(claims[0].value, 62)
  })

  test('skips the second half of a range ("110-155 grams")', () => {
    const claims = extractGramClaims('Weights ran 110-155 grams across the batch.')
    assert.deepEqual(claims, [])
  })
})

// ── findFigureMismatches — the dollar/gram-mismatch A5 case (chunk 06.2) ────

describe('findFigureMismatches', () => {
  test('clean: a dollar figure restated identically later — no mismatch', () => {
    const frontmatterText = 'slug: clean-kit-price\nlede: "The kit runs $150 kit at launch."'
    const body = [
      '',
      '## Heading',
      '',
      'Intro paragraph one with nothing numeric in it.',
      '',
      'Intro paragraph two, also unremarkable.',
      '',
      'Later in the piece the vendor reconfirms $150 kit pricing at checkout.',
      '',
    ].join('\n')
    assert.deepEqual(findFigureMismatches(frontmatterText, body), [])
  })

  test('clean: a gram figure restated identically later — no mismatch', () => {
    const frontmatterText = 'slug: clean-mod-weight\nlede: "This mod adds 62 grams to the plate overall."'
    const body = [
      '',
      '## Heading',
      '',
      'Intro paragraph one with nothing numeric in it.',
      '',
      'Intro paragraph two, also unremarkable.',
      '',
      'A later callout confirms the same mod adds 62 grams once weighed again.',
      '',
    ].join('\n')
    assert.deepEqual(findFigureMismatches(frontmatterText, body), [])
  })

  test('dollar mismatch: lede figure disagrees with a later restatement of the same tag', () => {
    const frontmatterText = 'slug: mismatch-kit-price\nlede: "The kit runs $150 kit at launch."'
    const body = [
      '',
      '## Heading',
      '',
      'Intro paragraph one with nothing numeric in it.',
      '',
      'Intro paragraph two, also unremarkable.',
      '',
      'Later in the piece the vendor says the kit lists for $180 kit once taxes land.',
      '',
    ].join('\n')
    const mismatches = findFigureMismatches(frontmatterText, body)
    assert.equal(mismatches.length, 1)
    const [m] = mismatches
    assert.equal(m.kind, 'dollar')
    assert.equal(m.tag, 'kit')
    assert.equal(m.claimSource, 'lede')
    assert.equal(m.claimValue, 150)
    assert.equal(m.foundValue, 180)
  })

  test('gram mismatch: lede figure disagrees with a later restatement of the same tag', () => {
    const frontmatterText = 'slug: mismatch-mod-weight\nlede: "This mod adds 62 grams to the plate overall."'
    const body = [
      '',
      '## Heading',
      '',
      'Intro paragraph one with nothing numeric in it.',
      '',
      'Intro paragraph two, also unremarkable.',
      '',
      'A later callout says the same mod actually adds 67 grams once weighed again.',
      '',
    ].join('\n')
    const mismatches = findFigureMismatches(frontmatterText, body)
    assert.equal(mismatches.length, 1)
    const [m] = mismatches
    assert.equal(m.kind, 'gram')
    assert.equal(m.tag, 'adds')
    assert.equal(m.claimSource, 'lede')
    assert.equal(m.claimValue, 62)
    assert.equal(m.foundValue, 67)
  })

  test('two different dollar amounts for two different tags is not a mismatch', () => {
    const frontmatterText = 'slug: two-kits\nlede: "The base kit costs $150 kit at launch."'
    const body = [
      '',
      '## Heading',
      '',
      'Intro paragraph one with nothing numeric in it.',
      '',
      'Intro paragraph two, also unremarkable.',
      '',
      'Separately, a $55 addon kit is also available for purchase.',
      '',
    ].join('\n')
    assert.deepEqual(findFigureMismatches(frontmatterText, body), [])
  })
})

describe('checkContentFile / checkArticle / checkNewsletter', () => {
  test('clean article file reports no mismatches', () => {
    const content = makeMdx(
      'slug: clean-colorway-buy\nlede: "A group buy ran with four colorways of trim available at checkout."',
      [
        '',
        '## The buy',
        '',
        'The vendor opened the window on schedule.',
        '',
        'Pricing held steady across the whole run.',
        '',
        '## The colorways',
        '',
        'Buyers could pick from four colorways — orange, pink, baby blue, lilac.',
        '',
      ].join('\n'),
    )
    const filePath = tmpMdx(content, 'clean-colorway-buy.mdx')
    const result = checkArticle(filePath)
    assert.equal(result.slug, 'clean-colorway-buy')
    assert.deepEqual(result.mismatches, [])
  })

  test('mismatched article file reports exactly one mismatch naming the figures', () => {
    const content = makeMdx(
      'slug: mismatch-colorway-buy\nlede: "A group buy ran with four colorways of trim available at checkout."',
      [
        '',
        '## The buy',
        '',
        'The vendor opened the window on schedule.',
        '',
        'Pricing held steady across the whole run.',
        '',
        '## The colorways',
        '',
        'Buyers could pick from four colorways — orange, pink, baby blue.',
        '',
      ].join('\n'),
    )
    const filePath = tmpMdx(content, 'mismatch-colorway-buy.mdx')
    const result = checkArticle(filePath)
    assert.equal(result.slug, 'mismatch-colorway-buy')
    assert.equal(result.mismatches.length, 1)
    const [m] = result.mismatches
    assert.equal(m.dir, 'articles')
    assert.equal(m.claimNumber, 4)
    assert.equal(m.foundCount, 3)
    const description = describeMismatch(m)
    assert.match(description, /4 colorways/)
    assert.match(description, /3 colorways/)
    assert.match(description, /orange, pink, baby blue/)
  })

  test('checkArticle reports a dollar/gram mismatch via checkContentFile wiring', () => {
    const content = makeMdx(
      'slug: mismatch-mod-weight\nlede: "This mod adds 62 grams to the plate overall."',
      [
        '',
        '## Heading',
        '',
        'Intro paragraph one with nothing numeric in it.',
        '',
        'Intro paragraph two, also unremarkable.',
        '',
        'A later callout says the same mod actually adds 67 grams once weighed again.',
        '',
      ].join('\n'),
    )
    const filePath = tmpMdx(content, 'mismatch-mod-weight.mdx')
    const result = checkArticle(filePath)
    assert.equal(result.mismatches.length, 1)
    const [m] = result.mismatches
    assert.equal(m.kind, 'gram')
    assert.equal(m.dir, 'articles')
    assert.equal(m.claimValue, 62)
    assert.equal(m.foundValue, 67)
  })

  test('checkNewsletter tags mismatches with dir: newsletters', () => {
    const content = makeMdx(
      'slug: mismatch-newsletter\nlede: "This week\'s roundup covers four colorways of the same trim kit."',
      [
        '',
        '## This week',
        '',
        'Nothing unusual happened in the first paragraph.',
        '',
        'The second paragraph is also unremarkable.',
        '',
        '## The trim kit',
        '',
        'It ships in four colorways — orange, pink, baby blue.',
        '',
      ].join('\n'),
    )
    const filePath = tmpMdx(content, 'mismatch-newsletter.mdx')
    const result = checkNewsletter(filePath)
    assert.equal(result.mismatches.length, 1)
    assert.equal(result.mismatches[0].dir, 'newsletters')
  })
})

// ── formatAuditRow ────────────────────────────────────────────────────────────

describe('formatAuditRow', () => {
  test('formats a content-category AUDIT row naming the conflicting figures', () => {
    const mismatches = [
      {
        kind: 'count',
        noun: 'colorways',
        claimSource: 'lede',
        claimNumber: 4,
        foundCount: 3,
        foundItems: ['orange', 'pink', 'baby blue'],
        dir: 'articles',
      },
    ]
    const row = formatAuditRow('mismatch-colorway-buy', 'articles', mismatches, new Date('2026-11-08T00:00:00.000Z'))
    assert.match(row, /\[content\]/)
    assert.match(row, /category: content/)
    assert.match(row, /filed: 2026-11-08/)
    assert.match(row, /file: apps\/web\/src\/content\/articles\/mismatch-colorway-buy\.mdx/)
    assert.match(row, /4 colorways/)
    assert.match(row, /3 colorways/)
    assert.match(row, /orange, pink, baby blue/)
  })

  test('formats a dollar-mismatch AUDIT row with dollar wording, not count wording', () => {
    const mismatches = [
      {
        kind: 'dollar',
        tag: 'kit',
        claimSource: 'lede',
        claimValue: 150,
        foundValue: 180,
        dir: 'articles',
      },
    ]
    const row = formatAuditRow('mismatch-kit-price', 'articles', mismatches, new Date('2026-11-08T00:00:00.000Z'))
    assert.match(row, /\[content\]/)
    assert.match(row, /category: content/)
    assert.match(row, /file: apps\/web\/src\/content\/articles\/mismatch-kit-price\.mdx/)
    assert.match(row, /\$150 kit/)
    assert.match(row, /\$180/)
    assert.doesNotMatch(row, /enumerates/)
  })

  test('formats a gram-mismatch AUDIT row with gram wording, not count wording', () => {
    const mismatches = [
      {
        kind: 'gram',
        tag: 'adds',
        claimSource: 'lede',
        claimValue: 62,
        foundValue: 67,
        dir: 'articles',
      },
    ]
    const row = formatAuditRow('mismatch-mod-weight', 'articles', mismatches, new Date('2026-11-08T00:00:00.000Z'))
    assert.match(row, /\[content\]/)
    assert.match(row, /category: content/)
    assert.match(row, /file: apps\/web\/src\/content\/articles\/mismatch-mod-weight\.mdx/)
    assert.match(row, /62g/)
    assert.match(row, /67g/)
    assert.doesNotMatch(row, /enumerates/)
  })
})
