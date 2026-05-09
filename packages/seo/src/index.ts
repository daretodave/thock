export { siteConfig, type SiteConfig } from './siteConfig'
export { canonicalUrl } from './canonicalUrl'
export { buildMetadata, type BuildMetadataInput } from './buildMetadata'
export {
  buildWebSiteJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  type WebSiteLd,
  type ArticleLd,
  type BreadcrumbListLd,
  type CollectionPageLd,
  type ItemListLd,
  type BuildArticleJsonLdInput,
  type BreadcrumbInput,
  type BuildCollectionPageJsonLdInput,
  type BuildItemListJsonLdInput,
  type ItemListEntry,
} from './buildJsonLd'
export { JsonLd } from './JsonLd'
export {
  PILLARS,
  pillarMeta,
  pillarLabel,
  pillarHref,
  isPillar,
  type Pillar,
  type PillarMeta,
} from './pillars'
