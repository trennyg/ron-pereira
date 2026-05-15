'use client'

import { useState, useEffect, useRef } from 'react'
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

// Initial hidden style applied inline so iOS never paints content visible
// before the rp:loader-done handler fires. GSAP reads and overrides these.
const HIDDEN: React.CSSProperties = {
  opacity: 0,
  transform: 'translateY(10px)',
  willChange: 'opacity, transform',
}

// Per-item hidden style for each stat number div.
// iOS compositing layers can render children independently of a parent's
// opacity when willChange is present — each item needs its own opacity:0
// so it is invisible even if the compositor draws it before the parent
// opacity cascades.
const STAT_ITEM_HIDDEN: React.CSSProperties = { opacity: 0 }

export default function Hero() {
  // heroReady still drives the scroll hint (motion.div below)
  const [heroReady, setHeroReady] = useState(false)

  // Refs for the four content elements GSAP animates
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => {
      // Drive scroll hint via React state (Framer Motion, unchanged)
      setHeroReady(true)

      // Collect individual stat items at animation time so GSAP targets
      // each one directly. Each item has its own opacity:0 (STAT_ITEM_HIDDEN),
      // so the container's opacity alone is not sufficient on iOS compositing.
      const statItems = statsRef.current
        ? (Array.from(statsRef.current.children) as HTMLElement[])
        : []

      const els = [
        eyebrowRef.current,
        taglineRef.current,
        ...statItems,
        socialsRef.current,
      ]

      // Drive content reveal via GSAP — same ticker as the curtain/fly
      // animation already running in Loader.tsx. Single RAF loop on iOS
      // eliminates the scheduling gap that caused the visible lag.
      // clearProps:'opacity,transform' removes GSAP's inline styles after
      // animation so no stale transform or opacity lingers in the DOM.
      gsap.fromTo(
        els,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: 'power4.out',
          stagger: 0.05,
          clearProps: 'opacity,transform',
        }
      )
    }

    window.addEventListener('rp:loader-done', handler)
    return () => {
      window.removeEventListener('rp:loader-done', handler)
      // Kill any in-flight tweens on cleanup (hot-reload / unmount safety)
      if (statsRef.current) gsap.killTweensOf(Array.from(statsRef.current.children))
      gsap.killTweensOf([eyebrowRef.current, taglineRef.current, socialsRef.current])
    }
  }, [])

  return (
    // isolate: prevents stacking context ambiguity that causes iOS to
    // re-composite the entire hero on any child repaint.
    <section
      data-hero-section
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden isolate"
    >

      {/* Cover photo — Ken Burns (motion.div unchanged) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage:'url(/images/hero-cover.jpg)', backgroundColor:'#1A0800', mixBlendMode:'screen' as const, opacity:0.9 }}
          initial={{ scale:1.12 }} animate={{ scale:1.04 }}
          transition={{ duration:18, ease:'linear', repeat:Infinity, repeatType:'reverse' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,rgba(8,5,2,0.08) 0%,rgba(8,5,2,0) 25%,rgba(8,5,2,0.6) 72%,rgba(8,5,2,0.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(8,5,2,0.65) 0%,transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 60% at 65% 45%,rgba(160,80,10,0.22),transparent 70%)' }} />
      </div>

      {/* Content — plain div, GSAP drives all children via refs */}
      <div className="relative z-10 px-16 pb-20 max-md:px-6 max-md:pb-12 max-sm:px-4 max-sm:pb-10">

        {/* Eyebrow — initially hidden via inline style, revealed by GSAP */}
        <p
          ref={eyebrowRef}
          className="font-[var(--font-cinzel)] text-[0.55rem] tracking-[0.6em] text-[var(--gold)] mb-6 mt-2"
          style={HIDDEN}
        >
          Mumbai &nbsp;·&nbsp; Available Worldwide
        </p>

        {/* RON PEREIRA layout placeholder.
            opacity:0 inline — permanently invisible. The visible name is the
            travelling element reparented here by Loader after the bg dissolves.
            Text is present so the div has the correct font-metric height,
            keeping tagline/stats/socials at the right positions. */}
        <div
          data-hero-slot
          aria-hidden="true"
          className="font-[var(--font-cinzel)] font-black leading-[0.9]"
          style={{ fontSize:'clamp(2.6rem,12vw,15rem)', opacity: 0 }}
        >
          <span className="block text-[var(--cream)]">RON</span>
          <span className="block gold-shimmer">PEREIRA</span>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-[var(--font-cormorant)] font-light italic text-[var(--cream-dim)] mt-5 tracking-[0.05em]"
          style={{ ...HIDDEN, fontSize:'clamp(0.9rem,1.3vw,1.2rem)' }}
        >
          Crafting musical experiences that transcend the ordinary
        </p>

        {/* Stats — container has no opacity so it does not interfere with
            each item's own opacity:0. GSAP targets children individually. */}
        <div
          ref={statsRef}
          className="flex gap-14 mt-6 pt-5 border-t border-[var(--gold-border)] max-sm:grid max-sm:grid-cols-2 max-sm:gap-4 max-sm:gap-x-8"
        >
          {STATS.map(s => (
            <div key={s.n} style={STAT_ITEM_HIDDEN}>
              <span className="font-[var(--font-cinzel)] font-black gold-shimmer block leading-none" style={{ fontSize:'2rem' }}>{s.n}</span>
              <span className="font-[var(--font-mono)] text-[0.46rem] tracking-[0.26em] text-[var(--cream-ghost)] mt-1 block uppercase" style={{ whiteSpace:'pre-line' }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Socials */}
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

      {/* Scroll hint — motion.div unchanged, still driven by heroReady state */}
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
