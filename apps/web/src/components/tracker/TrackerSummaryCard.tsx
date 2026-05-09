import type { ReactElement } from 'react'
import type { TrendRow } from '@thock/data'
import { Sparkline, TrendDirectionGlyph } from '@thock/ui'
import { formatDelta, type SummarySlotKind } from '@/lib/tracker'

export type TrackerSummaryCardProps = {
  kind: SummarySlotKind
  kicker: string
  row: TrendRow
}

const TONE_CLASS: Record<TrendRow['direction'], string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-flat',
}

/**
 * One named slot in the tracker summary grid (riser / faller /
 * breakout / sleeper). Pure presentational; the parent grid is
 * responsible for slot selection.
 */
export function TrackerSummaryCard({
  kind,
  kicker,
  row,
}: TrackerSummaryCardProps): ReactElement {
  const delta = formatDelta(row.score, row.direction)

  return (
    <div
      data-testid="tracker-summary-card"
      data-kind={kind}
      className="flex flex-col gap-3 bg-bg-2 p-6"
    >
      <span className="font-mono uppercase tracking-[0.1em] text-micro text-accent">
        {kicker}
      </span>
      <h3 className="font-serif text-h3 text-text">{row.name}</h3>
      <div className="flex items-center gap-3">
        <span className={TONE_CLASS[row.direction]}>
          <TrendDirectionGlyph dir={row.direction} size={14} />
        </span>
        <span
          className={`font-mono text-h3 font-medium ${TONE_CLASS[row.direction]}`}
        >
          {delta}
        </span>
        <span className={TONE_CLASS[row.direction]}>
          <Sparkline values={row.spark} tone={row.direction} w={70} h={22} />
        </span>
      </div>
    </div>
  )
}
