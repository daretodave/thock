import { afterEach, describe, expect, it } from 'vitest'
import {
  getActiveGroupBuys,
  getAllGroupBuys,
  getGroupBuyBySlug,
} from '../../loaders/group-buys'
import { __resetForTests } from '../../loaders/memo'

describe('group-buys loader', () => {
  afterEach(() => __resetForTests())

  it('reads the backfilled group buys', () => {
    const slugs = getAllGroupBuys().map((g) => g.slug)
    expect(slugs).toContain('cannonkeys-nyawice')
    expect(slugs).toContain('kbdfans-gmk-cyl-king-of-the-seas')
    expect(slugs.length).toBeGreaterThanOrEqual(4)
  })

  it('resolves a known slug', () => {
    const gb = getGroupBuyBySlug('cannonkeys-nyawice')
    expect(gb?.vendorSlug).toBe('cannonkeys')
    expect(gb?.productKind).toBe('board')
  })

  it('includes live group buys in active list when their window includes the date', () => {
    // Nyawice runs 2026-04-17 → 2026-05-17; King of the Seas 2026-04-28 → 2026-05-31.
    const active = getActiveGroupBuys(new Date('2026-05-10T00:00:00Z'))
    const slugs = active.map((g) => g.slug)
    expect(slugs).toContain('cannonkeys-nyawice')
    expect(slugs).toContain('kbdfans-gmk-cyl-king-of-the-seas')
  })

  it('excludes a closed group buy from the active list once its end-date has passed', () => {
    // Paper80 closed 2026-04-14.
    const active = getActiveGroupBuys(new Date('2026-08-01T00:00:00Z'))
    expect(active.map((g) => g.slug)).not.toContain(
      'wuque-studio-paper80-whatever-studio',
    )
  })
})
