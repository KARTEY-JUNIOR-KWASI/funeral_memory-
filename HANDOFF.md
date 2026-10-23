# Funeral programme website: hand-off (v2)

A **static, single-page** site that shows the family's 22-page funeral brochure as a flip-book.  
Open `index.html` through any local web server (for example `npx serve .`).  
Do **not** open it by double-clicking the file — images and the PDF are fetched by relative path.

---

## Files

| Path | Purpose |
|------|---------|
| `index.html` | The entire site — HTML, CSS and JavaScript in one file |
| `pages/s01.jpg` … `s22.jpg` | Page images ~900 px wide (book + swipe view) |
| `pages/l01.jpg` … `l22.jpg` | Page images ~1500 px wide (reader/zoom view) |
| `programme.pdf` | The compressed original brochure (A4, 22 pages) |
| `favicon.svg` | Browser tab icon |
| `vercel.json` | Deployment headers for Vercel (no build step needed) |

---

## What works

- **Mobile (Phones & tablets):** Mobile-first design with horizontal swipe rail, ergonomic bottom thumb dock (Read, Tributes, Order, Music, Share, PDF), and native WhatsApp sharing.
- **Entrance of Honor:** Autoplay-compliant welcome screen with Obaapayin Juliana's photo, memorial dates, Akan farewell (*“Damirifa Due, Obaapayin Juliana”*), and one-tap entrance that immediately initiates background music on iOS and Android.
- **Memorial Music Player & Playlist:** Plays "Gone Forever" dirge by default, with a playlist drawer featuring Ghanaian hymns ("Yɛbɛhyia Bio", "Lead, Kindly Light", "Abide With Me"). Includes live animated equalizer bars and volume/track controls.
- **Desktop (≥ 900 × 640 px):** two-page flip-book with 3D page-turn animation.
- **Magnifier / Reader:** tap 🔍 or double-tap on any page to open high-resolution reader (+ / − keys or buttons).
- **Tributes drawer:** live Supabase Realtime integration; submissions arrive as `pending` for family review.
- **Download PDF button:** one-click download for `programme.pdf` (from the original brochure).

---

## Facts printed in the brochure (do not change)

- **In memory of:** Obaapayin Juliana Oforiwaa Amagyei, also known as Ante. Aged 84.
- **Born:** 14 November 1941, Twapease, Asuom.
- **Went home:** 13 December 2025.
- **Service:** Saturday 31 October 2026, at her residence. Burial service at 9:00 AM.
- **Church:** Presbyterian Church of Ghana, Grace Congregation, Asuom.

---

## Configuration checklist (inside `index.html`)

At the top of the `<script>` block there are four variables to fill in:

```js
var MEMORIAL_ID = null;  // ← paste the UUID once the Supabase record is created
var DRESS_CODE  = '';    // ← e.g. 'Black and white' — shows in Contents drawer
var MOMO_DETAILS = '';   // ← e.g. '0200000000 – Kofi Mensah (MTN)'
var LIVESTREAM  = '';    // ← YouTube/Facebook live URL — shows in Contents drawer
```

Set any of the last three to a non-empty string and the slot will appear automatically.

---

## Adding Custom Music / Ghanaian Funeral Songs

The site comes with a starter memorial track (`audio/gone-forever.wav`) and an automatic Web Audio chime fallback so music plays immediately.

To play custom studio audio or favorite Ghanaian funeral songs, drop your MP3 files into the `audio/` directory:

| Track | File name in `audio/` | Description |
|-------|----------------------|-------------|
| 1 | `gone-forever.mp3` | Main tribute song / dirge |
| 2 | `yebehyia-bio.mp3` | Ghanaian Presbyterian choral hymn |
| 3 | `lead-kindly-light.mp3` | Chimes & organ hymn |
| 4 | `abide-with-me.mp3` | Solemn piano hymn |

The player will automatically pick up and stream your MP3s when guests open the site.

---

## Supabase setup

1. The Supabase project is already created:  
   `https://gtxlqzjwxjboxhiictqs.supabase.co`
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL Editor if not done.
3. Run `supabase/migrations/002_security_fixes.sql`.
4. Run `supabase/migrations/003_enable_realtime_tributes.sql`  
   (adds the `tributes` table to the Realtime publication).
5. Create a memorial record in the `memorials` table (or use the admin panel at `/admin`).  
   Copy the resulting UUID into `MEMORIAL_ID` in `index.html`.

> **Admin panel:** the old React admin app (`npm run dev`) still works for  
> approving/rejecting tributes and managing memorial data. It lives in `src/`.

---

## Known remaining gaps

1. **`pages/` images** — the family must supply `s01.jpg`–`s22.jpg` and `l01.jpg`–`l22.jpg`.
2. **`programme.pdf`** — place the compressed PDF in the project root.
3. **`MEMORIAL_ID`** — set the UUID in `index.html` once the Supabase row is created.
4. **Dress code, MoMo, livestream** — set the JS variables once the family confirms details.
5. **Cover grey box** — the blank grey area at the lower-left of page 1 (`s01.jpg`) is part of the original print design. Tell the family; do not edit the image.
6. **Deploy to Vercel** — `vercel --prod` from this directory (no build step). Give the family a short link (bit.ly or similar) and a QR code image for the printed brochure.
