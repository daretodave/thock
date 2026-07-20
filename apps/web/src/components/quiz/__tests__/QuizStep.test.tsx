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

  it('option description uses text-text-2 (not text-text-3) for WCAG AA contrast', () => {
    render(<QuizStep question="Q?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    const descs = screen.getAllByTestId('quiz-option-description')
    expect(descs.length).toBeGreaterThan(0)
    descs.forEach((d) => {
      expect(d.className).toContain('text-text-2')
      expect(d.className).not.toContain('text-text-3')
    })
  })

  it('does not steal focus on initial mount', () => {
    render(<QuizStep question="First question?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /first question/i })).not.toHaveFocus()
  })

  it('moves focus to the new question heading when the question changes', () => {
    const { rerender } = render(
      <QuizStep question="First question?" options={OPTIONS} selected={null} onSelect={vi.fn()} />
    )
    rerender(<QuizStep question="Second question?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /second question/i })).toHaveFocus()
  })

  it('question heading is programmatically focusable (tabIndex=-1)', () => {
    render(<QuizStep question="Q?" options={OPTIONS} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /q\?/i })).toHaveAttribute('tabIndex', '-1')
  })

  it('focuses the heading on mount when autoFocus is set (reset case)', () => {
    render(
      <QuizStep question="First question?" options={OPTIONS} selected={null} onSelect={vi.fn()} autoFocus />
    )
    expect(screen.getByRole('heading', { name: /first question/i })).toHaveFocus()
  })
})
