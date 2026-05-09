import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendRow } from '@thock/data'
import { TrackerTable } from '../TrackerTable'

function row(name: string, score: number): TrendRow {
  return {
    name,
    category: 'switch',
    direction: 'up',
    score,
    spark: [1, 2, 3],
    articleSlug: null,
  }
}

describe('<TrackerTable>', () => {
  it('renders nothing when given zero rows', () => {
    const { container } = render(<TrackerTable rows={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one tracker-row per input row in order', () => {
    render(
      <TrackerTable
        rows={[row('Alpha', 30), row('Beta', 20), row('Gamma', 10)]}
      />,
    )
    const rows = screen.getAllByTestId('tracker-row')
    expect(rows.map((r) => r.textContent)).toEqual([
      expect.stringContaining('Alpha'),
      expect.stringContaining('Beta'),
      expect.stringContaining('Gamma'),
    ])
  })
})
