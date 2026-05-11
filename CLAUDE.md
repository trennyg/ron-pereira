# Ron Pereira — Musician Website
## Claude Code Project Memory

---

## Project Overview
A cinematic Next.js musician website for Ron Pereira, a Mumbai-based musician. Built and maintained by Relentless AI. Domain: relentlessais.com. Deployed on Vercel via GitHub (trennyg/ron-pereira).

---

## Tech Stack
- Next.js 14.2.3 (App Router)
- Framer Motion 11 — animations, layoutId shared transitions
- Lenis — smooth scroll (home page only)
- Tailwind CSS + TypeScript
- Vercel — auto-deploys on git push to main

---

## Project Structure
```
app/
  layout.tsx                  ← server component, delegates to ClientShell
  page.tsx                    ← Home page
  [service]/
    page.tsx                  ← async params (Next.js 15 compatible)
    ServicePageClient.tsx     ← all 7 service pages

components/
  layout/
    ClientShell.tsx           ← LayoutGroup + AnimatePresence + all global UI
    Nav.tsx                   ← nav with services dropdown + mobile accordion
    Footer.tsx
    SmoothScroll.tsx          ← Lenis (home page only)
  sections/
    Hero.tsx                  ← layoutId="hero-ron-pereira" receives flying name
    About.tsx                 ← portrait + spinning 18 badge (badge OUTSIDE ScrollReveal)
    ServicesGrid.tsx          ← horizontal drag scroll, 3D tilt cards
    Collabs.tsx               ← manual drag horizontal scroll
    Booking.tsx               ← enquiry form
  ui/
    Loader.tsx                ← theatre curtains + spotlight + layoutId fly to hero
    CustomCursor.tsx          ← gold dot + lagging ring
    ScrollProgress.tsx        ← gold top bar
    StarField.tsx             ← canvas stars with cursor parallax (every 2nd frame)
    CandleBg.tsx              ← fixed candlelit photo background layer
    ServiceSwitcher.tsx       ← prev/current/next desktop, snap scroll mobile
    TiltCard.tsx              ← spring physics 3D tilt
    PhotoLightbox.tsx         ← click gallery, swipe, arrows, dot indicators
    Reveal.tsx                ← ScrollReveal + AnimHeadingLine (scroll-linked)

lib/
  services.ts                 ← SINGLE SOURCE OF TRUTH for all 7 services

styles/globals.css            ← design tokens, candlelit bg, glass sections
public/images/hero-cover.jpg  ← candlelight violinist photo
```

---

## Design System
```
--gold: #C9A84C  |  --gold-l: #F0D080  |  --ink: #07050A  |  --cream: #F0EDE8
Fonts: Cinzel (headings) / Cormorant Garamond (body) / Space Mono (labels)
Background: fixed hero photo at brightness(0.18), sections as glass panels
backdrop-filter disabled at ≤900px for Android performance
.section-base — glass section  |  .gold-shimmer — animated gold text
```

---

## 7 Services
1. Violin — 6 acts
2. Guitar — 3 acts
3. Music Direction — works
4. Music Composition — works
5. Teaching & Mentoring — 7 packages
6. Mixing & Mastering — works + note
7. Artist Management — 5 packages

Routes: /violin, /guitar, /music-direction, /music-composition, /teaching, /mixing-mastering, /artist-management

---

## Critical Architecture

### Loader → Hero layoutId transition
- ClientShell wraps in LayoutGroup + AnimatePresence
- layoutId="hero-ron-pereira" on name element in BOTH Loader and Hero
- Font size + text MUST be directly on the layoutId element (not a child div)
- Loader must NOT use {nameVisible && (...)} conditional — causes render flash
- Always render name div, control visibility via opacity only
- AnimatePresence in ClientShell required for transition to fire on unmount

### Flash Bug (PENDING FIX)
After curtains open, text briefly visible before going black.
Root cause: {nameVisible && (...)} conditional mount causes React to paint at default opacity for one frame before Framer Motion initialises.
Fix: Remove conditional, always render, opacity: 0 until progress > 0.

### layoutId not flying (PENDING FIX)
Root cause: In Loader, font-size is on inner child div. In Hero, font-size is on layoutId div. Framer Motion can't match mismatched DOM structures.
Fix: Put font-size + text directly on layoutId motion.div in both components. Single element, consistent structure.

### Service Page Swipe
- Desktop: wheel event deltaX intercept, preventDefault(), threshold 120px
- iOS: touchstart/touchend, 80px threshold, horizontal dominance 1.5x
- navigating flag prevents double-navigation

### Scroll to Top (service pages)
- window.scrollTo(0,0) + document.documentElement.scrollTop = 0
- requestAnimationFrame for post-paint reset
- Native scroll only (no Lenis on service pages)

### Performance
- StarField: every 2nd frame, 90 stars
- No per-letter motion.span — words/lines animate as single units
- backdrop-filter removed mobile

---

## Pending Issues
1. Loader flash — text visible for 1 frame after curtains open
2. layoutId fly — name snaps to hero instead of travelling cinematically
3. iOS service swipe — needs device verification
4. relentlessais.com domain not connected to Vercel yet

---

## Content Placeholders (awaiting Ron)
- Portrait photo (About section)
- YouTube video IDs (lib/services.ts — all marked PLACEHOLDER_1)
- Service works/productions (lib/services.ts)
- Collab artist names + photos (Collabs.tsx)
- Contact details (Booking.tsx)
- Social links (Hero.tsx — Instagram, YouTube, Spotify)

---

## Deployment
```
GitHub: https://github.com/trennyg/ron-pereira
Deploy: git add . && git commit -m "msg" && git push
Live:   ron-pereira-r9adkyzzq-trennyg.vercel.app
Domain: relentlessais.com (DNS records needed at registrar)
```

### PowerShell Note
Cannot use [service] in paths — use File Explorer for app/[service]/ folder.
Force push: git push -f origin main
