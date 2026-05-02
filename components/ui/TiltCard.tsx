'use client'

import { useRef, useState, useCallback, ReactNode } from 'react'

interface TiltCardProps {
  children:  ReactNode
  className?: string
  style?:    React.CSSProperties
}

export default function TiltCard({ children, className = '', style }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState('')
  const tx=useRef(0), ty=useRef(0), cx=useRef(0), cy=useRef(0)
  const vx=useRef(0), vy=useRef(0), raf=useRef<number>(), inside=useRef(false)

  const spring = useCallback(() => {
    vx.current += (tx.current - cx.current) * 0.13
    vy.current += (ty.current - cy.current) * 0.13
    vx.current *= 0.80; vy.current *= 0.80
    cx.current += vx.current; cy.current += vy.current
    const done = Math.abs(vx.current)<0.003 && Math.abs(vy.current)<0.003 &&
                 Math.abs(tx.current-cx.current)<0.003 && Math.abs(ty.current-cy.current)<0.003
    if (done && !inside.current) { setTilt(''); return }
    setTilt(`perspective(900px) rotateX(${cy.current}deg) rotateY(${cx.current}deg) scale3d(1.025,1.025,1.025)`)
    raf.current = requestAnimationFrame(spring)
  }, [])

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect(); if (!r) return
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height
    tx.current=(px-0.5)*16; ty.current=-(py-0.5)*16
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(spring)
  }

  return (
    <div ref={cardRef}
      style={{ transform:tilt, transformStyle:'preserve-3d', willChange:'transform', ...style }}
      className={className}
      onMouseMove={onMove}
      onMouseEnter={() => { inside.current = true }}
      onMouseLeave={() => {
        inside.current = false; tx.current=0; ty.current=0
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(spring)
      }}
    >
      {children}
    </div>
  )
}
