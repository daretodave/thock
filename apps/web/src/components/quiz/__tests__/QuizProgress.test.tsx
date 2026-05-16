import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuizProgress } from '../QuizProgress'

describe('<QuizProgress>', () => {
  it('renders "Question N of M" text', () => {
    render(<QuizProgress current={2} total={4} />)
    expect(screen.getByText(/question 2 of 4/i)).toBeInTheDocument()
  })
})
