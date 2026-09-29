'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { getTerrainById } from '@/data/terrain'
import type { Terrain } from '@/types'
import VehicleSelector from '@/components/VehicleSelector/VehicleSelector'
import ATVConfigurator from '@/components/ATVConfigurator/ATVConfigurator'
import { cn } from '@/utils/cn'
import { ArrowLeft } from 'lucide-react'

interface Props {
  terrain: Terrain
}

export default function TerrainConfigurator({ terrain }: Props) {
  const { state, setTerrain } = useCart()
  const terrainConfig = getTerrainById(terrain)
  const [step, setStep] = useState<'vehicle' | 'products'>(
    state.vehicle ? 'products' : 'vehicle'
  )

  // Set terrain in cart if not already set
  if (state.terrain !== terrain) {
    setTerrain(terrain)
  }

  const terrainBg = terrain === 'tierra'
    ? 'bg-gradient-to-br from-amber-950 via-zinc-950 to-zinc-950'
    : 'bg-gradient-to-br from-amber-900 via-zinc-950 to-zinc-950'

  return (
    <div className={cn('min-h-screen pt-[80px]', terrainBg, `${terrainConfig.bgClass}`)}>
      {/* Banner */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-zinc-800/50 py-5 px-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/configurador"
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Volver
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
            <span className="text-zinc-500">Configurador</span>
            <span className="text-zinc-700">/</span>
            <span className="text-[var(--accent)] font-bold">{terrain.toUpperCase()}</span>
            {state.vehicle && (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-400">
                  {state.vehicle.brand} {state.vehicle.model}
                </span>
              </>
            )}
          </div>

          {/* Switch terrain */}
          <Link
            href={`/configurador/${terrain === 'tierra' ? 'arena' : 'tierra'}`}
            className="text-zinc-500 hover:text-white text-xs tracking-wide transition-colors"
          >
            Cambiar a {terrain === 'tierra' ? 'Arena' : 'Tierra'}
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="py-16 px-4 text-center">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
          Configurador
        </p>
        <h1 className="text-white text-4xl sm:text-7xl font-black tracking-tight uppercase">
          {terrainConfig.name}
        </h1>
        <p className="text-[var(--accent)] text-sm sm:text-base font-semibold tracking-widest uppercase mt-2">
          {terrainConfig.subtitle}
        </p>
        <p className="text-zinc-400 text-sm mt-4 max-w-md mx-auto">
          {terrainConfig.description}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {terrainConfig.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[10px] tracking-widest text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-full uppercase"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Step tabs */}
      <div className="max-w-screen-xl mx-auto px-4 mb-4">
        <div className="flex gap-2 bg-zinc-900/50 rounded-2xl p-1 border border-zinc-800 max-w-xs mx-auto">
          <button
            onClick={() => setStep('vehicle')}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all',
              step === 'vehicle'
                ? 'bg-[var(--accent)] text-black'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Vehículo
          </button>
          <button
            onClick={() => setStep('products')}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all',
              step === 'products'
                ? 'bg-[var(--accent)] text-black'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Productos
          </button>
        </div>
      </div>

      {/* Content */}
      {step === 'vehicle' ? (
        <VehicleSelector
          terrain={terrain}
          onConfirm={() => setStep('products')}
        />
      ) : (
        <ATVConfigurator terrain={terrain} />
      )}
    </div>
  )
}
