import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagGroup } from '../TagGroup'
import type { Tag } from '@thock/content'

const makeTags = (): Tag[] => [
  { slug: 'linear', name: 'Linear', category: 'switch' },
  { slug: 'tactile', name: 'Tactile', category: 'switch' },
]

describe('<TagGroup>', () => {
  it('renders the category-specific data-testid on the section', () => {
    render(<TagGroup category="switch" tags={makeTags()} />)
    expect(screen.getByTestId('tag-group-switch')).toBeInTheDocument()
  })

  it('renders the correct heading label for switch', () => {
    render(<TagGroup category="switch" tags={makeTags()} />)
    expect(screen.getByTestId('tag-group-heading')).toHaveTextContent('Switch')
  })

  it('renders the correct heading label for misc', () => {
    const tags: Tag[] = [{ slug: 'group-buy', name: 'Group buy', category: 'misc' }]
    render(<TagGroup category="misc" tags={tags} />)
    expect(screen.getByTestId('tag-group-heading')).toHaveTextContent('Misc')
  })

  it('applies the correct tint class for switch (text-tag-switch)', () => {
    render(<TagGroup category="switch" tags={makeTags()} />)
    expect(screen.getByTestId('tag-group-heading').className).toContain('text-tag-switch')
  })

  it('applies text-text-2 for misc (not a text-tag-* class)', () => {
    const tags: Tag[] = [{ slug: 'group-buy', name: 'Group buy', category: 'misc' }]
    render(<TagGroup category="misc" tags={tags} />)
    const heading = screen.getByTestId('tag-group-heading')
    expect(heading.className).toContain('text-text-2')
    expect(heading.className).not.toMatch(/text-tag-/)
  })

  it('renders one chip link per tag', () => {
    render(<TagGroup category="switch" tags={makeTags()} />)
    const chips = screen.getAllByTestId('tag-chip')
    expect(chips).toHaveLength(2)
  })

  it('chip links point to /tag/<slug>', () => {
    render(<TagGroup category="switch" tags={makeTags()} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/tag/linear')
    expect(links[1]).toHaveAttribute('href', '/tag/tactile')
  })

  it('renders no chips when tags array is empty', () => {
    render(<TagGroup category="brand" tags={[]} />)
    expect(screen.queryAllByTestId('tag-chip')).toHaveLength(0)
  })
})
