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
}

export function QuizStep({ question, options, selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-h3 font-serif text-text mb-6">{question}</h2>
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
              <span className="block text-sm text-text-3 mt-0.5">{opt.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
