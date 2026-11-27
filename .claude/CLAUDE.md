# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Company site for Brightseid (software engineering studio). Next.js 16 App Router with Cache Components and Turbopack, React 19, TypeScript, Tailwind CSS v4, GSAP + Lenis, React Three Fiber, Sanity CMS, Resend for lead email. Deployed on Vercel; every push to `main` deploys to production. Operational status and open items: `docs/NOTES.md`.

This Next.js version has breaking changes: APIs, conventions and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices. (This replaces the `AGENTS.md` that `next dev` would generate; `agentRules: false` in `next.config.ts` turns that off.)

## Commands

```bash
npm run dev                    # http://localhost:3000 (studio at /studio)
npm run build                  # production build: also the main correctness check
npm run lint                   # eslint (flat config)
npx tsc --noEmit               # type check; needs .next/types, so run dev or build once first
npm run cms:seed -- -- --dry   # print the Sanity seed documents (the second -- is for `sanity exec`)
npm run cms:seed -- -- --only product,workItem   # overwrite only these document types
npm run cms:seed               # OVERWRITES Sanity docs with src/content/seed (needs `npx sanity login`)
npm run tiles:render           # re-render public/tiles/*.png stills (dev server must be running; uses local Chrome)
```

There is no test suite. Verify changes with `npm run build` + `npm run lint`. Node 24 is pinned (`engines`); the Sanity CLI needs Node >= 22.12.

`PageProps` "cannot find name" errors from `tsc` mean `.next/types` is missing: build first. If styles look stale after a build, delete `.next` and rebuild (a stale Turbopack cache has bitten before).

## Layout

All source lives in `src/`; `@/*` maps to `./src/*`. Config files stay at the root because Next and the Sanity CLI only look there. `sanity.cli.ts` is at the root; `src/sanity.config.ts` is the Studio config imported by `src/app/studio/[[...tool]]/page.tsx`. Font paths in `src/app/layout.tsx` are relative to `node_modules` (`../../node_modules/...`) because `next/font/local` needs a file path.

## Architecture

**Content has two sources behind one API.** Pages and components read content only through the async getters in `src/lib/content/index.ts` (server-only). If `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the getters run GROQ queries via `src/lib/cms/client.ts`. Otherwise they return the seed modules in `src/content/seed/`. Both return the types in `src/lib/content/types.ts`, and the GROQ projections in `src/lib/cms/queries.ts` must produce exactly those shapes (coalescing nulls). Adding a content field means updating: the type, the seed file, the Sanity schema in `src/sanity/schemaTypes/`, the GROQ projection, and `scripts/seed-sanity.ts` if it needs uploading. Navigation always comes from `src/content/seed/site.ts`, because it mirrors the routes.

**Product walkthroughs.** Each product has a home-page journey (`steps`) and `modules`, each with its own steps. Every step names a scene from `src/lib/scenes.ts`: a small cast of actors (tiles, cards, crates, bars, badges, people, gears) with positions, labels and flows. `StepStage` draws the scene in 2D first and keeps that on reduced-motion and low-power devices; when the live layer is on, `three/StageView` draws the same scene in 3D through the shared canvas. Actors that keep their id between steps move to their new place. Copy on these pages is written for buyers, not engineers: no stack names or internals.

**Caching and revalidation.** `cmsQuery` is a `"use cache"` function tagged `cms` with `cacheLife("hours")`. The Sanity webhook posts to `src/app/api/revalidate/route.ts`, which checks the signature against `SANITY_REVALIDATE_SECRET` and calls `revalidateTag("cms")`. With Cache Components enabled, uncached data access in a page has to sit inside `<Suspense>` or a cached function.

**Sanity constraints.** Document ids must not contain a dot (Sanity makes those private, so public reads can't see them); the seed uses dashed ids. Site settings and the home page are singletons (`SINGLETONS` in `src/sanity/env.ts`), and their Studio actions are restricted in `src/sanity.config.ts`. `/work/[slug]` needs at least one work item with a `caseStudy`, or the build fails. `SANITY_API_VERSION` is pinned; bump it deliberately.

**Env access.** Server env is parsed with zod in `src/lib/config.ts`. Lead-form vars are parsed lazily in `getLeadConfig()`, so missing keys fail the form submission instead of the build. Every variable is listed in `.env.example`. `SANITY_AUTH_TOKEN` is CLI-only and must never go to Vercel.

**Route groups.** `src/app/(site)/layout.tsx` wraps every public page in the shared chrome: SmoothScroll (Lenis), nav, the rounded `<main>` sheet over the footer, `LiveProvider`, corner controls, Organization JSON-LD. `/studio` and `/dev/*` sit outside it, and `robots.ts` disallows both. `src/app/dev/tile-stills` returns 404 in production.

**Lead forms.** Server actions in `src/lib/leads/actions.ts` validate with zod, apply anti-spam checks (honeypot field, minimum fill time from `options.ts`), and send plain-text email through the Resend HTTP API (`email.ts`). Failures surface to the visitor with the fallback email address and are logged on the server.

**3D tiles: stills first, then one shared canvas.** Every tile (`src/components/ui/LiveTile.tsx`) renders a pre-rendered PNG from `public/tiles` (`GlossyTile`). After a delay and an idle callback, `LiveProvider` checks `canRun3D()` (`src/lib/motion.ts`: no reduced motion, no data saver, at least 4 cores, hardware WebGL2 rather than a software renderer) and dynamically loads `LiveLayer`. That is one fixed transparent R3F canvas, and each tile is a drei `<View>` drawing into its own DOM rectangle, so all tiles share a single WebGL context. Frames are driven from `gsap.ticker`, the same loop as Lenis, so tiles stay locked to scrolling. On context loss the layer falls back to the stills. `<html data-live="on">` fades the stills out. The hero (`HeroScene`) has its own scene. When tile visuals change, re-run `npm run tiles:render` so the stills match; the still size must match `STILL_PX` in `GlossyTile.tsx`.

**Motion and sound preferences.** GSAP plugins are registered once in `src/lib/gsap.ts`; import `gsap`, `ScrollTrigger`, `SplitText` and `useGSAP` from there. A pre-hydration inline script in `src/app/layout.tsx` applies the stored choices as `<html data-motion="paused">` / `data-sound`, which CSS and the 3D scenes both read. Reduced motion must disable smooth scroll, the intro, pinned sections, reveals, loops and live 3D, with content visible immediately. Sound is off by default.

**Styling.** Tailwind v4, configured CSS-first in the `@theme` block of `src/app/globals.css` (colors, fluid type scale, easings). Use these tokens rather than raw values. `--color-muted` is tuned for 4.5:1 contrast. Share images are drawn by `src/lib/og.tsx` and used by the per-route `opengraph-image.tsx` files.
