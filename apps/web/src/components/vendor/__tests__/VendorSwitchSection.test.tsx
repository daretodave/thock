import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorSwitchSection } from '../VendorSwitchSection'
import type { Switch } from '@thock/data'

const BASE_SWITCH: Switch = {
  slug: 'kailh-box-white',
  name: 'Kailh Box White',
  vendorSlug: 'novelkeys',
  type: 'clicky',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 50, bottomOut: 60 },
  travelMm: 3.6,
  factoryLubed: false,
  releasedAt: '2020-01-01',
  status: 'in-production',
  description: 'A crisp clicky switch with a box stem for ingress protection and a sharp, high-pitched click bar.',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('VendorSwitchSection', () => {
  it('shows empty state when no switches', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[]} />)
    expect(screen.getByTestId('vendor-switches-empty')).toHaveTextContent(
      'No switches from NovelKeys in the catalog yet.',
    )
    expect(screen.queryByTestId('vendor-switches-list')).toBeNull()
  })

  it('renders switch list when switches present', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[BASE_SWITCH]} />)
    expect(screen.getByTestId('vendor-switches-list')).toBeTruthy()
    expect(screen.queryByTestId('vendor-switches-empty')).toBeNull()
  })

  it('renders switch name as link to part detail page', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[BASE_SWITCH]} />)
    const link = screen.getByRole('link', { name: 'Kailh Box White' })
    expect(link).toHaveAttribute('href', '/part/switch/kailh-box-white')
  })

  it('renders type and status as human labels, not raw enum values', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[BASE_SWITCH]} />)
    const row = screen.getByTestId('vendor-switch-row')
    expect(row.textContent).toContain('Clicky')
    expect(row.textContent).toContain('In production')
  })

  it('renders the section label as a real h2, not a plain span', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[BASE_SWITCH]} />)
    const heading = screen.getByTestId('vendor-switches-kicker')
    expect(heading.tagName).toBe('H2')
  })

  it('truncates description longer than 100 chars', () => {
    const longDesc = 'A'.repeat(150) + ' extra words'
    render(
      <VendorSwitchSection
        vendorName="NovelKeys"
        switches={[{ ...BASE_SWITCH, description: longDesc }]}
      />,
    )
    const row = screen.getByTestId('vendor-switch-row')
    const descText = row.querySelector('p')?.textContent ?? ''
    expect(descText.length).toBeLessThan(150)
    expect(descText).toMatch(/…$/)
  })

  it('has a focus-visible ring on the title link for keyboard navigation', () => {
    render(<VendorSwitchSection vendorName="NovelKeys" switches={[BASE_SWITCH]} />)
    const link = screen.getByRole('link', { name: 'Kailh Box White' })
    expect(link.className).toContain('focus-visible:ring-2')
  })
})
