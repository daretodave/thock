import Link from 'next/link'
import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { weekKicker } from '@/lib/tracker'

export type TrackerArchiveStripProps = {
  snapshots: TrendSnapshot[]
  /** isoWeek of the page currently being viewed (highlighted as current). */
  currentWeek: string
}

function directionCounts(snapshot: TrendSnapshot): {
  up: number
  flat: number
  down: number
} {
  let up = 0,
    flat = 0,
    down = 0
  for (const row of snapshot.rows) {
    if (row.direction === 'up') up++
    else if (row.direction === 'flat') flat++
    else down++
  }
  return { up, flat, down }
}

/**
 * Horizontal strip of recent tracker weeks shown at the bottom of the
 * latest tracker page. Renders nothing when only one snapshot exists
 * (no history to show). Caps at the 8 most recent weeks, newest first.
 */
export function TrackerArchiveStrip({
  snapshots,
  currentWeek,
}: TrackerArchiveStripProps): ReactElement | null {
  if (snapshots.length <= 1) return null

  const recent = [...snapshots].reverse().slice(0, 8)

  return (
    <section
      data-testid="tracker-archive-strip"
      aria-label="Weekly archive"
    >
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="font-mono uppercase tracking-[0.12em] text-small text-text-2">
          Weekly archive
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 lg:grid-cols-8">
        {recent.map((snapshot) => {
          const wk = weekKicker(snapshot.isoWeek)
          const label = wk ? `W${String(wk.week).padStart(2, '0')} / ${wk.year}` : snapshot.isoWeek
          const counts = directionCounts(snapshot)
          const isCurrent = snapshot.isoWeek === currentWeek

          const inner = (
            <div className="flex flex-col gap-2 p-3 bg-surface group-hover:bg-surface-hi transition-colors h-full">
              <span
                className={`font-mono text-micro uppercase tracking-[0.1em] ${
                  isCurrent ? 'text-accent' : 'text-text-2'
                }`}
              >
                {label}
              </span>
              {isCurrent && (
                <span data-testid="tracker-archive-latest-label" className="font-mono text-micro text-text-2">latest</span>
              )}
              <div className="mt-auto flex gap-2 font-mono text-micro">
                {counts.up > 0 && (
                  <span data-testid="tracker-archive-up-count" className="text-up">+{counts.up}</span>
                )}
                {counts.flat > 0 && (
                  <span data-testid="tracker-archive-flat-count" className="text-text-2">{counts.flat}~</span>
                )}
                {counts.down > 0 && (
                  <span data-testid="tracker-archive-down-count" className="text-down">-{counts.down}</span>
                )}
              </div>
            </div>
          )

          return isCurrent ? (
            <div
              key={snapshot.isoWeek}
              data-testid="tracker-archive-current"
              aria-current="page"
              className="h-full"
            >
              {inner}
            </div>
          ) : (
            <Link
              key={snapshot.isoWeek}
              href={`/trends/tracker/${snapshot.isoWeek}`}
              data-testid="tracker-archive-link"
              className="block h-full group"
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
