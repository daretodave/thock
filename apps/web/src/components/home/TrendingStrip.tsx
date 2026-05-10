import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { TrendingTile } from './TrendingTile'

export type TrendingStripProps = {
  snapshot: TrendSnapshot | null
}

/**
 * Six-tile trending strip on the home page. Reads from the most
 * recent `TrendSnapshot` and renders the top 6 actively-moving rows
 * (direction `up` or `down`) as `<TrendingTile>`s. Hidden entirely
 * when the snapshot is null/empty or contains zero moving rows —
 * matches `phase_6_home.md` "No latest trend snapshot" empty state
 * and respects the rail's "what's moving on the tracker" framing
 * (critique pass 9 #7).
 */
export function TrendingStrip({
  snapshot,
}: TrendingStripProps): ReactElement | null {
  if (!snapshot || snapshot.rows.length === 0) return null

  const tiles = snapshot.rows
    .filter((row) => row.direction !== 'flat')
    .slice(0, 6)
  if (tiles.length === 0) return null

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
