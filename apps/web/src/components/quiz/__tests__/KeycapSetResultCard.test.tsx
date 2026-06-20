import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { KeycapSet } from '@thock/data'
import { KeycapSetResultCard } from '../KeycapSetResultCard'

const KEYCAP: KeycapSet = {
  slug: 'domikey-wob',
  name: 'Domikey WOB',
  vendorSlug: 'kbdfans',
  profile: 'cherry',
  material: 'pbt',
  legendType: 'doubleshot',
  designer: null,
  releasedAt: '2020-01-01',
  status: 'in-stock',
  imageUrl: null,
  description:
    'Evergreen white-on-black Cherry-profile PBT doubleshot set from Domikey, praised for tight legend registration and minimal shine over extended use.',
  updatedAt: '2026-05-21T00:00:00.000Z',
}

describe('<KeycapSetResultCard>', () => {
  it('renders the keycap set name', () => {
    render(<KeycapSetResultCard keycapSet={KEYCAP} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('Domikey WOB')).toBeInTheDocument()
  })

  it('links to /part/keycap-set/<slug>', () => {
    render(<KeycapSetResultCard keycapSet={KEYCAP} score={20} maxScore={30} rank={1} />)
    const link = screen.getByRole('link', { name: /domikey wob/i })
    expect(link).toHaveAttribute('href', '/part/keycap-set/domikey-wob')
  })

  it('shows correct match percentage', () => {
    render(<KeycapSetResultCard keycapSet={KEYCAP} score={15} maxScore={30} rank={2} />)
    expect(screen.getByTestId('keycap-result-card-pct')).toHaveTextContent('50% match')
  })

  it('match percentage uses text-text-2 (not text-text-3) for WCAG AA contrast', () => {
    render(<KeycapSetResultCard keycapSet={KEYCAP} score={20} maxScore={30} rank={1} />)
    const pct = screen.getByTestId('keycap-result-card-pct')
    expect(pct.className).toContain('text-text-2')
    expect(pct.className).not.toContain('text-text-3')
  })

  it('renders 0% match when maxScore is 0', () => {
    render(<KeycapSetResultCard keycapSet={KEYCAP} score={0} maxScore={0} rank={3} />)
    expect(screen.getByTestId('keycap-result-card-pct')).toHaveTextContent('0% match')
  })
})
