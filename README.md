# priyansh-portfolio

Personal portfolio for Priyansh Yadav, built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger + SplitText) and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before you deploy

All copy lives in `lib/content.ts`. Fill in the lines marked `TODO`:

- `site.url`: your real domain (used for SEO, sitemap and the OG image)
- `site.socials`: your GitHub and LinkedIn URLs
- `experience[].period`: dates for each role (rows without dates simply hide the date line)
- Add your résumé as `public/resume.pdf`

Deploy on Vercel: push to GitHub, import the repo, no extra config needed.

## How it's put together

| File | What it does |
|---|---|
| `components/nav/Nav.tsx` | Floating pill nav; links fold into a ⋮ button once you scroll |
| `components/sections/Intro.tsx` | Short greeting that fades out on load (pure CSS) |
| `components/sections/Hero.tsx` | Centred hero with floating glossy tiles (pointer parallax) |
| `components/sections/TechMarquee.tsx` | Looping companies and stack strip |
| `components/sections/Statement.tsx` | Pinned sentence that reveals word by word, then its tiles drop into the pipeline card |
| `components/sections/Capabilities.tsx` | Split section: sticky heading, dark capabilities panel |
| `components/sections/Tuning.tsx` | Live chunk-size / top-k retrieval demo in a dark panel |
| `components/sections/Process.tsx` | Design, Build, Integrate, Ship cards |
| `components/sections/CaseStudy.tsx` | S2P case study: app window, then a five-step walkthrough with a sticky diagram |
| `components/sections/Projects.tsx` | Projects with a sticky pill tab bar (arrow keys work) |
| `components/sections/Experience.tsx`, `Footer.tsx` | Experience panel; footer revealed behind the page with a glowing wordmark |
| `components/ui/GlossyTile.tsx` | The glossy icon tiles used across the page |
| `components/ui/BlurReveal.tsx` | Headings that sharpen word by word on scroll |
| `app/globals.css` | Design tokens (`@theme`), text roll, reduced-motion rules |

## Accessibility

- With "reduce motion" turned on, smooth scrolling, the intro, the pinned statement, scroll reveals and loops are all disabled, and content appears immediately.
- Skip link, landmarks, visible focus rings, ARIA tabs, and `aria-hidden` on duplicated marquee/roll text.

## Fonts

Inter Tight and JetBrains Mono (both OFL), self-hosted from `@fontsource-variable` via `next/font/local`.
