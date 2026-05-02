import Nav          from '@/components/layout/Nav'
import SmoothScroll from '@/components/layout/SmoothScroll'
import Hero         from '@/components/sections/Hero'
import About        from '@/components/sections/About'
import Collabs      from '@/components/sections/Collabs'
import ServicesGrid from '@/components/sections/ServicesGrid'
import Booking      from '@/components/sections/Booking'
import Footer       from '@/components/layout/Footer'

export const metadata = {
  title:       'Ron Pereira — Musician · Performer · Educator',
  description: 'Mumbai-based musician Ron Pereira. 18+ years of mastery. Available worldwide.',
}

export default function HomePage() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <About />
        <Collabs />      {/* Network BEFORE Repertoire */}
        <ServicesGrid />  {/* Repertoire */}
        <Booking />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
