import type { CSSProperties, ReactElement, ReactNode } from 'react'

export type StackProps = {
  children: ReactNode
  className?: string
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
}

const ALIGN_CLASS: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const JUSTIFY_CLASS: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

/**
 * Stack — directional flex layout backed by the 4px token scale.
 * The gap prop maps to --thock-{1..9}, so spacing always lands on
 * the design scale rather than arbitrary pixels.
 */
export function Stack({
  children,
  className = '',
  gap = 4,
  direction = 'column',
  align,
  justify,
}: StackProps): ReactElement {
  const style: CSSProperties = { gap: `var(--thock-${gap})` }
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col'
  const alignClass = align ? ALIGN_CLASS[align] : ''
  const justifyClass = justify ? JUSTIFY_CLASS[justify] : ''
  return (
    <div
      style={style}
      className={`flex ${directionClass} ${alignClass} ${justifyClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
