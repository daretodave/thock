import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendRow } from '@thock/data'
import { TrackerCategorySection } from '../TrackerCategorySection'

function row(name: string, score: number): TrendRow {
  return {
    name,
    category: 'switch',
    direction: 'up',
    score,
    spark: [1, 2, 3],
    articleSlug: null,
  }
}

describe('<TrackerCategorySection>', () => {
  it('returns null when rows is empty', () => {
    const { container } = render(
      <TrackerCategorySection category="switch" rows={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders tracker-category-section when rows are provided', () => {
    render(
      <TrackerCategorySection
        category="switch"
        rows={[row('Gateron Oil King', 30)]}
      />,
    )
    expect(screen.getByTestId('tracker-category-section')).toBeInTheDocument()
  })

  it('sets data-category to the given category', () => {
    render(
      <TrackerCategorySection
        category="keycap"
        rows={[row('GMK Olivia', 20)]}
      />,
    )
    expect(
      screen.getByTestId('tracker-category-section').getAttribute('data-category'),
    ).toBe('keycap')
  })

  it('renders all rows inside the section', () => {
    render(
      <TrackerCategorySection
        category="layout"
        rows={[row('Alice', 10), row('75%', 25)]}
      />,
    )
    const trackerRows = screen.getAllByTestId('tracker-row')
    expect(trackerRows.length).toBe(2)
    expect(trackerRows[0]).toHaveTextContent('Alice')
    expect(trackerRows[1]).toHaveTextContent('75%')
  })

  it('renders the correct category heading label', () => {
    render(
      <TrackerCategorySection
        category="vendor"
        rows={[row('Mode Designs', 15)]}
      />,
    )
    const section = screen.getByTestId('tracker-category-section')
    expect(section).toHaveTextContent(/vendor movers/i)
  })
})
