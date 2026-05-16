import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendRow, TrendSnapshot } from '@thock/data'
import { TrackerSummaryGrid } from '../TrackerSummaryGrid'

function row(over: Partial<TrendRow> = {}): TrendRow {
  return {
    name: 'Sample',
    category: 'switch',
    direction: 'up',
    score: 20,
    spark: [1, 2, 3, 4],
    articleSlug: null,
    ...over,
  }
}

function snapshot(rows: TrendRow[]): TrendSnapshot {
  return {
    isoWeek: '2026-W19',
    publishedAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    rows,
  }
}

describe('<TrackerSummaryGrid>', () => {
  it('returns null when no rows are provided', () => {
    const { container } = render(<TrackerSummaryGrid snapshot={snapshot([])} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the grid when at least one slot can be filled', () => {
    render(
      <TrackerSummaryGrid
        snapshot={snapshot([row({ name: 'Oil King', direction: 'up', score: 30 })])}
      />,
    )
    expect(screen.getByTestId('tracker-summary-grid')).toBeInTheDocument()
  })

  it('renders one TrackerSummaryCard per slot', () => {
    const rows: TrendRow[] = [
      row({ name: 'Up-A', direction: 'up', score: 30, spark: [1, 5, 10] }),
      row({ name: 'Up-B', direction: 'up', score: 12, spark: [1, 2, 18] }),
      row({ name: 'Down-A', direction: 'down', score: -22, spark: [10, 5, 1] }),
      row({ name: 'Up-C', direction: 'up', score: 6, spark: [3, 4, 6] }),
    ]
    render(<TrackerSummaryGrid snapshot={snapshot(rows)} />)
    const cards = screen.getAllByTestId('tracker-summary-card')
    expect(cards.length).toBe(4)
  })

  it('contains the top-mover name inside the grid', () => {
    render(
      <TrackerSummaryGrid
        snapshot={snapshot([row({ name: 'HMX Cloud', direction: 'up', score: 45 })])}
      />,
    )
    expect(screen.getByTestId('tracker-summary-grid')).toHaveTextContent('HMX Cloud')
  })
})
