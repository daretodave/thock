import { describe, expect, it } from 'vitest'
import type { GroupBuy } from '@thock/data'
import { partitionVendorGroupBuys } from '../helpers'

function makeGroupBuy(
  overrides: Partial<GroupBuy> & {
    slug: string
    status: GroupBuy['status']
    startDate: string
    endDate: string
  },
): GroupBuy {
  return {
    name: overrides.slug,
    vendorSlug: 'vendor',
    productSlug: null,
    productKind: 'board',
    region: 'global',
    url: 'https://example.com',
    imageUrl: null,
    heroImage: null,
    heroImageAlt: null,
    description: 'A test group buy for unit testing purposes only.',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const TODAY = '2026-05-16'

describe('partitionVendorGroupBuys', () => {
  it('sorts active buys soonest-closing first, not furthest-out first', () => {
    const soon = makeGroupBuy({
      slug: 'soon',
      status: 'live',
      startDate: '2026-05-01',
      endDate: '2026-05-20',
    })
    const far = makeGroupBuy({
      slug: 'far',
      status: 'live',
      startDate: '2026-05-01',
      endDate: '2026-06-15',
    })
    const { active } = partitionVendorGroupBuys([far, soon], TODAY)
    expect(active.map((gb) => gb.name)).toEqual(['soon', 'far'])
  })

  it('sorts past buys most-recently-ended first', () => {
    const older = makeGroupBuy({
      slug: 'older',
      status: 'closed',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    })
    const recent = makeGroupBuy({
      slug: 'recent',
      status: 'closed',
      startDate: '2026-04-01',
      endDate: '2026-05-01',
    })
    const { past } = partitionVendorGroupBuys([older, recent], TODAY)
    expect(past.map((gb) => gb.name)).toEqual(['recent', 'older'])
  })

  it('routes an announced buy past its endDate to the past bucket', () => {
    const ended = makeGroupBuy({
      slug: 'ended',
      status: 'announced',
      startDate: '2026-04-01',
      endDate: '2026-05-10',
    })
    const { active, past } = partitionVendorGroupBuys([ended], TODAY)
    expect(active).toHaveLength(0)
    expect(past).toHaveLength(1)
  })

  it('routes a live buy ending today to the active bucket', () => {
    const endsToday = makeGroupBuy({
      slug: 'ends-today',
      status: 'live',
      startDate: '2026-05-01',
      endDate: TODAY,
    })
    const { active, past } = partitionVendorGroupBuys([endsToday], TODAY)
    expect(active).toHaveLength(1)
    expect(past).toHaveLength(0)
  })
})
