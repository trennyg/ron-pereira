'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0
    let rx = 0, ry = 0
    let hovering = false

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onOver  = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      hovering = !!t.closest('a, button, [data-cursor-hover]')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    let raf: number
    function tick() {
      if (!dot || !ring) return
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      if (hovering) {
        dot.style.width = dot.style.height = '14px'
        ring.style.width = ring.style.height = '54px'
      } else {
        dot.style.width = dot.style.height = '7px'
        ring.style.width = ring.style.height = '38px'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 w-[7px] h-[7px] rounded-full bg-[#C9A84C] pointer-events-none z-[9999] transition-[width,height] duration-150 mix-blend-screen"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 w-[38px] h-[38px] rounded-full border border-[rgba(201,168,76,0.55)] pointer-events-none z-[9998] transition-[width,height] duration-200"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
