'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, X, MessageCircle, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { generateWhatsAppUrl } from '@/utils/whatsapp'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

export default function Cart() {
  const { state, removeItem, updateQty, clear, totalItems } = useCart()
  const [open, setOpen] = useState(false)

  const waUrl = generateWhatsAppUrl({
    items: state.items,
    vehicle: state.vehicle ?? undefined,
    terrain: state.terrain ?? undefined,
  })

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-2 py-3 px-5 rounded-full shadow-2xl transition-all duration-300',
          'bg-zinc-900 border border-zinc-700 text-white hover:border-[var(--accent)]',
          totalItems === 0 && 'opacity-0 pointer-events-none translate-y-4'
        )}
        aria-label={`Mi ATV — ${totalItems} producto${totalItems !== 1 ? 's' : ''}`}
        aria-expanded={open}
      >
        <ShoppingBag size={18} />
        <span className="text-sm font-bold">Mi ATV</span>
        <span className="bg-[var(--accent)] text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col',
          'transition-transform duration-400 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mi configuración de ATV"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-white font-black text-lg tracking-wide uppercase">Mi ATV</h2>
            {(state.terrain || state.vehicle) && (
              <p className="text-zinc-500 text-xs mt-0.5">
                {[
                  state.terrain?.toUpperCase(),
                  state.vehicle && `${state.vehicle.brand} ${state.vehicle.model}`,
                ]
                  .filter(Boolean)
                  .join(' — ')}
              </p>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={40} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Tu ATV está vacío.</p>
              <p className="text-zinc-600 text-sm mt-1">Agregá productos desde el catálogo.</p>
              <Link
                href="/configurador"
                className="inline-block mt-6 py-2.5 px-6 bg-[var(--accent)] text-black font-bold text-sm rounded-full"
                onClick={() => setOpen(false)}
              >
                Empezar configuración
              </Link>
            </div>
          ) : (
            state.items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-zinc-900 rounded-xl border border-zinc-800 p-3"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  <Image
                    src={item.product.images[0] ?? '/images/placeholder-product.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.product.sku}</p>
                  <p className="text-[var(--accent)] text-sm font-bold mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                    aria-label={`Quitar ${item.product.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQty(item.product.id, item.quantity - 1)
                          : removeItem(item.product.id)
                      }
                      className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        {state.items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-black font-black text-sm tracking-[0.1em] uppercase rounded-full hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02]"
            >
              <MessageCircle size={18} />
              CONSULTAR POR WHATSAPP
            </a>
            <button
              onClick={clear}
              className="w-full py-2.5 text-zinc-500 text-xs font-medium hover:text-zinc-300 transition-colors"
              aria-label="Vaciar mi ATV"
            >
              Vaciar mi ATV
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
