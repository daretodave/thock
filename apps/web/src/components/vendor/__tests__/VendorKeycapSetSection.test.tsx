import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorKeycapSetSection } from '../VendorKeycapSetSection'
import type { KeycapSet } from '@thock/data'

const BASE_KEYCAP_SET: KeycapSet = {
  slug: 'gmk-cyl-ramune',
  name: 'GMK CYL Ramune',
  vendorSlug: 'kbdfans',
  profile: 'cherry',
  material: 'abs',
  legendType: 'doubleshot',
  designer: 'Team Ramune',
  releasedAt: '2026-02-01',
  status: 'in-stock',
  imageUrl: null,
  description: 'A soda-blue GMK set with a cyan-and-white colorway inspired by ramune bottles.',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('VendorKeycapSetSection', () => {
  it('shows empty state when no keycap sets', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[]} />)
    expect(screen.getByTestId('vendor-keycap-sets-empty')).toHaveTextContent(
      'No keycap sets from KBDfans in the catalog yet.',
    )
    expect(screen.queryByTestId('vendor-keycap-sets-list')).toBeNull()
  })

  it('renders keycap set list when sets present', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[BASE_KEYCAP_SET]} />)
    expect(screen.getByTestId('vendor-keycap-sets-list')).toBeTruthy()
    expect(screen.queryByTestId('vendor-keycap-sets-empty')).toBeNull()
  })

  it('renders keycap set name as link to part detail page', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[BASE_KEYCAP_SET]} />)
    const link = screen.getByRole('link', { name: 'GMK CYL Ramune' })
    expect(link).toHaveAttribute('href', '/part/keycap-set/gmk-cyl-ramune')
  })

  it('renders profile and status as human labels, not raw enum values', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[BASE_KEYCAP_SET]} />)
    const row = screen.getByTestId('vendor-keycap-set-row')
    expect(row.textContent).toContain('Cherry')
    expect(row.textContent).toContain('In stock')
  })

  it('renders the section label as a real h2, not a plain span', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[BASE_KEYCAP_SET]} />)
    const heading = screen.getByTestId('vendor-keycap-sets-kicker')
    expect(heading.tagName).toBe('H2')
  })

  it('truncates description longer than 100 chars', () => {
    const longDesc = 'A'.repeat(150) + ' extra words'
    render(
      <VendorKeycapSetSection
        vendorName="KBDfans"
        keycapSets={[{ ...BASE_KEYCAP_SET, description: longDesc }]}
      />,
    )
    const row = screen.getByTestId('vendor-keycap-set-row')
    const descText = row.querySelector('p')?.textContent ?? ''
    expect(descText.length).toBeLessThan(150)
    expect(descText).toMatch(/…$/)
  })

  it('has a focus-visible ring on the title link for keyboard navigation', () => {
    render(<VendorKeycapSetSection vendorName="KBDfans" keycapSets={[BASE_KEYCAP_SET]} />)
    const link = screen.getByRole('link', { name: BASE_KEYCAP_SET.name })
    expect(link.className).toContain('focus-visible:ring-2')
  })
})
