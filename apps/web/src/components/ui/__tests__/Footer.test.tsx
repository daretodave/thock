import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('<Footer>', () => {
  it('renders the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 thock/i)).toBeInTheDocument()
  })

  it('renders the Buttondown footer form (phase 15 retrofit)', () => {
    render(<Footer />)
    const form = screen.getByTestId('buttondown-form-footer')
    expect(form).toHaveAttribute(
      'action',
      'https://buttondown.com/api/emails/embed-subscribe/thock',
    )
    expect(form).toHaveAttribute('method', 'post')
    const submit = form.querySelector(
      'input[type="submit"]',
    ) as HTMLInputElement | null
    expect(submit).not.toBeNull()
    expect(submit!.value).toBe('Subscribe')
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
