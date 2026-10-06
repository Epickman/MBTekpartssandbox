import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/icons'
import siteConfig from '@/config/site'

export default function Footer() {
  const year = new Date().getFullYear()
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Hola MBTEK Parts 👋')}`

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800" role="contentinfo">
      {/* CTA Band */}
      <div className="bg-zinc-900 py-16 px-4 text-center">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-4">Contacto</p>
        <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight uppercase mb-2">
          ¿LISTO PARA
        </h2>
        <h2 className="text-[var(--accent)] text-3xl sm:text-5xl font-black tracking-tight uppercase mb-8">
          ARMAR TU ATV?
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-4 px-8 bg-[var(--accent)] text-white font-semibold text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--accent-hover)] transition-all hover:scale-105"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <a
            href={`https://www.instagram.com/${siteConfig.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-4 px-8 border border-zinc-600 text-white font-semibold text-sm tracking-[0.2em] uppercase rounded-full hover:border-white transition-all"
          >
            <InstagramIcon size={18} />
            @{siteConfig.instagram}
          </a>
          <Link
            href="/contacto"
            className="py-4 px-8 border border-zinc-600 text-white font-semibold text-sm tracking-[0.2em] uppercase rounded-full hover:border-white transition-all"
          >
            Consultar
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Image
            src="/brand/mbtek-logo.png"
            alt="MBTEK Parts Atv & Mx"
            width={1677}
            height={405}
            className="mb-4 h-12 w-auto"
          />
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Repuestos, piezas y accesorios para ATV, cuatriciclos, MX y vehículos off-road.
            Armá tu ATV según el terreno.
          </p>
          <p className="text-zinc-500 text-xs mt-4">Argentina</p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4">Catálogo</p>
          <ul className="space-y-3" role="list">
            {[
              { label: 'Productos', href: '/productos' },
              { label: 'ATV', href: '/productos?tipo=atv' },
              { label: 'MX', href: '/productos?tipo=mx' },
              { label: 'Configurá tu ATV', href: '/configurador' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4">MBTEK</p>
          <ul className="space-y-3" role="list">
            {[
              { label: 'Nosotros', href: '/nosotros' },
              { label: 'Contacto', href: '/contacto' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 py-6 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-600 text-xs">
          <p>© {year} MBTEK Parts. Todos los derechos reservados.</p>
          <p className="text-zinc-700">
            Sitio desarrollado en Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
