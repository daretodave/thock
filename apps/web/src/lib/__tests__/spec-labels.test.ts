import { describe, expect, it } from 'vitest'
import {
  BOARD_LAYOUT_LABEL,
  CASE_MATERIAL_LABEL,
  HOUSING_MATERIAL_LABEL,
  KEYCAP_MATERIAL_LABEL,
  KEYCAP_PROFILE_LABEL,
  LEGEND_TYPE_LABEL,
  MOUNT_STYLE_LABEL,
  specLabel,
  STEM_MATERIAL_LABEL,
  SWITCH_TYPE_LABEL,
} from '../spec-labels'

describe('specLabel', () => {
  it('resolves a known value from the given map', () => {
    expect(specLabel(HOUSING_MATERIAL_LABEL, 'pc')).toBe('PC')
  })

  it('falls back to the raw value when unmapped', () => {
    expect(specLabel(HOUSING_MATERIAL_LABEL, 'carbon-fiber')).toBe('carbon-fiber')
  })
})

describe('label maps', () => {
  it('resolves every board layout enum value to a non-raw label', () => {
    expect(BOARD_LAYOUT_LABEL['60']).toBe('60%')
    expect(BOARD_LAYOUT_LABEL.tkl).toBe('TKL')
  })

  it('resolves case material acronyms', () => {
    expect(CASE_MATERIAL_LABEL.fr4).toBe('FR4')
  })

  it('resolves mount style to spaced, capitalized labels', () => {
    expect(MOUNT_STYLE_LABEL['top-mount']).toBe('Top mount')
    expect(MOUNT_STYLE_LABEL['pcb-mount']).toBe('PCB mount')
  })

  it('resolves switch type and housing/stem materials', () => {
    expect(SWITCH_TYPE_LABEL['silent-linear']).toBe('Silent linear')
    expect(STEM_MATERIAL_LABEL.pom).toBe('POM')
  })

  it('resolves keycap profile and material acronyms', () => {
    expect(KEYCAP_PROFILE_LABEL.mt3).toBe('MT3')
    expect(KEYCAP_MATERIAL_LABEL.abs).toBe('ABS')
  })

  it('resolves legend type', () => {
    expect(LEGEND_TYPE_LABEL['dye-sub']).toBe('Dye-sub')
  })
})
