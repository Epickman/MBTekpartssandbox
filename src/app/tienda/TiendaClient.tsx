'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search, SlidersHorizontal, X, MessageCircle, Plus, Check,
  LayoutGrid, List, ChevronDown
} from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import { trackProducts } from '@/utils/trackProducts'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import { categories } from '@/data/categories'
import { vehicleBrands } from '@/data/vehicleBrands'
import type { Product, Terrain } from '@/types'
import { cn } from '@/utils/cn'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────


interface Filters {
  search: string
  terrain: Terrain | 'all'
  cats: string[]
  brand: string
  sort: 'featured' | 'az' | 'za'
}

const emptyFilters: Filters = { search: '', terrain: 'all', cats: [], brand: '', sort: 'featured' }

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────

export default function TiendaClient({
  products, initialTerrain = 'all',
}: { products: Product[]; initialTerrain?: Terrain | 'all' }) {
  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── HERO / INTRO ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-zinc-950 pt-[64px] flex items-end min-h-[440px] sm:min-h-[560px] lg:min-h-[760px]">
        {/* Background banner */}
        <Image
          src="/images/bannertienda-sinlogo.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] lg:object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-zinc-950/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent via-60% to-zinc-950" />
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(220,38,38,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 pt-14 pb-10 lg:pb-16">
          <div className="flex">
            <div className="text-left">
              <p className="text-zinc-600 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">
                Catálogo
              </p>
              <h1 className="text-white font-black uppercase leading-[0.9] tracking-tight">
                <span className="block" style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}>TIENDA</span>
                <span className="block text-[var(--accent)]" style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}>MBTEK</span>
              </h1>
              <p className="text-zinc-500 text-sm mt-3 max-w-sm leading-relaxed">
                Repuestos premium para ATV y MX. Filtrá por terreno, categoría o marca y armá tu pedido.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CatalogoTab products={products} initialTerrain={initialTerrain} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────────────────────────────────────

