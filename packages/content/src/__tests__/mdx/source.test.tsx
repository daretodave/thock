import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Source } from '../../mdx/Source'

describe('Source — citation link component', () => {
  it('renders children as the link text', () => {
    const { getByText } = render(
      <Source href="https://example.com">some citation</Source>,
    )
    expect(getByText('some citation')).not.toBeNull()
  })

  it('passes href through to the anchor element', () => {
    const { container } = render(
      <Source href="https://example.com">text</Source>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('href')).toBe('https://example.com')
  })

  it('adds data-source="true" on the anchor for /sources extraction', () => {
    const { container } = render(
      <Source href="https://example.com">text</Source>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('data-source')).toBe('true')
  })

  it('adds rel="noopener" and target="_blank" for external https:// URLs', () => {
    const { container } = render(
      <Source href="https://example.com">external</Source>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBe('noopener')
    expect(a?.getAttribute('target')).toBe('_blank')
  })

  it('adds rel="noopener" and target="_blank" for external http:// URLs', () => {
    const { container } = render(
      <Source href="http://example.com">external http</Source>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBe('noopener')
    expect(a?.getAttribute('target')).toBe('_blank')
  })

  it('does NOT add rel or target for internal relative URLs', () => {
    const { container } = render(
      <Source href="/article/gateron-oil-king-deep-dive">internal</Source>,
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('rel')).toBeNull()
    expect(a?.getAttribute('target')).toBeNull()
  })
})
