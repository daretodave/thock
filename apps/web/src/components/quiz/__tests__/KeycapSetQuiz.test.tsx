import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { KeycapSet } from '@thock/data'
import { KeycapSetQuiz } from '../KeycapSetQuiz'

const KEYCAP_SETS: KeycapSet[] = [
  {
    slug: 'gmk-olivia',
    name: 'GMK Olivia',
    vendorSlug: 'cannonkeys',
    profile: 'cherry',
    material: 'abs',
    legendType: 'doubleshot',
    designer: 'Olivia',
    releasedAt: '2018-04-01',
    status: 'discontinued',
    imageUrl: null,
    description: 'Soft pink-and-cream Cherry-profile set with black accents from GMK.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
  {
    slug: 'mt3-devtty',
    name: 'MT3 /dev/tty',
    vendorSlug: 'drop',
    profile: 'mt3',
    material: 'abs',
    legendType: 'doubleshot',
    designer: 'MiTo',
    releasedAt: '2019-01-01',
    status: 'in-stock',
    imageUrl: null,
    description: 'Tall cylindrical MT3 profile keycap set with a retro terminal aesthetic.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
]

function answerAllQuestions() {
  fireEvent.click(screen.getByText('Low and uniform — Cherry / OEM / XDA'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('ABS — vibrant color, smooth surface'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Doubleshot — legends that never fade'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('No preference'))
  act(() => { vi.advanceTimersByTime(200) })
}

describe('<KeycapSetQuiz>', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first question and progress indicator on initial render', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument()
    expect(screen.getByText(/profile height/i)).toBeInTheDocument()
  })

  it('advances to the next question after clicking an option', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    fireEvent.click(screen.getByText('Low and uniform — Cherry / OEM / XDA'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/material/i)
  })

  it('shows results after all 4 questions are answered', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    answerAllQuestions()
    expect(screen.getByTestId('keycap-quiz-results')).toBeInTheDocument()
    expect(screen.getByText(/your top matches/i)).toBeInTheDocument()
  })

  it('result cards link to /part/keycap-set/[slug] pages', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    answerAllQuestions()
    const resultLinks = screen
      .getAllByRole('link')
      .filter(
        (l) =>
          l.getAttribute('href') !== '/part/keycap-set' &&
          l.getAttribute('href') !== '/parts',
      )
    expect(resultLinks.length).toBeGreaterThan(0)
    for (const link of resultLinks) {
      expect(link.getAttribute('href')).toMatch(/^\/part\/keycap-set\//)
    }
  })

  it('browse-all link points to /part/keycap-set catalog', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    answerAllQuestions()
    const link = screen.getByTestId('keycap-quiz-browse-all-link')
    expect(link.getAttribute('href')).toBe('/part/keycap-set')
  })

  it('"Start over" resets to the first question', () => {
    render(<KeycapSetQuiz keycapSets={KEYCAP_SETS} />)
    answerAllQuestions()
    expect(screen.getByTestId('keycap-quiz-results')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /start over/i }))
    expect(screen.queryByTestId('keycap-quiz-results')).not.toBeInTheDocument()
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument()
  })
})
