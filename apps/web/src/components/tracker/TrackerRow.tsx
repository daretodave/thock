import Link from 'next/link'
import type { ReactElement } from 'react'
import type { TrendRow } from '@thock/data'
import type { Article } from '@thock/content'
import { Sparkline, TrendDirectionGlyph } from '@thock/ui'
import { formatDelta } from '@/lib/tracker'

export type TrackerRowProps = {
  rank: number
  row: TrendRow
  /** Resolved article for the row's `articleSlug`, when present. */
  article?: Article | null
}

const TONE_CLASS: Record<TrendRow['direction'], string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-flat',
}

/**
 * One row in a tracker table. Renders rank, name, score with glyph,
 * sparkline, and an editor's-note column linking to the row's
 * article when one resolves. Mobile drops the editor's-note column
 * — the link surfaces under the row title via stacked layout.
 */
export function TrackerRow({
  rank,
  row,
  article,
}: TrackerRowProps): ReactElement {
  const delta = formatDelta(row.score, row.direction)
  const noteHref =
    article && row.articleSlug ? `/article/${row.articleSlug}` : null
  const noteText = article?.frontmatter.title ?? null

  return (
    <div
      data-testid="tracker-row"
      data-direction={row.direction}
      className="grid grid-cols-[40px_1fr_auto] items-baseline gap-3 border-t border-border py-4 first:border-t-0 md:grid-cols-[48px_minmax(0,1fr)_120px_120px_minmax(0,1.4fr)] md:items-center md:gap-6"
    >
      <span className="font-mono text-h3 text-text-3">{String(rank).padStart(2, '0')}</span>
      <div className="flex flex-col gap-1 md:gap-0">
        {noteHref ? (
          <Link
            data-testid="tracker-row-name-link"
            href={noteHref}
            className="font-serif text-h3 text-text hover:text-accent"
          >
            {row.name}
          </Link>
        ) : (
          <span className="font-serif text-h3 text-text">{row.name}</span>
        )}
        {noteHref && noteText && (
          <Link
            href={noteHref}
            className="text-small text-text-2 hover:text-accent md:hidden"
          >
            {noteText} →
          </Link>
        )}
      </div>
      <span
        className={`flex items-center gap-2 font-mono text-small md:justify-self-start ${TONE_CLASS[row.direction]}`}
      >
        <TrendDirectionGlyph dir={row.direction} size={12} />
        {delta}
      </span>
      <span className={`hidden md:block ${TONE_CLASS[row.direction]}`}>
        <Sparkline values={row.spark} tone={row.direction} w={110} h={24} />
      </span>
      <span className="hidden text-small md:block">
        {noteHref && noteText ? (
          <Link href={noteHref} className="text-text-2 hover:text-accent">
            {noteText} →
          </Link>
        ) : (
          <span aria-hidden="true" className="text-text-4">
            —
          </span>
        )}
      </span>
    </div>
  )
}
