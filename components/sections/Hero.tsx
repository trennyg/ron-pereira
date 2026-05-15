'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const SOCIALS = [
  { href:'https://instagram.com/placeholder', label:'Instagram', icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg> },
  { href:'https://youtube.com/placeholder',   label:'YouTube',  icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
  { href:'https://open.spotify.com/placeholder',label:'Spotify', icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 13.5c2.5-1 5.5-1 8 0"/><path d="M7 10.5c3-1.3 7-1.3 10 0"/><path d="M9 16.5c2-.7 4.5-.7 6.5 0"/></svg> },
]

const STATS = [
  { n:'18+', l:'Years of\nMastery'  },
  { n:'300+',l:'Events\nPerformed'  },
  { n:'50+', l:'Artist\nCollabs'    },
  { n:'8+',  l:'Distinct\nActs'     },
]

const HIDDEN: React.CSSProperties = { opacity: 0 }
const STAT_ITEM_HIDDEN: React.CSSProperties = { opacity: 0 }

// Vanilla rAF counter — independent of GSAP's ticker.
// Delta-clamped to 16ms per frame so iOS rAF suspension (800ms–1500ms)
// cannot skip the animation by producing progress ≈ 1 on resumption.
function animateCounter(
  span: HTMLElement,
  target: number,
  suffix: string,
  original: string,
  durationMs: number,
  delayMs: number,
): void {
  const startAt = performance.now() + delayMs
  let lastTime: number | null = null
  let elapsed = 0

  function tick(now: number): void {
    if (now < startAt) {
      requestAnimationFrame(tick)
      return
    }

    if (lastTime === null) {
      lastTime = now
      requestAnimationFrame(tick)
      return
    }

    // Clamp: a suspended-then-resumed rAF on iOS reports a large `now - lastTime`.
    // Clamping to 16ms means the animation continues from where it left off
    // rather than jumping to the final value.
    const delta = Math.min(now - lastTime, 16)
    lastTime = now
    elapsed += delta

    const progress = Math.min(elapsed / durationMs, 1)
    const eased    = 1 - Math.pow(2, -10 * progress)
    span.textContent = Math.round(eased * target) + suffix

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      span.textContent = original
      span.style.color = ''
      span.classList.add('gold-shimmer')
    }
  }

  requestAnimationFrame(tick)
}

