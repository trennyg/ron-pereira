'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Photo { id: string; src?: string; label: string }

export default function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const prev = useCallback(() => {
    setActiveIdx(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
  }, [photos.length])

  const next = useCallback(() => {
    setActiveIdx(i => i !== null ? (i + 1) % photos.length : null)
  }, [photos.length])

  const close = useCallback(() => setActiveIdx(null), [])

  // Keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx, prev, next, close])

  // Touch swipe inside lightbox
  let touchStartX = 0
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (diff > 50)  next()
    if (diff < -50) prev()
  }

  // Trackpad swipe inside lightbox
  let wheelAccum = 0
  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation() // prevent service page swipe
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    wheelAccum += e.deltaX
    if (wheelAccum > 60)  { next(); wheelAccum = 0 }
    if (wheelAccum < -60) { prev(); wheelAccum = 0 }
  }

  const active = activeIdx !== null ? photos[activeIdx] : null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <motion.div key={photo.id}
            className="aspect-[4/3] border border-[var(--gold-border)] bg-[rgba(6,4,10,0.5)] flex items-center justify-center hover:border-[var(--gold-border-h)] transition-all duration-300 group relative overflow-hidden cursor-pointer"
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            onClick={() => setActiveIdx(i)} data-cursor-hover>
            {photo.src
              ? <img src={photo.src} alt={photo.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl opacity-20">📷</span>
                  <span className="font-[var(--font-mono)] text-[0.38rem] tracking-[0.22em] text-[var(--gold)] opacity-30 uppercase">{photo.label}</span>
                </div>
              )
            }
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[var(--gold)] text-2xl">⤢</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox — always centred, swipeable */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }}
            className="fixed inset-0 z-[9500] flex items-center justify-center"
            style={{ background:'rgba(4,3,8,0.97)', backdropFilter:'blur(20px)' }}
            onClick={close}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div key={activeIdx}
                initial={{ opacity:0, x:60, scale:0.96 }}
                animate={{ opacity:1, x:0, scale:1 }}
                exit={{ opacity:0, x:-60, scale:0.96 }}
                transition={{ type:'spring', stiffness:260, damping:28 }}
                className="relative border border-[var(--gold-border)] mx-16"
                style={{ width:'min(880px,88vw)', maxHeight:'82vh', background:'rgba(6,4,10,0.95)', overflow:'hidden' }}
                onClick={e => e.stopPropagation()}
              >
                {active.src
                  ? <img src={active.src} alt={active.label} style={{ width:'100%', maxHeight:'75vh', objectFit:'contain', display:'block' }} />
                  : (
                    <div className="flex flex-col items-center justify-center gap-4 p-16" style={{ minHeight:'40vh' }}>
                      <span className="text-5xl opacity-20">📷</span>
                      <span className="font-[var(--font-mono)] text-[0.46rem] tracking-[0.3em] text-[var(--gold)] opacity-40 uppercase">{active.label}</span>
                      <span className="font-[var(--font-cormorant)] text-[var(--cream-dim)] text-sm italic">Add real image src to see photo</span>
                    </div>
                  )
                }
                {/* Label + counter */}
                <div className="flex justify-between items-center px-4 py-2 border-t border-[var(--gold-border)]">
                  <span className="font-[var(--font-mono)] text-[0.4rem] tracking-[0.2em] text-[var(--gold-dim)] uppercase">{active.label}</span>
                  <span className="font-[var(--font-mono)] text-[0.4rem] tracking-[0.15em] text-[var(--cream-ghost)]">{(activeIdx??0)+1} / {photos.length}</span>
                </div>
                {/* Close */}
                <button onClick={close}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-[var(--gold-border)] text-[var(--cream-dim)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-all"
                  style={{ background:'rgba(6,4,10,0.9)', cursor:'pointer' }}>✕</button>
              </motion.div>
            </AnimatePresence>

            {/* Prev arrow */}
            <button onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold)] text-xl hover:bg-[rgba(201,168,76,0.1)] transition-all"
              style={{ cursor:'pointer' }}>‹</button>

            {/* Next arrow */}
            <button onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold)] text-xl hover:bg-[rgba(201,168,76,0.1)] transition-all"
              style={{ cursor:'pointer' }}>›</button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
              {photos.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setActiveIdx(i) }}
                  className="rounded-full transition-all"
                  style={{ width: i===activeIdx?'16px':'6px', height:'6px', background: i===activeIdx?'var(--gold)':'rgba(201,168,76,0.3)', cursor:'pointer' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
