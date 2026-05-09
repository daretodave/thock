import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { pickSummarySlots } from '@/lib/tracker'
import { TrackerSummaryCard } from './TrackerSummaryCard'

export type TrackerSummaryGridProps = {
  snapshot: TrendSnapshot
}

/**
 * 4-up grid of `<TrackerSummaryCard>`s drawn from the snapshot's
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
      className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
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
