'use client'

import { MessageCircle, Plus, Check } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductDetailClient({ product }: Props) {
  const { addItem, state } = useCart()
  const isInCart = state.items.some((i) => i.product.id === product.id)

  const waUrl = generateWhatsAppUrl({
    product,
    terrain: state.terrain ?? undefined,
    vehicle: state.vehicle ?? undefined,
    url: `${typeof window !== 'undefined' ? window.location.href : ''}`,
  })

  return (
    <div className="flex flex-col gap-3 pt-2">
      <button
        onClick={() => addItem(product)}
        className={`w-full py-4 rounded-full font-black text-sm tracking-[0.2em] uppercase transition-all ${
          isInCart
            ? 'bg-zinc-800 border border-[var(--accent)] text-[var(--accent)]'
            : 'bg-zinc-800 border border-zinc-600 text-white hover:border-[var(--accent)] hover:text-[var(--accent)]'
        }`}
      >
        {isInCart ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={16} />
            Agregado a mi ATV
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus size={16} />
            Agregar a mi ATV
          </span>
        )}
      </button>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-black text-sm tracking-[0.2em] uppercase rounded-full transition-all hover:scale-[1.02]"
      >
        <MessageCircle size={18} />
        COMPRAR POR WHATSAPP
      </a>
    </div>
  )
}
