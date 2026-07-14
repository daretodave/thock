import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorGroupBuySection } from '../VendorGroupBuySection'
import type { GroupBuy, Vendor } from '@thock/data'

const VENDOR: Vendor = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description: 'Boutique keyboard vendor.',
  status: 'active',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

const BASE_GB: GroupBuy = {
  slug: 'cannonkeys-mode-sonnet-r2',
  name: 'Mode Sonnet R2',
  vendorSlug: 'cannonkeys',
  productSlug: 'mode-sonnet',
  productKind: 'board',
  startDate: '2026-05-01',
  endDate: '2026-06-30',
  region: 'global',
  url: 'https://cannonkeys.com/mode-sonnet-r2',
  imageUrl: null,
  heroImage: null,
  status: 'live',
  description: 'The second run of the Mode Sonnet.',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

const PAST_GB: GroupBuy = {
  ...BASE_GB,
  slug: 'cannonkeys-nyawice',
  name: 'Nyawice',
  endDate: '2026-04-01',
  status: 'closed',
}

// Regression for the stale-status class of bug fixed in
// group-buys/helpers.ts#isLive (critique #44): a record can still say
// status:'announced' after its startDate has already passed.
const STALE_ANNOUNCED_GB: GroupBuy = {
  ...BASE_GB,
  slug: 'cannonkeys-stale-announced',
  name: 'Stale Announced Buy',
  startDate: '2026-05-01',
  endDate: '2026-06-30',
  status: 'announced',
}

describe('VendorGroupBuySection', () => {
  it('shows active group buy list when present', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[BASE_GB]}
        past={[]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    expect(screen.getByTestId('vendor-active-buys-list')).toBeTruthy()
    expect(screen.queryByTestId('vendor-active-buys-empty')).toBeNull()
  })

  it('shows active empty state when no active group buys', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[]}
        past={[PAST_GB]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    expect(screen.getByTestId('vendor-active-buys-empty')).toHaveTextContent(
      'No active group buys from CannonKeys right now.',
    )
  })

  it('shows past group buy list when present', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[]}
        past={[PAST_GB]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    expect(screen.getByTestId('vendor-past-buys-list')).toBeTruthy()
    expect(screen.queryByTestId('vendor-past-buys-empty')).toBeNull()
  })

  it('shows past empty state when no past group buys', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[BASE_GB]}
        past={[]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    expect(screen.getByTestId('vendor-past-buys-empty')).toHaveTextContent(
      'No past group buys recorded for CannonKeys.',
    )
  })

  it('renders both section labels as real h2s, not plain spans', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[BASE_GB]}
        past={[PAST_GB]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    expect(screen.getByTestId('vendor-active-buys-kicker').tagName).toBe('H2')
    expect(screen.getByTestId('vendor-past-buys-kicker').tagName).toBe('H2')
  })

  it('renders a started-but-still-announced buy as live, not "opens today"', () => {
    render(
      <VendorGroupBuySection
        vendorName="CannonKeys"
        active={[STALE_ANNOUNCED_GB]}
        past={[]}
        vendor={VENDOR}
        now={new Date('2026-06-01')}
      />,
    )
    const row = screen.getByTestId('group-buy-row')
    expect(row.getAttribute('data-variant')).toBe('live')
    expect(screen.getByTestId('group-buy-countdown')).toHaveTextContent(
      '29d left',
    )
  })
})
