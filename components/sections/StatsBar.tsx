'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: 18,  suffix: '+', label: 'Years Performing'     },
  { value: 500, suffix: '+', label: 'Events'               },
  { value: 200, suffix: '+', label: 'Collaborations'       },
  { value: 12,  suffix: '+', label: 'Awards & Recognition' },
]

function animateCounter(el: HTMLElement, target: number, duration: number): void {
  let lastTime: number | null = null
  let elapsed = 0

  function tick(now: number): void {
    if (!lastTime) {
      lastTime = now
      requestAnimationFrame(tick)
      return
    }
    const delta = Math.min(now - lastTime, 16)
    lastTime = now
    elapsed = Math.min(elapsed + delta, duration)

    const progress = elapsed / duration
    const eased = 1 - Math.pow(2, -10 * progress)
    el.textContent = String(Math.round(eased * target))

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      el.textContent = String(target)
    }
  }

  requestAnimationFrame(tick)
}

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        STATS.forEach((stat, idx) => {
          setTimeout(() => {
            const numEl = numberRefs.current[idx]
            if (numEl) animateCounter(numEl, stat.value, 2000)

            const line = lineRefs.current[idx]
            if (line) line.style.width = '100%'
          }, idx * 120)
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      style={{
        background: 'var(--obsidian)',
        borderTop: '1px solid rgba(201,168,76,0.08)',
      }}
    >
      <div
        ref={containerRef}
        className="
          max-w-7xl mx-auto px-16 max-md:px-6 max-sm:px-4
          py-[80px] max-md:py-[56px]
          grid grid-cols-4 max-sm:grid-cols-2
          gap-12 max-sm:gap-x-8 max-sm:gap-y-14
        "
      >
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1],
              delay: idx * 0.12,
            }}
          >
            {/* Number + suffix */}
            <div className="flex items-baseline leading-none mb-4">
              <span
                ref={el => { numberRefs.current[idx] = el }}
                className="font-[var(--font-cinzel)] font-black"
                style={{ fontSize: 'clamp(3rem,5.5vw,4.5rem)', color: 'var(--gold)' }}
              >
                0
              </span>
              <span
                className="font-[var(--font-cinzel)] font-black"
                style={{ fontSize: 'clamp(1.8rem,3.3vw,2.7rem)', color: 'var(--gold-d)' }}
              >
                {stat.suffix}
              </span>
            </div>

            {/* Progress underline — width transitions 0→100% when counter starts */}
            <div className="mb-4" style={{ height: '1px', background: 'rgba(201,168,76,0.08)' }}>
              <div
                ref={el => { lineRefs.current[idx] = el }}
                style={{
                  height: '100%',
                  width: '0%',
                  background: 'rgba(201,168,76,0.2)',
                  transition: 'width 2000ms cubic-bezier(0.19,1,0.22,1)',
                }}
              />
            </div>

            {/* Label */}
            <p
              className="font-[var(--font-cormorant)] uppercase"
              style={{ fontSize: '16px', color: '#F5F0E8', letterSpacing: '0.2em' }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
