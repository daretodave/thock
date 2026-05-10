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
 * sparkline, and an editor's-note column. The row name is the
 * single click target when an article resolves; the editor's-note
 * text is descriptive copy on both viewports (mobile renders it
 * stacked below the row name; desktop renders it in its own
 * column).
 *
 * The note text is rendered in two DOM positions because the layout
 * differs by viewport — mobile stacks it under the name within the
 * same flex cell, desktop puts it in a dedicated grid cell. The
 * mobile branch is marked `aria-hidden="true"` (critique pass 7
 * [MED] #25 drain) so screen readers see the desktop-column branch
 * as the canonical a11y source and don't double-announce the note.
 * Mobile screen readers fall back to the row name link as the
 * essential affordance — concise enough for the form factor.
 */
export function TrackerRow({
  rank,
  row,
  article,
}: TrackerRowProps): ReactElement {
  const delta = formatDelta(row.score, row.direction)
  const noteHref =
    article && row.articleSlug ? `/article/${row.articleSlug}` : null
  const editorialNote = row.note ?? null
  const noteText = editorialNote ?? article?.frontmatter.title ?? null

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
        {noteText && (
          <span
            aria-hidden="true"
            data-testid="tracker-row-note-text-mobile"
            className="text-small text-text-2 md:hidden"
          >
            {noteText}
          </span>
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
        {noteText ? (
          <span data-testid="tracker-row-note-text" className="text-text-2">
            {noteText}
          </span>
        ) : (
          <span aria-hidden="true" className="text-text-4">
            —
          </span>
        )}
      </span>
    </div>
  )
}
