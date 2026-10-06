import type { Metadata } from 'next'
import { getLiveProducts } from '@/services/liveProducts'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import PromoBanner from '@/components/PromoBanner/PromoBanner'

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Repuestos y accesorios para ATV, cuatriciclos y MX. Compatible con Yamaha, Honda, Can-Am, Polaris, Kawasaki, Suzuki y más.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; categoria?: string }>
}) {
  const products = await getLiveProducts()
  const { categoria } = await searchParams

  return (
    <div className="min-h-screen bg-zinc-950 pt-[80px]">
      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-16 px-4 text-center">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">Catálogo</p>
        <h1 className="text-white text-4xl sm:text-6xl font-black tracking-tight uppercase">
          PRODUCTOS
        </h1>
        <p className="text-zinc-400 text-sm mt-4 max-w-lg mx-auto">
          Repuestos, piezas y accesorios para ATV, cuatriciclos y MX.
          Compatible con las principales marcas del mercado.
        </p>
      </div>

      <ProductGrid
        products={products}
        showFilters
        title=""
        className="max-w-screen-xl mx-auto"
        initialCategory={categoria}
      />

      <PromoBanner />
    </div>
  )
}
