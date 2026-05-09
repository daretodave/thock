import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PILLAR_OG_TAGLINES, PillarOGContent } from '../PillarOG'

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
