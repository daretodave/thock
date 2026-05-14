import type { ReactElement } from 'react'

export type KeyboardImageProps = {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

/**
 * Wraps an image with optional caption. Uses a plain <img> on
 * external URLs; phase 16 polish swaps to next/image where the
 * remotePatterns config lands.
 */
export function KeyboardImage({
  src,
  alt,
  caption,
  width,
  height,
}: KeyboardImageProps): ReactElement {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
        className="block w-full border border-border bg-surface"
      />
      {caption && (
        <figcaption data-testid="article-figcaption" className="mt-2 font-serif italic text-small text-text-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
