import { describe, expect, it } from 'vitest'
import {
  PILLARS,
  isPillar,
  pillarHref,
  pillarLabel,
  pillarMeta,
} from '../pillars'

describe('PILLARS', () => {
  it('contains exactly five pillars in stable order', () => {
    expect(PILLARS.map((p) => p.slug)).toEqual([
      'news',
      'trends',
      'ideas',
      'deep-dives',
      'guides',
    ])
  })

  it('every href starts with the slug', () => {
    for (const p of PILLARS) {
      expect(p.href).toBe(`/${p.slug}`)
    }
  })
})

describe('pillar lookups', () => {
  it('returns label / href / meta for a known pillar', () => {
    expect(pillarLabel('deep-dives')).toBe('Deep Dives')
    expect(pillarHref('deep-dives')).toBe('/deep-dives')
    expect(pillarMeta('deep-dives').slug).toBe('deep-dives')
  })

  it('throws on unknown pillar', () => {
    // @ts-expect-error — testing runtime guard
    expect(() => pillarMeta('unknown')).toThrow(/unknown pillar/)
  })

  it('isPillar narrows the type correctly', () => {
    expect(isPillar('news')).toBe(true)
    expect(isPillar('foobar')).toBe(false)
  })
})
