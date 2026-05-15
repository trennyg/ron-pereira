'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

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

const SPRING = { type:'spring' as const, stiffness:95, damping:18 }

// GPU-layer promotion hint applied as a static style prop so the browser
// creates compositing layers BEFORE animation fires — critical on iOS where
// lazy compositing makes the first animated frame expensive.
const WILL_CHANGE = { willChange: 'opacity, transform' } as const

// staggerChildren variants — timing is relative to the moment heroReady flips
// (inside Loader's onComplete/rp:loader-done dispatch), not fixed timers.
// Fixed timer offsets compound with iOS GPU compositing lag; stagger does not.
const STAGGER_NORMAL  = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } } }
const STAGGER_REDUCED = { hidden: {}, show: { transition: { staggerChildren: 0 } } }

// Per-element variants — transition lives in the 'show' state so each element
// owns its spring while the parent stagger controls when it starts.
const V_EYEBROW = { hidden: { opacity: 0, x: -60     }, show: { opacity: 0.85, x: 0, transition: SPRING } }
const V_TAGLINE = { hidden: { opacity: 0, x: '60vw'  }, show: { opacity: 1,    x: 0, transition: SPRING } }
const V_STATS   = { hidden: { opacity: 0, x: '-60vw' }, show: { opacity: 1,    x: 0, transition: SPRING } }
const V_SOCIALS = { hidden: { opacity: 0, y: 20      }, show: { opacity: 1,    y: 0, transition: SPRING } }

export default function Hero() {
  const [heroReady, setHeroReady] = useState(false)
  // Collapse stagger to zero when the user prefers reduced motion so content
  // snaps in immediately. MotionConfig(reducedMotion="user") in ClientShell
  // also disables transitions globally, but this eliminates the stagger delay.
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const handler = () => setHeroReady(true)
    window.addEventListener('rp:loader-done', handler)
    return () => window.removeEventListener('rp:loader-done', handler)
  }, [])

  return (
    // isolate: prevents stacking context ambiguity that causes iOS to
    // re-composite the entire hero on any child repaint.
    <section
      data-hero-section
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden isolate"
    >

      {/* Cover photo — Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage:'url(/images/hero-cover.jpg)', backgroundColor:'#1A0800', mixBlendMode:'screen' as const, opacity:0.9 }}
          initial={{ scale:1.12 }} animate={{ scale:1.04 }}
          transition={{ duration:18, ease:'linear', repeat:Infinity, repeatType:'reverse' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,rgba(8,5,2,0.08) 0%,rgba(8,5,2,0) 25%,rgba(8,5,2,0.6) 72%,rgba(8,5,2,0.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(8,5,2,0.65) 0%,transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 60% at 65% 45%,rgba(160,80,10,0.22),transparent 70%)' }} />
      </div>

      {/* Stagger container — sequences all hero UI children relative to heroReady.
          Non-motion children (data-hero-slot) are invisible to the stagger engine
          and don't interrupt ordering. Stagger order:
            0 eyebrow   → +0.05s
            1 tagline   → +0.20s
            2 stats     → +0.35s
            3 socials   → +0.50s                                                */}
      <motion.div
        className="relative z-10 px-16 pb-20 max-md:px-6 max-md:pb-12 max-sm:px-4 max-sm:pb-10"
        variants={prefersReduced ? STAGGER_REDUCED : STAGGER_NORMAL}
        initial="hidden"
        animate={heroReady ? 'show' : 'hidden'}
      >

        {/* Eyebrow */}
        <motion.p
          className="font-[var(--font-cinzel)] text-[0.55rem] tracking-[0.6em] text-[var(--gold)] mb-6 mt-2"
          variants={V_EYEBROW}
          style={WILL_CHANGE}
        >
          Mumbai &nbsp;·&nbsp; Available Worldwide
        </motion.p>

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
        <motion.p
          className="font-[var(--font-cormorant)] font-light italic text-[var(--cream-dim)] mt-5 tracking-[0.05em]"
          style={{ ...WILL_CHANGE, fontSize:'clamp(0.9rem,1.3vw,1.2rem)' }}
          variants={V_TAGLINE}
        >
          Crafting musical experiences that transcend the ordinary
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex gap-14 mt-6 pt-5 border-t border-[var(--gold-border)] max-sm:grid max-sm:grid-cols-2 max-sm:gap-4 max-sm:gap-x-8"
          style={WILL_CHANGE}
          variants={V_STATS}
        >
          {STATS.map(s => (
            <div key={s.n}>
              <span className="font-[var(--font-cinzel)] font-black gold-shimmer block leading-none" style={{ fontSize:'2rem' }}>{s.n}</span>
              <span className="font-[var(--font-mono)] text-[0.46rem] tracking-[0.26em] text-[var(--cream-ghost)] mt-1 block uppercase" style={{ whiteSpace:'pre-line' }}>{s.l}</span>
            </div>
          ))}
        </motion.div>

        {/* Socials */}
        <motion.div
          className="flex gap-3 mt-5"
          style={WILL_CHANGE}
          variants={V_SOCIALS}
        >
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              aria-label={s.label} data-cursor-hover
              className="w-9 h-9 border border-[var(--gold-border)] flex items-center justify-center text-[var(--cream-dim)] hover:text-[var(--gold)] hover:border-[var(--gold-border-h)] transition-all duration-300">
              {s.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint — absolutely positioned, not in the stagger flow.
          Short delay so it trails just after the last staggered child (~0.50s). */}
      <motion.div
        className="absolute bottom-8 right-12 flex flex-col items-center gap-2 max-md:hidden"
        style={WILL_CHANGE}
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
