import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrackerHeader } from '../TrackerHeader'
import { makeTrendSnapshot } from '@/components/home/__tests__/testFixtures'

describe('<TrackerHeader>', () => {
  it('renders the trends · tracker eyebrow + italic H1', () => {
    render(
      <TrackerHeader
        snapshot={makeTrendSnapshot()}
        lede="A weekly tracker."
      />,
    )
    const eyebrow = screen.getByTestId('pillar-hero-eyebrow')
    expect(eyebrow).toHaveTextContent(/trends · tracker/i)
    expect(eyebrow.textContent ?? '').not.toMatch(/signature/i)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/rising/i)
    expect(h1.querySelector('em')).not.toBeNull()
  })

  it('renders the week-number block when a snapshot is provided', () => {
    render(
      <TrackerHeader
        snapshot={makeTrendSnapshot({ isoWeek: '2026-W19' })}
        lede="Lede."
      />,
    )
    const block = screen.getByTestId('tracker-week-block')
    expect(block).toHaveTextContent('19')
    expect(block).toHaveTextContent(/2026/)
  })

  it('shows "of 53" for a 53-ISO-week year, not a hardcoded "of 52"', () => {
    render(
      <TrackerHeader
        snapshot={makeTrendSnapshot({ isoWeek: '2026-W53' })}
        lede="Lede."
      />,
    )
    const block = screen.getByTestId('tracker-week-block')
    expect(block).toHaveTextContent('53')
    expect(block).toHaveTextContent('of 53')
  })

  it('omits the week-number block when no snapshot is available', () => {
    render(<TrackerHeader snapshot={null} lede="Lede." />)
    expect(screen.queryByTestId('tracker-week-block')).toBeNull()
  })

  it('swaps to past-tense copy for an archived (non-latest) week', () => {
    render(
      <TrackerHeader
        snapshot={makeTrendSnapshot({ isoWeek: '2026-W19' })}
        lede="Lede."
        isLatest={false}
      />,
    )
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/rising/i)
    expect(h1).toHaveTextContent(/was/i)
    expect(h1).toHaveTextContent(/week 19, 2026/i)
    expect(h1.textContent ?? '').not.toMatch(/this week/i)
  })
})
