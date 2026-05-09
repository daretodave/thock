import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageStub } from '../PageStub'

describe('<PageStub>', () => {
  it('renders title + lede', () => {
    render(<PageStub title="news" lede="Curated coverage." />)
    expect(
      screen.getByRole('heading', { level: 1, name: /news/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/curated coverage\./i)).toBeInTheDocument()
  })

  it('renders the eyebrow when provided', () => {
    render(<PageStub eyebrow="pillar" title="news" lede="x" />)
    expect(screen.getByTestId('page-stub-eyebrow')).toHaveTextContent(/pillar/i)
  })

  it('omits the eyebrow when not provided', () => {
    render(<PageStub title="news" lede="x" />)
    expect(screen.queryByTestId('page-stub-eyebrow')).toBeNull()
  })

  it('renders the deferredTo tail line when provided', () => {
    render(<PageStub title="news" lede="x" deferredTo="Phase 7" />)
    expect(screen.getByTestId('page-stub-deferred')).toHaveTextContent(
      /lands in phase 7/i,
    )
  })

  it('omits the deferredTo line when not provided', () => {
    render(<PageStub title="news" lede="x" />)
    expect(screen.queryByTestId('page-stub-deferred')).toBeNull()
  })

  it('renders extra children', () => {
    render(
      <PageStub title="t" lede="l">
        <span data-testid="extra">extra</span>
      </PageStub>,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })
})
