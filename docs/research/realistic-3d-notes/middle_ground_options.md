# Middle-ground options for realistic 3D icon tiles (short of a full real-time 3D scene), 2025–2026

Context: Next.js 16 + React 19 + Tailwind v4 + GSAP + Lenis portfolio. The icon tiles are currently faked with CSS gradients, a box-shadow "extruded side", SVG glyphs and a pointer-driven CSS perspective tilt. Research date: 2026-11-26. Sources are dated where possible, and older material is flagged.

## 1. Pre-rendered 3D icons (Blender / Spline / C4D / AI tools), exported as stills, sprite sequences or alpha video

### Takeaway
Pre-rendering looks the most real for the money. Path-traced glass, gloss and soft shadows are baked into pixels, so the runtime only pays for decoding images or video. Interactivity is limited to the frames you rendered: a pointer- or scroll-scrubbed image sequence, or a transparent video. Transparent video on the web is still split by codec. Safari needs HEVC with alpha; Chrome and Firefox take VP9 WebM with alpha. Jake Archibald's "stacked alpha" AV1/HEVC plus WebGL approach is the smallest and most reliable option.

### Cited Findings
**Rendering workflow (Blender / C4D / Spline)**
- In Blender, Render Properties > Film has a "Transparent" checkbox that removes the background from the render. — [Tuts+ chrome text tutorial](https://design.tutsplus.com/tutorials/how-to-create-a-neotribal-3d-chrome-text-effect--cms-108949)
- An icon-render walkthrough suggests a square resolution around 800x800, a transparent alpha setting, and more samples to cut grain. (Sebastian Lague; undated, likely older.) — [rosetta.to / Sebastian Lague](https://rosetta.to/u/sebastianlague/rpg-graphics-e08-icons-blender)
- Polygon Runway has a Blender tutorial that models and renders a transparent icon, then adds the shadow in Figma. — [Class Central listing](https://classcentral.com/course/youtube-blender-transparent-icon-tutorial-polygon-runway-277507)
- A stylized Blender "glass" look can use a semi-transparent outer mesh for the gloss and an inner mesh to fake depth, with hand-painted matcaps. — [80.lv](https://80.lv/articles/see-how-this-sparkly-glass-like-apple-was-made-in-blender/)
- The glossy icon tutorials found were in Cinema 4D (parametric primitives, lighting, render). This is older material. — [Tuts+ C4D battery icon](https://design.tutsplus.com/tutorials/create-a-glossy-3d-smartphone-battery-icon-in-cinema-4d--cg-24275)
- Spline can export WebM, MP4, GIF and image sequences, as well as images and 3D formats. — [Spline FAQ](https://docs.spline.design/doc/faq/docJF3WvgXVz)
- On Spline's Free plan, exports carry the Spline logo. Starter removes the logo for web export. — [Spline FAQ](https://docs.spline.design/doc/faq/docJF3WvgXVz)
- Tuts+ (Aug 2024) calls exporting a Spline scene as a static image, video or image sequence "the best option" for removing performance problems, when the scene is simple enough. — [Tuts+ Spline optimisation](https://webdesign.tutsplus.com/how-to-optimize-spline-3d-scenes-for-speed-and-core-web-vitals--cms-108749a)

**AI-assisted 3D icon generators (vendor claims only, unverified)**
- Krea "3D Icons Generator": text prompt with adjustable style, colour, lighting and camera angle; transparent PNG export. — [Krea](https://www.krea.ai/nodes/app/PPdesigner/3d-icons-generator)
- Pixa 3D icon generator: PNG or JPG download with a transparent-background option. — [Pixa](https://www.pixa.com/create/3d-icon-generator)
- "AI 3D Icon Maker by KAppMaker" launched on Product Hunt on 24 July 2025: text to a 3D-style icon as a transparent PNG. — [Product Hunt](https://www.producthunt.com/products/ai-3d-icon-maker-by-kappmaker)
- RunComfy "3D Glossy Icon Generator": glossy dimensional icons from a prompt or image + prompt; free, no login. — [RunComfy](https://www.runcomfy.com/playground/c/3d-glossy-icon-generator)
- 3D AI Studio offers a 3D icon generator template. — [3daistudio](https://www.3daistudio.com/templates/app/3d-icon-generator)

**Scroll- or pointer-scrubbed image sequences (Apple AirPods technique)**
- The canonical CSS-Tricks tutorial ("Let's Make One of Those Fancy Scrolling Animations Used on Apple Product Pages", c. 2020, older) does this: a fixed `<canvas>`, scroll progress × frame count gives a frame index, and each frame is preloaded as an `Image` and painted with `drawImage` (not by swapping `src`). — [CSS-Tricks](https://css-tricks.com/?p=308477) ([mirror](https://multizone.cz/devfeed/let-s-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages-6b47c85d.html))
- Apple reportedly serves a single fallback image on constrained devices instead of the full sequence. — [setproduct.com](https://setproduct.com/blog/how-to-3d-animate-scroll)
- GSAP ScrollTrigger is the usual driver for the same effect, and there is a long GSAP forum thread on it. — [GSAP forum](https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/)
- A ready-made library exists: "Canvas Scroll Clip". — [CSScript](https://www.cssscript.com/image-sequence-animation-canvas-clip/)

**Transparent video (alpha)**
- Safari has supported HEVC with alpha since iOS 13 / macOS Catalina (WWDC 2019). — [Apple WWDC19 session 506](https://developer.apple.com/wwdc19/506)
- Jake Archibald (5 Aug 2024) measured file sizes for one demo clip. — [jakearchibald.com](https://jakearchibald.com/2024/video-with-transparency/)
  - VP9 alpha WebM (Chrome and Firefox, no JS needed): 1.1 MB
  - HEVC alpha MOV (Safari): 3.4 MB
  - Animated AVIF: 504 kB, but it struggles to hit 60 fps even on high-end laptops and runs at "a few fps" on Android. It plays through `<img>`, so it is choppy on slow networks, and Safari renders its transparency incorrectly and slowly.
  - Stacked-alpha AV1 MP4 (colour on top, greyscale alpha below, composited in a WebGL shader): 460 kB, of which the alpha half adds only about 8 kB.
  - Stacked-alpha HEVC fallback: 1.14 MB
- Archibald's recommendation is stacked alpha: AV1 with an HEVC fallback for Apple devices that lack AV1 hardware decode, rendered through his `<stacked-alpha-video>` web component on npm. Its internals are also exported for use without the component. — [jakearchibald.com](https://jakearchibald.com/2024/video-with-transparency/)
- Further pitfalls from the same article — [jakearchibald.com](https://jakearchibald.com/2024/video-with-transparency/):
  - Native HEVC-alpha encoding needs macOS.
  - Apple Compressor produces better HEVC alpha than ffmpeg's BGRA route, which comes out roughly 2× larger.
  - Limited-range (16–235) encoding causes banding in gradients; 10-bit encoding helps.
  - At the time, Chrome on Android got the alpha channel wrong (fixed in Canary).
  - Firefox on Android stalls.
- Rotato (updated 19 Aug 2026): Safari still does not support WebM alpha. Support is "coming" (they cite the Safari 27 beta and an open WebKit bug) but "it's going to take a while to land". Put the HEVC `<source type='video/mp4; codecs="hvc1"'>` first; 720p is "often big enough". Their commands are `ffmpeg -i movie-prores.mov -crf 30 -b:v 0 -c:v libvpx-vp9 out.webm`, plus an HEVC command. On Intel Macs, WebM encoding can take 10–15 minutes. — [Rotato](https://rotato.app/blog/transparent-videos-for-the-web)
  - Conflict: Archibald and others say stock libx265 / ffmpeg HEVC alpha is problematic, or that `hevc_videotoolbox` on macOS is needed. Rotato shows a libx265 `yuva420p` command. Test the output before relying on either. — [Rotato](https://rotato.app/blog/transparent-videos-for-the-web); [jakearchibald.com](https://jakearchibald.com/2024/video-with-transparency/)
- Safari shows a black background for WebM transparency (developer forum report). — [Babylon.js forum](https://forum.babylonjs.com/t/safari-hevc-h-265-video-with-transparency-has-black-background/47898)

### Inferences
- A portfolio tile grid can mix approaches. Use a static AVIF/WebP still per tile, rendered once in Blender Cycles with real glass and gloss, by default. On hover or pointer movement, scrub a short pre-rendered turntable (say ±20° yaw/pitch, about 12–24 frames) drawn to canvas, or swap to a stacked-alpha clip. That is a large jump in realism over CSS gradients, with no 3D runtime.
- Image sequences cost memory more than download size. Every decoded frame sits in RAM as a bitmap, so keep frame counts and pixel sizes modest per tile and decode lazily, only for visible tiles.
- Pointer-scrubbing a 2D grid of angles (yaw × pitch) multiplies frame count. One yaw axis plus a CSS tilt for pitch is a practical compromise.
- Treat AI icon generators as concept or placeholder sources. Style consistency across a set and licensing are both unverified.

### Gaps
- No 2025–2026 source gave measured memory or decode cost for multi-tile image sequences.
- No independent review of AI 3D icon generators' quality, licensing or consistency was found.
- The exact Safari version that ships WebM alpha was not confirmed from an Apple/WebKit primary source. Only Rotato's secondhand claim was found.
- `<stacked-alpha-video>` bundle size and current version were not checked.
- No 2025–2026 article was found specifically on Blender EEVEE versus Cycles for glossy UI icons.

## 2. Ready-made 3D icon packs and licensing for portfolio use

### Takeaway
3dicons.co and Spline community files are CC0, so they are free for commercial and personal use with no attribution. IconScout free 3D assets usually require attribution unless you pay, and they carry digital-only and no-logo limits. The packs save time, but they are recognisable stock and can make a portfolio look generic.

### Cited Findings
- 3dicons.co: "100% FREE for commercial and personal use under CC0"; "open source and free for both personal and commercial use under CC0". — [3dicons.co](https://3dicons.co); [3dicons.co/about](https://3dicons.co/about)
- The 3dicons author's announcement says CC0 covers personal and commercial projects, editing and redistribution. — [Blender Artists](https://blenderartists.org/t/3dicons-open-source-3d-icon-library/1333583)
- A community forum reply says the icons should not be resold on their own. This is not license text. — [itch.io post](https://itch.io/post/14969148)
- Spline: "All the community files are licensed under CC0 1.0 Universal Deed". Separately, "All 3D models in the library are free and can be used for commercial purposes". — [Spline docs: Community platform](https://docs.spline.design/doc/community-platform/docSaqY7mlFz); [Spline docs: 3D library](https://docs.spline.design/designing-in-3-d/3d-library)
- IconScout: free-plan users generally must give attribution for free assets; Premium removes that requirement. — [IconScout free 3D](https://iconscout.com/free-3ds)
- IconScout's Digital License covers commercial use online (websites, apps, social) but not physical products, print or apparel. Assets cannot be used in a trademark, business name or logo. — [IconScout license policy](https://help.iconscout.com/iconscout-digital-physical-license-policy)
- IconScout pricing and plans. — [IconScout pricing](https://iconscout.com/pricing)

### Inferences
- For a developer portfolio's tech-stack tiles (React, Python and so on), these packs mostly offer generic objects, not brand logos. Brand glyphs would still need to be modelled, for example in Blender from the official SVG via curve extrude and bevel, or in Spline.
- If you use packs, a CC0 source (3dicons, Spline community) is the cleanest legal option for a portfolio: no attribution bookkeeping.

### Gaps
- Figma 3D plugin licensing was not researched within the tool budget.
- Whether CC0 still applies to remixed Spline community scenes once exported, and whether Spline's general Terms add limits, is unclear. — [Spline terms](https://spline.design/terms)
- Trademark rules for rendering third-party brand logos (React, Docker and so on) in 3D were not researched.

## 3. True CSS 3D (preserve-3d boxes and slices) plus CSS/SVG fake lighting

### Takeaway
Real CSS 3D boxes (six faces, or stacked slices for a thickness illusion) give true parallax and occlusion when the tile tilts. Rounded bevelled edges cannot be made properly, since faces are flat rectangles, and Safari/WebKit flattens 3D whenever `overflow`, `filter` and similar grouping properties sit on a preserve-3d ancestor. SVG lighting filters (`feSpecularLighting` / `feDiffuseLighting`) can give glyphs a real bump-mapped specular highlight driven by a movable light source.

### Cited Findings
- In WebKit's 3D transform implementation, overflow necessarily triggers flattening, which turns off preserve-3d. — [WebKit Bug 164949](https://bugs.webkit.org/show_bug.cgi?id=164949)
- "You have to flatten in order to clip, so overflow: style overrides preserve-3d." — [WebKit Bug 86276](https://bugs.webkit.org/show_bug.cgi?id=86276)
- A WebKit bug proposes disabling preserve-3d for anything that forces flattening, such as overflow and filters. — [WebKit Bug 83337](https://bugs.webkit.org/show_bug.cgi?id=83337)
- In iOS Safari, `-webkit-overflow-scrolling: touch` breaks 3D and perspective effects. (Older bug.) — [WebKit bug list](https://bugs.webkit.org/show_bug.cgi?id=106841)
- A blog post (26 Apr 2026, single non-authoritative source) says a `drop-shadow` filter on a flip-card wrapper mirrored the front face. Its rule: keep filter, opacity, mask, clip-path and isolation off any element whose children must stay in 3D, and move them to the faces or to a wrapper outside the 3D context. — [kody-w blog](https://kody-w.github.io/2026/04/26/css-filter-flattens-3d/)
- The W3C "CSS Transform Spec Fixes" explainer (2019) covers how grouping properties force flattening. — [W3C explainer](https://lists.w3.org/Archives/Public/www-archive/2019Mar/att-0002/___CSS_Transform_Spec_Fixes____Explainer.html)
- MDN: `feSpecularLighting` lights an image using its alpha channel as a bump map, producing a glossy result. — [MDN feSpecularLighting](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpecularLighting)
- MDN Filter effects tutorial recipe: blur `SourceAlpha`, offset it, run `feSpecularLighting` with an `fePointLight`, then clip back to the shape with `feComposite`. — [MDN Filter effects tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects)
- W3C SVG 1.1 has a classic "3D lighting" filter example (filters01): blur + offset + specular + point light. — [W3C SVG 1.1 filters](https://www.w3.org/TR/SVG11/filters.html)
- CSS-Tricks covers the light sources (`fePointLight`, `feDistantLight`, `feSpotLight`) and animating them. — [CSS-Tricks](https://css-tricks.com/?p=182962)
- The main tuning knobs are `specularExponent` (highlight sharpness), `specularConstant` (intensity), `surfaceScale` (bump height) and light position. — [MDN feSpecularLighting](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpecularLighting)

### Inferences
- To get a convincing rounded extrusion in CSS, stack about 8–16 identical rounded-rect slices with `translateZ` steps and slightly darkening colours inside one preserve-3d parent. The silhouette then reads as thickness when tilted. Keep `border-radius` on each slice and not `overflow: hidden` on the parent, which WebKit would flatten. Expect the stepped edge to show at steep angles. (This is a pattern inference; no 2025–2026 source on the technique was found.)
- Moving an SVG `fePointLight`'s x/y from the same pointer handler that drives the tilt, so the specular hotspot tracks the cursor, is probably the cheapest single upgrade to the current setup. SVG filters on large areas can be expensive to repaint, so keep them on glyph-sized elements.
- `@property`-registered custom properties let the browser interpolate gradient angles and positions, for example a conic-gradient sheen angle tied to pointer position. The current CSS gradient approach can stay, with the sheen made to follow the light.

### Gaps
- No 2025–2026 CodePen or article specifically on rounded CSS 3D extrusion via slices was found.
- The current browser-support status of `@property` and `light-dark()` was not verified on caniuse within the tool budget. Check [caniuse.com](https://caniuse.com).
- No measured performance numbers were found for SVG lighting filters animated per frame.

## 4. Lightweight WebGL short of full Three.js (OGL, curtains.js, a single shader background, DOM glass and refraction)

### Takeaway
OGL is about 13–15 kB gzipped in a minimal benchmark, against about 115–170 kB for three.js. A single fragment-shader background (a Stripe-style gradient mesh or aurora) adds a lot of perceived depth and premium feel for little cost. curtains.js and gpu-curtains map DOM elements to WebGL planes for shader effects. "Liquid glass" refraction on DOM via SVG `feDisplacementMap` as a `backdrop-filter` works fully only in Chromium; other browsers degrade to blur.

### Cited Findings
- webgl-libs-comparison benchmark (gradient example): OGL about 44.5 kB (about 13.5 kB, probably gzipped) against three.js about 452 kB (about 115 kB). The column headers were not confirmed. — [awesome.ecosyste.ms / webgl-libs-comparison](https://awesome.ecosyste.ms/projects/github.com%2Fjsulpis%2Fwebgl-libs-comparison)
- LogRocket reports three.js v0.175.0 at about 168.4 kB minified + gzipped (Bundlephobia). — [LogRocket](https://blog.logrocket.com/?p=203792)
- A basic three.js scene in late 2025 (r181) came to about 117.8 kB gzipped; size varies by release. — [three.js forum](https://discourse.threejs.org/t/8kb-gzipped-size-increase-in-0-181-0-recommendation-on-tooling-to-analyze-package-size/87880)
- OGL is a "minimal WebGL library" with low abstraction, split into Math, Core and Extras. — [npm ogl](https://npmjs.com/ogl); [OGL GitHub](https://github.com/oframe/ogl)
- curtains.js is a small vanilla WebGL library that turns HTML elements containing images or videos into WebGL textured planes. Plane size and position come from CSS. — [npm curtainsjs](https://npmjs.com/package/curtainsjs); [curtainsjs.com](https://www.curtainsjs.com/)
- curtains.js documents a known small sync lag between planes and DOM elements while scrolling on mobile, with a GitHub discussion on fixing it. — [curtainsjs.com](https://www.curtainsjs.com/)
- gpu-curtains is the author's WebGPU successor, marked WIP, with classes for syncing 3D objects to DOM element scale and position. — [npm gpu-curtains](https://npmjs.com/package/gpu-curtains); [gpu-curtains DOM syncing docs](https://martinlaxenaire.github.io/gpu-curtains/docs/documents/Getting_started.DOM_syncing_usage.html)
- Stripe's gradient runs on a minimal WebGL wrapper, "minigl", plus a Gradient class. Kevin Hufnagl reverse-engineered it. (Bram.us, Oct 2021, older.) — [Bram.us](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect)
- Alex Harri's write-up explains a flowing WebGL gradient built from noise functions and time-based colour blending in a fragment shader (featured by Phaser news, May 2025). — [alexharri.com](https://alexharri.com/blog/webgl-gradients); [phaser.io](https://phaser.io/news/2025/05/a-flowing-webgl-gradient-deconstructed)
- Liquid glass: SVG `feDisplacementMap` used through `backdrop-filter: url(#…)` gives full refraction only in Chromium; Firefox and Safari fall back to blur. Displacement shifts pixels and does no real refraction. Edge refraction cannot extend past the element's border. — [LogRocket liquid glass](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/); [Medium/ekino](https://medium.com/ekino-france/liquid-glass-in-css-and-svg-839985fcb88d); [DEV: 6 ways](https://dev.to/devyatov/liquid-glass-on-the-web-6-ways-to-build-it-with-css-and-svg-3m07)
- A WebKit bug report (May 2026) concerns this technique not working in Safari. — [WebKit Bug 313914](https://bugs.webkit.org/show_bug.cgi?id=313914)

### Inferences
- A quick premium win is one full-bleed canvas behind the tiles, running a single fragment shader (noise gradient or aurora) through OGL or raw WebGL, at about 15 kB. Pair it with pre-rendered or CSS tiles. The tiles feel lit by and placed in a space without being real 3D.
- For "glass tile" refraction, a shader plane per tile (curtains.js / OGL) samples the background canvas texture and works in every browser. The SVG backdrop-filter route is Chromium-only.

### Gaps
- Current exact gzipped sizes for OGL, curtains.js and gpu-curtains (Bundlephobia) were not fetched.
- No 2025–2026 benchmark comparing per-tile WebGL planes against one shared canvas was found.

## 5. Spline embeds versus exported runtime

### Takeaway
Spline is the fastest way to get real-time glossy 3D, but the runtime is heavy. A 2024 test measured 1.9 MB uncompressed and 544 KB gzipped, with poor CPU and Lighthouse results even for simple scenes. Its exports are less optimised than hand-written Three.js. Spline is better used as an authoring tool that exports stills, video or image sequences than as a live runtime on a performance-sensitive portfolio.

### Cited Findings
- Tuts+ (1 Aug 2024): Spline's `runtime.js` was 1.9 MB uncompressed and 544 KB gzipped. Script execution reached "17.9 seconds on desktop" for a simple scene. Lighthouse "couldn't even calculate an overall performance score" because the canvas is excluded from LCP. CLS was 0.24 without fixed dimensions and 0 with a sized wrapper. — [Tuts+](https://webdesign.tutsplus.com/how-to-optimize-spline-3d-scenes-for-speed-and-core-web-vitals--cms-108749a)
- Tuts+ recommendations: use Spline's Export > Performance panel ("Run Test"), reduce polygons and objects, remove unused colour assets, self-host, use gzip or Brotli, and use static image or video exports where possible. — [Tuts+](https://webdesign.tutsplus.com/how-to-optimize-spline-3d-scenes-for-speed-and-core-web-vitals--cms-108749a)
- A Dec 2025 post says Spline exports are "not as optimized as handwritten Three.js" and that the runtime adds to the bundle. — [studiomeyer.io](https://studiomeyer.io/en/blog/3d-webdesign-webgl)
- The common React pattern lazy-loads the Spline scene to keep it out of the initial bundle. — [21st.dev](https://21st.dev/blog/spline-3d-scenes-react)

### Inferences
- Spline's runtime includes a three.js-class renderer plus Spline's own layer, so it costs more than adopting Three.js or R3F directly. The Tuts+ numbers support this.

### Gaps
- No 2025–2026 measurement of `@splinetool/runtime` / `@splinetool/react-spline` size was found. The 544 KB figure dates from 2024.

## 6. Rive and Lottie for "alive" glyph micro-animation

### Takeaway
Use Lottie for simple linear playback, such as a glyph that animates once on hover. Use Rive when the glyph needs interactive state (hover, press, pointer-follow) through state machines, and usually with smaller files. Both are 2D vector, so they add life, not 3D realism. Layer them on top of a pre-rendered or CSS 3D tile body.

### Cited Findings
- Rive (vendor) says its files are often 10–15× smaller than equivalent Lottie JSON: a 240 KB Lottie rebuilt at 16 KB, and a CARS24 case going from about 150 KB to 15 KB. — [Rive blog](https://rive.app/blog/rive-as-a-lottie-alternative)
- A Rive CEO example showed about 24 KB of Lottie becoming about 2 KB of Rive (cited by Callstack). — [Callstack](https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation)
- Counterpoint: Dub's Rive files grew to about 5 MB as animations became complex, and Dub moved to Lottie (LottieFiles case study, a vendor source). — [LottieFiles case study](https://lottiefiles.com/jp/case-studies/dub)
- Third-party views call Lottie lightweight and Rive "slightly heavier but optimized". Results depend on how the file is built. — [Motion the Agency](https://www.motiontheagency.com/blog/lottie-vs-rive); [DEV 2025](https://dev.to/uianimation/rive-vs-lottie-which-animation-tool-should-you-use-in-2025-p4m)
- Lottie JSON must be parsed at runtime. The `.lottie` format zips the JSON and its assets. — [DEV](https://dev.to/uianimation/rive-vs-lottie-for-saas-products-what-developers-should-know-7lj); [Rive blog](https://rive.app/blog/rive-as-a-lottie-alternative)
- LottieFiles' own comparison of the two tools. — [LottieFiles](https://lottiefiles.com/blog/working-with-lottie-animations/lottiefiles-or-rive)

### Inferences
- Rive's WASM runtime is a fixed cost paid once and shared by all instances, so it pays off only with several interactive glyphs.

### Gaps
- No primary measurement of Rive web runtime (WASM) or lottie-web / dotlottie-web bundle sizes was found within the tool budget.

## 7. Physics and feel without WebGL (GSAP quickTo / Inertia / Draggable, springs, magnetic, matter.js) and GSAP licensing

### Takeaway
GSAP has been 100% free, including all former Club plugins (InertiaPlugin, Draggable bonus features, SplitText, MorphSVG and so on), and covers commercial use since 3.13 (29 Apr 2025), after Webflow acquired it. The one licensing caveat concerns building competing visual animation tools, which does not affect a portfolio. Pointer tilt via `gsap.quickTo`, drag-and-throw via Draggable + InertiaPlugin, and velocity-linked skew are all available in the project's existing stack.

### Cited Findings
- GSAP 3.13 (29 Apr 2025): GSAP is "100% FREE", including all bonus plugins once exclusive to Club GSAP, "even for commercial use". The plugins are in the public npm package and GitHub repo. Club GSAP ended, with the private repo retired by 1 Jun 2025. SplitText was rewritten ("50% smaller, 14 new features"). GSAP can now animate to CSS variable values. — [GSAP 3.13 blog](https://gsap.com/blog/3-13/)
- Webflow: GSAP is free for everyone, Webflow customer or not, including the previously paid Club plugins. — [Webflow blog](https://webflow.com/blog/gsap-becomes-free)
- The standard license FAQ says all of GSAP, including formerly members-only plugins, can be used in commercial projects at no charge. The license restricts use in "Competitive Products", meaning visual animation-building tools similar to Webflow's. — [GSAP standard license](https://gsap.com/community/standard-license/)
- The `gsap-trial` package is deprecated; use `gsap`. — [npm gsap-trial](https://npmjs.com/package/gsap-trial)
- InertiaPlugin (formerly ThrowPropsPlugin) glides a property to a stop while honouring initial velocity. It is often used with Draggable but does not require it. Its API includes `track`, `untrack` and `getVelocity`. Note: the docs page found still carried "Club GSAP benefit" wording, which the 3.13 release supersedes. — [GSAP InertiaPlugin docs](https://gsap.com/docs/v3/Plugins/InertiaPlugin); [GSAP 3.13 blog](https://gsap.com/blog/3-13/)
- Draggable integrates with InertiaPlugin for flick-and-decelerate momentum via `inertia: true`. — [GSAP Draggable docs](https://gsap.com/docs/v3/Plugins/Draggable/)
- A GreenSock CodePen ties `gsap.quickTo(image, "skewX")` to `InertiaPlugin.track` velocity, so a dragged element skews with its speed. — [CodePen GreenSock](https://codepen.io/GreenSock/pen/NWXMzXN)
- A concern raised on the Pinegrow forum (vendor opinion) is that the Competitive Products clause creates uncertainty for visual-builder tools. This is not relevant to a portfolio. — [Pinegrow forum](https://forum.pinegrow.com/t/gsap-has-been-acquired-by-webflow/9906)

### Inferences
- The feel that reads as "a real object" comes largely from motion: inertia on release, slight overshoot, and velocity-linked skew or rotation. Per-tile `quickTo` setters for `rotationX`, `rotationY` and the light position, plus Draggable + Inertia for throwing tiles, add that physicality for no extra dependency, since GSAP is already in the project.
- Adding Motion (framer-motion) springs alongside GSAP would duplicate animation libraries, which conflicts with the project's one-tool-per-job rule (AI-29). Stay with GSAP.

### Gaps
- matter.js + DOM sync for tile physics was not researched within the tool budget (no sources gathered).
- The current GSAP version (post-3.13) and the official `quickTo` reference page were not fetched.
- Motion spring API specifics were not researched (intentionally deprioritised; see the inference above).
