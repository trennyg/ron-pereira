'use client'

import { useRef, useState, useCallback } from 'react'

// Module-level flag — set during drag, checked by card Links
let isDragging = false
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'
import { useRef as useRefScroll } from 'react'

export default function ServicesGrid() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.1 })
  const trackRef    = useRef<HTMLDivElement>(null)
  const isDown      = useRef(false)
  const startX      = useRef(0)
  const scrollLeft  = useRef(0)
  const momentum    = useRef(0)
  const lastX       = useRef(0)
  const rafId       = useRef<number>()
  const dragDist    = useRef(0)

  const stopMomentum = () => { if (rafId.current) cancelAnimationFrame(rafId.current) }

  const glide = () => {
    const track = trackRef.current
    if (!track) return
    if (Math.abs(momentum.current) < 0.5) { momentum.current = 0; return }
    track.scrollLeft += momentum.current
    momentum.current *= 0.92
    rafId.current = requestAnimationFrame(glide)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current; if (!track) return
    isDown.current = true; startX.current = e.pageX
    scrollLeft.current = track.scrollLeft; lastX.current = e.pageX
    momentum.current = 0; dragDist.current = 0; stopMomentum()
    e.preventDefault()
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current || !trackRef.current) return
    const dx = e.pageX - startX.current
    dragDist.current = Math.abs(dx)
    if (dragDist.current > 6) isDragging = true
    momentum.current = (lastX.current - e.pageX) * 1.4
    lastX.current = e.pageX
    trackRef.current.scrollLeft = scrollLeft.current - dx
    e.preventDefault()
  }
  const onPointerUp = () => { isDown.current = false; setTimeout(() => { isDragging = false }, 50); glide() }
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault(); stopMomentum()
    if (trackRef.current) trackRef.current.scrollLeft += e.deltaY + e.deltaX
  }

  return (
    <section id="services" ref={ref} className="relative py-24 overflow-hidden glass-section">
      <div className="section-atmo" />
      <div className="px-16 max-md:px-6 mb-12">
        <motion.p
          className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-5"
          initial={{ opacity: 0, x: -150 }}
          animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -150 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        >
          <span className="w-10 h-px bg-[var(--gold)]" />
          The Repertoire
        </motion.p>
        <h2 className="font-[var(--font-cinzel)] font-black leading-[0.92] text-[clamp(2.5rem,6vw,6rem)]">
          {['One Artist,', 'Infinite'].map((line, li) => (
            <div key={li} className="block">
              {line.split('').map((ch, ci) => (
                <motion.span key={ci} style={{ display:'inline-block' }}
                  initial={{ opacity:0, x: ci%2===0?-300:300, filter:'blur(6px)' }}
                  animate={inView?{opacity:1,x:0,filter:'blur(0px)'}:{opacity:0,x:ci%2===0?-300:300,filter:'blur(6px)'}}
                  transition={{ type:'spring', stiffness:85, damping:17, delay: li*0.25+ci*0.03 }}
                >{ch===' '?' ':ch}</motion.span>
              ))}
            </div>
          ))}
          <div className="block">
            {'Expressions'.split('').map((ch, ci) => (
              <motion.span key={ci} style={{ display:'inline-block' }} className="gold-shimmer"
                initial={{ opacity:0, x: ci%2===0?-300:300, filter:'blur(6px)' }}
                animate={inView?{opacity:1,x:0,filter:'blur(0px)'}:{opacity:0,x:ci%2===0?-300:300,filter:'blur(6px)'}}
                transition={{ type:'spring', stiffness:85, damping:17, delay:0.55+ci*0.035 }}
              >{ch}</motion.span>
            ))}
          </div>
        </h2>
      </div>

      <motion.div
        initial={{ opacity:0, y:60 }}
        animate={inView?{opacity:1,y:0}:{opacity:0,y:60}}
        transition={{ type:'spring', stiffness:80, damping:18, delay:0.4 }}
      >
        <div ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-4 px-16 max-md:px-6 select-none"
          style={{ scrollbarWidth:'none', cursor:'grab', WebkitOverflowScrolling:'touch' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}
        >
          {SERVICES.map((svc, i) => <ServiceCard key={svc.id} svc={svc} index={i} dragDist={dragDist} />)}
        </div>
      </motion.div>

      <div className="px-16 max-md:px-6 mt-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--gold-border)]" />
        <span className="font-[var(--font-mono)] text-[0.42rem] tracking-[0.3em] text-[var(--cream-ghost)] uppercase">Drag to explore</span>
        <div className="h-px flex-1 bg-[var(--gold-border)]" />
      </div>
    </section>
  )
}

