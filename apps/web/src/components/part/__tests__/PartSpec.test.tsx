import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PartSpec } from '../PartSpec'
import type { ResolvedPart } from '@/lib/data-runtime'

const FAKE_SWITCH = {
  id: 'switch:gateron-oil-king',
  kind: 'switch',
  slug: 'gateron-oil-king',
  record: {
    slug: 'gateron-oil-king',
    name: 'Gateron Oil King',
    vendorSlug: 'cannonkeys',
    type: 'linear',
    housingTop: 'pc',
    housingBottom: 'nylon',
    stem: 'pom',
    springGrams: { actuation: 55, bottomOut: 67 },
    travelMm: 4,
    factoryLubed: true,
    releasedAt: '2023-09-01',
    status: 'in-production',
  },
} as unknown as ResolvedPart

const FAKE_KEYCAPS = {
  id: 'keycap-set:gmk-bento-r2',
  kind: 'keycap-set',
  slug: 'gmk-bento-r2',
  record: {
    slug: 'gmk-bento-r2',
    name: 'GMK Bentō R2',
    vendorSlug: 'cannonkeys',
    profile: 'cherry',
    material: 'abs',
    legendType: 'doubleshot',
    designer: 'biip',
    releasedAt: '2021-03-01',
    status: 'sold-out',
  },
} as unknown as ResolvedPart

const FAKE_BOARD = {
  id: 'board:bakeneko65',
  kind: 'board',
  slug: 'bakeneko65',
  record: {
    slug: 'bakeneko65',
    name: 'Bakeneko65',
    vendorSlug: 'cannonkeys',
    layout: '65',
    caseMaterial: 'aluminum',
    mountStyle: 'gasket',
    hotswap: true,
    wireless: false,
    releasedAt: '2022-01-08',
    status: 'in-stock',
  },
} as unknown as ResolvedPart

describe('<PartSpec>', () => {
  it('renders switch spec rows including spring + travel', () => {
    render(<PartSpec part={FAKE_SWITCH} />)
    const list = screen.getByTestId('part-spec-list')
    expect(list).toHaveTextContent(/Type/i)
    expect(list).toHaveTextContent(/linear/i)
    expect(list).toHaveTextContent(/55g actuation/i)
    expect(list).toHaveTextContent(/67g bottom-out/i)
    expect(list).toHaveTextContent(/4 mm/i)
    expect(list).toHaveTextContent(/Factory lubed/i)
    expect(list).toHaveTextContent(/yes/i)
  })

  it('renders keycap-set spec rows including profile + designer', () => {
    render(<PartSpec part={FAKE_KEYCAPS} />)
    const list = screen.getByTestId('part-spec-list')
    expect(list).toHaveTextContent(/Profile/i)
    expect(list).toHaveTextContent(/cherry/i)
    expect(list).toHaveTextContent(/Designer/i)
    expect(list).toHaveTextContent(/biip/i)
    expect(list).toHaveTextContent(/doubleshot/i)
  })

  it('renders board spec rows including mount + hotswap', () => {
    render(<PartSpec part={FAKE_BOARD} />)
    const list = screen.getByTestId('part-spec-list')
    expect(list).toHaveTextContent(/Layout/i)
    expect(list).toHaveTextContent(/65/i)
    expect(list).toHaveTextContent(/Mount style/i)
    expect(list).toHaveTextContent(/gasket/i)
    expect(list).toHaveTextContent(/Hotswap/i)
    expect(list).toHaveTextContent(/Wireless/i)
    expect(list).toHaveTextContent(/no/i)
  })

  it('formats releasedAt via Intl medium-format UTC', () => {
    render(<PartSpec part={FAKE_BOARD} />)
    expect(screen.getByTestId('part-spec-list')).toHaveTextContent(
      /Jan 8, 2022/i,
    )
  })
})
