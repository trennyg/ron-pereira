'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
      bar.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      className="scroll-progress fixed top-0 left-0 h-[1.5px] z-[800] w-0"
      style={{
        background: 'linear-gradient(90deg,#7A6020,#C9A84C,#F0D080)',
        boxShadow: '0 0 8px #C9A84C',
      }}
    />
  )
}
