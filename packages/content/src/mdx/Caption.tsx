import type { ReactElement, ReactNode } from 'react'

export type CaptionProps = {
  children: ReactNode
}

export function Caption({ children }: CaptionProps): ReactElement {
  return (
    <p className="mt-2 font-serif italic text-small text-text-2" data-testid="article-caption">{children}</p>
  )
}
