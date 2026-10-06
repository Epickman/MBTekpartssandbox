import type { Metadata } from 'next'
import { getLiveProducts } from '@/services/liveProducts'
import TiendaClient from './TiendaClient'

export const metadata: Metadata = {
  title: 'Tienda — Productos & Configurador',
  description: 'Repuestos y accesorios para ATV, cuatriciclos y MX. Usá el configurador para armar tu ATV según el terreno.',
}

export default async function TiendaPage() {
  const products = await getLiveProducts()
  return <TiendaClient products={products} />
}
