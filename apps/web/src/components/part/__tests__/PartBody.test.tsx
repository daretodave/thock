import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartBody } from '../PartBody'

describe('<PartBody>', () => {
  it('renders the description verbatim in a paragraph', () => {
    render(<PartBody description="Light tactile with a sharp early bump." />)
    const body = screen.getByTestId('part-body')
    expect(body.tagName).toBe('P')
    expect(body).toHaveTextContent(
      /Light tactile with a sharp early bump\./i,
    )
  })

  it('renders empty-ish description without crashing', () => {
    render(<PartBody description="" />)
    const body = screen.getByTestId('part-body')
    expect(body.tagName).toBe('P')
    expect(body.textContent).toBe('')
  })
})
