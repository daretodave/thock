import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { MobileNav } from '../MobileNav'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

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

  it('marks the matching pillar link aria-current="page" on the current route', () => {
    vi.mocked(usePathname).mockReturnValue('/trends')
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    const drawer = screen.getByTestId('mobile-nav-menu')
    const trendsLink = Array.from(drawer.querySelectorAll('a')).find(
      (a) => a.textContent === 'Trends',
    )!
    expect(trendsLink).toHaveAttribute('aria-current', 'page')
    const newsLink = Array.from(drawer.querySelectorAll('a')).find(
      (a) => a.textContent === 'News',
    )!
    expect(newsLink).not.toHaveAttribute('aria-current')
  })

  it('marks Tools current on /tools', () => {
    vi.mocked(usePathname).mockReturnValue('/tools')
    render(<MobileNav />)
    fireEvent.click(screen.getByTestId('mobile-nav-toggle'))
    expect(screen.getByTestId('mobile-nav-tools-link')).toHaveAttribute('aria-current', 'page')
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

  it('wraps Tab from the last drawer link back to the toggle button', () => {
    render(<MobileNav />)
    const toggle = screen.getByTestId('mobile-nav-toggle')
    fireEvent.click(toggle)
    const toolsLink = screen.getByTestId('mobile-nav-tools-link')
    toolsLink.focus()
    expect(document.activeElement).toBe(toolsLink)
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(toggle)
  })

  it('leaves Shift+Tab from the toggle button unhandled so it reaches the preceding header control', () => {
    render(<MobileNav />)
    const toggle = screen.getByTestId('mobile-nav-toggle')
    fireEvent.click(toggle)
    toggle.focus()
    expect(document.activeElement).toBe(toggle)
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
    document.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })
})
