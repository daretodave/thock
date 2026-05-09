import type { ReactElement, ReactNode } from 'react'
import { Mono } from '@thock/ui'
import { PullQuote } from './PullQuote'
import { Callout } from './Callout'
import { Caption } from './Caption'
import { Source } from './Source'
import { PartReference } from './PartReference'
import { KeyboardImage } from './KeyboardImage'

function SerifH2({ children }: { children?: ReactNode }): ReactElement {
  // mt-16 (64px) — generous top margin so a preceding <Callout>
  // (my-8 = 32px each side) or any other block element still leaves
  // clear breathing room before the next section. User-jot 11d932d
  // flagged H2s sitting flush with cheat-sheet Callouts when this
  // was mt-12.
  return <h2 className="mt-16 mb-4 font-serif text-h2">{children}</h2>
}

function SerifH3({ children }: { children?: ReactNode }): ReactElement {
  return <h3 className="mt-8 mb-3 font-serif text-h3">{children}</h3>
}

function AutoLink({
  href,
  children,
  ...rest
}: {
  href?: string
  children?: ReactNode
} & Record<string, unknown>): ReactElement {
  const isExternal = href != null && /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...rest}
      {...(isExternal ? { rel: 'noopener', target: '_blank' } : {})}
      className="text-text underline decoration-border-hi underline-offset-4 hover:decoration-accent"
    >
      {children}
    </a>
  )
}

/**
 * Component map consumed by `next-mdx-remote` (or any MDXProvider).
 * Phase 5 plugs this map into <ArticleBody>; phase 3 simply ships
 * the components and the map.
 */
export const mdxComponents = {
  PullQuote,
  Callout,
  Caption,
  Source,
  PartReference,
  Mono,
  KeyboardImage,
  h2: SerifH2,
  h3: SerifH3,
  a: AutoLink,
} as const
