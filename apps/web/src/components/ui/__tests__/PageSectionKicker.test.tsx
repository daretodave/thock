import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageSectionKicker } from '../PageSectionKicker'

describe('PageSectionKicker', () => {
  it('renders children', () => {
    render(<PageSectionKicker>Archive</PageSectionKicker>)
    expect(screen.getByText('Archive')).toBeDefined()
  })

  it('has default data-testid', () => {
    render(<PageSectionKicker>Archive</PageSectionKicker>)
    expect(screen.getByTestId('page-section-kicker')).toBeDefined()
  })

  it('accepts custom testId', () => {
    render(<PageSectionKicker testId="custom-kicker">Latest</PageSectionKicker>)
    expect(screen.getByTestId('custom-kicker')).toBeDefined()
  })

  it('has text-text-2 class (WCAG AA contrast guard)', () => {
    render(<PageSectionKicker>Archive</PageSectionKicker>)
    const el = screen.getByTestId('page-section-kicker')
    expect(el.className).toContain('text-text-2')
  })

  it('does NOT have text-text-3 class (regression guard)', () => {
    render(<PageSectionKicker>Archive</PageSectionKicker>)
    const el = screen.getByTestId('page-section-kicker')
    expect(el.className).not.toContain('text-text-3')
  })

  it('accepts optional className override', () => {
    render(<PageSectionKicker className="mt-2">Archive</PageSectionKicker>)
    const el = screen.getByTestId('page-section-kicker')
    expect(el.className).toContain('mt-2')
    expect(el.className).toContain('text-text-2')
  })
})
