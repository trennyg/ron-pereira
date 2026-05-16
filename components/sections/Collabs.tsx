'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ScrollReveal, AnimHeadingLine } from '@/components/ui/Reveal'

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
          <div
            key={`${c.id}-${i}`}
            className="collab-card-item flex-shrink-0 w-[280px] relative group cursor-pointer"
            style={{ aspectRatio: '1', background: '#0A0A0C' }}
          >

            {/* ── Image zone — top 68%, margin:10px for filigree breathing room ── */}
            {/* overflow:visible lets diamond studs and bracket lines extend outside */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: 'calc(68% - 10px)',
              overflow: 'visible',
              background: 'rgba(201,168,76,0.025)',
              border: '2px solid #C9A84C',
              boxShadow: '0 0 0 5px rgba(201,168,76,0.06)',
            }}>

              {/* Placeholder glyph — replace this div with <Image fill objectFit="cover"> when ready */}
              <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'1.6rem', color:'rgba(201,168,76,0.13)' }}>✦</span>
              </div>

              {/* Hover overlay — placed before filigree so filigree renders on top via DOM order */}
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(8,5,2,0.82)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <span className="font-[var(--font-cinzel)] font-bold gold-shimmer" style={{ fontSize:'1rem' }}>{c.name}</span>
                <span className="font-[var(--font-mono)]" style={{ fontSize:'0.4rem', letterSpacing:'0.28em', color:'rgba(240,237,232,0.55)' }}>{c.role}</span>
                <span className="font-[var(--font-cormorant)]" style={{ fontSize:'0.85rem', fontStyle:'italic', color:'rgba(240,237,232,0.3)', marginTop:'6px' }}>{c.event}</span>
              </div>

              {/* ─── Filigree frame — all inline styles ─── */}

              {/* Corner diamond studs — 4 total, 8×8px rotated 45° */}
              <div style={{ position:'absolute', width:8, height:8, background:'#C9A84C', transform:'rotate(45deg)', top:-5,    left:-5   }} />
              <div style={{ position:'absolute', width:8, height:8, background:'#C9A84C', transform:'rotate(45deg)', top:-5,    right:-5  }} />
              <div style={{ position:'absolute', width:8, height:8, background:'#C9A84C', transform:'rotate(45deg)', bottom:-5, left:-5   }} />
              <div style={{ position:'absolute', width:8, height:8, background:'#C9A84C', transform:'rotate(45deg)', bottom:-5, right:-5  }} />

              {/* Corner bracket lines — 8 total (1H + 1V per corner), 1px × 16px */}
              {/* Top-left */}
              <div style={{ position:'absolute', top:-7,    left:0,   width:16, height:1,  background:'#C9A84C' }} />
              <div style={{ position:'absolute', left:-7,   top:0,    width:1,  height:16, background:'#C9A84C' }} />
              {/* Top-right */}
              <div style={{ position:'absolute', top:-7,    right:0,  width:16, height:1,  background:'#C9A84C' }} />
              <div style={{ position:'absolute', right:-7,  top:0,    width:1,  height:16, background:'#C9A84C' }} />
              {/* Bottom-left */}
              <div style={{ position:'absolute', bottom:-7, left:0,   width:16, height:1,  background:'#C9A84C' }} />
              <div style={{ position:'absolute', left:-7,   bottom:0, width:1,  height:16, background:'#C9A84C' }} />
              {/* Bottom-right */}
              <div style={{ position:'absolute', bottom:-7, right:0,  width:16, height:1,  background:'#C9A84C' }} />
              <div style={{ position:'absolute', right:-7,  bottom:0, width:1,  height:16, background:'#C9A84C' }} />

              {/* Mid-side diamonds — 4 total, 5×5px rotated 45° */}
              <div style={{ position:'absolute', width:5, height:5, background:'#C9A84C', transform:'rotate(45deg)', top:-4,    left:'50%', marginLeft:-2.5 }} />
              <div style={{ position:'absolute', width:5, height:5, background:'#C9A84C', transform:'rotate(45deg)', bottom:-4, left:'50%', marginLeft:-2.5 }} />
              <div style={{ position:'absolute', width:5, height:5, background:'#C9A84C', transform:'rotate(45deg)', left:-4,   top:'50%',  marginTop:-2.5  }} />
              <div style={{ position:'absolute', width:5, height:5, background:'#C9A84C', transform:'rotate(45deg)', right:-4,  top:'50%',  marginTop:-2.5  }} />

              {/* Flanking dashes — 8 total, 1px × 18px, rgba(201,168,76,0.45) */}
              {/* Top side */}
              <div style={{ position:'absolute', top:-7,    left:22,   width:18, height:1,  background:'rgba(201,168,76,0.45)' }} />
              <div style={{ position:'absolute', top:-7,    right:22,  width:18, height:1,  background:'rgba(201,168,76,0.45)' }} />
              {/* Bottom side */}
              <div style={{ position:'absolute', bottom:-7, left:22,   width:18, height:1,  background:'rgba(201,168,76,0.45)' }} />
              <div style={{ position:'absolute', bottom:-7, right:22,  width:18, height:1,  background:'rgba(201,168,76,0.45)' }} />
              {/* Left side */}
              <div style={{ position:'absolute', left:-7,   top:20,    width:1,  height:18, background:'rgba(201,168,76,0.45)' }} />
              <div style={{ position:'absolute', left:-7,   bottom:20, width:1,  height:18, background:'rgba(201,168,76,0.45)' }} />
              {/* Right side */}
              <div style={{ position:'absolute', right:-7,  top:20,    width:1,  height:18, background:'rgba(201,168,76,0.45)' }} />
              <div style={{ position:'absolute', right:-7,  bottom:20, width:1,  height:18, background:'rgba(201,168,76,0.45)' }} />

            </div>

            {/* ── Name + role strip — bottom 32% ── */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '32%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '0 12px',
            }}>
              <span
                className="font-[var(--font-cinzel)]"
                style={{ fontSize:'0.82rem', fontWeight:700, color:'#F0EDE8', textAlign:'center', lineHeight:1.2 }}
              >
                {c.name}
              </span>
              <span
                className="font-[var(--font-mono)]"
                style={{ fontSize:'0.38rem', letterSpacing:'0.22em', color:'rgba(240,237,232,0.45)', textAlign:'center' }}
              >
                {c.role.split(' · ')[0]}
              </span>
            </div>

          </div>
        ))}
      </div>
      <p className="text-center font-[var(--font-mono)] text-[0.42rem] tracking-[0.3em] text-[var(--cream-ghost)] mt-4 uppercase">Drag to explore</p>

    </section>
  )
}
