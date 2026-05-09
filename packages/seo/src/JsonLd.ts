import { createElement } from 'react'
import type { ReactElement } from 'react'

type Graph = Record<string, unknown> | Record<string, unknown>[]

/**
 * Inline JSON-LD `<script>` tag. Pass any schema.org graph object;
 * arrays render as a single `<script>` with a JSON array body
 * (Google supports either shape).
 *
 * Implemented with `createElement` (no JSX) so this package stays
 * importable from node-only contexts (e2e fixtures, tests, scripts)
 * without forcing every consumer's tsconfig into JSX mode.
 */
export function JsonLd({ graph }: { graph: Graph }): ReactElement {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(graph) },
  })
}
