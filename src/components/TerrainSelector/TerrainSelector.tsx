'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import type { Terrain } from '@/types'
import { terrainData } from '@/data/terrain'
import { cn } from '@/utils/cn'

interface TerrainSelectorProps {
  onSelect?: (terrain: Terrain) => void
  className?: string
}

export default function TerrainSelector({ onSelect, className }: TerrainSelectorProps) {
  const router = useRouter()
  const { setTerrain } = useCart()

  const handleSelect = (terrain: Terrain) => {
    setTerrain(terrain)
    if (onSelect) {
      onSelect(terrain)
    } else {
      router.push(`/configurador/${terrain}`)
    }
  }

  return (
    <section
      className={cn(
        'relative w-full bg-zinc-950 py-16 sm:py-24 px-4',
        className
      )}
      aria-labelledby="terrain-heading"
    >
      {/* Title */}
      <div className="text-center mb-12 sm:mb-16">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
          Paso 1 de 3
        </p>
        <h2
          id="terrain-heading"
          className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase"
        >
          ¿PARA QUÉ QUERÉS
        </h2>
        <h2 className="text-[var(--accent)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
          TU ATV?
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {terrainData.map((terrain) => (
          <button
            key={terrain.id}
            onClick={() => handleSelect(terrain.id)}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-zinc-800',
              'bg-zinc-900 text-left transition-all duration-500',
              'hover:border-[var(--accent)] hover:scale-[1.02]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              'min-h-[280px] sm:min-h-[380px]'
            )}
            aria-label={`Seleccionar ${terrain.name} — ${terrain.subtitle}`}
          >
            {/* Gradient background */}
            <div
              className={cn(
                'absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500',
                terrain.id === 'tierra'
                  ? 'bg-gradient-to-br from-amber-900 via-stone-800 to-zinc-900'
                  : 'bg-gradient-to-br from-yellow-800 via-amber-700 to-zinc-900'
              )}
            />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] bg-repeat" aria-hidden="true" />

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-between">
              <div>
                <span className="text-zinc-500 text-xs tracking-[0.3em] uppercase block mb-4">
                  {terrain.id === 'tierra' ? 'Off-Road' : 'Dunes / Sand'}
                </span>
                <h3 className="text-white text-6xl sm:text-8xl font-black tracking-tight uppercase leading-none group-hover:text-[var(--accent)] transition-colors duration-300">
                  {terrain.name}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base font-semibold tracking-widest uppercase mt-3">
                  {terrain.subtitle}
                </p>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mt-8">
                {terrain.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] tracking-widest text-zinc-500 border border-zinc-700 group-hover:border-zinc-500 transition-colors px-3 py-1 rounded-full uppercase"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center gap-3">
                <span className="text-sm font-bold tracking-[0.2em] text-zinc-300 group-hover:text-white uppercase transition-colors">
                  Elegir {terrain.name}
                </span>
                <span
                  className="w-8 h-8 rounded-full border border-zinc-600 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] flex items-center justify-center transition-all duration-300"
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
