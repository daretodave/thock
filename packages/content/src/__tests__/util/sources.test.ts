import { describe, expect, it } from 'vitest'
import { countSourceTags, extractSourceCitations } from '../../util/sources'

describe('countSourceTags', () => {
  it('returns 0 when the body has no Source tags', () => {
    expect(countSourceTags('Just a plain article body with no citations.')).toBe(
      0,
    )
  })

  it('counts a single self-closing Source tag', () => {
    expect(
      countSourceTags(
        'See <Source href="https://example.com" /> for the full spec.',
      ),
    ).toBe(1)
  })

  it('counts a single Source tag with children', () => {
    expect(
      countSourceTags(
        'See <Source href="https://example.com">the spec</Source>.',
      ),
    ).toBe(1)
  })

  it('counts every occurrence in a body with several citations', () => {
    const body = `
      <Source href="https://a.com">A</Source>
      and <Source href="https://b.com" />
      and <Source  href="https://c.com" />
      .
    `
    expect(countSourceTags(body)).toBe(3)
  })

  it('does not match component names that start with the same prefix', () => {
    const body = '<SourceList items={[]} /> <Sources /> <Source-> <Source\n'
    // `<SourceList ` and `<Sources ` should not match because the regex
    // requires a whitespace immediately after the literal `<Source`.
    expect(countSourceTags(body)).toBe(1)
  })

  it('does not match arbitrary substrings of the word "Source"', () => {
    expect(
      countSourceTags(
        'The source of the data is the Source of truth — <Source href="x" /> matters.',
      ),
    ).toBe(1)
  })
})

describe('extractSourceCitations', () => {
  it('returns an empty array for a body with no Source tags', () => {
    expect(extractSourceCitations('Just plain prose.')).toEqual([])
  })

  it('extracts href + text from a paired Source tag', () => {
    const cites = extractSourceCitations(
      'See <Source href="https://example.com">the spec</Source>.',
    )
    expect(cites).toHaveLength(1)
    expect(cites[0]).toMatchObject({
      href: 'https://example.com',
      text: 'the spec',
    })
  })

  it('returns null text when the tag is self-closing', () => {
    const cites = extractSourceCitations(
      'See <Source href="https://example.com" /> for more.',
    )
    expect(cites).toHaveLength(1)
    expect(cites[0]?.href).toBe('https://example.com')
    expect(cites[0]?.text).toBeNull()
  })

  it('preserves document order across multiple citations', () => {
    const body = `
      First <Source href="https://first.com">a</Source>,
      then <Source href="https://second.com">b</Source>.
    `
    const cites = extractSourceCitations(body)
    expect(cites.map((c) => c.href)).toEqual([
      'https://first.com',
      'https://second.com',
    ])
    expect(cites[0]!.position).toBeLessThan(cites[1]!.position)
  })

  it('collapses whitespace inside the text content', () => {
    const body = `
      <Source href="https://x.com">Mode's
      newest board</Source>
    `
    const [cite] = extractSourceCitations(body)
    expect(cite?.text).toBe("Mode's newest board")
  })

  it('handles attributes that span multiple lines', () => {
    const body = `<Source\n  href="https://x.com"\n>label</Source>`
    const [cite] = extractSourceCitations(body)
    expect(cite?.href).toBe('https://x.com')
    expect(cite?.text).toBe('label')
  })

  it('skips Source tags missing an href attribute', () => {
    expect(
      extractSourceCitations('<Source>orphan</Source>'),
    ).toEqual([])
  })
})
