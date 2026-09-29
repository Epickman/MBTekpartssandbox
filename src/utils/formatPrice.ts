import siteConfig from '@/config/site'

export function formatPrice(price: number | undefined | null): string {
  if (price == null) return 'Consultar precio'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: siteConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatStock(stock: number | undefined | null): string {
  if (stock == null) return ''
  if (stock === 0) return 'Sin stock'
  if (stock <= 3) return `Últimas ${stock} unidades`
  return 'En stock'
}
