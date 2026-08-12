import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GroupBuysWidget } from '../GroupBuysWidget'
import { makeGroupBuy, makeVendor } from './testFixtures'

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
    expect(screen.getByText(/group buys · closing soon/i)).toBeTruthy()
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

  // Regression for plan/AUDIT.md [content] [4.2]: getActiveGroupBuys()
  // includes status:'announced' records with no startDate gate. A short
  // campaign that hasn't opened yet (endDate within 72h, startDate still
  // ahead) must not trip the "closing soon" urgent framing or render a
  // running countdown — it hasn't started.
  it('does not treat an announced-but-not-started buy as urgent even when its endDate is soon', () => {
    const notStarted = makeGroupBuy({
      slug: 'not-started',
      status: 'announced',
      startDate: '2026-05-15',
      endDate: '2026-05-20',
      name: 'Not Started GB',
    })
    render(
      <GroupBuysWidget
        groupBuys={[notStarted]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    const row = screen.getByTestId('group-buy-row')
    expect(row.getAttribute('data-announced')).toBe('true')
    expect(row.getAttribute('data-urgent')).toBe('false')
    expect(screen.getByTestId('group-buy-countdown')).toHaveTextContent(
      'opens in 6d',
    )
  })

  // Regression guard: the widget must not repeat the /vendor/[slug]
  // heading/row contradiction (plan/AUDIT.md [enhancement] [4.0], commit
  // 2f0ecb86) — a "Currently running" heading over a row that reads
  // "opens in Xd" when every capped, non-urgent row is a not-yet-started
  // announced buy (e.g. the only live buy just closed).
  it('relabels to "Opening soon" when every non-urgent row is not-yet-started', () => {
    const notStarted = makeGroupBuy({
      slug: 'not-started',
      status: 'announced',
      startDate: '2026-05-15',
      endDate: '2026-05-20',
      name: 'Not Started GB',
    })
    const { container } = render(
      <GroupBuysWidget
        groupBuys={[notStarted]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    expect(container.querySelector('aside')?.getAttribute('data-urgent')).toBe(
      'false',
    )
    expect(screen.getByText(/group buys · opening soon/i)).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: /Opening soon/i }),
    ).toBeTruthy()
    expect(screen.queryByText(/Currently running/i)).toBeNull()
  })

  // Companion case: a live, non-urgent buy alongside a not-yet-started
  // one keeps the "Currently running" framing — the relabel only fires
  // when the entire capped list is upcoming.
  it('keeps "Currently running" when at least one non-urgent row is already live', () => {
    const live = makeGroupBuy({
      slug: 'live',
      endDate: '2026-06-15',
      name: 'Live GB',
    })
    const notStarted = makeGroupBuy({
      slug: 'not-started',
      status: 'announced',
      startDate: '2026-05-15',
      endDate: '2026-05-20',
      name: 'Not Started GB',
    })
    render(
      <GroupBuysWidget
        groupBuys={[live, notStarted]}
        vendors={[makeVendor()]}
        now={new Date('2026-05-09T00:00:00Z')}
      />,
    )
    expect(
      screen.getByRole('heading', { name: /Currently running/i }),
    ).toBeTruthy()
    expect(screen.getByText(/group buys · open now/i)).toBeTruthy()
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
