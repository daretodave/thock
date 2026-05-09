import { describe, expect, it } from 'vitest'
import { canonicalUrl } from '../canonicalUrl'
import { siteConfig } from '../siteConfig'

describe('canonicalUrl', () => {
  it('returns the bare site url for "/"', () => {
    expect(canonicalUrl('/')).toBe(siteConfig.url)
  })

  it('appends a path without trailing slash', () => {
    expect(canonicalUrl('/article/foo')).toBe(`${siteConfig.url}/article/foo`)
  })

  it('strips trailing slashes from the path', () => {
    expect(canonicalUrl('/news/')).toBe(`${siteConfig.url}/news`)
  })

  it('strips multiple trailing slashes from the path', () => {
    expect(canonicalUrl('/news///')).toBe(`${siteConfig.url}/news`)
  })

  it('preserves nested paths', () => {
    expect(canonicalUrl('/trends/tracker')).toBe(
      `${siteConfig.url}/trends/tracker`,
    )
  })

  it('throws when path does not start with /', () => {
    expect(() => canonicalUrl('news')).toThrow(/must start with/)
  })

  it('throws when path is not a string', () => {
    // @ts-expect-error — testing runtime guard
    expect(() => canonicalUrl(undefined)).toThrow(/must start with/)
  })
})
