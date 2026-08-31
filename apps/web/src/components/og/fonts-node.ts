import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { OG_FONT_MANIFEST, type OgFont } from './fonts'

/**
 * Font loader for every OG image / icon route (all now Node
 * runtime — see `fonts.ts` for why the manifest lives separately).
 * `new URL(..., import.meta.url)` resolves to a `file:` asset URL on
 * the Node runtime, which Next's patched `fetch` rejects — read it
 * from disk instead.
 */
async function loadFont(url: URL): Promise<ArrayBuffer> {
  const buf = await readFile(fileURLToPath(url))
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

let cached: Promise<OgFont[]> | undefined

export function getOgFonts(): Promise<OgFont[]> {
  if (!cached) {
    cached = Promise.all([
      loadFont(new URL('./fonts/newsreader-400-normal.woff', import.meta.url)),
      loadFont(new URL('./fonts/newsreader-400-italic.woff', import.meta.url)),
      loadFont(new URL('./fonts/jetbrains-mono-400-normal.woff', import.meta.url)),
    ]).then((data) => OG_FONT_MANIFEST.map((entry, i) => ({ ...entry, data: data[i]! })))
    cached.catch(() => {
      cached = undefined
    })
  }
  return cached
}
