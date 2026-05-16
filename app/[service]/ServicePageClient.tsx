'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Service, SERVICES } from '@/lib/services'
import Nav from '@/components/layout/Nav'
import SmoothScroll from '@/components/layout/SmoothScroll'
import Booking from '@/components/sections/Booking'
import Footer from '@/components/layout/Footer'
import { Reveal, StaggerReveal, StaggerItem } from '@/components/ui/Reveal'
import ServiceSwitcher from '@/components/ui/ServiceSwitcher'
import TiltCard from '@/components/ui/TiltCard'
import PhotoLightbox from '@/components/ui/PhotoLightbox'


function BookingWrapper({ svcId }: { svcId: string }) {
  return <Booking preSelected={svcId} />
}

export default function ServicePageClient({ service: svc }: { service: Service }) {
  const router = useRouter()

  // Turn horizontal trackpad swipe into service navigation
  // preventDefault() stops browser back gesture, then we handle it ourselves
  useEffect(() => {
    const currentIndex = SERVICES.findIndex(s => s.slug === svc.slug)
    const prevSvc = currentIndex > 0                   ? SERVICES[currentIndex - 1] : null
    const nextSvc = currentIndex < SERVICES.length - 1 ? SERVICES[currentIndex + 1] : null

    let navigating = false
    let swipeAccum = 0

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      e.stopPropagation()
      if (navigating) return

      swipeAccum += e.deltaX

      if (swipeAccum > 150 && nextSvc) {
        navigating = true
        router.push('/' + nextSvc.slug)
      } else if (swipeAccum < -150 && prevSvc) {
        navigating = true
        router.push('/' + prevSvc.slug)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [svc.slug])
  return (
    <SmoothScroll>
      <Nav />
      <div className="h-[60px]" />{/* Nav spacer */}
      <ServiceSwitcher currentSlug={svc.slug} />
      <main>
        <ServiceHero svc={svc} />
        {svc.acts        && <ActsSection        svc={svc} />}
        {svc.subServices && <SubServicesSection svc={svc} />}
        {svc.packages    && <PackagesSection    svc={svc} />}
        {svc.works    && <WorksSection     svc={svc} />}
        {svc.note     && <NoteSection      note={svc.note} />}
        <MediaSection svc={svc} />
        <BookingWrapper svcId={svc.id} />
      </main>
      <Footer />
    </SmoothScroll>
  )
}

/* ──────────────────────────────────────
   SERVICE HERO
────────────────────────────────────── */
function ServiceHero({ svc }: { svc: Service }) {
  return (
    <section className="relative min-h-[50vh] flex flex-col justify-end overflow-hidden">
      {/* Transparent — candlelight bg shines through from layout */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(6,4,10,0.45) 0%, rgba(6,4,10,0.2) 40%, rgba(6,4,10,0.75) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 60% at 65% 40%, rgba(160,80,10,0.15), transparent 70%)',
        }} />
      </div>

      {/* Bottom fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--ink)] to-transparent z-1" />

      <div className="relative z-10 px-16 pb-16 pt-36 max-md:px-6 max-md:pb-10 max-md:pt-28">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/#services" className="back-btn" data-cursor-hover>
            <span>←</span>
            <span>All Services</span>
          </Link>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
          className="text-5xl mb-6"
        >
          {svc.icon}
        </motion.div>

        {/* Title — single unit slide, no per-letter overhead */}
        <motion.h1
          className="font-[var(--font-cinzel)] font-black leading-[0.92] text-[clamp(3rem,8vw,9rem)] mb-6 gold-shimmer"
          initial={{ opacity: 0, x: -120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
        >
          {svc.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-[var(--font-cormorant)] font-light italic text-[clamp(1rem,2vw,1.5rem)] text-[var(--cream-dim)] max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {svc.tagline}
        </motion.p>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   ACTS SECTION (Violin, Guitar)
────────────────────────────────────── */
function ActsSection({ svc }: { svc: Service }) {
  const [selected, setSelected] = useState<string | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section ref={ref} className="section-base relative" style={{background:"rgba(6,4,10,0.65)"}}>
      <div className="section-atmo" />

      <motion.p
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -150 }}
        animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -150 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <span className="w-10 h-px bg-[var(--gold)]" />
        Available Formats
      </motion.p>

      <h2 className="font-[var(--font-cinzel)] font-black text-[clamp(2rem,4vw,4rem)] mb-12">
        <motion.span style={{ display:'inline-block' }}
          initial={{ opacity:0, x:'-105vw' }} animate={inView?{opacity:1,x:0}:{opacity:0,x:'-105vw'}}
          transition={{ type:'spring', stiffness:90, damping:20 }}>Select </motion.span>
        <motion.span className="gold-shimmer" style={{ display:'inline-block' }}
          initial={{ opacity:0, x:'105vw' }} animate={inView?{opacity:1,x:0}:{opacity:0,x:'105vw'}}
          transition={{ type:'spring', stiffness:90, damping:20, delay:0.1 }}>Your Format</motion.span>
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
        {svc.acts!.map((act, i) => (
          <motion.div
            key={act.id}
            className="flex-shrink-0 w-[82vw] snap-start md:w-auto"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.07 }}
          >
            <TiltCard>
            <div
              className={`border p-7 cursor-pointer transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${
                selected === act.id
                  ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.07)]'
                  : 'border-[var(--gold-border)] hover:border-[var(--gold-border-h)] bg-[rgba(15,12,18,0.6)]'
              }`}
              onClick={() => setSelected(selected === act.id ? null : act.id)}
              data-cursor-hover
            >
              <h3 className="font-[var(--font-cinzel)] font-bold text-[1.15rem] mb-3 tracking-[0.04em]">
                {act.name}
              </h3>
              <p className="font-[var(--font-cormorant)] text-[0.92rem] font-light leading-[1.8] text-[var(--gold)] mb-5">
                {act.desc}
              </p>

              {/* Book this format */}
              <a
                href={`https://wa.me/919870482225?text=${encodeURIComponent(`Hi Ron, I'd like to book: ${svc.name} — ${act.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.44rem] tracking-[0.25em] text-[var(--gold)] uppercase border border-[var(--gold-border)] px-4 py-2 hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
                data-cursor-hover
              >
                Book {act.name} →
              </a>

              {/* Bottom reveal line */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-l)]"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   SUB-SERVICES SECTION (Violin, Guitar)
────────────────────────────────────── */
function SubServicesSection({ svc }: { svc: Service }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section ref={ref} className="section-base relative" style={{ background: 'rgba(6,4,10,0.65)' }}>
      <div className="section-atmo" />

      <motion.p
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -150 }}
        animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -150 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <span className="w-10 h-px bg-[var(--gold)]" />
        Extended Services
      </motion.p>

      <h2 className="font-[var(--font-cinzel)] font-black text-[clamp(2rem,4vw,4rem)] mb-12">
        <motion.span style={{ display: 'inline-block' }}
          initial={{ opacity: 0, x: '-105vw' }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: '-105vw' }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}>Also </motion.span>
        <motion.span className="gold-shimmer" style={{ display: 'inline-block' }}
          initial={{ opacity: 0, x: '105vw' }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: '105vw' }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 }}>Available</motion.span>
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
        {svc.subServices!.map((sub, i) => (
          <motion.div
            key={sub.name}
            className="flex-shrink-0 w-[82vw] snap-start md:w-auto"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.07 }}
          >
            <TiltCard>
              <div
                className="border border-[var(--gold-border)] hover:border-[var(--gold-border-h)] bg-[rgba(15,12,18,0.6)] p-7 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm h-full"
                data-cursor-hover
              >
                <h3 className="font-[var(--font-cinzel)] font-bold text-[1.15rem] mb-3 tracking-[0.04em]">
                  {sub.name}
                </h3>
                <p className="font-[var(--font-cormorant)] text-[0.92rem] font-light leading-[1.8] text-[var(--gold)] mb-5">
                  {sub.desc}
                </p>

                <a
                  href={`https://wa.me/919870482225?text=${encodeURIComponent(`Hi Ron, I'd like to enquire about: ${svc.name} — ${sub.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.44rem] tracking-[0.25em] text-[var(--gold)] uppercase border border-[var(--gold-border)] px-4 py-2 hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
                  data-cursor-hover
                >
                  Book {sub.name} →
                </a>

                <motion.div
                  className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-l)]"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   PACKAGES SECTION (Teaching, Management)
────────────────────────────────────── */
function PackagesSection({ svc }: { svc: Service }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section ref={ref} className="section-base relative" style={{background:"rgba(6,4,10,0.65)"}}>
      <div className="section-atmo" />

      <motion.p
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: 150 }}
        animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: 150 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <span className="w-10 h-px bg-[var(--gold)]" />
        What's Available
      </motion.p>

      <h2 className="font-[var(--font-cinzel)] font-black text-[clamp(2rem,4vw,4rem)] mb-12 gold-shimmer">
        Packages & Pricing
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0 scrollbar-hide">
        {svc.packages!.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            className="flex-shrink-0 w-[82vw] snap-start md:w-auto border border-[var(--gold-border)] p-8 bg-[rgba(6,4,10,0.55)] backdrop-blur-sm hover:border-[var(--gold-border-h)] transition-colors relative overflow-hidden group"
            initial={{ opacity: 0, x: i % 2 === 0 ? -200 : 200, scale: 0.92 }}
            animate={inView
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: i % 2 === 0 ? -200 : 200, scale: 0.92 }
            }
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.08 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-[var(--font-cinzel)] font-bold text-[1.1rem] tracking-[0.04em]">
                {pkg.name}
              </h3>
              <span className="font-[var(--font-mono)] text-[0.5rem] tracking-[0.2em] text-[var(--gold)] bg-[var(--gold-dim)] px-3 py-1 whitespace-nowrap">
                {pkg.price}
              </span>
            </div>
            <p className="font-[var(--font-cormorant)] text-[0.95rem] font-light leading-[1.85] text-[var(--gold)] mb-5">
              {pkg.desc}
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              {pkg.items.map(item => (
                <li key={item} className="flex items-center gap-3 font-[var(--font-cormorant)] text-[0.88rem] text-[var(--gold)]">
                  <span className="text-[var(--gold)] text-xs">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/919870482225?text=${encodeURIComponent(`Hi Ron, I'd like to enquire about: ${pkg.name} — ${pkg.price}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.44rem] tracking-[0.25em] text-[var(--gold)] uppercase border border-[var(--gold-border)] px-4 py-2 hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
              data-cursor-hover
            >
              Enquire about this →
            </a>

            {/* Hover line */}
            <motion.div
              className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-l)]"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   WORKS SECTION (Direction, Composition, Mixing)
────────────────────────────────────── */
function WorksSection({ svc }: { svc: Service }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section ref={ref} className="section-base relative" style={{background:"rgba(6,4,10,0.65)"}}>
      <div className="section-atmo" />

      <motion.p
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -150 }}
        animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -150 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <span className="w-10 h-px bg-[var(--gold)]" />
        Previous Works
      </motion.p>

      <h2 className="font-[var(--font-cinzel)] font-black text-[clamp(2rem,4vw,4rem)] mb-12">
        <span className="gold-shimmer">Selected Works</span>
      </h2>

      <div className="flex flex-col gap-4">
        {svc.works!.map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -250 : 250 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -250 : 250 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.1 }}
            className="border border-[var(--gold-border)] p-7 hover:border-[var(--gold-border-h)] transition-colors bg-[rgba(6,4,10,0.55)] backdrop-blur-sm group relative overflow-hidden"
          >
            <div className="flex justify-between items-start gap-4 max-sm:flex-col">
              <div>
                <h3 className="font-[var(--font-cinzel)] font-bold text-[1.1rem] mb-1">{work.title}</h3>
                <p className="font-[var(--font-cormorant)] text-[0.95rem] text-[var(--cream-dim)]">{work.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.25em] text-[var(--gold)] mb-1">{work.role}</div>
                <div className="font-[var(--font-mono)] text-[0.42rem] tracking-[0.2em] text-[var(--cream-ghost)]">{work.client} · {work.year}</div>
              </div>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-l)]"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   NOTE SECTION
────────────────────────────────────── */
function NoteSection({ note }: { note: string }) {
  return (
    <section className="section-base relative" style={{background:"rgba(6,4,10,0.65)"}}>
      <Reveal>
        <div className="border border-[var(--gold-border)] p-8 bg-[rgba(201,168,76,0.03)] max-w-3xl">
          <span className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.35em] text-[var(--gold)] uppercase block mb-3">
            ✦ Note
          </span>
          <p className="font-[var(--font-cormorant)] text-[1rem] font-light leading-[1.9] text-[var(--cream-dim)]">
            {note}
          </p>
        </div>
      </Reveal>
    </section>
  )
}

/* ──────────────────────────────────────
   MEDIA SECTION — Photos, Videos, YouTube
────────────────────────────────────── */
function MediaSection({ svc }: { svc: Service }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  // Placeholder photo grid
  const PHOTOS = Array.from({ length: 6 }, (_, i) => ({
    id: String(i),
    src: `/images/placeholder-${i + 1}.jpg`,
  }))

  return (
    <section ref={ref} className="section-base relative" style={{background:"rgba(6,4,10,0.65)"}}>
      <div className="section-atmo" />

      <motion.p
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -150 }}
        animate={inView ? { opacity: 0.9, x: 0 } : { opacity: 0, x: -150 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <span className="w-10 h-px bg-[var(--gold)]" />
        Media
      </motion.p>

      {/* YouTube Players */}
      {svc.youtubeIds && svc.youtubeIds.length > 0 && (
        <div className="mb-14">
          <h3 className="font-[var(--font-cinzel)] font-bold text-[1.2rem] tracking-[0.08em] mb-6 gold-shimmer">
            Video Performances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {svc.youtubeIds.map((vid, i) => (
              <motion.div
                key={vid + i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.1 }}
                className="relative aspect-video bg-[rgba(15,12,18,0.8)] border border-[var(--gold-border)] overflow-hidden group cursor-pointer"
                onClick={() => setActiveVideo(vid)}
                data-cursor-hover
              >
                {vid.startsWith('PLACEHOLDER') ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--cream-ghost)]">
                    <span className="text-3xl opacity-30">▶</span>
                    <span className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.3em] text-[var(--gold)] opacity-50">
                      [ ADD YOUTUBE ID ]
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[var(--gold)] flex items-center justify-center text-black text-xl">
                        ▶
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Photo grid with lightbox */}
      <div>
        <h3 className="font-[var(--font-cinzel)] font-bold text-[1.2rem] tracking-[0.08em] mb-6 gold-shimmer">
          Photography
        </h3>
        <PhotoLightbox photos={PHOTOS.map((p, i) => ({ id: p.id, label: `Photo ${i+1} — ${svc.name}` }))} />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeVideo && !activeVideo.startsWith('PLACEHOLDER') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-[rgba(0,0,0,0.95)] flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-4xl aspect-video"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
            <button
              className="absolute top-6 right-6 text-[var(--cream-dim)] text-2xl hover:text-[var(--gold)] transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
