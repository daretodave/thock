import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Stack } from '../Stack'

describe('<Stack>', () => {
  it('uses column flex by default', () => {
    const { container } = render(<Stack>x</Stack>)
    expect(container.firstChild).toHaveClass('flex')
    expect(container.firstChild).toHaveClass('flex-col')
  })

  it('switches to row when requested', () => {
    const { container } = render(<Stack direction="row">x</Stack>)
    expect(container.firstChild).toHaveClass('flex-row')
  })

  it('maps gap to --thock-N spacing token', () => {
    const { container } = render(<Stack gap={5}>x</Stack>)
    expect((container.firstChild as HTMLElement).style.gap).toBe('var(--thock-5)')
  })
})
