import type { GroupBuy } from '@thock/data'

export type VendorGroupBuyPartition = {
  active: GroupBuy[]
  past: GroupBuy[]
}

function isActive(gb: GroupBuy, today: string): boolean {
  if (gb.status === 'closed' || gb.status === 'shipped') return false
  return gb.endDate >= today
}

/**
 * Split a vendor's group buys into active / past buckets, each sorted
 * to match the sitewide convention used by `getActiveGroupBuys()` and
 * `/group-buys`' `partitionGroupBuys()`: active soonest-closing first,
 * past most-recently-ended first. `getGroupBuysByVendor()` returns a
 * single endDate-desc list that satisfies only the "past" ordering —
 * splitting it without re-sorting silently buries the soonest-closing
 * active buy last.
 */
export function partitionVendorGroupBuys(
  groupBuys: GroupBuy[],
  todayIso: string,
): VendorGroupBuyPartition {
  const active: GroupBuy[] = []
  const past: GroupBuy[] = []

  for (const gb of groupBuys) {
    if (isActive(gb, todayIso)) active.push(gb)
    else past.push(gb)
  }

  active.sort((a, b) => a.endDate.localeCompare(b.endDate))
  past.sort((a, b) => b.endDate.localeCompare(a.endDate))

  return { active, past }
}
