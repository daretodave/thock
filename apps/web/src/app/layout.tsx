import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager'
import { VercelAnalytics } from '@/components/analytics/VercelAnalytics'
import { SpeedInsights } from '@/components/analytics/SpeedInsights'
import { siteConfig } from '@thock/seo'
import './globals.css'

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--thock-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--thock-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--thock-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-text font-sans antialiased min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <GoogleTagManager />
        <Header />
        {children}
        <Footer />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
