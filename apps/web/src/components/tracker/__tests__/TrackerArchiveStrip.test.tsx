import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendSnapshot } from '@thock/data'
import { TrackerArchiveStrip } from '../TrackerArchiveStrip'

function makeSnapshot(isoWeek: string): TrendSnapshot {
  return {
    isoWeek,
    publishedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    rows: [
      {
        name: 'Switch A',
        category: 'switch',
        direction: 'up',
        score: 10,
        spark: [1, 2, 3],
        articleSlug: null,
        note: null,
      },
      {
        name: 'Switch B',
        category: 'switch',
        direction: 'down',
        score: -5,
        spark: [5, 4, 3],
        articleSlug: null,
        note: null,
      },
      {
        name: 'Keycap A',
        category: 'keycap',
        direction: 'flat',
        score: 2,
        spark: [2, 2, 2],
        articleSlug: null,
        note: null,
      },
    ],
  }
}

describe('<TrackerArchiveStrip>', () => {
  it('renders nothing when only one snapshot is provided', () => {
    const { container } = render(
      <TrackerArchiveStrip
        snapshots={[makeSnapshot('2026-W19')]}
        currentWeek="2026-W19"
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders an archive entry for each snapshot when two exist', () => {
    render(
      <TrackerArchiveStrip
        snapshots={[makeSnapshot('2026-W19'), makeSnapshot('2026-W20')]}
        currentWeek="2026-W20"
      />,
    )
    expect(screen.getByTestId('tracker-archive-strip')).toBeInTheDocument()
    const links = screen.getAllByTestId('tracker-archive-link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute(
      'href',
      '/trends/tracker/2026-W19',
    )
  })

  it('marks the current week as non-link (aria-current=page)', () => {
    render(
      <TrackerArchiveStrip
        snapshots={[makeSnapshot('2026-W19'), makeSnapshot('2026-W20')]}
        currentWeek="2026-W20"
      />,
    )
    const current = screen.getByTestId('tracker-archive-current')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName.toLowerCase()).not.toBe('a')
  })

  it('shows direction counts (up/flat/down) for each snapshot', () => {
    render(
      <TrackerArchiveStrip
        snapshots={[makeSnapshot('2026-W19'), makeSnapshot('2026-W20')]}
        currentWeek="2026-W20"
      />,
    )
    const strip = screen.getByTestId('tracker-archive-strip')
    expect(strip.textContent).toContain('+1')
    expect(strip.textContent).toContain('-1')
  })

  it('caps at 8 entries when more than 8 snapshots exist', () => {
    const snapshots = Array.from({ length: 12 }, (_, i) =>
      makeSnapshot(`2026-W${String(i + 1).padStart(2, '0')}`),
    )
    render(
      <TrackerArchiveStrip
        snapshots={snapshots}
        currentWeek="2026-W12"
      />,
    )
    const links = screen.getAllByTestId('tracker-archive-link')
    const current = screen.getAllByTestId('tracker-archive-current')
    expect(links.length + current.length).toBe(8)
  })
})
