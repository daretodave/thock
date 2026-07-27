import type { MetadataRoute } from 'next'
import { OG_PALETTE } from '@/components/og/palette'
import { siteConfig } from '@thock/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: OG_PALETTE.bg,
    theme_color: OG_PALETTE.bg,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
