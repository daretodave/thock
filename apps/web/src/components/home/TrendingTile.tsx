import Link from 'next/link'
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
  /**
   * Resolved `/article/[slug]` href for this row, or `null` when the
   * row has no `articleSlug` or it doesn't resolve to a real article
   * (same resolve-then-link pattern as `TrackerRow`'s `noteHref`).
   * The whole tile becomes the click target when present.
   */
  href?: string | null
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
  const sign = dir === 'up' ? '+' : '-'
  return `${sign}${Math.round(Math.abs(delta))}%`
}

/**
 * Single tile in the home page Trending strip. Wraps the whole tile
 * in a `Link` to the row's article when `href` resolves (same
 * whole-card-is-the-target pattern as `ArticleCard`); renders as a
 * plain `div` otherwise. Kept deliberately small so the strip fits
 * 6 across at desktop without squeezing.
 */
export function TrendingTile({
  category,
  label,
  delta,
  dir,
  spark,
  href = null,
}: TrendingTileProps): ReactElement {
  const deltaText = formatDelta(delta, dir)
  const className =
    'flex min-h-[110px] flex-col gap-2 bg-bg p-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu'
  const content = (
    <>
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
      <h3 className="flex-1 font-serif text-h3 text-text leading-tight">
        {label}
      </h3>
      <div className="flex items-end justify-between gap-2">
        <span
          className={`flex items-center gap-1 font-mono text-small ${DIR_COLOR[dir]}`}
        >
          <TrendDirectionGlyph dir={dir} size={12} ariaLabel={`${dir} trend`} />
          {deltaText}
        </span>
        <span className={DIR_COLOR[dir]}>
          <Sparkline
            values={spark}
            tone={dir}
            w={70}
            h={20}
            ariaLabel={`${label}: ${dir} trend`}
          />
        </span>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        data-testid="trending-tile"
        data-dir={dir}
        className={className}
      >
        {content}
      </Link>
    )
  }

  return (
    <div data-testid="trending-tile" data-dir={dir} className={className}>
      {content}
    </div>
  )
}
