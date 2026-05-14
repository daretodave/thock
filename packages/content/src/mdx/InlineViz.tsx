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
 * whitespace, centered between the article column's right edge and
 * the viewport's right edge. Width scales via clamp(28rem, 40vw,
 * 42rem) — graceful at narrow xl, 1.3× the prior baseline at wide
 * viewports including 4K. An SVG step-shape connector arm spans
 * exactly the gap between the column edge and the figure's left edge
 * (no bleed, so it never overlaps article text). The arm and a dot
 * on the figure's left edge take the viz's accent color so each
 * floated viz tags itself to its own data lineage.
 *
 * Desktop layout math lives in `apps/web/src/styles/components.css`
 * under `.thock-inline-viz` — see that file for the derivation. The
 * single `--thock-viz-width` CSS variable keeps the figure width and
 * the connector-arm width in lockstep through the clamp.
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
      className="thock-inline-viz my-10"
      style={{ ['--thock-viz-accent' as string]: accentColor }}
    >
      {/* Desktop connector arm — _/- step shape, accent-colored.
       *  Sized + positioned by `.thock-inline-viz-connector` in
       *  components.css; here we just render the SVG and the polyline.
       *
       *  Path geometry (viewBox 0 0 100 100, stretched to actual w×h):
       *    (0, 8)    article-column anchor — slightly below the figure's top edge
       *    (35, 8)   end of the first flat segment ("_")
       *    (65, 50)  end of the diagonal ("/") — meets the dot's vertical center
       *    (100, 50) dot — figure's left edge, vertically centered
       *
       *  vector-effect="non-scaling-stroke" keeps the stroke pixel-true
       *  through preserveAspectRatio="none" viewBox stretching.
       */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="thock-inline-viz-connector hidden xl:block"
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
        className="thock-inline-viz-dot hidden xl:block"
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
