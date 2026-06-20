import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorBoardSection } from '../VendorBoardSection'
import type { Board } from '@thock/data'

const BASE_BOARD: Board = {
  slug: 'mode-sonnet',
  name: 'Mode Sonnet',
  vendorSlug: 'cannonkeys',
  layout: '65',
  caseMaterial: 'aluminum',
  mountStyle: 'gasket',
  hotswap: false,
  wireless: false,
  releasedAt: '2026-05-01',
  status: 'in-stock',
  imageUrl: null,
  description: 'A premium 65% gasket-mount board with polycarbonate weight and stainless steel switch plate.',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('VendorBoardSection', () => {
  it('shows empty state when no boards', () => {
    render(<VendorBoardSection vendorName="CannonKeys" boards={[]} />)
    expect(screen.getByTestId('vendor-boards-empty')).toHaveTextContent(
      'No boards from CannonKeys in the catalog yet.',
    )
    expect(screen.queryByTestId('vendor-boards-list')).toBeNull()
  })

  it('renders board list when boards present', () => {
    render(<VendorBoardSection vendorName="CannonKeys" boards={[BASE_BOARD]} />)
    expect(screen.getByTestId('vendor-boards-list')).toBeTruthy()
    expect(screen.queryByTestId('vendor-boards-empty')).toBeNull()
  })

  it('renders board name as link to part detail page', () => {
    render(<VendorBoardSection vendorName="CannonKeys" boards={[BASE_BOARD]} />)
    const link = screen.getByRole('link', { name: 'Mode Sonnet' })
    expect(link).toHaveAttribute('href', '/part/board/mode-sonnet')
  })

  it('renders layout and status labels', () => {
    render(<VendorBoardSection vendorName="CannonKeys" boards={[BASE_BOARD]} />)
    const row = screen.getByTestId('vendor-board-row')
    expect(row.textContent).toContain('65%')
    expect(row.textContent).toContain('In stock')
  })

  it('truncates description longer than 100 chars', () => {
    const longDesc = 'A'.repeat(150) + ' extra words'
    render(
      <VendorBoardSection
        vendorName="CannonKeys"
        boards={[{ ...BASE_BOARD, description: longDesc }]}
      />,
    )
    const row = screen.getByTestId('vendor-board-row')
    const descText = row.querySelector('p')?.textContent ?? ''
    expect(descText.length).toBeLessThan(150)
    expect(descText).toMatch(/…$/)
  })
})
