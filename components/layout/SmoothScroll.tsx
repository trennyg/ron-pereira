'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// Global lenis instance so pages can reset scroll position
(globalThis as any).__lenis = null

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ── Cause 1 fix: disable browser scroll restoration once on mount ──────────
  // Next.js App Router does not disable native scroll restoration. The browser
  // remembers scroll position per URL and restores it after components mount —
  // AFTER any synchronous Lenis reset, silently overriding it. Setting this
  // in a dedicated effect runs as early as possible on the client.
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  // ── Lenis initialisation — runs once on mount ──────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)

    const rafId = requestAnimationFrame(() => window.scrollTo(0, 0))

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.scrollTo(0, { immediate: true })

    ;(globalThis as any).__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      ;(globalThis as any).__lenis = null
    }
  }, [])

  // ── Cause 2 + 3 fix: route-change scroll reset with rAF + rootElement ──────
  // Cause 3: the previous effect ran synchronously — before Lenis is ready on
  // the new page. Wrapping in rAF defers execution until after the browser
  // paint so the Lenis instance is fully initialised when scrollTo fires.
  //
  // Cause 2: if Lenis internally uses a wrapper element rather than window,
  // window.scrollTo(0,0) has no effect. Resetting lenis.rootElement.scrollTop
  // directly covers that case. document.documentElement and document.body are
  // belt-and-braces resets for any remaining edge case.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const lenis: any = (globalThis as any).__lenis
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
        if (lenis.rootElement) {
          lenis.rootElement.scrollTop = 0
        }
      }
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })

    return () => cancelAnimationFrame(rafId)
  }, [pathname])

  return <>{children}</>
}
