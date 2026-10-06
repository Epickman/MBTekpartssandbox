'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageCircle } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/icons'
import siteConfig from '@/config/site'
import { cn } from '@/utils/cn'

const navLinks = [
  { label: 'Tienda', href: '/tienda' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [])

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Hola MBTEK Parts 👋')}`

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        // Account for TopBrandBar height (≈ 32px)
        'mt-[32px]',
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-gradient-to-b from-black/70 to-transparent py-5'
      )}
    >
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="MBTEK Parts — Inicio"
        >
          <Image
            src="/brand/mbtek-flag.png"
            alt=""
            width={166}
            height={61}
            priority
            className={cn('w-auto -mt-2 transition-all duration-300', scrolled ? 'h-4' : 'h-5')}
          />
          <Image
            src="/brand/mbtek-logo-text.png"
            alt="MBTEK Parts Atv & Mx"
            width={1675}
            height={405}
            priority
            className={cn('w-auto transition-all duration-300', scrolled ? 'h-8' : 'h-10')}
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative py-1.5 text-[13px] tracking-[1.5px] text-zinc-200 hover:text-white transition-colors font-medium uppercase after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`https://www.instagram.com/${siteConfig.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Instagram MBTEK Parts"
          >
            <InstagramIcon size={20} />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold uppercase tracking-[1.5px] text-[13px] px-4 py-2 rounded-sm transition-all hover:scale-105"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        {/* Mobile: burger */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="text-white p-1"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="bg-zinc-950/98 backdrop-blur-md border-t border-zinc-800 px-4 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-semibold tracking-widest text-zinc-200 hover:text-white uppercase transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex gap-4 pt-4 border-t border-zinc-800">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-white font-semibold uppercase tracking-[1.5px] text-sm py-3 rounded-sm"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <a
              href={`https://www.instagram.com/${siteConfig.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-zinc-700 text-white text-sm py-3 px-4 rounded-full"
            >
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
