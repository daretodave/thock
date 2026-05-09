import { findRepoRoot } from '@thock/data'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

export function articlesDir(): string {
  return resolve(findRepoRoot(), 'apps', 'web', 'src', 'content', 'articles')
}

export function tagsFile(): string {
  return resolve(findRepoRoot(), 'apps', 'web', 'src', 'content', 'tags.json')
}

export function listArticleFiles(): string[] {
  const dir = articlesDir()
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .filter((f) => statSync(join(dir, f)).isFile())
    .map((f) => join(dir, f))
    .sort()
}

export function readUtf8(file: string): string {
  return readFileSync(file, 'utf-8')
}

export function fileBaseName(file: string): string {
  return file
    .split(/[\\/]/)
    .at(-1)!
    .replace(/\.mdx$/, '')
}
