import siteConfig from '@/config/site'
import type { WhatsAppOrderParams } from '@/types'

// Single source of truth for WhatsApp message generation
// Use this function everywhere — never hardcode messages or numbers

export function generateWhatsAppOrder(params: WhatsAppOrderParams): string {
  const { items, product, quantity = 1, vehicle, terrain, url } = params

  const header = `Hola ${siteConfig.whatsappName} 👋\n\n`

  // Single product inquiry
  if (product && !items?.length) {
    const vehicleStr = vehicle
      ? `Vehículo: ${[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(' ')}\n`
      : ''
    const terrainStr = terrain ? `Configuración: ${terrain.toUpperCase()}\n` : ''
    const urlStr = url ? `\nLink del producto:\n${url}` : ''

    return (
      header +
      `Quiero consultar/comprar:\n\n` +
      `Producto: ${product.name}\n` +
      `SKU: ${product.sku}\n` +
      vehicleStr +
      terrainStr +
      `Cantidad: ${quantity}` +
      urlStr
    )
  }

  // Full cart / configuration order
  if (items?.length) {
    const vehicleStr = vehicle
      ? `Vehículo: ${[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(' ')}`
      : 'Vehículo: A definir'
    const terrainStr = terrain ? `Uso: ${terrain.toUpperCase()}` : ''

    const itemLines = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.product.name}\n   SKU: ${item.product.sku}\n   Cantidad: ${item.quantity}`
      )
      .join('\n\n')

    return (
      header +
      `Quiero consultar esta configuración:\n\n` +
      `${vehicleStr}\n` +
      (terrainStr ? `${terrainStr}\n` : '') +
      `\nProductos:\n\n` +
      itemLines
    )
  }

  // Fallback — general inquiry
  return header + 'Quiero recibir más información sobre sus productos.'
}

export function generateWhatsAppUrl(params: WhatsAppOrderParams): string {
  const message = generateWhatsAppOrder(params)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`
}
