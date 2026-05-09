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
  it('renders one card per resolved part', () => {
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
})
