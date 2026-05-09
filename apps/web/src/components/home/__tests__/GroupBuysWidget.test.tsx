import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  GroupBuysWidget,
  sortGroupBuysForWidget,
} from '../GroupBuysWidget'
import { makeGroupBuy, makeVendor } from './testFixtures'

describe('sortGroupBuysForWidget', () => {
  it('sorts by ascending end date', () => {
    const a = makeGroupBuy({ slug: 'late', endDate: '2026-06-30', name: 'Late' })
    const b = makeGroupBuy({ slug: 'early', endDate: '2026-05-15', name: 'Early' })
    const c = makeGroupBuy({ slug: 'mid', endDate: '2026-05-25', name: 'Mid' })
    expect(sortGroupBuysForWidget([a, b, c]).map((g) => g.slug)).toEqual([
      'early',
      'mid',
      'late',
    ])
  })

  it('breaks ties alphabetically on name', () => {
    const a = makeGroupBuy({ slug: 'a', endDate: '2026-05-15', name: 'Bravo' })
    const b = makeGroupBuy({ slug: 'b', endDate: '2026-05-15', name: 'Alpha' })
    expect(sortGroupBuysForWidget([a, b]).map((g) => g.slug)).toEqual([
      'b',
      'a',
    ])
  })

  it('caps the result at the configured max', () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      makeGroupBuy({
        slug: `s${i}`,
        endDate: `2026-05-${String(10 + i).padStart(2, '0')}`,
        name: `S${i}`,
      }),
    )
    expect(sortGroupBuysForWidget(items, 4)).toHaveLength(4)
  })
})

describe('<GroupBuysWidget>', () => {
  it('renders nothing when there are no active group buys', () => {
    const { container } = render(
      <GroupBuysWidget groupBuys={[]} vendors={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders up to four rows in end-date order', () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      makeGroupBuy({
        slug: `s${i}`,
        endDate: `2026-05-${String(10 + i).padStart(2, '0')}`,
        name: `S${i}`,
      }),
    )
    render(
      <GroupBuysWidget
        groupBuys={items}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    const rows = screen.getAllByTestId('group-buy-row')
    expect(rows).toHaveLength(4)
  })

  it('links to /group-buys at the foot of the widget', () => {
    render(
      <GroupBuysWidget
        groupBuys={[makeGroupBuy()]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    const link = screen.getByRole('link', { name: /all active group buys/i })
    expect(link.getAttribute('href')).toBe('/group-buys')
  })
})
