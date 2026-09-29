import type { Metadata } from 'next'
import TerrainSelector from '@/components/TerrainSelector/TerrainSelector'
import VehicleSelector from '@/components/VehicleSelector/VehicleSelector'

export const metadata: Metadata = {
  title: 'Configurá tu ATV',
  description: 'Elegí tu terreno y tu vehículo para encontrar los productos perfectos para tu ATV.',
}

export default function ConfiguradorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-[80px]">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-16 px-4 text-center">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
          Configurador
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-black tracking-tight uppercase">
          TUNEÁ TU ATV
        </h1>
        <p className="text-zinc-400 text-sm mt-4 max-w-lg mx-auto">
          No importa si buscás barro, montaña o arena.
          Armá tu ATV según dónde lo llevás.
        </p>
      </div>

      {/* Terrain selection */}
      <TerrainSelector />

      {/* Vehicle selection (visible after terrain, but also shown here standalone) */}
      <VehicleSelector />
    </div>
  )
}
