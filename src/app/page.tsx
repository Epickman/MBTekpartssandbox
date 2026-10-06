import type { Metadata } from 'next'
import HeroScrub from '@/components/HeroScrub/HeroScrub'
import HeroSection from '@/components/HeroSection/HeroSection'
import MostWanted from '@/components/MostWanted/MostWanted'
import PromoBanner from '@/components/PromoBanner/PromoBanner'
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts'
import CategoriesGrid from '@/components/CategoriesGrid/CategoriesGrid'
import siteConfig from '@/config/site'

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
}

export default function HomePage() {
  return (
    <>
      {/* ── Intro: logo + video scrolleable + carteles ────────── */}
      <HeroScrub />

      {/* ── Armá tu ATV según el terreno (TIERRA / ARENA) ─────── */}
      <HeroSection />

      {/* ── Categorías ────────────────────────────────────────── */}
      <CategoriesGrid />

      {/* ── Cuatriciclos más buscados ─────────────────────────── */}
      <MostWanted />

      {/* ── Promociones de la semana ──────────────────────────── */}
      <PromoBanner />

      {/* ── Productos destacados ──────────────────────────────── */}
      <FeaturedProducts />

    </>
  )
}
