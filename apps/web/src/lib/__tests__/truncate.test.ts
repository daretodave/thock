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
})
