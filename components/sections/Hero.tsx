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

const HIDDEN: React.CSSProperties = { opacity: 0 }

export default function Hero() {
  const [heroReady, setHeroReady] = useState(false)

  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const taglineRef    = useRef<HTMLParagraphElement>(null)
  const socialsRef    = useRef<HTMLDivElement>(null)
  const staticNameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── PATH 2: client-nav back ────────────────────────────────────────────
    // Loader never mounts again; rp:loader-done / hero:ready never fire.
    // Reveal static name + hero content immediately.
    if (window.__rpLoaderDone) {
      if (staticNameRef.current) staticNameRef.current.style.opacity = '1'
      gsap.fromTo(
        [eyebrowRef.current, taglineRef.current, socialsRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06, clearProps: 'opacity' },
      )
      setHeroReady(true)
      return
    }

    // ── PATH 1: normal first load ──────────────────────────────────────────
    // Both listeners registered at effect level — no nesting, no ordering
    // dependency between them.  Static name stays opacity:0 the entire fly
    // animation; only hero:ready reveals it.  At that point the fly elements
    // (z-index 10000, direct children of the hero section) sit on top of the
    // static name (inside the z-10 inner div), so the handoff is seamless.
    // setHeroReady runs inside onHeroReady so the React re-render happens
    // after opacity:1 is already written — no chance for a render cycle to
    // interleave between the two.

    const onLoaderDone = () => {
      gsap.fromTo(
        [eyebrowRef.current, taglineRef.current, socialsRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: 'power4.out', stagger: 0.05, clearProps: 'opacity' },
      )
    }

    const onHeroReady = () => {
      if (staticNameRef.current) staticNameRef.current.style.opacity = '1'
      setHeroReady(true)
    }

    window.addEventListener('rp:loader-done', onLoaderDone, { once: true })
    window.addEventListener('hero:ready',     onHeroReady,  { once: true })

    return () => {
      window.removeEventListener('rp:loader-done', onLoaderDone)
      window.removeEventListener('hero:ready',     onHeroReady)
      gsap.killTweensOf([eyebrowRef.current, taglineRef.current, socialsRef.current])
    }
  }, [])

  return (
    <section
      data-hero-section
      className="relative min-h-[100svh] flex flex-col justify-end max-sm:justify-center overflow-hidden isolate"
    >

      {/* Cover photo — contained with explicit overflow:hidden at every layer.
          mix-blend-mode:screen on the scaled div creates a compositing layer
          that can escape a parent's overflow clip in some browsers. Adding
          overflow:hidden directly on the motion.div anchors the clip to this
          element regardless of compositing layer promotion. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 overflow-hidden"
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

        {/* Slot wrapper — relative so static name can be absolute-positioned over it */}
        <div className="relative">
          {/* RON ASHTON layout placeholder — permanently invisible.
              Provides font-metric height so the content below is positioned
              correctly. Fly elements (created by Loader) are the visible name. */}
          <div
            data-hero-slot
            aria-hidden="true"
            className="font-[var(--font-cinzel)] font-black leading-[0.9]"
            style={{ fontSize:'clamp(3rem,13.5vw,17rem)', opacity: 0 }}
          >
            <span className="block text-[var(--cream)]">RON</span>
            <span className="block gold-shimmer">ASHTON</span>
          </div>

          {/* Static name — absolute, not in flow, identical font metrics to slot.
              Hard opacity:0 in JSX. Never touched during fly animation.
              Revealed only via the two explicit code paths in useEffect above. */}
          <div
            ref={staticNameRef}
            aria-hidden="false"
            className="absolute inset-0 font-[var(--font-cinzel)] font-black leading-[0.9] pointer-events-none"
            style={{ fontSize:'clamp(3rem,13.5vw,17rem)', opacity: 0 }}
          >
            <span className="block text-[var(--cream)]">RON</span>
            <span className="block gold-shimmer">ASHTON</span>
          </div>
        </div>

        <p
          ref={eyebrowRef}
          className="font-[var(--font-cinzel)] text-[0.75rem] tracking-[0.6em] text-[var(--gold)] mb-6 mt-2"
          style={HIDDEN}
        >
          Mumbai &nbsp;·&nbsp; Available Worldwide
        </p>

        <p
          ref={taglineRef}
          className="font-[var(--font-cormorant)] font-light italic text-[var(--cream-dim)] mt-5 tracking-[0.05em]"
          style={{ ...HIDDEN, fontSize:'clamp(0.9rem,1.3vw,1.2rem)' }}
        >
          Crafting musical experiences that transcend the ordinary
        </p>

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
