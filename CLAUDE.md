# RON PEREIRA — MUSICIAN WEBSITE
# Master Orchestration File — Claude Code Multi-Agent System

> **Every session starts here.** Read this entire file before touching any code.
> If a sub-agent file exists in `.agents/` for the task at hand, read that too.

---

## ORCHESTRATOR PROTOCOL

This project runs a **multi-agent pipeline**. You are the **Orchestrator**.
Your job is to:

1. Parse the incoming task and identify its type via the SESSION TASK TAGS below
2. Dispatch it to the correct **Specialist Agent** (files in `.agents/`)
3. After the specialist completes, **always** run the **QA Agent** (`.agents/qa-agent.md`)
4. Only surface results to the developer after QA passes

**Never skip the QA step. Never show partial work.**

### Agent Dispatch Table

| Tag          | Specialist Agent File              |
|--------------|------------------------------------|
| [ANIMATION]  | `.agents/animation-agent.md`       |
| [FEATURE]    | `.agents/feature-agent.md`         |
| [PAGE]       | `.agents/page-agent.md`            |
| [CMS]        | `.agents/cms-agent.md`             |
| [BOOKING]    | `.agents/booking-agent.md`         |
| [DASHBOARD]  | `.agents/dashboard-agent.md`       |
| [DEPLOY]     | `.agents/deploy-agent.md`          |
| [DEBUG]      | `.agents/debug-agent.md`           |
| *any output* | `.agents/qa-agent.md` ← **always** |

### How to dispatch

```
Task arrives → identify tag → read specialist agent file →
complete specialist work → read qa-agent.md → run QA checklist →
if QA passes: present output
if QA fails: fix issues silently → re-run QA → then present
```

The developer should **never see work-in-progress or first drafts**.
They only see QA-approved output.

---

## PROJECT IDENTITY

**Client:** Ron Pereira — musician
**Quality bar:** Apple / OnePlus / RedBull marketing page level.
Award-winning. Every animation, every interaction must feel intentional and cinematic.
This is not a template — it must be extraordinary.

**Hosting:** Vercel (auto-deploy from GitHub push)
**Local path:** `C:\Users\trenn\Downloads\ron-pereira-v25\ron-pereira`
**Run Claude Code:** `npx @anthropic-ai/claude-code` (not globally installed)

---

## TECH STACK (LOCKED — do not change without explicit instruction)

```
Framework      Next.js 14 (App Router)
Animation      Framer Motion 11 + GSAP ScrollTrigger
Scroll         Lenis (smooth scroll foundation)
Styling        Tailwind CSS + CSS Modules for complex animations
CMS            Sanity Studio v3
AI assistant   Claude API — claude-sonnet-4-20250514
Calendar       Google Calendar API
Email          Resend + React Email
Payments       Stripe (50% deposit booking flow)
Database       Supabase (bookings, enquiries, analytics)
Hosting        Vercel
```

---

## DESIGN SYSTEM (non-negotiable)

### Color tokens
```css
--black:   #050505
--obsidian:#0A0A0C
--gold:    #C9A84C
--gold-l:  #E8C87A   /* hover states */
--gold-d:  #8B6914   /* shadows */
--white:   #F5F0E8   /* warm white — never pure #FFF */
--glass:   rgba(255,255,255,0.025)
--gb:      rgba(201,168,76,0.12)
```

### Typography
```
Display:  Cinzel          — headings, name, titles
Body:     Cormorant Garamond — editorial text
Mono:     Space Mono      — metadata, labels, counters
```

