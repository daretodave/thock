'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { KeycapSet } from '@thock/data'
import {
  recommendKeycapSet,
  type KeycapSetQuizAnswers,
} from '@/lib/quiz/recommendKeycapSet'
import { QuizProgress } from './QuizProgress'
import { QuizStep, type QuizOption } from './QuizStep'
import { KeycapSetResultCard } from './KeycapSetResultCard'

const QUESTIONS: {
  key: keyof KeycapSetQuizAnswers
  question: string
  options: QuizOption[]
}[] = [
  {
    key: 'profilePref',
    question: 'What keycap profile height appeals to you?',
    options: [
      {
        value: 'uniform',
        label: 'Low and uniform — Cherry / OEM / XDA',
        description: 'Flat-top keys at a consistent height; comfortable for long sessions',
      },
      {
        value: 'spherical-tall',
        label: 'Tall and spherical — SA style',
        description: 'Vintage-inspired high-profile with a scooped spherical top',
      },
      {
        value: 'cylindrical-tall',
        label: 'Tall and cylindrical — MT3 style',
        description: 'High profile with a sculpted cylindrical top for a retro feel',
      },
      {
        value: 'no-pref',
        label: 'No strong preference',
        description: 'Profile is not a deciding factor for me',
      },
    ],
  },
  {
    key: 'materialPref',
    question: 'What keycap material do you prefer?',
    options: [
      {
        value: 'abs',
        label: 'ABS — vibrant color, smooth surface',
        description: 'Vivid legends, slightly smooth feel; can develop shine over time',
      },
      {
        value: 'pbt',
        label: 'PBT — durable, textured, shine-resistant',
        description: 'Matte texture that holds up longer and resists finger oils',
      },
      {
        value: 'no-pref',
        label: 'No strong preference',
        description: 'Material is not a deciding factor for me',
      },
    ],
  },
  {
    key: 'legendPref',
    question: 'How do you want your legends applied?',
    options: [
      {
        value: 'doubleshot',
        label: 'Doubleshot — legends that never fade',
        description: 'Two-shot plastic injection; legends last the lifetime of the keycap',
      },
      {
        value: 'dye-sub',
        label: 'Dye-sublimated — vivid, complex colorways',
        description: 'Ink dyed into the plastic; great for photographic or intricate art',
      },
      {
        value: 'no-pref',
        label: 'No strong preference',
        description: 'Legend method is not a deciding factor for me',
      },
    ],
  },
  {
    key: 'availabilityPref',
    question: 'When do you want to buy your keycaps?',
    options: [
      {
        value: 'now',
        label: 'Right now — I want in-stock keycaps',
        description: 'Available today from a vendor without waiting',
      },
      {
        value: 'group-buy',
        label: 'I can wait for a group buy',
        description: 'Happy to join a group buy and wait a few months for production',
      },
      {
        value: 'no-pref',
        label: 'No preference',
        description: 'Availability is not a deciding factor for me',
      },
    ],
  },
]

type Props = {
  keycapSets: KeycapSet[]
}

export function KeycapSetQuiz({ keycapSets }: Props) {
  const [answers, setAnswers] = useState<Partial<KeycapSetQuizAnswers>>({})
  const [step, setStep] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)
  const pendingAdvance = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  const hasCompletedRef = useRef(false)

  const totalSteps = QUESTIONS.length
  const currentQ = QUESTIONS[step]
  const isDone = step >= totalSteps

  const results = isDone
    ? recommendKeycapSet(answers as KeycapSetQuizAnswers, keycapSets)
    : []
  const maxScore = results[0]?.score ?? 0

  useEffect(() => {
    if (isDone) {
      hasCompletedRef.current = true
      resultsHeadingRef.current?.focus()
    }
  }, [isDone])

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
            autoFocus={hasCompletedRef.current}
          />
        </>
      )}

      {isDone && (
        <div data-testid="keycap-quiz-results">
          <h2
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="text-h2 font-serif text-text mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu rounded-sm"
          >
            Your top matches
          </h2>
          <p className="text-body text-text-2 mb-8">
            Based on your answers, here are the keycap sets most likely to suit your build.
          </p>
          <div className="flex flex-col gap-4">
            {results.map((r, i) => (
              <KeycapSetResultCard
                key={r.keycapSet.slug}
                keycapSet={r.keycapSet}
                score={r.score}
                maxScore={maxScore}
                rank={i + 1}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/part/keycap-set"
              data-testid="keycap-quiz-browse-all-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors"
            >
              Browse all keycap sets →
            </Link>
            <Link
              href="/parts"
              data-testid="keycap-quiz-browse-all-parts-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors"
            >
              Browse all parts →
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="text-small font-mono text-text-2 hover:text-text border border-border px-4 py-2 rounded hover:border-border-hi transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
