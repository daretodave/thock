interface Props {
  children: React.ReactNode
  testId?: string
  className?: string
}

/**
 * Mono micro-caps kicker label for page sections. Always text-text-2 (WCAG AA).
 * Use this instead of an inline span to prevent text-text-3 regressions.
 */
export function PageSectionKicker({ children, testId = 'page-section-kicker', className }: Props) {
  return (
    <span
      data-testid={testId}
      className={`font-mono uppercase tracking-[0.12em] text-micro text-text-2${className ? ` ${className}` : ''}`}
    >
      {children}
    </span>
  )
}
