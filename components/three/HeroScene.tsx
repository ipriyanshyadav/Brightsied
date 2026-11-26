"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { easing } from "maath";
import { STILL_POSE, type TileKind } from "@/components/ui/GlossyTile";
import { playPickup, playRelease, playTap } from "@/lib/sound";
import { DPR_LOW, EXPOSURE, FOV, GL_PROPS, MAX_DT, READY_FRAMES, Studio, Tile, initialDpr, useIdleClock } from "./shared";

export type HeroTile = { kind: TileKind; x: number; y: number; size: number; r: number; depth: number; glass?: boolean };

type Props = {
  tiles: HeroTile[];
  /** Layout size of the canvas box in CSS px (before any CSS scale on ancestors). */
  width: number;
  height: number;
  /** Called once the scene has drawn a few frames, so the page can cross-fade to it. */
  onReady: () => void;
  /** Called when the GL context is lost; the page then shows the stills again. */
  onFallback: () => void;
};

// Motion tuning, in CSS px and seconds. Springs pull each tile home; a moving cursor nudges
// them; tiles can be grabbed, thrown, and knock into each other and the edges.
const SPRING = 26;
const DAMPING = 6.5;
// A moving cursor brushes nearby tiles aside; a still one leaves them be, so they can be caught.
const KICK_RADIUS = 170;
const CURSOR_KICK = 5;
const POINTER_FADE = 10;
const BOB_PX = 8;
const PARALLAX_PX = { x: 16, y: 11 };
const TILT_MAX = 0.5;
// Grab and throw.
const HIT_SCALE = 0.55; // grab radius as a share of tile size
const COLLIDE_SCALE = 0.47; // collision radius as a share of tile size
const DRAG_FOLLOW = 22; // how tightly a held tile follows the pointer (1/s)
const MAX_THROW = 2600; // px/s
const FREE_TIME = 1.1; // s a thrown tile flies before springs start pulling it home
const RETURN_TIME = 1.2; // s for the home spring to reach full strength again
const FREE_DAMPING = 0.9; // air drag while flying
const RESTITUTION = 0.6;
const WALL_RESTITUTION = 0.5;
const LIFT_Z = 2; // world units a held tile rises toward the camera
const LIFT_SCALE = 0.08;
const LIFT_SMOOTH = 0.12;
const VEL_TILT = 0.0007; // rad per px/s
const VEL_TILT_MAX = 0.6;
const SPIN_FROM_THROW = 0.004;
const SPIN_FROM_HIT = 0.003;
const SPIN_MAX = 9;
const SPIN_SPRING = 30;
const SPIN_DAMP = 2.2;
// Collision sounds: impacts under TAP_MIN px/s are silent; TAP_FULL is full volume.
const TAP_MIN = 160;
const TAP_FULL = 1400;
// Cursor light: a small softbox that hovers in front of the tiles and follows the mouse.
const CURSOR_LIGHT_Z = 7;
const CURSOR_LIGHT_INTENSITY = 90;
const CURSOR_LIGHT_LAG = 0.18;
const CAMERA_Z = 40;

/** Pointer in canvas-centred layout px (y up), plus -1..1 normalised for parallax. */
type Pointer = { x: number; y: number; nx: number; ny: number; vx: number; vy: number; inside: boolean; t: number };

type Body = {
  pos: THREE.Vector2;
  vel: THREE.Vector2;
  phase: number;
  /** Seconds left flying free after a throw. */
  free: number;
  /** Home-spring strength 0..1. */
  home: number;
  lift: number;
  /** Extra spin about the view axis, from throws and knocks. */
  angle: number;
  spin: number;
  radius: number;
  invMass: number;
};

const makeBodies = (tiles: HeroTile[]): Body[] =>
  tiles.map((t, i) => ({
    pos: new THREE.Vector2(t.x, -t.y),
    vel: new THREE.Vector2(),
    phase: i * 0.9,
    free: 0,
    home: 1,
    lift: 0,
    angle: 0,
    spin: 0,
    radius: t.size * COLLIDE_SCALE,
    invMass: 1 / (t.size * t.size),
  }));

/** Front-most tile under a layout point, or -1. */
function hitTile(sim: Body[], tiles: HeroTile[], x: number, y: number) {
  let best = -1;
  let bestZ = -Infinity;
  sim.forEach((b, i) => {
    const z = tiles[i].depth + b.lift * LIFT_Z;
    if (Math.hypot(x - b.pos.x, y - b.pos.y) < tiles[i].size * HIT_SCALE && z > bestZ) {
      best = i;
      bestZ = z;
    }
  });
  return best;
}

