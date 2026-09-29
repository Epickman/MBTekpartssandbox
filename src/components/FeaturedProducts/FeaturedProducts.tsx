'use client'

import Link from 'next/link'
import { ProductService } from '@/services/productService'
import ProductCard from '@/components/ProductCard/ProductCard'

export default function FeaturedProducts() {
  const featured = ProductService.getFeatured()

  return (
    <section className="bg-zinc-900/50 py-20 px-4" aria-labelledby="featured-heading">
      <div className="max-w-screen-xl mx-auto">
        {/* Editorial header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
              Selección MBTEK
            </p>
            <h2
              id="featured-heading"
              className="text-white text-3xl sm:text-5xl font-black tracking-tight uppercase"
            >
              FEATURED
            </h2>
            <h2 className="text-[var(--accent)] text-3xl sm:text-5xl font-black tracking-tight uppercase">
              PARTS
            </h2>
          </div>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold tracking-widest uppercase transition-colors"
          >
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              size={i === 0 ? 'large' : 'default'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
