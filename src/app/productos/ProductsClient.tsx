'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, MessageCircle, Plus, Check, LayoutGrid, List, ChevronDown } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import { trackProducts } from '@/utils/trackProducts'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import { categories } from '@/data/categories'
import { vehicleBrands } from '@/data/vehicleBrands'
import type { Product, Terrain } from '@/types'
import { cn } from '@/utils/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Filters {
  search: string
  terrain: Terrain | 'all'
  categories: string[]
  brand: string
  sort: 'featured' | 'name-asc' | 'name-desc'
}

const defaultFilters: Filters = {
  search: '',
  terrain: 'all',
  categories: [],
  brand: '',
  sort: 'featured',
}

const sortOptions = [
  { value: 'featured', label: 'Destacados primero' },
  { value: 'name-asc', label: 'Nombre A → Z' },
  { value: 'name-desc', label: 'Nombre Z → A' },
]

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProductsClient({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { addItem, state } = useCart()

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }, [])

  const toggleCategory = useCallback((id: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }))
  }, [])

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const activeFilterCount =
    (filters.terrain !== 'all' ? 1 : 0) +
    filters.categories.length +
    (filters.brand ? 1 : 0) +
    (filters.search ? 1 : 0)

  // ── Filtered + sorted products ─────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...products]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (filters.terrain !== 'all') {
      result = result.filter((p) => p.terrain.includes(filters.terrain as Terrain))
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    if (filters.brand) {
      result = result.filter((p) =>
        p.vehicles.some((v) => v.startsWith(filters.brand.toLowerCase()))
      )
    }

    switch (filters.sort) {
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  }, [products, filters])

  // ── Filter sidebar content (shared between desktop + drawer) ───────────────

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Terrain */}
      <div>
        <p className="text-zinc-500 text-[10px] tracking-[0.25em] uppercase mb-3 font-semibold">
          Terreno
        </p>
        <div className="space-y-1">
          {(['all', 'tierra', 'arena'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateFilter('terrain', t)}
              className={cn(
                'w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all',
                filters.terrain === t
                  ? 'bg-[var(--accent)]/15 text-white border border-[var(--accent)]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  t === 'all'
                    ? 'bg-zinc-500'
                    : t === 'tierra'
                    ? 'bg-amber-700'
                    : 'bg-yellow-500'
                )}
              />
              <span className="font-medium uppercase tracking-wide text-xs">
                {t === 'all' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
              {filters.terrain === t && <Check size={12} className="ml-auto text-[var(--accent)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-zinc-500 text-[10px] tracking-[0.25em] uppercase mb-3 font-semibold">
          Categoría
        </p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all',
                filters.categories.includes(cat.id)
                  ? 'bg-[var(--accent)]/15 text-white border border-[var(--accent)]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              )}
            >
              <span
                className={cn(
                  'w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all',
                  filters.categories.includes(cat.id)
                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                    : 'border-zinc-700'
                )}
              >
                {filters.categories.includes(cat.id) && (
                  <Check size={10} className="text-black" />
                )}
              </span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-zinc-500 text-[10px] tracking-[0.25em] uppercase mb-3 font-semibold">
          Marca de vehículo
        </p>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('brand', '')}
            className={cn(
              'w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all',
              !filters.brand
                ? 'bg-[var(--accent)]/15 text-white border border-[var(--accent)]/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            )}
          >
            <span className="text-xs font-medium tracking-wide uppercase">Todas</span>
            {!filters.brand && <Check size={12} className="ml-auto text-[var(--accent)]" />}
          </button>
          {vehicleBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => updateFilter('brand', brand.id)}
              className={cn(
                'w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all',
                filters.brand === brand.id
                  ? 'bg-[var(--accent)]/15 text-white border border-[var(--accent)]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              )}
            >
              <span className="text-xs font-medium tracking-wide uppercase">{brand.name}</span>
              {filters.brand === brand.id && <Check size={12} className="ml-auto text-[var(--accent)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white text-xs font-medium tracking-wide transition-all hover:border-zinc-500"
        >
          Limpiar filtros ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* ── Top toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Buscar por nombre, SKU..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
            aria-label="Buscar productos"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value as Filters['sort'])}
            className="appearance-none bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-4 pr-9 text-sm text-zinc-300 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Ordenar por"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={cn(
            'flex lg:hidden items-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all',
            activeFilterCount > 0
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
              : 'border-zinc-700 text-zinc-400 bg-zinc-900'
          )}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal size={16} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="bg-[var(--accent)] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-700 rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-lg transition-all',
              view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            )}
            aria-label="Vista de grilla"
            aria-pressed={view === 'grid'}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-lg transition-all',
              view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            )}
            aria-label="Vista de lista"
            aria-pressed={view === 'list'}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6" aria-label="Filtros activos">
          {filters.terrain !== 'all' && (
            <Chip label={`Terreno: ${filters.terrain}`} onRemove={() => updateFilter('terrain', 'all')} />
          )}
          {filters.categories.map((c) => {
            const cat = categories.find((cat) => cat.id === c)
            return cat ? (
              <Chip key={c} label={cat.name} onRemove={() => toggleCategory(c)} />
            ) : null
          })}
          {filters.brand && (
            <Chip
              label={vehicleBrands.find((b) => b.id === filters.brand)?.name ?? filters.brand}
              onRemove={() => updateFilter('brand', '')}
            />
          )}
          {filters.search && (
            <Chip label={`"${filters.search}"`} onRemove={() => updateFilter('search', '')} />
          )}
          <button
            onClick={clearFilters}
            className="text-zinc-500 hover:text-zinc-300 text-xs underline underline-offset-2 transition-colors"
          >
            Limpiar todo
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-[80px] bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">
                Filtros
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-[var(--accent)] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* ── Product results ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-zinc-500 text-sm">
              <span className="text-white font-semibold">{filtered.length}</span>{' '}
              producto{filtered.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && ' encontrado' + (filtered.length !== 1 ? 's' : '')}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : view === 'grid' ? (
            <GridView products={filtered} />
          ) : (
            <ListView products={filtered} />
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="w-80 max-w-full bg-zinc-950 border-l border-zinc-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold tracking-wide uppercase">Filtros</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-zinc-500 hover:text-white"
                aria-label="Cerrar filtros"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-8 py-3.5 bg-[var(--accent)] text-black font-bold text-sm rounded-full"
            >
              Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300">
      {label}
      <button onClick={onRemove} className="text-zinc-500 hover:text-white transition-colors" aria-label={`Quitar filtro ${label}`}>
        <X size={10} />
      </button>
    </span>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-zinc-800">
      <p className="text-4xl mb-4">🔍</p>
      <p className="text-white font-bold text-lg mb-2">Sin resultados</p>
      <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
        No encontramos productos con esos filtros. Probá con otro criterio.
      </p>
      <button
        onClick={onClear}
        className="py-2.5 px-6 bg-[var(--accent)] text-black font-bold text-sm rounded-full"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

function GridView({ products }: { products: Product[] }) {
  const { addItem, state } = useCart()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product, i) => {
        const isInCart = state.items.some((it) => it.product.id === product.id)
        const isLarge = i % 7 === 0
        const waUrl = generateWhatsAppUrl({
          product,
        })

        return (
          <article
            key={product.id}
            className={cn(
              'group relative flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300',
              isLarge && 'sm:col-span-2'
            )}
          >
            <Link href={`/productos/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
              <div className={cn('relative overflow-hidden bg-zinc-800', isLarge ? 'aspect-[16/9]' : 'aspect-square')}>
                <Image
                  src={product.images[0] ?? '/images/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Terrain badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {product.terrain.map((t) => (
                    <span key={t} className={cn(
                      'text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm',
                      t === 'tierra' ? 'bg-amber-900/70 text-amber-300' : 'bg-yellow-900/70 text-yellow-300'
                    )}>
                      {t}
                    </span>
                  ))}
                </div>
                {product.featured && (
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-[var(--accent)] text-black">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-mono">{product.sku}</span>
                <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {product.name}
                </h3>
                {product.vehicles.length > 0 && (
                  <p className="text-zinc-600 text-xs truncate">
                    {product.vehicles.slice(0, 2).map(v => v.split('-').slice(0,2).join(' ').toUpperCase()).join(' · ')}
                    {product.vehicles.length > 2 && ` +${product.vehicles.length - 2}`}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-white font-bold">{formatPrice(product.price)}</span>
                  {product.stock !== undefined && (
                    <span className={cn('text-[10px] font-medium',
                      product.stock === 0 ? 'text-red-400' : product.stock <= 3 ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {formatStock(product.stock)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => addItem(product)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-1.5',
                  isInCart
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                )}
              >
                {isInCart ? <><Check size={12} /> En el carrito</> : <><Plus size={12} /> Agregar</>}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProducts('order', [product.id])}
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
                aria-label="Comprar por WhatsApp"
              >
                <MessageCircle size={13} />
                <span className="hidden sm:inline">WA</span>
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function ListView({ products }: { products: Product[] }) {
  const { addItem, state } = useCart()

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const isInCart = state.items.some((it) => it.product.id === product.id)
        const waUrl = generateWhatsAppUrl({
          product,
        })

        return (
          <article
            key={product.id}
            className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all group"
          >
            <Link href={`/productos/${product.slug}`} className="flex-shrink-0" aria-label={`Ver ${product.name}`}>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-zinc-800">
                <Image
                  src={product.images[0] ?? '/images/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="128px"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0 py-4 pr-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">{product.sku}</span>
                    <Link href={`/productos/${product.slug}`}>
                      <h3 className="text-white font-semibold text-sm sm:text-base leading-snug hover:text-[var(--accent)] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <span className="text-white font-bold text-sm whitespace-nowrap flex-shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                <div className="flex gap-1.5 mt-2">
                  {product.terrain.map((t) => (
                    <span key={t} className={cn(
                      'text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full',
                      t === 'tierra' ? 'bg-amber-900/40 text-amber-400' : 'bg-yellow-900/40 text-yellow-400'
                    )}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => addItem(product)}
                  className={cn(
                    'flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold uppercase transition-all',
                    isInCart
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                  )}
                >
                  {isInCart ? <Check size={11} /> : <Plus size={11} />}
                  {isInCart ? 'En el carrito' : 'Agregar'}
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProducts('order', [product.id])}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
                >
                  <MessageCircle size={12} />
                  WhatsApp
                </a>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
