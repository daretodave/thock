import type { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@thock/ui'
import { mdxComponents } from '@thock/content/mdx'

export type ArticleBodyProps = {
  /** Raw MDX body (already stripped of frontmatter by the loader). */
  body: string
}

/**
 * Renders the article's MDX body via next-mdx-remote/rsc with the
 * shared component map. Wraps in a `prose`-style column with
 * generous serif body type and the editorial atoms registered
 * (`<PullQuote>`, `<Callout>`, `<Mono>`, etc.).
 *
 * Sync wrapper around `<MDXRemote>` — MDXRemote itself is an async
 * RSC, but it's used as a JSX element, so this component doesn't
 * need to be async. Marking it async leaks a Promise into the
 * route segment and (in Next 15) causes `notFound()` from the page
 * above to render the not-found UI with HTTP 200 instead of 404.
 */
export function ArticleBody({ body }: ArticleBodyProps): ReactElement {
  return (
    <Container as="div" className="py-10 sm:py-14">
      <div
        data-testid="article-body"
        className="thock-prose font-serif text-body text-text leading-[1.7] max-w-[60ch]"
      >
        <MDXRemote source={body} components={mdxComponents} />
      </div>
    </Container>
  )
}
