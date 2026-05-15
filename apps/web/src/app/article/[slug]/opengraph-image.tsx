import { ImageResponse } from 'next/og'
import { pillarLabel, siteConfig } from '@thock/seo'
import { getArticleBySlug } from '@/lib/data-runtime'
import { ArticleOGContent } from '@/components/og/ArticleOG'
import { OG_PALETTE } from '@/components/og/palette'

// Edge runtime — matches the home and pillar OG routes and is the
// supported path for `next/og`'s Satori renderer (the Node.js runtime
// hangs on the JSX render at server start). `generateStaticParams`
// is incompatible with edge runtime, so the OG image is generated on
// first request and cached for one year via the immutable
// `Cache-Control` header that Next.js attaches automatically.
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  const alt = article
    ? `${article.frontmatter.title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return [{ id: 'og', size, contentType, alt }]
}

/**
 * Article-specific OG card. Returns a 1200×630 PNG composed of the
 * article's pillar kicker, title, lede, author byline, and read
 * time. Falls back to the site default card if the slug doesn't
 * resolve (handles 404 OG previews gracefully). Replaces the prior
 * `frontmatter.heroImage` SVG override in `generateMetadata` —
 * social platforms reject `image/svg+xml` as og:image content,
 * which is what caused every article share to render without a
 * preview image. Dynamic PNG output via `next/og`'s Satori renderer
 * is the supported path.
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OG_PALETTE.bg,
            color: OG_PALETTE.text,
            fontFamily: 'serif',
            fontSize: 64,
          }}
        >
          {siteConfig.name}
        </div>
      ),
      size,
    )
  }

  const fm = article.frontmatter
  const title = fm.title

  // Title font size — tuned by character count so 4-word titles look
  // punchy while 12-word titles still fit two lines without ellipsis.
  // Empirical breakpoints from the article corpus (longest title is
  // ~78 chars; shortest is ~28 chars).
  const titleFontSize =
    title.length <= 36 ? 88 : title.length <= 56 ? 76 : title.length <= 72 ? 66 : 58

  // Truncate lede to ~180 chars so it fits two italic lines at 28px
  // without overflowing the card.
  const lede = fm.lede.length > 180 ? `${fm.lede.slice(0, 177).trimEnd()}…` : fm.lede

  return new ImageResponse(
    (
      <ArticleOGContent
        pillarLabel={pillarLabel(fm.pillar)}
        title={title}
        lede={lede}
        author={fm.author}
        readTime={article.readTime}
        titleFontSize={titleFontSize}
      />
    ),
    size,
  )
}
