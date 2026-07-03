import { findRepoRoot } from '@thock/data'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

export function articlesDir(): string {
  return resolve(findRepoRoot(), 'apps', 'web', 'src', 'content', 'articles')
}

export function newslettersDir(): string {
  return resolve(
    findRepoRoot(),
    'apps',
    'web',
    'src',
    'content',
    'newsletters',
  )
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

export function listNewsletterFiles(): string[] {
  const dir = newslettersDir()
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .filter((f) => statSync(join(dir, f)).isFile())
    .map((f) => join(dir, f))
    .sort()
}

/**
 * Reads a text file with line endings normalized to LF. A win32
 * checkout with `core.autocrlf=true` yields CRLF on disk; without
 * normalizing here, those `\r` bytes bake into every generated
 * manifest that embeds article/newsletter body text, diverging from
 * the LF-only manifests produced by CI.
 */
export function readUtf8(file: string): string {
  return readFileSync(file, 'utf-8').replace(/\r\n/g, '\n')
}

export function fileBaseName(file: string): string {
  return file
    .split(/[\\/]/)
    .at(-1)!
    .replace(/\.mdx$/, '')
}

/**
 * Repo-relative, posix-separated form of an absolute file path.
 * Generated manifests embed `filePath` for provenance; the raw
 * absolute path varies by machine (build user, drive letter,
 * `\` vs `/`), which turns every manifest regeneration into
 * machine-specific diff churn. Repo-relative + posix is stable
 * across CI and any contributor's checkout.
 */
export function toRepoRelativePosix(file: string): string {
  return relative(findRepoRoot(), file).split(sep).join('/')
}
