import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PillarHero } from '../PillarHero'

describe('<PillarHero> pills array', () => {
  it('renders multiple pills in input order, first with rss testid', () => {
    render(
      <PillarHero
        pillar="trends"
        lede="Lede."
        pills={[
          {
            href: '/trends/tracker',
            label: 'Trends Tracker',
            sublabel: 'open the dashboard',
            testId: 'tracker',
          },
          {
            href: '/feed/trends.xml',
            label: 'Trends RSS',
            sublabel: 'subscribe',
            testId: 'rss',
          },
        ]}
      />,
    )
    expect(screen.getByTestId('pillar-hero-tracker')).toHaveAttribute(
      'href',
      '/trends/tracker',
    )
    expect(screen.getByTestId('pillar-hero-rss')).toHaveAttribute(
      'href',
      '/feed/trends.xml',
    )
  })

  it('keeps the legacy rssLink prop working as a single-pill shorthand', () => {
    render(
      <PillarHero
        pillar="news"
        lede="Lede."
        rssLink={{ href: '/feed/news.xml', label: 'News RSS' }}
      />,
    )
    expect(screen.getByTestId('pillar-hero-rss')).toHaveAttribute(
      'href',
      '/feed/news.xml',
    )
  })

  it('renders rightRail content instead of pills when provided', () => {
    render(
      <PillarHero
        pillar="trends"
        lede="Lede."
        rightRail={<span data-testid="custom-rail">99</span>}
      />,
    )
    expect(screen.getByTestId('pillar-hero-rail')).toBeInTheDocument()
    expect(screen.getByTestId('custom-rail')).toBeInTheDocument()
    expect(screen.queryByTestId('pillar-hero-rss')).toBeNull()
  })

  it('honors a custom eyebrow override', () => {
    render(
      <PillarHero
        pillar="trends"
        lede="Lede."
        eyebrow="trends · tracker"
      />,
    )
    expect(screen.getByTestId('pillar-hero-eyebrow')).toHaveTextContent(
      /trends · tracker/i,
    )
  })
})
