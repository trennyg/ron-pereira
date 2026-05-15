'use client'

import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: 18,  suffix: '+', label: 'Years Performing'     },
  { value: 500, suffix: '+', label: 'Events'               },
  { value: 200, suffix: '+', label: 'Collaborations'       },
  { value: 12,  suffix: '+', label: 'Awards & Recognition' },
]

const EASE = 'cubic-bezier(0.19,1,0.22,1)'

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
  const [triggered, setTriggered] = useState(false)
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
        setTriggered(true)

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
    <section
      className="section-base"
      style={{
        padding: 0,
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
      }}
    >
      {/* Ambient glow — matches the pattern used in every other section */}
      <div className="section-atmo" />

      <div
        ref={containerRef}
        className="
          relative z-10
          max-w-7xl mx-auto px-16 max-md:px-6 max-sm:px-4
          py-[80px] max-md:py-[56px]
          grid grid-cols-4 max-sm:grid-cols-2
          gap-12 max-sm:gap-x-8 max-sm:gap-y-14
        "
      >
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            style={{
              opacity: triggered ? 1 : 0,
              transform: triggered ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ${EASE} ${idx * 0.12}s, transform 0.6s ${EASE} ${idx * 0.12}s`,
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
                  transition: `width 2000ms ${EASE}`,
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
          </div>
        ))}
      </div>
    </section>
  )
}
