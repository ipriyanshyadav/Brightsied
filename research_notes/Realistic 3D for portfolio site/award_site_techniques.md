# Award-Site Techniques for Realistic 3D Objects and Premium Interactivity (2024–2026)

Research date: 2026-11-26. Method note: Codrops (tympanus.net) returned HTTP 403 to every direct fetch, including with a browser user agent, so all Codrops facts below come from search-result summaries and article titles, not full-text reads. They are marked "(Codrops, via search summary)". Facts marked "(verified, primary)" were read directly from the cited page or source code.

## 1. Which award-winning sites (2024–2026) feature realistic 3D objects, and what tech did they use?

### Takeaway
The top annual winners from 2024 and 2025 (Igloo Inc, Lando Norris, Messenger) are all real-time WebGL builds, mostly on plain Three.js, with assets made in Houdini or Blender and compressed with Draco and KTX2. None of them uses Spline or pre-rendered video for the hero. The closest open-source match for a "cluster of floating glossy objects" is pmndrs' `lusion-connectors` example: R3F with Rapier physics at zero gravity, an environment built from Lightformers, transmission material and N8AO ambient occlusion.

### Cited Findings

**Annual winners and award dates**
- Igloo Inc (by abeto with Bureaux) won Awwwards Site of the Year 2024 and Developer Site of the Year 2024. Awwwards announced the annual winners in March 2025. — [Awwwards on X](https://x.com/awwwards/status/1901665664332435526); [abeto on X](https://x.com/abeto_co/status/1900152588768579701?lang=en); [Awwwards SOTY 2024](https://www.awwwards.com/annual-awards-2024/site-of-the-year); [Awwwards Dev SOTY 2024](https://awwwards.com/annual-awards-2024/developer-site-of-the-year)
- Lusion v3 won Awwwards Site of the Year and Developer Site of the Year for 2023, not 2024. — [Awwwards Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/) (via search summary); [Awwwards inspiration: Lusion v3](https://www.awwwards.com/inspiration/home-page-lusion-v3)
- **Awwwards Annual Awards 2025:** Site of the Year went to the Lando Norris site by OFF+BRAND (43 votes). Developer Site of the Year went to Messenger by abeto (54 votes). Users' Choice also went to Lando Norris (596 votes). — [Awwwards Annual Awards winners](https://www.awwwards.com/annual-awards/winners) (via search summary). A third-party blog calls Messenger "Site of the Year 2025", which conflicts with this. Awwwards' own page is the authority. — [Spinx Digital](https://www.spinxdigital.com/blog/best-website-design/)
- Messenger by abeto is described on Awwwards as "a small planet, but someone's gotta make the deliveries". It received SOTD and the Developer Award. — [Awwwards: Messenger](https://www.awwwards.com/sites/messenger) (via search summary). I found no case study for it.

**Igloo Inc (SOTY 2024) — how it was built (verified, primary: Awwwards case study)** — [Awwwards Igloo Inc case study](https://awwwards.com/igloo-inc-case-study.html)
- Stack: Three.js, three-mesh-bvh, Svelte, GSAP, Vite and vanilla JS. 3D and textures were made in Houdini and Blender. Sound was edited in DaVinci Resolve.
- The team built custom in-browser tools to hot-update shaders, textures and models: "Iterating directly in the browser makes it easier to explore options and prototype effects."
- Each project sits inside a procedurally generated ice block: "we wrote a custom algorithm that mimicked the growth of ice crystals inside a container." Chromatic aberration is applied to some materials.
- The links section uses a particle simulation that morphs between shapes. Particles change colour with speed and glow while they shift. A custom exporter converts VDB volume data to a compressed browser format that is "smaller than a typical website image".
- The UI itself is rendered in WebGL. Text scrambles shift the offset of an SDF texture ("By using WebGL, we can change letters by simply adjusting the offset of the SDF texture"), which avoids DOM style recalculation. Glitch effects are shaders, not CSS clip or mask.
- Scene transitions combine chromatic aberration, "tech displacement" and a frost effect. The intro is rendered in real time with code and shaders instead of video.
- Performance work: custom geometry exporters, and shader compilation plus texture upload during the initial load and in the background. Sound was synced to particle movement.

**Lando Norris (SOTY 2025) — how it was built**
- The official OFF+BRAND page lists WebGL, 3D, Rive, Motion and Webflow as services. It mentions "cinematic scrolling" and says "Custom animations and transitions bring Lando's story to life without sacrificing speed". It does not name Three.js. Awards listed: Awwwards SOTY, SOTM and SOTD; FWA of the Day; CSSDA of the Month and of the Day. — [OFF+BRAND case study](https://www.itsoffbrand.com/our-work/lando-norris) (verified, primary)
- Third-party teardowns (not official): Three.js r174 on Webflow with no front-end framework, Lenis smooth scroll, a real-time helmet (opening as wireframe), a race-track model and a lighting map. Models are compressed with Draco and KTX2, scroll uses GSAP ScrollTrigger, and Rive handles 2D motion (more than 200 Rive references). — [Dappasol: best Three.js websites](https://dappasol.com/guides/best-threejs-websites/); [Dappasol: 3D website examples](https://dappasol.com/guides/3d-website-examples/) (via search summary)
- An unofficial GitHub mirror lists KTX2/WebP helmet and glass textures, GLB models and HDRI environment maps. — [GitHub mirror](https://github.com/nachitzaid/lando-noris) (via search summary; unofficial)
- WebGPU.com lists the site in its showcase, dated 2026-01-09. — [webgpu.com showcase](https://webgpu.com/showcase/mclaren-f1-driver-lando-norris-official-website/)

**Bruno Simon folio-2025 (verified, primary: Awwwards case study dated 2026-03-11)** — [Awwwards: Bruno's portfolio case study](https://www.awwwards.com/brunos-portfolio-case-study.html)
- Three.js with TSL. "thanks to TSL, the Three.js shading language, the experience automatically runs on WebGPU when available."
- The world is built in Blender, and object names drive behaviour. For example, "refLandingPhysicalFixed" becomes a fixed physics body exposed to JS as "landing". Empties define collision shapes, respawn points and area bounds.
- Models use Draco compression. Textures use ETC1S/UASTC (KTX2/Basis).
- The vehicle feel comes from simulated springs, hydraulics, tire friction and engine noise.
- Sound: spatialised object sounds (anvil, oven, bowling pins) and ambient birds, wind and thunder. The UI uses a single click sample played at varied playback rates.
- Mobile preset: water blur and depth of field are disabled, and shadow-map resolution is reduced.
- Source code is MIT-licensed. — [github.com/brunosimon/folio-2025](https://github.com/brunosimon/folio-2025)
- A secondary source names Rapier for physics and Howler.js for audio. The Awwwards case study names neither. — [GeekNews (Korean)](https://news.hada.io/topic?id=24963)

**The Lusion "connectors" floating-object cluster (verified, primary: source code)** — [pmndrs/examples lusion-connectors App.tsx](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx); [live demo](https://pmndrs.github.io/examples/lusion-connectors). The code credits [Lusion's tweet](https://twitter.com/lusionltd/status/1701534187545636964) and [lusion.co](https://lusion.co).
- Libraries: `@react-three/fiber`; `@react-three/drei` (`MeshTransmissionMaterial`, `Environment`, `Lightformer`, `useGLTF`); `@react-three/rapier` (`Physics`, `RigidBody`, `BallCollider`, `CuboidCollider`); `@react-three/postprocessing` (`EffectComposer`, `N8AO`); `maath/easing`.
- **Physics cluster:** `<Physics gravity={[0,0,0]}>`. Every frame, each body gets an impulse toward the origin: `applyImpulse(translation().negate().multiplyScalar(0.2))`. Bodies use `linearDamping={4}` and `angularDamping={1}`, and compound `CuboidCollider`s match the shape.
- **Pointer repulsion:** a `kinematicPosition` RigidBody with a `BallCollider args={[1]}` follows the mouse through `setNextKinematicTranslation(mouse.x*viewport.width/2, mouse.y*viewport.height/2, 0)`, so objects get shoved aside physically.
- **Lighting:** a custom `<Environment resolution={256}>` built only from four circular `<Lightformer>`s (intensity 2–4). These act as studio softboxes that give the crisp, readable highlights. There is also a low ambient light and a shadow-casting spotlight (`angle 0.15, penumbra 1`), plus a small `pointLight` inside each accent-coloured object.
- **Materials:** `meshStandardMaterial` with `metalness 0.2` and a deliberate mix of `roughness 0.1` (glossy) and `0.75` (matte) per object. One glass piece uses `MeshTransmissionMaterial` (`clearcoat 1, thickness 0.1, anisotropicBlur 0.1, chromaticAberration 0.1, samples 8, resolution 512`).
- **Ambient occlusion:** `<N8AO aoRadius={1} intensity={4} distanceFalloff={1}>` with `multisampling={8}` and `gl={{antialias:false}}`. The canvas uses `dpr={[1,1.5]}`, and the camera uses a narrow `fov 17.5`, which gives a telephoto product-shot look.
- Click cycles the accent palette, and colours ease with `easing.dampC(color, target, 0.2, delta)`.

**Other showcase examples (pmndrs gallery, hosted demos)** — [R3F examples index](https://r3f.docs.pmnd.rs/getting-started/examples) (verified, primary)
- Floating objects: [floating-diamonds](https://pmndrs.github.io/examples/floating-diamonds), [floating-instanced-shoes](https://pmndrs.github.io/examples/floating-instanced-shoes), [floating-laptop](https://pmndrs.github.io/examples/floating-laptop)
- Glass: [glass-flower](https://pmndrs.github.io/examples/glass-flower), [frosted-glass](https://pmndrs.github.io/examples/frosted-glass), [spline-glass-shapes](https://pmndrs.github.io/examples/spline-glass-shapes)
- Physics: [rapier-physics](https://pmndrs.github.io/examples/rapier-physics), [ssgi-spheres-with-rapier-physics](https://pmndrs.github.io/examples/ssgi-spheres-with-rapier-physics)
- Environments: [building-live-envmaps](https://pmndrs.github.io/examples/building-live-envmaps), [environment-blur-and-transitions](https://pmndrs.github.io/examples/environment-blur-and-transitions)
- Shadows: [soft-shadows](https://pmndrs.github.io/examples/soft-shadows), [baking-soft-shadows](https://pmndrs.github.io/examples/baking-soft-shadows)

**Portfolio case studies 2025–2026 (Codrops, via search summary)**
- Stefan Vitasović Portfolio 2025: React Three Fiber, shader effects and a WebGL video grid. — [Codrops 2025-03-05](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
- Stas Bondar (stabondar.com): GSAP, Three.js and physics-based effects. — [Codrops case-study tag](https://tympanus.net/codrops/tag/case-study/page/6/)
- Roman Jean-Elie Portfolio '25: Next.js, R3F, GSAP (MorphSVG) and a "MeshPortal" technique. — [Codrops 2025-11-27](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)
- "Sketching the Impossible": an award-winning 3D portfolio built with no 3D models, on React 19 + R3F 9 + Three.js 0.182 (same React major as this project). — [Codrops 2026-06-11](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)
- Jordan Breton's floating-island portfolio won FWA Site of the Day on 2025-10-02. — [Codrops search summary](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/) (the attribution in the summary is ambiguous; verify on thefwa.com)
- Gianluca Gradogna Portfolio '25. — [Codrops 2025-01-21](https://tympanus.net/codrops/2025/01/21/the-journey-of-creating-a-3d-portfolio/)
- Lusion studio profile (Oryzo AI, Porsche: Dream Machine). — [Codrops 2026-04-13](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
- Lusion's own write-up on their prototyping-to-production workflow mentions storing SDF volume data (128³ voxels) in a PNG for collisions. — [Lusion on Medium](https://medium.com/lusion-ltd/from-concept-prototyping-to-production-in-a-creative-studio-f2083e96c4b9) (via search summary)

**14islands r3f-scroll-rig in production (verified, primary: README)** — [github.com/14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)
- The README lists these sites as built with it: 14islands.com, Pluto.app, Myriad.video, Neko Health, Playgoals.com, Metamask Learn, Cartier 365 and others.

### Inferences
- The premium winners render their 3D live rather than faking it. Their realism comes from authored assets (Houdini/Blender), compressed delivery (Draco, KTX2) and a carefully staged environment, not from a "3D builder" tool. For a Next.js 16 + React 19 portfolio, the closest-fit stack is R3F 9 + drei + `@react-three/rapier` + `@react-three/postprocessing`, which is the stack "Sketching the Impossible" reports and the stack the `lusion-connectors` example uses.
- The hero icon cluster maps almost one-to-one onto `lusion-connectors`. Swap the connector GLB for rounded-box "app icon" tiles (drei `RoundedBox` or a Blender-modelled tile with an embossed glyph). Keep zero-gravity attraction plus a kinematic pointer ball, and keep the mix of glossy and matte roughness values.
- Spline is used for individual Awwwards "elements", but I found no 2024–2026 annual winner whose hero runs on Spline. Spline is useful for prototyping. Custom R3F is what the winners ship.

### Gaps
- Codrops full texts could not be read (HTTP 403), so the stack details for Stefan Vitasović, Stas Bondar, Roman Jean-Elie and "Sketching the Impossible" come only from summaries.
- I found no technical case study for Messenger (abeto, Dev SOTY 2025) or for Lusion v3's implementation.
- There is no official confirmation that the Lando Norris site uses Three.js. Only third-party teardowns say so.
- I did not verify FWA or CSSDA archive dates directly.

## 2. Interaction patterns that make objects feel physical and alive

### Takeaway
"Alive" comes from motion that has momentum and is never instant. The main tools are damped springs and lerps (maath `easing.damp*`, `gsap.quickTo`), real rigid-body physics for clusters (Rapier with a kinematic pointer collider), inertia on release (GSAP InertiaPlugin, now free), and restrained sound (one click sample at varied pitch). All of GSAP, including SplitText and InertiaPlugin, has been free since GSAP 3.13 (around April 2025).

### Cited Findings
- **Physics push-and-pull:** Rapier at zero gravity, a centre-seeking impulse each frame, damping, and a kinematic `BallCollider` that tracks the pointer (code in §1). — [lusion-connectors source](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx) (verified, primary)
- **Rapier** is a fast, lightweight WebAssembly physics engine that handles gravity, rigid-body dynamics and collisions. A Codrops 2025 tutorial uses it with R3F. — [Codrops 2025-05-28](https://tympanus.net/codrops/2025/05/28/building-a-physics-based-character-controller-with-the-help-of-ai/) (via search summary)
- **Drag and swing:** Vercel's 3D event badge maps the pointer into 3D space and uses Rapier rigid bodies with joints to build a draggable lanyard. — [Vercel blog](https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber) (via search summary)
- **Colour and property damping:** `easing.dampC(material.color, target, 0.2, delta)` from `maath` is used in `useFrame` for frame-rate-independent smoothing. — [lusion-connectors source](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx) (verified, primary)
- **InertiaPlugin:** glides any numeric property to a stop from an initial velocity, with `min`/`max`, `end` snap arrays or functions. `InertiaPlugin.track(target, props)` measures velocity so later tweens can omit it; start tracking at least 0.5 s before tweening. Draggable enables it with `inertia: true`. — [GSAP InertiaPlugin docs](https://gsap.com/docs/v3/Plugins/InertiaPlugin/) (verified, primary; that page still carries the old "Club GreenSock" wording)
- **GSAP is free:** Webflow made GSAP 100% free. GSAP 3.13 release notes say the formerly Club-only plugins (SplitText, MorphSVG and the rest) are free and included in the main npm package. SplitText was rewritten in 3.13. — [Webflow blog](https://webflow.com/blog/gsap-becomes-free); [GSAP 3.13 release notes](https://gsap.com/blog/3-13/)
- **quickTo for pointer-driven motion:** `gsap.quickTo()` is designed for properties that update on every mouse event, so it retargets without creating a new tween each time. GreenSock's official custom-cursor demo uses it with a 0.3 s power3 ease. — [GreenSock CodePen: Custom Cursor with quickTo](https://codepen.io/GreenSock/pen/dyjywaZ); [GreenSock CodePen: magnetic button](https://codepen.io/GreenSock/pen/MWRPXMr)
- **Magnetic buttons:** take the cursor offset from the element centre and move the element by a factor of about 0.2–0.4. Use `elastic.out(1, 0.3)` or `expo.out` for the snap-back, keep to 3–6 magnetic elements per page, skip the effect under `prefers-reduced-motion`, and treat it as desktop-only. — [Olivier Larose: magnetic button](https://blog.olivierlarose.com/tutorials/magnetic-button); [annnimate magnetic-button pattern](https://annnimate.com/patterns/magnetic-button); [Craft UI Magnetic](https://yogendrarana-craftdotui.mintlify.app/components/craftui/magnetic) (via search summary; third-party)
- **Sound design:** Bruno Simon uses one UI click sample with varied playback rate, plus spatialised object sounds. Igloo Inc synced music and SFX to particle motion. — [Awwwards: Bruno case study](https://www.awwwards.com/brunos-portfolio-case-study.html); [Awwwards: Igloo case study](https://awwwards.com/igloo-inc-case-study.html) (verified, primary)
- **Idle motion:** drei ships a `Float` staging helper for idle bobbing and rotation. — [drei ContactShadows page (related staging list)](https://drei.docs.pmnd.rs/staging/contact-shadows) (verified, primary; listed only, props not read)
- **Igloo Inc:** a jury member praised its "attention to detail, micro-interactions, and effects". — [Awwwards Dev SOTY 2024](https://awwwards.com/annual-awards-2024/developer-site-of-the-year) (via search summary)

### Inferences
- **Hero tiles:** use real physics (Rapier) rather than CSS spring tilt. A kinematic pointer collider gives a "shove" that CSS perspective can't.
- **Tiles inside section cards:** a cheaper option is `useFrame` with `easing.damp3` toward a pointer-derived rotation, wrapped in drei `Float`. This keeps a damped tilt with overshoot and idle breathing without a full physics world per card.
- **Scroll-velocity reactions:** read `lenis.velocity` (or ScrollTrigger `getVelocity()`) each frame and feed it, damped, into tile rotation, stretch or shader uniforms. This is a standard pattern, but no fetched source documented it specifically.
- **Pinned statement where icons fly into the pipeline card:** a ScrollTrigger-scrubbed timeline can tween the 3D tiles' positions toward the projected screen-space position of the card's DOM rect. That rect is available through drei `View` or a scroll-rig tracker (§3). An alternative is GSAP Flip on DOM icons, with matching 3D tiles swapped in at the start and end.

### Gaps
- I did not fetch dedicated sources for page-transition morphs (for example the View Transitions API or Barba) beyond Igloo's shader transitions. A Codrops tutorial using Barba.js exists ([Codrops 2026-02-02](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)) but was not read.
- I found no primary source on framer-motion or react-spring use on award sites for 2024–2026.

## 3. Scroll-driven 3D storytelling and HTML/WebGL sync

### Takeaway
There are two proven patterns. (a) One persistent full-screen canvas whose 3D objects are glued to DOM placeholder elements: drei `View` (scissor viewports) or 14islands r3f-scroll-rig (Lenis + trackers). (b) A GSAP ScrollTrigger timeline that scrubs camera and object transforms, sometimes along a camera path authored in Blender. Apple-style pages use a third approach: a pre-rendered image sequence drawn to a sticky canvas.

### Cited Findings
- **drei `View`:** "Views use gl.scissor to cut the viewport into segments. You tie a view to a tracking div which then controls the position and bounds of the viewport." This gives several scenes in one performant canvas. Use `<View.Port />` inside the Canvas and set `eventSource` to a parent that contains both the canvas and the HTML. Requires R3F newer than `^8.1.0`. The canvas should cover the screen with absolute positioning. The `track` prop is deprecated in favour of inline Views. — [drei View docs](https://drei.docs.pmnd.rs/portals/view) (verified, primary)
- **r3f-scroll-rig (14islands):** `GlobalCanvas` stays mounted across routes, which avoids the WebGL context limit. `UseCanvas` tunnels children into it. `ScrollScene` renders a mesh at a DOM placeholder's position and scale. `ViewportScrollScene` gives each item its own camera, lights and envmap. `useTracker` is the low-level hook. `SmoothScrollbar` uses Lenis so WebGL and DOM stay in sync, measuring positions on mount and updating through IntersectionObserver and ResizeObserver. Caveats: the README shows the Pages-Router `_app` pattern (adaptation needed for the App Router), `globalRender` must be disabled when using postprocessing, and `reflow()` must be called after layout shifts. — [r3f-scroll-rig README](https://github.com/14islands/r3f-scroll-rig) (verified, primary)
- A Codrops tutorial on r3f-scroll-rig exists. — [deepwiki: 14islands/codrops-scroll-rig-tutorial](https://deepwiki.com/14islands/codrops-scroll-rig-tutorial) (via search summary)
- **Cinematic 3D scroll:** Codrops' "How to Build Cinematic 3D Scroll Experiences with GSAP" (2025-11-19) uses ScrollTrigger, ScrollSmoother and SplitText to coordinate an R3F/drei scene with a scroll-driven camera timeline. Demos are on GitHub. — [Codrops](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/); [GitHub demos](https://github.com/JosephASG/codrops-cinematic-scroll-animations) (via search summary)
- **Blender camera path:** a Codrops tutorial (2026-07-07) authors the camera path in Blender, renders it in Three.js and smooths the motion with GSAP Observer + `gsap.quickTo()`. — [Codrops](https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/) (via search summary)
- **Base pattern:** a GSAP timeline with ScrollTrigger and `scrub: true` drives Three.js transforms, as in the folding-box tutorial. — [Codrops 2022-12-13](https://tympanus.net/codrops/2022/12/13/how-to-code-an-on-scroll-folding-3d-cardboard-box-animation-with-three-js-and-gsap/)
- **drei ScrollControls examples:** [scrollcontrols-gltf](https://pmndrs.github.io/examples/scrollcontrols-gltf), [camera-scroll](https://pmndrs.github.io/examples/camera-scroll), [scrollcontrols-and-lens-refraction](https://pmndrs.github.io/examples/scrollcontrols-and-lens-refraction), [view-tracking](https://pmndrs.github.io/examples/view-tracking). — [R3F examples index](https://r3f.docs.pmnd.rs/getting-started/examples) (verified, primary)
- **Lando Norris:** Lenis plus GSAP ScrollTrigger driving a Three.js scene on Webflow. — [Dappasol](https://dappasol.com/guides/3d-website-examples/) (third-party)
- **Apple-style image sequence:** convert scroll progress to a frame index and `drawImage` that frame on a canvas, using a fixed or sticky canvas and an oversized scroll container. ScrollTrigger supplies the progress. Apple's own code is custom, and its CSS has `image-sequence` and `sequence-container` classes. — [CSS-Tricks](https://css-tricks.com/?p=308477); [GSAP forum: AirPods sequence](https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/); [Apple CSS](https://www.apple.com/v/airpods-pro/c/built/styles/overview.built.css)

### Inferences
- **Which pattern fits this portfolio:** with Lenis and ScrollTrigger already present, drei `View` is the lowest-friction way to put real 3D tiles inside section cards, the case-study window and the footer wordmark. Mount one fixed `<Canvas eventSource={rootRef}>` in the root layout and place `<View>`s inside each card. Each View can have its own camera and Environment.
- **Keeping it in sync:** Lenis should drive ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, with `gsap.ticker` driving `lenis.raf`) so DOM, ScrollTrigger and R3F read the same scroll value each frame.
- **Image sequences:** worth it only for a hero "product turn" that must look offline-rendered, for example a Blender Cycles render of an icon cluster assembling. The cost is many megabytes of frames and no interactivity. Live R3F is more "alive" and matches what the winners chose.

### Gaps
- I did not verify r3f-scroll-rig compatibility with React 19 or the Next.js App Router; the README states no versions. Check `package.json` peer dependencies before adopting it.
- I found no fetched source documenting the exact Lenis-to-ScrollTrigger glue code (it is in the Lenis README, which was not fetched).

## 4. Material and lighting craft that reads as "real"

### Takeaway
The gap between "CSS fake" and "real render" is mostly lighting, not geometry. Real renders reflect an environment (HDRI or Lightformer softboxes) and are grounded by contact shadows and ambient occlusion. They mix roughness values, run through a proper tone mapper (Khronos PBR Neutral for true product colour, AgX or ACES for a filmic look), and look at the object through a long lens.

### Cited Findings
- **Lightformer studio:** `lusion-connectors` lights glossy objects almost entirely through a custom `Environment` made of four circular `Lightformer` softboxes. It adds N8AO ambient occlusion, a soft spotlight (`penumbra 1`) for cast shadows, a `fov 17.5` long lens and per-object roughness of 0.1 vs 0.75. — [lusion-connectors source](https://raw.githubusercontent.com/pmndrs/examples/main/examples/lusion-connectors/src/App.tsx) (verified, primary)
- **Contact shadows:** drei `ContactShadows` renders a soft shadow under objects (props: `opacity`, `blur`, `far`, `resolution`, `frames`, `scale`, `color`). It is "rather expensive", so use `frames={1}` for static scenes. Related staging helpers: `AccumulativeShadows`, `Environment`, `Lightformer`, `Float`, `Stage`, `RandomizedLight`, `Caustics`, `Backdrop`. — [drei ContactShadows](https://drei.docs.pmnd.rs/staging/contact-shadows) (verified, primary)
- **Glass:** `MeshTransmissionMaterial` extends `MeshPhysicalMaterial` with `thickness`, `distortion`, `chromaticAberration` and `anisotropicBlur`. Glass shows no refraction without environment lighting. — [Olivier Larose: 3D glass effect](https://blog.olivierlarose.com/tutorials/3d-glass-effect); [three.js forum: glass material](https://discourse.threejs.org/t/how-to-achieve-this-glass-material-with-a-rainbow-like-effect/49614) (via search summary)
- Codrops "Playing with Light and Refraction in Three.js: Warping 3D Text Inside a Glass Torus" (Matt Park, 2025-03-13) covers `MeshTransmissionMaterial` refraction. — [Codrops refraction tag](https://tympanus.net/codrops/tag/refraction/) (via search summary)
- **Tone mapping:** Khronos PBR Neutral is designed for true-to-life product colour (e-commerce/CAD). Three.js exposes it as `NeutralToneMapping`. AgX is less saturated than ACES Filmic by design, so it is not a drop-in replacement. Three.js ignores `renderer.toneMapping` when rendering to a render target, so a postprocessing chain needs an explicit ToneMapping or Output pass. — [Khronos press release](https://www.khronos.org/news/cn/khronos-pbr-3d); [three.js forum: Tone Mapping Overview](https://discourse.threejs.org/t/tone-mapping-overview/75204); [three.js forum: AgX](https://discourse.threejs.org/t/is-agx-tonemapping-implemented-correctly/60609); [three.js TSL ToneMappingFunctions source](https://app.unpkg.com/three@0.170.0/files/src/nodes/display/ToneMappingFunctions.js) (via search summary)
- **Effects used by the winners:** Igloo Inc used chromatic aberration on materials and transitions, and a frost effect. Bruno Simon uses depth of field and water blur on desktop and disables them on mobile. — [Igloo case study](https://awwwards.com/igloo-inc-case-study.html); [Bruno case study](https://www.awwwards.com/brunos-portfolio-case-study.html) (verified, primary)
- **Asset pipeline:** Draco geometry plus KTX2 (ETC1S/UASTC) textures (Bruno Simon), and Draco plus KTX2 with HDRI envmaps (Lando Norris, third-party). — [Bruno case study](https://www.awwwards.com/brunos-portfolio-case-study.html); [Dappasol](https://dappasol.com/guides/3d-website-examples/)

### Inferences
These are synthesis based on the cited techniques, not a single source.
- **What CSS gradients and shadows can't fake:**
  - Reflections that respond to object rotation, since environment reflections move across the surface as the tile turns.
  - Fresnel rim brightening at grazing angles.
  - Ambient occlusion in the gaps between tiles.
  - Shadows that change with tile height.
  - Refraction or blur of what is behind glass.
  - Physically consistent highlights across many objects at once.
- **App-icon tile recipe:**
  - Geometry: rounded-box geometry with generous bevel segments, so the bevel catches highlights.
  - Material: `meshPhysicalMaterial` with `clearcoat 1`, low `clearcoatRoughness` and base roughness around 0.2–0.4, or `MeshTransmissionMaterial` for "glass" variants.
  - Lighting: an `Environment` built from 3–4 rectangular `Lightformer`s (rectangles read as studio softboxes in the reflections) plus one rim Lightformer behind the cluster.
  - Grounding: `ContactShadows` or `AccumulativeShadows` with `frames={1}` beneath the cluster, and N8AO ambient occlusion.
  - Output: `NeutralToneMapping` for brand-accurate colours.
  - Finish: optional light film-grain and vignette in postprocessing.
- **Lower-cost CSS stopgap** (inference, no source): drive a radial-gradient specular highlight and a counter-moving shadow from pointer CSS custom properties, with layered translateZ parallax. This improves the fake but will never match environment reflections.

### Gaps
- I did not fetch primary docs for `AccumulativeShadows`, `Lightformer` props or `N8AO` parameters.
- I found no studio write-up quantifying grain or colour-grading settings on award sites.

## 5. Typography and UI polish that complements 3D

### Takeaway
Award sites pair 3D with kinetic, masked typography (SplitText line, word and char reveals inside overflow masks), scramble or glitch text, quickTo-driven custom cursors and magnetic links. The most advanced builds (Igloo Inc) move parts of the UI into WebGL so that text effects and transitions share the 3D look.

### Cited Findings
- **SplitText:** free since GSAP 3.13 and rewritten "from the ground up". — [Webflow blog](https://webflow.com/blog/gsap-becomes-free); [GSAP 3.13 notes](https://gsap.com/blog/3-13/)
- **Text with the camera:** the Codrops cinematic-scroll tutorial uses SplitText synced to a scroll-driven 3D camera timeline. — [Codrops 2025-11-19](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) (via search summary)
- **WebGL text:** Igloo Inc renders its UI in WebGL. Its text scramble shifts SDF texture offsets, and its glitch is a shader rather than CSS clipping. — [Igloo case study](https://awwwards.com/igloo-inc-case-study.html) (verified, primary)
- **Custom cursor:** `gsap.quickTo` with a power3 ease over 0.3 s. — [GreenSock CodePen](https://codepen.io/GreenSock/pen/dyjywaZ)
- **Magnetic links and buttons:** cursor-offset pull of about 0.3 with an elastic or expo snap-back. — [GreenSock CodePen: magnetic](https://codepen.io/GreenSock/pen/MWRPXMr); [Olivier Larose](https://blog.olivierlarose.com/tutorials/magnetic-button)
- **Rive for 2D motion:** the Lando Norris site pairs Rive (2D micro-motion, more than 200 Rive references) with Three.js for 3D. — [OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris) (Rive listed as a service); [Dappasol](https://dappasol.com/guides/3d-website-examples/) (third-party count)
- **MorphSVG:** used for shape morphs in Roman Jean-Elie's R3F portfolio. — [Codrops 2025-11-27](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) (via search summary)

### Inferences
- **Footer wordmark:** render it in 3D (drei `Text3D` or SDF `Text` inside a `View`) with the same Lightformer environment as the hero, so its highlights match the tiles. This makes the page feel like one lit world, the coherence Igloo achieved by moving its UI into WebGL.
- **Fallbacks:** honour `prefers-reduced-motion` by freezing physics and idle motion and swapping scrubbed camera moves for crossfades. Disable magnetic and cursor effects on touch, following the third-party guidance above.

### Gaps
- I did not fetch dedicated 2024–2026 sources on text-mask reveal techniques or WebGL text libraries (troika / drei `Text`).
