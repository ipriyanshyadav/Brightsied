"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import { easing } from "maath";
import { palettes, STILL_POSE, type TileKind } from "@/components/ui/GlossyTile";
import { FOV, MAX_DT, Studio, Tile, cameraDistance, useIdleClock } from "./shared";
import { pointer } from "./pointer";

// One live tile, drawn by the shared LiveLayer canvas into this element's rectangle.
// It rests in the same pose as its still, turns toward a nearby cursor, lifts on approach,
// and carries a small light that follows the cursor across its face.

/** The tracked box extends past the tile on every side so rotation never clips. */
const MARGIN = 0.3;
/** Share of the tracked box the tile fills, which makes the tile match its poster size. */
const VIEW_FILL = 1 / (1 + 2 * MARGIN);
/** How far from the tile (in tile widths) the cursor starts to attract it. */
const REACH = 1.6;
const TILT = 0.55;
const LIFT = 0.35;
const LIGHT_Z = 1.5;
const LIGHT_INTENSITY = 4;
const SMOOTH = 0.25;

const kinds = Object.keys(palettes);

function Spinner({ kind, rotate, track }: { kind: TileKind; rotate: number; track: React.RefObject<HTMLElement | THREE.Group | null> }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const idle = useIdleClock();
  const phase = useMemo(() => kinds.indexOf(kind) * 1.3, [kind]);
  const baseZ = THREE.MathUtils.degToRad(-rotate);

  useFrame((_, raw) => {
    const dt = Math.min(raw, MAX_DT);
    const t = idle(dt);
    const el = track.current;
    const g = group.current;
    if (!(el instanceof HTMLElement) || !g) return;

    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const tileW = r.width * VIEW_FILL;
    const dx = (pointer.x - cx) / (tileW * REACH);
    const dy = (pointer.y - cy) / (tileW * REACH);
    const near = pointer.active && Math.hypot(dx, dy) < 1;

    const rx = near ? THREE.MathUtils.clamp(dy, -1, 1) * TILT : STILL_POSE[0] + Math.cos(t * 0.5 + phase) * 0.08;
    const ry = near ? THREE.MathUtils.clamp(dx, -1, 1) * TILT : STILL_POSE[1] + Math.sin(t * 0.6 + phase) * 0.2;
    const rz = baseZ + Math.sin(t * 0.8 + phase) * 0.03;
    easing.dampE(g.rotation, [rx, ry, rz], SMOOTH, dt);
    easing.damp(g.position, "z", near ? LIFT : 0, SMOOTH, dt);
    g.position.y = Math.sin(t * 1.1 + phase) * 0.02;

    if (light.current) {
      // World units per px: the view shows 1 / VIEW_FILL units across its height.
      const k = 1 / VIEW_FILL / r.height;
      const target: [number, number, number] = near ? [(pointer.x - cx) * k, -(pointer.y - cy) * k, LIGHT_Z] : [-0.45, 0.55, LIGHT_Z];
      easing.damp3(light.current.position, target, SMOOTH, dt);
    }
  });

  return (
    <>
      <pointLight ref={light} intensity={LIGHT_INTENSITY} distance={0} decay={2} position={[-0.45, 0.55, LIGHT_Z]} />
      <group ref={group}>
        <Tile kind={kind} />
      </group>
    </>
  );
}

export default function LiveView({ kind, rotate }: { kind: TileKind; rotate: number }) {
  const track = useRef<HTMLElement | THREE.Group>(null);
  const inset = `-${MARGIN * 100}%`;
  return (
    <View ref={track} className="pointer-events-none absolute" style={{ inset }}>
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 0, cameraDistance(VIEW_FILL)]} near={0.1} far={50} />
      <Studio />
      <Spinner kind={kind} rotate={rotate} track={track} />
    </View>
  );
}
