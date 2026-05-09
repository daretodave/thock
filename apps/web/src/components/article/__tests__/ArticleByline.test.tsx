import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleByline } from '../ArticleByline'

describe('<ArticleByline>', () => {
  it('renders author + read time', () => {
    render(
      <ArticleByline
        author="thock"
        publishedAt="2026-05-08T12:00:00.000Z"
        readTime={7}
      />,
    )
    const byline = screen.getByTestId('article-byline')
    expect(byline).toHaveTextContent(/thock/i)
    expect(byline).toHaveTextContent(/7 min read/i)
  })

  it('renders the publish date as a <time> with ISO datetime', () => {
    render(
      <ArticleByline
        author="thock"
        publishedAt="2026-05-08T12:00:00.000Z"
        readTime={4}
      />,
    )
    const time = screen.getByText(/may 8, 2026/i)
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('dateTime', '2026-05-08T12:00:00.000Z')
  })
})
