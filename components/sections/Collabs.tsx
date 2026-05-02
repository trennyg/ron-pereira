'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ScrollReveal, AnimHeadingLine } from '@/components/ui/Reveal'
import PhotoLightbox from '@/components/ui/PhotoLightbox'

const COLLABS = [
  { id:'a', name:'Artist Name A', role:'Vocalist · Collaborator',    event:'Event Name · 2024', icon:'🎵' },
  { id:'b', name:'Artist Name B', role:'Composer · Producer',        event:'Event Name · 2023', icon:'🎶' },
  { id:'c', name:'Artist Name C', role:'Guitarist · Session Artist', event:'Event Name · 2024', icon:'🎸' },
  { id:'d', name:'Artist Name D', role:'Saxophonist · Jazz Artist',  event:'Event Name · 2023', icon:'🎷' },
  { id:'e', name:'Artist Name E', role:'Vocalist · Film Artist',     event:'Event Name · 2024', icon:'🎤' },
  { id:'f', name:'Artist Name F', role:'Keys · Arranger',            event:'Event Name · 2024', icon:'🎹' },
  { id:'g', name:'Artist Name G', role:'Drummer · Percussionist',    event:'Event Name · 2023', icon:'🥁' },
  { id:'h', name:'Artist Name H', role:'Bassist · Producer',         event:'Event Name · 2024', icon:'🎼' },
]

export default function Collabs() {
  const ref     = useRef(null)
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
    const cards = track.querySelectorAll('.collab-card-item')
    const clone  = track.cloneNode(true) as HTMLDivElement
    // We'll just use scrollLeft wrap-around approach
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
          <div key={`${c.id}-${i}`} className="collab-card-item flex-shrink-0 w-[220px] border border-[var(--gold-border)] bg-[rgba(15,10,6,0.7)] backdrop-blur-sm relative overflow-hidden group hover:border-[var(--gold-border-h)] transition-colors duration-300 cursor-pointer"
            style={{ aspectRatio:'1' }}
>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 group-hover:opacity-0">
              <div className="w-14 h-14 border border-[var(--gold-border)] rounded-full flex items-center justify-center text-2xl">{c.icon}</div>
              <span className="font-[var(--font-cinzel)] text-[0.85rem] font-bold text-center">{c.name}</span>
              <span className="font-[var(--font-mono)] text-[0.4rem] tracking-[0.22em] text-[var(--cream-dim)] text-center">{c.role.split(' · ')[0]}</span>
            </div>
            <div className="absolute inset-0 bg-[rgba(8,5,2,0.95)] flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-5 text-center">
              <span className="font-[var(--font-cinzel)] font-bold text-[1rem] gold-shimmer">{c.name}</span>
              <span className="font-[var(--font-mono)] text-[0.42rem] tracking-[0.28em] text-[var(--cream-dim)]">{c.role}</span>
              <span className="font-[var(--font-cormorant)] text-[0.82rem] italic text-[var(--cream-ghost)] mt-1">{c.event}</span>
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      <p className="text-center font-[var(--font-mono)] text-[0.42rem] tracking-[0.3em] text-[var(--cream-ghost)] mt-4 uppercase">Drag to explore</p>

    </section>
  )
}
