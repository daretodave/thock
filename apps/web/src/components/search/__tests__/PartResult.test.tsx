import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartResult } from '../PartResult'
import type { PartSearchHit } from '@/lib/search/runtime'

const SWITCH_HIT: PartSearchHit = {
  id: 'gateron-oil-king',
  slug: 'gateron-oil-king',
  kind: 'switch',
  name: 'Gateron Oil King',
  href: '/part/switch/gateron-oil-king',
  score: 1.0,
}

const KEYCAP_HIT: PartSearchHit = {
  id: 'gmk-olivia',
  slug: 'gmk-olivia',
  kind: 'keycap-set',
  name: 'GMK Olivia',
  href: '/part/keycap-set/gmk-olivia',
  score: 1.0,
}

const VENDOR_HIT: PartSearchHit = {
  id: 'cannonkeys',
  slug: 'cannonkeys',
  kind: 'vendor',
  name: 'CannonKeys',
  href: '/vendor/cannonkeys',
  score: 1.0,
}

const NEWSLETTER_HIT: PartSearchHit = {
  id: 'issue-03',
  slug: 'issue-03',
  kind: 'newsletter',
  name: 'thock weekly — issue 03',
  href: '/newsletter/issue-03',
  score: 1.0,
}

const GROUP_BUY_HIT: PartSearchHit = {
  id: 'kbdfans-gmk-cyl-greg-2',
  slug: 'kbdfans-gmk-cyl-greg-2',
  kind: 'group-buy',
  name: 'GMK CYL Greg 2',
  href: '/group-buys/past#kbdfans-gmk-cyl-greg-2',
  score: 1.0,
}

describe('<PartResult>', () => {
  it('renders the data-testid wrapper', () => {
    render(<PartResult hit={SWITCH_HIT} />)
    expect(screen.getByTestId('search-part-result')).toBeInTheDocument()
  })

  it('exposes data-slug and data-kind attributes', () => {
    render(<PartResult hit={SWITCH_HIT} />)
    const el = screen.getByTestId('search-part-result')
    expect(el).toHaveAttribute('data-slug', 'gateron-oil-king')
    expect(el).toHaveAttribute('data-kind', 'switch')
  })

  it('renders "Switch" kind label for switch hits', () => {
    render(<PartResult hit={SWITCH_HIT} />)
    expect(screen.getByTestId('search-part-kind')).toHaveTextContent('Switch')
  })

  it('renders "Keycap Set" kind label for keycap-set hits', () => {
    render(<PartResult hit={KEYCAP_HIT} />)
    expect(screen.getByTestId('search-part-kind')).toHaveTextContent('Keycap Set')
  })

  it('renders the part name as h3 text', () => {
    render(<PartResult hit={SWITCH_HIT} />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Gateron Oil King')
  })

  it('links to /part/[kind]/[slug]', () => {
    render(<PartResult hit={SWITCH_HIT} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/part/switch/gateron-oil-king')
  })

  it('renders "Vendor" kind label and links to /vendor/[slug]', () => {
    render(<PartResult hit={VENDOR_HIT} />)
    expect(screen.getByTestId('search-part-kind')).toHaveTextContent('Vendor')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/vendor/cannonkeys')
  })

  it('renders "Newsletter" kind label and links to /newsletter/[slug]', () => {
    render(<PartResult hit={NEWSLETTER_HIT} />)
    expect(screen.getByTestId('search-part-kind')).toHaveTextContent('Newsletter')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/newsletter/issue-03')
  })

  it('renders "Group Buy" kind label and links to the correct archive anchor', () => {
    render(<PartResult hit={GROUP_BUY_HIT} />)
    expect(screen.getByTestId('search-part-kind')).toHaveTextContent('Group Buy')
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/group-buys/past#kbdfans-gmk-cyl-greg-2',
    )
  })
})
