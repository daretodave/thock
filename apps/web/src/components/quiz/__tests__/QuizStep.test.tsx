import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizStep, type QuizOption } from '../QuizStep'

const OPTIONS: QuizOption[] = [
  { value: 'alpha', label: 'Alpha option', description: 'First choice' },
  { value: 'beta', label: 'Beta option', description: 'Second choice' },
  { value: 'gamma', label: 'Gamma option', description: 'Third choice' },
]

describe('<QuizStep>', () => {
  it('renders the question text as a heading', () => {
    render(<QuizStep question="What is your preference?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /what is your preference/i })).toBeInTheDocument()
  })

  it('renders all option labels', () => {
    render(<QuizStep question="Q?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByText('Alpha option')).toBeInTheDocument()
    expect(screen.getByText('Beta option')).toBeInTheDocument()
    expect(screen.getByText('Gamma option')).toBeInTheDocument()
  })

  it('calls onSelect with the option value when clicked', () => {
    const onSelect = vi.fn()
    render(<QuizStep question="Q?" options={OPTIONS} selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Beta option'))
    expect(onSelect).toHaveBeenCalledWith('beta')
  })

  it('marks the selected option with aria-pressed=true', () => {
    render(<QuizStep question="Q?" options={OPTIONS} selected="alpha" onSelect={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const alphaBtn = buttons.find((b) => b.textContent?.includes('Alpha option'))
    expect(alphaBtn).toHaveAttribute('aria-pressed', 'true')
  })
})
