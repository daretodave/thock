import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// WCAG 1.4.11 guard: interactive-control borders must hold >= 3:1
// against every background a control can sit on, in both themes.
const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(here, '../src/tokens.css'), 'utf-8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
)

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  const body = css.slice(start, css.indexOf('}', start))
  const out: Record<string, string> = {}
  for (const m of body.matchAll(/(--thock-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]!] = m[2]!.trim()
  }
  return out
}

function luminance(value: string): number {
  const lin = (c: number) => Math.max(0, Math.min(1, c))
  let r: number, g: number, b: number
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1]!, 16)
    const ch = (v: number) => {
      const s = v / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    r = ch((n >> 16) & 255)
    g = ch((n >> 8) & 255)
    b = ch(n & 255)
  } else {
    const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
    if (!m) throw new Error(`unparseable color: ${value}`)
    const [L, C, h] = [Number(m[1]), Number(m[2]), Number(m[3])]
    const A = C * Math.cos((h * Math.PI) / 180)
    const B = C * Math.sin((h * Math.PI) / 180)
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
    const mm = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
    r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

const dark = block(':root')
const light = { ...dark, ...block('.thock-light') }
const BACKGROUNDS = ['--thock-bg', '--thock-bg-2', '--thock-surface', '--thock-surface-hi']

describe('--thock-border-control contrast (WCAG 1.4.11)', () => {
  for (const [theme, vars] of [
    ['dark', dark],
    ['light', light],
  ] as const) {
    for (const bg of BACKGROUNDS) {
      it(`${theme}: >= 3:1 against ${bg}`, () => {
        expect(contrast(vars['--thock-border-control']!, vars[bg]!)).toBeGreaterThanOrEqual(3)
      })
    }
  }
})
