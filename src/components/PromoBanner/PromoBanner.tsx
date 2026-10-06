import Image from 'next/image'
import Link from 'next/link'
import { getActivePromotion, type Promotion } from '@/services/promotion'
import { formatPrice } from '@/utils/formatPrice'

// Se usa cuando no hay ninguna promoción vigente cargada en Sanity.
const FALLBACK: Promotion = {
  eyebrow: 'Temporada 2026',
  title: 'Promociones\nde la semana',
  description:
    'Descuentos en repuestos seleccionados y envíos bonificados en compras superiores a determinado monto. Consultanos por tu modelo.',
  cta: { label: 'Quiero saber más', href: '/contacto', external: false },
  items: [],
}

export default async function PromoBanner() {
  const promo = (await getActivePromotion()) ?? FALLBACK
  const { cta } = promo

  const button = cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className="mb-btn mb-btn-solid">
      {cta.label}
    </a>
  ) : (
    <Link href={cta.href} className="mb-btn mb-btn-solid">
      {cta.label}
    </Link>
  )

  return (
    <section
      className="relative overflow-hidden border-y border-white/10"
      style={{ background: 'linear-gradient(120deg, #0a0a0a 0%, #0a0a0a 46%, #e2001a 46%, #a4001a 100%)' }}
      aria-labelledby="promo-heading"
    >
      {/* Textura a cuadros sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(0,0,0,0.35) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.35) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.35) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.35) 75%)',
          backgroundSize: '26px 26px',
          backgroundPosition: '0 0, 0 13px, 13px -13px, -13px 0',
        }}
      />

      <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 py-[clamp(46px,7vw,74px)] max-sm:flex-col max-sm:items-start">
        <div>
          {promo.eyebrow && (
            <div className="mb-eyebrow !justify-start"><span>{promo.eyebrow}</span></div>
          )}
          <h2
            id="promo-heading"
            className="mb-3 -skew-x-8 whitespace-pre-line font-display text-[clamp(28px,5vw,46px)] uppercase leading-[1.05] tracking-[1px] text-white"
          >
            {promo.title}
          </h2>
          {promo.description && (
            <p className="m-0 max-w-[420px] whitespace-pre-line text-sm leading-relaxed tracking-[0.5px] text-white/85">
              {promo.description}
            </p>
          )}
          {promo.items.length > 0 && <div className="mt-6">{button}</div>}
        </div>

        {promo.items.length > 0 ? (
          <ul className="grid w-full gap-3 sm:w-auto sm:grid-cols-[repeat(auto-fit,minmax(170px,190px))]" aria-label="Productos en promoción">
            {promo.items.map(({ product, salePrice }) => {
              const onSale = salePrice != null && product.price != null && salePrice < product.price
              return (
                <li key={product.id}>
                  <Link
                    href={`/productos/${product.slug}`}
                    className="group flex h-full gap-3 rounded-sm border border-white/15 bg-black/55 p-3 backdrop-blur-sm transition-colors hover:border-white/60 sm:flex-col"
                  >
                    <div className="relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-sm bg-zinc-800 sm:w-full">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 640px) 190px, 80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {onSale && (
                        <span className="absolute left-1.5 top-1.5 rounded-sm bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                          -{Math.round((1 - salePrice / product.price!) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-[13px] font-medium leading-snug text-white">{product.name}</span>
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        {onSale && (
                          <span className="text-xs text-white/55 line-through">{formatPrice(product.price)}</span>
                        )}
                        <span className="text-sm font-bold text-white">{formatPrice(salePrice ?? product.price)}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          button
        )}
      </div>
    </section>
  )
}
