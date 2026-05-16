import { describe, expect, it } from 'vitest'
import type { GroupBuy } from '@thock/data'
import { partitionGroupBuys, splitLiveByUrgency } from '../helpers'

function makeGroupBuy(overrides: Partial<GroupBuy> & { slug: string; status: GroupBuy['status']; startDate: string; endDate: string }): GroupBuy {
  return {
    name: overrides.slug,
    vendorSlug: 'vendor',
    productSlug: null,
    productKind: 'board',
    region: 'global',
    url: 'https://example.com',
    imageUrl: null,
    heroImage: null,
    description: 'A test group buy for unit testing purposes only.',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const NOW = new Date('2026-05-16T12:00:00.000Z')

describe('partitionGroupBuys', () => {
  it('routes a live buy (status=live, endDate >= today) to the live bucket', () => {
    const gb = makeGroupBuy({ slug: 'a', status: 'live', startDate: '2026-05-10', endDate: '2026-05-20' })
    const { live, announced, ended } = partitionGroupBuys([gb], NOW)
    expect(live).toHaveLength(1)
    expect(announced).toHaveLength(0)
    expect(ended).toHaveLength(0)
  })

  it('routes an announced buy to the announced bucket', () => {
    const gb = makeGroupBuy({ slug: 'b', status: 'announced', startDate: '2026-06-01', endDate: '2026-06-30' })
    const { live, announced, ended } = partitionGroupBuys([gb], NOW)
    expect(announced).toHaveLength(1)
    expect(live).toHaveLength(0)
    expect(ended).toHaveLength(0)
  })

  it('routes a closed buy to the ended bucket', () => {
    const gb = makeGroupBuy({ slug: 'c', status: 'closed', startDate: '2026-04-01', endDate: '2026-04-30' })
    const { ended } = partitionGroupBuys([gb], NOW)
    expect(ended).toHaveLength(1)
    expect(ended[0]?.slug).toBe('c')
  })

  it('routes a shipped buy to the ended bucket', () => {
    const gb = makeGroupBuy({ slug: 'd', status: 'shipped', startDate: '2026-03-01', endDate: '2026-03-31' })
    const { ended } = partitionGroupBuys([gb], NOW)
    expect(ended).toHaveLength(1)
  })

  it('routes an expired live buy (status=live, endDate < today) to the ended bucket', () => {
    const gb = makeGroupBuy({ slug: 'e', status: 'live', startDate: '2026-05-01', endDate: '2026-05-10' })
    const { live, ended } = partitionGroupBuys([gb], NOW)
    expect(live).toHaveLength(0)
    expect(ended).toHaveLength(1)
  })

  it('caps the ended bucket at 6 records', () => {
    const gbs = Array.from({ length: 8 }, (_, i) =>
      makeGroupBuy({ slug: `ended-${i}`, status: 'closed', startDate: '2026-04-01', endDate: `2026-04-${String(i + 1).padStart(2, '0')}` })
    )
    const { ended } = partitionGroupBuys(gbs, NOW)
    expect(ended).toHaveLength(6)
  })

  it('sorts the live bucket by endDate asc, name asc as tie-break', () => {
    const gbs = [
      makeGroupBuy({ slug: 'z-later', name: 'z-later', status: 'live', startDate: '2026-05-01', endDate: '2026-05-25' }),
      makeGroupBuy({ slug: 'a-sooner', name: 'a-sooner', status: 'live', startDate: '2026-05-01', endDate: '2026-05-18' }),
      makeGroupBuy({ slug: 'm-same', name: 'm-same', status: 'live', startDate: '2026-05-01', endDate: '2026-05-25' }),
    ]
    const { live } = partitionGroupBuys(gbs, NOW)
    expect(live.map(g => g.slug)).toEqual(['a-sooner', 'm-same', 'z-later'])
  })

  it('sorts the ended bucket by endDate desc', () => {
    const gbs = [
      makeGroupBuy({ slug: 'older', status: 'closed', startDate: '2026-03-01', endDate: '2026-03-31' }),
      makeGroupBuy({ slug: 'newer', status: 'closed', startDate: '2026-04-01', endDate: '2026-04-30' }),
    ]
    const { ended } = partitionGroupBuys(gbs, NOW)
    expect(ended.map(g => g.slug)).toEqual(['newer', 'older'])
  })
})

describe('splitLiveByUrgency', () => {
  it('moves a buy closing today (0 days) to closingSoon', () => {
    const gb = makeGroupBuy({ slug: 'today', status: 'live', startDate: '2026-05-10', endDate: '2026-05-16' })
    const { closingSoon, liveOpen } = splitLiveByUrgency([gb], NOW)
    expect(closingSoon).toHaveLength(1)
    expect(liveOpen).toHaveLength(0)
  })

  it('moves a buy closing in exactly 3 days (URGENT_THRESHOLD_DAYS) to closingSoon', () => {
    const gb = makeGroupBuy({ slug: 'in-3d', status: 'live', startDate: '2026-05-10', endDate: '2026-05-19' })
    const { closingSoon, liveOpen } = splitLiveByUrgency([gb], NOW)
    expect(closingSoon).toHaveLength(1)
    expect(liveOpen).toHaveLength(0)
  })

  it('moves a buy closing in 4 days to liveOpen', () => {
    const gb = makeGroupBuy({ slug: 'in-4d', status: 'live', startDate: '2026-05-10', endDate: '2026-05-20' })
    const { closingSoon, liveOpen } = splitLiveByUrgency([gb], NOW)
    expect(closingSoon).toHaveLength(0)
    expect(liveOpen).toHaveLength(1)
  })

  it('partitions a mixed list correctly', () => {
    const gbs = [
      makeGroupBuy({ slug: 'urgent', status: 'live', startDate: '2026-05-01', endDate: '2026-05-17' }),
      makeGroupBuy({ slug: 'open', status: 'live', startDate: '2026-05-01', endDate: '2026-05-31' }),
    ]
    const { closingSoon, liveOpen } = splitLiveByUrgency(gbs, NOW)
    expect(closingSoon.map(g => g.slug)).toEqual(['urgent'])
    expect(liveOpen.map(g => g.slug)).toEqual(['open'])
  })
})
