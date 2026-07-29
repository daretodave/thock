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

  it('preserves input order for equal-score rows (stable tie-break)', () => {
    const snapshot = makeTrendSnapshot()
    const a = { ...snapshot.rows[0]!, name: 'Alpha' }
    const b = { ...snapshot.rows[0]!, name: 'Beta' }
    snapshot.rows = [a, b]
    render(<TrendingStrip snapshot={snapshot} />)
    const tiles = screen.getAllByTestId('trending-tile')
    expect(tiles[0]).toHaveTextContent('Alpha')
    expect(tiles[1]).toHaveTextContent('Beta')
  })

  it('ranks tiles by movement magnitude, not input order', () => {
    // Regression guard: TrendingStrip used to take the first 6
    // non-flat rows in raw file order, silently excluding the
    // week's biggest movers whenever a low-score row happened to
    // sort earlier in data/trends/<week>.json (score field is the
    // established magnitude metric — see tracker/index.ts's
    // riser/faller picks).
    const snapshot = makeTrendSnapshot()
    const smallEarly = {
      ...snapshot.rows[0]!,
      name: 'SmallEarly',
      score: 10,
      direction: 'up' as const,
    }
    const bigLate = {
      ...snapshot.rows[0]!,
      name: 'BigLate',
      score: 90,
      direction: 'up' as const,
    }
    const bigNegative = {
      ...snapshot.rows[0]!,
      name: 'BigNegative',
      score: -80,
      direction: 'down' as const,
    }
    snapshot.rows = [smallEarly, bigLate, bigNegative]
    render(<TrendingStrip snapshot={snapshot} />)
    const tiles = screen.getAllByTestId('trending-tile')
    expect(tiles[0]).toHaveTextContent('BigLate')
    expect(tiles[1]).toHaveTextContent('BigNegative')
    expect(tiles[2]).toHaveTextContent('SmallEarly')
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
