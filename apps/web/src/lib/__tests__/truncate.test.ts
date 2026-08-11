import { describe, it, expect } from 'vitest'
import { truncate } from '../truncate'

describe('truncate', () => {
  it('returns the text unchanged when at or under the max length', () => {
    expect(truncate('short text', 80)).toBe('short text')
  })

  it('trims at the last word boundary before max and appends an ellipsis', () => {
    const text = 'Cherry MX2A Red is functionally similar to Krytox-lubed classics.'
    expect(truncate(text, 40)).toBe('Cherry MX2A Red is functionally similar…')
  })

  it('never breaks mid-word', () => {
    const text = 'Gateron Oil King uses polycarbonate over nylon housing for a deeper tone.'
    const result = truncate(text, 30)
    expect(result.endsWith('…')).toBe(true)
    const withoutEllipsis = result.slice(0, -1)
    expect(text.startsWith(withoutEllipsis)).toBe(true)
    expect(text[withoutEllipsis.length]).toMatch(/\s/)
  })

  it('extends past max to the next word boundary when the leading token has no whitespace within the window', () => {
    const text = 'Supercalifragilisticexpialidocious is a long word'
    expect(truncate(text, 10)).toBe('Supercalifragilisticexpialidocious…')
  })

  it('returns the text unchanged when it is a single token with no whitespace anywhere', () => {
    const text = 'https://example.com/a-very-long-product-slug-with-no-spaces-in-it-at-all'
    expect(truncate(text, 40)).toBe(text)
  })

  it('falls back to a hard cut when the next boundary is far past the extension budget', () => {
    const text = 'A'.repeat(100) + ' rest of the sentence follows here'
    const result = truncate(text, 10)
    expect(result).toBe('A'.repeat(10) + '…')
  })
})
