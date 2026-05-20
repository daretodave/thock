import { getAllTrendSnapshots } from '@/lib/data-runtime'

export function getAdjacentWeeks(week: string): {
  prev: string | null
  next: string | null
} {
  const all = getAllTrendSnapshots()
  const idx = all.findIndex((s) => s.isoWeek === week)
  return {
    prev: idx > 0 ? (all[idx - 1]?.isoWeek ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1]?.isoWeek ?? null) : null,
  }
}
