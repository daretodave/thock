import type { ReactElement, ReactNode } from 'react'

export type SourceProps = {
  href: string
  children: ReactNode
}

/**
 * `<Source href="...">` — citation link inline in editorial copy.
 * Phase 16 collects every Source across the site into /sources.
 */
export function Source({ href, children }: SourceProps): ReactElement {
  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className="text-text-2 underline decoration-border-hi underline-offset-4 hover:text-text hover:decoration-accent"
      data-source="true"
      {...(isExternal ? { rel: 'noopener', target: '_blank' } : {})}
    >
      {children}
    </a>
  )
}
