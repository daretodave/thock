import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartHero } from '../PartHero'
import type { ResolvedPart } from '@/lib/data-runtime'

vi.mock('@/lib/data-runtime', async () => {
  const actual = await vi.importActual<typeof import('@/lib/data-runtime')>(
    '@/lib/data-runtime',
  )
  return {
    ...actual,
    getVendorBySlug: (slug: string) =>
      slug === 'novelkeys'
        ? { slug: 'novelkeys', name: 'NovelKeys', url: 'https://novelkeys.com' }
        : null,
  }
})

const FAKE_SWITCH = {
  id: 'switch:akko-v3-cream-blue-pro',
  kind: 'switch',
  slug: 'akko-v3-cream-blue-pro',
  record: {
    slug: 'akko-v3-cream-blue-pro',
    name: 'Akko V3 Cream Blue Pro',
    vendorSlug: 'novelkeys',
    status: 'in-production',
  },
} as unknown as ResolvedPart

const FAKE_BOARD = {
  id: 'board:bakeneko65',
  kind: 'board',
  slug: 'bakeneko65',
  record: {
    slug: 'bakeneko65',
    name: 'Bakeneko65',
    vendorSlug: 'unknown-vendor',
    status: 'discontinued',
  },
} as unknown as ResolvedPart

describe('<PartHero>', () => {
  it('renders H1 with the part name', () => {
    render(<PartHero part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-hero-h1')).toHaveTextContent(
      'Akko V3 Cream Blue Pro',
    )
  })

  it('renders kind eyebrow with the resolved label', () => {
    render(<PartHero part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-hero-eyebrow')).toHaveTextContent(
      /part · switch/i,
    )
  })

  it('renders vendor name when the vendor resolves', () => {
    render(<PartHero part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-hero-vendor')).toHaveTextContent(
      /by NovelKeys/i,
    )
  })

  it('falls back to the vendor slug when the vendor record is missing', () => {
    render(<PartHero part={FAKE_BOARD} />)
    expect(screen.getByTestId('part-hero-vendor')).toHaveTextContent(
      /by unknown-vendor/i,
    )
  })

  it('renders the status pill with the resolved label', () => {
    render(<PartHero part={FAKE_SWITCH} />)
    expect(screen.getByTestId('part-hero-status')).toHaveTextContent(
      /in production/i,
    )
  })
})
