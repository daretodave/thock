import type { ReactElement, ReactNode } from 'react'

export type PullQuoteProps = {
  children: ReactNode
  attribution?: string | undefined
}

export function PullQuote({ children, attribution }: PullQuoteProps): ReactElement {
  return (
    <blockquote className="my-8 border-l-2 border-accent-mu pl-6 font-serif italic text-h3 text-text">
      <p>{children}</p>
      {attribution && (
        <footer className="mt-3 font-sans text-small not-italic text-text-3">
          — {attribution}
        </footer>
      )}
    </blockquote>
  )
}
