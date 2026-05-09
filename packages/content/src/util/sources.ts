/**
 * Count `<Source ...>` MDX component occurrences in an article body.
 *
 * thock articles cite external references via the inline `<Source
 * href="..." />` (or `<Source href="..." text="...">...</Source>`)
 * MDX component. The /sources page surfaces a per-article tally;
 * a future phase ships the per-citation index.
 *
 * Implementation is a literal regex `/<Source\s/g` — false positives
 * are vanishingly unlikely (no other component starts with `<Source `).
 */
export function countSourceTags(body: string): number {
  const matches = body.match(/<Source\s/g)
  return matches ? matches.length : 0
}
