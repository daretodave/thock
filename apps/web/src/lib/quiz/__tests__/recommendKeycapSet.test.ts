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

  it('H: never surfaces a sold-out/discontinued set for "now" availability, even with a strong competing profile/material/legend match', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'uniform',
      materialPref: 'abs',
      legendPref: 'doubleshot',
      availabilityPref: 'now',
    }
    // SA_DISCONTINUED and PBT_CHERRY don't match profile/material as well as
    // CHERRY_ABS, but a naive additive score can still let an unavailable
    // set outrank an available one when other axes are no-pref; here all
    // axes are engaged and CHERRY_ABS is the only in-stock cherry/abs set.
    const results = recommendKeycapSet(answers, CATALOG)
    for (const r of results) {
      expect(['in-stock', 'group-buy']).toContain(r.keycapSet.status)
    }
  })

  it('I: excludes discontinued sets for "group-buy" availability, even when a discontinued set would otherwise win on profile/material/legend match (a discontinued set cannot reappear in a group buy)', () => {
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'spherical-tall',
      materialPref: 'abs',
      legendPref: 'doubleshot',
      availabilityPref: 'group-buy',
    }
    // SA_DISCONTINUED matches profile/material/legend perfectly (sa + abs +
    // doubleshot) and would out-score every in-stock/group-buy set on the
    // unfiltered sum (33 vs. 31 for the next best) despite being unbuyable.
    const results = recommendKeycapSet(answers, CATALOG)
    expect(results.some((r) => r.keycapSet.slug === 'sa-gone')).toBe(false)
    for (const r of results) {
      expect(r.keycapSet.status).not.toBe('discontinued')
    }
  })

  it('J: falls back to the full catalog when an availability filter would otherwise return zero results', () => {
    const onlyDiscontinued = [SA_DISCONTINUED]
    const answers: KeycapSetQuizAnswers = {
      profilePref: 'no-pref',
      materialPref: 'no-pref',
      legendPref: 'no-pref',
      availabilityPref: 'now',
    }
    const results = recommendKeycapSet(answers, onlyDiscontinued)
    expect(results).toHaveLength(1)
    expect(results[0]?.keycapSet.slug).toBe('sa-gone')
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
