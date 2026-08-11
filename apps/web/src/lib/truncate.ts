// Widest realistic overrun tolerated when extending past `max` to reach a
// word boundary — bounds worst-case output length for layout-critical call
// sites (OG image canvases) against a pathologically long leading token.
const WORD_EXTENSION_BUDGET = 40

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const sliced = text.slice(0, max)
  const trimmed = sliced.replace(/\s\S*$/, '')
  if (trimmed.length < sliced.length) return trimmed.trimEnd() + '…'
  // No word boundary within the window — the leading token itself exceeds
  // max. Extend to the next boundary rather than cut mid-word, unless that
  // token is unreasonably long (e.g. a bare URL with no boundary at all, or
  // one far past the budget) — then fall back to a hard cut.
  const nextSpace = text.indexOf(' ', max)
  if (nextSpace === -1) return text
  if (nextSpace - max <= WORD_EXTENSION_BUDGET) return text.slice(0, nextSpace) + '…'
  return sliced + '…'
}