function CatalogoTab({ products, initialTerrain }: { products: Product[]; initialTerrain: Terrain | 'all' }) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, terrain: initialTerrain })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const update = useCallback(<K extends keyof Filters>(k: K, v: Filters[K]) =>
    setFilters(f => ({ ...f, [k]: v })), [])

  const toggleCat = useCallback((id: string) =>
    setFilters(f => ({
      ...f,
      cats: f.cats.includes(id) ? f.cats.filter(c => c !== id) : [...f.cats, id]
    })), [])

  const clear = useCallback(() => setFilters(emptyFilters), [])

  const secondaryActiveCount = filters.cats.length + (filters.brand ? 1 : 0) + (filters.search ? 1 : 0)

  const filtered = useMemo(() => {
    let r = [...products]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (filters.terrain !== 'all') r = r.filter(p => p.terrain.includes(filters.terrain as Terrain))
    if (filters.cats.length) r = r.filter(p => filters.cats.includes(p.category))
    if (filters.brand) r = r.filter(p => p.vehicles.some(v => v.startsWith(filters.brand)))
    if (filters.sort === 'az') r.sort((a, b) => a.name.localeCompare(b.name))
    if (filters.sort === 'za') r.sort((a, b) => b.name.localeCompare(a.name))
    if (filters.sort === 'featured') r.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return r
  }, [products, filters])

  // Terrain switch is the hero element — everything below adapts to it
  const terrainBg =
    filters.terrain === 'tierra'
      ? 'from-amber-950/40 via-zinc-950 to-zinc-950'
      : filters.terrain === 'arena'
      ? 'from-yellow-950/30 via-zinc-950 to-zinc-950'
      : 'from-zinc-900/20 to-zinc-950'

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Terreno */}
      <FilterSection label="Terreno">
        {(['all', 'tierra', 'arena'] as const).map(t => (
          <FilterRow
            key={t}
            active={filters.terrain === t}
            onClick={() => update('terrain', t)}
            dot={t === 'tierra' ? 'bg-amber-700' : t === 'arena' ? 'bg-yellow-500' : 'bg-zinc-500'}
          >
            {t === 'all' ? 'Todos' : t.toUpperCase()}
          </FilterRow>
        ))}
      </FilterSection>

      {/* Categoría */}
      <FilterSection label="Categoría">
        {categories.map(cat => (
          <FilterCheckRow
            key={cat.id}
            checked={filters.cats.includes(cat.id)}
            onToggle={() => toggleCat(cat.id)}
          >
            {cat.name}
          </FilterCheckRow>
        ))}
      </FilterSection>

      {/* Marca */}
      <FilterSection label="Marca vehículo">
        <FilterRow active={!filters.brand} onClick={() => update('brand', '')}>Todas</FilterRow>
        {vehicleBrands.map(b => (
          <FilterRow key={b.id} active={filters.brand === b.id} onClick={() => update('brand', b.id)}>
            {b.name}
          </FilterRow>
        ))}
      </FilterSection>

      {secondaryActiveCount > 0 && (
        <button onClick={clear} className="w-full py-2.5 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white text-xs font-medium transition-all">
          Limpiar filtros ({secondaryActiveCount})
        </button>
      )}
    </div>
  )

  return (
    <div className={cn('min-h-screen bg-gradient-to-b transition-colors duration-700', terrainBg)}>
      {/* ── TERRAIN SWITCH HERO ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-6">
        <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase text-center mb-5">
          ¿Para qué terreno buscás?
        </p>

        {/* Big toggle */}
        <div className="flex rounded-2xl overflow-hidden border border-zinc-800 max-w-lg mx-auto">
          {/* ALL */}
          <button
            onClick={() => update('terrain', 'all')}
            className={cn(
              'flex-1 py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300',
              filters.terrain === 'all'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            )}
          >
            TODOS
          </button>

          {/* TIERRA */}
          <button
            onClick={() => update('terrain', 'tierra')}
            className={cn(
              'flex-1 py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 border-l border-zinc-800',
              filters.terrain === 'tierra'
                ? 'bg-gradient-to-b from-amber-900 to-amber-950 text-amber-300 border-amber-800'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            )}
          >
            <span className="block">🟤</span>
            TIERRA
          </button>

          {/* ARENA */}
          <button
            onClick={() => update('terrain', 'arena')}
            className={cn(
              'flex-1 py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 border-l border-zinc-800',
              filters.terrain === 'arena'
                ? 'bg-gradient-to-b from-yellow-900 to-yellow-950 text-yellow-300 border-yellow-800'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            )}
          >
            <span className="block">🟡</span>
            ARENA
          </button>
        </div>

        {/* Terrain description */}
        {filters.terrain !== 'all' && (
          <div className="text-center mt-4 animate-fade-in">
            {filters.terrain === 'tierra' ? (
              <p className="text-amber-600/80 text-xs tracking-wide">
                Barro · Montaña · Caminos de piedra · Off-road extremo
              </p>
            ) : (
              <p className="text-yellow-600/80 text-xs tracking-wide">
                Dunas · Médanos · Playa · Performance en arena
              </p>
            )}
          </div>
        )}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            value={filters.search}
            onChange={e => update('search', e.target.value)}
            placeholder="Buscar producto, SKU..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {filters.search && (
            <button onClick={() => update('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={e => update('sort', e.target.value as Filters['sort'])}
            className="appearance-none bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-4 pr-9 text-sm text-zinc-300 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>

        {/* Mobile filter btn */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={cn(
            'flex lg:hidden items-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all',
            secondaryActiveCount > 0 ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-zinc-700 text-zinc-400 bg-zinc-900'
          )}
        >
          <SlidersHorizontal size={15} />
          Filtros
          {secondaryActiveCount > 0 && <span className="bg-[var(--accent)] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{secondaryActiveCount}</span>}
        </button>

        {/* View toggle */}
        <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-700 rounded-xl p-1">
          <button onClick={() => setView('grid')} className={cn('p-2 rounded-lg transition-all', view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300')} aria-pressed={view === 'grid'}><LayoutGrid size={15} /></button>
          <button onClick={() => setView('list')} className={cn('p-2 rounded-lg transition-all', view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300')} aria-pressed={view === 'list'}><List size={15} /></button>
        </div>
      </div>

      {/* Active chips */}
      {secondaryActiveCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.terrain !== 'all' && <Chip label={filters.terrain.toUpperCase()} onRemove={() => update('terrain', 'all')} />}
          {filters.cats.map(c => {
            const cat = categories.find(x => x.id === c)
            return cat ? <Chip key={c} label={cat.name} onRemove={() => toggleCat(c)} /> : null
          })}
          {filters.brand && <Chip label={vehicleBrands.find(b => b.id === filters.brand)?.name ?? filters.brand} onRemove={() => update('brand', '')} />}
          {filters.search && <Chip label={`"${filters.search}"`} onRemove={() => update('search', '')} />}
          <button onClick={clear} className="text-zinc-500 hover:text-zinc-300 text-xs underline underline-offset-2 transition-colors self-center">Limpiar</button>
        </div>
      )}

      <div className="flex gap-7">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-[126px] bg-zinc-900/60 rounded-2xl border border-zinc-800/60 p-5">
            <p className="text-white text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Filtrar</p>
            <FilterContent />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="text-zinc-500 text-sm mb-5">
            <span className="text-white font-semibold">{filtered.length}</span> producto{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <p className="text-zinc-500 mb-4">Sin resultados para esa búsqueda.</p>
              <button onClick={clear} className="py-2.5 px-6 bg-[var(--accent)] text-black font-bold text-sm rounded-full">Limpiar filtros</button>
            </div>
          ) : view === 'grid' ? (
            <ProductGrid products={filtered} />
          ) : (
            <ProductList products={filtered} />
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-label="Filtros">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="w-80 max-w-full bg-zinc-950 border-l border-zinc-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold uppercase tracking-wide">Filtros</span>
              <button onClick={() => setDrawerOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <FilterContent />
            <button onClick={() => setDrawerOpen(false)} className="w-full mt-8 py-3.5 bg-[var(--accent)] text-black font-bold text-sm rounded-full">
              Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </button>
          </aside>
        </div>
      )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Grid / List
// ─────────────────────────────────────────────────────────────────────────────

function ProductGrid({ products }: { products: Product[] }) {
  const { addItem, state } = useCart()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product, i) => {
        const isInCart = state.items.some(it => it.product.id === product.id)
        const isLarge = i % 7 === 0
        const waUrl = generateWhatsAppUrl({ product })
        return (
          <article key={product.id} className={cn(
            'group flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300',
            isLarge && 'sm:col-span-2'
          )}>
            <Link href={`/productos/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
              <div className={cn('relative overflow-hidden bg-zinc-800', isLarge ? 'aspect-[16/9]' : 'aspect-square')}>
                <Image src={product.images[0] ?? '/images/placeholder-product.jpg'} alt={product.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {product.terrain.map(t => (
                    <span key={t} className={cn('text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm',
                      t === 'tierra' ? 'bg-amber-900/70 text-amber-300' : 'bg-yellow-900/70 text-yellow-300')}>
                      {t}
                    </span>
                  ))}
                </div>
                {product.featured && <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-[var(--accent)] text-black">FEATURED</span>}
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-mono">{product.sku}</span>
                <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                {product.vehicles.length > 0 && (
                  <p className="text-zinc-600 text-xs truncate">
                    {product.vehicles.slice(0, 2).map(v => v.split('-').slice(0, 2).join(' ').toUpperCase()).join(' · ')}
                    {product.vehicles.length > 2 && ` +${product.vehicles.length - 2}`}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-white font-bold text-sm">{formatPrice(product.price)}</span>
                  {product.stock !== undefined && <span className={cn('text-[10px] font-medium', product.stock === 0 ? 'text-red-400' : product.stock <= 3 ? 'text-amber-400' : 'text-emerald-400')}>{formatStock(product.stock)}</span>}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={() => addItem(product)}
                className={cn('flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-1.5',
                  isInCart ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700')}>
                {isInCart ? <><Check size={11} /> En el carrito</> : <><Plus size={11} /> Agregar</>}
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
                onClick={e => { e.stopPropagation(); trackProducts('order', [product.id]) }}>
                <MessageCircle size={13} />
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function ProductList({ products }: { products: Product[] }) {
  const { addItem, state } = useCart()
  return (
    <div className="space-y-3">
      {products.map(product => {
        const isInCart = state.items.some(it => it.product.id === product.id)
        const waUrl = generateWhatsAppUrl({ product })
        return (
          <article key={product.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all group">
            <Link href={`/productos/${product.slug}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-zinc-800">
                <Image src={product.images[0] ?? '/images/placeholder-product.jpg'} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="128px" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 py-4 pr-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono">{product.sku}</span>
                    <Link href={`/productos/${product.slug}`}>
                      <h3 className="text-white font-semibold text-sm hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                    </Link>
                  </div>
                  <span className="text-white font-bold text-sm whitespace-nowrap flex-shrink-0">{formatPrice(product.price)}</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => addItem(product)}
                  className={cn('flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold uppercase transition-all',
                    isInCart ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700')}>
                  {isInCart ? <Check size={10} /> : <Plus size={10} />}
                  {isInCart ? 'En el carrito' : 'Agregar'}
                </button>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackProducts('order', [product.id])}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all">
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Small reusable filter helpers
// ─────────────────────────────────────────────────────────────────────────────

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-zinc-500 text-[10px] tracking-[0.25em] uppercase mb-3 font-semibold">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function FilterRow({ active, onClick, dot, children }: { active: boolean; onClick: () => void; dot?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cn('w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-xs text-left transition-all',
        active ? 'bg-[var(--accent)]/15 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800')}>
      {dot && <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot)} />}
      <span className="font-medium uppercase tracking-wide">{children}</span>
      {active && <Check size={11} className="ml-auto text-[var(--accent)]" />}
    </button>
  )
}

function FilterCheckRow({ checked, onToggle, children }: { checked: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onToggle}
      className={cn('w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-xs text-left transition-all',
        checked ? 'bg-[var(--accent)]/15 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800')}>
      <span className={cn('w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all',
        checked ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-zinc-600')}>
        {checked && <Check size={8} className="text-black" />}
      </span>
      <span className="font-medium">{children}</span>
    </button>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300">
      {label}
      <button onClick={onRemove} className="text-zinc-500 hover:text-white transition-colors"><X size={10} /></button>
    </span>
  )
}
