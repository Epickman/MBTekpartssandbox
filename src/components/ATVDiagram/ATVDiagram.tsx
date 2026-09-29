'use client'

/**
 * ATVDiagram — Interactive SVG side-view of a generic ATV.
 * Clicking a hotspot selects a component category.
 * This is a stylized technical illustration, not a photo.
 */

import { useState } from 'react'
import type { Terrain, Category } from '@/types'
import { cn } from '@/utils/cn'

interface ATVDiagramProps {
  terrain: Terrain
  activeCategory: string
  onCategorySelect: (categoryId: string) => void
  categories: Category[]
}

// Hotspot positions (% of SVG viewBox 800x400)
const hotspots: Record<string, { cx: number; cy: number; label: string }> = {
  suspension:  { cx: 185, cy: 195, label: 'Suspensión' },
  ruedas:      { cx: 185, cy: 300, label: 'Ruedas' },
  neumaticos:  { cx: 620, cy: 300, label: 'Neumáticos' },
  frenos:      { cx: 620, cy: 220, label: 'Frenos' },
  motor:       { cx: 400, cy: 210, label: 'Motor' },
  escape:      { cx: 490, cy: 250, label: 'Escape' },
  admision:    { cx: 320, cy: 170, label: 'Admisión' },
  transmision: { cx: 460, cy: 300, label: 'Transmisión' },
  embrague:    { cx: 360, cy: 260, label: 'Embrague' },
  proteccion:  { cx: 300, cy: 310, label: 'Protección' },
  accesorios:  { cx: 240, cy: 150, label: 'Accesorios' },
}

