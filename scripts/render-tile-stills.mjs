// Renders the 3D tiles to transparent PNG stills in public/tiles, using the dev-only page
// src/app/dev/tile-stills and headless Chrome. The stills are what visitors see before the
// live 3D loads (and instead of it on reduced-motion or low-power devices).
//
//   npm run dev                # in another terminal
//   npm run tiles:render
//
// Environment overrides:
//   TILES_BASE_URL  dev server URL                (default http://localhost:3000)
//   CHROME_PATH     Chrome/Chromium executable    (default: macOS Google Chrome)
//   TILES_KINDS     comma-separated subset        (default: every still below)

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const BASE_URL = process.env.TILES_BASE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// "<kind>-glass" renders the clear glass version of a tile (used for the hero's glass tile).
const ALL_KINDS = ["docs", "vectors", "agents", "queue", "audit", "api", "terminal", "db", "vectors-glass"];
const KINDS = process.env.TILES_KINDS ? process.env.TILES_KINDS.split(",") : ALL_KINDS;
// Must match STILL_PX in src/components/ui/GlossyTile.tsx.
const SIZE = 768;
const OUT_DIR = join(process.cwd(), "public", "tiles");
const READY_TIMEOUT_MS = 30000;
const POLL_MS = 200;
const EXIT_TIMEOUT_MS = 5000;
const PORT = 9400 + Math.floor(Math.random() * 400);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "tile-stills-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    `--window-size=${SIZE},${SIZE}`,
    "--hide-scrollbars",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function connect() {
  for (let i = 0; i < 50; i++) {
    await wait(POLL_MS);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting; try again.
    }
  }
  throw new Error(`Chrome did not start (CHROME_PATH=${CHROME})`);
}

async function main() {
  const ws = new WebSocket(await connect());
  await new Promise((r) => ws.addEventListener("open", r));
  let seq = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });

  for (const kind of KINDS) {
    const [base, variant] = kind.split("-");
    const query = variant === "glass" ? `kind=${base}&glass=1` : `kind=${base}`;
    await send("Page.navigate", { url: `${BASE_URL}/dev/tile-stills?${query}` });
    const started = Date.now();
    let ready = false;
    while (!ready) {
      if (Date.now() - started > READY_TIMEOUT_MS) throw new Error(`Timed out rendering "${kind}"`);
      await wait(POLL_MS);
      const res = await send("Runtime.evaluate", { expression: "document.body?.dataset.stillReady === '1'", returnByValue: true });
      ready = res.result.value === true;
    }
    const { data } = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
    const file = join(OUT_DIR, `${kind}.png`);
    const info = await sharp(Buffer.from(data, "base64")).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(file);
    console.log(`${kind}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB -> ${file}`);
  }
  ws.close();
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Let Chrome finish writing its profile before deleting it.
    const exited = new Promise((r) => chrome.once("exit", r));
    chrome.kill();
    await Promise.race([exited, wait(EXIT_TIMEOUT_MS)]);
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: POLL_MS });
  });
