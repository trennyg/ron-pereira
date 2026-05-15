'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Framer Motion removed from this file entirely.
// All animations (Ken Burns + content reveal) run on the GSAP ticker so iOS
// handles one RAF loop instead of competing Framer Motion + GSAP loops during
// the loader → hero handoff.

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

export default function Hero() {
  // Ken Burns ref — GSAP scale animation, same ticker as hero reveal
  const kenBurnsRef   = useRef<HTMLDivElement>(null)
  // Content refs — driven by paused heroTl, played on rp:loader-done
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const taglineRef    = useRef<HTMLParagraphElement>(null)
  const statsRef      = useRef<HTMLDivElement>(null)
  const socialsRef    = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Ken Burns — starts immediately, runs for the page's lifetime ──────────
    // yoyo:true + repeat:-1 replicates Framer Motion's repeatType:'reverse'
    gsap.fromTo(kenBurnsRef.current,
      { scale: 1.12 },
      { scale: 1.04, duration: 18, ease: 'linear', yoyo: true, repeat: -1 }
    )

    // ── Hero content reveal — paused, played when rp:loader-done fires ────────
    // Initial opacity:0 / translateY is set via inline styles on elements so iOS
    // never paints them in their final state before this effect runs.
    const heroTl = gsap.timeline({
      paused: true,
      onComplete() {
        // Resume Lenis scroll once hero content is fully visible
        ;(globalThis as any).__lenis?.start()
        // Release compositing hint — no longer needed after first paint
        ;[eyebrowRef, taglineRef, statsRef, socialsRef, scrollHintRef].forEach(r => {
          if (r.current) r.current.style.willChange = 'auto'
        })
      },
    })

    if (reduced) {
      // Respect prefers-reduced-motion: snap to final state, no animation
      heroTl
        .set(eyebrowRef.current,    { opacity: 0.85, y: 0 })
        .set(taglineRef.current,    { opacity: 1,    y: 0 })
        .set(statsRef.current,      { opacity: 1,    y: 0 })
        .set(socialsRef.current,    { opacity: 1,    y: 0 })
        .set(scrollHintRef.current, { opacity: 0.55       })
    } else {
      heroTl
        // City / availability line — eyebrow
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 0.85, y: 0, duration: 0.5, ease: 'power2.out' }
        )
        // Tagline — overlaps eyebrow tail
        .fromTo(taglineRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
        // Stats block — overlaps tagline tail
        .fromTo(statsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.25'
        )
        // Socials — overlaps stats tail
        .fromTo(socialsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.25'
        )
        // Scroll hint — fades in last
        .fromTo(scrollHintRef.current,
          { opacity: 0 },
          { opacity: 0.55, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
    }

    const handler = () => heroTl.play()
    window.addEventListener('rp:loader-done', handler)

    return () => {
      window.removeEventListener('rp:loader-done', handler)
      heroTl.kill()
      gsap.killTweensOf(kenBurnsRef.current)
    }
  }, [])

  return (
    // isolate: explicit stacking context — prevents iOS re-compositing the entire
    // hero on any child repaint during the GSAP timeline.
    <section
      data-hero-section
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden isolate"
    >

      {/* Cover photo — Ken Burns via GSAP (same ticker as hero reveal) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={kenBurnsRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-cover.jpg)',
            backgroundColor: '#1A0800',
            mixBlendMode: 'screen' as const,
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,rgba(8,5,2,0.08) 0%,rgba(8,5,2,0) 25%,rgba(8,5,2,0.6) 72%,rgba(8,5,2,0.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(8,5,2,0.65) 0%,transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 60% at 65% 45%,rgba(160,80,10,0.22),transparent 70%)' }} />
      </div>

      <div className="relative z-10 px-16 pb-20 max-md:px-6 max-md:pb-12 max-sm:px-4 max-sm:pb-10">

        {/* Eyebrow — opacity:0 inline prevents flash before useEffect hydrates */}
        <p
          ref={eyebrowRef}
          className="font-[var(--font-cinzel)] text-[0.55rem] tracking-[0.6em] text-[var(--gold)] mb-6 mt-2"
          style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform' }}
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
          style={{ fontSize: 'clamp(2.6rem,12vw,15rem)', opacity: 0 }}
        >
          <span className="block text-[var(--cream)]">RON</span>
          <span className="block gold-shimmer">PEREIRA</span>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-[var(--font-cormorant)] font-light italic text-[var(--cream-dim)] mt-5 tracking-[0.05em]"
          style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform', fontSize: 'clamp(0.9rem,1.3vw,1.2rem)' }}
        >
          Crafting musical experiences that transcend the ordinary
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex gap-14 mt-6 pt-5 border-t border-[var(--gold-border)] max-sm:grid max-sm:grid-cols-2 max-sm:gap-4 max-sm:gap-x-8"
          style={{ opacity: 0, transform: 'translateY(16px)', willChange: 'opacity, transform' }}
        >
          {STATS.map(s => (
            <div key={s.n}>
              <span className="font-[var(--font-cinzel)] font-black gold-shimmer block leading-none" style={{ fontSize: '2rem' }}>{s.n}</span>
              <span className="font-[var(--font-mono)] text-[0.46rem] tracking-[0.26em] text-[var(--cream-ghost)] mt-1 block uppercase" style={{ whiteSpace: 'pre-line' }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div
          ref={socialsRef}
          className="flex gap-3 mt-5"
          style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform' }}
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

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 right-12 flex flex-col items-center gap-2 max-md:hidden"
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        <span className="font-[var(--font-mono)] text-[0.4rem] tracking-[0.4em] text-[var(--gold)] mb-5" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--gold)] to-transparent" style={{ animation: 'scrollHint 2.2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
