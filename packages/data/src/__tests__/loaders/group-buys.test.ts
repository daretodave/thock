import { afterEach, describe, expect, it } from 'vitest'
import {
  getActiveGroupBuys,
  getAllGroupBuys,
  getGroupBuyBySlug,
} from '../../loaders/group-buys'
import { __resetForTests } from '../../loaders/memo'

describe('group-buys loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed group buy', () => {
    expect(getAllGroupBuys().map((g) => g.slug)).toContain('cannonkeys-mode-sonnet-r2')
  })

  it('resolves a known slug', () => {
    const gb = getGroupBuyBySlug('cannonkeys-mode-sonnet-r2')
    expect(gb?.productSlug).toBe('mode-sonnet')
  })

  it('includes the seed in active list when end-date is in the future', () => {
    // Seed endDate is 2026-06-15. As of "now" relative to 2026-05-08, it's active.
    const active = getActiveGroupBuys(new Date('2026-05-10T00:00:00Z'))
    expect(active.map((g) => g.slug)).toContain('cannonkeys-mode-sonnet-r2')
  })

  it('excludes the seed from active list once end-date is past', () => {
    const active = getActiveGroupBuys(new Date('2026-07-01T00:00:00Z'))
    expect(active.map((g) => g.slug)).not.toContain('cannonkeys-mode-sonnet-r2')
  })
})
