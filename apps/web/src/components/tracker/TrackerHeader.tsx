import type { ReactElement } from 'react'
import type { TrendSnapshot } from '@thock/data'
import { PillarHero } from '@/components/pillar/PillarHero'
import { weekKicker } from '@/lib/tracker'

export type TrackerHeaderProps = {
  snapshot: TrendSnapshot | null
  /** Lede paragraph; the publishedAt string is woven in by the page. */
  lede: string
}

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
})

/**
 * Tracker dashboard header. Wraps `<PillarHero>` with a SIGNATURE
 * eyebrow, italic display H1, lede paragraph (with weave-in
 * `publishedAt`), and a right-rail block showing the big week
 * number — `2026 · WEEK / 19 / of 52`.
 */
export function TrackerHeader({
  snapshot,
  lede,
}: TrackerHeaderProps): ReactElement {
  const week = snapshot ? weekKicker(snapshot.isoWeek) : null
  const updatedCopy = snapshot
    ? `Updated ${PUBLISHED_FORMATTER.format(new Date(snapshot.publishedAt))}.`
    : 'Snapshot not yet published.'

  const heading = (
    <>
      What&apos;s <em className="italic">actually</em> rising this week
    </>
  )

  const rightRail = week ? (
    <div
      data-testid="tracker-week-block"
      className="flex flex-col items-end gap-1"
    >
      <span className="font-mono uppercase tracking-[0.08em] text-micro text-text-3">
        {week.year} · week
      </span>
      <span className="font-serif text-display leading-none text-text">
        {String(week.week).padStart(2, '0')}
      </span>
      <span className="font-mono text-micro text-text-3">of 52</span>
    </div>
  ) : null

  return (
    <PillarHero
      pillar="trends"
      eyebrow="signature · trends tracker"
      heading={heading}
      lede={`${lede} ${updatedCopy}`}
      {...(rightRail ? { rightRail } : {})}
    />
  )
}
