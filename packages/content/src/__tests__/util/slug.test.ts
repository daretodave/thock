import { describe, expect, it } from 'vitest'
import { slugFromFile } from '../../util/slug'

describe('slugFromFile', () => {
  it('strips .mdx extension from a bare filename', () => {
    expect(slugFromFile('article.mdx')).toBe('article')
  })

  it('takes the last segment on a forward-slash path', () => {
    expect(slugFromFile('content/articles/my-article.mdx')).toBe('my-article')
  })

  it('takes the last segment on a backslash path (Windows)', () => {
    expect(slugFromFile('content\\articles\\my-article.mdx')).toBe('my-article')
  })

  it('takes the last segment on a mixed-separator path', () => {
    expect(slugFromFile('content/sub\\my-article.mdx')).toBe('my-article')
  })

  it('does not strip non-.mdx extensions', () => {
    expect(slugFromFile('article.json')).toBe('article.json')
  })

  it('leaves a filename without extension unchanged', () => {
    expect(slugFromFile('article')).toBe('article')
  })
})
