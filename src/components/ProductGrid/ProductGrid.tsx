'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import { categories, getCategoriesByTerrain } from '@/data/categories'
import type { Product, Terrain } from '@/types'
import { cn } from '@/utils/cn'

interface ProductGridProps {
  products: Product[]
  terrain?: Terrain
  showFilters?: boolean
  title?: string
  className?: string
  initialCategory?: string
}

export default function ProductGrid({
  products,
  terrain,
  showFilters = false,
  title,
  className,
  initialCategory,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : 'all'
  )

  const filterCategories = terrain ? getCategoriesByTerrain(terrain) : categories
  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <section className={cn('py-12 px-4', className)}>
      {title && (
        <div className="max-w-screen-xl mx-auto mb-10">
          <h2 className="text-white text-2xl sm:text-4xl font-black tracking-tight uppercase">
            {title}
          </h2>
        </div>
      )}

      {/* Category filters */}
      {showFilters && (
        <div className="max-w-screen-xl mx-auto mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'py-2 px-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap',
                activeCategory === 'all'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700'
              )}
            >
              Todos
            </button>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'py-2 px-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-[var(--accent)] text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editorial grid — alternating large/small */}
      {filtered.length === 0 ? (
        <div className="max-w-screen-xl mx-auto text-center py-20">
          <p className="text-zinc-500 text-lg">No hay productos para esta selección.</p>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              size={i % 5 === 0 ? 'large' : 'default'}
            />
          ))}
        </div>
      )}
    </section>
  )
}
