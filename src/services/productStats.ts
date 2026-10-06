/**
 * Estadísticas de cada producto guardadas en Sanity (un documento "productStats" por producto).
 *   views  = veces que se abrió la página del producto (una por visitante y sesión)
 *   orders = veces que se envió un pedido por WhatsApp que lo incluía
 * Leer es público; escribir necesita SANITY_WRITE_TOKEN y solo se hace desde /api/stats.
 */

import type { Product } from '@/types'

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? '7ixwdoq9'
const DATASET = process.env.SANITY_DATASET ?? 'production'
const API_VERSION = '2026-09-30'
const REVALIDATE_SECONDS = 300

// Un pedido pesa más que una visita al armar el ranking.
const ORDER_WEIGHT = 5

export type StatEvent = 'view' | 'order'

export interface ProductStat {
  productId: string
  views: number
  orders: number
}

const statsDocId = (productId: string) => `productStats-${productId}`

export async function getProductStats(): Promise<ProductStat[]> {
  const query = `*[_type == "productStats"]{productId, views, orders}`
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: ['product-stats'] } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { result } = (await res.json()) as { result: Partial<ProductStat>[] }
    return result
      .filter((s) => !!s.productId)
      .map((s) => ({ productId: s.productId as string, views: s.views ?? 0, orders: s.orders ?? 0 }))
  } catch (err) {
    console.error('[Stats]', err instanceof Error ? err.message : err)
    return []
  }
}

/**
 * Los más pedidos y consultados primero. Si todavía no hay datos suficientes,
 * completa con los destacados y después con el resto del catálogo.
 */
export function rankProducts(products: Product[], stats: ProductStat[], limit: number): Product[] {
  const score = new Map(stats.map((s) => [s.productId, s.orders * ORDER_WEIGHT + s.views]))
  const ranked = products
    .filter((p) => (score.get(p.id) ?? 0) > 0)
    .sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0))
  const rest = products
    .filter((p) => !score.get(p.id))
    .sort((a, b) => Number(b.featured) - Number(a.featured))
  return [...ranked, ...rest].slice(0, limit)
}

/** Suma 1 al contador de cada producto. Devuelve false si falta el token o Sanity falla. */
export async function recordProductEvent(event: StatEvent, productIds: string[]): Promise<boolean> {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    console.warn('[Stats] Falta SANITY_WRITE_TOKEN; no se guardan estadísticas.')
    return false
  }
  const field = event === 'view' ? 'views' : 'orders'
  const mutations = productIds.flatMap((productId) => [
    { createIfNotExists: { _id: statsDocId(productId), _type: 'productStats', productId, views: 0, orders: 0 } },
    { patch: { id: statsDocId(productId), inc: { [field]: 1 } } },
  ])
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?visibility=async`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ mutations }),
    }
  )
  if (!res.ok) console.error('[Stats] Sanity respondió', res.status, await res.text())
  return res.ok
}
