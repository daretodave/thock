/**
 * Canonicalizes the "hotswap" spelling family (hot swap, hot-swap,
 * hotswap, hot-swappable, hotswappable) into one token before text
 * reaches MiniSearch. MiniSearch's default tokenizer splits on
 * non-alphanumeric characters, so "hot swap"/"hot-swap" tokenize to
 * two terms (`hot`, `swap`) while "hotswap" — the site's own UI
 * label (`PartSpec`, `BoardCompareTable`) — tokenizes to one. Those
 * never overlap under fuzzy/prefix matching, so a search for the
 * site's own label spelling under-matches the majority prose
 * spelling. Apply this to both indexed text (index build) and
 * incoming queries (search runtime) so every spelling resolves to
 * the same token.
 */
export function normalizeHotswapSpelling(text: string): string {
  return text.replace(/\bhot[\s-]?swap(pable)?\b/gi, 'hotswap$1')
}
