/**
 * Contabilium API service — SERVER SIDE ONLY
 *
 * Authentication flow (reverse-engineered from official WooCommerce plugin):
 *   1. POST https://wp.contabilium.com/token
 *      body: grant_type=client_credentials&client_id={email}&client_secret={api_key}
 *      → { access_token: "..." }
 *   2. GET  https://rest.contabilium.com/{endpoint}
 *      header: Authorization: Bearer {access_token}
 *
 * Env vars required (.env.local):
 *   CONTABILIUM_CLIENT_ID     — tu email de Contabilium
 *   CONTABILIUM_CLIENT_SECRET — API Key de Mi Cuenta > Configuración > API
 *
 * Never import this file in client components.
 */

// ─── Base URLs (from official WooCommerce plugin ContabiliumRoutes.php) ────────
const TOKEN_URL = 'https://wp.contabilium.com/token'
const REST_BASE = 'https://rest.contabilium.com'

// ─── In-memory token cache ─────────────────────────────────────────────────────
// Next.js server processes stay alive between requests, so this persists for the
// lifetime of the server process (~5 h matches what Contabilium recommends).
let cachedToken: string | null = null
let tokenExpiresAt = 0

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ContabiliumConcepto {
  Id: number
  Codigo: string       // SKU — matches product.sku in our catalog
  Nombre: string
  Descripcion: string
  Precio: number       // Price WITHOUT tax (IVA)
  PrecioFinal: number  // Price WITH tax (IVA) — show this to customers
  Stock: number
  Activo: boolean
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

function getCredentials() {
  const clientId     = process.env.CONTABILIUM_CLIENT_ID
  const clientSecret = process.env.CONTABILIUM_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error(
      'Contabilium not configured. Set CONTABILIUM_CLIENT_ID and CONTABILIUM_CLIENT_SECRET in .env.local'
    )
  }
  return { clientId, clientSecret }
}

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s margin)
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken
  }

  const { clientId, clientSecret } = getCredentials()

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`Contabilium token request failed (${res.status}): ${text}`)
  }

  const data = await res.json() as { access_token?: string; expires_in?: number }
  if (!data.access_token) {
    throw new Error('Contabilium did not return an access_token')
  }

  // Cache for returned expiry (default 5 h = 18000 s)
  const expiresIn = data.expires_in ?? 18_000
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + expiresIn * 1000

  return cachedToken
}

// ─── REST helper ───────────────────────────────────────────────────────────────

async function restGet<T>(path: string): Promise<T> {
  const token = await getAccessToken()
  const url   = `${REST_BASE}${path}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    next: { revalidate: 300 }, // 5-min Next.js cache
  })

  if (!res.ok) {
    throw new Error(`Contabilium REST error ${res.status} at ${path}`)
  }

  return res.json() as Promise<T>
}

// ─── Public API ────────────────────────────────────────────────────────────────

export const ContabiliumService = {
  /** All active conceptos (products) */
  async getConceptos(): Promise<ContabiliumConcepto[]> {
    const data = await restGet<ContabiliumConcepto[] | { Items?: ContabiliumConcepto[] }>('/conceptos')
    // Some Contabilium plans return a paginated wrapper { Items: [...], Total: N }
    return Array.isArray(data) ? data : (data.Items ?? [])
  },

  /** Find one concepto by SKU (Codigo) */
  async getByCodigo(sku: string): Promise<ContabiliumConcepto | null> {
    try {
      // Try direct endpoint first (faster)
      return await restGet<ContabiliumConcepto>(`/conceptos?codigo=${encodeURIComponent(sku)}`)
    } catch {
      // Fallback: fetch all and filter
      const all = await this.getConceptos()
      return all.find(c => c.Codigo === sku) ?? null
    }
  },

  /** Current stock for a SKU */
  async getStock(sku: string): Promise<number> {
    const c = await this.getByCodigo(sku)
    return c?.Stock ?? 0
  },

  /** Price WITH tax (PrecioFinal) for a SKU */
  async getPrice(sku: string): Promise<number | null> {
    const c = await this.getByCodigo(sku)
    return c?.PrecioFinal ?? null
  },

  /** Price WITHOUT tax (Precio) for a SKU */
  async getPriceWithoutTax(sku: string): Promise<number | null> {
    const c = await this.getByCodigo(sku)
    return c?.Precio ?? null
  },
}
