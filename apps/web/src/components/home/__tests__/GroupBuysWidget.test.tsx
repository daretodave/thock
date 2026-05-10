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
    // All buys are well outside the 72h urgent band so the rail body
    // filter (pass 6 [LOW] drain) doesn't kick in — this test covers
    // the non-urgent cap behavior.
    const items = Array.from({ length: 6 }, (_, i) =>
      makeGroupBuy({
        slug: `s${i}`,
        endDate: `2026-06-${String(10 + i).padStart(2, '0')}`,
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

  // Regression guard for /critique pass 2 [MED]: hardcoded "ending soon
  // / Don't miss the close" framing on a buy with 37 days left was
  // hype-bro voice. Bearings rule: brass urgency is reserved for the
  // last 72 hours.
  it('uses neutral "open now / Currently running" framing when no buy is in the urgent band', () => {
    const month = makeGroupBuy({
      slug: 'month',
      endDate: '2026-06-15',
    })
    const { container } = render(
      <GroupBuysWidget
        groupBuys={[month]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    expect(container.querySelector('aside')?.getAttribute('data-urgent')).toBe(
      'false',
    )
    expect(screen.getByText(/group buys · open now/i)).toBeTruthy()
    expect(screen.getByText(/Currently running/i)).toBeTruthy()
  })

  it('uses urgent "ending soon / Don\'t miss the close" framing when at least one buy is within 72h', () => {
    const tomorrow = makeGroupBuy({
      slug: 'tomorrow',
      endDate: '2026-05-10',
    })
    const month = makeGroupBuy({
      slug: 'month',
      endDate: '2026-06-15',
    })
    const { container } = render(
      <GroupBuysWidget
        groupBuys={[tomorrow, month]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    expect(container.querySelector('aside')?.getAttribute('data-urgent')).toBe(
      'true',
    )
    expect(screen.getByText(/group buys · ending soon/i)).toBeTruthy()
    expect(screen.getByText(/Don't miss the close/i)).toBeTruthy()
  })

  // Regression guard for /critique pass 6 [LOW] #17: when the urgent
  // heading fires, the rail body should filter to urgent rows only —
  // a 19-day-out row sitting under "Don't miss the close" reads as a
  // half-true label.
  it('filters the rail body to urgent rows only when the urgent heading fires', () => {
    const tomorrow = makeGroupBuy({
      slug: 'tomorrow',
      endDate: '2026-05-10',
      name: 'Tomorrow GB',
    })
    const month = makeGroupBuy({
      slug: 'month',
      endDate: '2026-06-15',
      name: 'Month GB',
    })
    const farther = makeGroupBuy({
      slug: 'farther',
      endDate: '2026-07-01',
      name: 'Farther GB',
    })
    render(
      <GroupBuysWidget
        groupBuys={[tomorrow, month, farther]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    const rows = screen.getAllByTestId('group-buy-row')
    expect(rows).toHaveLength(1)
    expect(screen.queryByText(/Month GB/i)).toBeNull()
    expect(screen.queryByText(/Farther GB/i)).toBeNull()
    expect(screen.getByText(/Tomorrow GB/i)).toBeTruthy()
  })

  it('shows the full sorted list (capped at max) when no buy is urgent', () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeGroupBuy({
        slug: `s${i}`,
        endDate: `2026-06-${String(10 + i).padStart(2, '0')}`,
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
})
