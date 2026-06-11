import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorCard } from '../VendorCard'
import type { Vendor } from '@thock/data'

const VENDOR: Vendor = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description:
    'Boutique keyboard vendor based in the United States. Stocks switches, keycaps, and runs in-house and partnered group buys for boards and accessories.',
  status: 'active',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('VendorCard', () => {
  it('renders vendor name as link to detail page', () => {
    render(<VendorCard vendor={VENDOR} />)
    const link = screen.getByTestId('vendor-card-name')
    expect(link).toHaveTextContent('CannonKeys')
    expect(link).toHaveAttribute('href', '/vendor/cannonkeys')
  })

  it('renders country label', () => {
    render(<VendorCard vendor={VENDOR} />)
    expect(screen.getByTestId('vendor-card-country')).toHaveTextContent('United States')
  })

  it('renders description text', () => {
    render(<VendorCard vendor={VENDOR} />)
    const desc = screen.getByTestId('vendor-card-description')
    expect(desc.textContent).toBeTruthy()
  })

  it('truncates description longer than 130 chars', () => {
    const longDesc = 'A'.repeat(200)
    render(<VendorCard vendor={{ ...VENDOR, description: longDesc }} />)
    const desc = screen.getByTestId('vendor-card-description')
    expect((desc.textContent ?? '').length).toBeLessThan(200)
    expect(desc.textContent).toMatch(/…$/)
  })

  it('renders external link to vendor URL', () => {
    render(<VendorCard vendor={VENDOR} />)
    const link = screen.getByTestId('vendor-card-external-link')
    expect(link).toHaveAttribute('href', 'https://cannonkeys.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders detail page link', () => {
    render(<VendorCard vendor={VENDOR} />)
    const link = screen.getByTestId('vendor-card-detail-link')
    expect(link).toHaveAttribute('href', '/vendor/cannonkeys')
  })
})
