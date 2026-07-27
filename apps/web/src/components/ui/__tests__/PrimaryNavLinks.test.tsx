import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { PrimaryNavLinks } from '../PrimaryNavLinks'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('<PrimaryNavLinks>', () => {
  it('renders all five pillar links plus Tools, none marked current on an unrelated route', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<PrimaryNavLinks />)
    const labels = ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides', 'Tools']
    for (const label of labels) {
      const link = screen.getByRole('link', { name: label })
      expect(link).not.toHaveAttribute('aria-current')
    }
  })

  it('marks the matching pillar link aria-current="page" on an exact route match', () => {
    vi.mocked(usePathname).mockReturnValue('/trends')
    render(<PrimaryNavLinks />)
    expect(screen.getByRole('link', { name: 'Trends' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'News' })).not.toHaveAttribute('aria-current')
  })

  it('marks the pillar link current on a nested sub-route', () => {
    vi.mocked(usePathname).mockReturnValue('/trends/tracker')
    render(<PrimaryNavLinks />)
    expect(screen.getByRole('link', { name: 'Trends' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks Tools current on /tools', () => {
    vi.mocked(usePathname).mockReturnValue('/tools')
    render(<PrimaryNavLinks />)
    expect(screen.getByRole('link', { name: 'Tools' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('header-tools-link')).toHaveAttribute('href', '/tools')
  })
})
