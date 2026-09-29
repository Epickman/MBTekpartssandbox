import { InstagramIcon } from '@/components/ui/icons'
import siteConfig from '@/config/site'

export default function InstagramSection() {
  return (
    <section className="bg-zinc-900 py-20 px-4 text-center" aria-labelledby="ig-heading">
      <div className="max-w-screen-md mx-auto">
        <InstagramIcon size={32} className="text-[var(--accent)] mx-auto mb-6" aria-hidden="true" />
        <h2
          id="ig-heading"
          className="text-white text-3xl sm:text-5xl font-black tracking-tight uppercase mb-3"
        >
          @{siteConfig.instagram}
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mb-8">
          Seguinos en Instagram para ver novedades, builds y contenido off-road.
        </p>
        <a
          href={`https://www.instagram.com/${siteConfig.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-4 px-8 border border-zinc-600 text-white font-semibold text-sm tracking-[0.2em] uppercase rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
        >
          <InstagramIcon size={16} />
          Ver Instagram
        </a>
      </div>
    </section>
  )
}
