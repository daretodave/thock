import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuizProgress } from '../QuizProgress'

describe('<QuizProgress>', () => {
  it('renders "Question N of M" text', () => {
    render(<QuizProgress current={2} total={4} />)
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument()
  })

  it('progress label uses text-text-2 (not text-text-3) for WCAG AA contrast', () => {
    render(<QuizProgress current={1} total={4} />)
    const label = screen.getByTestId('quiz-progress-label')
    expect(label.className).toContain('text-text-2')
    expect(label.className).not.toContain('text-text-3')
  })
})
