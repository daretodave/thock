import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RootNotFound } from '../RootNotFound'

describe('<RootNotFound>', () => {
  it('renders the 404 eyebrow + italic display H1 + lede', () => {
    render(<RootNotFound />)
    expect(screen.getByTestId('not-found-eyebrow')).toHaveTextContent('404')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /lost in the layout/i,
    )
  })

  it('renders the search form with action="/search" and method="get"', () => {
    render(<RootNotFound />)
    const form = screen.getByTestId('not-found-search-form')
    expect(form).toHaveAttribute('action', '/search')
    expect(form).toHaveAttribute('method', 'get')
    const input = form.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement | null
    expect(input).not.toBeNull()
    expect(input!.name).toBe('q')
  })

  it('renders all five pillar links so the reader recovers in one click', () => {
    render(<RootNotFound />)
    const nav = screen.getByTestId('not-found-pillar-nav')
    const links = nav.querySelectorAll('a')
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual([
      '/news',
      '/trends',
      '/ideas',
      '/deep-dives',
      '/guides',
    ])
  })
})
