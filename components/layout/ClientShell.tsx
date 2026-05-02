'use client'

import { useState, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'
import Loader         from '@/components/ui/Loader'
import CustomCursor   from '@/components/ui/CustomCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'
import StarField      from '@/components/ui/StarField'
import CandleBg       from '@/components/ui/CandleBg'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loaderDone, setLoaderDone] = useState(false)
  const onComplete = useCallback(() => setLoaderDone(true), [])

  return (
    // LayoutGroup ensures layoutId works across Loader and Hero
    <MotionConfig reducedMotion="user">
        <CandleBg />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette"      aria-hidden="true" />
        <StarField />
        <CustomCursor />
        <ScrollProgress />

        {/* Site always rendered underneath — hero name is visible to layoutId */}
        {children}

        {/* Loader on top — when it unmounts, layoutId element flies to hero */}
        {!loaderDone && <Loader onComplete={onComplete} />}
    </MotionConfig>
  )
}
