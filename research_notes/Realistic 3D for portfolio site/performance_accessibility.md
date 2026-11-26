# Performance & Accessibility Best Practices for Real-time WebGL (three.js / React Three Fiber) in a Next.js 16 + React 19 Portfolio (2025–2026)

Research date: 2026-11-26. Current npm versions checked this session: `three` 0.187.0 (modified 2026-10-30), `@react-three/fiber` 9.8.2 (2026-10-21), `@react-three/drei` 10.7.9 (2026-09-25), `lenis` 1.3.28 (2026-11-23), `gsap` 3.15.1 (2026-11-11), `next` 16.4.6, `@pmndrs/detect-gpu` 6.0.32 (2026-11-22; the old unscoped `detect-gpu` is stuck at 5.0.70 from 2025-02-26), `@gltf-transform/cli` 4.5.1, `gltfjsx` 6.5.3. Sources: [npm three](https://www.npmjs.com/package/three), [npm @react-three/fiber](https://www.npmjs.com/package/@react-three/fiber), [npm @react-three/drei](https://www.npmjs.com/package/@react-three/drei), [npm lenis](https://www.npmjs.com/package/lenis), [npm gsap](https://www.npmjs.com/package/gsap), [npm next](https://www.npmjs.com/package/next), [npm @pmndrs/detect-gpu](https://www.npmjs.com/package/@pmndrs/detect-gpu), [npm @gltf-transform/cli](https://www.npmjs.com/package/@gltf-transform/cli). I got these with `npm view` in this session.

## 1. Loading strategy in Next.js 16 (next/dynamic, lazy/Suspense, idle/visibility loading, poster-first) and the effect on LCP / TBT / INP / CLS

### Takeaway
Keep the WebGL bundle off the critical path. Render the hero's real text and a static poster `<img>` from the server so it becomes the LCP element. `<canvas>` is not an LCP candidate. Then load the r3f canvas in a separate client chunk with `next/dynamic(..., { ssr: false })` from inside a `'use client'` file, triggered on idle or visibility, and cross-fade it in over a fixed-size box so there is no CLS. The one real-world 2025 Next.js + r3f case below shows an eagerly loaded 3D hero produced a 13 s TBT.

### Cited Findings
- Next.js docs (lastUpdated 2026-03-10): lazy loading applies to Client Components. `next/dynamic` is "a composite of `React.lazy()` and Suspense". Server Components are code-split automatically. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- "`ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component." `ssr: false` "will only work for Client Components". — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- "When a Server Component dynamically imports a Client Component, automatic code splitting is currently **not** supported." So put the `dynamic()` call in a `'use client'` wrapper. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- With `React.lazy()` + Suspense, Client Components are still prerendered (SSR) by default. Use `ssr: false` to skip that, which three.js needs because it touches `window`/WebGL. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- `next/dynamic` accepts a `loading: () => <...>` placeholder, and external libraries can be loaded on demand with `await import('lib')` inside an event handler. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- Code pattern from the docs: `const ComponentC = dynamic(() => import('../components/C'), { ssr: false })` inside a `'use client'` file. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- LCP candidates are `<img>`, `<image>` inside SVG, `<video>` (poster or first frame), elements with a `url()` background image (not gradients), and block-level elements containing text. `<canvas>` is not listed. Thresholds are good ≤2.5 s and poor >4.0 s at the 75th percentile, split by mobile and desktop (article updated 2025-09-04). — [web.dev LCP](https://web.dev/articles/lcp)
- Real case (three.js forum, Sept 14–19, 2025): a Next.js + TypeScript + r3f + drei hero on Vercel. The model was only about 67 KB (Draco, later Meshopt) with a custom HDR of about 900 KB. Lighthouse reported **Total Blocking Time 13,070 ms**. Lazy loading with `next/dynamic` + Suspense reduced TBT, but the author wanted the hero "instant". Self-hosting the Draco decoders (drei loads them from a CDN by default) raised PageSpeed to about 51. Advice in the thread: load the page first and 3D after, use Suspense / `PerformanceMonitor` / a poster image, and host decoders locally. — [three.js forum: "Want to increase my page speed by optimizing three js code"](https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976)
- Gatsby (older; undated in the search snippet, flagged as likely pre-2023): r3f added "considerable KB's" to the bundle, and the fix was lazy-loading the component that imports it. — [Gatsby blog: Performance Optimization for three.js Web Animations](https://v2.gatsbyjs.com/blog/performance-optimization-for-three-js-web-animations)
- r3f docs, nested loading: wrap the `Canvas` in Suspense, and inside it use `<Suspense fallback={<Model url="/low-quality.glb" />}><Model url="/high-quality.glb" /></Suspense>` to show low-quality assets first. — [r3f Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- r3f docs: heavy synchronous scene creation causes jank. Creating 510 `TextGeometry` instances at once caused "approximately 1.5 seconds of pure jank". With React concurrency (`startTransition`) it held about 60 fps, against about 5 fps for plain three.js doing it all at once (Apple M1). — [r3f Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance); [r3f Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)

### Inferences
- Recommended pattern:
  1. A Server Component renders the hero `<h1>`, the copy, and a pre-rendered poster `<Image priority>` (a PNG/AVIF screenshot of the 3D tiles) inside a box with explicit `width`/`height` or `aspect-ratio`.
  2. A small `'use client'` `HeroCanvasLoader` does `const Scene = dynamic(() => import('./HeroScene'), { ssr: false })`, and mounts `<Scene>` only after a gate resolves. The gate is `requestIdleCallback` (with a `setTimeout` fallback for Safari), or an `IntersectionObserver` for below-the-fold scenes, plus the capability checks in section 4.
  3. The canvas is absolutely positioned over the poster at `opacity: 0`. After r3f's `onCreated` plus first frame, fade it to 1 and fade the poster out (opacity only). This avoids CLS and keeps the LCP element the poster or the text, never the canvas.
- Because the canvas isn't an LCP candidate ([web.dev](https://web.dev/articles/lcp)), most of the 3D cost shows up in **TBT/INP**, not LCP. It comes from about 250+ kB gz of JS parsing and compiling (section 7) plus shader compilation on the main thread. Deferring past load and idle is the lever. On mid-range Android, expect script evaluation of the three.js chunk to be a long task, so don't trigger the load during user input.
- Self-host every runtime asset: Draco/Basis decoders, HDRs, and detect-gpu benchmarks. This avoids third-party CDN latency and failures, which hurt the forum case.

### Gaps
- I found no rigorous before/after CWV study (field CrUX data) of an r3f hero with poster-first, idle-loading versus eager loading. The forum thread gives only lab TBT and PageSpeed numbers.
- I found no official Next.js 16 guidance specific to WebGL. The lazy-loading guide is generic.

## 2. r3f render-loop controls (frameloop, invalidate, offscreen pause, DPR, PerformanceMonitor/regress, antialias, powerPreference, shadows, single canvas via drei View)

### Takeaway
For roughly 8 floating tiles, use one shared `<Canvas>` with drei `<View>`s for the hero and later sections. Clamp `dpr` to `[1, 1.5]` or `[1, 2]` and drive it with `PerformanceMonitor`. Pause the loop (`setFrameloop('never')`, or `'demand'` + `invalidate()`) when the canvas is offscreen, the tab is hidden, or reduced motion is on. Use no real-time shadow maps; use baked or contact shadows instead. Keep draw calls in the low hundreds and share geometries and materials.

### Cited Findings
- Canvas defaults: `dpr = [1, 2]`, `frameloop = 'always'` (options `always | demand | never`). The default renderer uses `antialias: true`, `alpha: true`, `powerPreference: "high-performance"`, sRGB output, and ACES Filmic tone mapping. `shadows` defaults to `false`, and `true` means PCFSoft. Changing `dpr`/`frameloop`/`performance`/`shadows` props at runtime applies them. — [r3f Canvas API](https://r3f.docs.pmnd.rs/api/canvas)
- `frameloop="demand"` renders only when props change. Mutations React can't see need `invalidate()`. It "will not render immediately", and multiple calls don't cause multiple renders. — [r3f Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- `useThree` exposes `invalidate` (only meaningful in `'demand'`), `advance(timestamp, runGlobalEffects?)` (one tick when `frameloop='never'`), `setFrameloop('always'|'demand'|'never')`, `setDpr(dpr)`, and `performance {current, min, max, debounce, regress}`. — [r3f Hooks API](https://r3f.docs.pmnd.rs/api/hooks)
- A `useFrame(cb, priority)` with **positive** priority "will cause React Three Fiber to disable automatic rendering altogether", so you must call `gl.render` yourself. Negative priorities only order callbacks. "You should never setState in there!" — [r3f Hooks API](https://r3f.docs.pmnd.rs/api/hooks)
- Movement regression defaults: `current: 1, min: 0.1, max: 1, debounce: 200` ms. Call `regress()` on interaction, and your app must read `performance.current` and scale something (for example DPR). `regress()` alone does nothing. — [r3f Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- drei `PerformanceMonitor` defaults: `ms 250`, `iterations 10`, `threshold 0.75`, `factor 0.5`, `step 0.1`, `flipflops Infinity`. Default bounds are `[50, 90]` if refresh rate > 90, else `[50, 60]`. Example: `<PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />`, plus `flipflops={3} onFallback={() => setDpr(1)}` to stop oscillation. Children can use `usePerformanceMonitor`. — [drei PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)
- drei also ships `AdaptiveDpr`, `AdaptiveEvents`, `BakeShadows`, `Bvh`, `Preload`, `Detailed`, `Instances`, `Merged`, and `meshBounds` under "Performances". — [drei PerformanceMonitor page sidebar](https://drei.docs.pmnd.rs/performances/performance-monitor)
- Draw calls: each mesh is a draw call. Aim for "a few hundred or less", with "no more than 1000 as the very maximum". Share geometry and material instances. `useLoader` caches by URL. Use instancing for many similar objects. — [r3f Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- Pitfalls:
  - Don't mount and unmount GPU resources per stage. Toggle `visible` instead, because materials, lights, and geometries recompile.
  - Mutate refs in `useFrame` and pointer events instead of calling setState.
  - Multiply by `delta` so speed doesn't depend on refresh rate.
  - Preallocate vectors to avoid GC pressure.
  - Read fast-changing store state with `getState()` inside `useFrame`.
  — [r3f Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- drei `View`: uses `gl.scissor` to cut one canvas into many viewports ("a single, performant canvas") that track DOM elements through scroll and resize. Put `View.Port` inside the Canvas, make the Canvas ideally fixed or absolute full-screen, and set `eventSource` to a parent containing both the canvas and the HTML. Props: `index` (render order, default 1), `visible`, and `frames` (set to 1 for static views to avoid repeated `getBoundingClientRect`). — [drei View](https://drei.docs.pmnd.rs/portals/view)
- MDN: you can lower the canvas backing size while keeping CSS size constant to trade quality for speed. `alpha:false` "can be expensive" on some platforms. Request `stencil` only if used. Avoid `getError()`, `get*Parameter()`, and sync `readPixels()` in production because they flush and round-trip to the GPU. — [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- Mobile case (Lenis discussion #431, Jan 2025): an r3f + GSAP ScrollTrigger + Lenis site dropped from about 60 fps to about 40 fps on mobile while scrolling. A maintainer suspected the 3D scene rather than Lenis. — [Lenis discussion #431](https://github.com/darkroomengineering/lenis/discussions/431)

### Inferences
- Frame budget: 16.7 ms at 60 Hz, or 8.3 ms at 120 Hz on ProMotion and high-refresh Android. That's why `PerformanceMonitor` raises its upper bound to 90 above 90 Hz. Simple math, consistent with the [drei bounds](https://drei.docs.pmnd.rs/performances/performance-monitor).
- Suggested Canvas config for the hero tiles: `<Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, stencil: false }} frameloop={active ? 'always' : 'never'} shadows={false} eventSource={containerRef} flat?>`. Then add `<PerformanceMonitor flipflops={3} onDecline={()=>setDpr(1)} onFallback={()=>setDpr(1)}/>`. With DPR ≥ 1.5, MSAA can often be dropped (`antialias:false`) on low tiers to save fill-rate.
- Use `'always'` only while the tiles are visibly animating (float or cursor). On reduced-motion or idle, switch to `'demand'` and call `invalidate()` on pointer or scroll-progress changes.
- Offscreen pause: put an `IntersectionObserver` on the canvas container (or each View's tracking div) plus `document.visibilitychange`, and call `setFrameloop('never')` when nothing is visible. This is an inference from the [hooks API](https://r3f.docs.pmnd.rs/api/hooks); I found no official r3f page prescribing it.
- Eight glossy tiles: one `RoundedBox` geometry shared across all 8 meshes (or drei `Instances`), with 1–3 shared `MeshPhysicalMaterial`/`MeshStandardMaterial` variants. That's about 8–10 draw calls. Avoid `MeshTransmissionMaterial`, which is expensive and renders extra passes, on low tiers. Shadows should come from drei `ContactShadows` with `frames={1}` or a baked texture, not shadow maps.
- WebGL context limit: browsers cap simultaneous WebGL contexts per page. This is commonly cited as about 16 in Chrome, but I didn't find an authoritative 2025–26 page stating the number (see Gaps). One canvas with `View` sidesteps it entirely.

### Gaps
- I found no official, current source for the exact per-page WebGL context limit (about 16 in Chromium).
- The drei `AdaptiveDpr` page wasn't fetched, so its prop details aren't verified here. The r3f scaling page mentions only that drei has "pre-made components" for regression.
- The r3f docs give no official recipe for IntersectionObserver-driven pausing.

## 3. Asset optimization (glTF + Draco/Meshopt, KTX2/Basis, gltfjsx/gltf-transform, small HDRI / Lightformers, font subsetting)

### Takeaway
Ship GLB files processed with gltf-transform or gltfpack: Meshopt (or Draco) for geometry, KTX2/Basis for textures, and resized textures. Self-host the decoders. Don't use drei `Environment preset` in production. Use a small self-hosted HDR or procedural `Lightformer`s, which need no HDR download, for glossy reflections.

### Cited Findings
- drei `Environment`: "preset property is not meant to be used in production environments and may fail as it relies on CDNs". Presets are HDRI Haven files hosted on GitHub. Use `files="file.hdr"` (RGBELoader), `.exr` (EXRLoader), or a 6-image cubemap array. Custom children rendering uses a cube camera at "resolution=256", and `frames={Infinity}` makes it live. — [drei Environment](https://drei.docs.pmnd.rs/staging/environment)
- Forum case: a custom HDR of about 900 KB plus a cubemap was part of a hero that scored poorly. Draco decoders fetched from a CDN by default were a measurable cost, and self-hosting them improved the score to about 51. — [three.js forum thread](https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976)
- Meshopt "is quantization rather than traditional compression". It reduces both file size and GPU vertex bandwidth (manthrax, Sept 17, 2025). — [three.js forum thread](https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976)
- MDN: GPU-compressed textures are "smaller in GPU memory, and are faster to sample from" but lower quality than JPG and generally acceptable only for color, not normals. Basis Universal gives "a single compressed texture file" that is transcoded at load and is "more comparable to JPEG" over the wire. Per platform: S3TC (desktop), ETC (Android), PVRTC/ASTC (iOS / modern mobile). Mipmaps cost about 33% extra memory for square textures. — [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- Example reductions (tool-specific, anecdotal):
  - gltf-transform Draco: DamagedHelmet 5.03 MB → 3.29 MB. — [klich3 sample repo](https://github.com/klich3/threejs-gltf-with-compressions-sample)
  - gltfpack with KTX2: 40 MB → 5 MB GLB. — [Babylon forum: About the gltf-transform Tool](https://forum.babylonjs.com/t/about-the-gltf-transform-tool/49116)
  - A tutorial claims combined Draco/Meshopt + KTX2 is "often 5–10× smaller". This is an unmeasured claim. — [jvinhit blog: glTF compression Draco/Meshopt/KTX2](https://jvinhit.github.io/blog/threejs-16-gltf-compression-draco-meshopt-ktx2/)
- r3f: use gltfjsx to generate reusable JSX for GLTF models, and `useLoader`/`useGLTF` cache by URL. — [r3f Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)

### Inferences
- For glossy icon tiles, the cheapest high-quality route is probably no GLB at all. Use a procedural `RoundedBox` with an extruded SVG icon (`ExtrudeGeometry` from the SVG path) or a decal texture. Lighting from `<Environment resolution={256}>` with a few `<Lightformer>` children and `frames={1}` gives studio-style reflections with zero HDR bytes. This is an inference from the [drei Environment](https://drei.docs.pmnd.rs/staging/environment) children-rendering API; Lightformer docs weren't fetched.
- If GLBs are used, a typical pipeline is `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress ktx2` (verify flags against [@gltf-transform/cli](https://www.npmjs.com/package/@gltf-transform/cli) 4.5.1 before use), then `gltfjsx out.glb --types`. Budget roughly under 100–200 KB per hero asset. That is a judgment call, not a sourced number.
- Text3D/troika fonts: subset to the glyphs used. I found no source with numbers (Gaps).

### Gaps
- No primary measured before/after for gltf-transform Meshopt + KTX2 in KB.
- No source on font subsetting for drei `Text3D` (typeface JSON) or troika `Text`.
- drei Lightformer docs weren't fetched.

## 4. Mobile / low-power fallbacks (GPU tier, hardwareConcurrency, reduced motion, Save-Data, battery, context loss)

### Takeaway
Gate the WebGL load behind a capability check: `prefers-reduced-motion`, `Save-Data`/`effectiveType`, `@pmndrs/detect-gpu` tier, and optionally `hardwareConcurrency`/`deviceMemory`. Tier 0, or any opt-out signal, means the user keeps the static poster or CSS version. Tier 1 gets reduced DPR and no transmission or post effects. Also handle `webglcontextlost` by swapping back to the poster.

### Cited Findings
- `getGPUTier()` returns `{ tier: 0–3, isMobile, type: 'BENCHMARK'|'FALLBACK'|'BLOCKLISTED'…, fps, gpu }`. Tier 0 means no WebGL, a blocklisted GPU, or under 15 fps, and the README says to "Provide a non-WebGL fallback". Tier 1 is ≥15 fps, tier 2 ≥30 fps, and tier 3 ≥60 fps. Default `mobileTiers`/`desktopTiers` are `[0, 15, 30, 60]`. — [detect-gpu README](https://raw.githubusercontent.com/pmndrs/detect-gpu/master/README.md)
- Benchmarks load by default from `https://unpkg.com/@pmndrs/detect-gpu@{version}/dist/benchmarks`. You can self-host by extracting `benchmarks.tar.gz` into, for example, `public/benchmarks/` and passing `benchmarksURL`, which suits strict CSP or avoiding a third-party CDN. `failIfMajorPerformanceCaveat` defaults to `false`. — [detect-gpu README](https://raw.githubusercontent.com/pmndrs/detect-gpu/master/README.md)
- **Caveat (2025–26):** "The benchmark data source (gfxbench.com) stopped updating in December 2025". Newer GPUs may fall back to heuristics. — [detect-gpu README](https://raw.githubusercontent.com/pmndrs/detect-gpu/master/README.md)
- Package rename: the current package is `@pmndrs/detect-gpu` (6.0.32, Nov 2026). Unscoped `detect-gpu` last published 5.0.70 in Feb 2025. — [npm @pmndrs/detect-gpu](https://www.npmjs.com/package/@pmndrs/detect-gpu); [npm detect-gpu](https://www.npmjs.com/package/detect-gpu)
- MDN: "Handle `webglcontextlost` events, which can be emitted when the GPU runs out of memory, among other reasons". `webglcontextrestored` and `webglcontextcreationerror` also exist, and `WEBGL_lose_context` can release contexts eagerly. — [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- MDN conservative limits: don't assume more than `MAX_TEXTURE_SIZE: 4096` or `MAX_TEXTURE_IMAGE_UNITS: 8` on all devices. Check `getExtension()` results for `null`. — [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- Lenis on mobile: `syncTouch` (default `false`) "can be unstable on iOS<16". In the r3f mobile case, `syncTouch: true` fixed fps drops but removed the smooth feel. — [Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md); [Lenis discussion #431](https://github.com/darkroomengineering/lenis/discussions/431)

### Inferences
- Gate order, cheapest first:
  1. `matchMedia('(prefers-reduced-motion: reduce)')`: keep the static poster, or render one static frame with `frameloop='demand'`.
  2. `navigator.connection?.saveData === true` or `effectiveType` in `slow-2g`/`2g`: poster only.
  3. Dynamic-import `@pmndrs/detect-gpu` with a self-hosted `benchmarksURL`. Tier 0 gets the poster or CSS version. Tier 1 gets `dpr=1`, `antialias:false`, and no `MeshTransmissionMaterial`. Tier 2+ gets the full scene with `PerformanceMonitor`.
  4. Optionally treat `navigator.hardwareConcurrency <= 4` or `deviceMemory <= 4` as a downgrade signal.

  These APIs aren't verified in this session's sources. `Save-Data`/`deviceMemory`/`connection` are Chromium-only, and the Battery API is Chromium-only and of limited value. Treat them all as optional hints (see Gaps).
- Context loss: in `onCreated={({gl}) => gl.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); setFallback(true) })}`, swap back to the poster. Per the WebGL spec, `preventDefault()` is what allows restoration. That is not stated on the MDN page fetched.

### Gaps
- I didn't fetch current MDN pages for `Save-Data`, the Network Information API, `deviceMemory`, the Battery Status API, or `webglcontextlost` details (`preventDefault` semantics), so browser-support claims are not cited.
- I found no measurements of the r3f scene's fps on specific mid-range phones.

## 5. Accessibility (decorative canvas, DOM text, keyboard equivalents, reduced motion, vestibular, focus, contrast, WCAG 2.2)

### Takeaway
Treat the 3D as decoration. Give the canvas wrapper `aria-hidden="true"` and keep it out of the tab order (no focusable 3D). Keep every word and link in the DOM. Honor `prefers-reduced-motion` by stopping auto-float, cursor tilt, and scroll-parallax. Provide a visible pause control if auto-animation runs longer than 5 s (WCAG 2.2.2, Level A). 2.3.3 (AAA) covers interaction- and scroll-triggered motion such as parallax.

### Cited Findings
- **WCAG 2.2.2 Pause, Stop, Hide (Level A):** moving, blinking, or scrolling content that starts automatically, lasts more than 5 s, and is presented in parallel with other content needs a mechanism to pause, stop, or hide it unless essential. Content that starts on hover, focus, or **scrolling into view counts as starting automatically**. A pause that only applies while focused doesn't qualify. — [W3C Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- **WCAG 2.3.3 Animation from Interactions (Level AAA):** "Motion animation triggered by interaction can be disabled, unless the animation is essential". Motion animation means adding steps between states to create the illusion of movement. Pure color, blur, or opacity changes that don't change perceived size, shape, or position are excluded. Parallax scrolling is the canonical non-essential example. Sufficient techniques are C39 (CSS `prefers-reduced-motion`), SCR40 (`prefers-reduced-motion` in JS), and a user setting. — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- The intent of 2.3.3 is that some users get distraction, dizziness, headaches, or nausea from animation (vestibular triggers). — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Lenis honors `prefers-reduced-motion: reduce` by default. It forces `lerp: 1`, which makes scrolling native-feeling, and makes `scrollTo` and anchor jumps instant. It keeps running so WebGL and DOM sync still work, updates live without reload, and exposes `lenis.prefersReducedMotion` for your own animations. `respectReducedMotion: false` is "not recommended". — [Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md)
- Lenis wraps native scroll, so `position: sticky`, anchor links, and accessibility keep working. — [Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md)
- Opacity cross-fades don't count as "motion animation" under 2.3.3, so a poster-to-canvas fade is fine under reduced motion. — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Inferences
- Concrete checklist:
  - Wrap the canvas in `<div aria-hidden="true" role="presentation">` with `tabIndex` never set.
  - Keep pointer events on the canvas from blocking DOM text selection and links. Use `eventSource` on a parent and `pointer-events: none` on overlay regions as needed.
  - Don't put meaning in the 3D. If the tiles represent skills or tools, render the same list as real DOM text (visually hidden or visible).
  - Under `prefers-reduced-motion: reduce` (read via `lenis.prefersReducedMotion` or `matchMedia`, and subscribe to changes), disable floating, cursor tilt, scroll-scrubbed rotation, and camera moves. Set `frameloop='demand'` and render a single static composition.
  - If the hero floats continuously for more than 5 s, add a visible "Pause animation" toggle button (persist it in `localStorage`). The button is DOM and keyboard-focusable, and should set `frameloop='never'` or `'demand'`.
  - Any interaction with the 3D (for example clicking a tile to open a project) needs a DOM button or link equivalent.
  - Check text contrast against the brightest frame of the WebGL background, or place text on a solid or scrim layer. Contrast over a moving background has to hold at all frames.
- These checklist items derive from the cited WCAG SCs. The specific `aria-hidden` canvas pattern and contrast-over-canvas advice aren't from a fetched source.

### Gaps
- I didn't fetch WCAG 1.4.3/1.4.11 contrast guidance or ARIA guidance on `<canvas>` (for example the MDN canvas accessibility notes), so those details are uncited.
- I found no r3f-specific a11y docs (`@react-three/a11y` exists but wasn't researched; its maintenance status is unknown).

## 6. Interplay of Lenis + GSAP ScrollTrigger + r3f (single RAF loop) and React 19 / Next 16 Server Component boundaries

### Takeaway
Run one RAF loop. Either drive Lenis from `gsap.ticker` (the official Lenis recipe, with `autoRaf: false` and `lagSmoothing(0)`) and have r3f render from that same tick (`frameloop="never"` + `advance()`), or drive GSAP from r3f's `useFrame` via `gsap.updateRoot`. Then read ScrollTrigger progress into refs inside `useFrame`, never into React state.

### Cited Findings
- Official Lenis + ScrollTrigger recipe: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((time) => { lenis.raf(time * 1000) }); gsap.ticker.lagSmoothing(0);`. `autoRaf` defaults to `false`. — [Lenis README](https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md)
- With `lenis/react`, the instance is at `lenisRef.current?.lenis?.raf(time * 1000)` inside `gsap.ticker.add`. Pass `autoRaf: false` and call `ScrollTrigger.update()` from the `useLenis` callback. `@studio-freight/lenis` and `@studio-freight/react-lenis` are deprecated in favor of `lenis` and `lenis/react` (maintainers, Jan 2025). — [Lenis discussion #431](https://github.com/darkroomengineering/lenis/discussions/431)
- r3f `frameloop='never'` plus `advance(timestamp, runGlobalEffects?)` advances one tick on demand. `setFrameloop` switches modes at runtime. — [r3f Hooks API](https://r3f.docs.pmnd.rs/api/hooks)
- Alternative (Jan 2023 gist, older): `gsap.ticker.remove(gsap.updateRoot)`, then `useFrame((_, d) => { t += d; gsap.updateRoot(t) })` drives GSAP from r3f's loop. `ticker.remove` is global, and nothing re-adds `updateRoot` on unmount, so restore it in cleanup. — [dghez gist](https://gist.github.com/dghez/47d33ed61fa1eb275f77254c5321d380)
- Theatre.js docs advise running all animation libraries in one RAF loop to stay in sync (rafDrivers). — [Theatre.js advanced manual](https://www.theatrejs.com/docs/latest/manual/advanced)
- Don't bind fast-changing state reactively. Read it in `useFrame` via `api.getState()` or refs. — [r3f Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- Next 16: `ssr: false` dynamic imports must live in Client Components. Server Components can't use them and error. — [Next.js Lazy Loading guide](https://nextjs.org/docs/app/guides/lazy-loading)

### Inferences
- Recommended wiring for this site, which already uses GSAP and Lenis:
  - Keep `gsap.ticker` as the master clock and have Lenis use `autoRaf:false` per the official recipe.
  - Mount the Canvas with `frameloop="never"` and, in a tiny component inside it, register `gsap.ticker.add((t) => advance(t * 1000 /* verify units: r3f advance expects a timestamp; test seconds vs ms */))`. Remove it on unmount.
  - When offscreen or under reduced motion, unregister that ticker callback instead of toggling `frameloop`.

  This keeps exactly one `requestAnimationFrame` loop for scroll, tweens, and WebGL. The units of `advance` aren't specified in the fetched r3f docs, and one third-party page says seconds ([tessl.io skill page](https://tessl.io/registry/skills/github/CloudAI-X/threejs-skills/threejs-react-three-fiber)), so verify in the installed `@react-three/fiber` 9.8.2 source before shipping.
- Scroll-driven 3D: have ScrollTrigger write `progress` to a ref or an `useRef`-backed object (`onUpdate: self => (scrollRef.current = self.progress)`), and lerp toward it in `useFrame` with `delta`. Don't tween three.js objects directly from scroll handlers that trigger React renders.
- Server/Client split:
  - Server: `page.tsx`, the hero text, the poster `<Image>`, and section content.
  - `'use client'`: `SmoothScrollProvider` (Lenis + GSAP), `CanvasGate` (capability and visibility checks plus `dynamic(..., {ssr:false})`), and the r3f scene modules.
  - Put a single persistent `<Canvas>` with `View.Port` in the root layout's client provider, so route changes don't recreate the WebGL context. Each section renders a `<View>` placeholder div.

### Gaps
- No official r3f or GSAP doc demonstrates `frameloop="never"` driven by `gsap.ticker`. The pattern is assembled from the APIs above.
- I didn't fetch GSAP docs on `gsap.matchMedia()` (reduced-motion conditional ScrollTriggers) or `ScrollTrigger.normalizeScroll`.

## 7. Real-world measurements: bundle sizes (three core, + r3f, + drei tree-shaken) and Lighthouse/CWV case studies

### Takeaway
I measured this myself in this session (esbuild 0.28.2, minified ESM, gzip -9). three@0.187.0 costs about 133 kB gz for a minimal WebGLRenderer + PhysicalMaterial scene and about 189 kB gz for the full namespace. r3f@9.8.2 pulls in essentially all of three plus react-reconciler, about 248 kB gz on top of React. A typical drei selection adds about 50 kB gz more. Plan for roughly **250–300 kB gz of deferred JS** for the 3D chunk, which is why it must be lazy and idle-loaded.

### Cited Findings
- My measurement, done in this session (method: `npm i three@0.187.0 @react-three/fiber@9.8.2 @react-three/drei@10.7.9 react@19.3.1 react-dom@19.3.1`, `esbuild --bundle --minify --format=esm --define:process.env.NODE_ENV="production"`, `gzip -9`). Package versions are from [npm three](https://www.npmjs.com/package/three), [npm @react-three/fiber](https://www.npmjs.com/package/@react-three/fiber), and [npm @react-three/drei](https://www.npmjs.com/package/@react-three/drei).

  | Entry | min | gzip |
  |---|---|---|
  | `export * from "three"` (whole library) | 749 kB | **189 kB** |
  | three minimal (WebGLRenderer + Scene + Mesh + BoxGeometry + MeshPhysicalMaterial) | 538 kB | **133 kB** |
  | React 19 + react-dom only (baseline) | 223 kB | 69 kB |
  | React + react-dom + r3f `<Canvas>` | 1,157 kB | 317 kB (about **248 kB over React**) |
  | above + drei {Float, Environment, Lightformer, RoundedBox, MeshTransmissionMaterial, PerformanceMonitor, View, useGLTF, ContactShadows} | 1,316 kB | 367 kB (about **+50 kB** for drei) |
  | detect-gpu 5.0.70 `getGPUTier` | 6.7 kB | 3.3 kB (benchmark JSON fetched separately) |

  Next.js's bundler (Turbopack or webpack) will differ somewhat. Brotli is typically a bit smaller than gzip -9.
- three.js forum figures for comparison: about 150 kB gz for the `three` entry at v0.143 (Bundlephobia), and one user's bundle grew 8 kB to "125.03 kB compressed" going from 0.180 to 0.181. — [three.js forum: Tree shaking](https://discourse.threejs.org/t/tree-shaking-three-js/1349?page=4); [three.js forum: 8kb gzipped size increase in 0.181.0](https://discourse.threejs.org/t/8kb-gzipped-size-increase-in-0-181-0-recommendation-on-tooling-to-analyze-package-size/87880)
- three.js CI tracks gzip size of `build/three.module.min.js` (read-size workflow). — [three.js read-size workflow](https://www.github.com/mrdoob/three.js/blob/ac1d2cfd49d795f654a200166d04323a4f987f53/.github/workflows/read-size.yml)
- Lighthouse case: a Next.js + r3f + drei hero had a lab TBT of 13,070 ms, and PageSpeed was about 51 after self-hosting the Draco decoders (Sept 2025). — [three.js forum thread](https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976)
- Search snippets mentioned a Next.js 16 portfolio reaching Lighthouse 100 with the hero avatar `<Image priority>` as the LCP element, and an r3f portfolio build of "~56 KB gzipped (excluding 3D assets)". I didn't open these pages, so they are unverified and the 56 KB figure likely excludes the lazy 3D chunk. — [DEV: How I built and optimised my portfolio to score 100 on Lighthouse](https://dev.to/xelabyte/how-i-built-and-optimised-my-portfolio-to-score-100-on-lighthouse-page-speed-insight-53pe)
- A March 2026 r3f portfolio showcase (multi-pass duotone and dither shaders, scroll-linked camera rig) reported no performance numbers. A commenter asked about low-end devices and got no answer. — [three.js forum: After Five Years: A New React Three Fiber Portfolio Build](https://discourse.threejs.org/t/after-five-years-a-new-react-three-fiber-portfolio-build/90146)

### Inferences
- r3f's `Canvas` imports the full three namespace for its JSX catalogue, so tree-shaking three under r3f yields little. My measured r3f+three chunk (about 248 kB) exceeds full three (189 kB) by about 59 kB, which is consistent with react-reconciler, zustand, and helpers. Selective drei named imports tree-shake well (about +50 kB for nine helpers). Avoid `MeshTransmissionMaterial` if not needed.
- Because this JS is deferred and the LCP element is the server-rendered text or poster, a well-built site can plausibly keep lab LCP and CLS unchanged. The risk lands in TBT/INP while the chunk parses and shaders compile. That's why mounting the scene in idle time, outside input handlers, matters.

### Gaps
- No field CWV (CrUX) case study comparing a portfolio before and after adding r3f, with poster-first and idle loading.
- Bundle sizes were not measured through Next.js 16 Turbopack specifically.
- No measured shader-compile time or first-frame latency on a mid-range Android device for a MeshPhysicalMaterial scene.
