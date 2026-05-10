import type { Board } from '../schemas/board'
import type { GroupBuy } from '../schemas/group-buy'
import type { KeycapSet } from '../schemas/keycap-set'
import type { Switch } from '../schemas/switch'
import type { Vendor } from '../schemas/vendor'
import type { TrendSnapshot } from '../schemas/trend'

export type RecordSet = {
  vendors: Vendor[]
  switches: Switch[]
  keycapSets: KeycapSet[]
  boards: Board[]
  groupBuys: GroupBuy[]
  trends: TrendSnapshot[]
}

export type CrossRefError = {
  kind: keyof RecordSet
  slug: string
  field: string
  message: string
}

export function checkCrossRefs(records: RecordSet): CrossRefError[] {
  const errors: CrossRefError[] = []
  const vendorSlugs = new Set(records.vendors.map((v) => v.slug))
  const boardSlugs = new Set(records.boards.map((b) => b.slug))
  const keycapSlugs = new Set(records.keycapSets.map((k) => k.slug))
  const switchSlugs = new Set(records.switches.map((s) => s.slug))

  const checkVendor = (
    kind: keyof RecordSet,
    slug: string,
    field: string,
    vendorSlug: string,
  ) => {
    if (!vendorSlugs.has(vendorSlug)) {
      errors.push({
        kind,
        slug,
        field,
        message: `vendor "${vendorSlug}" referenced but not found in /data/vendors/`,
      })
    }
  }

  for (const sw of records.switches) checkVendor('switches', sw.slug, 'vendorSlug', sw.vendorSlug)
  for (const kc of records.keycapSets)
    checkVendor('keycapSets', kc.slug, 'vendorSlug', kc.vendorSlug)
  for (const bd of records.boards) checkVendor('boards', bd.slug, 'vendorSlug', bd.vendorSlug)
  for (const gb of records.groupBuys) {
    checkVendor('groupBuys', gb.slug, 'vendorSlug', gb.vendorSlug)
    if (gb.productKind === 'other') {
      if (gb.productSlug !== null) {
        errors.push({
          kind: 'groupBuys',
          slug: gb.slug,
          field: 'productSlug',
          message: "productSlug must be null when productKind is 'other'",
        })
      }
      continue
    }
    if (gb.productSlug === null) continue
    const pool =
      gb.productKind === 'board'
        ? boardSlugs
        : gb.productKind === 'keycap-set'
          ? keycapSlugs
          : switchSlugs
    if (!pool.has(gb.productSlug)) {
      errors.push({
        kind: 'groupBuys',
        slug: gb.slug,
        field: 'productSlug',
        message: `${gb.productKind} "${gb.productSlug}" referenced but not found`,
      })
    }
  }

  return errors
}
