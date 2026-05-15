import type { ReactElement, ReactNode } from 'react'

export type PullQuoteProps = {
  children: ReactNode
  attribution?: string | undefined
}

export function PullQuote({ children, attribution }: PullQuoteProps): ReactElement {
  // No `<p>` wrapper around `{children}` — MDX (remark-mdx) wraps loose
  // text inside JSX block elements in its own `<p>`, so adding one here
  // produces nested `<p>` tags (invalid HTML; React hydration error #418).
  return (
    <blockquote className="my-8 border-l-2 border-accent-mu pl-6 font-serif italic text-h3 text-text">
      {children}
      {attribution && (
        <footer className="mt-3 font-sans text-small not-italic text-text-2" data-testid="pullquote-attribution">
          — {attribution}
        </footer>
      )}
    </blockquote>
  )
}
