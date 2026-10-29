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
  // Sleeper is picked by magnitude (smallest abs score), not direction —
  // reusing the row's own up/down tone made it read as a second Riser or
  // Faller card (critique pass 13). Its glyph/color/spark stay neutral
  // regardless of which way the row actually moved this week.
  const tone = kind === 'sleeper' ? 'flat' : row.direction
  const dir = kind === 'sleeper' ? 'flat' : row.direction
  const glyphLabel = kind === 'sleeper' ? 'sleeper' : `${row.direction} trend`
  const sparkLabel =
    kind === 'sleeper' ? `${row.name}: sleeper` : `${row.name}: ${row.direction} trend`

  return (
    <div
      data-testid="tracker-summary-card"
      data-kind={kind}
      className="flex flex-col gap-3 bg-bg-2 p-6"
    >
      <span className="font-mono uppercase tracking-widest text-micro text-accent">
        {kicker}
      </span>
      <h3 className="font-serif text-h3 text-text">{row.name}</h3>
      <div className="flex items-center gap-3">
        <span className={TONE_CLASS[tone]}>
          <TrendDirectionGlyph dir={dir} size={14} ariaLabel={glyphLabel} />
        </span>
        <span className={`font-mono text-h3 font-medium ${TONE_CLASS[tone]}`}>
          {delta}
        </span>
        <span className={TONE_CLASS[tone]}>
          <Sparkline
            values={row.spark}
            tone={tone}
            w={70}
            h={22}
            ariaLabel={sparkLabel}
          />
        </span>
      </div>
    </div>
  )
}
