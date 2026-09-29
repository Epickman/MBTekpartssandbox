'use client'

/**
 * ScrollVideo — controls video.currentTime via scroll position.
 * The user "scrubs" through the video as they scroll.
 * Uses GSAP ScrollTrigger for smooth, high-performance scrubbing.
 *
 * @param videoSrc  — path to the video file (mp4 recommended)
 * @param poster    — poster image shown before video loads
 * @param messages  — array of {text, progress} objects (0-1) to reveal during scroll
 */

import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/utils/cn'

export interface ScrollMessage {
  text: string
  subtext?: string
  progress: number // 0–1 when this message should be visible
}

interface ScrollVideoProps {
  videoSrc: string
  poster?: string
  messages?: ScrollMessage[]
  className?: string
}

const defaultMessages: ScrollMessage[] = [
  { text: 'NO TODOS LOS TERRENOS', subtext: 'SON IGUALES.', progress: 0.1 },
  { text: 'TU ATV TAMPOCO', subtext: 'DEBERÍA SERLO.', progress: 0.28 },
  { text: 'DISEÑÁ TU MÁQUINA.', progress: 0.46 },
  { text: 'PREPARALA PARA', subtext: 'EL TERRENO.', progress: 0.62 },
  { text: 'TIERRA O ARENA.', progress: 0.78 },
  { text: 'VOS ELEGÍS.', progress: 0.92 },
]

export default function ScrollVideo({
  videoSrc,
  poster,
  messages = defaultMessages,
  className,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const msgRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const lastProgressRef = useRef(0)

  // Reduce motion preference
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const updateVideoProgress = useCallback((progress: number) => {
    const video = videoRef.current
    if (!video || !isFinite(video.duration) || video.duration === 0) return

    const targetTime = progress * video.duration
    // Only update if diff > 0.05s to avoid micro-seeks
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime
    }

    // Update message visibility
    messages.forEach((msg, i) => {
      const el = msgRefs.current[i]
      if (!el) return
      const delta = progress - msg.progress
      // Show: between -0.06 and +0.1 of the message's trigger point
      const visible = delta >= -0.04 && delta < 0.12
      el.style.opacity = visible ? '1' : '0'
      el.style.transform = visible
        ? 'translateY(0) scale(1)'
        : progress < msg.progress
        ? 'translateY(24px) scale(0.97)'
        : 'translateY(-24px) scale(0.97)'
    })
  }, [messages])

  useEffect(() => {
    if (prefersReduced) return
    if (!containerRef.current || !stickyRef.current) return

    const container = containerRef.current

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const scrollHeight = container.offsetHeight - window.innerHeight
        if (scrollHeight <= 0) return

        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / scrollHeight))

        if (Math.abs(progress - lastProgressRef.current) > 0.001) {
          lastProgressRef.current = progress
          updateVideoProgress(progress)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Run once to set initial state
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReduced, updateVideoProgress])

  return (
    // Scroll container — height determines how long the scroll experience lasts
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: prefersReduced ? '100vh' : '600vh' }}
      aria-label="Experiencia de scroll — ATV en terreno"
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950"
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
          // No autoplay — scrubbed by scroll
        />

        {/* Dark overlay — bottom fade into content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Fallback for no-video environments */}
        <noscript>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <p className="text-white text-xl">MBTEK Parts — ATV & MX Performance</p>
          </div>
        </noscript>

        {/* Scroll messages */}
        {!prefersReduced &&
          messages.map((msg, i) => (
            <div
              key={i}
              ref={(el) => { msgRefs.current[i] = el }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none transition-all duration-700"
              style={{ opacity: 0 }}
              aria-live="polite"
            >
              <p className="text-white text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none uppercase drop-shadow-2xl">
                {msg.text}
              </p>
              {msg.subtext && (
                <p className="text-[var(--accent)] text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none uppercase mt-2 drop-shadow-2xl">
                  {msg.subtext}
                </p>
              )}
            </div>
          ))}

        {/* Reduced-motion fallback */}
        {prefersReduced && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              <p className="text-white text-5xl sm:text-7xl font-black tracking-tight uppercase">
                DISEÑÁ TU ATV
              </p>
              <p className="text-[var(--accent)] text-5xl sm:text-7xl font-black tracking-tight uppercase mt-2">
                SEGÚN EL TERRENO.
              </p>
            </div>
          </div>
        )}

        {/* Scroll indicator (only visible at top) */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
          aria-hidden="true"
        >
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  )
}