export default function ATVDiagram({
  terrain,
  activeCategory,
  onCategorySelect,
  categories,
}: ATVDiagramProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const accentColor = terrain === 'tierra' ? '#D97706' : '#FBBF24'
  const availableCatIds = new Set(categories.map(c => c.id))

  return (
    <div className="relative w-full select-none">
      <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase text-center py-3">
        Seleccioná un componente
      </p>

      <svg
        viewBox="0 0 800 400"
        className="w-full max-h-[320px]"
        role="img"
        aria-label="Diagrama interactivo del ATV — seleccioná una zona"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </radialGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>

        {/* ── Ground shadow ──────────────────────────────────────────────── */}
        <ellipse cx="400" cy="360" rx="260" ry="18" fill="black" opacity="0.35" />

        {/* ── Rear wheel ───────────────────────────────────────────────── */}
        <circle cx="620" cy="305" r="70" fill="url(#wheelGrad)" stroke="#3f3f46" strokeWidth="3" />
        <circle cx="620" cy="305" r="50" fill="none" stroke="#52525b" strokeWidth="8" />
        <circle cx="620" cy="305" r="20" fill="#27272a" stroke="#52525b" strokeWidth="3" />
        {/* Spokes */}
        {[0,45,90,135].map(a => {
          const rad = a * Math.PI / 180
          return (
            <line key={a}
              x1={620 + 22 * Math.cos(rad)} y1={305 + 22 * Math.sin(rad)}
              x2={620 + 48 * Math.cos(rad)} y2={305 + 48 * Math.sin(rad)}
              stroke="#52525b" strokeWidth="3" strokeLinecap="round"
            />
          )
        })}

        {/* ── Front wheel ──────────────────────────────────────────────── */}
        <circle cx="185" cy="305" r="65" fill="url(#wheelGrad)" stroke="#3f3f46" strokeWidth="3" />
        <circle cx="185" cy="305" r="46" fill="none" stroke="#52525b" strokeWidth="7" />
        <circle cx="185" cy="305" r="18" fill="#27272a" stroke="#52525b" strokeWidth="3" />
        {[0,45,90,135].map(a => {
          const rad = a * Math.PI / 180
          return (
            <line key={a}
              x1={185 + 20 * Math.cos(rad)} y1={305 + 20 * Math.sin(rad)}
              x2={185 + 44 * Math.cos(rad)} y2={305 + 44 * Math.sin(rad)}
              stroke="#52525b" strokeWidth="3" strokeLinecap="round"
            />
          )
        })}

        {/* ── Chassis / frame ──────────────────────────────────────────── */}
        {/* Main body */}
        <path
          d="M 230 260 L 215 240 L 220 200 L 270 180 L 370 165 L 470 170 L 555 195 L 570 240 L 570 270 L 230 270 Z"
          fill="url(#bodyGrad)" stroke="#3f3f46" strokeWidth="2"
        />
        {/* Seat */}
        <path
          d="M 295 165 Q 380 148 480 168 Q 490 155 475 145 Q 370 128 285 148 Z"
          fill="#27272a" stroke="#3f3f46" strokeWidth="1.5"
        />
        {/* Engine block */}
        <rect x="355" y="195" width="115" height="80" rx="6" fill="#232326" stroke="#3f3f46" strokeWidth="2" />
        {/* Cylinder head */}
        <rect x="368" y="182" width="50" height="20" rx="4" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Front forks */}
        <line x1="232" y1="240" x2="200" y2="295" stroke="#52525b" strokeWidth="8" strokeLinecap="round" />
        <line x1="215" y1="240" x2="185" y2="295" stroke="#52525b" strokeWidth="8" strokeLinecap="round" />
        {/* Rear swing arm */}
        <line x1="565" y1="255" x2="620" y2="295" stroke="#52525b" strokeWidth="7" strokeLinecap="round" />
        {/* Handlebar */}
        <path d="M 220 200 Q 230 170 260 165" stroke="#52525b" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 245 162 L 275 158 L 280 165" stroke="#52525b" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Exhaust pipe */}
        <path d="M 465 230 Q 500 240 530 255 Q 555 260 565 255" stroke="#52525b" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Skid plate */}
        <rect x="275" y="260" width="200" height="18" rx="4" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Air intake */}
        <rect x="305" y="172" width="40" height="22" rx="4" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Front rack */}
        <rect x="222" y="180" width="50" height="12" rx="3" fill="#232326" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Rear */}
        <path d="M 540 185 Q 565 190 570 210 L 570 270" stroke="#3f3f46" strokeWidth="2" fill="#232326" />
        {/* CVT / chain cover */}
        <ellipse cx="470" cy="300" rx="30" ry="14" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.5" />

        {/* ── Hotspots ────────────────────────────────────────────────────── */}
        {categories.map(cat => {
          const hp = hotspots[cat.id]
          if (!hp) return null
          const isActive = activeCategory === cat.id
          const isHovered = hovered === cat.id

          return (
            <g
              key={cat.id}
              role="button"
              tabIndex={0}
              aria-label={`Seleccionar ${cat.name}`}
              aria-pressed={isActive}
              onClick={() => onCategorySelect(cat.id)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              onKeyDown={e => e.key === 'Enter' && onCategorySelect(cat.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              {isActive && (
                <circle cx={hp.cx} cy={hp.cy} r="16"
                  fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.4"
                  className="animate-ping"
                />
              )}
              {/* Outer ring */}
              <circle
                cx={hp.cx} cy={hp.cy} r={isActive || isHovered ? 12 : 8}
                fill={isActive ? accentColor : isHovered ? '#ffffff20' : '#27272a'}
                stroke={isActive ? accentColor : isHovered ? '#ffffff60' : '#52525b'}
                strokeWidth={isActive ? 2 : 1.5}
                filter={isActive ? 'url(#glow)' : undefined}
                style={{ transition: 'r 0.2s, fill 0.2s' }}
              />
              {/* Inner dot */}
              <circle
                cx={hp.cx} cy={hp.cy} r={isActive ? 4 : 3}
                fill={isActive ? '#000' : '#71717a'}
                style={{ transition: 'r 0.2s' }}
              />
              {/* Label */}
              {(isActive || isHovered) && (
                <text
                  x={hp.cx}
                  y={hp.cy < 200 ? hp.cy - 18 : hp.cy + 22}
                  textAnchor="middle"
                  fill={isActive ? accentColor : '#e4e4e7'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="system-ui"
                  letterSpacing="1"
                  style={{ textTransform: 'uppercase', pointerEvents: 'none' }}
                >
                  {hp.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <p className="text-zinc-600 text-[10px] text-center pb-3 tracking-wide">
        ← hacé clic en los puntos del diagrama para filtrar por componente
      </p>
    </div>
  )
}
