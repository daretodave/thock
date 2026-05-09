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
