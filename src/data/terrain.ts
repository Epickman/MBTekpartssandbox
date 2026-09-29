import type { TerrainConfig } from '@/types'

export const terrainData: TerrainConfig[] = [
  {
    id: 'tierra',
    name: 'TIERRA',
    subtitle: 'PERFORMANCE OFF-ROAD',
    description:
      'Barro, montaña, caminos de piedra. Cada componente pensado para resistir el terreno más exigente.',
    keywords: ['Barro', 'Montaña', 'Caminos', 'Piedras', 'Suspensión', 'Protección', 'Torque', 'Resistencia'],
    colorPrimary: '#78350F',    // amber-900 — tierra
    colorSecondary: '#92400E',
    bgClass: 'terrain-tierra',
    categories: ['suspension', 'frenos', 'transmision', 'proteccion', 'neumaticos', 'accesorios'],
  },
  {
    id: 'arena',
    name: 'ARENA',
    subtitle: 'DUNAS / BEACH / SAND',
    description:
      'Dunas, médanos, playa. Velocidad pura sobre arena. Reducción de peso, tracción extrema, performance sin límites.',
    keywords: ['Dunas', 'Médanos', 'Playa', 'Arena profunda', 'Aceleración', 'Tracción', 'Ligereza', 'Performance'],
    colorPrimary: '#B45309',    // amber-700 — arena
    colorSecondary: '#D97706',
    bgClass: 'terrain-arena',
    categories: ['suspension', 'neumaticos', 'transmision', 'ruedas', 'accesorios'],
  },
]

export const getTerrainById = (id: string) =>
  terrainData.find((t) => t.id === id) ?? terrainData[0]
