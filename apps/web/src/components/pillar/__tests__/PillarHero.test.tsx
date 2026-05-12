import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PillarHero } from '../PillarHero'

describe('<PillarHero>', () => {
  it('renders eyebrow with the pillar slug as a descriptive label', () => {
    render(
      <PillarHero pillar="news" lede="Lede about news." />,
    )
    const eyebrow = screen.getByTestId('pillar-hero-eyebrow')
    expect(eyebrow).toHaveTextContent(/pillar · news/i)
    expect(eyebrow.textContent).not.toMatch(/of 0?5/i)
  })

  it('renders the trends pillar with the trends slug', () => {
    render(
      <PillarHero pillar="trends" lede="Lede about trends." />,
    )
    expect(screen.getByTestId('pillar-hero-eyebrow')).toHaveTextContent(
      /pillar · trends/i,
    )
  })

  it('renders the deep-dives pillar slug verbatim (hyphenated)', () => {
    render(<PillarHero pillar="deep-dives" lede="Lede." />)
    expect(screen.getByTestId('pillar-hero-eyebrow')).toHaveTextContent(
      /pillar · deep-dives/i,
    )
  })

  it('renders an italicized H1 of the pillar label by default', () => {
    render(<PillarHero pillar="news" lede="Lede." />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/news/i)
    const em = h1.querySelector('em')
    expect(em).not.toBeNull()
  })

  it('renders the lede paragraph verbatim', () => {
    render(<PillarHero pillar="guides" lede="Practical reference." />)
    expect(screen.getByText('Practical reference.')).toBeInTheDocument()
  })

  it('hides the RSS pill when no rssLink is provided', () => {
    render(<PillarHero pillar="news" lede="Lede." />)
    expect(screen.queryByTestId('pillar-hero-rss')).toBeNull()
  })

  it('renders the RSS pill linking to the configured href', () => {
    render(
      <PillarHero
        pillar="news"
        lede="Lede."
        rssLink={{ href: '/feed/news.xml', label: 'News RSS' }}
      />,
    )
    const link = screen.getByTestId('pillar-hero-rss')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/feed/news.xml')
    expect(link).toHaveTextContent(/news rss/i)
  })

  it('honors a heading override when provided', () => {
    render(
      <PillarHero
        pillar="news"
        lede="Lede."
        heading={
          <>
            Long form, <em>weekly</em>
          </>
        }
      />,
    )
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/long form, weekly/i)
  })
})
