import Image from 'next/image'
import type { ReactElement } from 'react'
import type { GroupBuy, Vendor } from '@thock/data'

export type GroupBuyCountdownRowProps = {
  groupBuy: GroupBuy
  vendor: Vendor | null
  /** Reference date — primarily for testability. */
  now?: Date
}

const ACCENT_THRESHOLD_DAYS = 3

/** Days between two YYYY-MM-DD strings, rounded up. Negative → 0. */
function daysBetween(fromDate: string, toDate: string): number {
  const from = Date.parse(`${fromDate}T00:00:00.000Z`)
  const to = Date.parse(`${toDate}T00:00:00.000Z`)
  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0
  const ms = to - from
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

/**
 * Compute the progress fraction for a group buy — `1 - daysLeft/totalDays`,
 * clamped to `[0, 1]`. Returns 0 when totalDays is missing or zero so
 * the sliver renders empty rather than negative.
 */
export function progressFraction(input: {
  startDate: string
  endDate: string
  todayIso: string
}): number {
  const total = daysBetween(input.startDate, input.endDate)
  if (total <= 0) return 0
  const left = daysBetween(input.todayIso, input.endDate)
  const fraction = 1 - left / total
  if (Number.isNaN(fraction)) return 0
  return Math.min(1, Math.max(0, fraction))
}

export function daysLeft(endDate: string, todayIso: string): number {
  return daysBetween(todayIso, endDate)
}

/**
 * One row in the home page group-buys widget. Title + vendor + day
 * count + a thin progress sliver. Accent color triggers in the last
 * 72 hours per `decisions.jsx`.
 */
export function GroupBuyCountdownRow({
  groupBuy,
  vendor,
  now = new Date(),
}: GroupBuyCountdownRowProps): ReactElement {
  const todayIso = now.toISOString().slice(0, 10)
  const left = daysLeft(groupBuy.endDate, todayIso)
  const fraction = progressFraction({
    startDate: groupBuy.startDate,
    endDate: groupBuy.endDate,
    todayIso,
  })
  const isUrgent = left <= ACCENT_THRESHOLD_DAYS

  return (
    <div
      data-testid="group-buy-row"
      data-urgent={isUrgent ? 'true' : 'false'}
      className="grid grid-cols-[1fr_auto] items-baseline gap-1.5 border-t border-border py-3 first:border-t-0 first:pt-0 sm:grid-cols-[40px_1fr_auto] sm:gap-x-3"
    >
      {groupBuy.heroImage ? (
        <div
          data-testid="group-buy-row-hero"
          className="relative hidden aspect-[4/3] overflow-hidden border border-border self-center sm:block"
        >
          <Image
            src={groupBuy.heroImage}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          data-testid="group-buy-row-hero-placeholder"
          className="hidden aspect-[4/3] border border-border bg-accent-mu/20 self-center sm:block"
        />
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-small font-medium text-text">
          {groupBuy.name}
        </span>
        <span className="text-micro text-text-2">
          via{' '}
          <span className="font-mono text-accent">
            {vendor?.name ?? groupBuy.vendorSlug}
          </span>
        </span>
      </div>
      <span
        data-testid="group-buy-countdown"
        className={`font-mono text-micro ${
          isUrgent ? 'text-accent' : 'text-text-2'
        }`}
      >
        {left === 0 ? 'today' : `${left}d`}
      </span>
      <div
        aria-hidden="true"
        className="col-span-2 mt-1 h-0.5 rounded-sm bg-border sm:col-span-3"
      >
        <div
          className={`h-full rounded-sm ${
            isUrgent ? 'bg-accent' : 'bg-text-2'
          }`}
          style={{ width: `${(fraction * 100).toFixed(2)}%` }}
        />
      </div>
    </div>
  )
}
