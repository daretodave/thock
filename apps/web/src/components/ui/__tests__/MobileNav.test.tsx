import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileNav } from '../MobileNav'

describe('<MobileNav>', () => {
  it('renders a closed hamburger toggle by default', () => {
    render(<MobileNav />)
    const toggle = screen.getByTestId('mobile-nav-toggle')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByTestId('mobile-nav-menu')).toBeNull()
  })

  it('opens the drawer when the toggle is clicked', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    expect(screen.getByTestId('mobile-nav-toggle').getAttribute('aria-expanded')).toBe(
      'true',
    )
    expect(screen.getByTestId('mobile-nav-menu')).toBeInTheDocument()
  })

  it('renders all five pillar links inside the open drawer', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    const drawer = screen.getByTestId('mobile-nav-menu')
    const labels = ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides']
    for (const label of labels) {
      expect(drawer).toHaveTextContent(label)
    }
  })

  it('closes the drawer when a link inside it is clicked', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    const drawer = screen.getByTestId('mobile-nav-menu')
    const firstLink = drawer.querySelector('a')!
    fireEvent.click(firstLink)
    expect(screen.queryByTestId('mobile-nav-menu')).toBeNull()
  })

  it('toggles back closed when the toggle is clicked again', () => {
    render(<MobileNav />)
    const toggle = screen.getByTestId('mobile-nav-toggle')
    fireEvent.click(toggle)
    expect(screen.getByTestId('mobile-nav-menu')).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(screen.queryByTestId('mobile-nav-menu')).toBeNull()
  })
})
