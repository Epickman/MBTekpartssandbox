import type { Product } from '@/types'
import { products as localProducts } from '@/data/products'
import { getSanityProducts } from '@/services/sanityProducts'

/** Catálogo de Sanity; si Sanity no responde, usa la lista local de ejemplo. */
export async function getLiveProducts(): Promise<Product[]> {
  return (await getSanityProducts()) ?? localProducts
}

export async function getLiveBySlug(slug: string): Promise<Product | undefined> {
  return (await getLiveProducts()).find((p) => p.slug === slug)
}
