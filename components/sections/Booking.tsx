'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/Reveal'
import { SERVICES } from '@/lib/services'

export default function Booking({ preSelected, preAct }: { preSelected?: string; preAct?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const tagX  = useTransform(smooth, [0,0.22], ['110vw','0vw'])
  const tagOp = useTransform(smooth, [0,0.2], [0,1])
  const [submitted, setSubmitted] = useState(false)

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [service, setService] = useState(preSelected ?? '')
  const [date,    setDate]    = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const svcName = SERVICES.find(s => s.id === service)?.name ?? service
    const lines = [
      'Hi Ron, new enquiry from your website:',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${svcName || 'Not specified'}`,
      `Act / Package: ${preAct || 'Not specified'}`,
      `Event Date: ${date || 'Not specified'}`,
      '',
      `Message: ${message}`,
    ]
    window.open(`https://wa.me/919870482225?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="booking" ref={ref} className="section-base relative" style={{ overflow:'hidden' }}>
      <div className="section-atmo" />

      <motion.p style={{ x:tagX, opacity:tagOp }}
        className="font-[var(--font-mono)] text-[0.52rem] tracking-[0.55em] text-[var(--gold)] uppercase flex items-center gap-4 mb-6">
        <span className="w-10 h-px bg-[var(--gold)]" />The Box Office
      </motion.p>

      <div className="font-[var(--font-cinzel)] font-black leading-[0.92] text-[clamp(2.5rem,5.5vw,5.5rem)] mb-16">
        <LetterLine text="Book " smooth={smooth} offset={0.05} />
        <LetterLine text="Ron" smooth={smooth} offset={0.1} gold />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20 max-lg:gap-10 items-start">
        <div className="flex flex-col gap-5">
          <ScrollReveal direction="left" enterOnly>
            <h3 className="font-[var(--font-cinzel)] font-bold text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.3]">
              Let's create something<br />
              <em className="font-[var(--font-cormorant)] font-light italic">extraordinary together.</em>
            </h3>
          </ScrollReveal>
          <ScrollReveal direction="right" enterOnly>
            <p className="font-[var(--font-cormorant)] text-[1rem] font-light leading-[2] text-[var(--cream-dim)]">
              Whether it's your wedding, a corporate milestone, a private celebration, or a festival — Ron curates every performance to fit the moment with precision and soul.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="left" enterOnly>
            <ul className="flex flex-col gap-3">
              {[{ icon:'✉', text:'ron@ronashton.com' },{ icon:'☎', text:'+91 98704 82225' },{ icon:'◎', text:'Mumbai · Available Worldwide' }].map(item => (
                <li key={item.icon} className="flex items-center gap-3 font-[var(--font-cormorant)] text-[0.95rem] text-[var(--cream-dim)]">
                  <span className="text-[var(--gold)] w-5">{item.icon}</span>{item.text}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="right" enterOnly>
          {submitted ? (
            <div className="border border-[var(--gold-border)] p-10 text-center">
              <div className="text-4xl mb-4">✦</div>
              <h4 className="font-[var(--font-cinzel)] text-[1.2rem] font-bold gold-shimmer mb-3">Enquiry Received</h4>
              <p className="font-[var(--font-cormorant)] text-[var(--cream-dim)] text-[1rem] leading-[1.8]">
                Your enquiry has been sent to Ron on WhatsApp. He'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <Field label="Your Name"  type="text"  placeholder="Full Name"          value={name}  onChange={setName} />
                <Field label="Email"      type="email" placeholder="you@example.com"    value={email} onChange={setEmail} />
              </div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="flex flex-col gap-[0.4rem]">
                  <label className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.32em] text-[var(--gold)] uppercase">Service</label>
                  <select value={service} onChange={e => setService(e.target.value)} className="bg-[rgba(201,168,76,0.03)] border border-[var(--gold-border)] text-[var(--cream)] px-4 py-[0.9rem] font-[var(--font-cormorant)] text-[1rem] outline-none focus:border-[var(--gold)] transition-colors">
                    <option value="">Select Service</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <Field label="Event Date" type="date" placeholder="" value={date} onChange={setDate} />
              </div>
              {preAct && (
                <div className="flex flex-col gap-[0.4rem]">
                  <label className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.32em] text-[var(--gold)] uppercase">Selected Act</label>
                  <div className="border border-[var(--gold-border)] px-4 py-[0.9rem] text-[var(--cream-dim)] font-[var(--font-cormorant)]">{preAct}</div>
                </div>
              )}
              <div className="flex flex-col gap-[0.4rem]">
                <label className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.32em] text-[var(--gold)] uppercase">Message</label>
                <textarea rows={4} placeholder="Tell Ron about your event, guest count, venue, and vision..."
                  value={message} onChange={e => setMessage(e.target.value)}
                  className="bg-[rgba(201,168,76,0.03)] border border-[var(--gold-border)] text-[var(--cream)] px-4 py-[0.9rem] font-[var(--font-cormorant)] text-[1rem] outline-none focus:border-[var(--gold)] transition-colors resize-none placeholder:text-[var(--cream-ghost)]" />
              </div>
              <button type="submit" className="submit-gold-btn" data-cursor-hover>
                <span>Send Enquiry →</span>
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}

function Field({ label, type, placeholder, value, onChange }: { label:string; type:string; placeholder:string; value:string; onChange:(v:string)=>void }) {
  return (
    <div className="flex flex-col gap-[0.4rem]">
      <label className="font-[var(--font-mono)] text-[0.44rem] tracking-[0.32em] text-[var(--gold)] uppercase">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="bg-[rgba(201,168,76,0.03)] border border-[var(--gold-border)] text-[var(--cream)] px-4 py-[0.9rem] font-[var(--font-cormorant)] text-[1rem] outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--cream-ghost)]" />
    </div>
  )
}

function LetterLine({ text, smooth, offset, gold }: { text:string; smooth:any; offset:number; gold?:boolean }) {
  const fromLeft = offset % 0.2 < 0.1 // alternate directions
  const x  = useTransform(smooth, [offset, Math.min(offset+0.25,1)], fromLeft ? ['-105vw','0vw'] : ['105vw','0vw'])
  const op = useTransform(smooth, [offset, Math.min(offset+0.22,1)], [0,1])
  return (
    <motion.div className="block" style={{ x, opacity:op }}>
      <span className={gold ? 'gold-shimmer' : ''}>{text}</span>
    </motion.div>
  )
}
