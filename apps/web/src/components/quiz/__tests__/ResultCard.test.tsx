import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Switch } from '@thock/data'
import { ResultCard } from '../ResultCard'

const SWITCH: Switch = {
  slug: 'gateron-oil-king',
  name: 'Gateron Oil King',
  vendorSlug: 'cannonkeys',
  type: 'linear',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 55, bottomOut: 65 },
  travelMm: 4,
  factoryLubed: true,
  releasedAt: '2022-08-01',
  status: 'in-production',
  description: 'Mid-weight linear with a heavily lubed POM stem in a polycarbonate over nylon housing.',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('<ResultCard>', () => {
  it('renders the switch name', () => {
    render(<ResultCard sw={SWITCH} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('Gateron Oil King')).toBeInTheDocument()
  })

  it('links to /part/switch/<slug>', () => {
    render(<ResultCard sw={SWITCH} score={20} maxScore={30} rank={1} />)
    const link = screen.getByRole('link', { name: /gateron oil king/i })
    expect(link).toHaveAttribute('href', '/part/switch/gateron-oil-king')
  })

  it('match percentage uses text-text-2 (not text-text-3) for WCAG AA contrast', () => {
    render(<ResultCard sw={SWITCH} score={20} maxScore={30} rank={1} />)
    const pct = screen.getByTestId('result-card-pct')
    expect(pct.className).toContain('text-text-2')
    expect(pct.className).not.toContain('text-text-3')
  })
})
