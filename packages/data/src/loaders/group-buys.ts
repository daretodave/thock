import { GroupBuySchema, type GroupBuy } from '../schemas/group-buy'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<GroupBuy[]>('group-buys', () => {
  return listEntityFiles('group-buys')
    .map((file) => GroupBuySchema.parse(readJson(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})

export function getAllGroupBuys(): GroupBuy[] {
  return loadAll()
}

export function getGroupBuyBySlug(slug: string): GroupBuy | null {
  return getAllGroupBuys().find((g) => g.slug === slug) ?? null
}

/**
 * "Active" group buys: not closed/shipped, with `endDate` today or later
 * (UTC). Sorted ascending by `endDate` so soonest-ending sits first.
 */
export function getActiveGroupBuys(now: Date = new Date()): GroupBuy[] {
  const today = now.toISOString().slice(0, 10)
  return getAllGroupBuys()
    .filter((g) => g.status !== 'closed' && g.status !== 'shipped')
    .filter((g) => g.endDate >= today)
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
}

/**
 * Single source of truth for "has this group buy ended?" — closed/shipped
 * by status, or a live/announced record whose `endDate` has passed. Every
 * call site that needs to route a group buy to a "past" surface (the
 * `/group-buys` ended bucket, `/group-buys/past`, the search index) must
 * derive from this predicate rather than re-deriving the status/date logic,
 * so a future status-rule change only needs to land in one place.
 */
export function isGroupBuyEnded(
  gb: Pick<GroupBuy, 'status' | 'endDate'>,
  todayIso: string,
): boolean {
  if (gb.status === 'closed' || gb.status === 'shipped') return true
  if ((gb.status === 'live' || gb.status === 'announced') && gb.endDate < todayIso) {
    return true
  }
  return false
}
