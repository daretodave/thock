import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Mono } from '../Mono'

describe('<Mono>', () => {
  it('wraps children in the mono font class', () => {
    render(<Mono>NK87 v3</Mono>)
    const node = screen.getByText('NK87 v3')
    expect(node.className).toMatch(/font-mono/)
  })

  it('applies uppercase tracking when requested', () => {
    render(<Mono uppercase>deep dive</Mono>)
    const node = screen.getByText('deep dive')
    expect(node.className).toMatch(/uppercase/)
    expect(node.className).toMatch(/tracking-\[0\.08em\]/)
  })
})
