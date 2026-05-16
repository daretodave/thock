'use client'

import { useRef, useState } from 'react'
import type { Switch } from '@thock/data'
import { recommendSwitch, type QuizAnswers } from '@/lib/quiz/recommendSwitch'
import { QuizProgress } from './QuizProgress'
import { QuizStep, type QuizOption } from './QuizStep'
import { ResultCard } from './ResultCard'

const QUESTIONS: {
  key: keyof QuizAnswers
  question: string
  options: QuizOption[]
}[] = [
  {
    key: 'soundProfile',
    question: 'How do you want your switches to sound?',
    options: [
      { value: 'thocky', label: 'Deep and thocky', description: 'That satisfying bottom-out sound mechanical keyboards are known for' },
      { value: 'crisp', label: 'Crisp and precise', description: 'Clean, sharp keystrokes with minimal resonance' },
      { value: 'silent', label: 'Quiet and office-friendly', description: 'Dampened — colleagues will thank you' },
      { value: 'neutral', label: 'No strong preference', description: 'Sound is not a deciding factor for me' },
    ],
  },
  {
    key: 'actuationFeel',
    question: 'How should your switches feel?',
    options: [
      { value: 'smooth', label: 'Smooth and linear', description: 'No bump — consistent resistance from top to bottom' },
      { value: 'tactile', label: 'Tactile bump', description: 'A physical click-point that confirms each keystroke' },
    ],
  },
  {
    key: 'springWeight',
    question: 'How heavy do you like your keystrokes?',
    options: [
      { value: 'light', label: 'Light — fast and effortless', description: 'Low actuation force, under 45 g — common for gaming' },
      { value: 'medium', label: 'Medium — balanced resistance', description: 'The most popular range for all-day typing, 45–60 g' },
      { value: 'heavy', label: 'Heavy — firm and deliberate', description: 'Over 60 g — prevents accidental keystrokes' },
    ],
  },
  {
    key: 'primaryUse',
    question: 'What will you use these switches for most?',
    options: [
      { value: 'gaming', label: 'Gaming', description: 'Speed and actuation consistency over long sessions' },
      { value: 'typing', label: 'Long typing sessions', description: 'Prose, code, documents — comfort over hours matters' },
      { value: 'office', label: 'Office or shared space', description: 'Quiet is essential; others share the room' },
    ],
  },
]

type Props = {
  switches: Switch[]
}

export function SwitchQuiz({ switches }: Props) {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [step, setStep] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)

  const totalSteps = QUESTIONS.length
  const currentQ = QUESTIONS[step]
  const isDone = step >= totalSteps

  const results = isDone ? recommendSwitch(answers as QuizAnswers, switches) : []
  const maxScore = results[0]?.score ?? 0

  function handleSelect(value: string) {
    if (!currentQ) return
    const next = { ...answers, [currentQ.key]: value }
    setAnswers(next)
    setTimeout(() => {
      setStep((s) => s + 1)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 150)
  }

  function handleReset() {
    setAnswers({})
    setStep(0)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={topRef} className="py-12 max-w-2xl mx-auto">
      {!isDone && currentQ && (
        <>
          <QuizProgress current={step + 1} total={totalSteps} />
          <QuizStep
            question={currentQ.question}
            options={currentQ.options}
            selected={(answers[currentQ.key] as string | undefined) ?? null}
            onSelect={handleSelect}
          />
        </>
      )}

      {isDone && (
        <div data-testid="quiz-results">
          <h2 className="text-h2 font-serif text-text mb-2">Your top matches</h2>
          <p className="text-body text-text-2 mb-8">
            Based on your answers, here are the switches most likely to feel right.
          </p>
          <div className="flex flex-col gap-4">
            {results.map((r, i) => (
              <ResultCard
                key={r.switch.slug}
                sw={r.switch}
                score={r.score}
                maxScore={maxScore}
                rank={i + 1}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-8 text-small font-mono text-text-2 hover:text-text border border-border px-4 py-2 rounded hover:border-border-hi transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
