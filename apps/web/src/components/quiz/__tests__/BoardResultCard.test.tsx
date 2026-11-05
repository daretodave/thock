import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Board } from '@thock/data'
import { BoardResultCard } from '../BoardResultCard'

const BOARD: Board = {
  slug: 'bakeneko65',
  name: 'Bakeneko65',
  vendorSlug: 'kprepublic',
  layout: '65',
  caseMaterial: 'aluminum',
  mountStyle: 'gasket',
  hotswap: true,
  wireless: false,
  releasedAt: '2021-01-01',
  status: 'in-stock',
  description:
    'A compact 65% gasket-mounted aluminum board with a hotswap PCB, popular as a budget-friendly first custom build.',
  updatedAt: '2026-05-21T00:00:00.000Z',
}

describe('<BoardResultCard>', () => {
  it('renders the board name', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('Bakeneko65')).toBeInTheDocument()
  })

  it('links to /part/board/<slug>', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    const link = screen.getByRole('link', { name: /bakeneko65/i })
    expect(link).toHaveAttribute('href', '/part/board/bakeneko65')
  })

  it('renders the board name inside a real h3, not a plain link', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    expect(screen.getByTestId('board-result-card-name').tagName).toBe('H3')
  })

  it('shows human-readable layout, mount style, and case material labels', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('65% · Gasket · Aluminum')).toBeInTheDocument()
  })

  it('shows a terse hotswap/wireless badge, omitting wireless when false', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('Hotswap')).toBeInTheDocument()
    expect(screen.queryByText(/Wireless/)).not.toBeInTheDocument()
  })

  it('shows "Soldered" when hotswap is false, and includes "Wireless" when wireless is true', () => {
    const soldered: Board = { ...BOARD, hotswap: false, wireless: true }
    render(<BoardResultCard board={soldered} score={20} maxScore={30} rank={1} />)
    expect(screen.getByText('Soldered · Wireless')).toBeInTheDocument()
  })

  it('shows correct match percentage', () => {
    render(<BoardResultCard board={BOARD} score={15} maxScore={30} rank={2} />)
    expect(screen.getByTestId('board-result-card-pct')).toHaveTextContent('50% match')
  })

  it('match percentage uses text-text-2 (not text-text-3) for WCAG AA contrast', () => {
    render(<BoardResultCard board={BOARD} score={20} maxScore={30} rank={1} />)
    const pct = screen.getByTestId('board-result-card-pct')
    expect(pct.className).toContain('text-text-2')
    expect(pct.className).not.toContain('text-text-3')
  })

  it('renders a neutral "popular pick" label instead of "0% match" when maxScore is 0', () => {
    render(<BoardResultCard board={BOARD} score={0} maxScore={0} rank={3} />)
    expect(screen.getByTestId('board-result-card-pct')).toHaveTextContent('Popular pick')
    expect(screen.queryByText(/0% match/)).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
