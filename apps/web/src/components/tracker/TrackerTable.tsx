import type { ReactElement } from 'react'
import type { TrendRow } from '@thock/data'
import type { Article } from '@thock/content'
import { TrackerRow } from './TrackerRow'

export type TrackerTableProps = {
  rows: TrendRow[]
  /** Optional resolved articles keyed by slug. */
  articlesBySlug?: Map<string, Article>
}

/**
 * Tabular section of the tracker. Header row + N body rows.
 * Renders nothing when rows is empty (the parent section skips
 * the heading too).
 */
export function TrackerTable({
  rows,
  articlesBySlug,
}: TrackerTableProps): ReactElement | null {
  if (rows.length === 0) return null

  return (
    <div
      data-testid="tracker-table"
      className="border border-border"
    >
      <div className="hidden grid-cols-[48px_minmax(0,1fr)_120px_120px_minmax(0,1.4fr)] gap-6 border-b border-border px-5 py-3 font-mono uppercase tracking-[0.1em] text-micro text-text-3 md:grid">
        <span>Rank</span>
        <span>Name</span>
        <span>Score</span>
        <span>8-wk</span>
        <span>Editor&apos;s note</span>
      </div>
      <div className="flex flex-col px-5">
        {rows.map((row, i) => (
          <TrackerRow
            key={row.name}
            rank={i + 1}
            row={row}
            article={
              row.articleSlug
                ? (articlesBySlug?.get(row.articleSlug) ?? null)
                : null
            }
          />
        ))}
      </div>
    </div>
  )
}
