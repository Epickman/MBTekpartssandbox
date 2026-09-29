'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Plus } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import type { Product } from '@/types'
import { cn } from '@/utils/cn'

interface ProductCardProps {
  product: Product
  className?: string
  size?: 'default' | 'large' | 'small'
}

export default function ProductCard({ product, className, size = 'default' }: ProductCardProps) {
  const { addItem, state } = useCart()
  const isInCart = state.items.some((i) => i.product.id === product.id)

  const waUrl = generateWhatsAppUrl({
    product,
    terrain: state.terrain ?? undefined,
    vehicle: state.vehicle ?? undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/productos/${product.slug}`,
  })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800',
        'hover:border-zinc-600 transition-all duration-300',
        size === 'large' && 'sm:col-span-2',
        className
      )}
    >
      <Link href={`/productos/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
        {/* Image */}
        <div className={cn('relative overflow-hidden bg-zinc-800', size === 'large' ? 'aspect-[16/9]' : 'aspect-square')}>
          <Image
            src={product.images[0] ?? '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Terrain badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.terrain.map((t) => (
              <span
                key={t}
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-black/60 text-zinc-300 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex items-center gap-2 py-2.5 px-5 rounded-full text-sm font-bold tracking-wide transition-all',
                isInCart
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-white text-black hover:bg-[var(--accent)]'
              )}
              aria-label={isInCart ? 'Ya agregado a mi ATV' : 'Agregar a mi ATV'}
            >
              <Plus size={14} />
              {isInCart ? 'Agregado' : 'Agregar'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">{product.sku}</span>
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[var(--accent)] transition-colors">
            {product.name}
          </h3>

          {/* Vehicle compatibility */}
          {product.vehicles.length > 0 && (
            <p className="text-zinc-500 text-xs truncate">
              {product.vehicles.slice(0, 2).join(' · ')}
              {product.vehicles.length > 2 && ` +${product.vehicles.length - 2}`}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-white font-bold text-sm">
              {formatPrice(product.price)}
            </span>
            {product.stock !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-medium',
                  product.stock === 0 ? 'text-red-400' : product.stock <= 3 ? 'text-amber-400' : 'text-green-400'
                )}
              >
                {formatStock(product.stock)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action row */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all',
            isInCart
              ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          )}
          aria-label={isInCart ? 'Ya en mi ATV' : 'Agregar a mi ATV'}
        >
          {isInCart ? '✓ En mi ATV' : '+ Mi ATV'}
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--accent)] text-black text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
          aria-label="Comprar por WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle size={13} />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </article>
  )
}
