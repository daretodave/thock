import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Switch } from '@thock/data'
import { SuggestedSwitchPairs } from '../SuggestedSwitchPairs'

const STUB: Omit<Switch, 'slug' | 'name' | 'type'> = {
  vendorSlug: 'vendor-x',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 45, bottomOut: 55 },
  travelMm: 4,
  factoryLubed: false,
  releasedAt: null,
  status: 'in-production',
  description: 'Test stub, long enough to pass schema validation easily.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function sw(slug: string, name: string, type: Switch['type']): Switch {
  return { ...STUB, slug, name, type }
}

describe('<SuggestedSwitchPairs>', () => {
  it('renders nothing when there are no pairs', () => {
    const { container } = render(<SuggestedSwitchPairs pairs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a link per pair pointing at the compare query params', () => {
    const a = sw('cherry-mx2a-red', 'Cherry MX2A Red', 'linear')
    const b = sw('gazzew-boba-u4t', 'Gazzew Boba U4T', 'tactile')

    render(<SuggestedSwitchPairs pairs={[{ a, b }]} />)

    const link = screen.getByTestId('compare-suggested-pair')
    expect(link).toHaveTextContent('Cherry MX2A Red vs Gazzew Boba U4T')
    expect(link).toHaveAttribute(
      'href',
      '/compare/switch?a=cherry-mx2a-red&b=gazzew-boba-u4t',
    )
  })

  it('renders multiple pairs as separate links', () => {
    const a = sw('cherry-mx2a-red', 'Cherry MX2A Red', 'linear')
    const b = sw('gazzew-boba-u4t', 'Gazzew Boba U4T', 'tactile')
    const c = sw('kailh-box-jade', 'Kailh Box Jade', 'clicky')

    render(
      <SuggestedSwitchPairs
        pairs={[
          { a, b },
          { a: b, b: c },
        ]}
      />,
    )

    expect(screen.getAllByTestId('compare-suggested-pair')).toHaveLength(2)
  })
})
