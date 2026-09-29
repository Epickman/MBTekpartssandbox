'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle, ShoppingBag } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/icons'
import { useCart } from '@/store/cartStore'
import siteConfig from '@/config/site'
import { cn } from '@/utils/cn'

const navLinks = [
  { label: 'Tienda', href: '/tienda' },
  { label: 'Configurar ATV', href: '/tienda#configurar' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { totalItems, state } = useCart()

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
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="MBTEK Parts — Inicio"
        >
          <span
            className={cn(
              'text-xl font-black tracking-tight transition-colors',
              scrolled ? 'text-white' : 'text-white'
            )}
          >
            MBTEK
          </span>
          <span
            className={cn(
              'text-xl font-light tracking-widest transition-colors',
              'text-[var(--accent)]'
            )}
          >
            PARTS
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm tracking-wide text-zinc-300 hover:text-white transition-colors font-medium uppercase"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Cart badge */}
          <Link
            href="/configurador"
            className="relative text-zinc-400 hover:text-white transition-colors"
            aria-label={`Mi ATV (${totalItems} productos)`}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

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
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-bold text-sm px-4 py-2 rounded-full transition-all hover:scale-105"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        {/* Mobile: cart + burger */}
        <div className="flex lg:hidden items-center gap-4">
          <Link
            href="/configurador"
            className="relative text-zinc-400 hover:text-white transition-colors"
            aria-label={`Mi ATV (${totalItems} productos)`}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
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
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-black font-bold text-sm py-3 rounded-full"
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
