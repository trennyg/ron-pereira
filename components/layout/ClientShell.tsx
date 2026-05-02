'use client'

import { useState, useCallback } from 'react'
import { LayoutGroup, MotionConfig, AnimatePresence } from 'framer-motion'
import Loader         from '@/components/ui/Loader'
import CustomCursor   from '@/components/ui/CustomCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'
import StarField      from '@/components/ui/StarField'
import CandleBg       from '@/components/ui/CandleBg'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loaderDone, setLoaderDone] = useState(false)
  const onComplete = useCallback(() => setLoaderDone(true), [])

  return (
    <LayoutGroup>
      <MotionConfig reducedMotion="user">
        <CandleBg />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette"      aria-hidden="true" />
        <StarField />
        <CustomCursor />
        <ScrollProgress />

        {/* Site always rendered — hero name visible for layoutId to target */}
        {children}

        {/* AnimatePresence lets Framer Motion intercept unmount and run layoutId transition */}
        <AnimatePresence>
          {!loaderDone && <Loader key="loader" onComplete={onComplete} />}
        </AnimatePresence>
      </MotionConfig>
    </LayoutGroup>
  )
}
