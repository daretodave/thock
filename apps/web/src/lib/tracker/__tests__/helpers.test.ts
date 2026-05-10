import { describe, expect, it } from 'vitest'
import type { TrendRow } from '@thock/data'
import {
  CATEGORY_ORDER,
  formatDelta,
  groupByCategory,
  pickSummarySlots,
  presentCategories,
  weekKicker,
} from '..'

function row(over: Partial<TrendRow> = {}): TrendRow {
  return {
    name: 'Generic',
    category: 'switch',
    direction: 'up',
    score: 10,
    spark: [1, 2, 3, 4],
    articleSlug: null,
    ...over,
  }
}

describe('weekKicker', () => {
  it('parses standard ISO week strings', () => {
    expect(weekKicker('2026-W19')).toEqual({
      year: 2026,
      week: 19,
      label: 'Week 19 / 2026',
    })
  })

  it('returns null for malformed input', () => {
    expect(weekKicker('2026-19')).toBeNull()
    expect(weekKicker('week-19')).toBeNull()
    expect(weekKicker('')).toBeNull()
  })
})

describe('formatDelta', () => {
  it('formats positive scores with explicit + sign', () => {
    expect(formatDelta(34, 'up')).toBe('+34%')
  })

  it('formats negative scores with sign', () => {
    expect(formatDelta(-9, 'down')).toBe('-9%')
  })

  it('renders "flat" for zero or flat direction', () => {
    expect(formatDelta(0, 'up')).toBe('flat')
    expect(formatDelta(5, 'flat')).toBe('flat')
  })

  it('renders an em-dash for null scores', () => {
    expect(formatDelta(null, 'up')).toBe('—')
  })
})

describe('groupByCategory', () => {
  it('groups in canonical order with score-desc within each group', () => {
    const rows = [
      row({ name: 'B', category: 'keycap', score: 10 }),
      row({ name: 'A', category: 'switch', score: 30 }),
      row({ name: 'C', category: 'switch', score: 20 }),
    ]
    const grouped = groupByCategory(rows)
    expect(Array.from(grouped.keys())).toEqual(CATEGORY_ORDER)
    expect(grouped.get('switch')!.map((r) => r.name)).toEqual(['A', 'C'])
    expect(grouped.get('keycap')!.map((r) => r.name)).toEqual(['B'])
    expect(grouped.get('vendor')).toEqual([])
  })

  it('breaks score ties by name asc', () => {
    const rows = [
      row({ name: 'Zeta', score: 5 }),
      row({ name: 'Alpha', score: 5 }),
    ]
    expect(
      groupByCategory(rows)
        .get('switch')!
        .map((r) => r.name),
    ).toEqual(['Alpha', 'Zeta'])
  })
})

describe('presentCategories', () => {
  it('returns only categories with at least one row, in canonical order', () => {
    const snap = {
      isoWeek: '2026-W19',
      publishedAt: '2026-05-08T00:00:00.000Z',
      rows: [
        row({ category: 'vendor' }),
        row({ category: 'switch' }),
      ],
      updatedAt: '2026-05-08T00:00:00.000Z',
    }
    expect(presentCategories(snap)).toEqual(['switch', 'vendor'])
  })
})

describe('pickSummarySlots', () => {
  it('returns empty when no rows', () => {
    expect(pickSummarySlots([])).toEqual([])
  })

  it('selects riser, faller, breakout, sleeper without duplication', () => {
    const rows: TrendRow[] = [
      row({ name: 'Up-A', direction: 'up', score: 30, spark: [1, 5, 10] }),
      row({ name: 'Up-B', direction: 'up', score: 12, spark: [1, 2, 18] }), // steepest
      row({ name: 'Down-A', direction: 'down', score: -22, spark: [10, 5, 1] }),
      row({ name: 'Up-C', direction: 'up', score: 6, spark: [3, 4, 6] }), // smallest-abs non-flat → sleeper
    ]
    const slots = pickSummarySlots(rows)
    expect(slots.map((s) => s.kind)).toEqual([
      'riser',
      'faller',
      'breakout',
      'sleeper',
    ])
    expect(slots.map((s) => s.row.name)).toEqual([
      'Up-A',
      'Down-A',
      'Up-B',
      'Up-C',
    ])
  })

  it('skips slots that cannot be filled without duplication', () => {
    const rows: TrendRow[] = [
      row({ name: 'Only-Up', direction: 'up', score: 30 }),
    ]
    const slots = pickSummarySlots(rows)
    expect(slots.map((s) => s.kind)).toEqual(['riser'])
  })

  it('falls back to the largest-score row when no up rows exist', () => {
    const rows: TrendRow[] = [
      row({ name: 'A', direction: 'flat', score: 5, spark: [5, 5] }),
      row({ name: 'B', direction: 'flat', score: 12, spark: [12, 12] }),
    ]
    const slots = pickSummarySlots(rows)
    expect(slots[0]?.kind).toBe('riser')
    expect(slots[0]?.row.name).toBe('B')
  })

  it('drops the sleeper slot when only flat rows remain (critique pass 9 #8)', () => {
    // Pre-fix, the Sleeper slot fell back to the highest-abs flat
    // row when no flats-or-anything remained — producing a
    // mismatched-header card (e.g. /trends/tracker W19 surfaced
    // Wuque Studio at flat with editor's note "no new headline
    // release this 8-week window"). The fix requires non-flat for
    // Sleeper and drops the slot rather than pretending.
    const rows: TrendRow[] = [
      row({ name: 'Up-A', direction: 'up', score: 30, spark: [1, 5, 10] }),
      row({ name: 'Up-B', direction: 'up', score: 12, spark: [1, 2, 18] }),
      row({ name: 'Down-A', direction: 'down', score: -22, spark: [10, 5, 1] }),
      row({ name: 'Flat-A', direction: 'flat', score: 4, spark: [4, 4, 4] }),
      row({ name: 'Flat-B', direction: 'flat', score: 8, spark: [8, 8, 8] }),
    ]
    const slots = pickSummarySlots(rows)
    expect(slots.map((s) => s.kind)).toEqual(['riser', 'faller', 'breakout'])
    // Confirm the dropped slot is sleeper specifically.
    expect(slots.find((s) => s.kind === 'sleeper')).toBeUndefined()
  })

  it('picks the smallest-abs non-flat row for sleeper (under-the-radar mover)', () => {
    const rows: TrendRow[] = [
      row({ name: 'Up-Big', direction: 'up', score: 40, spark: [1, 10, 30] }),
      row({ name: 'Up-Steep', direction: 'up', score: 15, spark: [1, 2, 25] }),
      row({ name: 'Down-Big', direction: 'down', score: -30, spark: [30, 10, 1] }),
      row({ name: 'Up-Small', direction: 'up', score: 5, spark: [3, 4, 5] }),
      row({ name: 'Down-Small', direction: 'down', score: -3, spark: [5, 4, 3] }),
    ]
    const slots = pickSummarySlots(rows)
    const sleeper = slots.find((s) => s.kind === 'sleeper')
    // After riser/faller/breakout consume Up-Big, Down-Big, Up-Steep,
    // remaining non-flat rows are Up-Small (abs=5) and Down-Small (abs=3).
    // Smallest abs wins → Down-Small.
    expect(sleeper?.row.name).toBe('Down-Small')
  })
})
