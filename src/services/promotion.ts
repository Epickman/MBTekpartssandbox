/**
 * Promoción de la semana, cargada en Sanity (tipo "promotion").
 * Se muestra la activa cuya fecha está vigente; si hay varias, la que empezó más recientemente.
 */

import type { Product } from '@/types'
import siteConfig from '@/config/site'
import { getLiveProducts } from '@/services/liveProducts'

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? '7ixwdoq9'
const DATASET = process.env.SANITY_DATASET ?? 'production'
const API_VERSION = '2026-09-30'
const REVALIDATE_SECONDS = 60

const PROMO_QUERY = `*[_type == "promotion" && active != false
  && (!defined(startsAt) || startsAt <= now())
  && (!defined(endsAt) || endsAt > now())
] | order(coalesce(startsAt, _createdAt) desc)[0]{
  eyebrow, title, description, ctaLabel, ctaType, ctaWhatsappMessage, ctaCategory, ctaUrl,
  "items": items[]{ "productId": product._ref, salePrice }
}`

interface SanityPromotion {
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaType?: 'whatsapp' | 'category' | 'link' | null
  ctaWhatsappMessage?: string | null
  ctaCategory?: string | null
  ctaUrl?: string | null
  items?: { productId?: string; salePrice?: number | null }[] | null
}

export interface PromotionItem {
  product: Product
  salePrice?: number
}

export interface Promotion {
  eyebrow?: string
  title: string
  description?: string
  cta: { label: string; href: string; external: boolean }
  items: PromotionItem[]
}

function ctaHref(p: SanityPromotion, title: string): { href: string; external: boolean } {
  if (p.ctaType === 'category' && p.ctaCategory) {
    return { href: `/productos?categoria=${p.ctaCategory}`, external: false }
  }
  if (p.ctaType === 'link' && p.ctaUrl) {
    return { href: p.ctaUrl, external: /^https?:\/\//.test(p.ctaUrl) }
  }
  const message = p.ctaWhatsappMessage || `Hola ${siteConfig.whatsappName} 👋 Quiero aprovechar la promoción: ${title}`
  return { href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, external: true }
}

/** La promoción vigente, o null si no hay ninguna (o Sanity no respondió). */
export async function getActivePromotion(): Promise<Promotion | null> {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(PROMO_QUERY)}`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity-promotion'] } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { result } = (await res.json()) as { result: SanityPromotion | null }
    if (!result?.title) return null

    const byId = new Map((await getLiveProducts()).map((p) => [p.id, p]))
    const items = (result.items ?? []).flatMap((i) => {
      const product = i.productId ? byId.get(i.productId) : undefined
      return product ? [{ product, salePrice: i.salePrice ?? undefined }] : []
    })

    return {
      eyebrow: result.eyebrow ?? undefined,
      title: result.title,
      description: result.description ?? undefined,
      cta: { label: result.ctaLabel || 'Quiero saber más', ...ctaHref(result, result.title) },
      items,
    }
  } catch (err) {
    console.error('[Promoción]', err instanceof Error ? err.message : err)
    return null
  }
}
