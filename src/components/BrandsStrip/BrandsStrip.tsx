const brands = [
  { name: 'Honda', src: '/brands/honda.svg' },
  { name: 'Yamaha', src: '/brands/yamaha.svg' },
  { name: 'Suzuki', src: '/brands/suzuki.svg' },
  { name: 'Kawasaki', src: '/brands/kawasaki.svg' },
]

export default function BrandsStrip() {
  const track = [...brands, ...brands]

  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] pt-[clamp(48px,7vw,80px)]" aria-labelledby="brands-heading">
      <div className="mx-auto mb-7 max-w-[1240px] px-6 text-center">
        <div className="mb-eyebrow"><span>Trabajamos con</span></div>
        <h2 id="brands-heading" className="mb-title">Nuestras marcas</h2>
      </div>

      <div className="overflow-hidden border-t border-white/10 py-8" data-marquee>
        <div className="marquee-track flex w-max items-center gap-16">
          {track.map((b, i) => (
            <span key={`${b.name}-${i}`} className="group flex h-[46px] items-center px-2" aria-hidden={i >= brands.length}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={b.name}
                loading="lazy"
                className="h-full w-auto max-w-[140px] object-contain opacity-75 [filter:grayscale(0.5)_brightness(1.15)] transition-all duration-200 group-hover:scale-105 group-hover:opacity-100 group-hover:[filter:none]"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
