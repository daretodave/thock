import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GlobalError from '../global-error'

describe('<GlobalError>', () => {
  it('renders the fallback heading and copy', () => {
    render(<GlobalError error={new Error('boom')} reset={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Something went wrong.'
    )
    expect(
      screen.getByText(/the incident has a digest you can quote/i)
    ).toBeInTheDocument()
  })

  it('shows the digest when present on the error', () => {
    const error = Object.assign(new Error('boom'), { digest: 'abc123' })
    render(<GlobalError error={error} reset={vi.fn()} />)
    expect(screen.getByText(/digest: abc123/)).toBeInTheDocument()
  })

  it('does not render a digest span when absent', () => {
    render(<GlobalError error={new Error('boom')} reset={vi.fn()} />)
    expect(screen.queryByText(/digest:/)).toBeNull()
  })

  it('calls reset() when "Try again" is clicked', () => {
    const reset = vi.fn()
    render(<GlobalError error={new Error('boom')} reset={reset} />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('exposes the fallback as an alert region for assistive tech', () => {
    render(<GlobalError error={new Error('boom')} reset={vi.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
