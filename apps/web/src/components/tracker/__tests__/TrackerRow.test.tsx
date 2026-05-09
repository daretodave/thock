import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TrendRow } from '@thock/data'
import { TrackerRow } from '../TrackerRow'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

function row(over: Partial<TrendRow> = {}): TrendRow {
  return {
    name: 'Sample',
    category: 'switch',
    direction: 'up',
    score: 30,
    spark: [1, 2, 3, 4],
    articleSlug: null,
    ...over,
  }
}

describe('<TrackerRow>', () => {
  it('renders the rank, name, signed score, and sparkline', () => {
    render(<TrackerRow rank={1} row={row({ name: 'Oil King', score: 42 })} />)
    const r = screen.getByTestId('tracker-row')
    expect(r).toHaveTextContent('01')
    expect(r).toHaveTextContent('Oil King')
    expect(r).toHaveTextContent('+42%')
    expect(screen.getByTestId('sparkline')).toBeInTheDocument()
  })

  it('renders the editor’s-note as a link to /article/<slug> when an article resolves', () => {
    const article = makeArticle({
      slug: 'oil-king-deep-dive',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'oil-king-deep-dive',
        title: 'Why the Oil King',
      },
    })
    render(
      <TrackerRow
        rank={1}
        row={row({ articleSlug: 'oil-king-deep-dive' })}
        article={article}
      />,
    )
    const link = screen
      .getByTestId('tracker-row')
      .querySelector('a[href="/article/oil-king-deep-dive"]')
    expect(link).not.toBeNull()
    expect(link).toHaveTextContent(/why the oil king/i)
  })

  it('renders an em-dash when no article resolves', () => {
    render(<TrackerRow rank={2} row={row()} />)
    expect(screen.getByTestId('tracker-row')).toHaveTextContent('—')
  })

  it('exposes direction via a data attribute', () => {
    render(
      <TrackerRow
        rank={1}
        row={row({ direction: 'down', score: -22 })}
      />,
    )
    expect(
      screen.getByTestId('tracker-row').getAttribute('data-direction'),
    ).toBe('down')
  })
})
