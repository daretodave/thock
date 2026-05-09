export { siteConfig, type SiteConfig } from './siteConfig'
export { canonicalUrl } from './canonicalUrl'
export { buildMetadata, type BuildMetadataInput } from './buildMetadata'
export {
  buildWebSiteJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  type WebSiteLd,
  type ArticleLd,
  type BreadcrumbListLd,
  type CollectionPageLd,
  type BuildArticleJsonLdInput,
  type BreadcrumbInput,
  type BuildCollectionPageJsonLdInput,
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