function ServiceCard({ svc, index, dragDist }: { svc: (typeof SERVICES)[0]; index: number; dragDist: React.MutableRefObject<number> }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState('')
  const tx=useRef(0),ty=useRef(0),cx=useRef(0),cy=useRef(0),vx=useRef(0),vy=useRef(0)
  const raf=useRef<number>(), inside=useRef(false)

  const spring = useCallback(() => {
    vx.current += (tx.current-cx.current)*0.13; vy.current += (ty.current-cy.current)*0.13
    vx.current *= 0.80; vy.current *= 0.80
    cx.current += vx.current; cy.current += vy.current
    const done = Math.abs(vx.current)<0.003 && Math.abs(vy.current)<0.003 &&
                 Math.abs(tx.current-cx.current)<0.003 && Math.abs(ty.current-cy.current)<0.003
    if (done && !inside.current) { setTilt(''); return }
    setTilt(`perspective(900px) rotateX(${cy.current}deg) rotateY(${cx.current}deg) scale3d(1.03,1.03,1.03)`)
    raf.current = requestAnimationFrame(spring)
  }, [])

  const onMouseMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect(); if (!r) return
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height
    tx.current=(px-0.5)*18; ty.current=-(py-0.5)*18
    if (shineRef.current) { shineRef.current.style.setProperty('--sx',`${px*100}%`); shineRef.current.style.setProperty('--sy',`${py*100}%`) }
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(spring)
  }

  const formatTags = svc.acts ?? svc.packages ?? []

  return (
    <div ref={cardRef} style={{ flex:'0 0 255px', transform:tilt, transformStyle:'preserve-3d', willChange:'transform' }}
      onMouseMove={onMouseMove} onMouseEnter={()=>{inside.current=true}}
      onMouseLeave={()=>{ inside.current=false; tx.current=0; ty.current=0; if(raf.current) cancelAnimationFrame(raf.current); raf.current=requestAnimationFrame(spring) }}
    >
      <Link href={`/${svc.slug}`} draggable={false} data-cursor-hover
        className="block h-full border border-[var(--gold-border)] hover:border-[var(--gold-border-h)] transition-colors duration-300 relative overflow-hidden group"
        style={{ background: '#0A0A0C' }}
      >
        <div ref={shineRef} className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background:'radial-gradient(280px circle at var(--sx,50%) var(--sy,50%), rgba(201,168,76,0.1), transparent 70%)' }} />
        <div className="p-6 relative z-10">

          {/* Icon + numbered badge */}
          <div className="flex justify-between items-start mb-5">
            <span className="text-2xl">{svc.icon}</span>
            <span
              className="font-[var(--font-cinzel)] font-black text-[3rem] leading-none"
              style={{ color: 'rgba(201,168,76,0.25)' }}
            >
              {String(index+1).padStart(2,'0')}
            </span>
          </div>

          {/* Service title */}
          <h3
            className="font-[var(--font-cinzel)] font-semibold tracking-[0.04em] mb-2 text-[1.375rem] max-sm:text-[1.125rem]"
            style={{ color: '#F5F0E8' }}
          >
            {svc.name}
          </h3>

          {/* Tagline */}
          <p
            className="font-[var(--font-cormorant)] font-light leading-[1.6] mb-4 text-[1rem] max-sm:text-[0.875rem]"
            style={{ color: 'rgba(245,240,232,0.80)' }}
          >
            {svc.tagline}
          </p>

          {/* Format / package tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {formatTags.slice(0,3).map(item => (
              <span
                key={item.id}
                className="font-[var(--font-mono)] text-[11px] tracking-[0.08em] px-[10px] py-[4px] uppercase"
                style={{ border: '1px solid rgba(201,168,76,0.45)', color: 'var(--gold)' }}
              >
                {item.name}
              </span>
            ))}
            {formatTags.length > 3 && (
              <span className="font-[var(--font-mono)] text-[11px] tracking-[0.08em] px-[10px] py-[4px] text-[var(--gold)] uppercase">
                +{formatTags.length-3} more
              </span>
            )}
          </div>

          {/* Sub-service tags — Music Direction, Music Composition, Mixing & Mastering */}
          {svc.subServices && svc.subServices.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 pt-2.5 border-t border-[var(--gold-border)]">
              {svc.subServices.map(name => (
                <span
                  key={name}
                  className="font-[var(--font-mono)] text-[11px] tracking-[0.08em] px-[10px] py-[4px] uppercase"
                  style={{ border: '1px solid rgba(201,168,76,0.45)', color: 'var(--gold)' }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          {!svc.subServices && <div className="mb-4" />}

          {/* Explore CTA */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--gold)] text-xs group-hover:bg-[var(--gold)] group-hover:text-black transition-all duration-300"
              style={{ border: '1px solid rgba(201,168,76,0.4)' }}
            >
              →
            </div>
            <span
              className="font-[var(--font-mono)] text-[12px] tracking-[0.22em] uppercase"
              style={{ color: 'rgba(245,240,232,0.90)' }}
            >
              Explore
            </span>
          </div>
        </div>

        {/* Gold underline on hover */}
        <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-l)]"
          initial={{ width:0 }} whileHover={{ width:'100%' }}
          transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
          style={{ boxShadow:'0 0 6px var(--gold)' }} />
      </Link>
    </div>
  )
}
