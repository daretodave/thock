/**
 * Compute read-time minutes from MDX body.
 * 200 wpm. Math.ceil. Floor of 1 minute.
 *
 * Strips MDX/JSX component tags and fenced code blocks before
 * counting so a paragraph-heavy article doesn't get inflated by
 * markup or example code. `caption="..."` / `title="..."` /
 * `attribution="..."` attribute text is preserved first —
 * components like <InlineViz>, <KeyboardImage>, <Callout>, and
 * <PullQuote> render these as a visible <figcaption>/<h2>/<footer>,
 * not decoration, so they should count toward reading time even
 * though their tag gets stripped. Markdown table separator rows
 * (`|---|---|`) are dropped entirely — they render as an invisible
 * grid divider, not text — and remaining `|` cell delimiters are
 * stripped so they don't get counted as one-character "words"
 * while real cell text still counts.
 */
export function computeReadTime(body: string): number {
  const noFences = body.replace(/```[\s\S]*?```/g, ' ')
  const noTableSeparators = noFences.replace(/^[ \t]*\|?(?:[ \t]*:?-+:?[ \t]*\|)+[ \t]*:?-+:?[ \t]*\|?[ \t]*$/gm, ' ')
  const visibleAttrText = [...noTableSeparators.matchAll(/\b(?:caption|title|attribution)="([^"]*)"/g)]
    .map((m) => m[1])
    .join(' ')
  const noTags = noTableSeparators.replace(/<\/?[A-Za-z][^>]*>/g, ' ')
  const text = `${noTags} ${visibleAttrText}`.replace(/[#>*_`~[\](){}|]/g, ' ')
  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
  return Math.max(1, Math.ceil(words.length / 200))
}
