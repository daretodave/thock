import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Caption } from '../../mdx/Caption'

describe('Caption — MDX prose component', () => {
  it('renders a <p> element', () => {
    const { container } = render(<Caption>photo caption</Caption>)
    expect(container.querySelector('p')).not.toBeNull()
  })

  it('has data-testid="article-caption"', () => {
    const { container } = render(<Caption>caption text</Caption>)
    const p = container.querySelector('[data-testid="article-caption"]')
    expect(p).not.toBeNull()
  })

  it('renders children as content', () => {
    const { getByText } = render(<Caption>caption text here</Caption>)
    expect(getByText('caption text here')).not.toBeNull()
  })
})
