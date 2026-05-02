# Ron Pereira — Artist Website
**Built by Relentless AI**

## Stack
- Next.js 14 (App Router)
- Framer Motion 11
- Lenis smooth scroll
- Tailwind CSS
- TypeScript

## Setup in 5 minutes

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 3. Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Click Deploy

### 4. Connect your domain (relentlessais.com)
1. In Vercel: Settings → Domains → Add domain
2. Add: relentlessais.com
3. In your domain registrar (wherever you bought relentlessais.com):
   - Add a CNAME record: `www` → `cname.vercel-dns.com`
   - Or an A record for the apex: `76.76.21.21`
4. Done — live in under 5 minutes

### 5. Switch to Ron's domain later
Same process — just add Ron's domain in Vercel settings.
Zero code changes needed.

## Adding Real Content

### Hero photo
Replace `/public/images/hero-cover.jpg` with Ron's actual photo.

### Service content
Edit `/lib/services.ts` — all placeholder text, YouTube IDs, 
and pricing is in one file.

### YouTube videos
Find the video ID in the YouTube URL:
`youtube.com/watch?v=VIDEO_ID_HERE`
Add the ID to the relevant service in `lib/services.ts`

### Collaborator names + photos
Edit the COLLABS array in `/components/sections/Collabs.tsx`

### Contact details
Edit the contact list in `/components/sections/Booking.tsx`

## Admin Dashboard
Type `ADMIN` anywhere on keyboard (outside a text field)
→ Password: `RON2025` (change this in production)

## Environment Variables (for Phase 2 — AI + Calendar)
```
ANTHROPIC_API_KEY=
GOOGLE_CALENDAR_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```
