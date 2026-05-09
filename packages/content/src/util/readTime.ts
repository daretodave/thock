/**
 * Compute read-time minutes from MDX body.
 * 200 wpm. Math.ceil. Floor of 1 minute.
 *
 * Strips MDX/JSX component tags and fenced code blocks before
 * counting so a paragraph-heavy article doesn't get inflated by
 * markup or example code.
 */
export function computeReadTime(body: string): number {
  const noFences = body.replace(/```[\s\S]*?```/g, ' ')
  const noTags = noFences.replace(/<\/?[A-Za-z][^>]*>/g, ' ')
  const text = noTags.replace(/[#>*_`~\[\]\(\)\{\}]/g, ' ')
  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
  return Math.max(1, Math.ceil(words.length / 200))
}
