import { describe, expect, it } from 'vitest'
import {
  articlesDir,
  fileBaseName,
  listArticleFiles,
  listNewsletterFiles,
  tagsFile,
} from '../../loaders/paths'

describe('fileBaseName', () => {
  it('strips .mdx from a flat filename', () => {
    expect(fileBaseName('gateron-oil-king-deep-dive.mdx')).toBe(
      'gateron-oil-king-deep-dive',
    )
  })

  it('strips .mdx from an absolute path', () => {
    expect(fileBaseName('/content/articles/pe-foam-mod.mdx')).toBe(
      'pe-foam-mod',
    )
  })

  it('handles Windows-style backslash paths', () => {
    expect(fileBaseName('content\\articles\\pe-foam-mod.mdx')).toBe(
      'pe-foam-mod',
    )
  })

  it('only strips the trailing .mdx extension', () => {
    expect(fileBaseName('my.mdx.file.mdx')).toBe('my.mdx.file')
  })
})

describe('listArticleFiles', () => {
  it('returns sorted .mdx file paths from the articles directory', () => {
    const files = listArticleFiles()
    expect(files.length).toBeGreaterThanOrEqual(1)
    expect(files.every((f) => f.endsWith('.mdx'))).toBe(true)
    const sorted = [...files].sort()
    expect(files).toEqual(sorted)
  })

  it('includes the seed article slug', () => {
    const slugs = listArticleFiles().map((f) => fileBaseName(f))
    expect(slugs).toContain('gateron-oil-king-deep-dive')
  })
})

describe('listNewsletterFiles', () => {
  it('returns an array of zero or more sorted .mdx file paths', () => {
    const files = listNewsletterFiles()
    expect(Array.isArray(files)).toBe(true)
    if (files.length > 0) {
      expect(files.every((f) => f.endsWith('.mdx'))).toBe(true)
      const sorted = [...files].sort()
      expect(files).toEqual(sorted)
    }
  })
})

describe('articlesDir and tagsFile', () => {
  it('articlesDir() ends with the expected path suffix', () => {
    expect(articlesDir()).toMatch(
      /apps[/\\]web[/\\]src[/\\]content[/\\]articles$/,
    )
  })

  it('tagsFile() ends with tags.json', () => {
    expect(tagsFile()).toMatch(/tags\.json$/)
  })
})
