import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ResolvedPart } from '@/lib/data-runtime'

// MDXRemote is an async RSC — mock it synchronously so JSDOM can render
vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => (
    <div data-testid="mdx-remote-output">{source}</div>
  ),
}))

// Mock the MDX component registry to avoid pulling in the full remark pipeline
vi.mock('@thock/content/mdx', () => ({
  mdxComponents: {},
  PartReference: ({
    id,
    fallback,
  }: {
    id: string
    fallback?: string
    parts?: ResolvedPart[]
  }) => <span data-testid="part-ref">{fallback ?? id}</span>,
}))

// remark-gfm is imported as a plugin object — mock it as identity
vi.mock('remark-gfm', () => ({ default: () => () => {} }))

import { ArticleBody } from '../ArticleBody'

describe('<ArticleBody>', () => {
  it('renders with data-testid="article-body" wrapper', () => {
    render(<ArticleBody body="# Hello world" />)
    expect(screen.getByTestId('article-body')).toBeInTheDocument()
  })

  it('passes body source to MDXRemote', () => {
    const body = 'Switch review content goes here'
    render(<ArticleBody body={body} />)
    expect(screen.getByTestId('mdx-remote-output')).toHaveTextContent(body)
  })

  it('renders without error when parts is omitted (defaults to [])', () => {
    render(<ArticleBody body="No parts mentioned." />)
    expect(screen.getByTestId('article-body')).toBeInTheDocument()
  })

  it('renders without error when parts array is provided', () => {
    const parts: ResolvedPart[] = [
      {
        id: 'oil-king',
        kind: 'switch',
        slug: 'gateron-oil-king',
        record: {
          slug: 'gateron-oil-king',
          name: 'Gateron Oil King',
          vendorSlug: 'cannonkeys',
          type: 'linear',
          housingTop: 'pc',
          housingBottom: 'nylon',
          stem: 'pom',
          springGrams: { actuation: 55, bottomOut: 65 },
          travelMm: 4,
          factoryLubed: true,
          releasedAt: '2022-08-01',
          status: 'in-production',
          description: 'Mid-weight linear.',
          updatedAt: '2026-05-08T00:00:00.000Z',
        },
        vendorUrl: 'https://cannonkeys.com',
      },
    ]
    render(<ArticleBody body="<PartReference id='oil-king' />" parts={parts} />)
    expect(screen.getByTestId('article-body')).toBeInTheDocument()
  })
})
