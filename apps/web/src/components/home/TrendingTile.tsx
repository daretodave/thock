import type { ReactElement } from 'react'
import { Sparkline, TrendDirectionGlyph, type TrendDirection } from '@thock/ui'

export type TrendingTileProps = {
  /**
   * Tag-category color used for the small leading dot. Mirrors the
   * design's per-row tag dot — keeps trend-tile rows scannable by
   * category at a glance.
   */
  category: TrendingTileCategory
  label: string
  /**
   * Numeric delta — converted to a signed-percent string, or "flat"
   * when null/zero. Pre-formatted strings are not allowed; the tile
   * owns formatting so the trends-tracker can pass the same shape.
   */
  delta: number | null
  dir: TrendDirection
  spark: number[]
}

export type TrendingTileCategory =
  | 'switch'
  | 'keycap'
  | 'layout'
  | 'vendor'
  | 'brand'

const CATEGORY_DOT: Record<TrendingTileCategory, string> = {
  switch: 'bg-tag-switch',
  keycap: 'bg-tag-material',
  layout: 'bg-tag-layout',
  vendor: 'bg-tag-brand',
  brand: 'bg-tag-brand',
}

const DIR_COLOR: Record<TrendDirection, string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-flat',
}

function formatDelta(delta: number | null, dir: TrendDirection): string {
  if (delta === null || delta === 0 || dir === 'flat') return 'flat'
  const sign = delta > 0 ? '+' : ''
  return `${sign}${Math.round(delta)}%`
}

/**
 * Single tile in the home page Trending strip. Pure presentational —
 * no link target yet (phase 8 wires tiles to tracker rows). Kept
 * deliberately small so the strip fits 6 across at desktop without
 * squeezing.
 */
export function TrendingTile({
  category,
  label,
  delta,
  dir,
  spark,
}: TrendingTileProps): ReactElement {
  const deltaText = formatDelta(delta, dir)
  return (
    <div
      data-testid="trending-tile"
      data-dir={dir}
      className="flex min-h-[110px] flex-col gap-2 bg-bg p-4"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[category]}`}
        />
        <span
          data-testid="trending-tile-category"
          className="font-mono uppercase tracking-[0.08em] text-micro text-text-2"
        >
          {category}
        </span>
      </div>
      <div className="flex-1 font-serif text-h3 text-text leading-tight">
        {label}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span
          className={`flex items-center gap-1 font-mono text-small ${DIR_COLOR[dir]}`}
        >
          <TrendDirectionGlyph dir={dir} size={12} />
          {deltaText}
        </span>
        <span className={DIR_COLOR[dir]}>
          <Sparkline values={spark} tone={dir} w={70} h={20} />
        </span>
      </div>
    </div>
  )
}
