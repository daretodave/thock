import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SwitchCompareTable } from '../SwitchCompareTable'
import type { Switch } from '@thock/data'

vi.mock('@/lib/data-runtime', async () => {
  const actual = await vi.importActual<typeof import('@/lib/data-runtime')>(
    '@/lib/data-runtime',
  )
  return {
    ...actual,
    getVendorBySlug: (slug: string) =>
      slug === 'vendor-x'
        ? { slug: 'vendor-x', name: 'Vendor X Studio', url: 'https://vendor-x.example' }
        : null,
  }
})

const SWITCH_A: Switch = {
  slug: 'switch-a',
  name: 'Switch A',
  vendorSlug: 'vendor-x',
  type: 'linear',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 45, bottomOut: 55 },
  travelMm: 4,
  factoryLubed: true,
  releasedAt: '2022-01-01',
  status: 'in-production',
  description: 'A test linear switch for comparison.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const SWITCH_B: Switch = {
  slug: 'switch-b',
  name: 'Switch B',
  vendorSlug: 'vendor-y',
  type: 'tactile',
  housingTop: 'nylon',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 67, bottomOut: 80 },
  travelMm: 4,
  factoryLubed: false,
  releasedAt: '2021-06-01',
  status: 'in-production',
  description: 'A test tactile switch for comparison.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('<SwitchCompareTable>', () => {
  it('renders both switch names as links to their detail pages', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    const linkA = screen.getByTestId('compare-switch-a-link')
    const linkB = screen.getByTestId('compare-switch-b-link')
    expect(linkA).toHaveTextContent('Switch A')
    expect(linkA).toHaveAttribute('href', '/part/switch/switch-a')
    expect(linkB).toHaveTextContent('Switch B')
    expect(linkB).toHaveAttribute('href', '/part/switch/switch-b')
  })

  it('renders the spec table with the correct number of rows', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    expect(rows.length).toBe(10)
  })

  it('marks rows with different values as data-differs="true"', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const diffRows = rows.filter((r) => r.getAttribute('data-differs') === 'true')
    expect(diffRows.length).toBeGreaterThan(0)
  })

  it('marks rows with identical values as data-differs="false"', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const sameRows = rows.filter((r) => r.getAttribute('data-differs') === 'false')
    // Bottom housing (nylon/nylon), stem (pom/pom), travel (4mm/4mm), status both in-production
    expect(sameRows.length).toBeGreaterThan(0)
  })

  it('marks all rows as data-differs="false" when the same record is compared to itself', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_A} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const diffRows = rows.filter((r) => r.getAttribute('data-differs') === 'true')
    expect(diffRows.length).toBe(0)
  })

  it('renders the status as a human label, not the raw enum value', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    expect(screen.getAllByText('in production').length).toBeGreaterThan(0)
    expect(screen.queryByText('in-production')).not.toBeInTheDocument()
  })

  it('renders type, housing, and stem material as human labels, not raw enum values', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    expect(screen.getByText('Linear')).toBeInTheDocument()
    expect(screen.getByText('Tactile')).toBeInTheDocument()
    expect(screen.getAllByText('PC').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Nylon').length).toBeGreaterThan(0)
    expect(screen.getAllByText('POM').length).toBeGreaterThan(0)
    expect(screen.queryByText('pc')).not.toBeInTheDocument()
  })

  it('resolves vendorSlug to the vendor display name, falling back to the raw slug when unknown', () => {
    render(<SwitchCompareTable switchA={SWITCH_A} switchB={SWITCH_B} />)
    expect(screen.getByText('Vendor X Studio')).toBeInTheDocument()
    expect(screen.getByText('vendor-y')).toBeInTheDocument()
  })
})
