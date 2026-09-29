'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/store/cartStore'
import type { Terrain } from '@/types'

const panels = [
  {
    id: 'tierra' as Terrain,
    label: 'TIERRA',
    sub: 'Off-Road',
    keywords: ['Barro', 'Montaña', 'Rocas', 'Extremo'],
    // Swap gradient for bg-image once you have: public/images/terrain-tierra.jpg
    bgGradient: 'linear-gradient(160deg, #200800 0%, #3d1100 25%, #6b2800 55%, #3a1200 80%, #140600 100%)',
    accentHex: '#D97706',
    accentBorder: 'rgba(180,83,9,0.5)',
    accentBg: 'rgba(120,53,15,0.2)',
  },
  {
    id: 'arena' as Terrain,
    label: 'ARENA',
    sub: 'Dunes & Sand',
    keywords: ['Médanos', 'Playa', 'Dunas', 'Velocidad'],
    // Swap gradient for: public/images/terrain-arena.jpg
    bgGradient: 'linear-gradient(160deg, #1a1000 0%, #3b2500 25%, #6e4a00 55%, #3d2a00 80%, #160f00 100%)',
    accentHex: '#FBBF24',
    accentBorder: 'rgba(251,191,36,0.4)',
    accentBg: 'rgba(120,90,10,0.2)',
  },
]

export default function HeroSection() {
  const [hovered, setHovered] = useState<Terrain | null>(null)
  const router = useRouter()
  const { setTerrain } = useCart()

  const handleSelect = (terrain: Terrain) => {
    setTerrain(terrain)
    router.push('/tienda')
  }

  return (
    <section className="relative flex h-screen overflow-hidden" aria-label="Selector de terreno">

      {/* Center MBTEK branding — fades out on hover */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-500"
        style={{ opacity: hovered ? 0 : 1, transform: hovered ? 'scale(0.94)' : 'scale(1)' }}
      >
        <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-3 font-medium">
          MBTEK PARTS — ARGENTINA
        </p>
        <p
          className="font-black uppercase text-white text-center"
          style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          ARMÁ TU ATV
        </p>
        <p
          className="font-black uppercase text-center"
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'var(--accent)',
          }}
        >
          SEGÚN EL TERRENO
        </p>
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mt-5">
          ¿Para qué terreno?
        </p>
      </div>

      {panels.map((panel) => {
        const isHovered = hovered === panel.id
        const isOther = hovered !== null && !isHovered

        return (
          <button
            key={panel.id}
            onClick={() => handleSelect(panel.id)}
            onMouseEnter={() => setHovered(panel.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col justify-end overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
            style={{
              flex: isHovered ? 1.7 : isOther ? 0.4 : 1,
              transition: 'flex 0.65s cubic-bezier(0.25,0.1,0.25,1)',
              background: panel.bgGradient,
              // Uncomment once you have real photos:
              // backgroundImage: `url('/images/terrain-${panel.id}.jpg'), ${panel.bgGradient}`,
              // backgroundSize: 'cover',
              // backgroundPosition: 'center',
              // @ts-ignore
              '--tw-ring-color': panel.accentHex,
            }}
            aria-label={`Ver productos para ${panel.label}`}
          >
            {/* Dark vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-600"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.5) 100%)',
                opacity: isHovered ? 0.5 : 1,
              }}
            />

            {/* Noise grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.035,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Accent bottom bar */}
            <div
              className="absolute inset-x-0 bottom-0 h-[3px] pointer-events-none transition-all duration-400"
              style={{
                background: panel.accentHex,
                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: panel.id === 'tierra' ? 'left' : 'right',
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-14">
              {/* Sub */}
              <p
                className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3 transition-all duration-300"
                style={{ color: panel.accentHex, opacity: isHovered ? 1 : 0.55 }}
              >
                {panel.sub}
              </p>

              {/* Main name */}
              <h2
                className="font-black uppercase leading-none tracking-tighter text-white transition-all duration-400"
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 9.5rem)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                }}
              >
                {panel.label}
              </h2>

              {/* Keywords — appear on hover */}
              <div
                className="flex flex-wrap gap-2 mt-5 transition-all duration-350"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                }}
              >
                {panel.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                    style={{ border: `1px solid ${panel.accentBorder}`, background: panel.accentBg, color: '#fff' }}
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* CTA row — appear on hover */}
              <div
                className="flex items-center gap-3 mt-6 transition-all duration-350"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                }}
              >
                <span className="text-white text-xs font-black tracking-[0.25em] uppercase">
                  VER PRODUCTOS
                </span>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                  style={{ background: panel.accentHex, color: '#000' }}
                >
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>

            {/* Separator (left panel only) */}
            {panel.id === 'tierra' && (
              <div className="absolute right-0 inset-y-0 w-px bg-white/8 pointer-events-none" />
            )}
          </button>
        )
      })}

      {/* Mobile: stacked layout — show labels always */}
      <style>{`
        @media (max-width: 639px) {
          .hero-panel { flex: 1 !important; }
        }
      `}</style>
    </section>
  )
}
