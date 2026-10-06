/**
 * Catálogo desde Sanity (proyecto "MBTEK Parts").
 * El panel para cargar productos está en https://mbtek-parts.sanity.studio
 * El dataset es público para lectura, así que no hace falta token.
 */

import type { Product, Terrain } from '@/types'

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? '7ixwdoq9'
const DATASET = process.env.SANITY_DATASET ?? 'production'
const API_VERSION = '2026-09-30'
const REVALIDATE_SECONDS = 60
const PLACEHOLDER = '/images/placeholder-product.jpg'

const PRODUCTS_QUERY = `*[_type == "product" && defined(name)] | order(name asc){
  _id,
  name,
  sku,
  category,
  terrain,
  vehicles,
  "images": images[].asset->url,
  price,
  stock,
  description,
  specs[]{label, value},
  featured,
  tags
}`

interface SanityProduct {
  _id: string
  name?: string
  sku?: string
  category?: string
  terrain?: Terrain[] | null
  vehicles?: string[] | null
  images?: (string | null)[] | null
  price?: number | null
  stock?: number | null
  description?: string | null
  specs?: { label?: string; value?: string }[] | null
  featured?: boolean | null
  tags?: string[] | null
}

// La dirección del producto se arma con el nombre: "Kit Filtro de Aire" -> "kit-filtro-de-aire".
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toProduct(d: SanityProduct, slug: string): Product {
  const images = (d.images ?? []).filter((u): u is string => !!u)
  const specs = Object.fromEntries(
    (d.specs ?? []).filter((s) => s.label).map((s) => [s.label as string, s.value ?? ''])
  )
  return {
    id: d._id,
    name: d.name ?? 'Producto sin nombre',
    slug,
    sku: d.sku ?? '',
    category: d.category ?? 'accesorios',
    terrain: d.terrain?.length ? d.terrain : ['tierra', 'arena'],
    vehicles: d.vehicles ?? [],
    images: images.length ? images : [PLACEHOLDER],
    price: d.price ?? undefined,
    stock: d.stock ?? undefined,
    description: d.description ?? '',
    specs: Object.keys(specs).length ? specs : undefined,
    featured: d.featured ?? false,
    tags: d.tags ?? [],
  }
}

/** Productos publicados en Sanity, o null si Sanity no respondió. */
export async function getSanityProducts(): Promise<Product[] | null> {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(PRODUCTS_QUERY)}`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity-products'] } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { result } = (await res.json()) as { result: SanityProduct[] }
    const used = new Set<string>()
    return result.map((d) => {
      let slug = slugify(d.name ?? '') || d._id
      if (used.has(slug)) slug = `${slug}-${slugify(d.sku || d._id)}`
      used.add(slug)
      return toProduct(d, slug)
    })
  } catch (err) {
    console.error('[Sanity]', err instanceof Error ? err.message : err)
    return null
  }
}
