export type OgFontStyle = 'normal' | 'italic'
export type OgFontWeight = 400

export type OgFontManifestEntry = {
  filename: string
  name: 'serif' | 'monospace'
  weight: OgFontWeight
  style: OgFontStyle
}

/**
 * Real font binaries for Satori's renderer. Without this, `next/og`'s
 * `ImageResponse` silently falls back to a single bundled Noto Sans
 * Regular for every request — every `fontFamily: 'serif'`,
 * `fontFamily: 'monospace'`, and `fontStyle: 'italic'` declared across
 * `PillarOG.tsx`/`ArticleOG.tsx` was a no-op. One weight per family —
 * a 5-file set (adding dedicated 500-weight serif variants) tipped
 * several OG edge functions over Vercel's 1 MB bundle limit; Satori
 * maps any requested `fontWeight` to the nearest available file, so
 * the 500-weight wordmark/title spans still render in serif, just
 * without a distinct medium weight.
 *
 * Order must match the literal `fetch(new URL(...))` calls in
 * `getOgFonts` below — webpack's `import.meta.url` asset resolution
 * only works with statically-analyzable literal paths, so the file
 * list can't be driven by this manifest at runtime; it's zipped back
 * together by index instead.
 */
export const OG_FONT_MANIFEST: OgFontManifestEntry[] = [
  { filename: 'newsreader-400-normal.woff', name: 'serif', weight: 400, style: 'normal' },
  { filename: 'newsreader-400-italic.woff', name: 'serif', weight: 400, style: 'italic' },
  { filename: 'jetbrains-mono-400-normal.woff', name: 'monospace', weight: 400, style: 'normal' },
]

type OgFont = OgFontManifestEntry & { data: ArrayBuffer }

function loadFont(url: URL): Promise<ArrayBuffer> {
  return fetch(url).then((res) => res.arrayBuffer())
}

let cached: Promise<OgFont[]> | undefined

export function getOgFonts(): Promise<OgFont[]> {
  if (!cached) {
    cached = Promise.all([
      loadFont(new URL('./fonts/newsreader-400-normal.woff', import.meta.url)),
      loadFont(new URL('./fonts/newsreader-400-italic.woff', import.meta.url)),
      loadFont(new URL('./fonts/jetbrains-mono-400-normal.woff', import.meta.url)),
    ]).then((data) => OG_FONT_MANIFEST.map((entry, i) => ({ ...entry, data: data[i]! })))
  }
  return cached
}
