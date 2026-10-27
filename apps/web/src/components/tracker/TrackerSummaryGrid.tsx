import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { pickSummarySlots } from '@/lib/tracker'
import { TrackerSummaryCard } from './TrackerSummaryCard'

export type TrackerSummaryGridProps = {
  snapshot: TrendSnapshot
}

/** Column classes keyed by slot count — `pickSummarySlots` returns 1-4,
 * never a fixed 4, so the grid track count must track it or an unfilled
 * track renders as a blank `bg-border` cell (critique pass 12 #1052). */
const COLS_BY_SLOT_COUNT: Record<number, string> = {
  1: 'sm:grid-cols-1 lg:grid-cols-1',
  2: 'sm:grid-cols-2 lg:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Up-to-4-up grid of `<TrackerSummaryCard>`s drawn from the snapshot's
 * top movers. Hides itself when no slots can be filled.
 */
export function TrackerSummaryGrid({
  snapshot,
}: TrackerSummaryGridProps): ReactElement | null {
  const slots = pickSummarySlots(snapshot.rows)
  if (slots.length === 0) return null

  return (
    <div
      data-testid="tracker-summary-grid"
      className={`grid grid-cols-1 gap-px border border-border bg-border ${COLS_BY_SLOT_COUNT[slots.length] ?? COLS_BY_SLOT_COUNT[4]}`}
    >
      {slots.map((slot) => (
        <TrackerSummaryCard
          key={slot.kind}
          kind={slot.kind}
          kicker={slot.kicker}
          row={slot.row}
        />
      ))}
    </div>
  )
}
