'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProps { onComplete: () => void }

export default function Loader({ onComplete }: LoaderProps) {
  const [curtainOpen, setCurtainOpen] = useState(false)
  const [bgFade,      setBgFade]      = useState(false)
  const [done,        setDone]        = useState(false)
  const [progress,    setProgress]    = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true), 80)
    const t2 = setTimeout(() => {
      const start = performance.now()
      const dur = 1500
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        setProgress(p)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 1000)
    const t5 = setTimeout(() => { setBgFade(true); onComplete() }, 2800)
    const t6 = setTimeout(() => setDone(true), 3600)
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t5);clearTimeout(t6) }
  }, [onComplete])

  if (done) return null

  return (
    <div className="fixed inset-0 z-[9000] overflow-hidden">

      {/* Dark background — fades out when name flies */}
      <motion.div className="absolute inset-0"
        style={{ background:'#06040A' }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.6, ease:'easeIn' }} />

      {/* Grain */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px)', zIndex:1 }}
        animate={{ opacity: bgFade ? 0 : 1 }}
        transition={{ duration: 0.4 }} />

      {/* LEFT CURTAIN */}
      <motion.div className="absolute top-0 left-0 bottom-0 overflow-hidden"
        style={{ width:'51vw', zIndex:30 }}
        animate={{ x: bgFade ? '-102%' : curtainOpen ? '-102%' : '0%' }}
        transition={{ duration:0.9, ease:[0.76,0,0.24,1] }}>
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,#1C0A1A 0%,#130610 40%,#0F0410 70%,#1A0818 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(80,10,50,0.7) 0%,rgba(160,40,90,0.15) 30%,rgba(60,8,35,0.5) 60%,rgba(40,5,25,0.8) 100%)' }} />
        {[9,22,35,48,61,74,87].map((p,i) => (
          <div key={p} className="absolute top-0 bottom-0"
            style={{ left:`${p}%`, width:i%2===0?'7%':'3%',
              background:i%2===0?'linear-gradient(90deg,rgba(0,0,0,0.5),rgba(180,60,100,0.08),rgba(0,0,0,0.4))':'linear-gradient(90deg,rgba(200,80,120,0.12),rgba(0,0,0,0))' }} />
        ))}
        {/* Gold on OUTER (left) edge only — not the inner edge that drags across screen */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background:'linear-gradient(180deg,transparent 3%,#F0D080 15%,#C9A84C 40%,#F8E090 60%,#C9A84C 85%,transparent 97%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
      </motion.div>

      {/* RIGHT CURTAIN */}
      <motion.div className="absolute top-0 right-0 bottom-0 overflow-hidden"
        style={{ width:'51vw', zIndex:30 }}
        animate={{ x: bgFade ? '102%' : curtainOpen ? '102%' : '0%' }}
        transition={{ duration:0.9, ease:[0.76,0,0.24,1] }}>
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,#1C0A1A 0%,#130610 40%,#0F0410 70%,#1A0818 100%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(270deg,rgba(80,10,50,0.7) 0%,rgba(160,40,90,0.15) 30%,rgba(60,8,35,0.5) 60%,rgba(40,5,25,0.8) 100%)' }} />
        {[9,22,35,48,61,74,87].map((p,i) => (
          <div key={p} className="absolute top-0 bottom-0"
            style={{ left:`${p}%`, width:i%2===0?'7%':'3%',
              background:i%2===0?'linear-gradient(90deg,rgba(0,0,0,0.5),rgba(180,60,100,0.08),rgba(0,0,0,0.4))':'linear-gradient(90deg,rgba(200,80,120,0.12),rgba(0,0,0,0))' }} />
        ))}
        {/* Gold on OUTER (right) edge only */}
        <div className="absolute right-0 top-0 bottom-0 w-[3px]"
          style={{ background:'linear-gradient(180deg,transparent 3%,#F0D080 15%,#C9A84C 40%,#F8E090 60%,#C9A84C 85%,transparent 97%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))' }} />
      </motion.div>

      {/* SPOTLIGHT — starts black, brightens with progress */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: bgFade ? 0 : progress }}
        transition={{ duration: bgFade ? 0.4 : 0.05 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position:'absolute', inset:0 }}>
          <defs>
            <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFE899" stopOpacity="0.95"/>
              <stop offset="12%"  stopColor="#FFCC44" stopOpacity="0.6"/>
              <stop offset="40%"  stopColor="#C87820" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#804000" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points="32,0 68,0 92,100 8,100" fill="url(#cg2)"/>
        </svg>
        <div className="absolute pointer-events-none"
          style={{ top:'48%', left:'50%', transform:'translate(-50%,-50%)',
            width:'80vw', maxWidth:'600px', height:'180px', borderRadius:'50%',
            background:'radial-gradient(ellipse,rgba(255,210,80,0.14) 0%,transparent 65%)' }} />
      </motion.div>

      {/* RON PEREIRA — always rendered; opacity driven by progress (no conditional mount = no flash) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6">
        <motion.div
          layoutId="hero-ron-pereira"
          className="font-[var(--font-cinzel)] font-black text-center"
          style={{ fontSize:'clamp(0.85rem,3.5vw,1.75rem)', letterSpacing:'0.45em', textIndent:'0.45em', lineHeight:1.15, whiteSpace:'nowrap' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: bgFade ? 1 : progress }}
          transition={{
            layout: { type:'spring', stiffness:40, damping:12, mass:2 },
            opacity: { duration: 0.05 }
          }}
        >
          <span style={{ color:'var(--cream)' }}>RON </span>
          <span className="gold-shimmer">PEREIRA</span>
        </motion.div>
      </div>

      {/* Subtitle + bar — always rendered; fades with bg */}
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
              transition={{ duration:0.05 }} />
          </div>
        </motion.div>
    </div>
  )
}
