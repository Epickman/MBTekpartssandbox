'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const models = [
  { model: 'YFZ450R', img: '/models/yfz450r.jpg' },
  { model: 'YFZ450F', img: '/models/yfz450f.jpg' },
  { model: 'Raptor 700', img: '/models/raptor700.jpg' },
  { model: 'Raptor 350', img: '/models/raptor350.jpg' },
  { model: 'Raptor 125 / 250', img: '/models/raptor125-250.jpg' },
  { model: 'Banshee 350', label: 'Banshee', img: '/models/banshee.jpg' },
]

export default function MostWanted() {
  const router = useRouter()
  // TODO: filtrar la tienda por modelo cuando los productos tengan los vehículos cargados
  const pick = () => {
    router.push('/tienda')
  }

  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] py-[clamp(56px,9vw,110px)]"
      aria-labelledby="most-wanted-heading"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/brand-flag.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-4%] top-1/2 h-auto w-[min(50vw,600px)] -translate-y-1/2 opacity-[0.28] [filter:grayscale(1)_brightness(2)_blur(1px)] [mask-image:linear-gradient(90deg,#000_0%,#000_30%,transparent_95%)]"
      />

      <div className="relative z-[1] mx-auto max-w-[1240px] px-6">
        <div className="mb-[clamp(30px,5vw,54px)] text-center">
          <div className="mb-eyebrow"><span>Los preferidos</span></div>
          <h2 id="most-wanted-heading" className="mb-title">
            Cuatriciclos <span className="accent">más buscados</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {models.map((m) => (
            <button
              key={m.model}
              type="button"
              onClick={pick}
              className="group flex flex-col items-center text-center"
              aria-label={`Ver repuestos para Yamaha ${m.label ?? m.model}`}
            >
              <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-[3px] border border-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--accent)]/50">
                <Image
                  src={m.img}
                  alt={`Yamaha ${m.label ?? m.model}`}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="font-display text-[11px] uppercase tracking-[2px] text-[var(--accent)]">Yamaha</span>
              <span className="mt-0.5 text-[13px] font-medium tracking-[0.5px] text-[var(--chrome-2)]">
                {m.label ?? m.model}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
