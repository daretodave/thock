import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeSectionHeading } from '../HomeSectionHeading'

describe('<HomeSectionHeading>', () => {
  it('renders the data-testid wrapper', () => {
    render(<HomeSectionHeading title="Latest" />)
    expect(screen.getByTestId('home-section-heading')).toBeInTheDocument()
  })

  it('renders an h2 by default', () => {
    render(<HomeSectionHeading title="By pillar" />)
    expect(screen.getByRole('heading', { level: 2, name: 'By pillar' })).toBeInTheDocument()
  })

  it('renders an h3 when level=3', () => {
    render(<HomeSectionHeading title="Subsection" level={3} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Subsection' })).toBeInTheDocument()
  })

  it('renders the kicker span when provided', () => {
    render(<HomeSectionHeading kicker="Latest" title="By pillar" />)
    expect(screen.getByText('Latest')).toBeInTheDocument()
  })

  it('does not render a kicker when omitted', () => {
    const { container } = render(<HomeSectionHeading title="By pillar" />)
    // Only the heading should carry text; no extra span before it
    expect(container.querySelector('span')).toBeNull()
  })

  it('renders the "more →" link with the correct href when provided', () => {
    render(
      <HomeSectionHeading
        title="News"
        more={{ label: 'All news', href: '/news' }}
      />,
    )
    const link = screen.getByRole('link', { name: /All news/ })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/news')
  })

  it('does not render a "more" link when omitted', () => {
    render(<HomeSectionHeading title="News" />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders the title text', () => {
    render(<HomeSectionHeading title="Trending this week" />)
    expect(screen.getByText('Trending this week')).toBeInTheDocument()
  })
})
