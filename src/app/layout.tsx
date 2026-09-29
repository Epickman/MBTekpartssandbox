import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/store/cartStore'
import TopBrandBar from '@/components/TopBrandBar/TopBrandBar'
import Navbar from '@/components/Navbar/Navbar'
import Cart from '@/components/Cart/Cart'
import Footer from '@/components/Footer/Footer'
import siteConfig from '@/config/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.website),
  title: {
    default: siteConfig.seo.title,
    template: `%s | MBTEK Parts`,
  },
  description: siteConfig.seo.description,
  keywords: ['ATV', 'cuatriciclos', 'MX', 'motocross', 'off-road', 'repuestos', 'piezas', 'Argentina', 'MBTEK'],
  authors: [{ name: 'MBTEK Parts' }],
  openGraph: {
    type: 'website',
    locale: siteConfig.seo.locale,
    url: siteConfig.website,
    siteName: siteConfig.seo.siteName,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [{ url: siteConfig.seo.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.seo.twitterHandle,
    creator: siteConfig.seo.twitterHandle,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteConfig.website,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className="bg-[var(--black)] text-[var(--white)] antialiased">
        <CartProvider>
          {/* Top bar + nav are fixed/sticky, together ~64px offset */}
          <TopBrandBar />
          <Navbar />

          <main id="main-content">
            {children}
          </main>

          <Footer />

          {/* Floating cart drawer */}
          <Cart />
        </CartProvider>
      </body>
    </html>
  )
}
