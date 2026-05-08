import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Container } from '../Container'

describe('<Container>', () => {
  it('caps width and centers', () => {
    const { container } = render(<Container>hi</Container>)
    expect(container.firstChild).toHaveClass('max-w-[1280px]')
    expect(container.firstChild).toHaveClass('mx-auto')
  })

  it('renders the requested element type', () => {
    const { container } = render(<Container as="section">x</Container>)
    expect((container.firstChild as Element).tagName).toBe('SECTION')
  })
})
