import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Newsletter } from '@thock/content'
import { NewsletterArchive } from '../NewsletterArchive'

function fixture(over: Partial<Newsletter> = {}): Newsletter {
  return {
    slug: 'issue-001',
    frontmatter: {
      slug: 'issue-001',
      title: 'thock weekly — issue 001',
      lede: 'A short rundown of switches, builds, and the group buys closing this week.',
      issue: 1,
      publishedAt: '2026-05-15T08:00:00.000Z',
    },
    body: 'Body content goes here.',
    filePath: '/fake/issue-001.mdx',
    ...over,
  }
}

describe('<NewsletterArchive>', () => {
  it('renders the empty state when no digests have been authored', () => {
    render(<NewsletterArchive newsletters={[]} />)
    expect(screen.getByTestId('newsletter-archive-empty')).toBeInTheDocument()
    expect(screen.getByText(/no digests yet/i)).toBeInTheDocument()
  })

  it('renders one row per digest when populated', () => {
    const items = [
      fixture(),
      fixture({
        slug: 'issue-002',
        frontmatter: {
          slug: 'issue-002',
          title: 'thock weekly — issue 002',
          lede: 'Second issue of the digest, covering MX-style stems and announcements.',
          issue: 2,
          publishedAt: '2026-05-22T08:00:00.000Z',
        },
      }),
    ]
    render(<NewsletterArchive newsletters={items} />)
    const rows = screen.getAllByTestId('newsletter-archive-row')
    expect(rows.length).toBe(2)
    expect(screen.getByText('thock weekly — issue 001')).toBeInTheDocument()
    expect(screen.getByText('thock weekly — issue 002')).toBeInTheDocument()
  })

  it('zero-pads small issue numbers in the eyebrow', () => {
    render(<NewsletterArchive newsletters={[fixture()]} />)
    expect(screen.getByText(/issue 01/i)).toBeInTheDocument()
  })
})
