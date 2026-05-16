'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ScrollReveal, AnimHeadingLine } from '@/components/ui/Reveal'

const COLLABS = [
  { id:'a', name:'Artist Name A', role:'Vocalist · Collaborator',    event:'Event Name · 2024' },
  { id:'b', name:'Artist Name B', role:'Composer · Producer',        event:'Event Name · 2023' },
  { id:'c', name:'Artist Name C', role:'Guitarist · Session Artist', event:'Event Name · 2024' },
  { id:'d', name:'Artist Name D', role:'Saxophonist · Jazz Artist',  event:'Event Name · 2023' },
  { id:'e', name:'Artist Name E', role:'Vocalist · Film Artist',     event:'Event Name · 2024' },
  { id:'f', name:'Artist Name F', role:'Keys · Arranger',            event:'Event Name · 2024' },
  { id:'g', name:'Artist Name G', role:'Drummer · Percussionist',    event:'Event Name · 2023' },
  { id:'h', name:'Artist Name H', role:'Bassist · Producer',         event:'Event Name · 2024' },
]

export default function Collabs() {
  const ref      = useRef(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness:100, damping:25 })

  // Auto-scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let paused = false
    let pos = 0
    let raf: number

    const SPEED = 0.6 // px per frame

    // Duplicate cards for seamless loop
    const totalW = () => track.scrollWidth / 2

    // Pause on any interaction
    const pause  = () => { paused = true }
    const resume = () => { paused = false }
    track.addEventListener('pointerenter', pause)
    track.addEventListener('pointerleave', resume)
    track.addEventListener('touchstart',   pause, { passive: true })
    track.addEventListener('touchend', () => setTimeout(resume, 2000), { passive: true })

    function tick() {
      if (!paused && track) {
        pos += SPEED
        if (pos >= totalW()) pos = 0
        track.scrollLeft = pos
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Manual drag — pointer events (desktop)
    let isDown = false, startX = 0, startScroll = 0, lastX = 0
    const onDown = (e: PointerEvent) => {
      isDown=true; startX=e.pageX; startScroll=track.scrollLeft; lastX=e.pageX; pos=track.scrollLeft
      if (e.pointerType !== 'touch') { track.setPointerCapture(e.pointerId); e.preventDefault() }
    }
    const onMove = (e: PointerEvent) => {
      if(!isDown) return
      pos=startScroll+(startX-e.pageX); track.scrollLeft=pos
      if (e.pointerType !== 'touch') e.preventDefault()
    }
    const onUp = () => { isDown=false }
    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup',   onUp)
    track.addEventListener('pointercancel', onUp)

    return () => { cancelAnimationFrame(raf) }
  }, [])

  const doubled = [...COLLABS, ...COLLABS] // duplicate for seamless loop

  return (
    <section id="collabs" ref={ref} className="relative py-24 overflow-hidden glass-section">
      <div className="section-atmo" />
      <div className="px-16 max-md:px-6 mb-12">
        <ScrollReveal direction="left">
          <p className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-5">
            <span className="w-10 h-px bg-[var(--gold)]" />The Network
          </p>
        </ScrollReveal>
        <div className="font-[var(--font-cinzel)] font-black leading-[0.92] text-[clamp(2.4rem,5.5vw,5.5rem)]">
          <AnimHeadingLine text="Crafted With" smooth={smooth} direction="left"  entryStart={0.08} entryEnd={0.3} exitStart={0.7} exitEnd={0.88} />
          <AnimHeadingLine text="The Best"     smooth={smooth} direction="right" entryStart={0.13} entryEnd={0.34} exitStart={0.72} exitEnd={0.9} gold />
        </div>
      </div>

      {/* Auto-scrolling horizontal track */}
      <div ref={trackRef} className="flex gap-4 overflow-x-auto pb-2 select-none" style={{ scrollbarWidth:'none', WebkitOverflowScrolling:'touch', cursor:'grab', touchAction:'pan-x', overscrollBehaviorX:'contain' }}>
        {doubled.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="collab-card-item flex-shrink-0 w-[280px] relative group cursor-pointer flex flex-col bg-[rgba(10,7,4,0.9)]"
            style={{ aspectRatio: '1' }}
          >
            {/* Image zone — top 65% */}
            <div
              className="relative flex-none overflow-hidden border border-[rgba(201,168,76,0.12)]"
              style={{ height: '65%' }}
            >
              {/* Placeholder background + glyph — swap this div for <Image fill object-cover> when ready */}
              <div className="absolute inset-0 bg-[rgba(201,168,76,0.04)] flex items-center justify-center">
                <span style={{ color: 'var(--gold)', opacity: 0.18, fontSize: '2rem' }}>✦</span>
              </div>

              {/* Corner bracket — top-left */}
              <div className="absolute top-0 left-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-5 h-px bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:w-7 transition-all duration-300" />
                <div className="absolute top-0 left-0 w-px h-5 bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:h-7 transition-all duration-300" />
              </div>
              {/* Corner bracket — top-right */}
              <div className="absolute top-0 right-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-5 h-px bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:w-7 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-px h-5 bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:h-7 transition-all duration-300" />
              </div>
              {/* Corner bracket — bottom-left */}
              <div className="absolute bottom-0 left-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-5 h-px bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:w-7 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-px h-5 bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:h-7 transition-all duration-300" />
              </div>
              {/* Corner bracket — bottom-right */}
              <div className="absolute bottom-0 right-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-5 h-px bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:w-7 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-px h-5 bg-[var(--gold)] opacity-60 group-hover:opacity-100 group-hover:h-7 transition-all duration-300" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[rgba(8,5,2,0.72)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <span className="font-[var(--font-cinzel)] font-bold text-[0.95rem] gold-shimmer">{c.name}</span>
                <span className="font-[var(--font-mono)] text-[0.38rem] tracking-widest text-[var(--cream-dim)]">{c.role}</span>
                <span className="font-[var(--font-cormorant)] text-[0.82rem] italic text-[var(--cream-ghost)] mt-1">{c.event}</span>
              </div>
            </div>

            {/* Name + role strip — bottom 35% */}
            <div className="flex-1 flex flex-col items-center justify-center px-3 gap-1">
              <span className="font-[var(--font-cinzel)] text-[0.82rem] font-bold text-center leading-tight">{c.name}</span>
              <span className="font-[var(--font-mono)] text-[0.38rem] tracking-widest text-[var(--cream-dim)] text-center">{c.role}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center font-[var(--font-mono)] text-[0.42rem] tracking-[0.3em] text-[var(--cream-ghost)] mt-4 uppercase">Drag to explore</p>

    </section>
  )
}
