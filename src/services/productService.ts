/**
 * ProductService — abstraction layer over the data source.
 * Currently uses local data. Switch to Contabilium by replacing
 * the implementations below with API calls through /api/contabilium.
 */

import type { Product, Terrain } from '@/types'
import {
  products,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByTerrain,
  getProductsByCategory,
  getProductsByVehicle,
} from '@/data/products'

export const ProductService = {
  /** Get all products */
  getAll(): Product[] {
    return products
  },

  /** Get featured products for homepage */
  getFeatured(): Product[] {
    return getFeaturedProducts()
  },

  /** Get product by URL slug */
  getBySlug(slug: string): Product | undefined {
    return getProductBySlug(slug)
  },

  /** Get products compatible with a terrain */
  getByTerrain(terrain: Terrain): Product[] {
    return getProductsByTerrain(terrain)
  },

  /** Get products by category ID */
  getByCategory(category: string): Product[] {
    return getProductsByCategory(category)
  },

  /** Get products by vehicle ID */
  getByVehicle(vehicleId: string): Product[] {
    return getProductsByVehicle(vehicleId)
  },

  /** Get products filtered by terrain + category + vehicle */
  getFiltered(filters: {
    terrain?: Terrain
    category?: string
    vehicleId?: string
  }): Product[] {
    return filterProducts(products, filters)
  },
}

export function filterProducts(
  list: Product[],
  filters: { terrain?: Terrain; category?: string; vehicleId?: string }
): Product[] {
  return list.filter((p) => {
    if (filters.terrain && !p.terrain.includes(filters.terrain)) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.vehicleId && !p.vehicles.includes(filters.vehicleId)) return false
    return true
  })
}