### Easing curves
```
Ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)
Spring:        cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Aesthetic rules
- Black canvas, gold is the ONLY colour
- Luxury watchmaker meets concert stage lighting
- No cheap gradients — subtle radial glows only
- Every element must feel weighted and intentional

---

## KEY COMPONENT FILES

```
components/ui/Loader.tsx           ← Theatre curtain + name animation
components/sections/Hero.tsx       ← Hero section (name lands here)
components/layout/ClientShell.tsx  ← Loader state management
components/sections/Booking.tsx    ← WhatsApp enquiry flow. Controlled inputs. GoldSelect custom dropdown for Service + Act/Package (options populate dynamically from selected service's acts/subServices/packages). On submit: opens wa.me/919870482225 with full enquiry pre-filled, then shows confirmation card.
```

---

## LOADER ANIMATION SPEC (critical — do not approximate)

### Theatre curtain physics
- Heavy fabric feel: starts slow → accelerates → trailing edge bunches at end
- Top moves slightly faster than bottom (diagonal pull)
- Slight overshoot → settles (not a hard stop)
- Right panel starts **80ms after left**
- Total duration: **1.4 seconds** (non-negotiable — the weight needs time)
- Easing: `power2.in` pull → `elastic.out(0.8, 0.4)` settle
- Use **GSAP timeline** — never CSS transitions

### Loader sequence (exact order)
1. Curtains closed — black canvas
2. Spotlight + RON PEREIRA text brighten proportional to progress bar
3. Progress bar completes → curtains sweep open (physics above)
4. Background fades out
5. RON PEREIRA name **flies** from loader → hero position (GSAP FLIP)
6. Hero content (tagline, stats, socials) fades in after name lands

### GSAP FLIP name fly
1. Record loader name `getBoundingClientRect()` before exit
2. Record hero name element position
3. GSAP animates position + size across the transition
4. **Never use Framer Motion `layoutId`** for this — it failed

### Flash bug rule
**Always render** the name div. Use `opacity: 0` only.
**Never** conditionally mount/unmount it with `{condition && (...)}`.

---

## SITE STRUCTURE

7 service pages as **separate Next.js pages** (real URLs, not modals).
Booking form pre-selects the service based on which page the user came from.

---

## BUILD PHASES

- **Phase 1** (active): Foundation — scaffold, design system, all 7 service pages, hero, booking form, Vercel deploy
- **Phase 2**: AI assistant, Calendar, email automation, Stripe 50% deposit
- **Phase 3**: Supabase analytics dashboard (Ron-only login)
- **Phase 4**: Real content from Ron (photos, videos, copy, domain)

---

## ENVIRONMENT VARIABLES (never hardcode — always use .env.local)

```
ANTHROPIC_API_KEY
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
GOOGLE_CALENDAR_ID
GOOGLE_SERVICE_ACCOUNT_KEY
RESEND_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLIC_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Critical Architecture

- **Smooth scroll:** Lenis singleton stored on `(globalThis as any).__lenis`. Route changes call `stop()` → zero all scroll containers → double-rAF → `start()`. Never call `window.scrollTo` from page components — route reset lives in `SmoothScroll.tsx` only.
- **Loader → Hero name fly:** GSAP FLIP via `getBoundingClientRect()`. `data-hero-slot` is permanently `opacity:0` — it provides layout metrics only. Fly elements are fixed-position DOM nodes created in `Loader.tsx` and reparented into `[data-hero-section]` after landing.
- **Service pages nav:** `usePathname()` detects `/violin`, `/guitar`, `/teaching`. Logo centres absolutely; hamburger always visible; desktop links hidden.
- **Collab strip:** `translateX` on GPU compositor thread (no `scrollLeft`). Modulo wrap `((pos % w) + w) % w` for seamless loop. No `setPointerCapture` (fires `pointercancel` on Android).

---

## Booking & WhatsApp Flow

- All "Book" / "Enquire" buttons on service pages (acts, sub-services, packages) open WhatsApp via `<a target="_blank">` to `wa.me/919870482225` with service + act name pre-filled. Use `<a>` not Next.js `<Link>` for these.
- The Booking form (home page + service pages) submits via `window.open` to `wa.me/919870482225` with a formatted multi-line message containing: name, email, service, act/package, date, message.
- `GoldSelect` is a custom dropdown component inside `Booking.tsx` — no native `<select>` in the booking form. Options for Act/Package populate dynamically when a service is selected.
- Ron's WhatsApp number: +91 98704 82225 (wa.me format: 919870482225)

---

## Content Placeholders (awaiting Ron)

- [ ] Hero cover photo: `/public/images/hero-cover.jpg`
- [ ] Artist portrait: About section placeholder div
- [ ] YouTube video IDs: `youtubeIds` arrays in `lib/services.ts`
- [ ] Real collab artist names/photos: `COLLABS` array in `components/sections/Collabs.tsx`
- [x] Contact phone: +91 98704 82225 (WhatsApp — wired into Booking.tsx and all service page book buttons)
- [ ] Contact email: ron@ronashton.com (placeholder — update when confirmed)
- [ ] Domain: ronashton.com (Phase 4)

---

## GOLDEN RULES

1. Output **complete files** — no partial diffs, no `// ... rest unchanged`
2. Every animation tested for: desktop, mobile, iOS Safari
3. Ask "would Apple ship this?" — if no, redo it
4. Ron manages content via Sanity only — he never touches code
5. Keep this CLAUDE.md updated with every architectural decision
6. **QA agent runs on every output. No exceptions.**
