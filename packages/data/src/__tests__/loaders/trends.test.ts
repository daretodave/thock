import { afterEach, describe, expect, it } from 'vitest'
import { getAllTrendSnapshots, getLatestTrendSnapshot } from '../../loaders/trends'
import { __resetForTests } from '../../loaders/memo'

describe('trends loader', () => {
  afterEach(() => __resetForTests())

  it('returns at least 2 snapshots', () => {
    expect(getAllTrendSnapshots().length).toBeGreaterThanOrEqual(2)
  })

  it('sorts snapshots by isoWeek ascending (archive strip uses .reverse())', () => {
    const weeks = getAllTrendSnapshots().map((s) => s.isoWeek)
    const sorted = [...weeks].sort()
    expect(weeks).toEqual(sorted)
  })

  it('getLatestTrendSnapshot returns the snapshot with the highest isoWeek', () => {
    const all = getAllTrendSnapshots()
    const latest = getLatestTrendSnapshot()
    expect(latest?.isoWeek).toBe(all[all.length - 1]?.isoWeek)
  })

  it('reversed slice gives newest-first order for TrackerArchiveStrip', () => {
    const all = getAllTrendSnapshots()
    if (all.length < 2) return
    const reversed = [...all].reverse()
    // First entry in reversed array should be >= last entry (descending)
    expect(reversed[0]!.isoWeek >= reversed[reversed.length - 1]!.isoWeek).toBe(true)
  })
})
