import { describe, expect, it } from 'vitest'
import type { Switch } from '@thock/data'
import { recommendSwitch, type QuizAnswers } from '../recommendSwitch'

function makeSwitch(overrides: Partial<Switch> & { slug: string }): Switch {
  return {
    name: overrides.slug,
    vendorSlug: 'test-vendor',
    type: 'linear',
    housingTop: 'nylon',
    housingBottom: 'nylon',
    stem: 'pom',
    springGrams: { actuation: 50, bottomOut: 65 },
    travelMm: 4.0,
    factoryLubed: true,
    releasedAt: null,
    status: 'in-production',
    description: 'A test switch with adequate length for the schema validator.',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const TACTILE_HEAVY = makeSwitch({ slug: 'tactile-heavy', type: 'tactile', springGrams: { actuation: 62, bottomOut: 70 } })
const LINEAR_LIGHT = makeSwitch({ slug: 'linear-light', type: 'linear', springGrams: { actuation: 40, bottomOut: 55 } })
const SILENT_LINEAR = makeSwitch({ slug: 'silent-one', type: 'silent-linear', springGrams: { actuation: 45, bottomOut: 60 } })
const LINEAR_MED = makeSwitch({ slug: 'linear-med', type: 'linear', springGrams: { actuation: 50, bottomOut: 65 } })

const CATALOG = [TACTILE_HEAVY, LINEAR_LIGHT, SILENT_LINEAR, LINEAR_MED]

describe('recommendSwitch', () => {
  it('A: returns tactile switch when heavy tactile answers given', () => {
    const answers: QuizAnswers = {
      soundProfile: 'neutral',
      actuationFeel: 'tactile',
      springWeight: 'heavy',
      primaryUse: 'typing',
    }
    const results = recommendSwitch(answers, CATALOG)
    expect(results[0]?.switch.type).toBe('tactile')
  })

  it('B: returns silent-linear first for silent + office answers', () => {
    const answers: QuizAnswers = {
      soundProfile: 'silent',
      actuationFeel: 'smooth',
      springWeight: 'light',
      primaryUse: 'office',
    }
    const results = recommendSwitch(answers, CATALOG)
    expect(results[0]?.switch.type).toBe('silent-linear')
  })

  it('C: returns light linear for gaming + smooth + light answers', () => {
    const answers: QuizAnswers = {
      soundProfile: 'neutral',
      actuationFeel: 'smooth',
      springWeight: 'light',
      primaryUse: 'gaming',
    }
    const results = recommendSwitch(answers, CATALOG)
    const top = results[0]
    expect(top?.switch.type).toMatch(/^(linear|silent-linear)/)
    expect((top?.switch.springGrams.actuation ?? 999)).toBeLessThanOrEqual(50)
  })

  it('D: returns empty array for empty catalog', () => {
    const answers: QuizAnswers = {
      soundProfile: 'neutral',
      actuationFeel: 'smooth',
      springWeight: 'medium',
      primaryUse: 'typing',
    }
    expect(recommendSwitch(answers, [])).toEqual([])
  })

  it('E: returns at most 3 results even with 8 switches', () => {
    const catalog = Array.from({ length: 8 }, (_, i) =>
      makeSwitch({ slug: `sw-${i}`, springGrams: { actuation: 45 + i * 2, bottomOut: 60 + i * 2 } }),
    )
    const answers: QuizAnswers = {
      soundProfile: 'neutral',
      actuationFeel: 'smooth',
      springWeight: 'medium',
      primaryUse: 'gaming',
    }
    const results = recommendSwitch(answers, catalog)
    expect(results.length).toBeLessThanOrEqual(3)
  })
})