export default function Hero() {
  const [heroReady, setHeroReady] = useState(false)

  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // rp:loader-done — opacity reveal + gold-shimmer prep (no counters)
    const revealHandler = () => {
      setHeroReady(true)

      const statItems = statsRef.current
        ? (Array.from(statsRef.current.children) as HTMLElement[])
        : []

      statItems.forEach((item, idx) => {
        const span = item.children[0] as HTMLElement
        if (!span) return
        const original = STATS[idx]?.n ?? ''
        span.textContent = '0' + original.replace(/[0-9]/g, '')
        span.classList.remove('gold-shimmer')
        span.style.color = '#C9A84C'
      })

      const els = [
        eyebrowRef.current,
        taglineRef.current,
        ...statItems,
        socialsRef.current,
      ]

      gsap.fromTo(
        els,
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: 'power4.out', stagger: 0.05, clearProps: 'opacity' }
      )
    }

    // hero:ready — vanilla rAF counters, starts after all Loader GSAP work done
    const counterHandler = () => {
      if (!statsRef.current) return
      const statItems = Array.from(statsRef.current.children) as HTMLElement[]

      statItems.forEach((item, idx) => {
        const span = item.children[0] as HTMLElement
        const stat = STATS[idx]
        if (!span || !stat) return
        const target = parseInt(stat.n, 10)
        const suffix = stat.n.replace(/[0-9]/g, '')
        if (isNaN(target)) return
        animateCounter(span, target, suffix, stat.n, 1400, idx * 150)
      })
    }

    window.addEventListener('rp:loader-done', revealHandler)
    window.addEventListener('hero:ready', counterHandler, { once: true })

    return () => {
      window.removeEventListener('rp:loader-done', revealHandler)
      window.removeEventListener('hero:ready', counterHandler)
      if (statsRef.current) gsap.killTweensOf(Array.from(statsRef.current.children))
      gsap.killTweensOf([eyebrowRef.current, taglineRef.current, socialsRef.current])
    }
  }, [])

  return (
    <section
      data-hero-section
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden isolate"
    >

      {/* Cover photo — Next.js Image with priority (SUSPECT 6 FIX).
          Previously a CSS backgroundImage on a motion.div: no preload hint
          was sent to the browser, so iOS decoded the JPEG synchronously when
          Phase 3 made it visible, blocking the main thread for 200–500ms.
          priority={true} causes Next.js to inject <link rel="preload"> in
          <head> so the image is fetched and decoded before first paint. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: '#1A0800', mixBlendMode: 'screen' as const }}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        >
          <Image
            src="/images/hero-cover.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.9 }}
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,rgba(8,5,2,0.08) 0%,rgba(8,5,2,0) 25%,rgba(8,5,2,0.6) 72%,rgba(8,5,2,0.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(8,5,2,0.65) 0%,transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 60% at 65% 45%,rgba(160,80,10,0.22),transparent 70%)' }} />
      </div>

      <div className="relative z-10 px-16 pb-20 max-md:px-6 max-md:pb-12 max-sm:px-4 max-sm:pb-10">

        <p
          ref={eyebrowRef}
          className="font-[var(--font-cinzel)] text-[0.55rem] tracking-[0.6em] text-[var(--gold)] mb-6 mt-2"
          style={HIDDEN}
        >
          Mumbai &nbsp;·&nbsp; Available Worldwide
        </p>

        {/* RON PEREIRA layout placeholder — permanently invisible.
            Provides font-metric height so tagline/stats/socials are
            positioned correctly while the travelling fly elements are the
            visible name. */}
        <div
          data-hero-slot
          aria-hidden="true"
          className="font-[var(--font-cinzel)] font-black leading-[0.9]"
          style={{ fontSize:'clamp(2.6rem,12vw,15rem)', opacity: 0 }}
        >
          <span className="block text-[var(--cream)]">RON</span>
          <span className="block gold-shimmer">PEREIRA</span>
        </div>

        <p
          ref={taglineRef}
          className="font-[var(--font-cormorant)] font-light italic text-[var(--cream-dim)] mt-5 tracking-[0.05em]"
          style={{ ...HIDDEN, fontSize:'clamp(0.9rem,1.3vw,1.2rem)' }}
        >
          Crafting musical experiences that transcend the ordinary
        </p>

        <div
          ref={statsRef}
          className="flex gap-14 mt-6 pt-5 border-t border-[var(--gold-border)] max-sm:grid max-sm:grid-cols-2 max-sm:gap-4 max-sm:gap-x-8"
        >
          {STATS.map(s => (
            <div key={s.n} style={STAT_ITEM_HIDDEN}>
              <span
                className="font-[var(--font-cinzel)] font-black gold-shimmer block leading-none"
                style={{ fontSize:'2rem', willChange:'contents' }}
              >
                {s.n}
              </span>
              <span className="font-[var(--font-mono)] text-[0.46rem] tracking-[0.26em] text-[var(--cream-ghost)] mt-1 block uppercase" style={{ whiteSpace:'pre-line' }}>{s.l}</span>
            </div>
          ))}
        </div>

        <div
          ref={socialsRef}
          className="flex gap-3 mt-5"
          style={HIDDEN}
        >
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              aria-label={s.label} data-cursor-hover
              className="w-9 h-9 border border-[var(--gold-border)] flex items-center justify-center text-[var(--cream-dim)] hover:text-[var(--gold)] hover:border-[var(--gold-border-h)] transition-all duration-300">
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll hint — Framer Motion, driven by heroReady */}
      <motion.div
        className="absolute bottom-8 right-12 flex flex-col items-center gap-2 max-md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: heroReady ? 0.55 : 0 }}
        transition={{ duration: 0.6, delay: heroReady ? 0.3 : 0 }}
      >
        <span className="font-[var(--font-mono)] text-[0.4rem] tracking-[0.4em] text-[var(--gold)] mb-5" style={{ writingMode:'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--gold)] to-transparent" style={{ animation:'scrollHint 2.2s ease-in-out infinite' }} />
      </motion.div>
    </section>
  )
}
