# Real-time 3D stack for glossy "app icon" tiles in a Next.js 16 / React 19 portfolio (research date: 2026-11-26)

Method note: version and peer-dependency facts were pulled live from the npm registry on 2026-11-26 (`curl https://registry.npmjs.org/<pkg>`). Prop names were read from the published type definitions in the drei 10.7.9 and postprocessing 6.39.6 tarballs. Bundle sizes come from the Bundlephobia API on the same day. Doc pages and release notes were fetched with WebFetch. Anything I did not verify this session is marked "(prior knowledge, not re-verified)".

## 1. Current versions and compatibility (three, r3f, drei, postprocessing, rapier) with React 19 and Next.js 16 App Router

### Takeaway
The stable, mutually compatible set as of late Nov 2026 is three 0.187.0, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, @react-three/postprocessing 3.2.2 (with postprocessing 6.39.6), and @react-three/rapier 2.2.0. All of them require React 19. R3F v9 is confirmed as the React 19 line. One hard constraint: R3F 9.8.x declares `react >=19 <19.4`. R3F v10 is alpha only, is WebGPU-first, and should not be used for this site. In Next.js the canvas must live in a `"use client"` component, loaded with `next/dynamic(..., { ssr: false })` from another Client Component. The R3F docs recommend `transpilePackages: ['three']`.

