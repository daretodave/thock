import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('<Footer>', () => {
  it('renders the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 thock/i)).toBeInTheDocument()
  })

  it('renders the placeholder newsletter signup form', () => {
    render(<Footer />)
    expect(screen.getByRole('form', { name: /newsletter signup/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/join the newsletter/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('renders the four footer nav links', () => {
    render(<Footer />)
    const labels = ['About', 'Sources', 'RSS', 'Newsletter']
    for (const label of labels) {
      const link = screen.getByRole('link', { name: label })
      expect(link).toBeInTheDocument()
    }
  })
})
