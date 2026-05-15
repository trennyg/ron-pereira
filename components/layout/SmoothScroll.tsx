'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// Global lenis instance so pages can reset scroll position
(globalThis as any).__lenis = null

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Disable browser scroll restoration as early as possible — runs before
  // the Lenis init effect so the browser cannot restore a saved position.
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

  // ── Route-change scroll reset — stop/reset/start pattern ──────────────────
  // Root cause of intermittent failure: Lenis runs its own continuous rAF loop.
  // A single-rAF reset races against Lenis's next tick — sometimes our frame
  // wins, sometimes Lenis's does, producing non-deterministic behaviour.
  //
  // Fix: stop() halts Lenis's loop so it cannot overwrite the reset.
  // scrollTo(0, { immediate: true }) clears Lenis's internal target queue.
  // The double-rAF fires after Lenis's own scheduled tick.
  // start() resumes only after both frames confirm position is 0.
  // All four scroll containers are zeroed: window, documentElement,
  // body, and lenis.rootElement (covers wrapper:window and wrapper:div).
  useEffect(() => {
    const lenis: any = (globalThis as any).__lenis

    // Step 1: halt Lenis's RAF loop — it cannot overwrite the reset
    lenis?.stop()

    // Step 2: zero every scroll container immediately
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (lenis?.rootElement) {
      lenis.rootElement.scrollTop = 0
    }

    // Step 3: clear Lenis's internal scroll target queue
    lenis?.scrollTo(0, { immediate: true })

    // Step 4 + 5: double-rAF fires after Lenis's own scheduled tick,
    // re-zeros everything, then resumes Lenis
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        if (lenis?.rootElement) {
          lenis.rootElement.scrollTop = 0
        }
        lenis?.start()
      })
    })

    return () => cancelAnimationFrame(rafId)
  }, [pathname])

  return <>{children}</>
}
