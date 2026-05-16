type Props = {
  current: number
  total: number
}

export function QuizProgress({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="mb-6">
      <p className="text-text-3 text-sm mb-2 font-mono">
        Question {current} of {total}
      </p>
      <div
        className="h-1 bg-bg-2 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full bg-accent-mu transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
