'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const FRAME_COUNT = 150
const frameUrl = (i: number) => `/hero/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`

// Fracción del scroll del hero en la que el logo se desvanece y aparece el video.
const INTRO_FADE_END = 0.18
const VIDEO_MAX_OPACITY = 0.55

const slides = [
  {
    tag: 'Atv & Motocross',
    headline: 'Repuestos que no fallan',
    sub: 'Piezas originales y compatibles para que tu cuatriciclo o moto cross no pare de rodar.',
  },
  {
    tag: 'Rendimiento',
    headline: 'Motor, frenos y suspensión',
    sub: 'Todo lo necesario para el mantenimiento y la puesta a punto de tu máquina.',
  },
  {
    tag: 'Estilo',
    headline: 'Indumentaria y accesorios',
    sub: 'Cascos, guantes, plásticos y accesorios para vos y para tu ATV o MX.',
  },
  {
    tag: 'MBTEK Parts Atv & Mx',
    headline: 'Todo en un solo lugar',
    sub: 'Rendimiento y estilo, sin vueltas.',
    cta: true,
  },
]

export default function HeroScrub() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const canvas = canvasRef.current
    if (!section || !sticky || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const slidesEls = slideRefs.current.filter(Boolean) as HTMLDivElement[]

    if (reduceMotion) {
      // Sin animación: estado final directo (video + último cartel con CTA).
      if (introRef.current) introRef.current.style.display = 'none'
      if (hintRef.current) hintRef.current.style.display = 'none'
      if (contentRef.current) contentRef.current.style.opacity = '1'
      slidesEls.forEach((el, i) => {
        el.style.opacity = i === slidesEls.length - 1 ? '1' : '0'
        el.style.pointerEvents = i === slidesEls.length - 1 ? 'auto' : 'none'
      })
      if (fallbackRef.current) fallbackRef.current.style.opacity = String(VIDEO_MAX_OPACITY)
      return
    }

    const frames: HTMLImageElement[] = []
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false)
    let firstReady = false
    let failed = false
    let drawn = -1
    let lastIndex = 0

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (!cw || !ch || !iw || !ih) return
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const nearestLoaded = (target: number) => {
      if (loaded[target]) return target
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (target - d >= 0 && loaded[target - d]) return target - d
        if (target + d < FRAME_COUNT && loaded[target + d]) return target + d
      }
      return -1
    }

    const drawFrame = (index: number) => {
      const idx = nearestLoaded(index)
      if (idx === -1 || idx === drawn) return
      drawn = idx
      drawCover(frames[idx])
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = sticky.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      drawn = -1
      if (firstReady) drawFrame(lastIndex)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image()
      img.onload = () => {
        loaded[i] = true
        if (!firstReady) {
          firstReady = true
          resize()
        }
      }
      img.onerror = () => {
        if (i === 0) failed = true
      }
      img.src = frameUrl(i)
      frames[i] = img
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!firstReady) failed = true
    }, 2500)

    let ticking = false
    const update = () => {
      ticking = false
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))

      if (barRef.current) barRef.current.style.height = `${progress * 100}%`

      const target = Math.round(progress * (FRAME_COUNT - 1))
      lastIndex = target

      // Crossfade: logo solo al principio, video + carteles después.
      const t = Math.max(0, Math.min(1, progress / INTRO_FADE_END))
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - t)
        introRef.current.style.transform = `translateY(${-t * 24}px) scale(${1 - t * 0.06})`
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(t)
        contentRef.current.style.transform = `translateY(${(1 - t) * 16}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - t)

      // Carteles: el resto del scroll se reparte entre ellos en crossfade continuo.
      const n = slidesEls.length
      if (n > 0) {
        const localT = Math.max(0, Math.min(1, (progress - INTRO_FADE_END) / (1 - INTRO_FADE_END)))
        const pos = Math.max(0.5, Math.min(n - 0.5, localT * n))
        slidesEls.forEach((el, i) => {
          const opacity = Math.max(0, Math.min(1, 1 - Math.abs(pos - (i + 0.5))))
          el.style.opacity = String(opacity)
          el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
        })
      }

      if (!failed) {
        canvas.style.opacity = String(t * VIDEO_MAX_OPACITY)
        if (firstReady) drawFrame(target)
      } else if (fallbackRef.current) {
        canvas.style.opacity = '0'
        fallbackRef.current.style.opacity = String(t * VIDEO_MAX_OPACITY)
        fallbackRef.current.style.transform = `scale(${1 + progress * 0.15})`
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    onScroll()

    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[320vh] max-sm:h-[260vh]" aria-label="MBTEK Parts — presentación">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-black flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={fallbackRef}
          src="/hero/fondo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-transform duration-100"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-0" aria-hidden="true" />

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.35) 40%, rgba(5,5,5,0.9) 100%)' }}
        />

        {/* Intro: solo el logo */}
        <div ref={introRef} className="absolute inset-0 z-[3] flex items-center justify-center px-5 will-change-transform">
          <Image
            src="/brand/mbtek-logo.png"
            alt="MBTEK Parts Atv & Mx"
            width={1677}
            height={405}
            priority
            className="h-auto w-[min(85%,560px)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Carteles sobre el video */}
        <div ref={contentRef} className="absolute inset-0 z-[2] opacity-0">
          {slides.map((s, i) => (
            <div
              key={s.headline}
              ref={(el) => {
                slideRefs.current[i] = el
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
            >
              <p className="mb-3.5 font-display text-[clamp(12px,1.6vw,15px)] tracking-[6px] text-[var(--accent)] uppercase">
                {s.tag}
              </p>
              <h2 className="mb-4 -skew-x-8 font-display text-[clamp(26px,4.4vw,44px)] uppercase tracking-[1px] text-[var(--chrome-2)] [text-shadow:0_6px_30px_rgba(0,0,0,0.5)]">
                {s.headline}
              </h2>
              <p className="mb-8 max-w-[560px] text-[clamp(13px,2vw,17px)] uppercase leading-relaxed tracking-[2px] text-zinc-300">
                {s.sub}
              </p>
              {s.cta && (
                <div className="flex flex-wrap justify-center gap-3.5">
                  <Link href="/tienda" className="mb-btn mb-btn-solid">
                    Ver catálogo
                  </Link>
                  <Link href="/configurador" className="mb-btn mb-btn-outline">
                    Armá tu ATV
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={hintRef} className="absolute bottom-7 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-500" aria-hidden="true">
          <span className="text-[10px] uppercase tracking-[3px]">Scroll</span>
          <div className="relative h-10 w-px overflow-hidden bg-white/20">
            <i ref={barRef} className="absolute left-0 top-0 block h-[0%] w-full bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