### Cited Findings
**Versions (npm registry, fetched 2026-11-26)**
- three: latest **0.187.0** (r187), published 2026-10-30, with no peer deps. @types/three is 0.187.0, published 2026-10-30. — [npm three](https://www.npmjs.com/package/three); [npm @types/three](https://www.npmjs.com/package/@types/three)
- three's recent release cadence: r184 (16 Apr 2026), r185 (01 Jul), r186 (24 Sep), r187 (30 Oct). — [three.js releases](https://github.com/mrdoob/three.js/releases)
- @react-three/fiber: latest **9.8.2** (2026-10-14). Peers are `react >=19 <19.4`, `react-dom >=19 <19.4` and `three >=0.156`. The dist-tags also include `alpha: 10.0.0-alpha.6`. — [npm @react-three/fiber](https://www.npmjs.com/package/@react-three/fiber)
- R3F's React peer range has widened over time: `^19.0.0` up to 9.4.2 (2025-11-29), then `>=19 <19.3` from 9.5.0 to 9.7.0 (Dec 2025 to Jul 2026), then `>=19 <19.4` from 9.8.0 (2026-09-22). — [npm @react-three/fiber versions](https://www.npmjs.com/package/@react-three/fiber?activeTab=versions)
- react: latest **19.3.1** (2026-10-14). — [npm react](https://www.npmjs.com/package/react)
- next: latest **16.4.6** (2026-11-09). Canary is 16.5.0-canary.66. — [npm next](https://www.npmjs.com/package/next)
- @react-three/drei: latest **10.7.9** (2026-09-25). Peers are `react ^19`, `react-dom ^19`, `three >=0.159` and `@react-three/fiber ^9.0.0`. Its dependencies include `three-stdlib ^2.35.6`, `three-mesh-bvh ^0.8.3`, `troika-three-text`, `camera-controls ^3.1.0`, `maath ^0.10.8`, `detect-gpu`, `@use-gesture/react` and `@mediapipe/tasks-vision`. Drei 11 is alpha (`11.0.0-alpha.7`). — [npm @react-three/drei](https://www.npmjs.com/package/@react-three/drei)
- @react-three/postprocessing: latest **3.2.2** (2026-10-21). Peers are `react ^19.0.0`, `three >=0.156.0`, `postprocessing ^6.36.0` and `@react-three/fiber >=9.7.0`. It depends on `n8ao ^2.0.0`. — [npm @react-three/postprocessing](https://www.npmjs.com/package/@react-three/postprocessing)
- postprocessing (vanilla, by vanruesc): latest **6.39.6** (2026-11-01). Its peer is `three >= 0.168.0 < 0.188.0`, so it already caps at r187. v7 is beta (`7.0.0-beta.16`). — [npm postprocessing](https://www.npmjs.com/package/postprocessing)
- n8ao: latest 2.1.0 (2026-11-15). Peers are `three >=0.137` and `postprocessing >=6.30.0`. — [npm n8ao](https://www.npmjs.com/package/n8ao)
- @react-three/rapier: latest **2.2.0** (2025-11-03, about a year old). Peers are `react ^19`, `three >=0.159.0` and `@react-three/fiber ^9.0.4`. It depends on `@dimforge/rapier3d-compat 0.19.2`, pinned exactly, while upstream rapier3d-compat is now 0.21.0. — [npm @react-three/rapier](https://www.npmjs.com/package/@react-three/rapier); [npm @dimforge/rapier3d-compat](https://www.npmjs.com/package/@dimforge/rapier3d-compat)
- pmndrs' own current "lusion-connectors" example pins `three 0.186.1`, `@react-three/fiber 9.8.2`, `@react-three/drei 10.7.9`, `@react-three/postprocessing ^3.2.0`, `@react-three/rapier ^2.2.0` and `react/react-dom 19.2.9`, with vite ^8.3.4 and typescript ^7.0.2. This is a known-good combination maintained by pmndrs. — [pmndrs/examples lusion-connectors package.json](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors)

**Compatibility statements from the docs**
- "@react-three/fiber@8 pairs with react@18, @react-three/fiber@9 pairs with react@19." — [R3F installation docs](https://r3f.docs.pmnd.rs/getting-started/installation)
- Next.js "should work out of the box", but untranspiled three add-ons can break the build. For Next.js 13.1+, add `transpilePackages: ['three']` to `next.config`. The page says nothing about the App Router, `'use client'`, Turbopack or WebGPU. — [R3F installation docs](https://r3f.docs.pmnd.rs/getting-started/installation)
- Next.js docs, last updated 2026-03-10: "`ssr: false` option is not supported in Server Components. You will see an error if you try to use it in Server Components... Please move it into a Client Component." `next/dynamic` is described as a composite of `React.lazy()` and Suspense. — [Next.js lazy loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- Next.js 16 makes Turbopack the default for `next dev` and `next build`. Webpack is still available with `--webpack`. — [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16); [heise](https://heise.de/-10794114)

**R3F release notes relevant to React 19 and Next**
- v9.8.0 (22 Sep 2026) added "React 19.3.0 compatibility", though not all new React APIs are fully supported. It also fixed StrictMode issues with Canvas, and roots now gate on async renderers such as WebGPURenderer. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)
- v9.8.1 (24 Sep 2026): `<Activity>` works across the R3F and react-dom boundary, renderers are disposed correctly on unmount, and Canvas re-renders no longer reset runtime settings. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)
- v9.8.2 (15 Oct 2026): fixed portal memory leaks and made DPR follow display or zoom changes. It also fixed the TS JSX types so importing R3F no longer breaks unrelated React types, and removed objects now disappear immediately with `frameloop="demand"`. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)
- R3F v10 alpha.6 (17 Oct 2026), "Going WebGPU First": WebGPURenderer is the default and WebGL users switch to `@react-three/fiber/legacy`. `state.gl` becomes `state.renderer`, `usePostProcessing` is replaced by `useRenderPipeline`, TSL hooks move to `@react-three/tsl`, three >=0.185 is required, and multi-canvas uses a `primary` prop. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)

**Known issues found**
- Issue #3471 (Feb 2025): Next 15.1.7 with R3F 9.0.2 threw "Failed to load external module @react-three/fiber: TypeError: Cannot read properties of undefined (reading 'S')". The maintainer attributed it to React 18 being installed with R3F v9, which needs React 19. — [r3f issue #3471](https://github.com/pmndrs/react-three-fiber/issues/3471)
- A search for R3F problems specific to Next.js 16 with Turbopack found no matching thread. The hits were older Next 15 and React 19 reconciler issues (#3446, #3398) and Turbopack bugs unrelated to R3F. — [r3f #3446](https://github.com/pmndrs/react-three-fiber/issues/3446); [r3f #3398](https://github.com/pmndrs/react-three-fiber/issues/3398); [Vercel community Turbopack panic](https://community.vercel.com/t/turbopack-panic-dependency-tracking-disabled-invalidation-blocked-during-next-js-16-build/29706)

### Inferences
- Recommended pins: `three@0.187.0`, `@types/three@0.187.0`, `@react-three/fiber@9.8.2`, `@react-three/drei@10.7.9`, `@react-three/postprocessing@3.2.2`, `postprocessing@6.39.6`, and `@react-three/rapier@2.2.0` only if physics is wanted. Keep `react` and `react-dom` at 19.2.x or 19.3.x, never 19.4+, until R3F widens its peer range. Do not jump to three r188 until postprocessing lifts its `<0.188.0` cap.
- The Next.js App Router renders client code with Next's own vendored React canary, regardless of the installed `react` version (prior knowledge, not re-verified). R3F's reconciler is the usual source of "ReactCurrentOwner"-style breakages, so after any Next minor bump, smoke-test the canvas in both `next dev` (Turbopack) and `next build`. If something breaks, `next dev --webpack` isolates Turbopack as the cause.
- Pattern that satisfies the Next docs:
  - `app/page.tsx` stays a Server Component and renders `<HeroSceneLoader/>`.
  - `HeroSceneLoader.tsx` has `"use client"` and calls `const Scene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => <CssFallbackTiles/> })`.
  - `HeroScene.tsx` has `"use client"` and holds `<Canvas>`.
  - The existing CSS-faked tiles become the loading or poster fallback and the `prefers-reduced-motion` fallback.

### Gaps
- No official pmndrs or Vercel statement was found on Next 16 Turbopack plus R3F 9.8 specifically. Absence of reports is not proof of absence.
- I could not confirm whether `transpilePackages: ['three']` is still needed with Turbopack in Next 16. The R3F docs page has not been updated for it.

## 2. Which drei helpers produce the premium glossy-icon look, and how to put a glyph on a tile

### Takeaway
The premium look comes from four things: correct geometry (`RoundedBox` with high `smoothness`), a custom `<Environment>` built from `<Lightformer>` panels (a studio "softbox" reflection rather than a CDN preset), a clearcoat physical material, and grounded soft shadows (`ContactShadows` or `AccumulativeShadows`). Draw all tiles in one shared WebGL context through drei `<View>`. For the glyph, an extruded SVG (SVGLoader + ExtrudeGeometry, slightly raised and beveled) gives real depth. `Decal` or a texture is cheaper but flat.

### Cited Findings
**Prop surfaces, read from drei 10.7.9 type definitions**
- `RoundedBox` props: `args`, `radius`, `smoothness`, `bevelSegments`, `steps`, `creaseAngle`. — [drei RoundedBox.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/RoundedBox.d.ts); [drei docs RoundedBox](https://drei.docs.pmnd.rs/shapes/rounded-box)
- `Float` props: `speed`, `rotationIntensity`, `floatIntensity`, `floatingRange`, `enabled`, `autoInvalidate`. — [drei Float.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/Float.d.ts)
- `Lightformer` props: `form` (`'circle' | 'ring' | 'rect' | 'plane' | 'box'`), `intensity`, `color`, `scale`, `target`, `light`, `map`, `toneMapped`, `args`. — [drei Lightformer.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/Lightformer.d.ts)
- `Environment`: declarative children (for example Lightformers) render into the envmap. With `frames={Infinity}` "the envmap can be live", and it is cheap at low `resolution` (example: 256). `background` accepts `true`, `false` or `"only"`. The `preset` prop "is not meant to be used in production environments and may fail as it relies on CDNs", so self-host via `@pmndrs/assets`. — [drei Environment docs](https://drei.docs.pmnd.rs/staging/environment)
- `ContactShadows` props: `opacity`, `width`, `height`, `blur`, `near`, `far`, `smooth`, `resolution`, `frames`, `color`, `depthWrite`, `scale`. — [drei ContactShadows.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/ContactShadows.d.ts)
- `AccumulativeShadows` props include `frames`, `temporal`, `blend`, `limit`, `scale`, `resolution`, `colorBlend`, `alphaTest`, `opacity`, `color`, `toneMapped`. Its RandomizedLight child takes `amount`, `radius`, `ambient`, `bias`, `mapSize`, `size`, `near`, `far`. — [drei AccumulativeShadows.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/AccumulativeShadows.d.ts)
- `Decal` props: `mesh`, `map`, `position`, `rotation`, `scale`, `polygonOffsetFactor`, `depthTest`, `debug`, `children`. — [drei Decal.d.ts @10.7.9](https://unpkg.com/@react-three/drei@10.7.9/core/Decal.d.ts)
- `Text3D` props: `font` (required, typeface JSON), `bevelSegments`, `smooth`, `letterSpacing`, `lineHeight`, plus TextGeometry params. `Center` exposes `top`, `bottom`, `left`, `right`, `front`, `back`, `disableX/Y/Z`, `precise`, `cacheKey` and `onCentered`. — [drei Text3D.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/Text3D.d.ts); [drei Center.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/Center.d.ts)
- `Instances` props: `limit`, `range`, `frames`. — [drei Instances.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/Instances.d.ts)
- `Bvh` props: `enabled`, `firstHitOnly`, `strategy`, `maxDepth`, `maxLeafTris`, `indirect`, `verbose`, `setBoundingBox`. It accelerates raycasts for pointer hover. — [drei Bvh.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/Bvh.d.ts)
- `PerformanceMonitor` props: `ms`, `iterations`, `threshold`, `bounds`, `flipflops`, `factor`, `step`, `onIncline`, `onDecline`, `onChange`, `onFallback`. `AdaptiveDpr` takes `pixelated`. — [drei PerformanceMonitor.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/PerformanceMonitor.d.ts); [drei AdaptiveDpr.d.ts](https://unpkg.com/@react-three/drei@10.7.9/core/AdaptiveDpr.d.ts)
- `PresentationControls` (drag-to-rotate with spring snap-back) lives in drei's `web/` entry. — [drei PresentationControls.d.ts](https://unpkg.com/@react-three/drei@10.7.9/web/PresentationControls.d.ts)

**View (multiple page sections, one WebGL context)**
- "Views use gl.scissor to cut the viewport into segments". Many views share one canvas. Each `<View>` is an unstyled HTML element (a div by default) that sets the position and bounds of its viewport, and it follows that element as the page scrolls or resizes. — [drei View docs](https://drei.docs.pmnd.rs/portals/view)
- Setup: one `<Canvas eventSource={containerRef}>` renders `<View.Port/>`. The docs recommend making the event source a parent that contains both the canvas and the HTML, and having the canvas fill the screen with absolute positioning (fixed works too). Props are `index` (render order), `frames` (set to 1 for static views to avoid repeated `getBoundingClientRect` calls), `visible`, `as`, `id`, `className` and `style`. `track` is deprecated in favor of inline Views. — [drei View docs](https://drei.docs.pmnd.rs/portals/view); [drei View.d.ts](https://unpkg.com/@react-three/drei@10.7.9/web/View.d.ts)
- pmndrs demos: [view-tracking](https://pmndrs.github.io/examples/view-tracking) and [multiple-views-with-uniform-controls](https://pmndrs.github.io/examples/multiple-views-with-uniform-controls). — [R3F examples index](https://r3f.docs.pmnd.rs/getting-started/examples)

**MeshTransmissionMaterial (glass variant)**
- Props and defaults: `transmission` 1, `thickness` 0, `roughness` 0, `chromaticAberration` 0.03, `anisotropicBlur` 0.1, `samples` 6, `resolution` fullscreen, `backside` false, `transmissionSampler` false. — [drei MeshTransmissionMaterial](https://drei.docs.pmnd.rs/shaders/mesh-transmission-material)
- Cost: "it can still be expensive as it causes an additional render pass of the scene" per material. Lower `samples` and `resolution` help. With `roughness`, a buffer as small as 32x32 still looks good. `transmissionSampler`, or a shared `buffer`, avoids a separate render per material, but such materials can't see other transmissive objects. — [drei MeshTransmissionMaterial](https://drei.docs.pmnd.rs/shaders/mesh-transmission-material)

**three.js MeshPhysicalMaterial (r186 and r187 changes)**
- r186 added retroreflectivity and renamed the related terms. r187 added the EON rough diffuse BRDF and iridescence thickness min and max properties. r187 also excludes the deprecated `iridescenceThicknessRange` from the render object cache key, which implies that property is deprecated. r187 replaced PMREM's CubeUV atlas with cube render targets. — [three.js releases](https://github.com/mrdoob/three.js/releases)

### Inferences
- Recipe for one icon tile:
  - Geometry: `<RoundedBox args={[1,1,0.28]} radius={0.22} smoothness={8} bevelSegments={6} creaseAngle={0.4}>` (prior knowledge of what smoothness does, not re-verified).
  - Base material: `meshPhysicalMaterial` with a brand `color`, `roughness` 0.25–0.35, `metalness` 0, `clearcoat` 1 and `clearcoatRoughness` 0.05–0.1. Clearcoat is the "glossy app icon" lacquer, a sharp highlight over a softer base. Optionally add `iridescence` 0.2–0.4 for a holographic sheen on one or two tiles, or `sheen` for a satin look.
  - Glyph: a separate mesh from an extruded SVG, raised 0.02–0.04 above the face. Give it a contrasting or white, slightly emissive physical material so it reads at small sizes.
  - Lighting: a studio `<Environment resolution={256}>` made of 3–5 `Lightformer` `rect` softboxes (top key, two rim strips, one ring) gives the long specular streaks that define premium renders. The lusion-connectors code in section 5 is a concrete preset.
- Glyph options, ranked by realism:
  1. **SVG to ExtrudeGeometry.** Use three's `SVGLoader` (`three/examples/jsm/loaders/SVGLoader.js` or `three-stdlib`) and `SVGLoader.createShapes(path)`, then `new ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness, bevelSize, bevelSegments })`. Center it and flip Y, since SVG Y points down. This reuses the existing SVG glyphs, has real depth, and catches the env highlights. Build the geometry in a `useMemo` (prior knowledge of the SVGLoader API, not re-verified).
  2. **`Text3D` + `Center`** for brace and terminal glyphs like `{}` or `>_`. It needs a typeface.json font.
  3. **`Decal`** with an SVG or PNG texture projected onto the face. It is the cheapest, but flat, so use it only for small section-card tiles.
  4. A texture on a plane slightly in front of the face. Also flat.
- The database cylinder is better as a real `CylinderGeometry` stack, or a lathe with rounded rims, than as a glyph on a tile. The orbit tile can use `TorusGeometry` rings around a sphere.
- With about 10–16 meshes in total, `Instances` buys little because every tile has a different glyph geometry. Use it only if several identical tile bodies share a material. `Bvh` is cheap insurance for pointer raycasts against beveled meshes.
- Use one fixed full-viewport `<Canvas>` with `<View>`s placed in the hero and the section cards, rather than one `<Canvas>` per section. Browsers cap active WebGL contexts (prior knowledge: about 16 in Chrome, not re-verified), and `View` avoids duplicate GPU resources. Caveat: postprocessing (`EffectComposer`) does not compose cleanly per `View`. See gap below.
- `PerformanceMonitor` with `onDecline`, which lowers DPR or turns off AO and transmission, combined with `dpr={[1, 1.5]}` (the cap the pmndrs demo uses), is the right adaptive strategy for a portfolio.

### Gaps
- The drei View docs do not state how postprocessing interacts with Views. My prior knowledge, not re-verified, is that EffectComposer applies to the whole canvas, so per-view effects need custom work. Verify before planning N8AO in section cards.
- I did not fetch the individual drei doc pages for RoundedBox, Decal or Text3D. Only their type definitions were verified, so prop semantics and defaults are unconfirmed.

## 3. Postprocessing for realism: N8AO, SSAO, Bloom, ToneMapping, SMAA, chromatic aberration

### Takeaway
The high-payoff stack for glossy tiles is N8AO (ambient occlusion between tiles and glyph edges), AgX tone mapping (the default in @react-three/postprocessing's ToneMapping) and MSAA via `multisampling`, or SMAA. Subtle Bloom works only on emissive glyph accents. Chromatic aberration usually cheapens product shots, so skip it or keep it tiny.

### Cited Findings
- @react-three/postprocessing 3.2.2 bundles `n8ao ^2.0.0` and needs `postprocessing ^6.36.0` and R3F `>=9.7.0`. — [npm @react-three/postprocessing](https://www.npmjs.com/package/@react-three/postprocessing)
- The `ToneMapping` effect's `mode` defaults to `AGX`, and the example uses `ToneMappingMode.ACES_FILMIC`. — [react-postprocessing ToneMapping docs](https://react-postprocessing.docs.pmnd.rs/effects/tone-mapping)
- postprocessing 6.39.6's `ToneMappingMode` enum is `LINEAR 0, REINHARD 1, REINHARD2 2, REINHARD2_ADAPTIVE 3, UNCHARTED2 4, OPTIMIZED_CINEON/CINEON 5, ACES_FILMIC 6, AGX 7, NEUTRAL 8`. — [postprocessing 6.39.6 build/index.js](https://unpkg.com/postprocessing@6.39.6/build/index.js)
- The pmndrs lusion-connectors demo uses `<EffectComposer multisampling={8}><N8AO distanceFalloff={1} aoRadius={1} intensity={4} /></EffectComposer>` with `gl={{ antialias: false }}` and `dpr={[1, 1.5]}`. A code comment notes that `disableNormalPass` no longer exists and the normal pass is off by default. — [pmndrs lusion-connectors App.tsx](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors)

### Inferences
- Cost and payoff, as qualitative estimates (prior knowledge, not benchmarked this session):
  - N8AO is the biggest realism gain because tiles stop looking pasted on. It is a moderate cost and has half-resolution and quality modes.
  - AgX tone mapping is practically free and keeps saturated brand colors from clipping.
  - `multisampling={4..8}` on the composer gives better edges on rounded bevels than SMAA, at higher GPU cost. SMAA is the cheaper fallback when `PerformanceMonitor` declines.
  - Bloom is cheap at low `levels` with a `luminanceThreshold` near 1, so only emissive glyphs bloom.
  - ChromaticAberration and Noise are cheap but stylistic.
- If you use EffectComposer, its ToneMapping replaces the renderer's. In the R3F pattern you typically set `gl={{ toneMapping: THREE.NoToneMapping }}` or rely on the composer (prior knowledge, not re-verified, since the docs page did not mention it).

### Gaps
- I found no published ms-per-frame benchmarks for N8AO, Bloom or SMAA on a 2025–2026 reference device. The cost figures above are qualitative.

## 4. Physics: @react-three/rapier for draggable, throwable or magnetic tiles

### Takeaway
Rapier gives the "lusion connectors" feel with very little code: zero gravity, each body impulsed toward the origin every frame, and a kinematic ball collider following the cursor that pushes tiles away. The main cost is bundle size, about 844 kB gzipped because the WASM is inlined, so lazy-load it or fake the magnetism with springs.

### Cited Findings
- @react-three/rapier 2.2.0 (2025-11-03) depends on `@dimforge/rapier3d-compat 0.19.2`. — [npm @react-three/rapier](https://www.npmjs.com/package/@react-three/rapier)
- Bundlephobia reports @react-three/rapier@2.2.0 at 2,262,419 B minified and **843,736 B gzipped**. This includes the rapier3d-compat WASM inlined as base64. — [Bundlephobia @react-three/rapier](https://bundlephobia.com/package/@react-three/rapier@2.2.0)
- The lusion-connectors technique, from the actual source:
  - `<Physics gravity={[0,0,0]}>`.
  - Each `RigidBody` has `linearDamping={4}`, `angularDamping={1}`, `friction={0.1}` and `colliders={false}`, with custom `CuboidCollider`s.
  - In `useFrame`: `api.current.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2), false)`, a pull toward the center.
  - A `Pointer` `RigidBody type="kinematicPosition"` with `<BallCollider args={[1]} />` is moved each frame with `setNextKinematicTranslation(mouse.x*viewport.width/2, mouse.y*viewport.height/2, 0)`.
  - Colors animate with `maath` `easing.dampC`.
  — [pmndrs lusion-connectors App.tsx](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors); [live demo](https://pmndrs.github.io/examples/lusion-connectors)
- R3F v10 alpha changes "Physics runs on a fixed 1/60 s timestep". That is a v10 change, so it does not apply to 9.8.2. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)

### Inferences
- For 8 rounded-square tiles, use one `CuboidCollider` per tile matching the RoundedBox half-extents, for example `args={[0.5,0.5,0.14]}`. Simulation cost for about 10 bodies is negligible. The cost is entirely download and WASM init.
- Cheaper alternative with no physics engine: per-tile spring toward a home position, plus a repulsion term from the cursor's projected position, damped with `maath/easing` (`easing.damp3` for position, `easing.dampE` for rotation) inside `useFrame`. drei `Float` adds idle bobbing. This gets about 80% of the effect at about 0 kB extra, since maath is already a drei dependency. Drag and throw is the only feature that really needs Rapier.
- If you choose Rapier, load it with a second `dynamic(() => import(...), { ssr:false })` after first paint or on first pointer interaction, so the hero's LCP is not blocked by about 844 kB.

### Gaps
- @react-three/rapier has had no release since 2025-11-03, and it pins an older rapier core (0.19.2 against 0.21.0 upstream). I found no statement about its maintenance status. It works with R3F 9.8.2 per the pmndrs example.

## 5. WebGPU renderer (WebGPURenderer and TSL) status, and R3F support, as of late 2026

### Takeaway
three's WebGPURenderer (with automatic WebGL2 fallback) is broadly considered usable in production in 2026, now that Safari 26 ships WebGPU. In R3F, though, first-class WebGPU arrives with v10, which is still alpha (Oct 2026) and has breaking changes. It also changes the postprocessing model: `useRenderPipeline` and TSL replace the pmndrs EffectComposer, MeshTransmissionMaterial and N8AO stack. For this portfolio, stay on WebGLRenderer with R3F 9.8.x.

### Cited Findings
- three r185–r187 keep adding WebGPU features: WebXR with WebGPU and texture-array render targets in r185, `compileComputeAsync()`, `DirectRenderPipeline` and WebXR MSAA in r186, and parallel pipeline compilation in `compileAsync()` in r187. There are also TSL bug fixes. The release notes make no "production ready" statement. — [three.js releases](https://github.com/mrdoob/three.js/releases)
- WebGPU browser baseline per web.dev: Chrome/Edge 144, Firefox 141, Safari 26. Version numbers differ across localized revisions of the article. — [web.dev: WebGPU supported in major browsers](https://web.dev/blog/webgpu-supported-major-browsers?hl=en)
- "With WebGPU now supported on Safari, you can start using Three.js with TSL & WebGPURenderer in production. Unless you need to support older devices..." (Jan 2026, an educator newsletter, so secondary). — [Sensei Notes #01](https://buttondown.com/wawasensei/archive/sensei-notes-01-webgpu-is-ready-for-production)
- Firefox: stable on Windows since v141 (Jul 2025) and on macOS Tahoe 26 ARM64 since v145. Linux, Android and Intel Mac support is still tracking through 2026. This is from a vendor blog, so secondary. — [Utsubo WebGPU migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
- R3F v10 alpha.1 (Jan 2026) supported both renderers. alpha.4 (Aug 2026) added multi-canvas WebGPU sharing a single renderer and `useRenderPipeline`. alpha.6 (Oct 2026) made WebGPU the default, moved WebGL to `/legacy` and moved TSL hooks to `@react-three/tsl`. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)
- R3F 9.8.0 can already gate root configuration on async renderers such as WebGPURenderer, via the `gl` factory prop. — [R3F releases](https://github.com/pmndrs/react-three-fiber/releases)

### Inferences
- The visual quality of glossy tiles (PBR, clearcoat, env reflections) is the same under WebGL2 and WebGPU. WebGPU's advantages (compute, large instance counts) don't matter for about 16 meshes. Its drawbacks for this project are real: alpha R3F, a drei and postprocessing ecosystem built around GLSL and EffectComposer, and pipeline compile stutter. Decision: WebGL now, and revisit when R3F 10 is stable.

### Gaps
- I could not fetch the three.js manual page on WebGPURenderer (it returned 404 at the guessed URL), so I have no official three.js statement on production readiness or on fallback behavior.
- drei 11 (alpha.7) WebGPU compatibility was not investigated.

## 6. Spline (spline.design) as an alternative

### Takeaway
Spline is the fastest way to a designer-authored glossy scene, and `@splinetool/react-spline` has a Next.js entry with a server-rendered blurred placeholder. However, the runtime is about 281 kB gzipped on top of the scene file. Removing the watermark needs a paid plan, self-hosted export is Enterprise only, and you lose fine control over materials, View-sharing and performance tuning compared with a code-built R3F scene.

### Cited Findings
- @splinetool/react-spline is at 4.2.0 (2026-11-05). Peers are `next >=14.2.0`, `react *`, `react-dom *` and `@splinetool/runtime *`. Dependencies include `blurhash` and `thumbhash`. — [npm @splinetool/react-spline](https://www.npmjs.com/package/@splinetool/react-spline)
- @splinetool/runtime is at 2.0.222 (2026-11-25), with 36.5 MB unpacked. — [npm @splinetool/runtime](https://www.npmjs.com/package/@splinetool/runtime)
- Bundlephobia: @splinetool/runtime@2.0.222 is 1,002,792 B minified and **281,390 B gzipped**. @splinetool/react-spline@4.2.0 is 1,961 B gzipped. — [Bundlephobia @splinetool/runtime](https://bundlephobia.com/package/@splinetool/runtime@2.0.222); [Bundlephobia @splinetool/react-spline](https://bundlephobia.com/package/@splinetool/react-spline@4.2.0)
- The README says it "will render on the client only" by default. Importing from the Next.js entry (`@splinetool/react-spline/next`) server-renders "an autogenerated blurred placeholder". The README's prose and example disagree on the exact import path. Other README points:
  - It suggests `React.lazy` + Suspense.
  - API: `onLoad(splineApp)`, `findObjectByName`, `emitEvent` and `emitEventReverse`.
  - Props: `renderOnDemand` (default true) and `htmlContentMode` (`inline` or `sandbox`).
  - Self-hosting `.splinecode` is suggested for CORS issues.
  — [splinetool/react-spline README](https://github.com/splinetool/react-spline)
- Pricing (per seat): Free $0; Hobby $15/mo or $12/mo yearly; Pro $30/mo or $25/mo yearly; Max $70/mo or $60/mo yearly; Enterprise custom. Free web exports include a watermark and published scenes show a Spline logo. Hobby has "Web exports (3D)" with no watermark. Pro adds Download Code Export plus Apple and Android exports. **Self-Hosted Export is Enterprise only.** No view or bandwidth limits or commercial-use terms were listed. — [Spline pricing](https://spline.design/pricing)
- pmndrs has an example that loads Spline-authored shapes into R3F with transmission ("spline-glass-shapes"). — [pmndrs spline-glass-shapes](https://pmndrs.github.io/examples/spline-glass-shapes)

### Inferences
- A hybrid is possible: model the tiles in Spline, export them as GLB, and render them in R3F with your own materials and lighting. This avoids the about 281 kB runtime and the hosting and watermark constraints (prior knowledge that Spline supports GLB export, not re-verified on the pricing page). Spline's own runtime does not share a context with other canvases, so tiles across several sections would mean several Spline canvases, which is worse than a single R3F `View` canvas.

### Gaps
- Which plan unlocks GLB/GLTF export, and whether the hosted `prod.spline.design` scene URLs have bandwidth caps, was not stated on the pricing page.
- I did not measure the size of a typical `.splinecode` scene file. It varies per scene.

## 7. Bundle-size cost (gzipped) of three + r3f + drei subset

### Takeaway
A realistic tree-shaken client chunk for three, R3F and the drei pieces this site needs, plus postprocessing with N8AO, is roughly 300–450 kB gzipped by my estimate. three dominates at about 186 kB for the full package. Bundlephobia's drei figure (521 kB) is the whole package, not what a few named imports pull in. Rapier would add about 844 kB.

### Cited Findings (Bundlephobia, full-package min+gzip, fetched 2026-11-26)
- three@0.187.0: 742,263 B minified and **185,679 B gzipped**. — [Bundlephobia three](https://bundlephobia.com/package/three@0.187.0)
- @react-three/fiber@9.8.2: 182,891 B minified and **57,672 B gzipped**. — [Bundlephobia r3f](https://bundlephobia.com/package/@react-three/fiber@9.8.2)
- @react-three/drei@10.7.9: 1,680,394 B minified and **521,499 B gzipped** for the whole package. Its dependencies include mediapipe, hls.js and troika-three-text. — [Bundlephobia drei](https://bundlephobia.com/package/@react-three/drei@10.7.9)
- @react-three/postprocessing@3.2.2: **104,928 B gzipped**, which includes n8ao. postprocessing@6.39.6: **112,598 B gzipped**. — [Bundlephobia @react-three/postprocessing](https://bundlephobia.com/package/@react-three/postprocessing@3.2.2); [Bundlephobia postprocessing](https://bundlephobia.com/package/postprocessing@6.39.6)
- @react-three/rapier@2.2.0: **843,736 B gzipped**. — [Bundlephobia rapier](https://bundlephobia.com/package/@react-three/rapier@2.2.0)
- @splinetool/runtime@2.0.222: **281,390 B gzipped**, for comparison. — [Bundlephobia Spline runtime](https://bundlephobia.com/package/@splinetool/runtime@2.0.222)

### Inferences
- three's core does not tree-shake much (prior knowledge), so expect about 150–185 kB for three no matter what. R3F adds about 58 kB. A drei subset (RoundedBox, Environment, Lightformer, ContactShadows, Float, View, PerformanceMonitor) should be tens of kB, not 521 kB, because drei ships per-component ESM. postprocessing with N8AO adds about 100–150 kB. These are estimates. Measure with `@next/bundle-analyzer` or Turbopack's analyzer after integrating.
- Because everything sits behind `dynamic(..., { ssr:false })`, none of it is in the initial route JS. It loads in parallel after hydration while the CSS tile fallback is visible.

### Gaps
- No measured tree-shaken size for a drei subset was available from Bundlephobia. Its "export sizes" view was not queried.

## 8. Concrete pmndrs examples closest to "floating glossy icons reacting to cursor"

### Takeaway
The closest matches are lusion-connectors (cursor-repelled glossy physics objects with N8AO and Lightformer env), the floating-* demos (Float plus env), view-tracking (one canvas spread across DOM sections), and baking-soft-shadows (AccumulativeShadows). None renders app-icon tiles directly.

### Cited Findings
- Examples index (demos at `https://pmndrs.github.io/examples/<name>`). — [R3F examples page](https://r3f.docs.pmnd.rs/getting-started/examples)
  - **Lusion connectors**: [demo](https://pmndrs.github.io/examples/lusion-connectors), [source](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors). Tags: lusion, n8ao.
  - Floating: [floating-instanced-shoes](https://pmndrs.github.io/examples/floating-instanced-shoes), [floating-diamonds](https://pmndrs.github.io/examples/floating-diamonds), [floating-laptop](https://pmndrs.github.io/examples/floating-laptop).
  - Glass and transmission: [glass-flower](https://pmndrs.github.io/examples/glass-flower), [frosted-glass](https://pmndrs.github.io/examples/frosted-glass), [spline-glass-shapes](https://pmndrs.github.io/examples/spline-glass-shapes).
  - Environments: [building-live-envmaps](https://pmndrs.github.io/examples/building-live-envmaps), [building-dynamic-envmaps](https://pmndrs.github.io/examples/building-dynamic-envmaps), [envmap-ground-projection](https://pmndrs.github.io/examples/envmap-ground-projection).
  - Multi-section: [view-tracking](https://pmndrs.github.io/examples/view-tracking), [multiple-views-with-uniform-controls](https://pmndrs.github.io/examples/multiple-views-with-uniform-controls).
  - Shadows: [baking-soft-shadows](https://pmndrs.github.io/examples/baking-soft-shadows).
  - Rounded corners: [cards-with-border-radius](https://pmndrs.github.io/examples/cards-with-border-radius).
  - Physics: [basic-ballpit](https://pmndrs.github.io/examples/basic-ballpit).
- Lusion-connectors scene settings from the source:
  - Camera: `camera={{ position:[0,0,15], fov:17.5, near:1, far:20 }}`. The narrow FOV gives a flattened, product-photo perspective.
  - Lights: `ambientLight intensity={0.4*Math.PI}`, plus `spotLight position=[10,10,10] angle=0.15 penumbra=1 intensity=Math.PI decay=0 castShadow`.
  - Environment: `<Environment resolution={256}>` containing a rotated group of 4 `Lightformer form="circle"` (intensities 4, 2, 2, 2; scales 2, 2, 2, 8).
  - Materials: `meshStandardMaterial` with roughness 0.1 or 0.75 and metalness 0.2. The single glass piece uses `MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512}`.
  - Accent pieces carry a small `pointLight distance={2.5}` in their accent color.
  — [lusion-connectors App.tsx](https://github.com/pmndrs/examples/tree/main/examples/lusion-connectors)

### Inferences
- Fastest path for the hero: fork lusion-connectors, then:
  - replace the GLB connector with `RoundedBox` tiles plus extruded SVG glyphs;
  - switch `meshStandardMaterial` to `meshPhysicalMaterial` with clearcoat;
  - swap the circle Lightformers for rect softboxes;
  - add `ContactShadows` or a baked `AccumulativeShadows` plane;
  - keep N8AO and add `ToneMapping` (AgX);
  - optionally drop Rapier for spring and repulsion code to save about 844 kB.
- For section cards, mount the same tile component in drei `<View>` elements inside each card, with `frames={1}` when static, rendered by the single fixed canvas.

### Gaps
- None of the listed pmndrs examples renders literal app-icon tiles. The "icons" query returned nothing.
- The demos' links to editable CodeSandbox versions were not confirmed. GitHub source under `pmndrs/examples/examples/<name>` was confirmed for lusion-connectors only.
