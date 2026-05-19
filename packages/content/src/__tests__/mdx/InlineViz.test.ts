import { describe, expect, it } from 'vitest'
import { resolveAccent } from '../../mdx/InlineViz'

describe('resolveAccent', () => {
  it('returns OKLCH value for named alias "coral"', () => {
    expect(resolveAccent('coral')).toBe('oklch(0.68 0.165 28)')
  })

  it('returns OKLCH value for named alias "amber"', () => {
    expect(resolveAccent('amber')).toBe('oklch(0.78 0.10 80)')
  })

  it('returns OKLCH value for named alias "bronze"', () => {
    expect(resolveAccent('bronze')).toBe('oklch(0.80 0.135 75)')
  })

  it('returns OKLCH value for named alias "bordeaux"', () => {
    expect(resolveAccent('bordeaux')).toBe('oklch(0.62 0.13 25)')
  })

  it('returns site accent token for "default" alias', () => {
    expect(resolveAccent('default')).toBe('var(--thock-accent)')
  })

  it('returns site accent token when accent is undefined', () => {
    expect(resolveAccent(undefined)).toBe('var(--thock-accent)')
  })

  it('passes through a raw oklch value with no alias match', () => {
    expect(resolveAccent('oklch(0.65 0.14 220)')).toBe('oklch(0.65 0.14 220)')
  })

  it('passes through a CSS var reference as raw color', () => {
    expect(resolveAccent('var(--my-accent)')).toBe('var(--my-accent)')
  })
})
