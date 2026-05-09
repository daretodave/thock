import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleTagRail } from '../ArticleTagRail'
import type { Tag } from '@thock/content'

const TAGS: Map<string, Tag> = new Map([
  ['linear', { slug: 'linear', name: 'Linear', category: 'switch' }],
  ['gateron', { slug: 'gateron', name: 'Gateron', category: 'brand' }],
])

describe('<ArticleTagRail>', () => {
  it('renders one chip per tag slug, in order', () => {
    render(<ArticleTagRail tagSlugs={['linear', 'gateron']} tagsBySlug={TAGS} />)
    const rail = screen.getByTestId('article-tag-rail')
    const chips = rail.querySelectorAll('[data-testid="tag-chip"]')
    expect(chips).toHaveLength(2)
    expect(chips[0]).toHaveTextContent(/linear/i)
    expect(chips[1]).toHaveTextContent(/gateron/i)
  })

  it('hides itself when there are zero tags', () => {
    const { container } = render(
      <ArticleTagRail tagSlugs={[]} tagsBySlug={TAGS} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('falls back to misc tint + raw slug when the tag is not in the taxonomy', () => {
    render(
      <ArticleTagRail tagSlugs={['unknown-tag']} tagsBySlug={TAGS} />,
    )
    const chip = screen.getByTestId('tag-chip')
    expect(chip).toHaveTextContent(/unknown-tag/i)
    expect(chip.className).toContain('text-text-3')
  })
})
