import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PartReference } from '../../mdx/PartReference'
import type { ResolvedPart } from '../../loaders/parts'

const SWITCH_PART = {
  id: 'oil-king',
  kind: 'switch',
  slug: 'gateron-oil-king',
  record: { name: 'Gateron Oil King' },
} as unknown as ResolvedPart

const KEYCAP_SET_PART = {
  id: 'olivia',
  kind: 'keycap-set',
  slug: 'gmk-olivia',
  record: { name: 'GMK Olivia', imageUrl: 'https://kbdfans.com/gmk-olivia' },
} as unknown as ResolvedPart

const KEYCAP_SET_NO_URL = {
  id: 'kat-drifter',
  kind: 'keycap-set',
  slug: 'kat-drifter',
  record: { name: 'KAT Drifter', imageUrl: null },
} as unknown as ResolvedPart

const BOARD_PART = {
  id: 'sonnet',
  kind: 'board',
  slug: 'mode-sonnet',
  record: { name: 'Mode Sonnet', imageUrl: 'https://modedesigns.com/sonnet' },
} as unknown as ResolvedPart

describe('PartReference', () => {
  it('renders the default fallback when parts list is empty', () => {
    const { container } = render(<PartReference id="oil-king" parts={[]} />)
    expect(container.textContent).toBe('[unknown part:oil-king]')
  })

  it('renders a custom fallback when parts list is empty and fallback prop is provided', () => {
    const { container } = render(
      <PartReference id="oil-king" parts={[]} fallback="unknown switch" />,
    )
    expect(container.textContent).toBe('unknown switch')
  })

  it('renders switch part name as Mono with no anchor (switches carry no URL today)', () => {
    const { container } = render(<PartReference id="oil-king" parts={[SWITCH_PART]} />)
    expect(container.textContent).toBe('Gateron Oil King')
    expect(container.querySelector('a')).toBeNull()
  })

  it('renders keycap-set part as anchor + Mono when imageUrl is set', () => {
    const { container } = render(<PartReference id="olivia" parts={[KEYCAP_SET_PART]} />)
    const a = container.querySelector('a')
    expect(a).not.toBeNull()
    expect(a!.getAttribute('href')).toBe('https://kbdfans.com/gmk-olivia')
    expect(a!.getAttribute('rel')).toBe('sponsored noopener')
    expect(container.textContent).toBe('GMK Olivia')
  })

  it('renders keycap-set part as Mono with no anchor when imageUrl is null', () => {
    const { container } = render(<PartReference id="kat-drifter" parts={[KEYCAP_SET_NO_URL]} />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toBe('KAT Drifter')
  })

  it('renders board part as anchor + Mono when imageUrl is set', () => {
    const { container } = render(<PartReference id="sonnet" parts={[BOARD_PART]} />)
    const a = container.querySelector('a')
    expect(a).not.toBeNull()
    expect(a!.getAttribute('href')).toBe('https://modedesigns.com/sonnet')
    expect(container.textContent).toBe('Mode Sonnet')
  })
})
