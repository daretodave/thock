import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  GroupBuyCountdownRow,
  daysLeft,
  progressFraction,
} from '../GroupBuyCountdownRow'
import { makeGroupBuy, makeVendor } from './testFixtures'

describe('progressFraction', () => {
  it('returns ~0.5 at the midpoint of a 10-day window', () => {
    const f = progressFraction({
      startDate: '2026-05-01',
      endDate: '2026-05-11',
      todayIso: '2026-05-06',
    })
    expect(f).toBeCloseTo(0.5, 1)
  })

  it('clamps to 0 when today is before the start date', () => {
    expect(
      progressFraction({
        startDate: '2026-05-10',
        endDate: '2026-05-20',
        todayIso: '2026-05-01',
      }),
    ).toBe(0)
  })

  it('returns 0 when totalDays is zero', () => {
    expect(
      progressFraction({
        startDate: '2026-05-10',
        endDate: '2026-05-10',
        todayIso: '2026-05-09',
      }),
    ).toBe(0)
  })
})

describe('daysLeft', () => {
  it('counts whole days from today to the end date', () => {
    expect(daysLeft('2026-05-15', '2026-05-10')).toBe(5)
  })

  it('returns 0 once the end date has passed', () => {
    expect(daysLeft('2026-05-01', '2026-05-10')).toBe(0)
  })
})

describe('<GroupBuyCountdownRow>', () => {
  it('marks the row as urgent when ≤3 days remain', () => {
    const gb = makeGroupBuy({
      startDate: '2026-05-01',
      endDate: '2026-05-12',
    })
    render(
      <GroupBuyCountdownRow
        groupBuy={gb}
        vendor={makeVendor()}
        now={new Date('2026-05-10T00:00:00Z')}
      />,
    )
    const row = screen.getByTestId('group-buy-row')
    expect(row.getAttribute('data-urgent')).toBe('true')
  })

  it('is not urgent when more than three days remain', () => {
    const gb = makeGroupBuy({
      startDate: '2026-05-01',
      endDate: '2026-05-30',
    })
    render(
      <GroupBuyCountdownRow
        groupBuy={gb}
        vendor={makeVendor()}
        now={new Date('2026-05-10T00:00:00Z')}
      />,
    )
    const row = screen.getByTestId('group-buy-row')
    expect(row.getAttribute('data-urgent')).toBe('false')
  })

  it('falls back to the vendor slug when no vendor record is provided', () => {
    const gb = makeGroupBuy({ vendorSlug: 'unknown-vendor' })
    render(
      <GroupBuyCountdownRow
        groupBuy={gb}
        vendor={null}
        now={new Date('2026-05-10T00:00:00Z')}
      />,
    )
    expect(screen.getByTestId('group-buy-row')).toHaveTextContent(
      'unknown-vendor',
    )
  })
})
