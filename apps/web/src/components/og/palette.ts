/**
 * OG palette — hex equivalents of the @thock/tokens oklch design
 * palette.
 *
 * Why this file exists: `next/og` (Satori) does NOT support the
 * `oklch()` CSS color function. Earlier versions of the home and
 * pillar OG cards were authored in oklch, which Satori parsed as
 * "Unexpected token type: function" and silently produced a 0-byte
 * PNG body. Vercel cached those 0-byte responses with a 1-year
 * immutable cache, which is why every OG-image route on the live
 * site returned `Content-Type: image/png` with `Content-Length: 0`
 * — and why the share previews for the home and every article
 * read as missing.
 *
 * The values below are sRGB conversions of the canonical
 * tokens.css oklch palette via the standard oklab → linear sRGB
 * matrix. Keep `packages/tokens/src/tokens.css` as the source of
 * truth for in-browser color; mirror any palette change here when
 * an OG template needs the same token. Comments tag each entry
 * with the original oklch coordinates for traceability.
 */

export const OG_PALETTE = {
  /** Page bg — deep cool charcoal. oklch(0.175 0.006 250). */
  bg: '#0f1113',
  /** Card surface — used as the radial-gradient inner stop. oklch(0.235 0.006 250). */
  surface: '#1c1e21',
  /** Divider tone for inline punctuation. oklch(0.42 0.007 250). */
  divider: '#4a4d51',
  /** Tertiary text — eyebrow / micro-caps captions. oklch(0.58 0.006 90). */
  text3: '#7c7a76',
  /** Secondary text — lede / supporting copy. oklch(0.78 0.005 90). */
  text2: '#b8b7b4',
  /** Primary text — warm bone. oklch(0.965 0.005 90). */
  text: '#f5f3f0',
  /** Single restrained accent — warm brass / aged bronze. oklch(0.80 0.135 75). */
  accent: '#f0b04f',
} as const

/**
 * Radial gradient used by every OG card. Same direction + stops
 * across home, pillar, and article so the family reads as one.
 */
export const OG_BACKGROUND = `radial-gradient(ellipse at top left, ${OG_PALETTE.surface} 0%, ${OG_PALETTE.bg} 70%)`
