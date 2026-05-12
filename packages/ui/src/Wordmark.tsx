import type { CSSProperties, ReactElement } from 'react'

export type WordmarkProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS: Record<NonNullable<WordmarkProps['size']>, string> = {
  sm: 'text-[18px]',
  md: 'text-[28px]',
  lg: 'text-[40px]',
}

const DOT_STYLE: CSSProperties = {
  display: 'inline-block',
  width: '0.18em',
  height: '0.18em',
  borderRadius: '999px',
  background: 'var(--thock-accent)',
  marginLeft: '0.04em',
  marginBottom: '0.62em',
  verticalAlign: 'top',
}

/**
 * The thock wordmark. Lowercase serif "thock" with a small brass
 * accent dot riding the cap line of the `h` — adopted from
 * design/brand.jsx. Always lowercase per the hard rules.
 */
export function Wordmark({ size = 'md', className = '' }: WordmarkProps): ReactElement {
  return (
    <span
      role="img"
      className={`font-serif font-medium leading-none tracking-tight text-text inline-flex items-baseline ${SIZE_CLASS[size]} ${className}`.trim()}
      aria-label="thock"
    >
      <span aria-hidden="true">thock</span>
      <span aria-hidden="true" style={DOT_STYLE} data-testid="wordmark-dot" />
    </span>
  )
}
