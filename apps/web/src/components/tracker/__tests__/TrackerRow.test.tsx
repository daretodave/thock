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

  it('renders the article title as descriptive text (no link) in the editor’s-note column when an article resolves but no note is set', () => {
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
    // The row name is the single click target; the editor's-note
    // column now renders the article title as descriptive text.
    const titleSpans = screen.getAllByTestId('tracker-row-note-text')
    expect(titleSpans.length).toBeGreaterThan(0)
    expect(titleSpans[0]).toHaveTextContent(/why the oil king/i)
    // The only anchor in the row points at the article via the row
    // name; the column text is not an anchor.
    const anchors = Array.from(
      screen
        .getByTestId('tracker-row')
        .querySelectorAll('a[href="/article/oil-king-deep-dive"]'),
    )
    expect(anchors).toHaveLength(1)
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

  it('underlines linked row names so unlinked rows visually opt out (CRITIQUE pass 8 #87)', () => {
    const article = makeArticle({
      slug: 'oil-king-deep-dive',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'oil-king-deep-dive',
        title: 'Why the Oil King',
      },
    })
    const { rerender } = render(
      <TrackerRow
        rank={1}
        row={row({ name: 'Oil King', articleSlug: 'oil-king-deep-dive' })}
        article={article}
      />,
    )
    const linkedName = screen.getByTestId('tracker-row-name-link')
    expect(linkedName.className).toMatch(/\bunderline\b/)

    rerender(<TrackerRow rank={2} row={row({ name: 'Lonesome Switch' })} />)
    const unlinkedName = screen.getByTestId('tracker-row-name-text')
    expect(unlinkedName.className).not.toMatch(/\bunderline\b/)
  })

  it('renders an em-dash when no article resolves and no note is set', () => {
    render(<TrackerRow rank={2} row={row()} />)
    expect(screen.getByTestId('tracker-row')).toHaveTextContent('—')
  })

  it('renders the editor’s note as descriptive text and keeps a single click target on the row name when both article and note are set', () => {
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
    // Row name is the only click target.
    const nameLink = screen.getByTestId('tracker-row-name-link')
    expect(nameLink).toHaveAttribute('href', '/article/oil-king-deep-dive')
    expect(nameLink).toHaveTextContent('Oil King')
    // The note text renders as a descriptive span on both the
    // mobile-stacked and desktop-column branches.
    const noteSpans = screen.getAllByTestId('tracker-row-note-text')
    expect(noteSpans.length).toBeGreaterThan(0)
    expect(noteSpans[0]).toHaveTextContent(/secondhand demand/i)
    // Single anchor per linked row — the previous duplicate-anchor
    // a11y regression is closed.
    const anchors = Array.from(
      screen
        .getByTestId('tracker-row')
        .querySelectorAll('a[href="/article/oil-king-deep-dive"]'),
    )
    expect(anchors).toHaveLength(1)
    // The article title must not leak into any anchor text — the
    // note differentiation from phase 19 stays intact, but now via
    // descriptive text rather than dual-link copy.
    const anchorText = anchors.map((a) => a.textContent ?? '').join(' ')
    expect(anchorText).not.toMatch(/why the oil king/i)
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
