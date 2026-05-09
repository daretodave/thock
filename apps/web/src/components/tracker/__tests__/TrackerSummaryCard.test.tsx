import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendRow } from '@thock/data'
import { TrackerSummaryCard } from '../TrackerSummaryCard'

function row(over: Partial<TrendRow> = {}): TrendRow {
  return {
    name: 'Sample',
    category: 'switch',
    direction: 'up',
    score: 30,
    spark: [1, 2, 3, 4],
    articleSlug: null,
    ...over,
  }
}

describe('<TrackerSummaryCard>', () => {
  it('renders kicker, name, signed score, and a sparkline', () => {
    render(
      <TrackerSummaryCard
        kind="riser"
        kicker="biggest riser"
        row={row({ name: 'Oil King', score: 42, direction: 'up' })}
      />,
    )
    const card = screen.getByTestId('tracker-summary-card')
    expect(card).toHaveTextContent(/biggest riser/i)
    expect(card).toHaveTextContent('Oil King')
    expect(card).toHaveTextContent('+42%')
    expect(screen.getByTestId('sparkline')).toBeInTheDocument()
  })

  it('exposes the slot kind via a data attribute', () => {
    render(
      <TrackerSummaryCard
        kind="faller"
        kicker="biggest faller"
        row={row({ direction: 'down', score: -22 })}
      />,
    )
    const card = screen.getByTestId('tracker-summary-card')
    expect(card.getAttribute('data-kind')).toBe('faller')
    expect(card).toHaveTextContent('-22%')
  })
})
