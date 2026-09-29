'use client'

import { brandMarqueeNames } from '@/data/vehicleBrands'

// Marquee bar showing vehicle brand compatibility
// Pauses on hover; works on mobile with touch
export default function TopBrandBar() {
  // Duplicate array to create seamless loop
  const brands = [...brandMarqueeNames, ...brandMarqueeNames]

  return (
    <div
      className="w-full bg-zinc-950 border-b border-zinc-800 overflow-hidden"
      aria-label="Marcas de vehículos compatibles"
    >
      <div className="flex items-center gap-2 px-4 py-1.5">
        {/* Static label */}
        <span className="shrink-0 text-[10px] tracking-[0.2em] text-zinc-500 font-medium uppercase pr-4 border-r border-zinc-700">
          COMPATIBLE CON
        </span>

        {/* Marquee container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-zinc-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-zinc-950 to-transparent" />

          {/* Scrolling track — animation pauses on hover via CSS */}
          <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
            {brands.map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="text-[11px] tracking-[0.25em] text-zinc-400 font-semibold uppercase hover:text-white transition-colors cursor-default"
                aria-hidden={i >= brandMarqueeNames.length}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
