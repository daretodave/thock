import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoardCompareTable } from '../BoardCompareTable'
import type { Board } from '@thock/data'

const BOARD_A: Board = {
  slug: 'board-a',
  name: 'Board A',
  vendorSlug: 'vendor-x',
  layout: '65',
  caseMaterial: 'aluminum',
  mountStyle: 'gasket',
  hotswap: true,
  wireless: false,
  releasedAt: '2022-01-01',
  status: 'in-stock',
  imageUrl: null,
  description: 'A test 65% board for comparison.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const BOARD_B: Board = {
  slug: 'board-b',
  name: 'Board B',
  vendorSlug: 'vendor-y',
  layout: 'tkl',
  caseMaterial: 'polycarbonate',
  mountStyle: 'top-mount',
  hotswap: false,
  wireless: true,
  releasedAt: '2021-06-01',
  status: 'discontinued',
  imageUrl: null,
  description: 'A test TKL board for comparison.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('<BoardCompareTable>', () => {
  it('renders both board names as links to their detail pages', () => {
    render(<BoardCompareTable boardA={BOARD_A} boardB={BOARD_B} />)
    const linkA = screen.getByTestId('compare-board-a-link')
    const linkB = screen.getByTestId('compare-board-b-link')
    expect(linkA).toHaveTextContent('Board A')
    expect(linkA).toHaveAttribute('href', '/part/board/board-a')
    expect(linkB).toHaveTextContent('Board B')
    expect(linkB).toHaveAttribute('href', '/part/board/board-b')
  })

  it('renders the spec table with 8 rows', () => {
    render(<BoardCompareTable boardA={BOARD_A} boardB={BOARD_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    expect(rows.length).toBe(8)
  })

  it('marks rows with different values as data-differs="true"', () => {
    render(<BoardCompareTable boardA={BOARD_A} boardB={BOARD_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const diffRows = rows.filter((r) => r.getAttribute('data-differs') === 'true')
    expect(diffRows.length).toBeGreaterThan(0)
  })

  it('marks rows with identical values as data-differs="false"', () => {
    render(<BoardCompareTable boardA={BOARD_A} boardB={BOARD_B} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const sameRows = rows.filter((r) => r.getAttribute('data-differs') === 'false')
    expect(sameRows.length).toBe(0)
  })

  it('marks all rows as data-differs="false" when the same record is compared to itself', () => {
    render(<BoardCompareTable boardA={BOARD_A} boardB={BOARD_A} />)
    const rows = screen.getAllByTestId('compare-spec-row')
    const diffRows = rows.filter((r) => r.getAttribute('data-differs') === 'true')
    expect(diffRows.length).toBe(0)
  })
})
