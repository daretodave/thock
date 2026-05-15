import type { ReactElement } from 'react'
import { OG_BACKGROUND, OG_PALETTE } from './palette'

export type ArticleOGContentProps = {
  /** Pillar display label rendered as the kicker. */
  pillarLabel: string
  /** Article H1 — wrapped to two lines max via fontSize tuned for `titleFontSize`. */
  title: string
  /** Article lede — truncated upstream so it fits two lines comfortably. */
  lede: string
  /** Author byline. */
  author: string
  /** Estimated read time in minutes. */
  readTime: number
  /** Computed serif font size for the title (px). Caller picks by length. */
  titleFontSize: number
}

/**
 * Per-article OG card. Same chrome as the home and pillar templates:
 * dark cool-charcoal radial gradient, brass dot accent, mono kicker,
 * italic serif headline. The article-specific layout differs from
 * the pillar template by:
 *  - dropping the giant pillar word in favor of the article title
 *  - adding a lede paragraph beneath the title
 *  - rendering a byline + read-time footer aligned with the site URL
 *  - using a left-edge brass accent strip to anchor the card.
 *
 * Color values come from `./palette` (hex sRGB) — Satori does not
 * support `oklch()` so the source-of-truth oklch tokens cannot be
 * referenced directly here. See `palette.ts` for the conversion.
 */
export function ArticleOGContent({
  pillarLabel,
  title,
  lede,
  author,
  readTime,
  titleFontSize,
}: ArticleOGContentProps): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: OG_BACKGROUND,
        color: OG_PALETTE.text,
        fontFamily: 'serif',
      }}
    >
      {/* Left brass accent strip. Anchors the composition and reads as
       *  the brass-dot identity stretched into a vertical edge. */}
      <div
        style={{
          width: 12,
          height: '100%',
          background: OG_PALETTE.accent,
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
        }}
      >
        {/* Top row — wordmark left, canonical-URL hint right. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 500,
                letterSpacing: '-0.022em',
              }}
            >
              thock
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: OG_PALETTE.accent,
                marginBottom: 6,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: 'monospace',
              color: OG_PALETTE.text3,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            thock.xyz
          </div>
        </div>

        {/* Middle — kicker → title → lede. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontFamily: 'monospace',
              color: OG_PALETTE.accent,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {pillarLabel}
          </div>
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.018em',
              color: OG_PALETTE.text,
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: OG_PALETTE.text2,
              fontStyle: 'italic',
              display: 'flex',
            }}
          >
            {lede}
          </div>
        </div>

        {/* Bottom — byline / read time row. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            fontFamily: 'monospace',
            color: OG_PALETTE.text3,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <div>{`by ${author}`}</div>
          <div>{`${readTime} min read`}</div>
        </div>
      </div>
    </div>
  )
}
