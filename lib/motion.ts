import { REDUCED } from "@/lib/gsap";

// Site-wide motion state.
// - Visitors can pause looping motion (WCAG 2.2.2); the choice is stored and mirrored as
//   <html data-motion="paused">, which CSS and the 3D scenes both read.
// - Real-time 3D only runs where it will run well.

export const MOTION_STORAGE_KEY = "motion";
export const MOTION_PAUSED = "paused";

export function isMotionPaused() {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === MOTION_PAUSED;
}

export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = MOTION_PAUSED;
  else delete root.dataset.motion;
  try {
    if (paused) localStorage.setItem(MOTION_STORAGE_KEY, MOTION_PAUSED);
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the choice then lasts for this visit only.
  }
}

const MIN_CORES = 4;
// WebGL drawn by the CPU (no usable GPU, or a headless browser): real-time 3D would stall the page.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render driver/i;

function rendererName(gl: WebGL2RenderingContext) {
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  return String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
}

/** Motion allowed, no data saver, a few CPU cores and hardware-accelerated WebGL2. */
export function canRun3D() {
  if (window.matchMedia(REDUCED).matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  if ((navigator.hardwareConcurrency ?? MIN_CORES) < MIN_CORES) return false;
  const probe = document.createElement("canvas").getContext("webgl2");
  if (!probe) return false;
  const software = SOFTWARE_RENDERER.test(rendererName(probe));
  probe.getExtension("WEBGL_lose_context")?.loseContext();
  return !software;
}
