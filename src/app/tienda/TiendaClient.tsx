'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search, SlidersHorizontal, X, MessageCircle, Plus, Check,
  LayoutGrid, List, ChevronDown, ShoppingBag, Wrench, ArrowRight
} from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import { categories } from '@/data/categories'
import { vehicleBrands } from '@/data/vehicleBrands'
import { terrainData } from '@/data/terrain'
import ATVDiagram from '@/components/ATVDiagram/ATVDiagram'
import type { Product, Terrain } from '@/types'
import { cn } from '@/utils/cn'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'catalogo' | 'configurar'
type ConfigStep = 'terrain' | 'vehicle' | 'build'

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

export default function TiendaClient({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<Tab>('catalogo')
  const [heroTerrain, setHeroTerrain] = useState<Terrain | 'all'>('all')

  const handleHeroTerrain = (t: Terrain) => {
    setHeroTerrain(t)
    setTab('catalogo')
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-[72px]">

      {/* ── HERO / INTRO ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-zinc-950 pt-[64px]">
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

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <p className="text-zinc-600 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">
            Catálogo & Configurador
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-white font-black uppercase leading-[0.9] tracking-tight">
                <span className="block" style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}>TIENDA</span>
                <span className="block text-[var(--accent)]" style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}>MBTEK</span>
              </h1>
              <p className="text-zinc-500 text-sm mt-3 max-w-sm leading-relaxed">
                Repuestos premium para ATV y MX. Filtrá por terreno o configurá tu máquina parte por parte.
              </p>
            </div>

            {/* Terrain quick-select */}
            <div className="flex gap-3 lg:pb-1">
              <button
                onClick={() => handleHeroTerrain('tierra')}
                className="group relative overflow-hidden flex flex-col items-start gap-1.5 py-4 px-6 rounded-2xl border transition-all duration-300 text-left min-w-[130px]"
                style={
                  heroTerrain === 'tierra'
                    ? { borderColor: '#92400e', background: 'rgba(120,53,15,0.3)' }
                    : { borderColor: '#27272a', background: '#18181b' }
                }
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-600">Off-Road</span>
                <span className="text-2xl font-black uppercase text-white">TIERRA</span>
                <span className="text-zinc-600 text-[10px] tracking-wide">Barro · Montaña</span>
              </button>

              <button
                onClick={() => handleHeroTerrain('arena')}
                className="group relative overflow-hidden flex flex-col items-start gap-1.5 py-4 px-6 rounded-2xl border transition-all duration-300 text-left min-w-[130px]"
                style={
                  heroTerrain === 'arena'
                    ? { borderColor: '#78350f', background: 'rgba(113,63,18,0.3)' }
                    : { borderColor: '#27272a', background: '#18181b' }
                }
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-yellow-500">Dunes</span>
                <span className="text-2xl font-black uppercase text-white">ARENA</span>
                <span className="text-zinc-600 text-[10px] tracking-wide">Dunas · Médanos</span>
              </button>

              {heroTerrain !== 'all' && (
                <button
                  onClick={() => setHeroTerrain('all')}
                  className="self-center text-zinc-600 hover:text-zinc-300 text-[10px] tracking-wide uppercase transition-colors whitespace-nowrap"
                >
                  Ver todos
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────────── */}
      <div className="animate-fade-in">
        {tab === 'catalogo' ? (
          <CatalogoTab products={products} initialTerrain={heroTerrain} />
        ) : (
          <ConfiguradorTab />
        )}
      </div>

      {/* ── TAB BAR — fixed bottom ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 safe-area-pb">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-stretch h-[60px]">
            <BottomTabButton
              active={tab === 'catalogo'}
              onClick={() => setTab('catalogo')}
              icon={<ShoppingBag size={18} />}
              label="Tienda"
            />
            <BottomTabButton
              active={tab === 'configurar'}
              onClick={() => setTab('configurar')}
              icon={<Wrench size={18} />}
              label="Configurar ATV"
              accent
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom fixed tab button
// ─────────────────────────────────────────────────────────────────────────────

function BottomTabButton({
  active, onClick, icon, label, accent
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode
  label: string; accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        'flex-1 flex items-center justify-center gap-2.5 transition-all duration-200 relative',
        active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
      )}
    >
      {/* Active indicator line at top */}
      {active && (
        <span
          className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
          style={{ background: accent ? 'var(--accent)' : '#fff' }}
        />
      )}
      <span className={cn('transition-colors', active ? (accent ? 'text-[var(--accent)]' : 'text-white') : 'text-zinc-600')}>
        {icon}
      </span>
      <span className={cn('text-xs font-bold tracking-wide uppercase', active ? 'text-white' : 'text-zinc-500')}>
        {label}
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO TAB
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
// CONFIGURADOR TAB — 3-step flow
// ─────────────────────────────────────────────────────────────────────────────

function ConfiguradorTab() {
  const { state, setTerrain, setVehicle } = useCart()
  const [step, setStep] = useState<ConfigStep>(
    state.terrain ? (state.vehicle ? 'build' : 'vehicle') : 'terrain'
  )
  const [localTerrain, setLocalTerrain] = useState<Terrain | null>(state.terrain)
  const [selectedBrand, setSelectedBrand] = useState(
    vehicleBrands.find(b => b.name === state.vehicle?.brand) ?? null
  )
  const [selectedModelId, setSelectedModelId] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('')

  const terrainConfig = terrainData.find(t => t.id === localTerrain)

  const handleTerrainPick = (t: Terrain) => {
    setLocalTerrain(t)
    setTerrain(t)
    setStep('vehicle')
  }

  const handleVehicleConfirm = () => {
    if (!selectedBrand || !selectedModelId) return
    const model = selectedBrand.models.find(m => m.id === selectedModelId)
    if (!model) return
    setVehicle({ brand: selectedBrand.name, model: model.name, year: selectedYear || undefined })
    setStep('build')
  }

  const steps = [
    { key: 'terrain', label: 'Terreno', done: !!localTerrain },
    { key: 'vehicle', label: 'Vehículo', done: !!state.vehicle },
    { key: 'build', label: 'Configurar', done: false },
  ]

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-700',
      localTerrain === 'tierra' ? 'bg-gradient-to-b from-amber-950/30 to-zinc-950' :
      localTerrain === 'arena' ? 'bg-gradient-to-b from-yellow-950/30 to-zinc-950' :
      'bg-zinc-950'
    )}>
      {/* Progress steps */}
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 max-w-sm mx-auto">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => {
                  if (s.key === 'terrain' || (s.key === 'vehicle' && localTerrain) || (s.key === 'build' && state.vehicle)) {
                    setStep(s.key as ConfigStep)
                  }
                }}
                className={cn(
                  'flex items-center gap-2 text-xs font-bold tracking-wide uppercase transition-all',
                  step === s.key ? 'text-white' : s.done ? 'text-[var(--accent)] cursor-pointer' : 'text-zinc-600'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all',
                  step === s.key ? 'bg-white text-black border-white' :
                  s.done ? 'bg-[var(--accent)] text-black border-[var(--accent)]' :
                  'bg-transparent text-zinc-600 border-zinc-700'
                )}>
                  {s.done && step !== s.key ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-px transition-colors', s.done ? 'bg-[var(--accent)]/50' : 'bg-zinc-800')} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step: TERRAIN */}
      {step === 'terrain' && (
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">Paso 1</p>
            <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tight">
              ¿PARA QUÉ
            </h2>
            <h2 className="text-[var(--accent)] text-4xl sm:text-6xl font-black uppercase tracking-tight">
              QUERÉS TU ATV?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {terrainData.map(t => (
              <button
                key={t.id}
                onClick={() => handleTerrainPick(t.id)}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-left',
                  'hover:border-[var(--accent)] hover:scale-[1.02] transition-all duration-400',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] min-h-[260px]'
                )}
              >
                <div className={cn(
                  'absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500',
                  t.id === 'tierra' ? 'bg-gradient-to-br from-amber-900 via-stone-800 to-zinc-900' : 'bg-gradient-to-br from-yellow-800 via-amber-700 to-zinc-900'
                )} />
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-7xl font-black uppercase leading-none group-hover:text-[var(--accent)] transition-colors duration-300">
                      {t.name}
                    </h3>
                    <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mt-2">{t.subtitle}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {t.keywords.slice(0, 4).map(kw => (
                      <span key={kw} className="text-[10px] tracking-widest text-zinc-500 border border-zinc-700 group-hover:border-zinc-500 px-2.5 py-1 rounded-full uppercase transition-colors">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-zinc-300 group-hover:text-white uppercase transition-colors">Elegir {t.name}</span>
                    <span className="w-7 h-7 rounded-full border border-zinc-600 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] flex items-center justify-center transition-all duration-300">
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: VEHICLE */}
      {step === 'vehicle' && (
        <div className="max-w-screen-md mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
              Paso 2 — {localTerrain?.toUpperCase()}
            </p>
            <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight">
              ¿QUÉ ATV TENÉS?
            </h2>
          </div>

          <div className="space-y-6">
            {/* Brand */}
            <div>
              <label className="block text-zinc-500 text-[10px] tracking-[0.2em] uppercase mb-3 font-semibold">Marca</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {vehicleBrands.map(b => (
                  <button key={b.id} onClick={() => { setSelectedBrand(b); setSelectedModelId(''); setSelectedYear('') }}
                    className={cn('py-3 px-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all',
                      selectedBrand?.id === b.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    )}>
                    {selectedBrand?.id === b.id && <Check size={10} className="inline mr-1 text-[var(--accent)]" />}
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            {selectedBrand && (
              <div className="animate-fade-in">
                <label className="block text-zinc-500 text-[10px] tracking-[0.2em] uppercase mb-3 font-semibold">Modelo</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedBrand.models.map(m => (
                    <button key={m.id} onClick={() => { setSelectedModelId(m.id); setSelectedYear('') }}
                      className={cn('py-3 px-4 rounded-xl border text-sm font-medium text-left transition-all flex items-center justify-between',
                        selectedModelId === m.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      )}>
                      {m.name}
                      {selectedModelId === m.id && <Check size={13} className="text-[var(--accent)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Year */}
            {selectedBrand?.models.find(m => m.id === selectedModelId)?.years && (
              <div className="animate-fade-in">
                <label className="block text-zinc-500 text-[10px] tracking-[0.2em] uppercase mb-3 font-semibold">Año (opcional)</label>
                <div className="relative">
                  <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl py-3 px-4 pr-10 text-sm focus:outline-none focus:border-[var(--accent)]">
                    <option value="">Todos los años</option>
                    {selectedBrand.models.find(m => m.id === selectedModelId)?.years?.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Confirm */}
            {selectedBrand && selectedModelId && (
              <div className="pt-2 animate-fade-in">
                <button onClick={handleVehicleConfirm}
                  className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-black text-sm tracking-[0.2em] uppercase rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]">
                  CONFIGURAR {selectedBrand.name} {selectedBrand.models.find(m => m.id === selectedModelId)?.name}
                  {selectedYear ? ` ${selectedYear}` : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step: BUILD — ATV Diagram + products */}
      {step === 'build' && (
        <BuildStep terrain={localTerrain!} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD STEP — diagram + products
// ─────────────────────────────────────────────────────────────────────────────

import { ProductService } from '@/services/productService'
import { getCategoriesByTerrain } from '@/data/categories'

function BuildStep({ terrain }: { terrain: Terrain }) {
  const { state, addItem } = useCart()
  const cats = getCategoriesByTerrain(terrain)
  const [activeCategory, setActiveCategory] = useState<string>(cats[0]?.id ?? '')

  const vehicleFilter = state.vehicle
    ? `${state.vehicle.brand.toLowerCase()}-${state.vehicle.model.toLowerCase().replace(/\s+/g, '-')}`
    : undefined

  const products = ProductService.getFiltered({ terrain, category: activeCategory, vehicleId: vehicleFilter })
  const activeCatLabel = cats.find(c => c.id === activeCategory)?.name ?? ''

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-1">
          Paso 3 — {terrain.toUpperCase()}
          {state.vehicle && ` — ${state.vehicle.brand} ${state.vehicle.model}`}
        </p>
        <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tight">
          ARMÁ TU ATV
        </h2>
        <p className="text-[var(--accent)] text-lg font-black uppercase tracking-widest">
          PARA {terrain.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        {/* Left: Diagram + products */}
        <div>
          {/* ATV Diagram */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
            <ATVDiagram
              terrain={terrain}
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
              categories={cats}
            />
          </div>

          {/* Category pills (scrollable on mobile) */}
          <div className="overflow-x-auto pb-2 mb-6">
            <div className="flex gap-2 min-w-max">
              {cats.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'py-2 px-4 rounded-full text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap',
                    activeCategory === cat.id
                      ? 'bg-[var(--accent)] text-black'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products for active category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold uppercase tracking-wide">{activeCatLabel}</h3>
              <span className="text-zinc-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</span>
            </div>

            {products.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
                <p className="text-zinc-500 text-sm">No hay productos para esta categoría aún.</p>
                <p className="text-zinc-600 text-xs mt-1">Consultanos por WhatsApp para más opciones.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => (
                  <ConfigProductCard key={product.id} product={product} onAdd={() => addItem(product)} terrain={terrain} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Mi configuración */}
        <MiConfiguracion terrain={terrain} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mi configuración panel
// ─────────────────────────────────────────────────────────────────────────────

function MiConfiguracion({ terrain }: { terrain: Terrain }) {
  const { state, removeItem, updateQty, clear } = useCart()
  const waUrl = generateWhatsAppUrl({ items: state.items, vehicle: state.vehicle ?? undefined, terrain })

  return (
    <aside className="xl:sticky xl:top-[126px] xl:self-start">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <p className="text-white font-black uppercase tracking-wide text-sm">Mi ATV</p>
            {state.vehicle && (
              <p className="text-zinc-500 text-xs mt-0.5">{state.vehicle.brand} {state.vehicle.model}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full',
              terrain === 'tierra' ? 'bg-amber-900/40 text-amber-400' : 'bg-yellow-900/40 text-yellow-400'
            )}>
              {terrain.toUpperCase()}
            </span>
            <ShoppingBag size={16} className="text-zinc-500" />
          </div>
        </div>

        {/* Items */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
          {state.items.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag size={28} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-600 text-sm">Todavía no agregaste componentes.</p>
              <p className="text-zinc-700 text-xs mt-1">Hacé click en &quot;+&nbsp;Mi ATV&quot; en cualquier producto.</p>
            </div>
          ) : (
            state.items.map(item => (
              <div key={item.product.id} className="flex gap-3 bg-zinc-800/60 rounded-xl p-3 group">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                  <Image src={item.product.images[0] ?? '/images/placeholder-product.jpg'} alt={item.product.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold leading-tight truncate">{item.product.name}</p>
                  <p className="text-zinc-500 text-[10px]">{item.product.sku}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                      className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white text-xs transition-colors">−</button>
                    <span className="text-white text-xs w-3 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white text-xs transition-colors">+</button>
                    <button onClick={() => removeItem(item.product.id)} className="ml-auto text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <X size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        {state.items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 space-y-2">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--accent)] text-black font-black text-xs tracking-[0.15em] uppercase rounded-full hover:bg-[var(--accent-hover)] transition-all">
              <MessageCircle size={15} />
              CONSULTAR POR WHATSAPP
            </a>
            <button onClick={clear} className="w-full py-2 text-zinc-600 text-xs hover:text-zinc-400 transition-colors">
              Vaciar
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Configurator product card
// ─────────────────────────────────────────────────────────────────────────────

function ConfigProductCard({ product, onAdd, terrain }: { product: Product; onAdd: () => void; terrain: Terrain }) {
  const { state } = useCart()
  const isInCart = state.items.some(i => i.product.id === product.id)
  const waUrl = generateWhatsAppUrl({ product, terrain, vehicle: state.vehicle ?? undefined })

  return (
    <div className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-600 transition-all group">
      <Link href={`/productos/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800">
          <Image src={product.images[0] ?? '/images/placeholder-product.jpg'} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" />
        </div>
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-zinc-500 text-[10px] font-mono">{product.sku}</p>
          <Link href={`/productos/${product.slug}`}>
            <p className="text-white text-xs font-semibold leading-snug hover:text-[var(--accent)] transition-colors truncate">{product.name}</p>
          </Link>
          <p className="text-[var(--accent)] text-sm font-bold mt-0.5">{formatPrice(product.price)}</p>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onAdd}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all',
              isInCart ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            )}>
            {isInCart ? <><Check size={10} />Agregado</> : <><Plus size={10} />Mi ATV</>}
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-9 rounded-lg bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] transition-all">
            <MessageCircle size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Grid / List for catalog tab
// ─────────────────────────────────────────────────────────────────────────────

function ProductGrid({ products }: { products: Product[] }) {
  const { addItem, state } = useCart()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product, i) => {
        const isInCart = state.items.some(it => it.product.id === product.id)
        const isLarge = i % 7 === 0
        const waUrl = generateWhatsAppUrl({ product, terrain: state.terrain ?? undefined, vehicle: state.vehicle ?? undefined })
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
                {isInCart ? <><Check size={11} /> En mi ATV</> : <><Plus size={11} /> Mi ATV</>}
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
                onClick={e => e.stopPropagation()}>
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
        const waUrl = generateWhatsAppUrl({ product, terrain: state.terrain ?? undefined, vehicle: state.vehicle ?? undefined })
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
                  {isInCart ? 'En mi ATV' : 'Mi ATV'}
                </button>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
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
