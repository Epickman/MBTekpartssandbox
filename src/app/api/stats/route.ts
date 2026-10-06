/**
 * POST /api/stats  { event: 'view' | 'order', ids: string[] }
 * Registra visitas a productos y pedidos por WhatsApp. Lo llama trackProducts() desde el navegador.
 */
import { NextResponse } from 'next/server'
import { getLiveProducts } from '@/services/liveProducts'
import { recordProductEvent, type StatEvent } from '@/services/productStats'

const MAX_IDS = 30

export async function POST(request: Request) {
  let body: { event?: unknown; ids?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const event = body.event
  if (event !== 'view' && event !== 'order') {
    return NextResponse.json({ error: 'event debe ser "view" u "order"' }, { status: 400 })
  }
  if (!Array.isArray(body.ids) || body.ids.length === 0 || body.ids.length > MAX_IDS) {
    return NextResponse.json({ error: `ids debe tener entre 1 y ${MAX_IDS} elementos` }, { status: 400 })
  }

  // Solo se cuentan productos que existen en el catálogo, así nadie puede crear contadores basura.
  const known = new Set((await getLiveProducts()).map((p) => p.id))
  const ids = [...new Set(body.ids)].filter((id): id is string => typeof id === 'string' && known.has(id))
  if (ids.length === 0) return NextResponse.json({ error: 'Producto desconocido' }, { status: 404 })

  const ok = await recordProductEvent(event as StatEvent, ids)
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 })
}
