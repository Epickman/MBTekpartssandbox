/**
 * /api/contabilium — Secure server-side proxy for Contabilium REST API.
 *
 * Frontend never touches Contabilium directly — credentials stay server-side.
 *
 * Required env vars in .env.local:
 *   CONTABILIUM_CLIENT_ID      = tu@email.com
 *   CONTABILIUM_CLIENT_SECRET  = api_key_de_mi_cuenta
 *
 * Usage from the browser:
 *   /api/contabilium?action=products
 *   /api/contabilium?action=product&sku=MBKT-001
 *   /api/contabilium?action=stock&sku=MBKT-001
 *   /api/contabilium?action=price&sku=MBKT-001
 */

import { NextResponse } from 'next/server'
import { ContabiliumService } from '@/services/contabilium'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Guard: reject immediately if credentials are not set
  if (!process.env.CONTABILIUM_CLIENT_ID || !process.env.CONTABILIUM_CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Contabilium not configured. Set CONTABILIUM_CLIENT_ID and CONTABILIUM_CLIENT_SECRET in .env.local' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'products': {
        const products = await ContabiliumService.getConceptos()
        return NextResponse.json({ data: products })
      }

      case 'product': {
        const sku = searchParams.get('sku')
        if (!sku) return NextResponse.json({ error: 'Missing ?sku=' }, { status: 400 })
        const product = await ContabiliumService.getByCodigo(sku)
        return NextResponse.json({ data: product })
      }

      case 'stock': {
        const sku = searchParams.get('sku')
        if (!sku) return NextResponse.json({ error: 'Missing ?sku=' }, { status: 400 })
        const stock = await ContabiliumService.getStock(sku)
        return NextResponse.json({ data: { stock } })
      }

      case 'price': {
        const sku = searchParams.get('sku')
        if (!sku) return NextResponse.json({ error: 'Missing ?sku=' }, { status: 400 })
        const price = await ContabiliumService.getPrice(sku)
        return NextResponse.json({ data: { price } })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action "${action}". Valid: products, product, stock, price` },
          { status: 400 }
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Contabilium]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
