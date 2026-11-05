'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Board } from '@thock/data'
import { recommendBoard, type BoardQuizAnswers } from '@/lib/quiz/recommendBoard'
import { QuizProgress } from './QuizProgress'
import { QuizStep, type QuizOption } from './QuizStep'
import { BoardResultCard } from './BoardResultCard'

const QUESTIONS: {
  key: keyof BoardQuizAnswers
  question: string
  options: QuizOption[]
}[] = [
  {
    key: 'layoutPref',
    question: 'What board size do you want?',
    options: [
      { value: 'tkl', label: 'TKL — no numpad, keeps arrows', description: 'Drops the numpad but keeps the function row and arrow keys' },
      { value: '75', label: '75% — TKL features, tighter', description: 'Function row and arrows stacked tighter than a TKL' },
      { value: '65', label: '65% — arrows, no function row', description: 'Drops the function row but keeps dedicated arrow keys' },
      { value: '60', label: '60% — smallest common footprint', description: 'No arrows, no function row, no numpad — just the alpha block' },
      { value: 'no-pref', label: 'No strong preference', description: 'Size is not a deciding factor for me' },
    ],
  },
  {
    key: 'mountStylePref',
    question: 'What mounting feel do you want?',
    options: [
      { value: 'gasket', label: 'Gasket mount — soft, cushioned bounce', description: 'The plate floats on gasket material for a springy, muted feel' },
      { value: 'top-mount', label: 'Top mount — structured flex', description: 'The plate screws into the top case half for a controlled, springy feel' },
      { value: 'tray-mount', label: 'Tray mount — firm and simple', description: 'The plate screws directly to a tray for the stiffest, most affordable feel' },
      { value: 'pcb-mount', label: 'PCB mount — direct and rigid', description: 'Switches mount straight to the PCB with no separate plate flex' },
      { value: 'no-pref', label: 'No strong preference', description: 'Mount feel is not a deciding factor for me' },
    ],
  },
  {
    key: 'caseMaterialPref',
    question: 'What case material do you want?',
    options: [
      { value: 'aluminum', label: 'Aluminum — solid, premium', description: 'Heavy and dense, the most common premium case material' },
      { value: 'polycarbonate', label: 'Polycarbonate — softer, deeper sound', description: 'Translucent plastic known for a warmer, more muted sound' },
      { value: 'plastic', label: 'Plastic — light and affordable', description: 'The lightest, most budget-friendly case material' },
      { value: 'wood', label: 'Wood — natural warmth', description: 'A natural material with a distinct look and sound' },
      { value: 'no-pref', label: 'No strong preference', description: 'Case material is not a deciding factor for me' },
    ],
  },
  {
    key: 'hotswapPref',
    question: 'Do you want hotswap switch sockets?',
    options: [
      { value: 'yes', label: 'Yes — let me swap switches without soldering', description: 'Hotswap sockets let you try and change switches anytime' },
      { value: 'no', label: 'No — soldered is fine', description: "I'm fine committing to one set of switches" },
      { value: 'no-pref', label: 'No strong preference', description: 'Hotswap is not a deciding factor for me' },
    ],
  },
  {
    key: 'wirelessPref',
    question: 'Do you want wireless connectivity?',
    options: [
      { value: 'yes', label: 'Yes — Bluetooth or 2.4GHz support', description: 'Wireless lets you ditch the cable for compatible devices' },
      { value: 'no', label: 'No — wired is fine', description: "I'm fine staying wired" },
      { value: 'no-pref', label: 'No strong preference', description: 'Wireless is not a deciding factor for me' },
    ],
  },
]

type Props = {
  boards: Board[]
}

export function BoardQuiz({ boards }: Props) {
  const [answers, setAnswers] = useState<Partial<BoardQuizAnswers>>({})
  const [step, setStep] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)
  const pendingAdvance = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)

  const totalSteps = QUESTIONS.length
  const currentQ = QUESTIONS[step]
  const isDone = step >= totalSteps

  const results = isDone ? recommendBoard(answers as BoardQuizAnswers, boards) : []
  const maxScore = results[0]?.score ?? 0

  // Once the results have shown, a retake autofocuses each question.
  const [hasCompleted, setHasCompleted] = useState(false)
  if (isDone && !hasCompleted) setHasCompleted(true)

  useEffect(() => {
    if (isDone) {
      resultsHeadingRef.current?.focus()
    }
  }, [isDone])

  useEffect(() => {
    return () => {
      if (pendingAdvance.current) clearTimeout(pendingAdvance.current)
    }
  }, [])

  function handleSelect(value: string) {
    if (!currentQ) return
    const next = { ...answers, [currentQ.key]: value }
    setAnswers(next)
    if (pendingAdvance.current) clearTimeout(pendingAdvance.current)
    pendingAdvance.current = setTimeout(() => {
      pendingAdvance.current = null
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
            autoFocus={hasCompleted}
          />
        </>
      )}

      {isDone && (
        <div data-testid="board-quiz-results">
          <h2
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="text-h2 font-serif text-text mb-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu rounded-xs"
          >
            Your top matches
          </h2>
          <p className="text-body text-text-2 mb-8">
            Based on your answers, here are the boards most likely to fit your build.
          </p>
          <div className="flex flex-col gap-4">
            {results.map((r, i) => (
              <BoardResultCard
                key={r.board.slug}
                board={r.board}
                score={r.score}
                maxScore={maxScore}
                rank={i + 1}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {results[0] && results[1] && (
              <Link
                href={`/compare/board?a=${results[0].board.slug}&b=${results[1].board.slug}`}
                data-testid="board-quiz-compare-top-link"
                className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
              >
                Compare top 2 →
              </Link>
            )}
            <Link
              href="/part/board"
              data-testid="board-quiz-browse-all-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              Browse all boards →
            </Link>
            <Link
              href="/parts"
              data-testid="board-quiz-browse-all-parts-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              Browse all parts →
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="text-small font-mono text-text-2 hover:text-text border border-border px-4 py-2 rounded-sm hover:border-border-hi transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
