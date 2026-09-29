import type { Category } from '@/types'

// Product categories — real names from ATV industry
export const categories: Category[] = [
  { id: 'suspension',   name: 'Suspensión',     slug: 'suspension',   icon: '⬆',  order: 1, terrain: ['tierra', 'arena'] },
  { id: 'frenos',       name: 'Frenos',          slug: 'frenos',       icon: '🔴',  order: 2, terrain: ['tierra', 'arena'] },
  { id: 'transmision',  name: 'Transmisión',     slug: 'transmision',  icon: '⚙',  order: 3, terrain: ['tierra', 'arena'] },
  { id: 'ruedas',       name: 'Ruedas',          slug: 'ruedas',       icon: '⭕',  order: 4, terrain: ['tierra', 'arena'] },
  { id: 'neumaticos',   name: 'Neumáticos',      slug: 'neumaticos',   icon: '🔵',  order: 5, terrain: ['tierra', 'arena'] },
  { id: 'motor',        name: 'Motor',           slug: 'motor',        icon: '🔧',  order: 6, terrain: ['tierra', 'arena'] },
  { id: 'escape',       name: 'Escape',          slug: 'escape',       icon: '💨',  order: 7, terrain: ['tierra', 'arena'] },
  { id: 'admision',     name: 'Admisión / Filtros', slug: 'admision', icon: '🌬',  order: 8, terrain: ['tierra', 'arena'] },
  { id: 'proteccion',   name: 'Protección',      slug: 'proteccion',   icon: '🛡',  order: 9, terrain: ['tierra'] },
  { id: 'embrague',     name: 'Embrague',        slug: 'embrague',     icon: '🔩',  order: 10, terrain: ['tierra', 'arena'] },
  { id: 'accesorios',   name: 'Accesorios',      slug: 'accesorios',   icon: '➕',  order: 11, terrain: ['tierra', 'arena'] },
]

export const getCategoryById = (id: string) => categories.find((c) => c.id === id)
export const getCategoriesByTerrain = (terrain: 'tierra' | 'arena') =>
  categories.filter((c) => !c.terrain || c.terrain.includes(terrain))
