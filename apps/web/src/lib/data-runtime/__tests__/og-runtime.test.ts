import { describe, expect, it } from 'vitest'
import {
  getArticleForOg,
  getTagForOg,
  getPartForOg,
  getVendorForOg,
} from '../og-runtime'

describe('og-runtime adapter', () => {
  it('looks up an article by slug', () => {
    const article = getArticleForOg('custom-keyboard-kit-buyers-guide')
    expect(article).not.toBeNull()
    expect(article!.slug).toBe('custom-keyboard-kit-buyers-guide')
    expect(article!.frontmatter.title).toBeTruthy()
    expect(article!.frontmatter.pillar).toBeTruthy()
  })

  it('returns null for an unknown article slug', () => {
    expect(getArticleForOg('this-does-not-exist')).toBeNull()
  })

  it('looks up a tag by slug', () => {
    const tag = getTagForOg('65')
    expect(tag).not.toBeNull()
    expect(tag!.slug).toBe('65')
    expect(tag!.name).toBeTruthy()
  })

  it('returns null for an unknown tag slug', () => {
    expect(getTagForOg('this-tag-does-not-exist')).toBeNull()
  })

  it('looks up a part by kind + slug', () => {
    const part = getPartForOg('switch', 'akko-v3-cream-blue-pro')
    expect(part).not.toBeNull()
    expect(part!.slug).toBe('akko-v3-cream-blue-pro')
    expect(part!.kind).toBe('switch')
  })

  it('returns null when the kind does not match the slug', () => {
    expect(getPartForOg('board', 'akko-v3-cream-blue-pro')).toBeNull()
  })

  it('returns null for an unknown part slug', () => {
    expect(getPartForOg('switch', 'this-switch-does-not-exist')).toBeNull()
  })

  it('looks up a vendor by slug', () => {
    const vendor = getVendorForOg('cannonkeys')
    expect(vendor).not.toBeNull()
    expect(vendor!.slug).toBe('cannonkeys')
    expect(vendor!.name).toBeTruthy()
  })

  it('returns null for an unknown vendor slug', () => {
    expect(getVendorForOg('this-vendor-does-not-exist')).toBeNull()
  })
})
