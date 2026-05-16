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
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^\/part\/switch\//)
    }
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
