import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PullQuote } from '../../mdx/PullQuote'

describe('PullQuote — MDX prose component', () => {
  it('renders a <blockquote> element', () => {
    const { container } = render(<PullQuote>quote text</PullQuote>)
    expect(container.querySelector('blockquote')).not.toBeNull()
  })

  it('renders no footer when attribution is omitted', () => {
    const { container } = render(<PullQuote>quote text</PullQuote>)
    expect(container.querySelector('footer')).toBeNull()
  })

  it('renders footer with data-testid="pullquote-attribution" when attribution is provided', () => {
    const { container } = render(
      <PullQuote attribution="Author Name">quote text</PullQuote>,
    )
    const footer = container.querySelector('[data-testid="pullquote-attribution"]')
    expect(footer).not.toBeNull()
  })

  it('prefixes attribution text with em dash', () => {
    const { container } = render(
      <PullQuote attribution="Author Name">quote text</PullQuote>,
    )
    const footer = container.querySelector('footer')
    expect(footer?.textContent).toContain('— Author Name')
  })

  it('renders children inside the blockquote', () => {
    const { getByText } = render(<PullQuote>quoted passage</PullQuote>)
    expect(getByText('quoted passage')).not.toBeNull()
  })
})
