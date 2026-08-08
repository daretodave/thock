import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { computePillarLabelFontSize, PILLAR_OG_TAGLINES, PillarOGContent } from '../PillarOG'

describe('<PillarOGContent>', () => {
  it('renders the pillar label as eyebrow + headline', () => {
    const { container } = render(
      <PillarOGContent pillarLabel="Trends" tagline={PILLAR_OG_TAGLINES.trends!} />,
    )
    const text = container.textContent ?? ''
    expect(text).toContain('thock · Trends')
    expect(text).toContain('Trends')
    expect(text).toContain(PILLAR_OG_TAGLINES.trends)
  })

  it('renders different content for each pillar', () => {
    const { container } = render(
      <PillarOGContent pillarLabel="Deep Dives" tagline={PILLAR_OG_TAGLINES['deep-dives']!} />,
    )
    const text = container.textContent ?? ''
    expect(text).toContain('thock · Deep Dives')
    expect(text).toContain('Long-form')
  })
})

describe('computePillarLabelFontSize', () => {
  it('keeps the original 156px size for the short pillar words', () => {
    expect(computePillarLabelFontSize('News')).toBe(156)
    expect(computePillarLabelFontSize('Deep Dives')).toBe(156)
  })

  it('steps down for longer static labels ("Find Your Keycap Set", "Group Buys · Archive")', () => {
    expect(computePillarLabelFontSize('Find Your Keycap Set')).toBeLessThan(156)
    expect(computePillarLabelFontSize('Group Buys · Archive')).toBeLessThan(156)
  })

  it('steps down further for the longest catalog entity names (vendor/tag/part-detail OG cards)', () => {
    const longest = computePillarLabelFontSize('Drop + Matt3o MT3 /dev/tty')
    const medium = computePillarLabelFontSize('Find Your Keycap Set')
    expect(longest).toBeLessThan(medium)
  })

  it('keeps the longest real catalog name (26 chars, digits + symbols) at the safety-net floor — the 84px tier wraps it to two lines in the real satori renderer', () => {
    expect(computePillarLabelFontSize('Drop + Matt3o MT3 /dev/tty')).toBe(68)
  })

  it('never returns a size below the safety-net floor', () => {
    expect(
      computePillarLabelFontSize('An implausibly long vendor or tag name that keeps going'),
    ).toBe(68)
  })
})

describe('PILLAR_OG_TAGLINES', () => {
  it('has a single-line tagline for every pillar slug used by app/<pillar>/opengraph-image.tsx', () => {
    const pillars = ['news', 'trends', 'ideas', 'deep-dives', 'guides']
    for (const slug of pillars) {
      expect(PILLAR_OG_TAGLINES[slug]).toBeDefined()
      const t = PILLAR_OG_TAGLINES[slug]!
      expect(t.length).toBeGreaterThan(0)
      expect(t.length).toBeLessThan(120)
      expect(t).not.toContain('\n')
    }
  })
})
