'use client'

import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { ProductService } from '@/services/productService'
import { getCategoriesByTerrain } from '@/data/categories'
import ProductCard from '@/components/ProductCard/ProductCard'
import type { Terrain } from '@/types'
import { cn } from '@/utils/cn'
import { ChevronRight } from 'lucide-react'

interface ATVConfiguratorProps {
  terrain: Terrain
  className?: string
}

const categoryIcons: Record<string, string> = {
  suspension: '↑',
  frenos: '●',
  transmision: '⚙',
  ruedas: '○',
  neumaticos: '◉',
  motor: '▲',
  escape: '~',
  admision: '◇',
  proteccion: '⬡',
  embrague: '✦',
  accesorios: '+',
}

export default function ATVConfigurator({ terrain, className }: ATVConfiguratorProps) {
  const { state } = useCart()
  const categories = getCategoriesByTerrain(terrain)
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? '')

  const vehicleFilter = state.vehicle
    ? // Build vehicle ID from brand/model for filtering
      `${state.vehicle.brand.toLowerCase()}-${state.vehicle.model.toLowerCase().replace(/\s+/g, '-')}`
    : undefined

  const products = ProductService.getFiltered({
    terrain,
    category: activeCategory,
    vehicleId: vehicleFilter,
  })

  const activeLabel = categories.find((c) => c.id === activeCategory)?.name ?? ''

  return (
    <section
      className={cn('bg-zinc-950 py-12 px-4', className)}
      aria-labelledby="configurator-heading"
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">
            Paso 3 de 3 — {terrain.toUpperCase()}
            {state.vehicle && ` — ${state.vehicle.brand} ${state.vehicle.model}`}
          </p>
          <h2
            id="configurator-heading"
            className="text-white text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase"
          >
            ARMÁ TU ATV
          </h2>
          <h2 className="text-[var(--accent)] text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase">
            PARA {terrain.toUpperCase()}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase mb-4">
              Componentes
            </p>
            <nav aria-label="Categorías del configurador">
              <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" role="list">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex-shrink-0 lg:flex-shrink">
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all',
                        activeCategory === cat.id
                          ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      )}
                      aria-current={activeCategory === cat.id ? 'true' : undefined}
                    >
                      <span
                        className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0',
                          activeCategory === cat.id
                            ? 'bg-[var(--accent)] text-black'
                            : 'bg-zinc-800 text-zinc-500'
                        )}
                        aria-hidden="true"
                      >
                        {categoryIcons[cat.id] ?? '+'}
                      </span>
                      <span className="whitespace-nowrap lg:whitespace-normal">{cat.name}</span>
                      {activeCategory === cat.id && (
                        <ChevronRight size={14} className="ml-auto text-[var(--accent)] hidden lg:block" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Products panel */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                {activeLabel}
              </h3>
              <span className="text-zinc-500 text-sm">
                {products.length} producto{products.length !== 1 ? 's' : ''}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center">
                <p className="text-zinc-500 text-sm mb-2">
                  No hay productos disponibles para esta categoría.
                </p>
                <p className="text-zinc-600 text-xs">
                  Más productos se agregan constantemente. Consultanos por WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
