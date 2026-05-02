'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Global lenis instance so pages can reset scroll position
(globalThis as any).__lenis = null

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    ;(globalThis as any).__lenis = lenis
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => { lenis.destroy(); (globalThis as any).__lenis = null }
  }, [])

  return <>{children}</>
}
