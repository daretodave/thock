import type { ReactElement } from 'react'

export type InlineVizProps = {
  /** Path under /public, typically /article-viz/<article-slug>/<viz-slug>.svg */
  src: string
  /** Required — screen reader caption. Describes what the diagram shows, not its decoration. */
  alt: string
  /** Optional — short italic figcaption rendered below the diagram. */
  caption?: string
}

/**
 * Inline visualization. SVG diagram or chart embedded inside an
 * article body — distinct from `<KeyboardImage>` (photographs, bordered)
 * and `<hero-art>` (decorative, atop). Sits on the page background
 * with no chrome; the SVG itself carries the visual weight.
 *
 * Assets live under apps/web/public/article-viz/<slug>/<viz-slug>.svg
 * with a sibling .svg.json provenance file. Family convention:
 * 1200×N viewBox, warm-grey stroke, one splash color per article,
 * brass-bronze theme accent dot. See the brander agent for the
 * full visual language.
 */
export function InlineViz({ src, alt, caption }: InlineVizProps): ReactElement {
  return (
    <figure className="my-10">
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
