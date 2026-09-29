import type { Metadata } from 'next'
import { ProductService } from '@/services/productService'
import TiendaClient from './TiendaClient'

export const metadata: Metadata = {
  title: 'Tienda — Productos & Configurador',
  description: 'Repuestos y accesorios para ATV, cuatriciclos y MX. Usá el configurador para armar tu ATV según el terreno.',
}

export default function TiendaPage() {
  const products = ProductService.getAll()
  return <TiendaClient products={products} />
}
