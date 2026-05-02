'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SERVICES } from '@/lib/services'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ServiceSwitcher({ currentSlug }: { currentSlug: string }) {
  const currentIndex = SERVICES.findIndex(s => s.slug === currentSlug)
  const prev = currentIndex > 0                   ? SERVICES[currentIndex - 1] : null
  const curr = SERVICES[currentIndex]
  const next = currentIndex < SERVICES.length - 1 ? SERVICES[currentIndex + 1] : null

  const mobileRef = useRef<HTMLDivElement>(null)
  const router    = useRouter()
  const touchStartX = useRef(0)
  const dragDist    = useRef(0)

  // Center active pill on mount
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    const active = el.querySelector('[data-active="true"]') as HTMLElement
    if (active) {
      const offset = active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2
      el.scrollTo({ left: offset, behavior: 'instant' })
    }
  }, [currentSlug])

  // Prevent trackpad/mouse horizontal overscroll from triggering browser back/forward
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      // Absorb horizontal scroll - prevent it reaching the browser
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.stopPropagation()
        // Only scroll the container, not the browser
        el.scrollLeft += e.deltaX
        // If at boundaries, still prevent browser navigation
        e.preventDefault()
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div
      className="sticky top-0 z-[690] w-full border-b border-[var(--gold-border)] relative"
      style={{ background:'transparent', backdropFilter:'blur(8px)' }}
    >
      <div className="absolute inset-x-0 top-0 h-px"
        style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent)'}} />

      {/* ── DESKTOP: prev | current | next ── */}
      <div className="hidden md:flex items-center justify-center h-14 relative">
        {/* Previous */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          {prev ? (
            <Link href={`/${prev.slug}`} data-cursor-hover
              className="flex items-center gap-3 px-6 h-full border-r border-[var(--gold-border)] group hover:bg-[rgba(201,168,76,0.04)] transition-colors">
              <motion.span className="text-[var(--gold)] text-lg"
                animate={{ x:[0,-4,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}>‹</motion.span>
              <div className="flex flex-col">
                <span className="font-[var(--font-mono)] text-[0.38rem] tracking-[0.18em] text-[var(--cream-ghost)] uppercase">Previous</span>
                <span className="font-[var(--font-cinzel)] text-[0.62rem] tracking-[0.14em] text-[var(--cream-dim)] group-hover:text-[var(--gold)] transition-colors">
                  {prev.icon} {prev.name}
                </span>
              </div>
            </Link>
          ) : (
            <div className="px-6 h-full border-r border-[var(--gold-border)] flex items-center" style={{opacity:0.15}}>
              <span className="text-lg text-[var(--cream-ghost)]">‹</span>
            </div>
          )}
        </div>

        {/* Current */}
        <div className="flex items-center gap-3">
          <span className="text-xl">{curr?.icon}</span>
          <span className="font-[var(--font-cinzel)] font-bold text-[0.78rem] tracking-[0.22em] gold-shimmer uppercase">{curr?.name}</span>
          <span className="w-2 h-2 rounded-full bg-[var(--gold)] opacity-80" style={{animation:'pulse 2s ease-in-out infinite'}} />
        </div>

        {/* Next */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          {next ? (
            <Link href={`/${next.slug}`} data-cursor-hover
              className="flex items-center gap-3 px-6 h-full border-l border-[var(--gold-border)] group hover:bg-[rgba(201,168,76,0.04)] transition-colors">
              <div className="flex flex-col items-end">
                <span className="font-[var(--font-mono)] text-[0.38rem] tracking-[0.18em] text-[var(--cream-ghost)] uppercase">Next</span>
                <span className="font-[var(--font-cinzel)] text-[0.62rem] tracking-[0.14em] text-[var(--cream-dim)] group-hover:text-[var(--gold)] transition-colors">
                  {next.icon} {next.name}
                </span>
              </div>
              <motion.span className="text-[var(--gold)] text-lg"
                animate={{ x:[0,4,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}>›</motion.span>
            </Link>
          ) : (
            <div className="px-6 h-full border-l border-[var(--gold-border)] flex items-center" style={{opacity:0.15}}>
              <span className="text-lg text-[var(--cream-ghost)]">›</span>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE: snap pill scroll ── */}
      <div
        ref={mobileRef}
        className="md:hidden flex overflow-x-auto h-12 items-stretch"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          overscrollBehavior: 'none',
          touchAction: 'pan-x',
        }}
        onTouchStart={e => {
          touchStartX.current = e.touches[0].clientX
          dragDist.current = 0
        }}
        onTouchMove={e => {
          dragDist.current = Math.abs(e.touches[0].clientX - touchStartX.current)
        }}
      >
        {SERVICES.map(s => {
          const isActive = s.slug === currentSlug
          return (
            <div
              key={s.id}
              data-active={isActive}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-5 h-full transition-all duration-300"
              style={{
                scrollSnapAlign: 'center',
                minWidth: isActive ? '160px' : '120px',
                background:   isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                borderRight:  '1px solid rgba(201,168,76,0.08)',
                borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => {
                // Only navigate on tap, not drag
                if (dragDist.current < 8) router.push(`/${s.slug}`)
              }}
            >
              <span className="text-base">{s.icon}</span>
              <span className={`font-[var(--font-cinzel)] text-[0.52rem] tracking-[0.15em] uppercase whitespace-nowrap transition-colors ${
                isActive ? 'gold-shimmer' : 'text-[var(--cream-ghost)]'
              }`}>
                {s.name}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
