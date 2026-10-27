import type { ReactElement } from 'react'
import type { Article } from '@thock/content'
import type { TrendSnapshot } from '@thock/data'
import { sparkSlope } from '@/lib/tracker'
import { TrendingTile } from './TrendingTile'

export type TrendingStripProps = {
  snapshot: TrendSnapshot | null
  /** Resolved articles keyed by slug, for wiring row → tile links. */
  articlesBySlug?: Map<string, Article>
}

/** Column classes keyed by tile count — the strip renders 1-6 tiles
 * depending on how many rows actually moved this week, not a fixed 6,
 * so the grid track count must track it or an unfilled track renders
 * as a blank `bg-border` cell (critique pass 12 #1052). */
const COLS_BY_TILE_COUNT: Record<number, string> = {
  1: 'sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-1',
  2: 'sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2',
  3: 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3',
  4: 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  5: 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5',
  6: 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6',
}

/**
 * Six-tile trending strip on the home page. Reads from the most
 * recent `TrendSnapshot` and renders the top 6 actively-moving rows
 * (direction `up` or `down`), ranked by movement magnitude
 * (`abs(sparkSlope)` desc — this week's actual swing, the same
 * metric `tracker/index.ts`'s riser/faller picks use), as
 * `<TrendingTile>`s. Hidden entirely when the snapshot is null/empty
 * or contains zero moving rows — matches `phase_6_home.md` "No
 * latest trend snapshot" empty state and respects the rail's "what's
 * moving on the tracker" framing (critique pass 9 #7).
 *
 * `direction` reflects only the latest week-over-week move while
 * `sparkSlope` is the full 8-week trend — they can disagree (a row
 * that climbed for 6 weeks then dipped once is `direction: 'down'`
 * with a positive slope). A sign-mismatched row must never be
 * crowned: its glyph, delta sign, and sparkline tone all key off
 * `direction`, so a mismatch renders a down-red tile whose sparkline
 * visibly climbs. Same guard as `pickRiser`/`pickFaller` in
 * `tracker/index.ts`.
 */
export function TrendingStrip({
  snapshot,
  articlesBySlug,
}: TrendingStripProps): ReactElement | null {
  if (!snapshot || snapshot.rows.length === 0) return null

  const tiles = snapshot.rows
    .filter((row) => row.direction !== 'flat')
    .filter((row) =>
      row.direction === 'up' ? sparkSlope(row) > 0 : sparkSlope(row) < 0,
    )
    .slice()
    .sort((a, b) => Math.abs(sparkSlope(b)) - Math.abs(sparkSlope(a)))
    .slice(0, 6)
  if (tiles.length === 0) return null

  return (
    <div
      data-testid="trending-strip"
      className={`grid grid-cols-1 gap-px border border-border bg-border ${COLS_BY_TILE_COUNT[tiles.length] ?? COLS_BY_TILE_COUNT[6]}`}
    >
      {tiles.map((row) => {
        const article = row.articleSlug
          ? (articlesBySlug?.get(row.articleSlug) ?? null)
          : null
        return (
          <TrendingTile
            key={row.name}
            category={row.category}
            label={row.name}
            delta={row.score}
            dir={row.direction}
            spark={row.spark}
            href={article ? `/article/${article.slug}` : null}
          />
        )
      })}
    </div>
  )
}
