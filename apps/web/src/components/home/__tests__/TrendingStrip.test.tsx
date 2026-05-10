import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendingStrip } from '../TrendingStrip'
import { makeTrendSnapshot } from './testFixtures'

describe('<TrendingStrip>', () => {
  it('hides itself when the snapshot is null', () => {
    const { container } = render(<TrendingStrip snapshot={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('hides itself when the snapshot has zero rows', () => {
    const snapshot = makeTrendSnapshot()
    snapshot.rows = []
    const { container } = render(<TrendingStrip snapshot={snapshot} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one tile per row, capped at six', () => {
    const snapshot = makeTrendSnapshot()
    const baseRow = snapshot.rows[0]!
    snapshot.rows = Array.from({ length: 8 }, (_, i) => ({
      ...baseRow,
      name: `R${i}`,
    }))
    render(<TrendingStrip snapshot={snapshot} />)
    const tiles = screen.getAllByTestId('trending-tile')
    expect(tiles).toHaveLength(6)
  })

  it('preserves input order in tile rendering', () => {
    const snapshot = makeTrendSnapshot()
    const a = { ...snapshot.rows[0]!, name: 'Alpha' }
    const b = { ...snapshot.rows[0]!, name: 'Beta' }
    snapshot.rows = [a, b]
    render(<TrendingStrip snapshot={snapshot} />)
    const tiles = screen.getAllByTestId('trending-tile')
    expect(tiles[0]).toHaveTextContent('Alpha')
    expect(tiles[1]).toHaveTextContent('Beta')
  })

  it('excludes rows with direction `flat` (rail header commits to movement)', () => {
    // Regression guard for plan/CRITIQUE.md pass 9 #7 [MED]:
    // /  — Trending "what's moving on the tracker" rail surfaced an
    // MT3 profile flat tile, contradicting the rail's framing.
    const snapshot = makeTrendSnapshot()
    const upRow = { ...snapshot.rows[0]!, name: 'Mover', direction: 'up' as const }
    const flatRow = {
      ...snapshot.rows[0]!,
      name: 'Holding',
      direction: 'flat' as const,
    }
    snapshot.rows = [upRow, flatRow]
    render(<TrendingStrip snapshot={snapshot} />)
    const tiles = screen.getAllByTestId('trending-tile')
    expect(tiles).toHaveLength(1)
    expect(tiles[0]).toHaveTextContent('Mover')
  })

  it('hides itself when every row is flat (no movement to report)', () => {
    const snapshot = makeTrendSnapshot()
    snapshot.rows = snapshot.rows.map((r) => ({
      ...r,
      direction: 'flat' as const,
    }))
    const { container } = render(<TrendingStrip snapshot={snapshot} />)
    expect(container.firstChild).toBeNull()
  })
})
