const brands = [
  { name: 'Honda', src: '/brands/honda.svg' },
  { name: 'Yamaha', src: '/brands/yamaha.svg' },
  { name: 'Suzuki', src: '/brands/suzuki.svg' },
  { name: 'Kawasaki', src: '/brands/kawasaki.svg' },
]

// Cada mitad del carril tiene que ser más ancha que la pantalla para que el loop no se corte.
const half = Array.from({ length: 5 }, () => brands).flat()
const track = [...half, ...half]

export default function TopBrandBar() {
  return (
    <>
    {/* Reserva el alto de la barra fija para que el contenido no quede tapado */}
    <div className="h-8" aria-hidden="true" />
    <div
      className="fixed inset-x-0 top-0 z-[60] h-8 overflow-hidden border-b border-white/10 bg-black"
      aria-label="Marcas con las que trabajamos"
    >
      <div className="flex h-full items-center gap-2 px-4">
        <span className="shrink-0 border-r border-white/15 pr-4 font-display text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Trabajamos con
        </span>

        <div className="relative h-full flex-1 overflow-hidden" data-marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black to-transparent" />

          <div className="marquee-track flex h-full w-max items-center gap-10">
            {track.map((b, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${b.name}-${i}`}
                src={b.src}
                alt={i < brands.length ? b.name : ''}
                aria-hidden={i >= brands.length}
                className="h-4 w-auto max-w-[90px] object-contain opacity-70 [filter:grayscale(0.5)_brightness(1.15)] transition-all duration-200 hover:opacity-100 hover:[filter:none]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
