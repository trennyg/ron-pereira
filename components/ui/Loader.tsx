'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoaderProps { onComplete: () => void }

export default function Loader({ onComplete }: LoaderProps) {
  // Every element is driven imperatively — no React state, no re-renders.
  const leftRef      = useRef<HTMLDivElement>(null)
  const rightRef     = useRef<HTMLDivElement>(null)
  const bgRef        = useRef<HTMLDivElement>(null)
  const grainRef     = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const nameRef      = useRef<HTMLDivElement>(null)
  const subtitleRef  = useRef<HTMLDivElement>(null)
  const barRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // aborted = true in cleanup prevents stale async continuations firing
    // after the component unmounts (e.g. fast navigation or dev hot-reload).
    let aborted = false
    const flyEls: HTMLElement[] = []

    // ── CURTAINS ─────────────────────────────────────────────────────────────
    gsap.set(leftRef.current,  { transformOrigin: 'left center' })
    gsap.set(rightRef.current, { transformOrigin: 'right center' })

    const leftTl = gsap.timeline({ delay: 0.2 })
      .to(leftRef.current,  { scaleX: 0,    skewY: -3, duration: 1.1,  ease: 'power3.in'   })
      .to(leftRef.current,  { scaleX: 0.07, skewY: 0,  duration: 0.18, ease: 'power2.out'  })
      .to(leftRef.current,  { scaleX: 0,               duration: 0.22, ease: 'power2.in'   })

    const rightTl = gsap.timeline({ delay: 0.28 })
      .to(rightRef.current, { scaleX: 0,    skewY: 3,  duration: 1.1,  ease: 'power3.in'   })
      .to(rightRef.current, { scaleX: 0.07, skewY: 0,  duration: 0.18, ease: 'power2.out'  })
      .to(rightRef.current, { scaleX: 0,               duration: 0.22, ease: 'power2.in'   })

    // ── PROGRESS — direct DOM, no React state ────────────────────────────────
    const t2 = setTimeout(() => {
      const start = performance.now()
      const dur   = 1500
      const tick  = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        if (nameRef.current)      nameRef.current.style.opacity      = String(p)
        if (spotlightRef.current) spotlightRef.current.style.opacity  = String(p)
        if (subtitleRef.current)  subtitleRef.current.style.opacity   = String(p)
        if (barRef.current)       barRef.current.style.transform      = `scaleX(${p})`
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 1000)

    // ── THREE-PHASE FLY ───────────────────────────────────────────────────────
    // async callback is intentional — two sequential layout-settle guards must
    // complete before any rect is measured. Both resolve synchronously from
    // cache in normal conditions; only slow connections see a real wait.
    const t5 = setTimeout(async () => {

      // ── Gate 1: hero-cover.jpg must be loaded ────────────────────────────
      // The cover photo renders as a CSS background-image (no <img> element),
      // so we probe the browser cache via new Image(). If hero-cover.jpg is
      // already downloaded (usual at t=2800ms), complete=true and we skip the
      // wait entirely. On slow connections we wait before measuring, so the
      // hero section layout has settled around the image's final dimensions.
      const coverImg = new Image()
      coverImg.src = '/images/hero-cover.jpg'
      if (!coverImg.complete) {
        await new Promise<void>(resolve => {
          coverImg.onload  = () => resolve()
          coverImg.onerror = () => resolve() // don't block on a failed load
        })
      }

      // ── Gate 2: Cinzel must be rendered at its final metrics ─────────────
      // Prevents stale rects from a hero-name reflow after font swap.
      await document.fonts.ready

      if (aborted) return

      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3,  ease: 'none' })
      gsap.to(subtitleRef.current,  { opacity: 0, duration: 0.25, ease: 'none' })

      const nameEl = nameRef.current
      const heroEl = document.querySelector<HTMLElement>('[data-hero-name]')

      if (!nameEl || !heroEl) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('rp:loader-done'))
          gsap.to(bgRef.current,    { opacity: 0, duration: 0.55 })
          gsap.to(grainRef.current, { opacity: 0, duration: 0.4  })
          setTimeout(onComplete, 700)
        }, 900)
        return
      }

      // Loader spans are inline — getBoundingClientRect gives accurate text bounds.
      const ronFrom = (nameEl.children[0] as HTMLElement).getBoundingClientRect()
      const perFrom = (nameEl.children[1] as HTMLElement).getBoundingClientRect()

      // Hero spans are display:block — their layout box equals the full container
      // width, not the text content width. Range API returns the actual text rect.
      function textRect(el: HTMLElement): DOMRect {
        const r = document.createRange()
        r.selectNodeContents(el)
        const rect = r.getBoundingClientRect()
        return rect.height > 0 ? rect : el.getBoundingClientRect()
      }

      // First hero measurement — image loaded, fonts loaded, layout settled.
      const toRON = textRect(heroEl.children[0] as HTMLElement)
      const toPER = textRect(heroEl.children[1] as HTMLElement)

      const loaderScale = ronFrom.height / toRON.height

      // Fade loader name as body-level fly elements take over
      gsap.to(nameEl, { opacity: 0, duration: 0.25, ease: 'none' })

      const goldCSS = [
        'background:linear-gradient(105deg,#C9A84C 0%,#C9A84C 28%,#FFF0A0 44%,#FFD060 50%,#C9A84C 66%,#C9A84C 100%)',
        'background-size:400% 100%',
        '-webkit-background-clip:text',
        'background-clip:text',
        '-webkit-text-fill-color:transparent',
        'color:transparent',
      ].join(';')

      // Body-level fly span — z:10000, hero font-size for full render quality.
      // CSS top/left set to hero position; FLIP transform offsets to loader.
      // opacity:0 until gsap.set reveals it in the same synchronous call.
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
          'opacity:0',
          isGold ? goldCSS : 'color:#F0EDE8',
        ].join(';')
        document.body.appendChild(el)
        flyEls.push(el)
        return el
      }

      const ronFly = makeFly('RON',     toRON, false)
      const perFly = makeFly('PEREIRA', toPER, true)

      // Text centres (for horizontal alignment in the FLIP math)
      const ronFromCx = ronFrom.left + ronFrom.width  / 2
      const perFromCx = perFrom.left + perFrom.width  / 2
      const toRONCx   = toRON.left   + toRON.width    / 2
      const toPERCx   = toPER.left   + toPER.width    / 2

      // FLIP: transform each fly so it visually appears at its loader position.
      // opacity:1 set in the same synchronous gsap.set — no stray paint.
      gsap.set(ronFly, {
        opacity: 1, x: ronFromCx - toRONCx, y: ronFrom.top - toRON.top,
        scale: loaderScale, transformOrigin: 'top center',
      })
      gsap.set(perFly, {
        opacity: 1, x: perFromCx - toPERCx, y: perFrom.top - toPER.top,
        scale: loaderScale, transformOrigin: 'top center',
      })

      // ── Phase 1: PEREIRA drops below RON (RON stays put) ──
      gsap.to(perFly, {
        x: ronFromCx - toPERCx,
        y: ronFrom.bottom - toPER.top,
        duration: 0.35,
        ease: 'power3.out',

        onComplete() {
          if (aborted) return

          // ── Re-anchor fly elements to current hero position ──────────────
          // Re-measure immediately before Phase 2. Corrects any scroll offset
          // that accumulated during Phase 1 (350ms). Technique: update fly CSS
          // top/left to fresh hero coords, compensate GSAP x/y by the same
          // delta so visual position is maintained. Phase 2's {x:0,y:0} target
          // then resolves to the hero element's actual current viewport rect.
          const freshRON = textRect(heroEl.children[0] as HTMLElement)
          const freshPER = textRect(heroEl.children[1] as HTMLElement)

          const ronGsapX = gsap.getProperty(ronFly, 'x') as number
          const ronGsapY = gsap.getProperty(ronFly, 'y') as number
          ronFly.style.top  = `${freshRON.top}px`
          ronFly.style.left = `${freshRON.left}px`
          gsap.set(ronFly, {
            x: ronGsapX + (toRON.left - freshRON.left),
            y: ronGsapY + (toRON.top  - freshRON.top),
          })

          const perGsapX = gsap.getProperty(perFly, 'x') as number
          const perGsapY = gsap.getProperty(perFly, 'y') as number
          perFly.style.top  = `${freshPER.top}px`
          perFly.style.left = `${freshPER.left}px`
          gsap.set(perFly, {
            x: perGsapX + (toPER.left - freshPER.left),
            y: perGsapY + (toPER.top  - freshPER.top),
          })

          // ── Phase 2: Both fly to hero positions ──
          gsap.timeline({
            onComplete() {
              if (aborted) return

              // ── Phase 3: Loader overlay dissolves — fly IS the name ───────
              // Do NOT touch fly elements or heroEl yet. The fly elements are
              // sitting at the hero position, fully visible, acting as the name
              // while the cover photo fades in around them.
              // power2.out: fast initial dissolve that eases to a gentle stop.
              gsap.to(bgRef.current,    { opacity: 0, duration: 1.0, ease: 'power2.out' })
              gsap.to(grainRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' })

              // ── Scroll-safe name swap at bg≈0 ────────────────────────────
              // At 900ms, power2.out has faded bg to ~0.01 — imperceptibly
              // transparent. Perform the swap in one requestAnimationFrame:
              //   1. heroEl.style.opacity = '1'  (inline beats CSS opacity:0 rule)
              //   2. remove fly elements          (fixed-position, won't scroll)
              //   3. dispatch rp:loader-done      (cascade: eyebrow, tagline, etc.)
              // Browser paints exactly once — no frame with zero name visible,
              // no frame with two names at different positions.
              // After swap, heroEl is static in-flow and scrolls with the page.
              setTimeout(() => {
                if (aborted) return
                requestAnimationFrame(() => {
                  heroEl.style.opacity = '1'
                  flyEls.forEach(el => el.remove())
                  flyEls.length = 0
                  window.dispatchEvent(new CustomEvent('rp:loader-done'))
                })
              }, 900)

              setTimeout(onComplete, 1100)
            },
          })
            .to(ronFly, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.inOut' }, 0)
            .to(perFly, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.inOut' }, 0)
        },
      })
    }, 2800)

    return () => {
      aborted = true
      clearTimeout(t2)
      clearTimeout(t5)
      leftTl.kill()
      rightTl.kill()
      gsap.killTweensOf([
        leftRef.current, rightRef.current, bgRef.current, grainRef.current,
        spotlightRef.current, nameRef.current, subtitleRef.current,
      ])
      flyEls.forEach(el => el.remove())
    }
  }, [onComplete])

  // Static render — Loader never re-renders after mount.
  // All opacity/transform changes are imperative via the refs above.
  return (
    <div className="fixed inset-0 z-[9000] overflow-hidden pointer-events-none">

      {/* Dark background */}
      <div ref={bgRef} className="absolute inset-0" style={{ background: '#06040A' }} />

      {/* Grain */}
      <div ref={grainRef} className="absolute inset-0 pointer-events-none"
        style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px)', zIndex:1 }} />

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
        <div className="absolute bottom-0 left-0 right-0 h-5"
          style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
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
        <div className="absolute bottom-0 left-0 right-0 h-5"
          style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
        <div className="absolute left-0 top-0 bottom-0 w-10"
          style={{ background:'linear-gradient(90deg,rgba(0,0,0,0.92) 0%,rgba(55,8,32,0.55) 35%,transparent 100%)' }} />
      </div>

      {/* SPOTLIGHT — opacity driven by RAF */}
      <div ref={spotlightRef} className="absolute inset-0 z-10 pointer-events-none"
        style={{ opacity: 0 }}>
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
      </div>

      {/* RON PEREIRA — opacity driven by RAF */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6">
        <div ref={nameRef}
          className="font-[var(--font-cinzel)] font-black text-center"
          style={{
            fontSize: 'clamp(0.85rem,3.5vw,1.75rem)',
            letterSpacing: '0.45em',
            textIndent: '0.45em',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            opacity: 0,
          }}>
          <span style={{ color:'var(--cream)' }}>RON </span>
          <span className="gold-shimmer">PEREIRA</span>
        </div>
      </div>

      {/* Subtitle + progress bar — opacity driven by RAF */}
      <div ref={subtitleRef}
        className="absolute z-20 flex flex-col items-center w-full pointer-events-none"
        style={{ top:'calc(50% + clamp(1.8rem,4vw,2.8rem))', opacity: 0 }}>
        <span style={{ color:'var(--gold)', opacity:0.8, fontFamily:'var(--font-mono)', fontSize:'0.4rem', letterSpacing:'0.44em' }}>
          Musician &nbsp;·&nbsp; Performer &nbsp;·&nbsp; Educator
        </span>
        <div className="w-32 h-px mt-4 overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
          <div ref={barRef} className="h-full"
            style={{
              background:'linear-gradient(90deg,transparent,var(--gold-l),var(--gold),var(--gold-l),transparent)',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }} />
        </div>
      </div>

    </div>
  )
}
