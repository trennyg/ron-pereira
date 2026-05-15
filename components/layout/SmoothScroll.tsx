'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// Global lenis instance so pages can reset scroll position
(globalThis as any).__lenis = null

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ── Lenis initialisation — runs once on mount ──────────────────────────────
  useEffect(() => {
    // Prevent the browser from restoring a saved scroll position on back/forward
    // navigation, and prevent hash fragments in the URL from jumping mid-page.
    window.history.scrollRestoration = 'manual'

    // Force the native scroll position to 0 immediately.
    window.scrollTo(0, 0)

    // Hash-based scrolling (e.g. /#booking) fires asynchronously after the
    // browser parses the URL. A rAF override runs after that microtask and
    // cancels any position the browser applied for the hash.
    const rafId = requestAnimationFrame(() => window.scrollTo(0, 0))

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Sync Lenis internal position with the native 0 we just forced.
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

  // ── Route-change scroll reset ──────────────────────────────────────────────
  // Fires synchronously on every pathname change — before the new page's
  // entrance animations begin. Lenis persists across client-side navigations
  // and does not auto-reset, so we must reset it explicitly here.
  useEffect(() => {
    const lenis = (globalThis as any).__lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}
