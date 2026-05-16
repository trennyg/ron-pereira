'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [svcOpen,  setSvcOpen]  = useState(false)
  const pathname = usePathname()

  const isServicePage =
    pathname.startsWith('/violin') ||
    pathname.startsWith('/guitar') ||
    pathname.startsWith('/teaching')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : '' }, [menuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[700] flex items-center px-14 py-5 transition-all duration-500 max-md:px-5 max-md:py-4 ${isServicePage ? 'justify-end' : 'justify-between'}`}
        style={{ background: scrolled ? 'rgba(8,5,2,0.8)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none' }}
      >

        {/* Logo — "RON ASHTON" cream, "MUSIC" gold shimmer */}
        <Link
          href="/"
          className="font-[var(--font-cinzel)] font-black flex-shrink-0"
          style={{
            zIndex: 810,
            fontSize: '0.88rem',
            letterSpacing: '0.12em',
            ...(isServicePage && { position: 'absolute', left: '50%', transform: 'translateX(-50%)' }),
          }}
        >
          <span style={{ color: 'var(--cream)' }}>RON</span>
          <span style={{ color: 'var(--cream)' }}> ASHTON</span>
          <span className="gold-shimmer"> MUSIC</span>
        </Link>

        {/* Desktop links — Collabs → Services → Book — hidden on service pages */}
        {!isServicePage && (
          <ul className="hidden md:flex gap-10 list-none">
            <li>
              <Link href="/#collabs" className="font-[var(--font-mono)] text-[0.54rem] tracking-[0.35em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors duration-300">Collabs</Link>
            </li>

            {/* Services with dropdown */}
            <li className="relative group">
              <Link href="/#services" className="font-[var(--font-mono)] text-[0.54rem] tracking-[0.35em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors duration-300">
                Services ›
              </Link>
              {/* Invisible bridge — keeps hover alive while cursor travels to dropdown */}
              <div className="absolute top-full right-0 w-52 h-3 opacity-0 group-hover:opacity-100" />
              {/* Dropdown */}
              <div
                className="absolute right-0 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                style={{ top:'calc(100% + 8px)', background:'rgba(8,5,2,0.98)', backdropFilter:'blur(28px)', border:'1px solid rgba(201,168,76,0.18)', zIndex:900, boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}
              >
                {SERVICES.map(s => (
                  <Link key={s.id} href={`/${s.slug}`}
                    className="flex items-center gap-3 px-4 py-3 font-[var(--font-mono)] text-[0.44rem] tracking-[0.2em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] hover:bg-[rgba(201,168,76,0.06)] transition-all duration-200 border-b border-[rgba(201,168,76,0.06)] last:border-0">
                    <span className="text-sm">{s.icon}</span>{s.name}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link href="/#booking" className="font-[var(--font-mono)] text-[0.54rem] tracking-[0.35em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors duration-300">Book</Link>
            </li>
          </ul>
        )}

        {/* Hamburger — always visible on service pages, md:hidden on home */}
        <button
          className={`${isServicePage ? '' : 'md:hidden '}flex flex-col gap-[5px] w-7 p-1 cursor-pointer`}
          style={{ zIndex: 810 }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} className="block h-[1.5px] bg-[var(--gold)] transition-all duration-400 origin-center"
              style={{ transform: menuOpen ? i===0?'translateY(6.5px) rotate(45deg)':i===2?'translateY(-6.5px) rotate(-45deg)':'scaleX(0)':'none', opacity: menuOpen&&i===1?0:1 }} />
          ))}
        </button>
      </nav>

      {/* Mobile full-screen menu — order: Collabs → Services → Book */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
            transition={{type:'spring',stiffness:300,damping:35}}
            className="fixed inset-0 z-[800] flex flex-col items-center justify-center bg-[rgba(8,5,2,0.98)] backdrop-blur-[40px] overflow-y-auto">

            {/* Collabs */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0}}>
              <Link href="/#collabs" onClick={() => setMenuOpen(false)}
                className="font-[var(--font-cinzel)] text-[clamp(1.8rem,7vw,3rem)] font-bold tracking-[0.2em] text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors uppercase block py-3 text-center">
                Collabs
              </Link>
            </motion.div>

            {/* Services accordion */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.06}}
              className="flex flex-col items-center w-full px-8">
              <button onClick={() => setSvcOpen(v => !v)}
                className="font-[var(--font-cinzel)] text-[clamp(1.8rem,7vw,3rem)] font-bold tracking-[0.2em] text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors uppercase flex items-center gap-3 py-3">
                Services <span className="text-[var(--gold)] text-xl" style={{transform:svcOpen?'rotate(90deg)':'none',transition:'transform .3s'}}>›</span>
              </button>
              <AnimatePresence>
                {svcOpen && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                    transition={{duration:0.35}} className="overflow-hidden w-full">
                    <div className="flex flex-col items-center gap-1 pb-4">
                      {SERVICES.map(s => (
                        <Link key={s.id} href={`/${s.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="font-[var(--font-mono)] text-[0.55rem] tracking-[0.3em] text-[var(--cream-dim)] hover:text-[var(--gold)] uppercase py-2 transition-colors">
                          {s.icon} {s.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Book */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.12}}>
              <Link href="/#booking" onClick={() => setMenuOpen(false)}
                className="font-[var(--font-cinzel)] text-[clamp(1.8rem,7vw,3rem)] font-bold tracking-[0.2em] text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors uppercase block py-3 text-center">
                Book
              </Link>
            </motion.div>

            {/* EQ */}
            <div className="absolute bottom-8 flex gap-[3px] items-end h-5">
              {[6,12,4,16,8].map((h,i) => (
                <div key={i} className="eq-bar" style={{height:h,animation:`eqBar ${0.7+i*0.15}s ${i*0.08}s ease-in-out infinite`}} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
