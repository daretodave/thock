export const SWITCH_TYPE_LABEL: Record<string, string> = {
  linear: 'Linear',
  tactile: 'Tactile',
  clicky: 'Clicky',
  'silent-linear': 'Silent linear',
  'silent-tactile': 'Silent tactile',
}

export const HOUSING_MATERIAL_LABEL: Record<string, string> = {
  pc: 'PC',
  pom: 'POM',
  nylon: 'Nylon',
  pa66: 'PA66',
  lcp: 'LCP',
  mixed: 'Mixed',
  unknown: 'Unknown',
}

export const STEM_MATERIAL_LABEL: Record<string, string> = {
  pom: 'POM',
  pc: 'PC',
  lcp: 'LCP',
  mixed: 'Mixed',
  unknown: 'Unknown',
}

export const KEYCAP_PROFILE_LABEL: Record<string, string> = {
  cherry: 'Cherry',
  oem: 'OEM',
  mt3: 'MT3',
  sa: 'SA',
  kat: 'KAT',
  kam: 'KAM',
  xda: 'XDA',
  dsa: 'DSA',
}

export const KEYCAP_MATERIAL_LABEL: Record<string, string> = {
  abs: 'ABS',
  pbt: 'PBT',
  resin: 'Resin',
  mixed: 'Mixed',
}

export const LEGEND_TYPE_LABEL: Record<string, string> = {
  doubleshot: 'Doubleshot',
  'dye-sub': 'Dye-sub',
  'pad-printed': 'Pad-printed',
  engraved: 'Engraved',
  blank: 'Blank',
}

export const BOARD_LAYOUT_LABEL: Record<string, string> = {
  tkl: 'TKL',
  '60': '60%',
  '65': '65%',
  '75': '75%',
  full: 'Full',
  alice: 'Alice',
  split: 'Split',
  ortho: 'Ortho',
  other: 'Other',
}

export const CASE_MATERIAL_LABEL: Record<string, string> = {
  aluminum: 'Aluminum',
  polycarbonate: 'Polycarbonate',
  wood: 'Wood',
  fr4: 'FR4',
  plastic: 'Plastic',
  mixed: 'Mixed',
}

export const MOUNT_STYLE_LABEL: Record<string, string> = {
  gasket: 'Gasket',
  'top-mount': 'Top mount',
  'tray-mount': 'Tray mount',
  'integrated-plate': 'Integrated plate',
  'leaf-spring': 'Leaf spring',
  'pcb-mount': 'PCB mount',
}

export function specLabel(map: Record<string, string>, value: string): string {
  return map[value] ?? value
}
