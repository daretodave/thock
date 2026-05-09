import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagChip } from '../TagChip'

describe('<TagChip>', () => {
  it('renders the tag name with a # prefix', () => {
    render(<TagChip slug="linear" name="Linear" category="switch" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip).toHaveTextContent(/#linear/i)
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
    render(
      <TagChip slug="x" name="X" category="misc" static />,
    )
    const chip = screen.getByTestId('tag-chip')
    expect(chip.tagName).toBe('SPAN')
  })

  it('applies category-specific tint classes', () => {
    render(<TagChip slug="alice" name="Alice" category="layout" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.className).toContain('text-tag-layout')
  })

  it('falls back to misc tint when category has no tint defined', () => {
    // misc itself uses the fallback.
    render(<TagChip slug="x" name="X" category="misc" />)
    const chip = screen.getByTestId('tag-chip')
    expect(chip.className).toContain('text-text-3')
  })
})
