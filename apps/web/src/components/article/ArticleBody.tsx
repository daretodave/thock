import type { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@thock/ui'
import { mdxComponents, PartReference } from '@thock/content/mdx'
import type { ResolvedPart } from '@/lib/data-runtime'

export type ArticleBodyProps = {
  /** Raw MDX body (already stripped of frontmatter by the loader). */
  body: string
  /**
   * Parts already resolved against the article's
   * `frontmatter.mentionedParts`. The MDX `<PartReference id>`
   * component closures over this list at render time — without it
   * every `<PartReference>` falls through to the
   * `[unknown part:<id>]` fallback (filed as a HIGH critique).
   */
  parts?: ResolvedPart[]
}

/**
 * Renders the article's MDX body via next-mdx-remote/rsc with a
 * per-article component map. The shared `mdxComponents` map
 * registers `<PartReference>` without any data context — wrapping
 * here binds the resolved parts list so id lookups resolve against
 * the actual frontmatter mentionedParts list rather than always
 * hitting the unknown-part fallback.
 *
 * Sync wrapper around `<MDXRemote>` — MDXRemote itself is an async
 * RSC, but it's used as a JSX element, so this component doesn't
 * need to be async. Marking it async leaks a Promise into the
 * route segment and (in Next 15) causes `notFound()` from the page
 * above to render the not-found UI with HTTP 200 instead of 404.
 */
export function ArticleBody({
  body,
  parts = [],
}: ArticleBodyProps): ReactElement {
  const components = {
    ...mdxComponents,
    PartReference: (props: { id: string; fallback?: string }) => (
      <PartReference {...props} parts={parts} />
    ),
  }

  return (
    <Container as="div" className="py-10 sm:py-14">
      <div
        data-testid="article-body"
        className="thock-prose font-serif text-body text-text leading-[1.7] max-w-[60ch]"
      >
        <MDXRemote source={body} components={components} />
      </div>
    </Container>
  )
}
