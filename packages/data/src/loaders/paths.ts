import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

let cachedRoot: string | null = null

/**
 * Walk up from this module looking for the workspace root marker
 * (`pnpm-workspace.yaml`). Cached after first resolution. Tests can
 * override via `setRepoRootForTests`.
 */
export function findRepoRoot(): string {
  if (cachedRoot) return cachedRoot
  let dir = here
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      cachedRoot = dir
      return dir
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `@thock/data: could not find pnpm-workspace.yaml walking up from ${here}`,
  )
}

export function setRepoRootForTests(root: string | null): void {
  cachedRoot = root
}

export function dataDir(): string {
  return resolve(findRepoRoot(), 'data')
}

export function entityDir(entity: string): string {
  return resolve(dataDir(), entity)
}

/** Lists `*.json` files in `entityDir(entity)` (non-recursive — archive/ skipped). */
export function listEntityFiles(entity: string): string[] {
  const dir = entityDir(entity)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => {
      if (!f.endsWith('.json')) return false
      const full = join(dir, f)
      return statSync(full).isFile()
    })
    .map((f) => join(dir, f))
    .sort()
}

export function readJson<T = unknown>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf-8')) as T
}

export function fileBaseName(file: string): string {
  return file
    .split(/[\\/]/)
    .at(-1)!
    .replace(/\.json$/, '')
}
