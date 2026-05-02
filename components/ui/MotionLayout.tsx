'use client'
import { LayoutGroup } from 'framer-motion'
export default function MotionLayout({ children }: { children: React.ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>
}
