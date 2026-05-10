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

  // Regression guard for /critique pass 6 [MED] #15: items render
  // as plain `<li>` descriptive entries — no `<a>` descendant, no
  // bordered card chrome — so the visual treatment matches the
  // (currently) non-interactive nature of the rail. When per-part
  // pages ship, this assertion gets relaxed to permit anchors.
  it('renders items as plain <li> with no anchor descendant', () => {
    render(<MentionedPartsRail parts={[FAKE_SWITCH]} />)
    const rail = screen.getByTestId('mentioned-parts-rail')
    const item = rail.children[0] as HTMLElement
    expect(item.tagName).toBe('LI')
    expect(item.querySelector('a')).toBeNull()
  })
})
