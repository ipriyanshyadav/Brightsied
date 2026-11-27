# Light the tiles instead of painting them

The tiles look fake because they are painted, not lit. CSS gradients and drop shadows can imitate a single highlight, but they cannot produce the cues the eye checks for: reflections that slide across the surface as a tile turns, brighter rims at grazing angles, ambient occlusion in the gaps between tiles, and shadows that change with height. The award-winning sites of 2024–2025 (Igloo Inc, Lando Norris, Messenger, Bruno Simon's folio) all render their 3D live in WebGL. None of them fakes it with CSS, uses Spline for the hero, or plays a video. The closest open-source match to this hero, pmndrs' `lusion-connectors` demo, gets its realism from four studio "softbox" Lightformers, a mix of glossy and matte materials, N8AO ambient occlusion and a narrow 17.5° lens. That look can be reproduced with React Three Fiber 9.8.2 + drei 10.7.9 + three 0.187.0, all of which already fit this project's React 19.3.0. The cost is roughly 300–420 kB gzipped of JavaScript. That keeps Core Web Vitals intact only if it loads after a server-rendered poster image, behind a capability check, and never during first paint: one Next.js + R3F hero that loaded eagerly scored 13 s of Total Blocking Time. Not every tile should become real 3D. The tiles inside the Statement headline are 1em tall and are animated through the DOM by GSAP, so they should become pre-rendered stills made from the same 3D scene. Real-time 3D belongs in the hero first, then in the section cards through one shared canvas, and in the footer wordmark last.

## Lighting, not geometry, separates a render from a CSS fake

The current `GlossyTile` already gets the shape right: a rounded face, an extruded side, a raised glyph and a moving highlight. What it cannot fake is a consistent light environment. In a real render, every tile reflects the same studio. The reflection moves when the tile rotates, the rim brightens at glancing angles (Fresnel), the gaps between neighbours darken, and the shadow softens as a tile floats higher. The research synthesis lists exactly these as what CSS cannot reproduce, and the award winners show the craft in practice. They use environment reflections from HDRIs or Lightformer softboxes, contact shadows and AO for grounding, mixed roughness values, a proper tone mapper and a long lens ([lusion-connectors source](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx); [drei ContactShadows](https://drei.docs.pmnd.rs/staging/contact-shadows)).

The winners confirm the stack. **Igloo Inc, Awwwards Site of the Year 2024**, is plain Three.js with three-mesh-bvh, GSAP and Svelte. Its assets were built in Houdini and Blender. Even its UI text is rendered in WebGL so that text effects share the 3D look, and its intro is rendered live with shaders rather than played as video ([Awwwards Igloo case study](https://awwwards.com/igloo-inc-case-study.html)). **Lando Norris, Site of the Year 2025** by OFF+BRAND, lists WebGL, 3D and Rive as services ([OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris)). Third-party teardowns describe Three.js r174 with Lenis, GSAP ScrollTrigger and Draco/KTX2 assets, which is the same scroll stack this portfolio already runs, though OFF+BRAND has not confirmed it ([Dappasol](https://dappasol.com/guides/3d-website-examples/)). **Bruno Simon's 2025 folio** runs Three.js with TSL, so it switches to WebGPU automatically where available. It disables depth of field and water blur on mobile and lowers shadow resolution there ([Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html)). Closest in stack is "Sketching the Impossible", an award-winning portfolio built on **React 19 + R3F 9 + Three.js 0.182** ([Codrops, 2026-06-11](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)). Spline appears on individual Awwwards "elements", but the research found no 2024–2026 annual winner whose hero runs on it.

The direct template is `lusion-connectors`, a recreation of Lusion's studio piece that maps almost one-to-one onto the hero cluster ([live demo](https://pmndrs.github.io/examples/lusion-connectors)). Its objects float at zero gravity and are pulled toward the centre each frame (`applyImpulse(translation().negate().multiplyScalar(0.2))`, `linearDamping 4`). An invisible kinematic ball tracks the cursor and shoves them aside. Lighting is an `<Environment resolution={256}>` made of four Lightformers plus one soft spotlight. Roughness alternates between 0.1 and 0.75, and the scene renders through `<N8AO aoRadius={1} intensity={4}>` with 8× multisampling at `dpr={[1,1.5]}` ([source](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx)). The narrow 17.5° field of view gives it a telephoto product-shot look rather than a game-camera one. That one detail is a large part of why it reads as a "render".

## One R3F canvas with studio Lightformers and clearcoat produces the look

The compatible set as of November 2026 is **three 0.187.0, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, @react-three/postprocessing 3.2.2 and postprocessing 6.39.6** ([npm R3F](https://www.npmjs.com/package/@react-three/fiber); [npm drei](https://www.npmjs.com/package/@react-three/drei); [npm postprocessing](https://www.npmjs.com/package/postprocessing)). Two constraints decide the pins. R3F 9.8.x declares `react >=19 <19.4`. This repo is on React 19.3.0, which fits, so React must not move to 19.4 until R3F widens its range. postprocessing 6.39.6 caps three at `<0.188.0`, so three must not move to r188 yet. pmndrs' own `lusion-connectors` package.json pins nearly the same set, which is the best available evidence that it works together ([pmndrs/examples](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors)). In Next.js 16 the canvas must sit in a `"use client"` module loaded with `next/dynamic(..., { ssr: false })` from another Client Component, because `ssr: false` errors inside Server Components ([Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)). The R3F docs also recommend `transpilePackages: ['three']` ([R3F installation](https://r3f.docs.pmnd.rs/getting-started/installation)). Whether Turbopack still needs it is unverified, and no Next 16 + R3F 9.8 incompatibility reports turned up. That absence is not proof, so smoke-test both `next dev` and `next build`.

### The tile recipe

**Geometry.** A drei `RoundedBox` with high `smoothness` and `bevelSegments` gives a bevel that catches long specular streaks. Its props are `args`, `radius`, `smoothness`, `bevelSegments`, `steps` and `creaseAngle` ([drei RoundedBox types](https://unpkg.com/@react-three/drei@10.7.9/core/RoundedBox.d.ts)).

**Glyph.** The existing SVG paths from `GlossyTile` can be reused. three's `SVGLoader.createShapes` feeds an `ExtrudeGeometry` with a small bevel, raised slightly off the face, which gives the glyph real relief that catches the same environment. Text glyphs such as `>_` can use `Text3D`. A `Decal` or texture is cheaper but flat, so reserve it for very small tiles ([drei Decal types](https://unpkg.com/@react-three/drei@10.7.9/core/Decal.d.ts)). The `db` tile reads better as a real stacked cylinder than as a glyph on a slab.

**Material.** `meshPhysicalMaterial` with `clearcoat` 1, a low `clearcoatRoughness` and base roughness of about 0.25–0.35 gives the "app-icon lacquer": a sharp highlight over a softer body. The dark `agents` and `terminal` tiles benefit from a matte body under the clearcoat, which echoes lusion's glossy/matte mix. three r186 and r187 keep extending this material, with iridescence thickness controls and a rough-diffuse BRDF, so a subtle `iridescence` on one hero tile is available as an accent ([three.js releases](https://github.com/mrdoob/three.js/releases)). The hex palette already in `GlossyTile.tsx` should be the single source for material colours, so the CSS fallbacks and the 3D tiles never drift apart.

**Lighting.** Use a custom `<Environment resolution={256}>` whose children are three to five rectangular `Lightformer`s: a top key, two rim strips and a ring. Rectangles read as studio softboxes in reflections, and the setup costs zero HDR bytes. Do not use `preset`, which the drei docs say "is not meant to be used in production" because it pulls from a CDN ([drei Environment](https://drei.docs.pmnd.rs/staging/environment)). Tinting one or two Lightformers toward the hero's aurora colours would make the tiles look lit by the page around them rather than pasted on top. That is a design inference, not a sourced technique.

**Grounding.** Use `ContactShadows` with `frames={1}`, which drei warns is "rather expensive" if re-rendered every frame ([drei ContactShadows](https://drei.docs.pmnd.rs/staging/contact-shadows)), or a baked `AccumulativeShadows` plane. Do not use real-time shadow maps.

### Postprocessing, physics and the options to skip

The postprocessing stack worth paying for is short. **N8AO** gives the biggest realism gain because it darkens the crevices between tiles and around glyph edges. Composer multisampling (4–8) cleans up bevel edges, with SMAA as the cheaper downgrade. Tone mapping keeps saturated brand colours from clipping. Choose the tone mapper deliberately. Khronos PBR Neutral (`NeutralToneMapping`) is designed for true-to-life product colour, AgX is deliberately desaturated, and R3F's renderer defaults to ACES Filmic ([Khronos](https://www.khronos.org/news/cn/khronos-pbr-3d); [three.js forum](https://discourse.threejs.org/t/tone-mapping-overview/75204); [R3F Canvas](https://r3f.docs.pmnd.rs/api/canvas)). three ignores `renderer.toneMapping` when rendering into a render target, so once an `EffectComposer` is in use the tone mapping must come from its `ToneMapping` effect. That effect defaults to AgX, and the enum includes `NEUTRAL` ([react-postprocessing ToneMapping](https://react-postprocessing.docs.pmnd.rs/effects/tone-mapping); [postprocessing build](https://unpkg.com/postprocessing@6.39.6/build/index.js)). For brand-accurate tiles, use `NEUTRAL`. Bloom should apply only to emissive accents. Chromatic aberration tends to cheapen product shots.

Physics is optional. `@react-three/rapier` 2.2.0 reproduces the lusion shove exactly, but it weighs **843,736 B gzipped** because the WASM is inlined. It has also not been released since November 2025 and pins an older Rapier core ([Bundlephobia](https://bundlephobia.com/package/@react-three/rapier@2.2.0); [npm](https://www.npmjs.com/package/@react-three/rapier)). Per-tile springs toward a home position plus a repulsion term from the cursor, damped with `maath` `easing.damp3` and `dampE`, get most of the feel for almost no extra bytes, because maath is already a drei dependency. Only drag-and-throw truly needs Rapier.

**WebGPU is not the move yet.** Browsers are ready (Chrome/Edge, Firefox 141 and Safari 26 ship it), but first-class WebGPU in R3F arrives with v10. That version is still alpha (10.0.0-alpha.6, October 2026), moves WebGL to `@react-three/fiber/legacy`, and replaces the EffectComposer/N8AO ecosystem with `useRenderPipeline` and TSL ([web.dev](https://web.dev/blog/webgpu-supported-major-browsers?hl=en); [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)). For about 20 meshes, WebGL2 and WebGPU produce the same PBR image.

**Spline is not the move either.** Its runtime is **281 kB gzipped** before the scene file ([Bundlephobia](https://bundlephobia.com/package/@splinetool/runtime@2.0.222)). A 2024 test of a simple scene measured 17.9 s of desktop script execution, and Lighthouse could not compute a score ([Tuts+](https://webdesign.tutsplus.com/how-to-optimize-spline-3d-scenes-for-speed-and-core-web-vitals--cms-108749a)). Self-hosted export is Enterprise-only ([Spline pricing](https://spline.design/pricing)). Each Spline embed also brings its own context, which rules out sharing one canvas across sections. Spline remains useful as a modelling tool that exports stills or video.

## A 300–420 kB deferred chunk is safe only behind a poster and a gate

The research team bundled the stack with esbuild in this session. **R3F's `<Canvas>` adds about 248 kB gzipped over React**, because it imports essentially all of three plus the reconciler. Nine drei helpers (Float, Environment, Lightformer, RoundedBox, MeshTransmissionMaterial, PerformanceMonitor, View, useGLTF, ContactShadows) add only about 50 kB more, since drei tree-shakes well ([npm three](https://www.npmjs.com/package/three); [npm R3F](https://www.npmjs.com/package/@react-three/fiber); [npm drei](https://www.npmjs.com/package/@react-three/drei)). postprocessing with N8AO is about 105–113 kB gzipped as a full package, and the tree-shaken share is not yet measured ([Bundlephobia](https://bundlephobia.com/package/@react-three/postprocessing@3.2.2)). The realistic total is therefore **roughly 300–420 kB gzipped, all deferred**. Measure the exact figure through Turbopack's analyzer after integration.

That cost mostly lands in TBT and INP, not LCP, because `<canvas>` is not an LCP candidate while `<img>` and text blocks are ([web.dev LCP](https://web.dev/articles/lcp)). The cautionary case is a Next.js + R3F + drei hero on Vercel. Its model was only 67 KB, yet it scored **13,070 ms Total Blocking Time** with eager loading, a 900 KB custom HDR and CDN-hosted Draco decoders. Self-hosting the decoders alone lifted PageSpeed to about 51 ([three.js forum](https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976)). The R3F docs add that heavy synchronous scene creation janks: 510 `TextGeometry`s caused about 1.5 s of jank, while React's `startTransition` held 60 fps ([R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)). The procedural approach recommended here (RoundedBox plus extruded SVG plus Lightformers) needs no GLB, no HDR and no decoder at all, which removes the three biggest costs in that case.

### Loading order

The pattern that keeps Lighthouse green has four steps. First, the server renders the hero text and a pre-rendered AVIF poster of the tile cluster with explicit dimensions, and the poster becomes the LCP element. Second, a small client gate checks `prefers-reduced-motion`, Save-Data and the GPU tier. Third, it waits for idle time or visibility, then dynamic-imports the scene. Fourth, the canvas mounts at opacity 0 over the poster and cross-fades in after its first frame. An opacity fade is not "motion animation" under WCAG 2.3.3, so it is acceptable even for reduced-motion users ([W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

For the GPU tier, use `@pmndrs/detect-gpu` 6.0.32. The unscoped `detect-gpu` package stopped at 5.0.70. Tier 0 means "provide a non-WebGL fallback", and the benchmark data must be self-hosted through `benchmarksURL` instead of unpkg. Its gfxbench data source stopped updating in December 2025, so new GPUs fall back to heuristics, which makes the runtime `PerformanceMonitor` the real safety net ([detect-gpu README](https://raw.githubusercontent.com/pmndrs/detect-gpu/master/README.md); [npm](https://www.npmjs.com/package/@pmndrs/detect-gpu)). Handle `webglcontextlost` by swapping back to the poster ([MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)).

### Render loop

Clamp `dpr` to `[1, 1.5]` and let drei `PerformanceMonitor` lower it on decline, with `flipflops={3}` to stop oscillation ([drei PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)). Pause rendering when the canvas is offscreen or the tab is hidden. Keep draw calls in the tens: each mesh is a draw call, and the docs advise "a few hundred or less" ([R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)).

This site already drives Lenis from `gsap.ticker` in `SmoothScroll.tsx`, which is the official Lenis recipe ([Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md)). The canvas should join that single loop: run R3F with `frameloop="never"` and call `advance()` from the same ticker. Verify `advance`'s timestamp units in the installed 9.8.2 source, because the fetched docs do not state them ([R3F hooks](https://r3f.docs.pmnd.rs/api/hooks)). Scroll progress and `lenis.velocity` go into refs read inside `useFrame`, never into React state. This matters because an R3F + ScrollTrigger + Lenis site dropped from 60 to about 40 fps on mobile while scrolling, which a maintainer attributed to the 3D scene ([Lenis #431](https://github.com/darkroomengineering/lenis/discussions/431)).

### Accessibility

The canvas is decoration. Wrap it in `aria-hidden`, give it no focusable 3D, and keep every label and link in the DOM, as the current tiles already do with `aria-hidden` and `aria-label`.

One requirement already applies to the current site, not just a future 3D one. **WCAG 2.2.2 (Level A)** requires a pause mechanism for automatic motion that lasts more than 5 seconds, and it counts content that starts on scroll-into-view as automatic ([W3C 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). The existing `float-y` animation loops every 7 s indefinitely. A visible, keyboard-focusable "pause motion" toggle that stops both the CSS floats and the 3D loop closes that gap. WCAG 2.3.3 names parallax as the canonical non-essential interaction motion. Under reduced motion the site should therefore stop float, tilt and scroll-scrubbed rotation. Lenis already does its part by forcing `lerp: 1` ([Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md)).

## Cheaper middle grounds carry the tiles that are too small to need real-time 3D

Real-time 3D is not worth it where its advantages cannot be seen. A tile set inline in a headline at text size never rotates far enough for a moving reflection to register. A path-traced still of the same tile is indistinguishable from it, and it is cheaper and crisper. The middle-ground options rank as follows.

| Option | Realism | Interactivity | Runtime cost | Best use here |
|---|---|---|---|---|
| Pre-rendered AVIF/WebP stills (Blender Cycles, or captured from the R3F scene) | High: baked gloss, AO, soft shadow | Only CSS transforms on the image | Image bytes only | Statement inline tiles, posters, fallbacks |
| Pointer-scrubbed turntable sprite (12–24 frames, one yaw axis) | High | Rotation limited to rendered angles | RAM for decoded frames | Optional hover on Capabilities cards |
| Stacked-alpha AV1/HEVC video | High | None (playback) | 460 kB for a demo clip that is 1.1 MB as VP9 alpha | An intro "assemble" moment, if ever |
| True CSS 3D slices (8–16 `translateZ` layers) | Medium: real parallax, stepped edges | Full | Low; WebKit flattens under `overflow`/`filter` | Not recommended for rounded tiles |
| SVG `feSpecularLighting` with a pointer-driven `fePointLight` | Medium for glyphs | Full | Repaint cost; keep glyph-sized | Fallback-tier polish |
| Single fragment-shader background (OGL ≈13.5 kB vs three ≈115 kB in one benchmark) | Atmospheric depth | Pointer/scroll uniforms | Very low | Replacing CSS aurora blobs where no R3F canvas exists |

Sources for the table: [Jake Archibald on transparent video](https://jakearchibald.com/2024/video-with-transparency/); [Rotato](https://rotato.app/blog/transparent-videos-for-the-web); [WebKit bug 164949](https://bugs.webkit.org/show_bug.cgi?id=164949); [MDN feSpecularLighting](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpecularLighting); [webgl-libs-comparison](https://awesome.ecosyste.ms/projects/github.com%2Fjsulpis%2Fwebgl-libs-comparison); [CSS-Tricks image sequence](https://css-tricks.com/?p=308477).

### Pre-rendered stills

Stills are the strongest of these options. Archibald's measurements show that transparent video is still split by codec: Safari needs HEVC alpha, while WebM alpha is still not shipped in Safari as of August 2026 per Rotato ([Rotato](https://rotato.app/blog/transparent-videos-for-the-web)). Video is therefore only worth it for a non-interactive moment.

The best source for stills is the R3F scene itself rather than a separate Blender file. If the posters are captured from the live scene, the Statement and hero images exactly match the 3D first frame, so the poster-to-canvas cross-fade is invisible, and the whole site shares one lighting world. This is an inference: the capture step, via `preserveDrawingBuffer` or a Playwright screenshot, is unsourced and needs testing.

### Free motion upgrades in the current stack

Motion matters as much as rendering, and some of it costs nothing. GSAP 3.13 made every former Club plugin free, including SplitText, InertiaPlugin and the Draggable bonus features ([GSAP 3.13](https://gsap.com/blog/3-13/)). The site can add inertia on release, velocity-linked skew via `InertiaPlugin.track` with `quickTo`, and a light position that follows the pointer, all with no new dependency ([GSAP InertiaPlugin](https://gsap.com/docs/v3/Plugins/InertiaPlugin/); [GreenSock CodePen](https://codepen.io/GreenSock/pen/NWXMzXN)). Adding Motion or react-spring would duplicate GSAP, so don't.

The CSS 3D tilt on the case-study app window should stay. A flat panel is exactly what CSS perspective renders correctly. CSS 3D fails only for rounded, lit volumes.

## Four phases put real 3D where it shows and keep stills everywhere else

The phase plan follows from three facts: real-time light matters most where tiles are large and moving, one canvas can serve the whole page through drei `View`, and the existing CSS tiles become the fallback layer rather than being deleted. drei `View` uses `gl.scissor` to cut a single fixed canvas into viewports that track DOM placeholder divs through scroll and resize ([drei View](https://drei.docs.pmnd.rs/portals/view)).

One caveat shapes the architecture. Postprocessing does not compose cleanly per `View`, and r3f-scroll-rig similarly requires `globalRender` off when postprocessing is used ([r3f-scroll-rig README](https://github.com/14islands/r3f-scroll-rig)). The plan therefore uses **two canvases**: a hero canvas with N8AO and tone mapping, and one shared "section" canvas of Views without post effects, grounded with ContactShadows instead. Two contexts sit far below browser limits.

| Section | Decision | Why |
|---|---|---|
| Hero (7 tiles) | **Live R3F**, full post | Largest, most visible, pointer-reactive; this is where moving reflections and AO read |
| Statement (5 inline tiles flying into pipeline card) | **Pre-rendered AVIF stills** in the DOM, GSAP unchanged | Text-sized inline layout and DOM-driven GSAP flight; real 3D would add sync complexity for no visible gain |
| Capabilities (4 tiles, hover tilt) | Live tiles in a shared-canvas `View` (Phase 3) | Cards are large enough for hover rotation to show real reflections |
| Process (3 floating tiles) | Live `View` (Phase 3), stills before that | Same reasoning; small idle float only |
| Projects (3 tiles per card) | Live `View` (Phase 3), `frames={1}` when idle | Hover tilt benefits; static otherwise |
| Case study app window | **Keep CSS 3D** | Flat plane: CSS perspective is already physically correct |
| Footer wordmark | `Text3D` in a `View` with the hero's Lightformers (Phase 3–4) | Matching highlights make the page feel like one lit world |
| Aurora blobs / dot grid | Keep CSS; optionally recolour Lightformers to match | Tiles pick up the page's colours in reflection |

| Phase | Work | Impact | Effort | Added JS (gzip) |
|---|---|---|---|---|
| 0 | Pause-motion toggle (WCAG 2.2.2); GSAP inertia and velocity skew on hero tiles; pointer-driven SVG `fePointLight` on glyphs | Medium "alive", closes an A-level gap | ~1 day | 0 |
| 1 | Build the tile master (R3F scene or Blender); render AVIF stills for Statement tiles and all posters/fallbacks; swap the Statement CSS faces for `<img>` | High realism on inline tiles; prerequisite for Phase 2 posters | 1–2 days | 0 |
| 2 | Live hero: RoundedBox + extruded SVG glyphs, clearcoat physical material, Lightformer studio, ContactShadows, N8AO + NEUTRAL tone mapping + multisampling, spring/repulsion pointer field, `Float`, scroll-velocity response; gate, poster, cross-fade, context-loss fallback | **Highest**: the "max" look | 3–5 days | ~300–420 kB, deferred |
| 3 | Shared section canvas with `View`s for Capabilities, Process, Projects and footer `Text3D`; IntersectionObserver pause per view | Medium-high coherence | 3–5 days | Small; three/R3F/drei already loaded |
| 4 (optional) | Rapier drag-and-throw loaded on first `pointerdown`; one `MeshTransmissionMaterial` glass tile on tier 3 only; restrained UI click sound, off by default | Low-medium per cost | 2–4 days | +844 kB (Rapier), lazy |

The explicit skips are Spline's runtime, R3F v10/WebGPU, image sequences for the hero, and moving the UI text into WebGL as Igloo did. That last one is a different site, not an upgrade.

### Packages

| Package | Version | Role |
|---|---|---|
| `three` / `@types/three` | 0.187.0 | Renderer; do not exceed r187 (postprocessing cap) |
| `@react-three/fiber` | 9.8.2 | React renderer; keep React ≥19 <19.4 (repo is on 19.3.0) |
| `@react-three/drei` | 10.7.9 | RoundedBox, Environment, Lightformer, ContactShadows, Float, View, PerformanceMonitor, Text3D, Bvh |
| `@react-three/postprocessing` | 3.2.2 | EffectComposer, N8AO, ToneMapping (hero canvas only) |
| `postprocessing` | 6.39.6 | Peer of the above |
| `@pmndrs/detect-gpu` | 6.0.32 | Tiering; self-host `benchmarksURL` under `public/` |
| `maath` | match drei's `^0.10.8` | `easing.damp3`/`dampE` for springs (add explicitly if imported directly) |
| `@react-three/rapier` | 2.2.0 | Phase 4 only |
| `gsap` / `lenis` | 3.15.x / 1.3.x (latest 3.15.1 / 1.3.28) | Existing; unchanged |

Versions are from [npm](https://www.npmjs.com/package/@react-three/fiber) and the performance notes' `npm view` checks ([npm @pmndrs/detect-gpu](https://www.npmjs.com/package/@pmndrs/detect-gpu); [npm gsap](https://www.npmjs.com/package/gsap); [npm lenis](https://www.npmjs.com/package/lenis)). Pin the exact versions above and re-check peers before any bump.

### Component architecture

```
app/page.tsx                      Server Component: hero text, <Image priority> poster (AVIF, fixed aspect)
components/ui/GlossyTile.tsx      unchanged CSS tile; export `palettes` + glyph path data (single source)
components/three/
  ThreeGate.tsx        "use client": reduced-motion / Save-Data / detect-gpu tier / idle+visibility gate;
                       dynamic(() => import('./HeroScene'), { ssr:false, loading: Poster });
                       owns fallback state (tier 0, context lost, user paused)
  HeroScene.tsx        <Canvas dpr={[1,1.5]} frameloop="never" camera fov≈17.5 gl={{antialias:false, stencil:false}}>
                       + PerformanceMonitor + EffectComposer(multisampling, N8AO, ToneMapping NEUTRAL)
  GsapFrameDriver.tsx  registers gsap.ticker → advance(); unregisters when paused/offscreen/hidden
  StudioEnvironment.tsx  <Environment resolution={256}> with 3–5 rect Lightformers (shared by both canvases)
  Tile3D.tsx           RoundedBox + meshPhysicalMaterial(clearcoat) + extruded glyph; props: kind, tier
  glyphGeometry.ts     SVGLoader.createShapes → ExtrudeGeometry, memoised per kind, Y flipped, centred
  usePointerField.ts   spring-to-home + cursor repulsion + lenis.velocity, via refs and maath easing
  SectionCanvas.tsx    Phase 3: fixed full-viewport <Canvas eventSource={root}> with <View.Port/>, no post
  TileView.tsx         Phase 3: <View> placeholder used inside Capabilities/Process/Projects/Footer cards,
                       renders <Tile3D>; falls back to <GlossyTile> or still when gate says no
```

The hero's existing `cluster` array (x, y, size, r, depth per tile) maps directly to 3D positions and z-depth, so the composition the owner already approved carries over.

### Fallback ladder

The ladder runs cheapest first. Reduced motion, Save-Data or 2G: keep the AVIF poster and stills and load no 3D chunk at all, since a static 3D frame would look identical to the poster. GPU tier 0 or WebGL failure: same as above. Tier 1: live scene at `dpr` 1, no N8AO, no transmission, SMAA instead of multisampling. Tier 2 and above: the full scene under `PerformanceMonitor`, which drops DPR, then AO, on decline. A context loss at any point swaps back to the poster. The user's pause toggle stops the ticker callback and the CSS floats together and persists in `localStorage`.

## Conclusion

The real decision is where real-time 3D can be seen, not whether to use it. Moving reflections, AO and Fresnel rims only register on objects large enough and free enough to rotate. That argues for live rendering in the hero and section cards, and for honest pre-rendered stills for text-sized inline tiles. The two can share one lighting setup, because the R3F scene can generate its own posters. This also turns the performance problem around: the poster that protects LCP and the fallback that serves reduced-motion and low-end users are the same asset, so the "cheap" path and the "max" path stop being two designs that drift apart.

Three uncertainties should be closed in the first hour of Phase 2. Measure the real Turbopack chunk size. Confirm the units `advance()` expects when driven from `gsap.ticker`. Verify how `EffectComposer` behaves alongside drei `View`, which decides between the two-canvas plan and a single canvas. The ecosystem is also about to shift: R3F v10 makes WebGPU the default and replaces the EffectComposer/N8AO stack. Keep materials, lighting and motion in small components such as `Tile3D`, `StudioEnvironment` and `usePointerField`, and the later migration becomes a renderer swap rather than a rewrite.
