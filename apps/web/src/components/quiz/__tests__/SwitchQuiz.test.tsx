import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { Switch } from '@thock/data'
import { SwitchQuiz } from '../SwitchQuiz'

const SWITCHES: Switch[] = [
  {
    slug: 'gateron-oil-king',
    name: 'Gateron Oil King',
    vendorSlug: 'cannonkeys',
    type: 'linear',
    housingTop: 'pc',
    housingBottom: 'nylon',
    stem: 'pom',
    springGrams: { actuation: 55, bottomOut: 65 },
    travelMm: 4,
    factoryLubed: true,
    releasedAt: '2022-08-01',
    status: 'in-production',
    description: 'Mid-weight linear with a heavily lubed POM stem.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
  {
    slug: 'hmx-cloud',
    name: 'HMX Cloud',
    vendorSlug: 'modedesigns',
    type: 'linear',
    housingTop: 'pc',
    housingBottom: 'pc',
    stem: 'pom',
    springGrams: { actuation: 40, bottomOut: 50 },
    travelMm: 4,
    factoryLubed: false,
    releasedAt: '2023-06-01',
    status: 'in-production',
    description: 'Light linear with a smooth PC housing.',
    updatedAt: '2026-05-08T00:00:00.000Z',
  },
]

function answerAllQuestions() {
  fireEvent.click(screen.getByText('Deep and thocky'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Smooth and linear'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Medium — balanced resistance'))
  act(() => { vi.advanceTimersByTime(200) })
  fireEvent.click(screen.getByText('Long typing sessions'))
  act(() => { vi.advanceTimersByTime(200) })
}

describe('<SwitchQuiz>', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first question and progress indicator on initial render', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument()
    expect(screen.getByText(/how do you want your switches to sound/i)).toBeInTheDocument()
  })

  it('advances to the next question after clicking an option', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    fireEvent.click(screen.getByText('Deep and thocky'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument()
    expect(screen.getByText(/how should your switches feel/i)).toBeInTheDocument()
  })

  it('shows quiz-results after all 4 questions are answered', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    answerAllQuestions()
    expect(screen.getByTestId('quiz-results')).toBeInTheDocument()
    expect(screen.getByText(/your top matches/i)).toBeInTheDocument()
  })

  it('result cards link to /part/switch/[slug] pages', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    answerAllQuestions()
    const resultLinks = screen
      .getAllByRole('link')
      .filter(
        (l) =>
          l.getAttribute('href') !== '/part/switch' &&
          l.getAttribute('href') !== '/parts',
      )
    expect(resultLinks.length).toBeGreaterThan(0)
    for (const link of resultLinks) {
      expect(link.getAttribute('href')).toMatch(/^\/part\/switch\//)
    }
  })

  it('browse-all link points to /part/switch catalog page', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    answerAllQuestions()
    const browseLink = screen.getByTestId('quiz-browse-all-link')
    expect(browseLink).toBeInTheDocument()
    expect(browseLink.getAttribute('href')).toBe('/part/switch')
    expect(browseLink.textContent).toMatch(/browse all switches/i)
  })

  it('browse-all-parts link points to /parts catalog page', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    answerAllQuestions()
    const partsLink = screen.getByTestId('quiz-browse-all-parts-link')
    expect(partsLink).toBeInTheDocument()
    expect(partsLink.getAttribute('href')).toBe('/parts')
    expect(partsLink.textContent).toMatch(/browse all parts/i)
  })

  it('rapid double-click on the same question only advances one step', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    fireEvent.click(screen.getByText('Deep and thocky'))
    fireEvent.click(screen.getByText('Deep and thocky'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument()
  })

  it('a double-click on question 1 does not skip question 2 for the rest of the quiz', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    fireEvent.click(screen.getByText('Deep and thocky'))
    fireEvent.click(screen.getByText('Deep and thocky'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('Smooth and linear'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('Medium — balanced resistance'))
    act(() => { vi.advanceTimersByTime(200) })
    fireEvent.click(screen.getByText('Long typing sessions'))
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByTestId('quiz-results')).toBeInTheDocument()
  })

  it('"Start over" resets to the first question', () => {
    render(<SwitchQuiz switches={SWITCHES} />)
    answerAllQuestions()
    expect(screen.getByTestId('quiz-results')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /start over/i }))
    expect(screen.queryByTestId('quiz-results')).not.toBeInTheDocument()
    expect(screen.getByText(/question 1 of 4/i)).toBeInTheDocument()
  })
})
