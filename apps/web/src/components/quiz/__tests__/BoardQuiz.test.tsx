import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { Board } from '@thock/data'
import { BoardQuiz } from '../BoardQuiz'

const BOARDS: Board[] = [
  {
    slug: 'class80',
    name: 'Class80',
    vendorSlug: 'cannonkeys',
    layout: 'tkl',
    caseMaterial: 'aluminum',
    mountStyle: 'gasket',
    hotswap: false,
    wireless: false,
    releasedAt: '2022-01-01',
    status: 'in-stock',
    description: 'A soldered TKL gasket-mounted aluminum board inspired by vintage terminals.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
  {
    slug: 'qk75',
    name: 'QK75',
    vendorSlug: 'keychron',
    layout: '75',
    caseMaterial: 'aluminum',
    mountStyle: 'pcb-mount',
    hotswap: true,
    wireless: true,
    releasedAt: '2023-06-01',
    status: 'in-stock',
    description: 'A 75% PCB-mounted aluminum board with hotswap and wireless support.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
]

function answerAllQuestions() {
  fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Gasket mount — soft, cushioned bounce'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Aluminum — solid, premium'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('No — soldered is fine'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('No — wired is fine'))
  act(() => { vi.advanceTimersByTime(200) })
}

describe('<BoardQuiz>', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first question and progress indicator on initial render', () => {
    render(<BoardQuiz boards={BOARDS} />)
    expect(screen.getByText(/question 1 of 5/i)).toBeInTheDocument()
    expect(screen.getByText(/what board size do you want/i)).toBeInTheDocument()
  })

  it('advances to the next question after clicking an option', () => {
    render(<BoardQuiz boards={BOARDS} />)
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByText(/question 2 of 5/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/mounting feel/i)
  })

  it('shows results after all 5 questions are answered', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    expect(screen.getByTestId('board-quiz-results')).toBeInTheDocument()
    expect(screen.getByText(/your top matches/i)).toBeInTheDocument()
  })

  it('result cards link to /part/board/[slug] pages', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    const resultLinks = screen
      .getAllByRole('link')
      .filter(
        (l) =>
          l.getAttribute('href') !== '/part/board' &&
          l.getAttribute('href') !== '/parts' &&
          !l.getAttribute('href')?.startsWith('/compare/board'),
      )
    expect(resultLinks.length).toBeGreaterThan(0)
    for (const link of resultLinks) {
      expect(link.getAttribute('href')).toMatch(/^\/part\/board\//)
    }
  })

  it('shows a "Compare top 2" link to /compare/board with the top 2 result slugs', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    const compareLink = screen.getByTestId('board-quiz-compare-top-link')
    expect(compareLink).toBeInTheDocument()
    expect(compareLink.textContent).toMatch(/compare top 2/i)
    const href = compareLink.getAttribute('href') ?? ''
    expect(href).toMatch(/^\/compare\/board\?a=.+&b=.+$/)
  })

  it('browse-all link points to /part/board catalog page', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    const browseLink = screen.getByTestId('board-quiz-browse-all-link')
    expect(browseLink).toBeInTheDocument()
    expect(browseLink.getAttribute('href')).toBe('/part/board')
    expect(browseLink.textContent).toMatch(/browse all boards/i)
  })

  it('browse-all-parts link points to /parts catalog page', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    const partsLink = screen.getByTestId('board-quiz-browse-all-parts-link')
    expect(partsLink).toBeInTheDocument()
    expect(partsLink.getAttribute('href')).toBe('/parts')
    expect(partsLink.textContent).toMatch(/browse all parts/i)
  })

  it('rapid double-click on the same question only advances one step', () => {
    render(<BoardQuiz boards={BOARDS} />)
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByText(/question 2 of 5/i)).toBeInTheDocument()
  })

  it('a double-click on question 1 does not skip question 2 for the rest of the quiz', () => {
    render(<BoardQuiz boards={BOARDS} />)
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('Gasket mount — soft, cushioned bounce'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('Aluminum — solid, premium'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('No — soldered is fine'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('No — wired is fine'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByTestId('board-quiz-results')).toBeInTheDocument()
  })

  it('"Start over" resets to the first question', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    expect(screen.getByTestId('board-quiz-results')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /start over/i }))
    expect(screen.queryByTestId('board-quiz-results')).not.toBeInTheDocument()
    expect(screen.getByText(/question 1 of 5/i)).toBeInTheDocument()
  })

  it('moves focus to the results heading when the quiz completes', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    expect(screen.getByRole('heading', { name: /your top matches/i })).toHaveFocus()
  })

  it('moves focus back to the first question heading after "Start over"', () => {
    render(<BoardQuiz boards={BOARDS} />)
    answerAllQuestions()
    fireEvent.click(screen.getByRole('button', { name: /start over/i }))
    expect(
      screen.getByRole('heading', { name: /what board size do you want/i })
    ).toHaveFocus()
  })

  it('clears the pending advance timeout on unmount so it cannot fire after navigation', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { unmount } = render(<BoardQuiz boards={BOARDS} />)
    fireEvent.click(screen.getByText('TKL — no numpad, keeps arrows'))
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalled()
    expect(() => act(() => { vi.advanceTimersByTime(200) })).not.toThrow()
    clearTimeoutSpy.mockRestore()
  })
})
