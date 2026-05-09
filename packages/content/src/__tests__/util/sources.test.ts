import { describe, expect, it } from 'vitest'
import { countSourceTags } from '../../util/sources'

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
