'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface LoaderProps { onComplete: () => void }

export default function Loader({ onComplete }: LoaderProps) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const nameRef  = useRef<HTMLDivElement>(null)

  const [preFly,   setPreFly]   = useState(false)
  const [bgFade,   setBgFade]   = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // ── CURTAINS ─────────────────────────────────────────────────────────────
    gsap.set(leftRef.current,  { transformOrigin: 'left center' })
    gsap.set(rightRef.current, { transformOrigin: 'right center' })

    const leftTl = gsap.timeline({ delay: 0.2 })
      .to(leftRef.current,  { scaleX: 0,    skewY: -3, duration: 1.1, ease: 'power3.in' })
      .to(leftRef.current,  { scaleX: 0.07, skewY: 0,  duration: 0.18, ease: 'power2.out' })
      .to(leftRef.current,  { scaleX: 0,               duration: 0.22, ease: 'power2.in' })

    const rightTl = gsap.timeline({ delay: 0.28 })
      .to(rightRef.current, { scaleX: 0,    skewY: 3,  duration: 1.1, ease: 'power3.in' })
      .to(rightRef.current, { scaleX: 0.07, skewY: 0,  duration: 0.18, ease: 'power2.out' })
      .to(rightRef.current, { scaleX: 0,               duration: 0.22, ease: 'power2.in' })

    // ── PROGRESS + NAME REVEAL ───────────────────────────────────────────────
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

    // ── THREE-PHASE FLY ──────────────────────────────────────────────────────
    //  Phase 1 (0.35s): PEREIRA drops below RON — RON stays centered, small
    //  Phase 2 (0.7s):  Both fly left to hero positions, scaling to hero size
    //  Phase 3 (0.5s):  Black background fades, hero photo revealed
    //
    //  Fly elements live in document.body at z:10000 (above loader z:9000),
    //  rendered at hero font-size via FLIP so text quality is full-res at landing.
    //  Black bg stays solid during phases 1+2 so the travel is clearly visible.

    const flyEls: HTMLElement[] = []

    const t5 = setTimeout(() => {
      setPreFly(true) // fades spotlight + subtitle

      const nameEl = nameRef.current
      const heroEl = document.querySelector<HTMLElement>('[data-hero-name]')

      if (!nameEl || !heroEl) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('rp:loader-done'))
          setBgFade(true)
          setTimeout(onComplete, 700)
        }, 900)
        return
      }

      // Loader spans ("RON " and "PEREIRA" inline)
      const ronLoaderSpan = nameEl.children[0] as HTMLElement
      const perLoaderSpan = nameEl.children[1] as HTMLElement
      const ronFrom = ronLoaderSpan.getBoundingClientRect()
      const perFrom = perLoaderSpan.getBoundingClientRect()

      // Hero spans (block-stacked: RON top, PEREIRA below)
      const ronHeroSpan = heroEl.children[0] as HTMLElement
      const perHeroSpan = heroEl.children[1] as HTMLElement
      const toRON = ronHeroSpan.getBoundingClientRect()
      const toPER = perHeroSpan.getBoundingClientRect()

      // Scale factor: how much smaller the loader text is vs hero text
      const loaderScale = ronFrom.height / toRON.height

      // Fade the loader name out as fly elements take over
      gsap.to(nameEl, { opacity: 0, duration: 0.3, ease: 'none' })

      // Gold-shimmer CSS inline (matches .gold-shimmer in globals.css)
      const goldCSS = [
        'background:linear-gradient(105deg,#C9A84C 0%,#C9A84C 28%,#FFF0A0 44%,#FFD060 50%,#C9A84C 66%,#C9A84C 100%)',
        'background-size:400% 100%',
        '-webkit-background-clip:text',
        'background-clip:text',
        '-webkit-text-fill-color:transparent',
        'color:transparent',
      ].join(';')

      // Create a body-level fly span at the hero span's natural position.
      // FLIP transforms will shift it to appear at the loader position initially.
      function makeFly(text: string, rect: DOMRect, isGold: boolean): HTMLElement {
        const el = document.createElement('span')
        el.setAttribute('aria-hidden', 'true')
        el.textContent = text
        el.style.cssText = [
          'position:fixed',
          `top:${rect.top}px`,
          `left:${rect.left}px`,
          'display:block',
          'font-family:var(--font-cinzel)',
          'font-weight:900',
          'line-height:0.9',
          'font-size:clamp(2.6rem,12vw,15rem)',
          'z-index:10000',
          'pointer-events:none',
          'will-change:transform',
          isGold ? goldCSS : 'color:#F0EDE8',
        ].join(';')
        document.body.appendChild(el)
        flyEls.push(el)
        return el
      }

      const ronFly = makeFly('RON',     toRON, false)
      const perFly = makeFly('PEREIRA', toPER, true)

      // Centre-X of each element (used for FLIP and intermediate alignment)
      const ronFromCx = ronFrom.left + ronFrom.width / 2
      const perFromCx = perFrom.left + perFrom.width / 2
      const toRONCx   = toRON.left   + toRON.width  / 2
      const toPERCx   = toPER.left   + toPER.width  / 2

      // FLIP: transform each fly span so it appears at its loader position
      gsap.set(ronFly, {
        x: ronFromCx - toRONCx,
        y: ronFrom.top - toRON.top,
        scale: loaderScale,
        transformOrigin: 'top center',
      })
      gsap.set(perFly, {
        x: perFromCx - toPERCx,
        y: perFrom.top - toPER.top,
        scale: loaderScale,
        transformOrigin: 'top center',
      })

      // ── Phase 1: PEREIRA drops below RON ──
      // RON does not move. PEREIRA animates from its inline position
      // (right of RON) to just below RON, centre-aligned.
      const perP1x = ronFromCx - toPERCx   // PEREIRA's centre = RON's centre
      const perP1y = ronFrom.bottom - toPER.top // PEREIRA top = RON bottom

      gsap.to(perFly, {
        x: perP1x,
        y: perP1y,
        duration: 0.35,
        ease: 'power3.out',

        onComplete() {
          // ── Phase 2: Both words fly left to hero positions ──
          // RON travels from loader centre to hero RON position (bottom-left, large).
          // PEREIRA travels from below-RON-centre to hero PEREIRA position.
          // Both scale from loaderScale → 1 (hero size).
          const tl2 = gsap.timeline({
            onComplete() {
              flyEls.forEach(el => el.remove())
              flyEls.length = 0

              // Reveal the actual hero name (inline style beats CSS opacity:0 rule)
              heroEl.style.opacity = '1'

              // Signal hero elements to cascade in
              window.dispatchEvent(new CustomEvent('rp:loader-done'))

              // ── Phase 3: Black fades, hero photo revealed ──
              setBgFade(true)
              setTimeout(onComplete, 650)
            },
          })

          tl2.to(ronFly, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.inOut' }, 0)
          tl2.to(perFly, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.inOut' }, 0)
        },
      })
    }, 2800)

    return () => {
      clearTimeout(t2)
      clearTimeout(t5)
      leftTl.kill()
      rightTl.kill()
      flyEls.forEach(el => el.remove())
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9000] overflow-hidden pointer-events-none">

      {/* Black background — stays solid during phases 1+2, fades only after name lands */}
      <motion.div className="absolute inset-0"
        style={{ background: '#06040A' }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.55, ease: 'easeIn' }} />

      {/* Grain */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px)', zIndex:1 }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.4 }} />

      {/* LEFT CURTAIN */}
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

      {/* RIGHT CURTAIN */}
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

      {/* SPOTLIGHT — fades with preFly so screen is clean during the fly */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: (bgFade || preFly) ? 0 : progress }}
        transition={{ duration: (bgFade || preFly) ? 0.3 : 0.05 }}>
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

      {/* RON PEREIRA — always in DOM; RAF drives opacity, never conditionally mounted */}
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

      {/* Subtitle + progress bar — fade with preFly */}
      <motion.div className="absolute z-20 flex flex-col items-center w-full pointer-events-none"
        style={{ top:'calc(50% + clamp(1.8rem,4vw,2.8rem))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: (bgFade || preFly) ? 0 : progress }}
        transition={{ duration: (bgFade || preFly) ? 0.25 : 0.1 }}>
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
