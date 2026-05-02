'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ScrollReveal, AnimHeadingLine } from '@/components/ui/Reveal'

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness:100, damping:25 })

  return (
    <section id="about" ref={ref} className="section-base relative" style={{paddingBottom:"5rem", overflow:"visible"}}>
      <div className="section-atmo" />
      <div className="absolute pointer-events-none" style={{ width:'600px',height:'600px',background:'radial-gradient(ellipse,rgba(140,70,10,0.07),transparent 70%)',top:'-150px',right:'-150px',borderRadius:'50%',filter:'blur(100px)' }} />

      <ScrollReveal direction="right">
        <p className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6">
          <span className="w-10 h-px bg-[var(--gold)]" />The Artist
        </p>
      </ScrollReveal>

      <div className="font-[var(--font-cinzel)] font-black leading-[0.92] text-[clamp(2.4rem,5.5vw,5.5rem)] mb-14">
        <AnimHeadingLine text="A Life Lived"  smooth={smooth} direction="left"  entryStart={0.05} entryEnd={0.28} exitStart={0.72} exitEnd={0.88} />
        <AnimHeadingLine text="In Music"      smooth={smooth} direction="right" entryStart={0.1}  entryEnd={0.32} exitStart={0.74} exitEnd={0.9} gold />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_1.5fr] gap-14 max-lg:gap-10 items-start">
        {/* Portrait column */}
        <div>
          {/* This div is exactly portrait-width so badge positions correctly */}
          <div className="relative inline-block" style={{overflow:'visible'}}>
            <ScrollReveal direction="left">
              <div className="w-[260px] max-w-full border border-[var(--gold-border)]"
                style={{ background:'linear-gradient(145deg,#12090F,#080612)', aspectRatio:'1' }}>
                {['tl','tr','bl','br'].map(pos => (
                  <div key={pos} className="absolute w-5 h-5 border-[var(--gold)] border-solid"
                    style={{ top:pos.includes('t')?-1:'auto', bottom:pos.includes('b')?-1:'auto', left:pos.includes('l')?-1:'auto', right:pos.includes('r')?-1:'auto',
                      borderWidth:pos.includes('t')?pos.includes('l')?'1px 0 0 1px':'1px 1px 0 0':pos.includes('l')?'0 0 1px 1px':'0 1px 1px 0' }} />
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-25">
                  <span className="text-5xl">🎵</span>
                  <span className="font-[var(--font-mono)] text-[0.5rem] tracking-[0.3em] text-[var(--gold)]">[ ARTIST PORTRAIT ]</span>
                </div>
              </div>
            </ScrollReveal>
            {/* Badge — positions relative to the 260px portrait wrapper */}
            <div className="badge-spin absolute w-[65px] h-[65px] border border-[var(--gold)] rounded-full flex flex-col items-center justify-center"
              style={{ bottom:'-20px', right:'-20px', background:'#07050A', zIndex:20 }}>
              <span className="font-[var(--font-cinzel)] font-black gold-shimmer leading-none" style={{ fontSize:'1.15rem' }}>18</span>
              <span className="font-[var(--font-mono)] text-[0.33rem] tracking-[0.16em] text-[var(--cream-ghost)]">YEARS</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <ScrollReveal direction="right">
            <h3 className="font-[var(--font-cinzel)] font-bold text-[clamp(1.3rem,2.2vw,2.1rem)] leading-[1.25]">
              Ron Pereira is not just a musician —{' '}
              <em className="font-[var(--font-cormorant)] font-light italic">he is an experience.</em>
            </h3>
          </ScrollReveal>
          <ScrollReveal direction="left">
            <p className="font-[var(--font-cormorant)] text-[1rem] font-light leading-[2] text-[var(--cream-dim)]">
              With eighteen years of dedicated craft spanning classical training, contemporary performance, and artist development, Ron has built a reputation as one of Mumbai's most versatile and sought-after musicians.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <p className="font-[var(--font-cormorant)] text-[1rem] font-light leading-[2] text-[var(--cream-dim)]">
              From intimate private events in South Mumbai's finest residences to large-scale corporate productions and international festivals, Ron curates musical moments that guests remember years later.
            </p>
          </ScrollReveal>
        </div>
      </div>
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } } .badge-spin { animation: spin 20s linear infinite; }`}</style>
    </section>
  )
}
