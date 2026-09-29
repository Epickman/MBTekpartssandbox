'use client'

import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { vehicleBrands } from '@/data/vehicleBrands'
import type { Terrain, VehicleModel } from '@/types'
import { cn } from '@/utils/cn'
import { ChevronDown, Check } from 'lucide-react'

interface VehicleSelectorProps {
  terrain?: Terrain
  onConfirm?: () => void
  className?: string
}

export default function VehicleSelector({ terrain, onConfirm, className }: VehicleSelectorProps) {
  const { setVehicle, state } = useCart()
  const [selectedBrandId, setSelectedBrandId] = useState<string>(state.vehicle?.brand?.toLowerCase() ?? '')
  const [selectedModelId, setSelectedModelId] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')

  const selectedBrand = vehicleBrands.find((b) => b.id === selectedBrandId)
  const selectedModel: VehicleModel | undefined = selectedBrand?.models.find(
    (m) => m.id === selectedModelId
  )

  const handleConfirm = () => {
    if (!selectedBrand || !selectedModel) return
    setVehicle({
      brand: selectedBrand.name,
      model: selectedModel.name,
      year: selectedYear || undefined,
    })
    onConfirm?.()
  }

  return (
    <section
      className={cn('bg-zinc-950 py-16 sm:py-24 px-4', className)}
      aria-labelledby="vehicle-heading"
    >
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-12">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
            Paso 2 de 3{terrain ? ` — ${terrain.toUpperCase()}` : ''}
          </p>
          <h2
            id="vehicle-heading"
            className="text-white text-3xl sm:text-5xl font-black tracking-tight uppercase"
          >
            ¿QUÉ ATV TENÉS?
          </h2>
        </div>

        <div className="space-y-6">
          {/* Brand selector */}
          <div>
            <label className="block text-zinc-500 text-xs tracking-[0.2em] uppercase mb-3">
              Marca
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vehicleBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrandId(brand.id)
                    setSelectedModelId('')
                    setSelectedYear('')
                  }}
                  className={cn(
                    'py-3 px-4 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all',
                    selectedBrandId === brand.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                  )}
                  aria-pressed={selectedBrandId === brand.id}
                >
                  {selectedBrandId === brand.id && (
                    <Check size={12} className="inline mr-1.5 text-[var(--accent)]" />
                  )}
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model selector — only shown after brand is selected */}
          {selectedBrand && (
            <div className="animate-fade-in">
              <label className="block text-zinc-500 text-xs tracking-[0.2em] uppercase mb-3">
                Modelo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBrand.models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModelId(model.id)
                      setSelectedYear('')
                    }}
                    className={cn(
                      'py-3 px-4 rounded-xl border text-sm font-semibold text-left transition-all',
                      selectedModelId === model.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                    )}
                    aria-pressed={selectedModelId === model.id}
                  >
                    <span className="flex items-center justify-between">
                      <span>{model.name}</span>
                      {selectedModelId === model.id && (
                        <Check size={14} className="text-[var(--accent)]" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year selector */}
          {selectedModel?.years && selectedModel.years.length > 0 && (
            <div className="animate-fade-in">
              <label
                htmlFor="year-select"
                className="block text-zinc-500 text-xs tracking-[0.2em] uppercase mb-3"
              >
                Año (opcional)
              </label>
              <div className="relative">
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl py-3 px-4 pr-10 text-sm focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Todos los años</option>
                  {selectedModel.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* Confirm button */}
          {selectedBrand && selectedModel && (
            <div className="pt-4 animate-fade-in">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-black text-sm tracking-[0.2em] uppercase rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                CONFIGURAR {selectedBrand.name} {selectedModel.name}
                {selectedYear ? ` ${selectedYear}` : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
