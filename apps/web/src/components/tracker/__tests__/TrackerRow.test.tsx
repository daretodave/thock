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
        row={row({ name: 'Oil King', articleSlug: 'oil-king-deep-dive' })}
        article={article}
      />,
    )
    const links = Array.from(
      screen
        .getByTestId('tracker-row')
        .querySelectorAll('a[href="/article/oil-king-deep-dive"]'),
    )
    const noteLink = links.find((a) =>
      /why the oil king/i.test(a.textContent ?? ''),
    )
    expect(noteLink).toBeDefined()
  })

  it('renders the row name as a link to /article/<slug> when an article resolves', () => {
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
        row={row({ name: 'Oil King', articleSlug: 'oil-king-deep-dive' })}
        article={article}
      />,
    )
    const nameLink = screen.getByTestId('tracker-row-name-link')
    expect(nameLink).toHaveAttribute('href', '/article/oil-king-deep-dive')
    expect(nameLink).toHaveTextContent('Oil King')
  })

  it('renders the row name as plain text when no article resolves', () => {
    render(<TrackerRow rank={2} row={row({ name: 'Lonesome Switch' })} />)
    expect(screen.queryByTestId('tracker-row-name-link')).toBeNull()
    expect(screen.getByTestId('tracker-row')).toHaveTextContent(
      'Lonesome Switch',
    )
  })

  it('renders an em-dash when no article resolves and no note is set', () => {
    render(<TrackerRow rank={2} row={row()} />)
    expect(screen.getByTestId('tracker-row')).toHaveTextContent('—')
  })

  it('renders the editor’s note as the linked text when both article and note are set', () => {
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
        row={row({
          name: 'Oil King',
          articleSlug: 'oil-king-deep-dive',
          note: 'GB closed in March; secondhand demand kept rising on r/mechmarket.',
        })}
        article={article}
      />,
    )
    const links = Array.from(
      screen
        .getByTestId('tracker-row')
        .querySelectorAll('a[href="/article/oil-king-deep-dive"]'),
    )
    const noteLink = links.find((a) =>
      /secondhand demand/i.test(a.textContent ?? ''),
    )
    expect(noteLink).toBeDefined()
    // The article title must NOT appear as link text — that's the
    // duplicate-link finding this branch closes.
    const titleLink = links.find((a) =>
      /why the oil king/i.test(a.textContent ?? ''),
    )
    expect(titleLink).toBeUndefined()
  })

  it('renders the note as plain text in the editor’s-note column when no article resolves', () => {
    render(
      <TrackerRow
        rank={2}
        row={row({
          name: 'MT3 profile',
          note: 'Backstock at NovelKeys steadier than last quarter; price holding.',
        })}
      />,
    )
    const noteText = screen.getAllByTestId('tracker-row-note-text')
    expect(noteText.length).toBeGreaterThan(0)
    expect(noteText[0]).toHaveTextContent(/backstock at novelkeys/i)
    // No em dash should render when note covers the column.
    expect(screen.queryByText('—')).toBeNull()
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
