import { useEffect, useRef } from 'react'

export type QuizOption = {
  value: string
  label: string
  description: string
}

type Props = {
  question: string
  options: QuizOption[]
  selected: string | null
  onSelect: (value: string) => void
  autoFocus?: boolean
}

export function QuizStep({ question, options, selected, onSelect, autoFocus = false }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (!autoFocus) return
    }
    headingRef.current?.focus()
  }, [question, autoFocus])

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-h3 font-serif text-text mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu rounded-sm"
      >
        {question}
      </h2>
      <div className="space-y-3" role="group" aria-label={question}>
        {options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(opt.value)}
              className={[
                'w-full text-left px-5 py-4 rounded-lg border transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu',
                isSelected
                  ? 'border-accent-mu bg-surface text-text'
                  : 'border-border bg-bg-2 text-text-2 hover:border-border-hi hover:text-text',
              ].join(' ')}
            >
              <span className="block font-medium text-base">{opt.label}</span>
              <span data-testid="quiz-option-description" className="block text-sm text-text-2 mt-0.5">{opt.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
