import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoardCompareSelector } from '../BoardCompareSelector'
import type { Board } from '@thock/data'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const STUB: Omit<Board, 'slug' | 'name'> = {
  vendorSlug: 'vendor-x',
  layout: '65',
  caseMaterial: 'aluminum',
  mountStyle: 'gasket',
  hotswap: true,
  wireless: false,
  releasedAt: null,
  status: 'in-stock',
  imageUrl: null,
  description: 'Test stub board.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const BOARDS: Board[] = [
  { ...STUB, slug: 'mode-sonnet', name: 'Mode Sonnet' },
  { ...STUB, slug: 'bakeneko65', name: 'Bakeneko65' },
  { ...STUB, slug: 'class80', name: 'MM Studio Class80' },
]

describe('<BoardCompareSelector>', () => {
  it('renders two selects and a compare button', () => {
    render(
      <BoardCompareSelector boards={BOARDS} initialA="" initialB="" />,
    )
    expect(screen.getByTestId('compare-select-a')).toBeInTheDocument()
    expect(screen.getByTestId('compare-select-b')).toBeInTheDocument()
    expect(screen.getByTestId('compare-button')).toBeInTheDocument()
  })

  it('renders all board options in each select', () => {
    render(
      <BoardCompareSelector boards={BOARDS} initialA="" initialB="" />,
    )
    const selectA = screen.getByTestId('compare-select-a')
    expect(selectA).toHaveTextContent('Mode Sonnet')
    expect(selectA).toHaveTextContent('Bakeneko65')
  })

  it('disables the compare button when both values are empty', () => {
    render(
      <BoardCompareSelector boards={BOARDS} initialA="" initialB="" />,
    )
    expect(screen.getByTestId('compare-button')).toBeDisabled()
  })

  it('disables the compare button when a === b', () => {
    render(
      <BoardCompareSelector
        boards={BOARDS}
        initialA="mode-sonnet"
        initialB="mode-sonnet"
      />,
    )
    expect(screen.getByTestId('compare-button')).toBeDisabled()
  })

  it('enables the compare button when a !== b and both are set', () => {
    render(
      <BoardCompareSelector
        boards={BOARDS}
        initialA="mode-sonnet"
        initialB="bakeneko65"
      />,
    )
    expect(screen.getByTestId('compare-button')).toBeEnabled()
  })
})
