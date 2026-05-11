'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface LoaderProps { onComplete: () => void }

export default function Loader({ onComplete }: LoaderProps) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const nameRef  = useRef<HTMLDivElement>(null)

  const [bgFade,   setBgFade]   = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // ── CURTAINS — GSAP ──────────────────────────────────────────────────────
    // Left starts at 80ms. Accelerates past the target (power2.in to -115%),
    // skewing so the top edge leads. Elastic settle back to -102% with visible
    // swing: curtain briefly reappears ~5–8vw before resting off-screen.
    const leftTl = gsap.timeline({ delay: 0.08 })
      .to(leftRef.current, { x: '-115%', skewX: -3, duration: 0.95, ease: 'power2.in' })
      .to(leftRef.current, { x: '-102%', skewX: 0,  duration: 0.45, ease: 'elastic.out(0.55, 0.45)' })

    // Right starts 80ms after left — one mechanism pulling both panels.
    const rightTl = gsap.timeline({ delay: 0.16 })
      .to(rightRef.current, { x: '115%',  skewX: 3,  duration: 0.95, ease: 'power2.in' })
      .to(rightRef.current, { x: '102%',  skewX: 0,  duration: 0.45, ease: 'elastic.out(0.55, 0.45)' })

    // ── PROGRESS + NAME REVEAL ───────────────────────────────────────────────
    // Progress drives: name opacity (direct DOM), spotlight + subtitle (React state).
    const t2 = setTimeout(() => {
      const start = performance.now()
      const dur   = 1500
      const tick  = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        if (nameRef.current) nameRef.current.style.opacity = String(p)
        setProgress(p)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 1000)

    // ── BG FADE + GSAP FLIP ──────────────────────────────────────────────────
    // At 2800ms: fade out loader chrome, then fly the name from its loader
    // position to the hero element's natural DOM position via FLIP.
    const t5 = setTimeout(() => {
      setBgFade(true)

      const fromEl = nameRef.current
      const toEl   = document.querySelector<HTMLElement>('[data-hero-name]')

      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect()
        const toRect   = toEl.getBoundingClientRect()

        // FLIP deltas: how far the hero element is from where the loader name sits
        const dx = fromRect.left - toRect.left
        const dy = fromRect.top  - toRect.top
        const sx = fromRect.width  / toRect.width
        const sy = fromRect.height / toRect.height

        // Crossfade: loader name fades out as hero name takes over
        gsap.to(fromEl, { opacity: 0, duration: 0.2, ease: 'none' })

        // Hero name starts at loader position+size (via transform), flies to natural pos
        gsap.fromTo(
          toEl,
          { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0, transformOrigin: 'top left' },
          {
            x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete() {
              gsap.set(toEl, { clearProps: 'x,y,scaleX,scaleY,transformOrigin' })
              window.dispatchEvent(new CustomEvent('rp:loader-done'))
              onComplete()
            },
          }
        )
      } else {
        // Fallback: no hero element found
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('rp:loader-done'))
          onComplete()
        }, 900)
      }
    }, 2800)

    return () => {
      clearTimeout(t2)
      clearTimeout(t5)
      leftTl.kill()
      rightTl.kill()
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9000] overflow-hidden pointer-events-none">

      {/* Dark background */}
      <motion.div className="absolute inset-0"
        style={{ background: '#06040A' }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeIn' }} />

      {/* Grain */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px)', zIndex:1 }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.4 }} />

      {/* LEFT CURTAIN — GSAP-controlled via ref */}
      <div ref={leftRef} className="absolute top-0 left-0 bottom-0 overflow-hidden"
        style={{ width:'51vw', zIndex:30 }}>
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,#1C0A1A 0%,#130610 40%,#0F0410 70%,#1A0818 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(80,10,50,0.7) 0%,rgba(160,40,90,0.15) 30%,rgba(60,8,35,0.5) 60%,rgba(40,5,25,0.8) 100%)' }} />
        {[9,22,35,48,61,74,87].map((p,i) => (
          <div key={p} className="absolute top-0 bottom-0"
            style={{ left:`${p}%`, width:i%2===0?'7%':'3%',
              background:i%2===0?'linear-gradient(90deg,rgba(0,0,0,0.5),rgba(180,60,100,0.08),rgba(0,0,0,0.4))':'linear-gradient(90deg,rgba(200,80,120,0.12),rgba(0,0,0,0))' }} />
        ))}
        <div className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background:'linear-gradient(180deg,transparent 3%,#F0D080 15%,#C9A84C 40%,#F8E090 60%,#C9A84C 85%,transparent 97%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
        <div className="absolute right-0 top-0 bottom-0 w-10"
          style={{ background:'linear-gradient(270deg,rgba(0,0,0,0.92) 0%,rgba(55,8,32,0.55) 35%,transparent 100%)' }} />
      </div>

      {/* RIGHT CURTAIN — GSAP-controlled via ref */}
      <div ref={rightRef} className="absolute top-0 right-0 bottom-0 overflow-hidden"
        style={{ width:'51vw', zIndex:30 }}>
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,#1C0A1A 0%,#130610 40%,#0F0410 70%,#1A0818 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(270deg,rgba(80,10,50,0.7) 0%,rgba(160,40,90,0.15) 30%,rgba(60,8,35,0.5) 60%,rgba(40,5,25,0.8) 100%)' }} />
        {[9,22,35,48,61,74,87].map((p,i) => (
          <div key={p} className="absolute top-0 bottom-0"
            style={{ left:`${p}%`, width:i%2===0?'7%':'3%',
              background:i%2===0?'linear-gradient(90deg,rgba(0,0,0,0.5),rgba(180,60,100,0.08),rgba(0,0,0,0.4))':'linear-gradient(90deg,rgba(200,80,120,0.12),rgba(0,0,0,0))' }} />
        ))}
        <div className="absolute right-0 top-0 bottom-0 w-[3px]"
          style={{ background:'linear-gradient(180deg,transparent 3%,#F0D080 15%,#C9A84C 40%,#F8E090 60%,#C9A84C 85%,transparent 97%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
        <div className="absolute left-0 top-0 bottom-0 w-10"
          style={{ background:'linear-gradient(90deg,rgba(0,0,0,0.92) 0%,rgba(55,8,32,0.55) 35%,transparent 100%)' }} />
      </div>

      {/* SPOTLIGHT */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: bgFade ? 0 : progress }}
        transition={{ duration: bgFade ? 0.4 : 0.05 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position:'absolute', inset:0 }}>
          <defs>
            <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFFFFF"  stopOpacity="0.62"/>
              <stop offset="14%"  stopColor="#FFF3DC"  stopOpacity="0.28"/>
              <stop offset="45%"  stopColor="#DDA858"  stopOpacity="0.07"/>
              <stop offset="100%" stopColor="#804000"  stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points="32,0 68,0 92,100 8,100" fill="url(#cg2)"/>
        </svg>
        <div className="absolute pointer-events-none"
          style={{ top:'48%', left:'50%', transform:'translate(-50%,-50%)',
            width:'80vw', maxWidth:'600px', height:'180px', borderRadius:'50%',
            background:'radial-gradient(ellipse,rgba(255,248,230,0.07) 0%,transparent 65%)' }} />
      </motion.div>

      {/* RON PEREIRA — always in DOM, opacity 0 → driven by RAF (no conditional mount = no flash) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6">
        <div
          ref={nameRef}
          className="font-[var(--font-cinzel)] font-black text-center"
          style={{
            fontSize: 'clamp(0.85rem,3.5vw,1.75rem)',
            letterSpacing: '0.45em',
            textIndent: '0.45em',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            opacity: 0,
          }}
        >
          <span style={{ color:'var(--cream)' }}>RON </span>
          <span className="gold-shimmer">PEREIRA</span>
        </div>
      </div>

      {/* Subtitle + progress bar */}
      <motion.div className="absolute z-20 flex flex-col items-center w-full pointer-events-none"
        style={{ top:'calc(50% + clamp(1.8rem,4vw,2.8rem))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: bgFade ? 0 : progress }}
        transition={{ duration: bgFade ? 0.3 : 0.1 }}>
        <span style={{ color:'var(--gold)', opacity:0.8, fontFamily:'var(--font-mono)', fontSize:'0.4rem', letterSpacing:'0.44em' }}>
          Musician &nbsp;·&nbsp; Performer &nbsp;·&nbsp; Educator
        </span>
        <div className="w-32 h-px mt-4 overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
          <motion.div className="h-full"
            style={{ background:'linear-gradient(90deg,transparent,var(--gold-l),var(--gold),var(--gold-l),transparent)', transformOrigin:'left' }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.05 }} />
        </div>
      </motion.div>

    </div>
  )
}
