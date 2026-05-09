import { VendorSchema, type Vendor } from '../schemas/vendor'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<Vendor[]>('vendors', () => {
  return listEntityFiles('vendors')
    .map((file) => VendorSchema.parse(readJson(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})

export function getAllVendors(): Vendor[] {
  return loadAll()
}

export function getVendorBySlug(slug: string): Vendor | null {
  return getAllVendors().find((v) => v.slug === slug) ?? null
}
