import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('<Header>', () => {
  it('renders the thock wordmark linking to home', () => {
    render(<Header />)
    const homeLink = screen.getByRole('link', { name: /thock — home/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders all five pillar nav links', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const labels = ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides']
    for (const label of labels) {
      expect(nav).toHaveTextContent(label)
    }
  })

  it('includes a (currently inert) search affordance', () => {
    render(<Header />)
    const search = screen.getByRole('button', { name: /search/i })
    expect(search).toBeInTheDocument()
    expect(search).toBeDisabled()
  })
})
