import type { TrendRow, TrendSnapshot } from '@thock/data'

/**
 * Pure helpers driving the Trends Tracker dashboard. Kept off the
 * components so the slot-selection + grouping rules are unit-testable
 * in isolation.
 */

export type TrendCategory = TrendRow['category']

export const CATEGORY_ORDER: readonly TrendCategory[] = [
  'switch',
  'keycap',
  'layout',
  'vendor',
  'brand',
] as const

export const CATEGORY_LABEL: Record<TrendCategory, { single: string; plural: string }> = {
  switch: { single: 'Switch', plural: 'Switches' },
  keycap: { single: 'Keycap', plural: 'Keycaps' },
  layout: { single: 'Layout', plural: 'Layouts' },
  vendor: { single: 'Vendor', plural: 'Vendors' },
  brand: { single: 'Brand', plural: 'Brands' },
}

export type SummarySlotKind = 'riser' | 'faller' | 'breakout' | 'sleeper'

export type SummarySlot = {
  kind: SummarySlotKind
  kicker: string
  row: TrendRow
}

const KICKER: Record<SummarySlotKind, string> = {
  riser: 'biggest riser',
  faller: 'biggest faller',
  breakout: 'breakout',
  sleeper: 'sleeper',
}

function sparkSlope(row: TrendRow): number {
  const { spark } = row
  if (spark.length < 2) return 0
  return spark[spark.length - 1]! - spark[0]!
}

/**
 * Pick the four named summary slots from a snapshot's rows, never
 * duplicating a row across slots. Slots that can't be filled by the
 * rule are dropped — the caller hides empty cards instead of
 * rendering placeholders.
 *
 * Order of selection (each draws from the remaining unused rows):
 *  1. riser   = max-score row with direction='up' (else max-score row).
 *  2. faller  = min-score row with direction='down' (else min-score row).
 *  3. breakout = direction='up' row with the steepest spark slope.
 *  4. sleeper = smallest abs(score) non-flat row (under-the-radar mover);
 *               drops the slot if no non-flat row remains. Critique
 *               pass 9 #8: pinning Sleeper on a flat-direction row
 *               whose editor's note says nothing's moving reads as
 *               auto-populated rather than editorially chosen, so
 *               flat-only fallback is removed.
 */
export function pickSummarySlots(rows: readonly TrendRow[]): SummarySlot[] {
  if (rows.length === 0) return []
  const used = new Set<string>()
  const remaining = () => rows.filter((r) => !used.has(r.name))

  const out: SummarySlot[] = []

  const pickRiser = () => {
    const candidates = remaining()
    if (candidates.length === 0) return null
    const ups = candidates.filter((r) => r.direction === 'up')
    const pool = ups.length > 0 ? ups : candidates
    return pool.reduce((acc, r) => (r.score > acc.score ? r : acc), pool[0]!)
  }
  const pickFaller = () => {
    const candidates = remaining()
    if (candidates.length === 0) return null
    const downs = candidates.filter((r) => r.direction === 'down')
    const pool = downs.length > 0 ? downs : candidates
    return pool.reduce((acc, r) => (r.score < acc.score ? r : acc), pool[0]!)
  }
  const pickBreakout = () => {
    const candidates = remaining().filter((r) => r.direction === 'up')
    if (candidates.length === 0) return null
    return candidates.reduce(
      (acc, r) => (sparkSlope(r) > sparkSlope(acc) ? r : acc),
      candidates[0]!,
    )
  }
  const pickSleeper = () => {
    const candidates = remaining().filter((r) => r.direction !== 'flat')
    if (candidates.length === 0) return null
    return candidates.reduce(
      (acc, r) => (Math.abs(r.score) < Math.abs(acc.score) ? r : acc),
      candidates[0]!,
    )
  }

  const order: Array<{ kind: SummarySlotKind; pick: () => TrendRow | null }> = [
    { kind: 'riser', pick: pickRiser },
    { kind: 'faller', pick: pickFaller },
    { kind: 'breakout', pick: pickBreakout },
    { kind: 'sleeper', pick: pickSleeper },
  ]

  for (const { kind, pick } of order) {
    const row = pick()
    if (row && !used.has(row.name)) {
      used.add(row.name)
      out.push({ kind, kicker: KICKER[kind], row })
    }
  }

  return out
}

/**
 * Group snapshot rows by category in canonical order, sorting each
 * group by score desc with a stable tie-break on name asc.
 */
export function groupByCategory(
  rows: readonly TrendRow[],
): Map<TrendCategory, TrendRow[]> {
  const out = new Map<TrendCategory, TrendRow[]>()
  for (const cat of CATEGORY_ORDER) out.set(cat, [])
  for (const row of rows) {
    const list = out.get(row.category)
    if (list) list.push(row)
  }
  for (const [, list] of out) {
    list.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return a.name.localeCompare(b.name)
    })
  }
  return out
}

export type WeekKicker = {
  week: number
  year: number
  /** Display label, e.g. `Week 19 / 2026`. */
  label: string
}

/** Parse `'YYYY-Www'` → display fields. Returns `null` for bad input. */
export function weekKicker(isoWeek: string): WeekKicker | null {
  const m = /^(\d{4})-W(\d{2})$/.exec(isoWeek)
  if (!m) return null
  const year = Number(m[1])
  const week = Number(m[2])
  if (!Number.isFinite(year) || !Number.isFinite(week)) return null
  return { year, week, label: `Week ${week} / ${year}` }
}

/**
 * Format the score display string for a row or summary slot.
 * Mirrors the home trending tile's signature so phase 6 can adopt
 * this helper later without a behavior change.
 */
export function formatDelta(
  score: number | null,
  direction: TrendRow['direction'],
): string {
  if (score === null) return '—'
  if (direction === 'flat' || score === 0) return 'flat'
  const sign = score > 0 ? '+' : ''
  return `${sign}${Math.round(score)}%`
}

/** Categories present in a snapshot, in canonical order. */
export function presentCategories(snapshot: TrendSnapshot): TrendCategory[] {
  const grouped = groupByCategory(snapshot.rows)
  return CATEGORY_ORDER.filter((c) => (grouped.get(c)?.length ?? 0) > 0)
}
