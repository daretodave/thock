/**
 * Compute read-time minutes from MDX body.
 * 200 wpm. Math.ceil. Floor of 1 minute.
 *
 * Strips MDX/JSX component tags and fenced code blocks before
 * counting so a paragraph-heavy article doesn't get inflated by
 * markup or example code. `caption="..."` / `title="..."` attribute
 * text is preserved first — components like <InlineViz>,
 * <KeyboardImage>, and <Callout> render these as a visible
 * <figcaption>/<h2>, not decoration, so they should count toward
 * reading time even though their tag gets stripped.
 */
export function computeReadTime(body: string): number {
  const noFences = body.replace(/```[\s\S]*?```/g, ' ')
  const visibleAttrText = [...noFences.matchAll(/\b(?:caption|title)="([^"]*)"/g)]
    .map((m) => m[1])
    .join(' ')
  const noTags = noFences.replace(/<\/?[A-Za-z][^>]*>/g, ' ')
  const text = `${noTags} ${visibleAttrText}`.replace(/[#>*_`~[\](){}]/g, ' ')
  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
  return Math.max(1, Math.ceil(words.length / 200))
}
