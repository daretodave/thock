import Link from 'next/link'
import type { ReactElement } from 'react'
import type { GroupBuy, Vendor } from '@thock/data'
import { GroupBuyCountdownRow } from './GroupBuyCountdownRow'

export type GroupBuysWidgetProps = {
  /** Active group buys, already filtered by `getActiveGroupBuys()`. */
  groupBuys: GroupBuy[]
  vendors: Vendor[]
  /** Reference date — primarily for testability. */
  now?: Date
  /** Cap at 4 by default — matches the design composition. */
  max?: number
}

/**
 * Home page right-rail group-buys widget. Header + ≤4 countdown
 * rows + a trailing "All active group buys →" link to /group-buys.
 *
 * Hidden entirely when the active list is empty so the long-reads
 * column stretches to fill the row (handled by the page layout).
 */
export function GroupBuysWidget({
  groupBuys,
  vendors,
  now = new Date(),
  max = 4,
}: GroupBuysWidgetProps): ReactElement | null {
  if (groupBuys.length === 0) return null

  const todayIso = now.toISOString().slice(0, 10)
  const sorted = [...groupBuys]
    .sort((a, b) => {
      const aLeft = Date.parse(`${a.endDate}T00:00:00Z`)
      const bLeft = Date.parse(`${b.endDate}T00:00:00Z`)
      if (aLeft !== bLeft) return aLeft - bLeft
      return a.name.localeCompare(b.name)
    })
    .slice(0, max)

  const vendorBySlug = new Map(vendors.map((v) => [v.slug, v]))

  return (
    <aside
      data-testid="group-buys-widget"
      className="flex flex-col gap-3 border border-border bg-surface p-6"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-up shadow-[0_0_0_3px_rgba(120,180,120,0.18)]"
        />
        <span className="font-mono uppercase tracking-[0.1em] text-micro text-text-3">
          group buys · ending soon
        </span>
      </div>
      <h3 className="font-serif text-h3 text-text">Don&apos;t miss the close</h3>
      <div className="flex flex-col">
        {sorted.map((gb) => (
          <GroupBuyCountdownRow
            key={gb.slug}
            groupBuy={gb}
            vendor={vendorBySlug.get(gb.vendorSlug) ?? null}
            now={now}
          />
        ))}
      </div>
      <Link
        href="/group-buys"
        className="mt-2 font-mono uppercase tracking-[0.08em] text-micro text-accent hover:text-accent-hi"
      >
        all active group buys →
      </Link>
    </aside>
  )
}

/**
 * Sort + cap helper — exported for unit tests so we can assert
 * stable order without rendering the full widget.
 */
export function sortGroupBuysForWidget(
  groupBuys: GroupBuy[],
  max = 4,
): GroupBuy[] {
  return [...groupBuys]
    .sort((a, b) => {
      if (a.endDate !== b.endDate) return a.endDate.localeCompare(b.endDate)
      return a.name.localeCompare(b.name)
    })
    .slice(0, max)
}
