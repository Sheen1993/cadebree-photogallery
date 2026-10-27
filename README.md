# 2 Years of Us 💍

A static, single-page anniversary photo gallery celebrating two years of marriage (wedding date: **December 27, 2024**).

Built with React 18, Vite 7, TypeScript (strict), Tailwind CSS 3, GSAP (ScrollTrigger) and Framer Motion. It has no backend, no API calls and no environment variables.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs static files to dist/
npm run preview    # serves the production build locally
```

`dist/` is plain static files, so it can be hosted anywhere: Netlify, Vercel, GitHub Pages, Cloudflare Pages or an S3 bucket.

## Project structure

```
src/
├── data/galleryData.ts         # All content + typed interfaces (photos, timeline, notes)
├── utils/date.ts               # Time-together maths and date formatting
├── components/
│   ├── Hero.tsx                # Title, floating hearts, counter, CTA
│   ├── AnniversaryCounter.tsx  # Live days / hours / minutes / seconds
│   ├── FloatingHearts.tsx      # CSS-animated hearts and petals
│   ├── Timeline.tsx            # GSAP ScrollTrigger story timeline
│   ├── Gallery.tsx             # Filters + masonry grid
│   ├── PhotoModal.tsx          # Lightbox (AnimatePresence, keys, swipe)
│   ├── LoveNotes.tsx           # Flip-to-reveal polaroids and sticky notes
│   ├── Footer.tsx
│   ├── SectionHeading.tsx      # Shared section title
│   └── FadeImage.tsx           # Image with shimmer placeholder + fallback
├── App.tsx
├── main.tsx
└── index.css                   # Tailwind layers, glass + gradient-border utilities
```

## Tailwind setup for the custom colours

The palette is registered in [`tailwind.config.ts`](tailwind.config.ts) under `theme.extend.colors.love`:

```ts
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        love: {
          sky: '#90D5FF',          // Primary accent 1: soft sky blue
          lilac: '#DFC5FE',        // Primary accent 2: lavender / soft lilac
          'sky-deep': '#2F8FCB',   // Readable companion for text and icons
          'lilac-deep': '#8B5CD6', // Readable companion for text and icons
          blush: '#FFE0EC',
          cream: '#FFF7E3',
        },
      },
    },
  },
} satisfies Config;
```

That gives you utilities such as `bg-love-sky`, `text-love-lilac-deep`, `border-love-lilac/70` and `from-love-sky/10`. Opacity modifiers work because the colours are hex values. The config also adds:

| Token | Use |
| --- | --- |
| `bg-love-gradient` / `bg-love-gradient-deep` | Sky → lilac gradients (buttons, badges, gradient text) |
| `shadow-glow` / `shadow-glow-lg` | The dual-colour hover glow |
| `font-display` / `font-script` / `font-sans` | Playfair Display, Dancing Script, DM Sans (loaded in `index.html`) |

The pastel accents are too light for body text on white, so text and icons use the `-deep` variants.

Reusable classes live in [`src/index.css`](src/index.css):

- `.glass-card`: `backdrop-blur-md bg-white/70 border border-white/40 shadow-xl`
- `.gradient-border`: a 2px sky → lilac border that fades in on hover or focus
- `.text-gradient`: gradient-filled text

## Personalising the content

Everything lives in [`src/data/galleryData.ts`](src/data/galleryData.ts).

**Gallery photos:** these are your own photos from the shared Google Drive folder, saved in `public/photos/<album>/` at two sizes. The large copy (longest side 1600px) is for the lightbox, and the copy in `thumbs/` (800px) is for the grid. The albums are `boracay`, `hongkong`, `prenup`, `wedding` and `palawan`. To add a photo, save both sizes as `<album>-NN.jpg` and add an entry to `PHOTOS`:

```ts
{
  ...photoFiles('boracay', 13, 1200, 1600), // album, number, width, height of the large copy
  title: 'Flying High',
  caption: 'Short line shown on hover',
  alt: 'Describe the photo for screen readers',
  date: '2026-03-07',                        // YYYY-MM-DD
  location: 'Boracay',                       // optional
  memory: 'A personal note for the lightbox', // optional; otherwise the album story is shown
}
```

Album names, tab order and each album's story live in `ALBUMS`. `PHOTOS` is in date order, so "All Photos" reads as your story from start to finish.

**Background music:** the song is set in `OUR_SONG` in the same file (YouTube video ID, title, artist and volume). It plays through YouTube's own embedded player, hidden from view, and loops. Browsers block sound until the visitor interacts with the page, so if autoplay is blocked the song starts on the first click, tap or key press. A floating button in the bottom-right corner plays and pauses it, and a visitor's choice to pause is remembered on their next visit.

**Edit milestones and notes:** change `TIMELINE` and `LOVE_NOTES`. A note is either a `'polaroid'` (needs `image` and `imageAlt`) or a `'sticky'` (needs a `color`). TypeScript will flag any missing fields.

**Change the date or titles:** update `WEDDING_DATE` and `COUPLE`. The live counter and the "Coming up in N days" badge on the 2-year milestone both read from this file.

## Interactions

- **Gallery filters:** All Photos, Boracay Escapade, First International Trip, Our Prenup, Our Wedding and Palawan, each with a count.
- **Lightbox:** click any photo to open it. Browse with **← / →**, close with **Esc** or by clicking the backdrop, or swipe on touch devices. Focus stays inside the modal and returns to the photo when it closes.
- **Love notes:** tap a card to flip it and reveal a promise.
- **Reduced motion:** with the OS "reduce motion" setting on, the floating hearts, the GSAP scroll effects and the Framer Motion transitions are all turned off.
