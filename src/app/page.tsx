import type { Metadata } from 'next'
import HeroSection from '@/components/HeroSection/HeroSection'
import TerrainSelector from '@/components/TerrainSelector/TerrainSelector'
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts'
import WhyMBTEK from '@/components/ui/WhyMBTEK'
import ATVMXSplit from '@/components/ui/ATVMXSplit'
import InstagramSection from '@/components/ui/InstagramSection'
import siteConfig from '@/config/site'

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero principal ────────────────────────────────────── */}
      <HeroSection />

      {/* ── Terrain selector (TIERRA / ARENA) ─────────────────── */}
      <TerrainSelector />

      {/* ── ATV / MX split ────────────────────────────────────── */}
      <ATVMXSplit />

      {/* ── Featured parts ────────────────────────────────────── */}
      <FeaturedProducts />

      {/* ── Why MBTEK ─────────────────────────────────────────── */}
      <WhyMBTEK />

      {/* ── Instagram ─────────────────────────────────────────── */}
      <InstagramSection />
    </>
  )
}
