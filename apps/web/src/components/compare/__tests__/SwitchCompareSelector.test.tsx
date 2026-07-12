import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SwitchCompareSelector } from '../SwitchCompareSelector'
import type { Switch } from '@thock/data'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const STUB: Omit<Switch, 'slug' | 'name'> = {
  vendorSlug: 'vendor-x',
  type: 'linear',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 45, bottomOut: 55 },
  travelMm: 4,
  factoryLubed: false,
  releasedAt: null,
  status: 'in-production',
  description: 'Test stub.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const SWITCHES: Switch[] = [
  { ...STUB, slug: 'gateron-oil-king', name: 'Gateron Oil King' },
  { ...STUB, slug: 'cherry-mx2a-red', name: 'Cherry MX2A Red' },
  { ...STUB, slug: 'drop-holy-panda-x', name: 'Drop Holy Panda X' },
]

describe('<SwitchCompareSelector>', () => {
  it('renders two selects and a compare button', () => {
    render(
      <SwitchCompareSelector switches={SWITCHES} initialA="" initialB="" />,
    )
    expect(screen.getByTestId('compare-select-a')).toBeInTheDocument()
    expect(screen.getByTestId('compare-select-b')).toBeInTheDocument()
    expect(screen.getByTestId('compare-button')).toBeInTheDocument()
  })

  it('renders all switch options in each select', () => {
    render(
      <SwitchCompareSelector switches={SWITCHES} initialA="" initialB="" />,
    )
    const selectA = screen.getByTestId('compare-select-a')
    expect(selectA).toHaveTextContent('Gateron Oil King')
    expect(selectA).toHaveTextContent('Cherry MX2A Red')
  })

  it('disables the compare button when both values are empty', () => {
    render(
      <SwitchCompareSelector switches={SWITCHES} initialA="" initialB="" />,
    )
    expect(screen.getByTestId('compare-button')).toBeDisabled()
  })

  it('disables the compare button when a === b', () => {
    render(
      <SwitchCompareSelector
        switches={SWITCHES}
        initialA="gateron-oil-king"
        initialB="gateron-oil-king"
      />,
    )
    expect(screen.getByTestId('compare-button')).toBeDisabled()
  })

  it('enables the compare button when a !== b and both are set', () => {
    render(
      <SwitchCompareSelector
        switches={SWITCHES}
        initialA="gateron-oil-king"
        initialB="cherry-mx2a-red"
      />,
    )
    expect(screen.getByTestId('compare-button')).toBeEnabled()
  })

  it('resyncs selected values when initialA/initialB change on rerender (back/forward nav)', () => {
    const { rerender } = render(
      <SwitchCompareSelector
        switches={SWITCHES}
        initialA="gateron-oil-king"
        initialB="cherry-mx2a-red"
      />,
    )
    expect(screen.getByTestId('compare-select-a')).toHaveValue('gateron-oil-king')
    expect(screen.getByTestId('compare-select-b')).toHaveValue('cherry-mx2a-red')

    rerender(
      <SwitchCompareSelector
        switches={SWITCHES}
        initialA="drop-holy-panda-x"
        initialB="gateron-oil-king"
      />,
    )
    expect(screen.getByTestId('compare-select-a')).toHaveValue('drop-holy-panda-x')
    expect(screen.getByTestId('compare-select-b')).toHaveValue('gateron-oil-king')
  })
})
