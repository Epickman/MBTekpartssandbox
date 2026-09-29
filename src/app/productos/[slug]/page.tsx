import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, ArrowLeft, Package, Tag, Truck } from 'lucide-react'
import { ProductService } from '@/services/productService'
import { products } from '@/data/products'
import { formatPrice, formatStock } from '@/utils/formatPrice'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

// Static params for build-time generation
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = ProductService.getBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = ProductService.getBySlug(slug)
  if (!product) notFound()

  const related = ProductService.getByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-zinc-950 pt-[80px]">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Volver al catálogo
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
            <Image
              src={product.images[0] ?? '/images/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex gap-2 mb-3">
                {product.terrain.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-white text-2xl sm:text-4xl font-black tracking-tight uppercase leading-tight">
                {product.name}
              </h1>
            </div>

            {/* SKU + Stock */}
            <div className="flex items-center gap-6 py-4 border-y border-zinc-800">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-zinc-500" />
                <span className="text-zinc-400 text-sm">SKU: <span className="text-white">{product.sku}</span></span>
              </div>
              {product.stock !== undefined && (
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-zinc-500" />
                  <span
                    className={
                      product.stock === 0
                        ? 'text-red-400 text-sm'
                        : product.stock <= 3
                        ? 'text-amber-400 text-sm'
                        : 'text-green-400 text-sm'
                    }
                  >
                    {formatStock(product.stock)}
                  </span>
                </div>
              )}
            </div>

            {/* Compatibility */}
            {product.vehicles.length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-2">Compatibilidad</p>
                <div className="flex flex-wrap gap-2">
                  {product.vehicles.map((v) => (
                    <span key={v} className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300">
                      {v.replace(/-/g, ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <p className="text-3xl font-black text-white">{formatPrice(product.price)}</p>
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-3">Especificaciones</p>
                <dl className="space-y-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm py-2 border-b border-zinc-800">
                      <dt className="text-zinc-500">{key}</dt>
                      <dd className="text-white font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Client-side CTAs */}
            <ProductDetailClient product={product} />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all group"
                >
                  <div className="relative aspect-square bg-zinc-800 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={p.images[0] ?? '/images/placeholder-product.jpg'}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-zinc-500 text-xs mb-1">{p.sku}</p>
                  <h3 className="text-white text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-white font-bold text-sm mt-2">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
