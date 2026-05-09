import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { TrendingTile } from './TrendingTile'

export type TrendingStripProps = {
  snapshot: TrendSnapshot | null
}

/**
 * Six-tile trending strip on the home page. Reads from the most
 * recent `TrendSnapshot` and renders rank 1–6 as `<TrendingTile>`s.
 * Hidden entirely when the snapshot is null or empty — matches
 * `phase_6_home.md` "No latest trend snapshot" empty state.
 */
export function TrendingStrip({
  snapshot,
}: TrendingStripProps): ReactElement | null {
  if (!snapshot || snapshot.rows.length === 0) return null

  const tiles = snapshot.rows.slice(0, 6)

  return (
    <div
      data-testid="trending-strip"
      className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
    >
      {tiles.map((row) => (
        <TrendingTile
          key={row.name}
          category={row.category}
          label={row.name}
          delta={row.score}
          dir={row.direction}
          spark={row.spark}
        />
      ))}
    </div>
  )
}
