import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mdxComponents } from '../../mdx/components'

const AutoLink = mdxComponents.a

describe('AutoLink — MDX anchor replacement', () => {
  it('renders children as link text', () => {
    const { getByText } = render(<AutoLink href="/guide">click here</AutoLink>)
    expect(getByText('click here')).not.toBeNull()
  })

  it('passes href to the anchor element', () => {
    const { container } = render(
      <AutoLink href="/article/gateron-oil-king-deep-dive">read</AutoLink>,
    )
    expect(
      container.querySelector('a')?.getAttribute('href'),
    ).toBe('/article/gateron-oil-king-deep-dive')
  })

  it('internal path — no rel or target', () => {
    const { container } = render(
      <AutoLink href="/article/some-slug">internal</AutoLink>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBeNull()
    expect(a?.getAttribute('target')).toBeNull()
  })

  it('external https:// URL — adds rel="noopener" and target="_blank"', () => {
    const { container } = render(
      <AutoLink href="https://example.com">external</AutoLink>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBe('noopener')
    expect(a?.getAttribute('target')).toBe('_blank')
  })

  it('external http:// URL — adds rel="noopener" and target="_blank"', () => {
    const { container } = render(
      <AutoLink href="http://example.com">http external</AutoLink>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBe('noopener')
    expect(a?.getAttribute('target')).toBe('_blank')
  })

  it('undefined href — no rel or target', () => {
    const { container } = render(<AutoLink>anchor</AutoLink>)
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBeNull()
    expect(a?.getAttribute('target')).toBeNull()
  })
})
