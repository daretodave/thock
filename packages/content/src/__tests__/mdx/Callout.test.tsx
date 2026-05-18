import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from '../../mdx/Callout'

describe('Callout — MDX prose component', () => {
  it('renders an aside with role="note"', () => {
    const { container } = render(<Callout>body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(aside?.getAttribute('role')).toBe('note')
  })

  it('default type "note" applies border-border-hi tone class', () => {
    const { container } = render(<Callout>body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('border-border-hi')
  })

  it('type="warn" applies border-down tone class', () => {
    const { container } = render(<Callout type="warn">body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('border-down')
    expect(aside?.className).not.toContain('border-border-hi')
  })

  it('type="info" applies border-accent-mu tone class', () => {
    const { container } = render(<Callout type="info">body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('border-accent-mu')
  })

  it('renders h2 with data-testid="callout-title" and text-text-2 when title is provided', () => {
    const { container } = render(<Callout title="Key point">body</Callout>)
    const h2 = container.querySelector('h2[data-testid="callout-title"]')
    expect(h2).not.toBeNull()
    expect(h2?.textContent).toBe('Key point')
    expect(h2?.className).toContain('text-text-2')
    expect(h2?.className).not.toContain('text-text-3')
  })

  it('renders no h2 when title is omitted', () => {
    const { container } = render(<Callout>body</Callout>)
    expect(container.querySelector('h2')).toBeNull()
  })

  it('renders children inside the aside', () => {
    const { getByText } = render(<Callout>callout content</Callout>)
    expect(getByText('callout content')).not.toBeNull()
  })
})
