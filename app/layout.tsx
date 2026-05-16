import type { Metadata } from 'next'
import '../styles/globals.css'
import ClientShell from '@/components/layout/ClientShell'

export const metadata: Metadata = {
  title:       'Ron Ashton — Musician · Performer · Educator',
  description: 'Mumbai-based musician. 18+ years of mastery. Available worldwide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
