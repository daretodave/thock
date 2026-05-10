import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from '../../mdx/Callout'
import { mdxComponents } from '../../mdx/components'

/**
 * Regression guard for user-jots 11d932d (CRITIQUE.md
 * "/article/* — cheat-sheet / Callout block has no margin-bottom;
 * next H2 collides") and d269094 (issue #32 — same surface,
 * bumped from mt-16 to mt-20 because the prior fix still read
 * as too tight). The fix pairs SerifH2's top margin with a
 * Callout block-margin so the gap survives CSS margin-collapse
 * and reads as deliberate breathing room.
 */
describe('MDX prose spacing — Callout + h2', () => {
  it('Callout renders with my-8 (32px each side)', () => {
    const { container } = render(<Callout title="X">body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    const className = aside!.className
    expect(className).toContain('my-8')
    expect(className).not.toContain('my-6')
  })

  it('SerifH2 renders with mt-20 (80px) so a preceding Callout never reads as flush', () => {
    const H2 = mdxComponents.h2
    const { container } = render(<H2>The three families</H2>)
    const h2 = container.querySelector('h2')
    expect(h2).not.toBeNull()
    expect(h2!.className).toContain('mt-20')
    expect(h2!.className).not.toContain('mt-16')
    expect(h2!.className).not.toContain('mt-12')
  })
})
