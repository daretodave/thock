import type { ReactElement } from 'react'

/**
 * Accent palette aliases. Each maps to an OKLCH value used elsewhere
 * on the site (tokens.css / hero-art splashes). Authors pass the
 * alias, not the raw OKLCH — keeps MDX legible and lets us shift
 * palette without rewriting article frontmatter.
 *
 * "Data has its own accent color." Each viz should pass the alias
 * matching the splash color used inside its SVG so the desktop
 * connector visually tags the viz to its data lineage.
 */
const ACCENT_OKLCH: Record<string, string> = {
  coral: 'oklch(0.68 0.165 28)',
  amber: 'oklch(0.78 0.10 80)',
  bronze: 'oklch(0.80 0.135 75)',
  bordeaux: 'oklch(0.62 0.13 25)',
  // Default if no accent given — site accent token.
  default: 'var(--thock-accent)',
}

function resolveAccent(accent: string | undefined): string {
  const fallback = ACCENT_OKLCH['default'] ?? 'var(--thock-accent)'
  if (!accent) return fallback
  // Named alias?
  const alias = ACCENT_OKLCH[accent]
  if (alias) return alias
  // Otherwise treat as a raw CSS color (oklch / hex / var).
  return accent
}

export type InlineVizProps = {
  /** Path under /public, typically /article-viz/<article-slug>/<viz-slug>.svg */
  src: string
  /** Required — screen reader caption. Describes what the diagram shows, not its decoration. */
  alt: string
  /** Optional — short italic figcaption rendered below the diagram. */
  caption?: string
  /**
   * Per-viz accent color. Drives the desktop connector arm + dot
   * that anchors the floated figure to its position in the article
   * column. Accepts either a named alias (`coral`, `amber`, `bronze`,
   * `bordeaux`) or any raw CSS color string (oklch, hex, var()).
   *
   * Default falls back to the site `--thock-accent` token. The
   * authoring convention: pass the same accent the viz's SVG uses
   * for its own splash — that way the connector is the data's own
   * color, visually tagging which signal the reader is following.
   */
  accent?: string
}

/**
 * Inline visualization. SVG diagram or chart embedded inside an
 * article body — distinct from `<KeyboardImage>` (photographs,
 * bordered) and the article hero-art (decorative, atop).
 *
 * **Mobile (default):** figure renders inline at full body width,
 * sitting on the page background with no chrome.
 *
 * **Desktop (≥ xl, 1280px):** figure floats into the right-side
 * whitespace via `float: right` + a viewport-responsive negative
 * `margin-right` (calc-pinned so the figure's right edge lands ~24px
 * from the viewport edge at any width including 4K). `clear-right`
 * stacks subsequent viz vertically — two viz placed close together
 * in the MDX don't overlap; the second one pushes down below the
 * first.
 *
 * An SVG connector arm runs from the figure's natural inline-flow
 * row inside the article column out to a dot on the figure's left
 * edge. The connector is a three-segment step shape — flat, slope,
 * flat — that visually links the data to its place in the prose.
 * The arm width also adapts via calc, spanning the gap from the
 * article column's right edge to the figure's left edge regardless
 * of viewport.
 *
 * The article body container must have `xl:relative` so the SVG
 * `right: 100%` anchor lands correctly inside the figure's positioning
 * context, and `xl:[display:flow-root]` so the floats don't escape
 * the body height. Both are applied on `<ArticleBody>`.
 *
 * Assets live under `apps/web/public/article-viz/<slug>/<viz-slug>.svg`
 * with a sibling `.svg.json` provenance file. Family convention:
 * 1200×N viewBox, warm-grey stroke, one splash color per article,
 * brass-bronze theme accent dot. See the brander agent for the
 * full visual language.
 */
export function InlineViz({
  src,
  alt,
  caption,
  accent,
}: InlineVizProps): ReactElement {
  const accentColor = resolveAccent(accent)
  return (
    <figure
      className="
        my-10
        xl:relative xl:my-12
        xl:float-right xl:clear-right
        xl:w-[32rem]
        xl:ml-8
        xl:mr-[calc(-50vw_-_16px)]
      "
      style={{ ['--thock-viz-accent' as string]: accentColor }}
    >
      {/* Desktop connector arm — _/- step shape, accent-colored.
       *  - Sits absolutely to the LEFT of the figure (right edge of SVG = left edge of figure)
       *  - Width adapts to viewport via calc so the arm always spans
       *    the gap from the article column's right edge to the figure's
       *    left edge, plus a few rem of bleed INTO the article column.
       *  - vector-effect keeps the stroke width pixel-true through
       *    the preserveAspectRatio="none" viewBox stretching.
       *
       *  Path geometry (viewBox 0 0 100 100, stretched to actual w×h):
       *    (0, 8)    article-column anchor — slightly below the figure's top edge
       *    (35, 8)   end of the first flat segment ("_")
       *    (65, 50)  end of the diagonal ("/") — meets the dot's vertical center
       *    (100, 50) dot — figure's left edge, vertically centered
       *
       *  SVG width formula (in viewport units, xl breakpoint = 1280):
       *    figure.left = (100vw - 16) - 32rem   // right-pinned at viewport.right - 16px
       *    body.right  = 50vw - 40              // body.left + 60ch with container centered
       *    gap         = figure.left - body.right = 50vw - 488 + something
       *    arm width   = gap + 80px bleed = calc(50vw - 408px)
       */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="thock-viz-connector hidden xl:block absolute right-full top-0 h-full w-[calc(50vw_-_408px)] overflow-visible"
      >
        <polyline
          points="0,8 35,8 65,50 100,50"
          fill="none"
          stroke="var(--thock-viz-accent)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Dot on the figure's left edge, vertically centered. Sits
       *  on top of the connector's terminus so the visual reads as
       *  "the line ends in a dot embedded on the figure's edge." */}
      <span
        aria-hidden="true"
        className="thock-viz-dot hidden xl:block absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full"
        style={{ background: 'var(--thock-viz-accent)' }}
      />

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full"
      />
      {caption && (
        <figcaption className="mt-2 font-serif italic text-small text-text-3">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
