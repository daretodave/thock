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

  it('gives the direction glyph an accessible label beyond the bare direction word', () => {
    render(
      <TrackerSummaryCard
        kind="riser"
        kicker="biggest riser"
        row={row({ direction: 'up', score: 42 })}
      />,
    )
    expect(screen.getByTestId('trend-direction-glyph')).toHaveAttribute(
      'aria-label',
      'up trend',
    )
  })

  it('gives the sparkline an accessible label naming the item, not a generic description (a11y — closes #868)', () => {
    render(
      <TrackerSummaryCard
        kind="riser"
        kicker="biggest riser"
        row={row({ name: 'Oil King', direction: 'up' })}
      />,
    )
    expect(screen.getByTestId('sparkline')).toHaveAttribute(
      'aria-label',
      'Oil King: up trend',
    )
  })

  it('renders the sleeper slot with a neutral glyph/color regardless of the row\'s own direction (critique pass 13)', () => {
    render(
      <TrackerSummaryCard
        kind="sleeper"
        kicker="sleeper"
        row={row({ name: 'GMK CYL Zombie', direction: 'down', score: -40 })}
      />,
    )
    const glyph = screen.getByTestId('trend-direction-glyph')
    expect(glyph).toHaveAttribute('data-dir', 'flat')
    expect(glyph).toHaveAttribute('aria-label', 'sleeper')
    expect(screen.getByTestId('sparkline')).toHaveAttribute('data-tone', 'flat')
    // The number itself stays truthful to the row's actual move.
    expect(screen.getByTestId('tracker-summary-card')).toHaveTextContent('-40%')
  })
})
