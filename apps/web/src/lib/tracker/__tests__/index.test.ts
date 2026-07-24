import { describe, expect, it } from 'vitest'
import type { TrendRow, TrendSnapshot } from '@thock/data'
import {
  describeTrackerWeek,
  formatDelta,
  groupByCategory,
  isoWeeksInYear,
  pickSummarySlots,
  presentCategories,
  weekKicker,
} from '../index'

function makeRow(name: string, overrides: Partial<TrendRow> = {}): TrendRow {
  return {
    name,
    category: 'switch',
    direction: 'up',
    score: 10,
    spark: [5, 10],
    articleSlug: null,
    ...overrides,
  }
}

function makeSnapshot(
  rows: TrendRow[],
  overrides: Partial<TrendSnapshot> = {},
): TrendSnapshot {
  return {
    isoWeek: '2026-W21',
    publishedAt: '2026-05-18T00:00:00.000Z',
    rows,
    updatedAt: '2026-05-18T00:00:00.000Z',
    ...overrides,
  }
}

describe('pickSummarySlots', () => {
  it('returns [] for an empty rows array', () => {
    expect(pickSummarySlots([])).toEqual([])
  })

  it('returns all 4 slots for a typical snapshot with up/down/flat rows', () => {
    const rows: TrendRow[] = [
      makeRow('A', { direction: 'up', score: 55, spark: [10, 20, 35, 55] }),
      makeRow('B', { category: 'keycap', direction: 'up', score: 44, spark: [5, 8, 10, 15] }),
      makeRow('C', { category: 'layout', direction: 'down', score: -28, spark: [40, 30, 20, -28] }),
      makeRow('D', { category: 'keycap', direction: 'flat', score: 10, spark: [10, 10] }),
      makeRow('E', { category: 'vendor', direction: 'up', score: 20, spark: [5, 12, 18, 25] }),
    ]
    const slots = pickSummarySlots(rows)
    expect(slots.map((s) => s.kind)).toEqual(['riser', 'faller', 'breakout', 'sleeper'])
  })

  it('never reuses the same row across slots', () => {
    const rows: TrendRow[] = [
      makeRow('A', { direction: 'up', score: 55, spark: [10, 55] }),
      makeRow('B', { category: 'keycap', direction: 'up', score: 44, spark: [5, 15] }),
      makeRow('C', { category: 'layout', direction: 'down', score: -28, spark: [40, -28] }),
      makeRow('D', { category: 'keycap', direction: 'flat', score: 10, spark: [10, 10] }),
      makeRow('E', { category: 'vendor', direction: 'up', score: 20, spark: [5, 25] }),
    ]
    const slots = pickSummarySlots(rows)
    const names = slots.map((s) => s.row.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('breakout picks the steepest spark slope among remaining up rows, not the highest score', () => {
    // A: score=80 but gentle slope. B: score=30 but steep slope.
    // Riser=A (max up score). Breakout should pick B (steeper slope).
    const rows: TrendRow[] = [
      makeRow('A', { direction: 'up', score: 80, spark: [70, 75, 78, 80] }), // slope 10
      makeRow('B', { category: 'keycap', direction: 'up', score: 30, spark: [5, 12, 20, 30] }), // slope 25
      makeRow('C', { category: 'layout', direction: 'down', score: -20, spark: [20, -20] }),
      makeRow('D', { direction: 'flat', score: 5, spark: [5, 5] }),
    ]
    const slots = pickSummarySlots(rows)
    const breakout = slots.find((s) => s.kind === 'breakout')
    expect(breakout?.row.name).toBe('B')
  })

  it('faller falls back to min-score row overall when no down-direction rows exist', () => {
    const rows: TrendRow[] = [
      makeRow('A', { direction: 'up', score: 50, spark: [10, 50] }),
      makeRow('B', { category: 'keycap', direction: 'up', score: 30, spark: [5, 30] }),
      makeRow('C', { direction: 'flat', score: 2, spark: [2, 2] }),
    ]
    const slots = pickSummarySlots(rows)
    // Riser=A. Remaining=[B,C]. No down rows → pool=[B,C]. Min score=C(2).
    const faller = slots.find((s) => s.kind === 'faller')
    expect(faller?.row.name).toBe('C')
  })

  it('drops the sleeper slot when no non-flat rows remain after riser/faller/breakout', () => {
    const rows: TrendRow[] = [
      makeRow('A', { direction: 'up', score: 80, spark: [5, 80] }),
      makeRow('B', { category: 'layout', direction: 'down', score: -20, spark: [20, -20] }),
      makeRow('C', { category: 'keycap', direction: 'up', score: 40, spark: [5, 40] }),
      makeRow('D', { direction: 'flat', score: 10, spark: [10, 10] }),
    ]
    // Riser=A, Faller=B, Breakout=C. Remaining=[D], all flat → sleeper dropped.
    const slots = pickSummarySlots(rows)
    expect(slots.find((s) => s.kind === 'sleeper')).toBeUndefined()
    expect(slots).toHaveLength(3)
  })
})

describe('groupByCategory', () => {
  it('initialises all 5 category buckets even when rows is empty', () => {
    const result = groupByCategory([])
    expect(result.get('switch')).toEqual([])
    expect(result.get('keycap')).toEqual([])
    expect(result.get('layout')).toEqual([])
    expect(result.get('vendor')).toEqual([])
    expect(result.get('brand')).toEqual([])
  })

  it('sorts rows within a category by score descending', () => {
    const rows = [
      makeRow('Low', { score: 10 }),
      makeRow('High', { score: 80 }),
      makeRow('Mid', { score: 40 }),
    ]
    const names = groupByCategory(rows).get('switch')!.map((r) => r.name)
    expect(names).toEqual(['High', 'Mid', 'Low'])
  })

  it('breaks score ties by name ascending', () => {
    const rows = [
      makeRow('Zebra', { score: 50 }),
      makeRow('Apple', { score: 50 }),
      makeRow('Mango', { score: 50 }),
    ]
    const names = groupByCategory(rows).get('switch')!.map((r) => r.name)
    expect(names).toEqual(['Apple', 'Mango', 'Zebra'])
  })

  it('routes rows to the correct category bucket', () => {
    const rows = [
      makeRow('S', { category: 'switch' }),
      makeRow('K', { category: 'keycap' }),
      makeRow('V', { category: 'vendor' }),
    ]
    const result = groupByCategory(rows)
    expect(result.get('switch')!.map((r) => r.name)).toEqual(['S'])
    expect(result.get('keycap')!.map((r) => r.name)).toEqual(['K'])
    expect(result.get('vendor')!.map((r) => r.name)).toEqual(['V'])
    expect(result.get('layout')).toEqual([])
    expect(result.get('brand')).toEqual([])
  })
})

describe('weekKicker', () => {
  it('parses a valid ISO week string into display fields', () => {
    expect(weekKicker('2026-W21')).toEqual({
      year: 2026,
      week: 21,
      label: 'Week 21 / 2026',
    })
  })

  it('returns null for an empty string', () => {
    expect(weekKicker('')).toBeNull()
  })

  it('returns null for a week number without the required two-digit padding', () => {
    expect(weekKicker('2026-W1')).toBeNull()
  })

  it('parses W01 (week 1) correctly', () => {
    const result = weekKicker('2025-W01')
    expect(result).toEqual({ year: 2025, week: 1, label: 'Week 1 / 2025' })
  })
})

describe('isoWeeksInYear', () => {
  it('returns 53 for known 53-ISO-week years', () => {
    expect(isoWeeksInYear(2026)).toBe(53)
    expect(isoWeeksInYear(2020)).toBe(53)
  })

  it('returns 52 for an ordinary year', () => {
    expect(isoWeeksInYear(2025)).toBe(52)
    expect(isoWeeksInYear(2027)).toBe(52)
  })
})

describe('formatDelta', () => {
  it('returns em-dash for null score', () => {
    expect(formatDelta(null, 'up')).toBe('—')
  })

  it('returns "flat" for direction=flat regardless of score value', () => {
    expect(formatDelta(35, 'flat')).toBe('flat')
  })

  it('returns "flat" for score === 0 regardless of direction', () => {
    expect(formatDelta(0, 'up')).toBe('flat')
  })

  it('prefixes + for positive up scores', () => {
    expect(formatDelta(35, 'up')).toBe('+35%')
  })

  it('omits the + sign for negative down scores', () => {
    expect(formatDelta(-23, 'down')).toBe('-23%')
  })

  it('rounds fractional scores to the nearest integer', () => {
    expect(formatDelta(34.6, 'up')).toBe('+35%')
  })

  it('signs from direction, not score, when a down row carries a positive score', () => {
    expect(formatDelta(28, 'down')).toBe('-28%')
  })

  it('signs from direction, not score, when an up row carries a negative score', () => {
    expect(formatDelta(-24, 'up')).toBe('+24%')
  })
})

describe('describeTrackerWeek', () => {
  it('includes the week label, row count, category count, and top riser', () => {
    const snapshot = makeSnapshot([
      makeRow('Gazzew Boba U4T', { direction: 'up', score: 42, spark: [10, 42] }),
      makeRow('Cherry MX2A', { category: 'keycap', direction: 'down', score: -12, spark: [5, -12] }),
    ])
    const result = describeTrackerWeek(snapshot, { week: 21, year: 2026, label: 'Week 21 / 2026' })
    expect(result).toBe(
      'Week 21, 2026: 2 tracked movers across 2 categories. Top mover: Gazzew Boba U4T (+42%).',
    )
  })

  it('falls back to the raw isoWeek string when wk is null', () => {
    const snapshot = makeSnapshot([
      makeRow('A', { direction: 'up', score: 10, spark: [5, 10] }),
    ])
    const result = describeTrackerWeek(snapshot, null)
    expect(result.startsWith('2026-W21: 1 tracked mover across 1 category.')).toBe(true)
  })

  it('uses singular "category" for exactly one category', () => {
    const snapshot = makeSnapshot([
      makeRow('A', { direction: 'up', score: 10, spark: [5, 10] }),
      makeRow('B', { direction: 'down', score: -10, spark: [5, -10] }),
    ])
    const result = describeTrackerWeek(snapshot, null)
    expect(result).toContain('across 1 category.')
  })

  it('returns a no-movers description when rows is empty', () => {
    const snapshot = makeSnapshot([])
    const result = describeTrackerWeek(snapshot, { week: 21, year: 2026, label: 'Week 21 / 2026' })
    expect(result).toBe(
      'Week 21, 2026: no tracked movers this week. A weighted weekly score across community chatter, retail availability, and editorial mentions.',
    )
  })
})

describe('presentCategories', () => {
  it('returns only categories that have at least one row', () => {
    const snapshot = makeSnapshot([
      makeRow('S', { category: 'switch' }),
      makeRow('K', { category: 'keycap' }),
    ])
    expect(presentCategories(snapshot)).toEqual(['switch', 'keycap'])
  })

  it('returns categories in canonical order regardless of row insertion order', () => {
    const snapshot = makeSnapshot([
      makeRow('B', { category: 'brand' }),
      makeRow('V', { category: 'vendor' }),
      makeRow('K', { category: 'keycap' }),
    ])
    expect(presentCategories(snapshot)).toEqual(['keycap', 'vendor', 'brand'])
  })

  it('returns a single-element array when all rows share one category', () => {
    const snapshot = makeSnapshot([
      makeRow('X', { category: 'switch' }),
      makeRow('Y', { category: 'switch' }),
    ])
    expect(presentCategories(snapshot)).toEqual(['switch'])
  })
})
