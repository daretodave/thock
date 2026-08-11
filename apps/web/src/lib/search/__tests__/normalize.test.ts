import { describe, expect, it } from 'vitest'
import { normalizeHotswapSpelling } from '../normalize'

describe('normalizeHotswapSpelling', () => {
  it('collapses "hot swap" to "hotswap"', () => {
    expect(normalizeHotswapSpelling('a hot swap board')).toBe('a hotswap board')
  })

  it('collapses "hot-swap" to "hotswap"', () => {
    expect(normalizeHotswapSpelling('a hot-swap socket')).toBe('a hotswap socket')
  })

  it('leaves "hotswap" unchanged', () => {
    expect(normalizeHotswapSpelling('a hotswap PCB')).toBe('a hotswap PCB')
  })

  it('preserves the "-pable" suffix across all three spellings', () => {
    expect(normalizeHotswapSpelling('hot swappable')).toBe('hotswappable')
    expect(normalizeHotswapSpelling('hot-swappable')).toBe('hotswappable')
    expect(normalizeHotswapSpelling('hotswappable')).toBe('hotswappable')
  })

  it('is case-insensitive and preserves surrounding text', () => {
    expect(normalizeHotswapSpelling('Hot-Swap sockets are common.')).toBe(
      'hotswap sockets are common.',
    )
  })

  it('normalizes multiple occurrences in the same string', () => {
    expect(normalizeHotswapSpelling('hot swap vs hot-swap vs hotswap')).toBe(
      'hotswap vs hotswap vs hotswap',
    )
  })

  it('does not touch unrelated text', () => {
    expect(normalizeHotswapSpelling('a linear switch with a hot spring')).toBe(
      'a linear switch with a hot spring',
    )
  })
})
