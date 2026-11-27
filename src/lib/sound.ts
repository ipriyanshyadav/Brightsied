// Optional interface sounds, off until the visitor turns them on (SoundToggle). Every sound
// is synthesised with Web Audio, so there are no files to download. The choice is stored and
// mirrored as <html data-sound="on">.

export const SOUND_STORAGE_KEY = "sound";
export const SOUND_ON = "on";
export const SOUND_CHANGE_EVENT = "soundchange";

const MASTER_GAIN = 0.22;
/** Collision taps closer together than this are dropped, so a pile-up doesn't rattle. */
const MIN_TAP_GAP_S = 0.05;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lastTap = 0;

export function isSoundOn() {
  return typeof document !== "undefined" && document.documentElement.dataset.sound === SOUND_ON;
}

export function setSoundOn(on: boolean) {
  const root = document.documentElement;
  if (on) root.dataset.sound = SOUND_ON;
  else delete root.dataset.sound;
  try {
    if (on) localStorage.setItem(SOUND_STORAGE_KEY, SOUND_ON);
    else localStorage.removeItem(SOUND_STORAGE_KEY);
  } catch {
    // Storage unavailable: the choice lasts for this visit only.
  }
  window.dispatchEvent(new Event(SOUND_CHANGE_EVENT));
}

/** The audio graph, created on first use. Browsers only start it inside a user gesture. */
function audio() {
  if (!isSoundOn()) return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return master ? { ctx, out: master } : null;
}

/** A pitched blip with a fast attack and exponential decay. */
function blip(freq: number, endFreq: number, duration: number, gain: number, type: OscillatorType = "sine") {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const osc = a.ctx.createOscillator();
  const env = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(env).connect(a.out);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

/** Buttons and tabs: a short, soft click. */
export function playClick() {
  blip(1800, 900, 0.05, 0.5, "triangle");
}

/** A tile picked up in the hero. */
export function playPickup() {
  blip(420, 760, 0.12, 0.45);
}

/** A tile let go (thrown or dropped). */
export function playRelease() {
  blip(620, 300, 0.14, 0.35);
}

/** Two tiles (or a tile and the edge) knocking together; strength 0..1. */
export function playTap(strength: number) {
  const a = audio();
  if (!a || a.ctx.currentTime - lastTap < MIN_TAP_GAP_S) return;
  lastTap = a.ctx.currentTime;
  const s = Math.min(1, Math.max(0.05, strength));
  // Plastic-on-plastic: a pitched body plus a click of filtered noise.
  blip(260 + s * 220, 140, 0.09, 0.6 * s);
  const t = a.ctx.currentTime;
  const len = Math.floor(a.ctx.sampleRate * 0.03);
  const buf = a.ctx.createBuffer(1, len, a.ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = a.ctx.createBufferSource();
  const band = a.ctx.createBiquadFilter();
  const env = a.ctx.createGain();
  src.buffer = buf;
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 1.2;
  env.gain.value = 0.5 * s;
  src.connect(band).connect(env).connect(a.out);
  src.start(t);
}
