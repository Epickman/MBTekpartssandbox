'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import VehicleDiagram from '@/components/VehicleDiagram/VehicleDiagram'
import { useCart } from '@/store/cartStore'
import { useProducts } from '@/store/productsContext'
import { categories } from '@/data/categories'
import { productFitsVehicleType } from '@/data/vehicleBrands'
import { vehicleDiagrams, type DiagramType } from '@/data/vehicleDiagrams'
import type { Product } from '@/types'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

export default function PersonalizarClient({ type }: { type: DiagramType | null }) {
  if (!type) return <VehicleChooser />
  return <Customizer type={type} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Paso inicial: elegir qué personalizar
// ─────────────────────────────────────────────────────────────────────────────

function VehicleChooser() {
  const catalog = useProducts()

  return (
    <div className="min-h-screen bg-zinc-950 pt-[120px] pb-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-500">MBTEK Parts</p>
          <h1
            className="font-black uppercase leading-[0.9] tracking-tight text-white"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
          >
            ¿Qué querés <span className="text-[var(--accent)]">personalizar</span>?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            Elegí tu vehículo y tocá cada parte para ver qué componente tenés en el carrito.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Object.values(vehicleDiagrams).map((d) => {
            const available = catalog.filter((p) => productFitsVehicleType(p, d.type)).length
            return (
              <Link
                key={d.type}
                href={`/personalizar?tipo=${d.type}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] sm:p-8"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={d.img.src}
                    alt={`Ilustración de ${d.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tight text-white">{d.name}</h2>
                    <p className="mt-1 text-sm text-zinc-400">{d.description}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {available > 0
                        ? `${available} producto${available !== 1 ? 's' : ''} compatible${available !== 1 ? 's' : ''}`
                        : 'Próximamente más productos'}
                    </p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-2 rounded-sm bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-white transition-colors group-hover:bg-[var(--accent-hover)]">
                    Personalizar <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Personalizador del vehículo elegido
// ─────────────────────────────────────────────────────────────────────────────

function Customizer({ type }: { type: DiagramType }) {
  const diagram = vehicleDiagrams[type]
  const catalog = useProducts()
  const { state, addItem, removeItem, updateQty, totalItems, openCart } = useCart()
  const [active, setActive] = useState<string | null>(null)

  const fits = (p: Product) => productFitsVehicleType(p, type)
  // Sólo cuentan los productos del carrito que le sirven a este vehículo
  const cartItems = state.items.filter((i) => fits(i.product))

  // Unidades en el carrito por categoría (= parte del vehículo)
  const cartCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of state.items) {
      if (!productFitsVehicleType(item.product, type)) continue
      counts[item.product.category] = (counts[item.product.category] ?? 0) + item.quantity
    }
    return counts
  }, [state.items, type])

  const coveredParts = categories.filter((c) => cartCounts[c.id]).length
  const activeCategory = categories.find((c) => c.id === active) ?? null
  const inCart = cartItems.filter((i) => i.product.category === active)
  const options = catalog.filter((p) => p.category === active && fits(p))

  return (
    <div className="min-h-screen bg-zinc-950 pt-[120px] pb-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/personalizar"
              className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft size={12} /> Cambiar vehículo
            </Link>
            <h1
              className="font-black uppercase leading-[0.9] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
            >
              Personalizá tu <span className="text-[var(--accent)]">{diagram.name}</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
              Tocá cada parte para ver qué componente tenés en el carrito y sumar los que te faltan.
            </p>
            {/* ATV / MX switch */}
            <div className="mt-5 inline-flex rounded-full border border-zinc-800 bg-zinc-900 p-1" role="tablist" aria-label="Vehículo">
              {Object.values(vehicleDiagrams).map((d) => (
                <Link
                  key={d.type}
                  href={`/personalizar?tipo=${d.type}`}
                  role="tab"
                  aria-selected={d.type === type}
                  className={cn(
                    'rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-[1.5px] transition-colors',
                    d.type === type ? 'bg-[var(--accent)] text-white' : 'text-zinc-400 hover:text-white'
                  )}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Partes cubiertas</p>
              <p className="text-lg font-black text-white">
                {coveredParts}
                <span className="text-zinc-500"> / {categories.length}</span>
              </p>
            </div>
            <button
              onClick={openCart}
              className="flex items-center gap-2 rounded-sm bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              <ShoppingCart size={15} />
              Ver carrito ({totalItems})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* ── Diagram ─────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 sm:p-6 lg:sticky lg:top-[120px] lg:self-start">
            <VehicleDiagram
              diagram={diagram}
              categories={categories}
              activeCategory={active}
              onCategorySelect={setActive}
              cartCounts={cartCounts}
            />

            {/* Parts as chips — same info as the diagram, easier on small screens */}
            <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label={`Partes del ${diagram.name}`}>
              {categories.map((cat) => {
                const count = cartCounts[cat.id] ?? 0
                return (
                  <li key={cat.id}>
                  <button
                    onClick={() => setActive(cat.id)}
                    aria-pressed={active === cat.id}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      active === cat.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-white'
                        : count > 0
                          ? 'border-green-500/50 bg-green-500/10 text-green-300 hover:border-green-400'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                    )}
                  >
                    {count > 0 && <Check size={12} />}
                    {cat.name}
                    {count > 0 && <span className="text-[10px] opacity-80">×{count}</span>}
                  </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── Part panel ──────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
            {!activeCategory ? (
              <PartsSummary name={diagram.name} cartCounts={cartCounts} onSelect={setActive} />
            ) : (
              <div className="animate-fade-in" key={activeCategory.id}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Parte seleccionada</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                  {activeCategory.name}
                </h2>

                {/* In cart */}
                <section className="mt-5" aria-labelledby="en-carrito">
                  <h3 id="en-carrito" className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    En tu carrito
                  </h3>
                  {inCart.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-zinc-700 px-4 py-4 text-sm text-zinc-500">
                      No tenés ningún componente de {activeCategory.name.toLowerCase()} en el carrito.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {inCart.map((item) => (
                        <li
                          key={item.product.id}
                          className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-2.5"
                        >
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                            <Image
                              src={item.product.images[0] ?? '/images/placeholder-product.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/productos/${item.product.slug}`}
                              className="line-clamp-2 text-sm font-semibold leading-tight text-white hover:text-[var(--accent)]"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-zinc-400">{formatPrice(item.product.price)}</p>
                          </div>
                          <div className="flex items-center rounded-full border border-zinc-700">
                            <button
                              onClick={() =>
                                item.quantity > 1
                                  ? updateQty(item.product.id, item.quantity - 1)
                                  : removeItem(item.product.id)
                              }
                              className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white"
                              aria-label={`Reducir cantidad de ${item.product.name}`}
                            >
                              {item.quantity > 1 ? <Minus size={12} /> : <Trash2 size={12} />}
                            </button>
                            <span className="w-5 text-center text-sm text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white"
                              aria-label={`Aumentar cantidad de ${item.product.name}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Options */}
                <section className="mt-7" aria-labelledby="opciones">
                  <h3 id="opciones" className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Opciones para esta parte
                  </h3>
                  {options.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Todavía no tenemos productos de {activeCategory.name.toLowerCase()} para {diagram.name}.{' '}
                      <Link href="/contacto" className="text-[var(--accent)] hover:underline">Consultanos</Link>.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {options.map((product) => {
                        const added = state.items.some((i) => i.product.id === product.id)
                        return (
                          <li
                            key={product.id}
                            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5"
                          >
                            <Link
                              href={`/productos/${product.slug}`}
                              className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800"
                            >
                              <Image
                                src={product.images[0] ?? '/images/placeholder-product.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/productos/${product.slug}`}
                                className="line-clamp-2 text-sm font-semibold leading-tight text-white hover:text-[var(--accent)]"
                              >
                                {product.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-zinc-400">
                                {formatPrice(product.price)}
                                {product.stock !== undefined && (
                                  <span className={cn('ml-2', product.stock === 0 ? 'text-red-400' : 'text-zinc-500')}>
                                    {formatStock(product.stock)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <button
                              onClick={() => addItem(product)}
                              className={cn(
                                'flex flex-shrink-0 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase transition-colors',
                                added
                                  ? 'border-green-500/40 bg-green-500/10 text-green-300'
                                  : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-[var(--accent)] hover:text-white'
                              )}
                              aria-label={added ? `Sumar otro ${product.name}` : `Agregar ${product.name}`}
                            >
                              {added ? <Check size={12} /> : <Plus size={12} />}
                              {added ? 'Agregado' : 'Agregar'}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Panel inicial: resumen de qué partes ya tienen componente en el carrito */
function PartsSummary({
  name,
  cartCounts,
  onSelect,
}: {
  name: string
  cartCounts: Record<string, number>
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-white">Tu {name}</h2>
      <p className="mt-1 text-sm text-zinc-400">Elegí una parte en el diagrama o en la lista.</p>
      <ul className="mt-5 divide-y divide-zinc-800">
        {categories.map((cat) => {
          const count = cartCounts[cat.id] ?? 0
          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                className="flex w-full items-center justify-between py-3 text-left text-sm transition-colors hover:text-white"
              >
                <span className={count > 0 ? 'text-white' : 'text-zinc-400'}>{cat.name}</span>
                {count > 0 ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-400">
                    <Check size={13} /> {count} en el carrito
                  </span>
                ) : (
                  <span className="text-xs text-zinc-600">Sin componente →</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
