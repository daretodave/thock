import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  getActiveGroupBuys,
  getAllGroupBuys,
  getGroupBuyBySlug,
  isGroupBuyEnded,
} from '../../loaders/group-buys'
import { __resetForTests } from '../../loaders/memo'
import { setRepoRootForTests } from '../../loaders/paths'

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
    // As of 2026-07-15 every real backfilled group buy has closed (see
    // cannonkeys-mode-sonnet-r2, flipped to 'closed' this tick), so this
    // invariant is exercised against a synthetic fixture root rather than
    // real editorial data — avoids re-breaking every time the last live
    // record closes (precedent: f6f5a2b migrated King of the Seas ->
    // Prussian Alert; that chain has now run out of live records).
    const dir = mkdtempSync(join(tmpdir(), 'thock-group-buys-'))
    mkdirSync(join(dir, 'data', 'group-buys'), { recursive: true })
    writeFileSync(
      join(dir, 'data', 'group-buys', 'fixture-live-buy.json'),
      JSON.stringify({
        slug: 'fixture-live-buy',
        name: 'Fixture Live Buy',
        vendorSlug: 'cannonkeys',
        productSlug: null,
        productKind: 'other',
        startDate: '2026-06-01',
        endDate: '2026-07-15',
        region: 'global',
        url: 'https://example.com',
        imageUrl: null,
        heroImage: null,
        status: 'live',
        description:
          'Synthetic fixture record used only to exercise the active-list date-window filter in isolation from real editorial data.',
        updatedAt: '2026-06-01T00:00:00.000Z',
      }),
    )
    try {
      setRepoRootForTests(dir)
      __resetForTests()
      const active = getActiveGroupBuys(new Date('2026-06-15T00:00:00Z'))
      const slugs = active.map((g) => g.slug)
      expect(slugs).toContain('fixture-live-buy')
    } finally {
      setRepoRootForTests(null)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('excludes a closed group buy from the active list once its end-date has passed', () => {
    // Paper80 closed 2026-04-14.
    const active = getActiveGroupBuys(new Date('2026-08-01T00:00:00Z'))
    expect(active.map((g) => g.slug)).not.toContain(
      'wuque-studio-paper80-whatever-studio',
    )
  })

  it('does not regress cannonkeys-mode-sonnet-r2 url to the known-dead product path (regression guard: fixed 9255abe, reintroduced by e3dbac8, fixed again 74e897a)', () => {
    const gb = getGroupBuyBySlug('cannonkeys-mode-sonnet-r2')
    expect(gb?.url).not.toBe('https://cannonkeys.com/products/mode-sonnet-r2')
  })

  it('does not regress deltakeyco-gmk-cyl-pandemonium url to the known-dead product path (regression guard)', () => {
    const gb = getGroupBuyBySlug('deltakeyco-gmk-cyl-pandemonium')
    expect(gb?.url).not.toBe(
      'https://deltakeyco.com/products/gmk-cyl-pandemonium-group-buy',
    )
  })

  it('does not regress kbdfans-gmk-cyl-ramune url to the known-dead product path (regression guard)', () => {
    const gb = getGroupBuyBySlug('kbdfans-gmk-cyl-ramune')
    expect(gb?.url).not.toBe('https://kbdfans.com/products/gmk-cyl-ramune')
  })
})

describe('isGroupBuyEnded', () => {
  const TODAY = '2026-07-16'

  it('treats closed status as ended regardless of endDate', () => {
    expect(
      isGroupBuyEnded({ status: 'closed', endDate: '2099-01-01' }, TODAY),
    ).toBe(true)
  })

  it('treats shipped status as ended regardless of endDate', () => {
    expect(
      isGroupBuyEnded({ status: 'shipped', endDate: '2099-01-01' }, TODAY),
    ).toBe(true)
  })

  it('treats a live buy past its endDate as ended', () => {
    expect(
      isGroupBuyEnded({ status: 'live', endDate: '2026-07-01' }, TODAY),
    ).toBe(true)
  })

  it('treats an announced buy past its endDate as ended', () => {
    expect(
      isGroupBuyEnded({ status: 'announced', endDate: '2026-07-01' }, TODAY),
    ).toBe(true)
  })

  it('does not treat a live buy still within its window as ended', () => {
    expect(
      isGroupBuyEnded({ status: 'live', endDate: '2026-08-01' }, TODAY),
    ).toBe(false)
  })

  it('does not treat an announced buy still within its window as ended', () => {
    expect(
      isGroupBuyEnded({ status: 'announced', endDate: '2026-08-01' }, TODAY),
    ).toBe(false)
  })
})
