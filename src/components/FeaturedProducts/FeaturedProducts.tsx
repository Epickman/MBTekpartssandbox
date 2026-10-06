import Link from 'next/link'
import { getLiveProducts } from '@/services/liveProducts'
import { getProductStats, rankProducts } from '@/services/productStats'
import ProductCard from '@/components/ProductCard/ProductCard'

// 5 entran justo en la grilla: el primero ocupa dos columnas.
const SLOTS = 5

export default async function FeaturedProducts() {
  const [products, stats] = await Promise.all([getLiveProducts(), getProductStats()])
  const featured = rankProducts(products, stats, SLOTS)

  return (
    <section className="bg-[var(--black)] py-[clamp(56px,9vw,110px)] px-4" aria-labelledby="featured-heading">
      <div className="max-w-screen-xl mx-auto">
        {/* Editorial header */}
        <div className="mb-[clamp(30px,5vw,54px)] text-center">
          <div className="mb-eyebrow"><span>Lo más pedido</span></div>
          <h2 id="featured-heading" className="mb-title">
            Más vendidos y <span className="accent">consultados</span>
          </h2>
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

        <div className="mt-[clamp(30px,5vw,48px)] flex justify-center">
          <Link href="/productos" className="mb-btn mb-btn-outline">
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  )
}
