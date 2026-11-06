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
    sensing: 'mechanical',
    description: LONG_DESC,
    status: 'in-production',
  },
} as unknown as ResolvedPart

const FAKE_HE_SWITCH = {
  id: 'switch:gateron-magnetic-jade',
  kind: 'switch',
  slug: 'gateron-magnetic-jade',
  record: {
    slug: 'gateron-magnetic-jade',
    name: 'Gateron Magnetic Jade',
    vendorSlug: 'kbdfans',
    type: 'linear',
    sensing: 'hall-effect',
    description: LONG_DESC,
    status: 'in-production',
  },
} as unknown as ResolvedPart

const FAKE_BOARD = {
  id: 'board:bakeneko65',
  kind: 'board',
  slug: 'bakeneko65',
  record: {
    slug: 'bakeneko65',
    name: 'Bakeneko65',
    vendorSlug: 'cannonkeys',
    layout: '65',
    description: LONG_DESC,
    status: 'in-stock',
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

  it('renders the part name inside a real h2, not a plain span', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-index-name').tagName).toBe('H2')
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

  it('has a focus-visible ring for keyboard navigation', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-index-card').className).toContain(
      'focus-visible:ring-2',
    )
  })

  it('renders a sensing tag for a switch, labeled from the sensing enum', () => {
    render(<PartIndexCard part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-index-sensing')).toHaveTextContent(
      /Mechanical/i,
    )
  })

  it('renders the hall-effect sensing label for a hall-effect switch', () => {
    render(<PartIndexCard part={FAKE_HE_SWITCH} />)
    expect(screen.getByTestId('part-index-sensing')).toHaveTextContent(
      /Hall-effect/i,
    )
  })

  it('does not render a sensing tag for a board', () => {
    render(<PartIndexCard part={FAKE_BOARD} />)
    expect(screen.queryByTestId('part-index-sensing')).not.toBeInTheDocument()
  })
})