type Grab = "hover" | "drag" | null;

function setGrab(state: Grab) {
  const root = document.documentElement;
  if (state) root.dataset.grab = state;
  else delete root.dataset.grab;
}

const clampAbs = (v: number, max: number) => THREE.MathUtils.clamp(v, -max, max);
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

type ClusterProps = {
  tiles: HeroTile[];
  width: number;
  height: number;
  box: React.RefObject<HTMLDivElement | null>;
  low: boolean;
  onReady: () => void;
};

function Cluster({ tiles, width, height, box, low, onReady }: ClusterProps) {
  const viewport = useThree((s) => s.viewport);
  const k = viewport.width / width; // world units per layout px
  const groups = useRef<(THREE.Group | null)[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const frames = useRef(0);
  const idle = useIdleClock();
  const pointer = useRef<Pointer>({ x: 0, y: 0, nx: 0, ny: 0, vx: 0, vy: 0, inside: false, t: 0 });
  const drag = useRef({ index: -1, offX: 0, offY: 0 });
  const grab = useRef<Grab>(null);
  // Simulation state, mutated every frame; created on first use.
  const bodies = useRef<Body[] | null>(null);

  // Pointer tracking, grabbing and throwing. The canvas has pointer-events: none so the
  // page underneath stays clickable; tiles are hit-tested here instead.
  useEffect(() => {
    const sim = (bodies.current ??= makeBodies(tiles));
    const root = document.documentElement;
    const toLayout = (clientX: number, clientY: number) => {
      const el = box.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const u = (clientX - r.left) / r.width;
      const v = (clientY - r.top) / r.height;
      return { x: (u - 0.5) * width, y: -(v - 0.5) * height, nx: u * 2 - 1, ny: -(v * 2 - 1) };
    };
    const hit = (x: number, y: number) => hitTile(sim, tiles, x, y);

    const onMove = (e: PointerEvent) => {
      const p = toLayout(e.clientX, e.clientY);
      if (!p) return;
      const ptr = pointer.current;
      const now = performance.now();
      const dt = Math.max((now - ptr.t) / 1000, 1 / 240);
      if (ptr.inside) {
        ptr.vx = (p.x - ptr.x) / dt;
        ptr.vy = (p.y - ptr.y) / dt;
      }
      ptr.x = p.x;
      ptr.y = p.y;
      ptr.nx = p.nx;
      ptr.ny = p.ny;
      ptr.t = now;
      ptr.inside = Math.abs(p.nx) <= 1.2 && Math.abs(p.ny) <= 1.2;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || drag.current.index >= 0) return;
      const p = toLayout(e.clientX, e.clientY);
      if (!p) return;
      const i = hit(p.x, p.y);
      if (i < 0) return;
      e.preventDefault(); // no text selection or focus change under the tile
      onMove(e);
      const b = sim[i];
      drag.current = { index: i, offX: b.pos.x - p.x, offY: b.pos.y - p.y };
      grab.current = "drag";
      setGrab("drag");
      playPickup();
    };
    const onUp = () => {
      const i = drag.current.index;
      if (i < 0) return;
      const b = sim[i];
      const speed = b.vel.length();
      if (speed > MAX_THROW) b.vel.multiplyScalar(MAX_THROW / speed);
      b.free = FREE_TIME;
      b.home = 0;
      b.spin = clampAbs(b.spin - b.vel.x * SPIN_FROM_THROW, SPIN_MAX);
      drag.current = { index: -1, offX: 0, offY: 0 };
      grab.current = null;
      setGrab(null);
      playRelease();
    };
    // On touch screens, a finger that lands on a tile drags it instead of scrolling the page.
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (e.touches.length !== 1 || !touch) return;
      const p = toLayout(touch.clientX, touch.clientY);
      if (drag.current.index >= 0 || (p && hit(p.x, p.y) >= 0)) e.preventDefault();
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("pointerleave", onLeave);
      setGrab(null);
    };
  }, [box, tiles, width, height]);

  useFrame((_, rawDelta) => {
    const sim = (bodies.current ??= makeBodies(tiles));
    const dt = Math.min(rawDelta, MAX_DT);
    const time = idle(dt);
    const ptr = pointer.current;
    const held = drag.current.index;
    // Cursor position for nudging; far away when outside the hero or holding a tile.
    const nudge = ptr.inside && held < 0;
    const cx = nudge ? ptr.x : 1e5;
    const cy = nudge ? ptr.y : 1e5;
    // Cursor velocity fades with time since the last move, so a still cursor stops kicking.
    const fade = Math.exp(-POINTER_FADE * Math.max(0, (performance.now() - ptr.t) / 1000));
    const pvx = ptr.vx * fade;
    const pvy = ptr.vy * fade;

    // 1. Forces and integration.
    tiles.forEach((t, i) => {
      const b = sim[i];
      if (i === held) {
        // Held tiles follow the pointer; their velocity is what a release throws with.
        const tx = ptr.x + drag.current.offX;
        const ty = ptr.y + drag.current.offY;
        b.vel.set((tx - b.pos.x) * DRAG_FOLLOW, (ty - b.pos.y) * DRAG_FOLLOW);
      } else {
        b.free = Math.max(0, b.free - dt);
        b.home = b.free > 0 ? 0 : Math.min(1, b.home + dt / RETURN_TIME);
        const homeX = t.x + ptr.nx * PARALLAX_PX.x * t.depth;
        const homeY = -t.y + Math.sin(time * 1.05 + b.phase) * BOB_PX - ptr.ny * PARALLAX_PX.y * t.depth;
        let ax = (homeX - b.pos.x) * SPRING * b.home;
        let ay = (homeY - b.pos.y) * SPRING * b.home;
        const dx = b.pos.x - cx;
        const dy = b.pos.y - cy;
        const dist = Math.hypot(dx, dy);
        const reach = KICK_RADIUS + t.size / 2;
        if (dist < reach) {
          const f = (1 - dist / reach) ** 2;
          ax += pvx * CURSOR_KICK * f;
          ay += pvy * CURSOR_KICK * f;
        }
        b.vel.x += ax * dt;
        b.vel.y += ay * dt;
        b.vel.multiplyScalar(Math.exp(-THREE.MathUtils.lerp(FREE_DAMPING, DAMPING, b.home) * dt));
        // Spin settles back to rest as the home spring returns.
        b.spin += -wrapAngle(b.angle) * SPIN_SPRING * b.home * dt;
      }
      b.spin *= Math.exp(-SPIN_DAMP * dt);
      b.angle += b.spin * dt;
      b.pos.addScaledVector(b.vel, dt);
    });

    // 2. Tile-on-tile collisions (circles; a held tile is immovable).
    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const a = sim[i];
        const c = sim[j];
        const ia = i === held ? 0 : a.invMass;
        const ic = j === held ? 0 : c.invMass;
        if (ia + ic === 0) continue;
        const nx = c.pos.x - a.pos.x;
        const ny = c.pos.y - a.pos.y;
        const dist = Math.hypot(nx, ny) || 0.001;
        const overlap = a.radius + c.radius - dist;
        if (overlap <= 0) continue;
        const ux = nx / dist;
        const uy = ny / dist;
        const share = overlap / (ia + ic);
        a.pos.x -= ux * share * ia;
        a.pos.y -= uy * share * ia;
        c.pos.x += ux * share * ic;
        c.pos.y += uy * share * ic;
        const vn = (c.vel.x - a.vel.x) * ux + (c.vel.y - a.vel.y) * uy;
        if (vn >= 0) continue;
        const impulse = (-(1 + RESTITUTION) * vn) / (ia + ic);
        a.vel.x -= impulse * ia * ux;
        a.vel.y -= impulse * ia * uy;
        c.vel.x += impulse * ic * ux;
        c.vel.y += impulse * ic * uy;
        // Glancing knocks set tiles spinning.
        const vt = (c.vel.x - a.vel.x) * -uy + (c.vel.y - a.vel.y) * ux;
        a.spin = clampAbs(a.spin + vt * SPIN_FROM_HIT * (ia > 0 ? 1 : 0), SPIN_MAX);
        c.spin = clampAbs(c.spin - vt * SPIN_FROM_HIT * (ic > 0 ? 1 : 0), SPIN_MAX);
        if (-vn > TAP_MIN) playTap(-vn / TAP_FULL);
      }
    }

    // 3. Walls: the part of the canvas box that is on screen.
    const el = box.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const sx = width / r.width;
      const left = (Math.max(r.left, 0) - r.left) * sx - width / 2;
      const right = (Math.min(r.right, window.innerWidth) - r.left) * sx - width / 2;
      const top = height / 2 - (Math.max(r.top, 0) - r.top) * sx;
      const bottom = height / 2 - (Math.min(r.bottom, window.innerHeight) - r.top) * sx;
      sim.forEach((b, i) => {
        if (i === held) return;
        const bounce = (axis: "x" | "y", min: number, max: number) => {
          if (min > max) return;
          const v = b.vel[axis];
          if (b.pos[axis] < min + b.radius && v < 0) {
            b.pos[axis] = min + b.radius;
            b.vel[axis] = -v * WALL_RESTITUTION;
            if (-v > TAP_MIN) playTap(-v / TAP_FULL);
          } else if (b.pos[axis] > max - b.radius && v > 0) {
            b.pos[axis] = max - b.radius;
            b.vel[axis] = -v * WALL_RESTITUTION;
            if (v > TAP_MIN) playTap(v / TAP_FULL);
          }
        };
        bounce("x", left, right);
        bounce("y", bottom, top);
      });
    }

    // Grab cursor over a tile, kept current as tiles move under a still pointer.
    if (held < 0) {
      const next: Grab = ptr.inside && hitTile(sim, tiles, ptr.x, ptr.y) >= 0 ? "hover" : null;
      if (next !== grab.current) {
        grab.current = next;
        setGrab(next);
      }
    }

    // 4. Draw.
    tiles.forEach((t, i) => {
      const g = groups.current[i];
      if (!g) return;
      const b = sim[i];
      easing.damp(b, "lift", i === held ? 1 : 0, LIFT_SMOOTH, dt);
      g.position.set(b.pos.x * k, b.pos.y * k, (t.depth - 1) * 0.6 + b.lift * LIFT_Z);
      g.scale.setScalar(t.size * k * (1 + b.lift * LIFT_SCALE));

      // At rest: face the cursor (or drift, resting in the stills' pose so the cross-fade
      // lines up). In motion: lean into the direction of travel.
      const look = i === held ? 0 : b.home;
      const lookX = ptr.inside ? (ptr.x - b.pos.x) / width : Math.sin(time * 0.4 + b.phase) * 0.15;
      const lookY = ptr.inside ? (ptr.y - b.pos.y) / width : Math.cos(time * 0.33 + b.phase) * 0.1;
      const restX = ptr.inside ? 0 : STILL_POSE[0];
      const restY = ptr.inside ? 0 : STILL_POSE[1];
      const rx = (THREE.MathUtils.clamp(-lookY * 2, -1, 1) * TILT_MAX * t.depth + restX) * look + clampAbs(-b.vel.y * VEL_TILT, VEL_TILT_MAX);
      const ry = (THREE.MathUtils.clamp(lookX * 2, -1, 1) * TILT_MAX * t.depth + restY) * look + clampAbs(b.vel.x * VEL_TILT, VEL_TILT_MAX);
      const rz = THREE.MathUtils.degToRad(-t.r) + Math.sin(time * 0.9 + b.phase) * 0.03 + b.angle;
      easing.dampE(g.rotation, [rx, ry, rz], 0.22, dt);
    });

    // The highlight follows the cursor; with no cursor it drifts slowly over the cluster.
    if (light.current) {
      const lx = ptr.inside ? ptr.x : Math.sin(time * 0.35) * width * 0.25;
      const ly = ptr.inside ? ptr.y : height * 0.15 + Math.cos(time * 0.27) * height * 0.08;
      easing.damp3(light.current.position, [lx * k, ly * k, CURSOR_LIGHT_Z], CURSOR_LIGHT_LAG, dt);
    }

    if (frames.current < READY_FRAMES && ++frames.current === READY_FRAMES) onReady();
  });

  return (
    <>
      <pointLight ref={light} intensity={CURSOR_LIGHT_INTENSITY} distance={0} decay={2} position={[0, 2, CURSOR_LIGHT_Z]} />
      {tiles.map((t, i) => (
        <group
          key={t.kind}
          ref={(el) => {
            groups.current[i] = el;
          }}
        >
          <Tile kind={t.kind} glass={t.glass} low={low} />
        </group>
      ))}
    </>
  );
}

export default function HeroScene({ tiles, width, height, onReady, onFallback }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Small screens show the box scaled down by CSS, so they need fewer pixels.
  const [dprMax] = useState(initialDpr);
  const [dpr, setDpr] = useState(dprMax);

  // Stop rendering entirely while the hero is off screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2 }}
    >
      <Canvas
        dpr={dpr}
        // Measure layout size, not the transformed size: the hero scales this box on small screens.
        resize={{ offsetSize: true }}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 1, far: 100 }}
        gl={GL_PROPS}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = EXPOSURE;
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onFallback();
          });
        }}
        style={{ pointerEvents: "none" }}
      >
        {/* Frame-rate dips lower the resolution and the glass quality. */}
        <PerformanceMonitor flipflops={3} onDecline={() => setDpr(DPR_LOW)} onIncline={() => setDpr(dprMax)} onFallback={() => setDpr(DPR_LOW)}>
          <Studio />
          <Cluster tiles={tiles} width={width} height={height} box={box} low={dpr === DPR_LOW} onReady={onReady} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
