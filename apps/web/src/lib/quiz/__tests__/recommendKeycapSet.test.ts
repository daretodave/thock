import { describe, expect, it } from 'vitest'
import type { KeycapSet } from '@thock/data'
import { recommendKeycapSet, type KeycapSetQuizAnswers } from '../recommendKeycapSet'

function makeSet(overrides: Partial<KeycapSet> & { slug: string }): KeycapSet {
  return {
    name: overrides.slug,
    vendorSlug: 'test-vendor',
    profile: 'cherry',
    material: 'abs',
    legendType: 'doubleshot',
    designer: null,
    releasedAt: null,
    status: 'in-stock',
    imageUrl: null,
    description: 'A test keycap set with adequate length for the schema validator.',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const CHERRY_ABS = makeSet({ slug: 'cherry-abs', profile: 'cherry', material: 'abs', legendType: 'doubleshot', status: 'in-stock' })
const PBT_KAT = makeSet({ slug: 'pbt-kat', profile: 'kat', material: 'pbt', legendType: 'dye-sub', status: 'group-buy' })
const SA_DISCONTINUED = makeSet({ slug: 'sa-gone', profile: 'sa', material: 'abs', legendType: 'doubleshot', status: 'discontinued' })
const MT3_INSTOCK = makeSet({ slug: 'mt3-in', profile: 'mt3', material: 'abs', legendType: 'doubleshot', status: 'in-stock' })
const PBT_CHERRY = makeSet({ slug: 'pbt-cherry', profile: 'cherry', material: 'pbt', legendType: 'doubleshot', status: 'sold-out' })

const CATALOG = [CHERRY_ABS, PBT_KAT, SA_DISCONTINUED, MT3_INSTOCK, PBT_CHERRY]

describe('recommendKeycapSet', () => {
  it('A: prefers cherry profile for uniform preference', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'uniform',
      materialPref: 'no-pref',
      legendPref: 'no-pref',
      availabilityPref: 'no-pref',
    }
    const results = recommendKeycapSet(answers, CATALOG)
    expect(results[0]?.keycapSet.profile).toBe('cherry')
  })

  it('B: prefers SA profile for spherical-tall preference', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'spherical-tall',
      materialPref: 'no-pref',
      legendPref: 'no-pref',
      availabilityPref: 'no-pref',
    }
    const results = recommendKeycapSet(answers, CATALOG)
    expect(results[0]?.keycapSet.profile).toBe('sa')
  })

  it('C: prefers MT3 profile for cylindrical-tall preference', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'cylindrical-tall',
      materialPref: 'no-pref',
      legendPref: 'no-pref',
      availabilityPref: 'no-pref',
    }
    const results = recommendKeycapSet(answers, CATALOG)
    expect(results[0]?.keycapSet.profile).toBe('mt3')
  })

  it('D: prefers PBT material when pbt is selected', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'no-pref',
      materialPref: 'pbt',
      legendPref: 'no-pref',
      availabilityPref: 'no-pref',
    }
    const results = recommendKeycapSet(answers, CATALOG)
    const topMaterial = results[0]?.keycapSet.material
    expect(topMaterial).toBe('pbt')
  })

  it('E: prefers in-stock for "now" availability', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'no-pref',
      materialPref: 'no-pref',
      legendPref: 'no-pref',
      availabilityPref: 'now',
    }
    const results = recommendKeycapSet(answers, CATALOG)
    expect(results[0]?.keycapSet.status).toBe('in-stock')
  })

  it('F: returns empty array for empty catalog', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'no-pref',
      materialPref: 'abs',
      legendPref: 'doubleshot',
      availabilityPref: 'now',
    }
    expect(recommendKeycapSet(answers, [])).toEqual([])
  })

  it('G: returns at most 3 results even with a large catalog', () => {
    const big = Array.from({ length: 10 }, (_, i) =>
      makeSet({ slug: `set-${i}`, profile: 'cherry' }),
    )
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'uniform',
      materialPref: 'abs',
      legendPref: 'doubleshot',
      availabilityPref: 'now',
    }
    expect(recommendKeycapSet(answers, big).length).toBeLessThanOrEqual(3)
  })
})
