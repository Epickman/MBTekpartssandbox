// Shared TypeScript types

export type Terrain = 'tierra' | 'arena'

export type Vehicle = {
  brand: string
  model: string
  year?: string
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price?: number
  stock?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  category: string
  subcategory?: string
  terrain: Terrain[]
  vehicles: string[] // e.g. ['yamaha-raptor-700', 'yamaha-yfz450r']
  images: string[]
  price?: number
  stock?: number
  description: string
  specs?: Record<string, string>
  featured?: boolean
  tags?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  vehicle?: Vehicle
  terrain?: Terrain
}

export interface ConfiguratorState {
  terrain: Terrain | null
  vehicle: Vehicle | null
  items: CartItem[]
}

export interface VehicleBrand {
  id: string
  name: string
  logo?: string
  models: VehicleModel[]
}

export interface VehicleModel {
  id: string
  name: string
  years?: string[]
  type: 'atv' | 'mx' | 'utv'
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  terrain?: Terrain[]
  order: number
}

export interface TerrainConfig {
  id: Terrain
  name: string
  subtitle: string
  description: string
  keywords: string[]
  colorPrimary: string
  colorSecondary: string
  bgClass: string
  categories: string[]
}

export interface WhatsAppOrderParams {
  items?: CartItem[]
  product?: Product
  quantity?: number
  vehicle?: Vehicle
  terrain?: Terrain
  url?: string
}
