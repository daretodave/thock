import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartResult } from '../PartResult'
import type { PartSearchHit } from '@/lib/search/runtime'

const SWITCH_HIT: PartSearchHit = {
  id: 'gateron-oil-king',
  slug: 'gateron-oil-king',
  kind: 'switch',
  name: 'Gateron Oil King',
  score: 1.0,
}

const KEYCAP_HIT: PartSearchHit = {
  id: 'gmk-olivia',
  slug: 'gmk-olivia',
  kind: 'keycap-set',
  name: 'GMK Olivia',
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
})
