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
  it('Callout renders with asymmetric mt-8 / mb-12 — wider bottom so a following <p> never reads as headbutting the aside', () => {
    const { container } = render(<Callout title="X">body</Callout>)
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    const className = aside!.className
    expect(className).toContain('mt-8')
    expect(className).toContain('mb-12')
    // Guard against regression back to the symmetric my-8 or
    // my-6 spacings, both of which left the aside-to-prose
    // gap too tight (~1× line-height).
    expect(className).not.toContain('my-8')
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

// Regression guard for plan/CRITIQUE.md pass 8 "[MED]
// /article/keychron-q-ultra-zmk (and likely all `<aside>` callouts)
// — aside title renders as a generic, not a heading". The title prop
// must render as a heading element so screen-reader heading-jump
// navigation lands on the callout. h2 is chosen so callouts placed
// between the article h1 and the first `## section` don't introduce
// an h1 → h3 skip (WCAG 1.3.1).
describe('MDX a11y — Callout title is a heading', () => {
  it('renders the title prop as an h2 inside the aside', () => {
    const { container } = render(
      <Callout title="What's confirmed, what isn't">body</Callout>,
    )
    const heading = container.querySelector('aside > h2')
    expect(heading).not.toBeNull()
    expect(heading!.textContent).toBe("What's confirmed, what isn't")
  })

  it('omits any heading when no title is supplied', () => {
    const { container } = render(<Callout>body without a title</Callout>)
    expect(container.querySelector('aside > h2')).toBeNull()
  })

  it('preserves the eyebrow visual treatment on the heading', () => {
    const { container } = render(<Callout title="Cheat sheet">body</Callout>)
    const heading = container.querySelector('aside > h2')
    expect(heading).not.toBeNull()
    const cn = heading!.className
    expect(cn).toContain('font-mono')
    expect(cn).toContain('text-micro')
    expect(cn).toContain('uppercase')
  })
})
