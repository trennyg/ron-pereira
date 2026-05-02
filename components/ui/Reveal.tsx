'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const SPRING = { stiffness: 100, damping: 25, mass: 0.8 }

interface RevealProps {
  children:   React.ReactNode
  direction?: 'left' | 'right' | 'up'
  className?: string
  enterOnly?: boolean
}

export function ScrollReveal({ children, direction = 'up', className = '', enterOnly = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, SPRING)

  const xIn = direction === 'left' ? '-110vw' : direction === 'right' ? '110vw' : '0px'
  const yIn = direction === 'up' ? '80px' : '0px'

  const x  = useTransform(smooth, [0, 0.28], [xIn, '0px'])
  const y  = useTransform(smooth, [0, 0.28], [yIn, '0px'])
  const op = useTransform(smooth,
    enterOnly ? [0, 0.22] : [0, 0.22, 0.82, 1],
    enterOnly ? [0, 1]    : [0, 1,    1,    0]
  )

  return (
    <motion.div ref={ref} style={{ x, y, opacity: op }} className={className}>
      {children}
    </motion.div>
  )
}

export function Reveal({ children, className = '', enterOnly = false }: { children: React.ReactNode; className?: string; enterOnly?: boolean }) {
  return <ScrollReveal direction="up" className={className} enterOnly={enterOnly}>{children}</ScrollReveal>
}

export function StaggerReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  return <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'} className={className}>{children}</ScrollReveal>
}

// ── Animated heading — whole line slides as one unit (fast, no per-letter overhead)
interface HeadingLineProps {
  text:       string
  gold?:      boolean
  direction?: 'left' | 'right'
  smooth:     ReturnType<typeof useSpring>
  entryStart: number   // 0–1 in scrollYProgress when enter starts
  entryEnd:   number   // 0–1 when fully landed
  exitStart?: number   // optional exit
  exitEnd?:   number
  className?: string
}

export function AnimHeadingLine({ text, gold, direction = 'left', smooth, entryStart, entryEnd, exitStart, exitEnd, className = '' }: HeadingLineProps) {
  const fromX = direction === 'left' ? '-105vw' : '105vw'
  const inputRange  = exitStart != null ? [entryStart, entryEnd, exitStart, exitEnd!] : [entryStart, entryEnd]
  const outputRange = exitStart != null ? [fromX, '0vw', '0vw', direction === 'left' ? '105vw' : '-105vw'] : [fromX, '0vw']
  const opInput  = exitStart != null ? [entryStart, entryEnd, exitStart, exitEnd!] : [entryStart, entryEnd]
  const opOutput = exitStart != null ? [0, 1, 1, 0] : [0, 1]

  const x  = useTransform(smooth, inputRange as number[], outputRange as string[])
  const op = useTransform(smooth, opInput as number[], opOutput as number[])

  return (
    <motion.div className={`block ${className}`} style={{ x, opacity: op }} aria-label={text}>
      <span className={gold ? 'gold-shimmer' : ''}>{text}</span>
    </motion.div>
  )
}
