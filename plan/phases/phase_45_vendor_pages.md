# Phase 45 — Vendor index + detail `/vendors` + `/vendor/[slug]`

> Score 5.5 · pass-124 candidate · 8 vendors in catalog · loaders exist

## Outcome

Ship a vendor browse surface — `/vendors` lists all 8 vendors; `/vendor/[slug]` shows each vendor's full description, URL, active and past group buys, and boards in the thock catalog from that vendor.

## Why

Vendors are already a first-class entity in `/data` with typed loaders, yet the site has no vendor-facing surface. Every group-buy card already names the vendor, and every board record includes `vendorSlug`, but there is no link that takes a reader from "CannonKeys" to a page about CannonKeys. This closes the discovery gap: vendor → group buys → boards → articles.

## URL contract

```
/vendors                       Vendor index (all vendors)
/vendor/[slug]                 Vendor detail (one vendor)
```

## Scope

### `/vendors` index

- `getAllVendors()` sorted alphabetically by name (active first, then inactive).
- Each row: vendor name (h2), countryCode chip, description truncated to ~120 chars, external URL link (`rel="noopener noreferrer"`).
- CollectionPage + BreadcrumbList (Home → Vendors) + ItemList JSON-LD.
- Sitemap entry at priority 0.6.

### `/vendor/[slug]` detail

- `generateStaticParams` from `getAllVendors()`.
- `generateMetadata` using vendor name + description.
- Page sections:
  1. **Hero** — eyebrow "vendor", H1 = vendor name, countryCode badge, external URL button.
  2. **About** — full description prose.
  3. **Active group buys** — `getGroupBuysByVendor(slug)` filtered to status live/announced, rendered as `<GroupBuyRow variant="live|announced">`. Empty state: `"No active group buys from {name} right now."`.
  4. **Past group buys** — closed/shipped, rendered as `<GroupBuyRow variant="ended">`. Empty state: `"No past group buys recorded for {name}."`.
  5. **Boards** — `getBoardsByVendor(slug)`, a compact card list. Empty: `"No boards from {name} in the catalog yet."`.
  6. **Back link** → `/vendors`.
- Organization JSON-LD with `sameAs: vendor.url`.
- Sitemap entries per vendor slug at priority 0.6.

### Data-runtime helpers

Add two loaders to `apps/web/src/lib/data-runtime/index.ts`:
- `getGroupBuysByVendor(vendorSlug: string): GroupBuy[]` — all group buys for a vendor, sorted by `endDate` desc.
- `getBoardsByVendor(vendorSlug: string): Board[]` — all boards for a vendor, sorted alphabetically by name.

### Fixtures + e2e

- `canonical-urls.ts`: add `/vendors` static entry + `listVendorSlugs` dynamic entries for `/vendor/[slug]`.
- `page-reads.ts`: entries for `/vendors` and `/vendor/[slug]`.
- `apps/e2e/tests/vendors.spec.ts`: 6 tests — index H1/count/JSON-LD, detail H1/JSON-LD/back-link, at least one vendor with group-buy rows.
- `apps/e2e/tests/mobile/vendors.mobile.spec.ts`: 2 mobile tests — index + one detail page at 375px.

### Cross-link

- On `/group-buys`: small "Browse vendors →" link under the page header pointing to `/vendors`.
- On `/parts`: add "Vendors →" affordance next to the existing back link area.

## No schema change

No Zod schema change needed — `VendorSchema` is already complete and all required loaders exist in `@thock/data`.

## Components

```
apps/web/src/components/vendor/
├── VendorCard.tsx               # one row on /vendors index
├── VendorDetail.tsx             # hero + about section
├── VendorGroupBuySection.tsx    # active + past group buy rails
├── VendorBoardSection.tsx       # boards compact list
└── __tests__/
    ├── VendorCard.test.tsx
    └── VendorGroupBuySection.test.tsx
```

## Decisions standing

- **Sort on index**: active vendors alphabetically by name. Inactive vendors (if any in future) sorted after active ones.
- **Group buy sort on detail**: endDate desc (most recently closed at top for past; soonest-ending at top for active).
- **Boards sort on detail**: alphabetical by name.
- **Description truncation on index**: 130 chars max, word-safe.
- **`sameAs` on Organization JSON-LD**: vendor.url.
- **No vendor OG image**: falls back to site-default OG.
