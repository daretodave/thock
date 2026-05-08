import type { ReactElement, ReactNode } from 'react'

export type MonoProps = {
  children: ReactNode
  className?: string
  uppercase?: boolean
}

/**
 * Mono — wraps children in the JetBrains Mono family used for
 * switch names, SKUs, and metadata. Use this for technical
 * tokens inline in body text.
 */
export function Mono({ children, className = '', uppercase = false }: MonoProps): ReactElement {
  return (
    <span
      className={`font-mono ${uppercase ? 'uppercase tracking-[0.08em]' : ''} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
