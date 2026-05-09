import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { GroupBuy, Vendor } from '@thock/data'
import { GroupBuyRow } from '../GroupBuyRow'

const NOW = new Date('2026-05-09T12:00:00.000Z')

function gb(over: Partial<GroupBuy> = {}): GroupBuy {
  return {
    slug: 'sonnet',
    name: 'Mode Sonnet R2',
    vendorSlug: 'cannonkeys',
    productSlug: 'mode-sonnet',
    productKind: 'board',
    startDate: '2026-05-01',
    endDate: '2026-06-15',
    region: 'global',
    url: 'https://cannonkeys.com/products/mode-sonnet',
    imageUrl: null,
    status: 'live',
    description:
      'Second run of the Mode Sonnet 65 percent. Same gasket mount and hotswap PCB.',
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...over,
  }
}

const vendor: Vendor = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description:
    'A short description that is long enough to satisfy the schema minimum.',
  status: 'active',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('<GroupBuyRow>', () => {
  it('renders name, vendor, region, and product kind for live variant', () => {
    render(
      <GroupBuyRow groupBuy={gb()} vendor={vendor} variant="live" now={NOW} />,
    )
    expect(screen.getByText('Mode Sonnet R2')).toBeInTheDocument()
    expect(screen.getByText('CannonKeys')).toBeInTheDocument()
    expect(screen.getByTestId('group-buy-region')).toHaveTextContent('GLOBAL')
  })

  it('shows a CTA with rel="sponsored noopener" target="_blank" on live', () => {
    render(
      <GroupBuyRow groupBuy={gb()} vendor={vendor} variant="live" now={NOW} />,
    )
    const cta = screen.getByTestId('group-buy-cta')
    expect(cta).toHaveAttribute('rel', 'sponsored noopener')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute(
      'href',
      'https://cannonkeys.com/products/mode-sonnet',
    )
  })

  it('shows a days-left countdown on live', () => {
    render(
      <GroupBuyRow groupBuy={gb()} vendor={vendor} variant="live" now={NOW} />,
    )
    // 2026-05-09 → 2026-06-15 = 37 days
    expect(screen.getByTestId('group-buy-countdown')).toHaveTextContent(
      /37d left/i,
    )
  })

  it('shows opens-in copy and a CTA for announced', () => {
    render(
      <GroupBuyRow
        groupBuy={gb({ status: 'announced', startDate: '2026-05-20' })}
        vendor={vendor}
        variant="announced"
        now={NOW}
      />,
    )
    expect(screen.getByTestId('group-buy-countdown')).toHaveTextContent(
      /opens in 11d/i,
    )
    expect(screen.queryByTestId('group-buy-cta')).toBeInTheDocument()
  })

  it('renders no CTA and a status pill for ended', () => {
    render(
      <GroupBuyRow
        groupBuy={gb({ status: 'closed' })}
        vendor={vendor}
        variant="ended"
        now={NOW}
      />,
    )
    expect(screen.queryByTestId('group-buy-cta')).not.toBeInTheDocument()
    expect(screen.getByTestId('group-buy-countdown')).toHaveTextContent(
      /closed/i,
    )
  })

  it('falls back to vendorSlug when vendor is null', () => {
    render(
      <GroupBuyRow
        groupBuy={gb({ vendorSlug: 'mystery-vendor' })}
        vendor={null}
        variant="live"
        now={NOW}
      />,
    )
    expect(screen.getByText('mystery-vendor')).toBeInTheDocument()
  })
})
