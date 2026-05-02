// Server component — no 'use client' needed
export default function CandleBg() {
  return (
    <div className="candle-bg" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-cover.jpg"
        alt=""
        className="candle-bg-img"
        fetchPriority="high"
      />
      {/* Warm amber tint layer */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 90% 70% at 60% 40%, rgba(140,60,5,0.35), transparent 70%)',
      }} />
      {/* Darkening gradient bottom */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg, rgba(6,4,10,0.3) 0%, rgba(6,4,10,0.1) 40%, rgba(6,4,10,0.5) 100%)',
      }} />
    </div>
  )
}
