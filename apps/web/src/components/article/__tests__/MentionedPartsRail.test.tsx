import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MentionedPartsRail } from '../MentionedPartsRail'
import type { ResolvedPart } from '@/lib/data-runtime'

// The component only reads `record.name` and the kind label, so we
// build a permissive fixture and cast to ResolvedPart.
const FAKE_SWITCH = {
  id: 'oil-king',
  kind: 'switch',
  slug: 'gateron-oil-king',
  record: { slug: 'gateron-oil-king', name: 'Gateron Oil King' },
} as unknown as ResolvedPart

describe('<MentionedPartsRail>', () => {
  it('renders one item per resolved part', () => {
    render(<MentionedPartsRail parts={[FAKE_SWITCH]} />)
    const rail = screen.getByTestId('mentioned-parts-rail')
    expect(rail.children).toHaveLength(1)
    expect(rail).toHaveTextContent(/Gateron Oil King/i)
    expect(rail).toHaveTextContent(/Switch/i)
  })

  it('hides itself when there are zero parts', () => {
    const { container } = render(<MentionedPartsRail parts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  // Phase 21 — items wrap in a `<Link>` to /part/<kind>/<slug>.
  // (Previously, /critique pass 6 [MED] #15 stripped the card chrome
  // because there were no per-part destinations; phase 21 ships the
  // destinations so the items become real anchors.)
  it('wraps each item in a <Link> to /part/<kind>/<slug>', () => {
    render(<MentionedPartsRail parts={[FAKE_SWITCH]} />)
    const rail = screen.getByTestId('mentioned-parts-rail')
    const item = rail.children[0] as HTMLElement
    expect(item.tagName).toBe('LI')
    const anchor = item.querySelector('a')
    expect(anchor).not.toBeNull()
    expect(anchor!.getAttribute('href')).toBe('/part/switch/gateron-oil-king')
  })
})
