import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wordmark } from '../Wordmark'

describe('<Wordmark>', () => {
  it('renders the literal "thock" in lowercase', () => {
    render(<Wordmark />)
    expect(screen.getByLabelText('thock')).toHaveTextContent('thock')
  })

  it('uses serif typography', () => {
    render(<Wordmark />)
    const wordmark = screen.getByLabelText('thock')
    expect(wordmark.className).toMatch(/font-serif/)
  })

  it('renders the brass accent dot from design/brand.jsx', () => {
    render(<Wordmark />)
    expect(screen.getByTestId('wordmark-dot')).toBeInTheDocument()
  })

  it('scales via size prop', () => {
    const { rerender } = render(<Wordmark size="sm" />)
    expect(screen.getByLabelText('thock').className).toMatch(/text-\[18px\]/)
    rerender(<Wordmark size="lg" />)
    expect(screen.getByLabelText('thock').className).toMatch(/text-\[40px\]/)
  })
})
