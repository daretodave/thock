import type { GroupBuy } from '@thock/data'

export type GroupBuyPartition = {
  live: GroupBuy[]
  announced: GroupBuy[]
  ended: GroupBuy[]
}

export type LiveUrgencyPartition = {
  closingSoon: GroupBuy[]
  liveOpen: GroupBuy[]
}

const ENDED_CAP = 6
const URGENT_THRESHOLD_DAYS = 3

function todayIso(now: Date): string {
  return now.toISOString().slice(0, 10)
}

function isLive(gb: GroupBuy, today: string): boolean {
  return gb.status === 'live' && gb.endDate >= today
}

function isAnnounced(gb: GroupBuy): boolean {
  return gb.status === 'announced'
}

function isEnded(gb: GroupBuy, today: string): boolean {
  if (gb.status === 'closed' || gb.status === 'shipped') return true
  if (gb.status === 'live' && gb.endDate < today) return true
  return false
}

/**
 * Partition every group buy into live / announced / ended buckets and
 * sort each per the phase 13 brief:
 *   - live      — endDate asc, name asc tie-break.
 *   - announced — startDate asc, name asc tie-break.
 *   - ended     — endDate desc, name asc tie-break, capped at 6.
 *
 * `now` is injected for testability. Pure helper extracted out of
 * `page.tsx` to satisfy Next.js's route-typing rule.
 */
export function partitionGroupBuys(
  groupBuys: GroupBuy[],
  now: Date = new Date(),
): GroupBuyPartition {
  const today = todayIso(now)
  const live: GroupBuy[] = []
  const announced: GroupBuy[] = []
  const ended: GroupBuy[] = []

  for (const gb of groupBuys) {
    if (isLive(gb, today)) live.push(gb)
    else if (isAnnounced(gb)) announced.push(gb)
    else if (isEnded(gb, today)) ended.push(gb)
  }

  live.sort((a, b) => {
    if (a.endDate !== b.endDate) return a.endDate.localeCompare(b.endDate)
    return a.name.localeCompare(b.name)
  })
  announced.sort((a, b) => {
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate)
    }
    return a.name.localeCompare(b.name)
  })
  ended.sort((a, b) => {
    if (a.endDate !== b.endDate) return b.endDate.localeCompare(a.endDate)
    return a.name.localeCompare(b.name)
  })

  return { live, announced, ended: ended.slice(0, ENDED_CAP) }
}

/**
 * Split the `live` array into a "closing soon" bucket (endDate within
 * URGENT_THRESHOLD_DAYS = 3 of `now`) and the rest. Bearings rule
 * "brass urgency reserved for the last 72 hours" — used by the
 * /group-buys page to split the previously-monolithic Live section
 * into a conditional "Closing soon" sub-section + a neutral
 * "Open now" main section. Critique pass 2 [MED] drain.
 */
export function splitLiveByUrgency(
  live: GroupBuy[],
  now: Date = new Date(),
): LiveUrgencyPartition {
  const today = todayIso(now)
  const closingSoon: GroupBuy[] = []
  const liveOpen: GroupBuy[] = []

  for (const gb of live) {
    const ms = Date.parse(`${gb.endDate}T00:00:00.000Z`) - Date.parse(`${today}T00:00:00.000Z`)
    const daysLeft = Math.max(0, Math.ceil(ms / 86_400_000))
    if (daysLeft <= URGENT_THRESHOLD_DAYS) closingSoon.push(gb)
    else liveOpen.push(gb)
  }

  return { closingSoon, liveOpen }
}
