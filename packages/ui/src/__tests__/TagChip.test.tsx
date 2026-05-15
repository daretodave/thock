import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagChip } from '../TagChip'

describe('<TagChip>', () => {
  it('renders the category prefix and the name for a typed category', () => {
    // Regression guard for plan/CRITIQUE.md HIGH "tag chips like
    // #ALICE read as person names". The category prefix lets a
    // first-time reader decode the chip without external context.
    render(<TagChip slug="alice" name="Alice" category="layout" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip).toHaveTextContent(/layout/i)
    expect(chip).toHaveTextContent(/alice/i)
    expect(chip.getAttribute('aria-label')).toBe('layout tag: Alice')
  })

  it('falls back to the legacy #name shape for misc-category chips', () => {
    // No useful prefix for the misc bucket; keeping `#` keeps that
    // visual distinct from a typed category.
    render(<TagChip slug="x" name="X" category="misc" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip).toHaveTextContent(/#x/i)
    expect(chip.querySelector('[data-testid="tag-chip-category"]')).toBeNull()
  })

  it('exposes the category via a data attribute for downstream styling', () => {
    render(<TagChip slug="linear" name="Linear" category="switch" />)
    expect(
      screen.getByTestId('tag-chip').getAttribute('data-category'),
    ).toBe('switch')
  })

  it('links to /tag/<slug> by default', () => {
    render(<TagChip slug="gateron" name="Gateron" category="brand" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.tagName).toBe('A')
    expect(chip).toHaveAttribute('href', '/tag/gateron')
  })

  it('honors an href override', () => {
    render(
      <TagChip slug="x" name="X" category="misc" href="/custom/x" />,
    )
    const chip = screen.getByTestId('tag-chip')
    expect(chip).toHaveAttribute('href', '/custom/x')
  })

  it('renders as a span when static', () => {
    render(<TagChip slug="x" name="X" category="misc" static />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.tagName).toBe('SPAN')
  })

  it('applies category-specific tint classes', () => {
    render(<TagChip slug="alice" name="Alice" category="layout" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.className).toContain('text-tag-layout')
  })

  it('falls back to misc tint when category is misc', () => {
    render(<TagChip slug="x" name="X" category="misc" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.className).toContain('text-text-2')
  })
})
