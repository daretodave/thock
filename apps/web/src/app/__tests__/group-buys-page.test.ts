import { describe, expect, it } from 'vitest'
import type { GroupBuy } from '@thock/data'
import { partitionGroupBuys } from '../group-buys/helpers'

function gb(over: Partial<GroupBuy> & Pick<GroupBuy, 'slug'>): GroupBuy {
  const { slug, name, ...rest } = over
  return {
    slug,
    name: name ?? `Group Buy ${slug}`,
    vendorSlug: 'novelkeys',
    productSlug: null,
    productKind: 'board',
    startDate: '2026-04-01',
    endDate: '2026-06-01',
    region: 'global',
    url: 'https://example.com/gb',
    imageUrl: null,
    status: 'live',
    description:
      'A short description that is long enough to satisfy the schema minimum.',
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...rest,
  }
}

const NOW = new Date('2026-05-09T12:00:00.000Z')

describe('partitionGroupBuys', () => {
  it('returns three empty buckets for empty input', () => {
    expect(partitionGroupBuys([], NOW)).toEqual({
      live: [],
      announced: [],
      ended: [],
    })
  })

  it('routes to live / announced / ended by status + endDate', () => {
    const live = gb({ slug: 'live', status: 'live', endDate: '2026-06-01' })
    const ann = gb({ slug: 'ann', status: 'announced' })
    const closed = gb({ slug: 'closed', status: 'closed' })
    const shipped = gb({ slug: 'shipped', status: 'shipped' })
    const expiredLive = gb({
      slug: 'expired',
      status: 'live',
      endDate: '2026-04-01',
    })
    const result = partitionGroupBuys(
      [live, ann, closed, shipped, expiredLive],
      NOW,
    )
    expect(result.live.map((g) => g.slug)).toEqual(['live'])
    expect(result.announced.map((g) => g.slug)).toEqual(['ann'])
    expect(result.ended.map((g) => g.slug).sort()).toEqual([
      'closed',
      'expired',
      'shipped',
    ])
  })

  it('sorts live by endDate asc, name asc tie-break', () => {
    const a = gb({ slug: 'a', name: 'Alpha', endDate: '2026-06-10' })
    const b = gb({ slug: 'b', name: 'Bravo', endDate: '2026-06-01' })
    const c = gb({ slug: 'c', name: 'Charlie', endDate: '2026-06-01' })
    const result = partitionGroupBuys([a, b, c], NOW)
    expect(result.live.map((g) => g.slug)).toEqual(['b', 'c', 'a'])
  })

  it('sorts announced by startDate asc', () => {
    const a = gb({ slug: 'a', status: 'announced', startDate: '2026-07-01' })
    const b = gb({ slug: 'b', status: 'announced', startDate: '2026-06-01' })
    const result = partitionGroupBuys([a, b], NOW)
    expect(result.announced.map((g) => g.slug)).toEqual(['b', 'a'])
  })

  it('sorts ended by endDate desc and caps at 6', () => {
    const eight: GroupBuy[] = Array.from({ length: 8 }).map((_, i) =>
      gb({
        slug: `e${i}`,
        status: 'closed',
        endDate: `2026-04-${String(20 - i).padStart(2, '0')}`,
      }),
    )
    const result = partitionGroupBuys(eight, NOW)
    expect(result.ended.length).toBe(6)
    expect(result.ended[0]?.slug).toBe('e0')
    expect(result.ended[5]?.slug).toBe('e5')
  })

  it('treats live with endDate < today as ended', () => {
    const expired = gb({
      slug: 'expired',
      status: 'live',
      endDate: '2026-05-08',
    })
    const result = partitionGroupBuys([expired], NOW)
    expect(result.live).toEqual([])
    expect(result.ended.map((g) => g.slug)).toEqual(['expired'])
  })
})
