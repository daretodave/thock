import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { tokens } from '../src/index'

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(here, '../src/tokens.css')
const css = readFileSync(cssPath, 'utf-8')

const declared = new Set<string>()
for (const match of css.matchAll(/(--thock-[a-z0-9-]+)\s*:/g)) {
  declared.add(match[1]!)
}

const referenced = new Set<string>()
const collectVars = (obj: Record<string, string>) => {
  for (const v of Object.values(obj)) {
    for (const match of v.matchAll(/var\((--thock-[a-z0-9-]+)\)/g)) {
      referenced.add(match[1]!)
    }
  }
}
collectVars(tokens.colors)
collectVars(tokens.fonts)
collectVars(tokens.space)
collectVars(tokens.radii)
collectVars(tokens.fontSizes)

describe('@thock/tokens', () => {
  it('every TS-referenced variable is declared in tokens.css', () => {
    const missing = [...referenced].filter((name) => !declared.has(name))
    expect(missing).toEqual([])
  })

  it('declares all expected token groups', () => {
    expect(Object.keys(tokens.colors).length).toBeGreaterThan(15)
    expect(Object.keys(tokens.fonts)).toEqual(['serif', 'sans', 'mono'])
    expect(Object.keys(tokens.space).length).toBe(9)
    expect(tokens.radii.pill).toBe('var(--thock-r-pill)')
  })

  it('renames every --kh-* legacy variable to --thock-*', () => {
    // Only inspect CSS code, not the comment header that mentions the rename.
    const code = css.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(code).not.toMatch(/--kh-[a-z0-9-]+\s*:/)
    expect(code).not.toMatch(/var\(--kh-/)
  })
})
