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

  it('renders all five pillar links plus Tools inside the open drawer', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    const drawer = screen.getByTestId('mobile-nav-menu')
    const labels = ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides', 'Tools']
    for (const label of labels) {
      expect(drawer).toHaveTextContent(label)
    }
  })

  it('renders the Tools link with correct href and testid', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    const toolsLink = screen.getByTestId('mobile-nav-tools-link')
    expect(toolsLink).toHaveAttribute('href', '/tools')
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

  it('restores focus to the toggle button when closed via Escape', () => {
    render(<MobileNav />)
    const toggle = screen.getByTestId('mobile-nav-toggle')
    fireEvent.click(toggle)
    const firstLink = screen.getByTestId('mobile-nav-menu').querySelector('a')!
    firstLink.focus()
    expect(document.activeElement).toBe(firstLink)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('mobile-nav-menu')).toBeNull()
    expect(document.activeElement).toBe(toggle)
  })
})
