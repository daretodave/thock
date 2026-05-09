import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendingTile } from '../TrendingTile'

describe('<TrendingTile>', () => {
  it('renders the label, category, and a sparkline', () => {
    render(
      <TrendingTile
        category="switch"
        label="Gateron Oil King"
        delta={42}
        dir="up"
        spark={[1, 2, 3, 4]}
      />,
    )
    const tile = screen.getByTestId('trending-tile')
    expect(tile).toHaveTextContent('Gateron Oil King')
    expect(tile).toHaveTextContent(/switch/i)
    expect(screen.getByTestId('sparkline')).toBeInTheDocument()
  })

  it('formats positive deltas with explicit + sign', () => {
    render(
      <TrendingTile
        category="vendor"
        label="Mode"
        delta={34}
        dir="up"
        spark={[1, 2]}
      />,
    )
    expect(screen.getByTestId('trending-tile')).toHaveTextContent('+34%')
  })

  it('formats negative deltas with sign', () => {
    render(
      <TrendingTile
        category="layout"
        label="Alice"
        delta={-9}
        dir="down"
        spark={[5, 4]}
      />,
    )
    expect(screen.getByTestId('trending-tile')).toHaveTextContent('-9%')
  })

  it('renders "flat" when direction is flat', () => {
    render(
      <TrendingTile
        category="keycap"
        label="MT3"
        delta={0}
        dir="flat"
        spark={[5, 5]}
      />,
    )
    const tile = screen.getByTestId('trending-tile')
    expect(tile).toHaveTextContent('flat')
    expect(tile.getAttribute('data-dir')).toBe('flat')
  })

  it('falls back to "flat" when delta is null', () => {
    render(
      <TrendingTile
        category="brand"
        label="Wuque"
        delta={null}
        dir="flat"
        spark={[5, 5]}
      />,
    )
    expect(screen.getByTestId('trending-tile')).toHaveTextContent('flat')
  })
})
