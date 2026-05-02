export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--gold-border)] glass-section px-16 py-10 flex justify-between items-center max-md:flex-col max-md:gap-5 max-md:px-6 max-md:text-center">
      <span className="font-[var(--font-cinzel)] font-black tracking-[0.4em] text-[0.9rem] gold-shimmer">
        RON PEREIRA
      </span>

      {/* EQ bars */}
      <div className="flex gap-[3px] items-end h-5">
        {[6,14,4,18,9].map((h, i) => (
          <div
            key={i}
            className="eq-bar"
            style={{
              height: h,
              animation: `eqBar ${0.7 + i * 0.15}s ${i * 0.08}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <span className="font-[var(--font-mono)] text-[0.43rem] tracking-[0.25em] text-[var(--cream-ghost)]">
        © 2025 Ron Pereira · All Rights Reserved · Built by Relentless AI
      </span>
    </footer>
  )
}
