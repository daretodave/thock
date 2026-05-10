import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartIndexCard } from '../PartIndexCard'
import type { ResolvedPart } from '@/lib/data-runtime'

const LONG_DESC =
  'A 67g linear factory-lubed switch with a notably wet sound profile and a heavier bottom-out that pairs well with thicker keycap profiles. Sold under the Mode and CannonKeys umbrellas.'

const FAKE_SWITCH = {
  id: 'switch:gateron-oil-king',
  kind: 'switch',
  slug: 'gateron-oil-king',
  record: {
    slug: 'gateron-oil-king',
    name: 'Gateron Oil King',
    vendorSlug: 'cannonkeys',
    type: 'linear',
    description: LONG_DESC,
    status: 'in-production',
  },
} as unknown as ResolvedPart

describe('<PartIndexCard>', () => {
  it('renders an anchor pointing at /part/<kind>/<slug>', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    const card = screen.getByTestId('part-index-card')
    expect(card.tagName).toBe('A')
    expect(card.getAttribute('href')).toBe(
      '/part/switch/gateron-oil-king',
    )
  })

  it('renders the part name', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-index-card')).toHaveTextContent(
      /Gateron Oil King/i,
    )
  })

  it('truncates a long description with an ellipsis', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    const card = screen.getByTestId('part-index-card')
    expect(card.textContent).toMatch(/…$/)
  })

  it('renders the status pill', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-index-card')).toHaveTextContent(
      /in production/i,
    )
  })
})
